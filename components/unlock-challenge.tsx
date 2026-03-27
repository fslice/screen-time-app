"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { startUnlockSession, submitWord, revealPasscode } from "@/lib/actions/unlock";
import { Lock, ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";

type Phase = "loading" | "typing" | "completed" | "revealed";

export function UnlockChallenge({ deviceId }: { deviceId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [phase, setPhase] = useState<Phase>("loading");
  const [sessionId, setSessionId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [wordsRequired, setWordsRequired] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [typedWord, setTypedWord] = useState("");
  const [error, setError] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [icloudAccount, setIcloudAccount] = useState("");

  useEffect(() => {
    startTransition(async () => {
      const session = await startUnlockSession(deviceId);
      setSessionId(session.sessionId);
      setDeviceName(session.deviceName);
      setWordsRequired(session.wordsRequired);
      setWordsCompleted(session.wordsCompleted);
      setCurrentWord(session.currentWord);
      setPhase("typing");
    });
  }, [deviceId]);

  useEffect(() => {
    if (phase === "typing") {
      inputRef.current?.focus();
    }
  }, [phase, currentWord]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!typedWord.trim() || isPending) return;

    startTransition(async () => {
      const result = await submitWord(sessionId, typedWord);

      if (!result.correct) {
        setError(true);
        setTypedWord("");
        setTimeout(() => setError(false), 600);
        return;
      }

      setWordsCompleted(result.wordsCompleted);
      setTypedWord("");
      setError(false);

      if (result.completed) {
        setPhase("completed");
      } else {
        setCurrentWord(result.currentWord!);
      }
    });
  }

  function handleReveal() {
    startTransition(async () => {
      const result = await revealPasscode(sessionId);
      setPasscode(result.passcode);
      setIcloudAccount(result.icloudAccount);
      setPhase("revealed");
    });
  }

  const progress = wordsRequired > 0 ? (wordsCompleted / wordsRequired) * 100 : 0;

  if (phase === "loading") {
    return (
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-muted-foreground">Loading challenge...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-3 w-3" /> Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary">
            {deviceName}
          </span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl tracking-wider uppercase">
          {phase === "typing" && "Type to Unlock"}
          {phase === "completed" && "Challenge Complete"}
          {phase === "revealed" && "Your Passcode"}
        </h1>
      </div>

      {/* Typing phase */}
      {phase === "typing" && (
        <>
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{wordsCompleted} of {wordsRequired} words</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1 rounded-none" />
          </div>

          {/* Current word to type */}
          <div className="border border-border p-8 bg-card text-center relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-3">
              Type this word
            </span>
            <p className="font-heading text-5xl md:text-6xl tracking-wider uppercase text-foreground">
              {currentWord}
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              ref={inputRef}
              value={typedWord}
              onChange={(e) => setTypedWord(e.target.value)}
              placeholder="Type the word..."
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={`rounded-none bg-card border-border flex-1 ${
                error ? "border-destructive animate-shake" : ""
              }`}
            />
            <Button
              type="submit"
              disabled={isPending || !typedWord.trim()}
              className="rounded-none px-6 text-xs tracking-widest uppercase"
            >
              {error ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </Button>
          </form>

          {error && (
            <p className="text-xs text-destructive">
              Wrong — type the word exactly as shown.
            </p>
          )}
        </>
      )}

      {/* Completed phase */}
      {phase === "completed" && (
        <div className="space-y-6">
          <div className="border border-primary p-8 bg-primary/5 text-center">
            <p className="font-heading text-6xl text-primary">{wordsRequired}</p>
            <p className="text-xs tracking-widest uppercase text-primary mt-2">
              words typed
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            You&apos;ve completed the challenge. You can now reveal your Screen Time passcode.
          </p>

          <Button
            onClick={handleReveal}
            disabled={isPending}
            className="rounded-none px-7 py-5 text-xs tracking-[0.2em] uppercase font-semibold w-full"
          >
            {isPending ? "Decrypting..." : "Reveal Passcode"}
          </Button>
        </div>
      )}

      {/* Revealed phase */}
      {phase === "revealed" && (
        <div className="space-y-6">
          <div className="border border-border p-8 bg-card text-center relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-3">
              Screen Time Passcode
            </span>
            <p className="font-heading text-7xl tracking-[0.3em] text-foreground">
              {passcode}
            </p>
          </div>

          <div className="border border-border p-4 bg-card">
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-1">
              Recovery iCloud Account
            </span>
            <p className="text-sm text-foreground">{icloudAccount}</p>
          </div>

          <div className="border border-primary/30 bg-primary/5 p-4">
            <p className="text-xs text-primary">
              This passcode will remain encrypted. You&apos;ll need to complete the word
              challenge again next time you want to see it.
            </p>
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="rounded-none text-xs tracking-widest uppercase"
          >
            Back to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
