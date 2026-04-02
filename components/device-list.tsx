"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Smartphone, Plus, Trash2, AlertTriangle, RotateCcw, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { deleteDevice, updateDeviceSettings } from "@/lib/actions/device";
import { AddDeviceWizard } from "@/components/add-device-wizard";
import { ResetWizard } from "@/components/reset-wizard";
import { DashboardFaq } from "@/components/dashboard-faq";

interface Device {
  id: string;
  name: string;
  wordsRequired: number;
  icloudAccount: string;
  unlockedAt: Date | null;
  autoUnlockAt: Date | null;
  createdAt: Date;
}

const AUTO_UNLOCK_OPTIONS = [7, 14, 30, 60, 90];

function estimateMinutes(words: number): number {
  return Math.round(words / 20);
}

function DeviceSettings({ device, onClose }: { device: Device; onClose: () => void }) {
  const isExposed = !!device.unlockedAt;
  const [wordsRequired, setWordsRequired] = useState(device.wordsRequired);
  const [autoUnlockEnabled, setAutoUnlockEnabled] = useState(!!device.autoUnlockAt);
  const [autoUnlockDays, setAutoUnlockDays] = useState(30);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      const res = await updateDeviceSettings(
        device.id,
        wordsRequired,
        autoUnlockEnabled ? autoUnlockDays : null
      );
      if (res.success) {
        setSaved(true);
        setTimeout(() => onClose(), 800);
      }
    });
  }

  return (
    <div className="border border-border p-6 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

      <div className="flex items-center gap-3 mb-5">
        <Settings className="h-4 w-4 text-primary" />
        <span className="text-xs tracking-[0.25em] uppercase text-primary">
          Settings — {device.name}
        </span>
      </div>

      <div className="space-y-5">
        {/* Word count slider */}
        <div className="space-y-3">
          <Label className="text-xs tracking-widest uppercase">Words to unlock</Label>
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-3xl">{wordsRequired}</span>
            <span className="text-xs text-muted-foreground">~{estimateMinutes(wordsRequired)} min</span>
          </div>
          <Slider
            value={[wordsRequired]}
            onValueChange={(v) => {
              const n = Array.isArray(v) ? v[0] : v;
              // Locked devices can only increase word count
              if (!isExposed && n < device.wordsRequired) return;
              setWordsRequired(n);
            }}
            min={isExposed ? 100 : device.wordsRequired}
            max={1000}
            step={50}
          />
        </div>

        {/* Auto-unlock toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={`auto-${device.id}`} className="text-xs tracking-widest uppercase cursor-pointer">
              {isExposed ? "Set new auto-unlock timer" : "Auto-unlock timer"}
            </Label>
            <Switch
              id={`auto-${device.id}`}
              checked={autoUnlockEnabled}
              onCheckedChange={setAutoUnlockEnabled}
              disabled={!isExposed && !!device.autoUnlockAt}
            />
          </div>

          {autoUnlockEnabled && (() => {
            // For locked devices with existing timer, find the closest
            // matching option and only allow strictly higher values
            const existingDaysLeft = !isExposed && device.autoUnlockAt
              ? Math.ceil((new Date(device.autoUnlockAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
              : 0;
            // Find the smallest option that covers the remaining days
            const currentOption = AUTO_UNLOCK_OPTIONS.find(o => o >= existingDaysLeft) ?? 0;

            return (
              <div className="flex gap-2">
                {AUTO_UNLOCK_OPTIONS.map((d) => {
                  const disabled = !isExposed && d <= currentOption;
                  return (
                    <button
                      key={d}
                      onClick={() => !disabled && setAutoUnlockDays(d)}
                      disabled={disabled}
                      className={`flex-1 border p-2 text-center text-xs transition-colors ${
                        autoUnlockDays === d
                          ? "border-primary bg-primary/10 text-foreground"
                          : disabled
                          ? "border-border bg-card text-muted-foreground/30 cursor-not-allowed"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {d}d
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || saved}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            {saved ? (
              <>Saved <Check className="h-3 w-3 ml-2" /></>
            ) : isPending ? (
              "Saving..."
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DeviceList({ devices, header }: { devices: Device[]; header?: React.ReactNode }) {
  const [showWizard, setShowWizard] = useState(false);
  const [resettingDevice, setResettingDevice] = useState<Device | null>(null);
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(deviceId: string, deviceName: string) {
    const confirmed = window.confirm(
      `Delete "${deviceName}"? Your encrypted passcode will be permanently lost.`
    );
    if (!confirmed) return;

    setDeleting(deviceId);
    try {
      await deleteDevice(deviceId);
    } finally {
      setDeleting(null);
    }
  }

  if (showWizard) {
    return <AddDeviceWizard onClose={() => setShowWizard(false)} />;
  }

  if (resettingDevice) {
    return (
      <ResetWizard
        deviceId={resettingDevice.id}
        deviceName={resettingDevice.name}
        onClose={() => setResettingDevice(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <Button
        onClick={() => setShowWizard(true)}
        className="rounded-none px-7 py-5 text-xs tracking-[0.2em] uppercase font-semibold"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Device
      </Button>

      {devices.length === 0 ? (
        <div className="border border-border p-8 bg-card max-w-md relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-border" />
          <p className="font-heading text-3xl tracking-wider uppercase text-muted-foreground">
            No devices yet
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Add a device to lock your Screen Time password.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => {
            const isUnlocked = !!device.unlockedAt;

            if (editingDevice === device.id) {
              return (
                <DeviceSettings
                  key={device.id}
                  device={device}
                  onClose={() => setEditingDevice(null)}
                />
              );
            }

            return (
              <div
                key={device.id}
                className={`border p-6 bg-card relative group ${
                  isUnlocked ? "border-destructive/50" : "border-border"
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isUnlocked ? "bg-destructive" : "bg-primary"
                }`} />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {isUnlocked ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Smartphone className="h-4 w-4 text-primary" />
                    )}
                    <span className={`text-xs tracking-widest uppercase ${
                      isUnlocked ? "text-destructive" : "text-muted-foreground"
                    }`}>
                      {isUnlocked ? "Passcode Exposed" : "Device"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingDevice(device.id)}
                      className="text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(device.id, device.name)}
                      disabled={deleting === device.id}
                      className="text-muted-foreground/40 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-heading text-2xl tracking-wider uppercase mb-1">
                  {device.name}
                </h3>

                <p className="text-xs text-muted-foreground mb-6">
                  {device.wordsRequired} words to unlock
                  {device.autoUnlockAt && (
                    <> · auto-unlocks {new Date(device.autoUnlockAt).toLocaleDateString()}</>
                  )}
                </p>

                <div className="flex items-center gap-5">
                  <Link
                    href={`/dashboard/unlock/${device.id}`}
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-foreground hover:text-primary transition-colors"
                  >
                    Unlock Passcode →
                  </Link>
                  {isUnlocked && (
                    <button
                      onClick={() => setResettingDevice(device)}
                      className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-destructive hover:text-foreground transition-colors"
                    >
                      Reset Passcode →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DashboardFaq devices={devices.map(d => ({ id: d.id, name: d.name }))} />
    </div>
  );
}
