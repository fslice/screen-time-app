"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDevice } from "@/lib/actions/device";
import { ArrowRight, ArrowLeft, Check, Lock, Smartphone } from "lucide-react";

type Step = "name" | "setup" | "passcode" | "icloud" | "words" | "done";

interface MathProblem {
  expression: string;
  answer: number;
}

interface SetupResult {
  deviceId: string;
  mathProblems: MathProblem[];
  icloudAccount: { email: string; label: string };
}

const WORD_OPTIONS = [100, 200, 400, 600];

export function AddDeviceWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("name");
  const [deviceName, setDeviceName] = useState("");
  const [wordsRequired, setWordsRequired] = useState(200);
  const [result, setResult] = useState<SetupResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    startTransition(async () => {
      const res = await createDevice(deviceName, wordsRequired);
      setResult(res);
      setStep("passcode");
    });
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {(["name", "setup", "passcode", "icloud", "words", "done"] as Step[]).map(
          (s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && (
                <div className="h-px w-6 bg-border" />
              )}
              <div
                className={`h-2 w-2 rounded-full ${
                  s === step
                    ? "bg-primary"
                    : (["name", "setup", "passcode", "icloud", "words", "done"].indexOf(s) <
                      ["name", "setup", "passcode", "icloud", "words", "done"].indexOf(step))
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

      {/* Step: Setup instructions */}
      {step === "setup" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Step 2
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Set Up Screen Time
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Before we generate your passcode, make sure Screen Time is enabled on your device.
            </p>
          </div>

          <div className="border border-border p-6 bg-card space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-heading text-lg">1.</span>
                Open <span className="text-foreground">Settings</span> on your {deviceName}
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-heading text-lg">2.</span>
                Tap <span className="text-foreground">Screen Time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-heading text-lg">3.</span>
                Turn on Screen Time if it isn&apos;t already
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-heading text-lg">4.</span>
                Set your <span className="text-foreground">App Limits</span> for the apps you want to restrict
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label className="text-xs tracking-widest uppercase">
              Words to unlock
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {WORD_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setWordsRequired(n)}
                  className={`border p-3 text-center transition-colors ${
                    wordsRequired === n
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="font-heading text-2xl">{n}</span>
                  <span className="block text-[10px] tracking-widest uppercase mt-1">
                    words
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {wordsRequired <= 100
                ? "Quick — about 2 minutes."
                : wordsRequired <= 200
                ? "Moderate — about 5 minutes."
                : wordsRequired <= 400
                ? "Serious — about 10 minutes."
                : "Maximum friction — about 15 minutes."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep("name")}
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

      {/* Step: Passcode via math problems */}
      {step === "passcode" && result && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Step 3
              </span>
            </div>
            <h2 className="font-heading text-4xl tracking-wider uppercase">
              Your Passcode
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Solve each problem to find each digit. Enter this as your Screen Time passcode on your device.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {result.mathProblems.map((problem, i) => (
              <div
                key={i}
                className="border border-border p-4 bg-card text-center"
              >
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                  Digit {i + 1}
                </span>
                <p className="font-heading text-xl mt-2 text-primary">
                  {problem.expression}
                </p>
                <p className="text-xs text-muted-foreground mt-1">= ?</p>
              </div>
            ))}
          </div>

          <div className="border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs text-primary">
              Enter this passcode in Settings → Screen Time → Use Screen Time Passcode on your {deviceName}.
              Don&apos;t write it down — that defeats the purpose.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep("icloud")}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              I&apos;ve entered it <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>
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
              Add this iCloud account to your device so Screen Time recovery goes through Shutout, not your personal iCloud.
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
