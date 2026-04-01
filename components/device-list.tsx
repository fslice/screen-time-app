"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone, Plus, Trash2, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDevice } from "@/lib/actions/device";
import { AddDeviceWizard } from "@/components/add-device-wizard";
import { ResetWizard } from "@/components/reset-wizard";

interface Device {
  id: string;
  name: string;
  wordsRequired: number;
  icloudAccount: string;
  unlockedAt: Date | null;
  createdAt: Date;
}

export function DeviceList({ devices }: { devices: Device[] }) {
  const [showWizard, setShowWizard] = useState(false);
  const [resettingDevice, setResettingDevice] = useState<Device | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(deviceId: string) {
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
                  <button
                    onClick={() => handleDelete(device.id)}
                    disabled={deleting === device.id}
                    className="text-muted-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h3 className="font-heading text-2xl tracking-wider uppercase mb-1">
                  {device.name}
                </h3>

                <p className="text-xs text-muted-foreground mb-6">
                  {device.wordsRequired} words to unlock
                </p>

                {isUnlocked ? (
                  <button
                    onClick={() => setResettingDevice(device)}
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-destructive hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset Passcode →
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/unlock/${device.id}`}
                    className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors"
                  >
                    Unlock Passcode →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
