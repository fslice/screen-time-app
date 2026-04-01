"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PasscodeEntry } from "@/components/passcode-entry";
import { getCurrentPasscode, resetDevice } from "@/lib/actions/device";
import { ArrowRight, ArrowLeft, Check, RotateCcw } from "lucide-react";
import type { PasscodeOperation } from "@/lib/passcode";

type Step = "current" | "passcode" | "done";

export function ResetWizard({
  deviceId,
  deviceName,
  onClose,
}: {
  deviceId: string;
  deviceName: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("current");
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [sequences, setSequences] = useState<{
    enter: PasscodeOperation[];
    confirm: PasscodeOperation[];
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load current passcode on mount
  useEffect(() => {
    startTransition(async () => {
      try {
        const passcode = await getCurrentPasscode(deviceId);
        setCurrentPasscode(passcode);
      } catch {
        setErrorMsg("Failed to retrieve current passcode");
      }
    });
  }, [deviceId]);

  function handleReset() {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await resetDevice(deviceId);
      if ("error" in res && res.error) {
        setErrorMsg(res.error);
        return;
      }
      if (res.sequences) {
        setSequences(res.sequences);
        setStep("passcode");
      }
    });
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {(["current", "passcode", "done"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            {i > 0 && <div className="h-px w-6 bg-border" />}
            <div
              className={`h-2 w-2 rounded-full ${
                s === step
                  ? "bg-primary"
                  : (["current", "passcode", "done"].indexOf(s) <
                    ["current", "passcode", "done"].indexOf(step))
                  ? "bg-primary/40"
                  : "bg-border"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step 1: Show current passcode */}
      {step === "current" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Reset — {deviceName}
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Your Current Passcode
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Open Settings &rarr; Screen Time &rarr; Change Screen Time Passcode on your device. Enter this code when prompted:
            </p>
          </div>

          <div className="border border-border p-8 bg-card text-center relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-3">
              Current Passcode
            </span>
            {isPending ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <p className="font-heading text-7xl tracking-[0.3em] text-foreground">
                {currentPasscode}
              </p>
            )}
          </div>

          <div className="border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs text-primary">
              After entering this code, your device will ask you to set a new passcode. Don&apos;t enter one yet — tap Next below and Latch will generate a new one for you.
            </p>
          </div>

          {errorMsg && (
            <div className="border border-destructive bg-destructive/10 p-4">
              <p className="text-xs text-destructive">{errorMsg}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              disabled={isPending || !currentPasscode}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              {isPending ? "Generating..." : "Generate New Passcode"}
              {!isPending && <ArrowRight className="h-3 w-3 ml-2" />}
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Enter new passcode on device */}
      {step === "passcode" && sequences && (
        <PasscodeEntry
          deviceName={deviceName}
          enterOps={sequences.enter}
          confirmOps={sequences.confirm}
          onComplete={() => setStep("done")}
        />
      )}

      {/* Step 3: Done */}
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
              Passcode Reset
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your new Screen Time passcode is locked behind the word challenge again. The old passcode no longer works.
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
