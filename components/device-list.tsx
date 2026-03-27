"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteDevice } from "@/lib/actions/device";
import { AddDeviceWizard } from "@/components/add-device-wizard";

interface Device {
  id: string;
  name: string;
  wordsRequired: number;
  icloudAccount: string;
  createdAt: Date;
}

export function DeviceList({ devices }: { devices: Device[] }) {
  const [showWizard, setShowWizard] = useState(false);
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
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-border p-6 bg-card relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-xs tracking-widest uppercase text-muted-foreground">
                    Device
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

              <Link
                href={`/dashboard/unlock/${device.id}`}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary hover:text-foreground transition-colors"
              >
                Unlock Passcode →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
