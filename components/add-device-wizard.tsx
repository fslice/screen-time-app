"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { createDevice } from "@/lib/actions/device";
import { ArrowRight, ArrowLeft, Check, Lock, Smartphone, Timer } from "lucide-react";
import { SetupSlider } from "@/components/setup-slider";
import { PasscodeEntry } from "@/components/passcode-entry";
import type { PasscodeOperation } from "@/lib/passcode";

type Step = "name" | "setup" | "words" | "passcode" | "icloud" | "done";

interface SetupResult {
  deviceId: string;
  sequences: {
    enter: PasscodeOperation[];
    confirm: PasscodeOperation[];
  };
  icloudAccount: { email: string; label: string };
}

const AUTO_UNLOCK_OPTIONS = [7, 14, 30, 60, 90];

function estimateMinutes(words: number): number {
  return Math.round(words / 20);
}

export function AddDeviceWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("name");
  const [deviceName, setDeviceName] = useState("");
  const [wordsRequired, setWordsRequired] = useState(200);
  const [autoUnlockEnabled, setAutoUnlockEnabled] = useState(false);
  const [autoUnlockDays, setAutoUnlockDays] = useState(30);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await createDevice(
        deviceName,
        wordsRequired,
        autoUnlockEnabled ? autoUnlockDays : null
      );
      if ("error" in res) {
        setErrorMsg(res.error ?? "Unknown error");
        return;
      }
      setResult(res);
      setStep("passcode");
    });
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {(["name", "setup", "words", "passcode", "icloud", "done"] as Step[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div className="h-px w-6 bg-border" />
              )}
              <div
                className={`h-2 w-2 rounded-full ${
                  s === step
                    ? "bg-primary"
                    : (["name", "setup", "words", "passcode", "icloud", "done"].indexOf(s) <
                      ["name", "setup", "words", "passcode", "icloud", "done"].indexOf(step))
                    ? "bg-primary/40"
                    : "bg-border"
                }`}
              />
            </div>
          )
        )}
      </div>

      {/* Step: Name */}
      {step === "name" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Step 1
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Name Your Device
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Give it a name you&apos;ll recognize.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-name" className="text-xs tracking-widest uppercase">
              Device Name
            </Label>
            <Input
              id="device-name"
              placeholder='e.g. "iPhone 15" or "iPad Pro"'
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="rounded-none bg-card border-border"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setStep("setup")}
              disabled={!deviceName.trim()}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              Next <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Setup guide slider */}
      {step === "setup" && (
        <SetupSlider
          deviceName={deviceName}
          onComplete={() => setStep("words")}
          onBack={() => setStep("name")}
        />
      )}

      {/* Step: Words + Generate */}
      {step === "words" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Almost There
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Choose Your Friction
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              How many words should you have to type before unlocking your Screen Time passcode?
            </p>
          </div>

          {/* Word count slider */}
          <div className="space-y-4">
            <Label className="text-xs tracking-widest uppercase">
              Words to unlock
            </Label>
            <div className="border border-border p-6 bg-card space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-heading text-5xl text-foreground">
                  {wordsRequired}
                </span>
                <span className="text-sm text-muted-foreground">
                  ~{estimateMinutes(wordsRequired)} min
                </span>
              </div>
              <Slider
                value={[wordsRequired]}
                onValueChange={(v) => setWordsRequired(Array.isArray(v) ? v[0] : v)}
                min={100}
                max={1000}
                step={50}
              />
              <div className="flex justify-between text-[10px] tracking-widest uppercase text-muted-foreground">
                <span>100</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* Auto-unlock toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="auto-unlock" className="text-xs tracking-widest uppercase cursor-pointer">
                  Auto-unlock after a set time
                </Label>
              </div>
              <Switch
                id="auto-unlock"
                checked={autoUnlockEnabled}
                onCheckedChange={setAutoUnlockEnabled}
              />
            </div>

            {autoUnlockEnabled && (
              <div className="border border-border p-6 bg-card space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-4xl text-foreground">
                    {autoUnlockDays}
                  </span>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <div className="flex gap-2">
                  {AUTO_UNLOCK_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setAutoUnlockDays(d)}
                      className={`flex-1 border p-2 text-center text-xs transition-colors ${
                        autoUnlockDays === d
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  After {autoUnlockDays} days, the typing challenge will be skipped automatically.
                </p>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="border border-destructive bg-destructive/10 p-4">
              <p className="text-xs text-destructive">{errorMsg}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("setup")}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              <ArrowLeft className="h-3 w-3 mr-2" /> Back
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isPending}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              {isPending ? "Generating..." : "Generate Passcode"}
              {!isPending && <ArrowRight className="h-3 w-3 ml-2" />}
            </Button>
          </div>
        </div>
      )}

      {/* Step: Passcode guided entry */}
      {step === "passcode" && result && (
        <PasscodeEntry
          deviceName={deviceName}
          enterOps={result.sequences.enter}
          confirmOps={result.sequences.confirm}
          onComplete={() => setStep("icloud")}
        />
      )}

      {/* Step: iCloud Account */}
      {step === "icloud" && result && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Step 4
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Recovery Account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add this iCloud account to your device so Screen Time recovery goes through Latch, not your personal iCloud.
            </p>
          </div>

          <div className="border border-border p-6 bg-card">
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
              iCloud Account
            </span>
            <p className="font-heading text-2xl tracking-wider mt-2">
              {result.icloudAccount.email}
            </p>
          </div>

          <div className="border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs text-primary">
              Go to Settings → Screen Time → Change Screen Time Passcode → select &ldquo;Use Apple ID to reset&rdquo; and enter this account. This prevents you from resetting via your own Apple ID.
            </p>
          </div>

          <Button
            onClick={() => setStep("done")}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Done <Check className="h-3 w-3 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Complete
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              You&apos;re Locked In
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your Screen Time passcode is now locked behind {wordsRequired} words.
              To retrieve it, you&apos;ll need to type every single one.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
