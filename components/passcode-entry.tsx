"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Delete, RotateCcw, Check, Lock } from "lucide-react";
import type { PasscodeOperation } from "@/lib/passcode";

type Phase = "enter" | "confirm";

interface PasscodeEntryProps {
  deviceName: string;
  enterOps: PasscodeOperation[];
  confirmOps: PasscodeOperation[];
  onComplete: () => void;
  isReset?: boolean;
}

export function PasscodeEntry({
  deviceName,
  enterOps,
  confirmOps,
  onComplete,
  isReset = false,
}: PasscodeEntryProps) {
  const [phase, setPhase] = useState<Phase>("enter");
  const [opIndex, setOpIndex] = useState(0);
  // Track how many digits are "filled" so far for the visual
  const [filledDigits, setFilledDigits] = useState(0);

  const ops = phase === "enter" ? enterOps : confirmOps;
  const currentOp = ops[opIndex];
  const isDone = opIndex >= ops.length;

  function handleNext() {
    if (!currentOp) return;

    // Update filled digit count based on operation
    if (currentOp.type === "digit") {
      setFilledDigits((prev) => Math.min(prev + 1, 4));
    } else {
      setFilledDigits((prev) => Math.max(prev - 1, 0));
    }

    if (opIndex + 1 >= ops.length) {
      // Phase complete
      if (phase === "enter") {
        setOpIndex(ops.length); // show transition screen
      } else {
        setOpIndex(ops.length); // show done
      }
    } else {
      setOpIndex((prev) => prev + 1);
    }
  }

  function handleRestart() {
    setOpIndex(0);
    setFilledDigits(0);
  }

  function startConfirm() {
    setPhase("confirm");
    setOpIndex(0);
    setFilledDigits(0);
  }

  // Calculate which digit position the user is currently entering (0-3)
  const currentDigitPosition = filledDigits;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary">
            {phase === "enter" ? "Set Passcode" : "Confirm Passcode"}
          </span>
        </div>
        <h2 className="font-heading text-4xl tracking-wider uppercase">
          {isDone
            ? phase === "enter"
              ? "Now Confirm"
              : "Passcode Set"
            : currentOp?.type === "delete"
            ? "Delete"
            : "Enter Digit"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isDone
            ? phase === "enter"
              ? `Good. Now do it again to confirm — the phone will ask you to re-enter the passcode.`
              : `Your Screen Time passcode is locked in on ${deviceName}.`
            : phase === "enter"
            ? isReset
              ? `Your ${deviceName} should now be asking for a new passcode. Enter it digit by digit.`
              : `Follow along on your ${deviceName}. Settings > Screen Time > Change Screen Time Passcode. Enter 1111, then enter the new passcode digit by digit.`
            : `Re-enter the same passcode to confirm it on your ${deviceName}.`}
        </p>
      </div>

      {/* Digit position indicator */}
      {!isDone && (
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2, 3].map((pos) => (
            <div
              key={pos}
              className={`relative flex items-center justify-center w-14 h-16 border-2 transition-all ${
                pos < filledDigits
                  ? "border-primary/40 bg-primary/10"
                  : pos === currentDigitPosition
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              {pos < filledDigits ? (
                <div className="w-3 h-3 rounded-full bg-primary" />
              ) : pos === currentDigitPosition ? (
                <div className="w-0.5 h-8 bg-primary animate-pulse" />
              ) : null}
              <span className="absolute -bottom-5 text-[10px] tracking-widest uppercase text-muted-foreground">
                {pos + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Current operation */}
      {!isDone && currentOp && (
        <div className="mt-8">
          {currentOp.type === "digit" ? (
            <div className="border border-border p-8 bg-card text-center min-h-[200px] flex flex-col items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                Solve & enter digit {currentDigitPosition + 1}
              </span>
              <p className="font-heading text-5xl mt-4 text-primary tracking-wider">
                {currentOp.expression}
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                = ?
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Type the answer on your {deviceName}
              </p>
            </div>
          ) : (
            <div className="border border-destructive/30 bg-destructive/5 p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
              <Delete className="h-8 w-8 text-destructive/70" />
              <p className="font-heading text-2xl mt-4 tracking-wider uppercase text-destructive/80">
                Press Delete
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Tap the delete key on your {deviceName}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress through operations */}
      {!isDone && (
        <div className="flex items-center gap-1.5">
          {ops.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors ${
                i < opIndex
                  ? "bg-primary/40"
                  : i === opIndex
                  ? "bg-primary"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!isDone && (
          <>
            <Button
              variant="outline"
              onClick={handleRestart}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              <RotateCcw className="h-3 w-3 mr-2" />
              Restart
            </Button>

            <div className="flex-1" />

            <Button
              onClick={handleNext}
              className="rounded-none text-xs tracking-widest uppercase"
            >
              {currentOp?.type === "delete" ? "Deleted" : "Entered"}
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          </>
        )}

        {isDone && phase === "enter" && (
          <Button
            onClick={startConfirm}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Confirm Passcode <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        )}

        {isDone && phase === "confirm" && (
          <Button
            onClick={onComplete}
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Continue <Check className="h-3 w-3 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
