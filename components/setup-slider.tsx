"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Clock,
  Lock,
  AppWindow,
  Eye,
  Star,
  UserX,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

interface SetupStep {
  title: string;
  subtitle: string;
  why: string;
  instructions: string[];
  required?: boolean;
  icon: React.ReactNode;
  tip?: string;
}

const SETUP_STEPS: SetupStep[] = [
  {
    title: "Enable Screen Time",
    subtitle: "The foundation for everything else",
    why: "Screen Time is Apple's built-in tool for managing device usage. Nothing else works until this is on.",
    instructions: [
      'Open Settings > Screen Time',
      'Tap "Turn On Screen Time"',
      'Select "This is My iPhone"',
    ],
    required: true,
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "Set a Passcode",
    subtitle: "Temporary passcode to get started",
    why: "You need a Screen Time passcode to lock your settings. We'll start with a temporary one — you'll replace it with your Latch passcode later.",
    instructions: [
      'Tap "Lock Screen Time Settings"',
      "Enter 1111 as your temporary passcode",
      "Confirm 1111 again",
      "Don't use your device unlock passcode",
    ],
    required: true,
    icon: <Lock className="h-5 w-5" />,
    tip: "We'll generate your real passcode in the next step and have you swap it in.",
  },
  {
    title: "App & Website Activity",
    subtitle: "Required before limits work",
    why: "This setting lets Screen Time actually track what you're using. Without it, limits and downtime can't enforce anything.",
    instructions: [
      'In Screen Time settings, tap "App & Website Activity"',
      'Turn on "App & Website Activity"',
    ],
    required: true,
    icon: <Eye className="h-5 w-5" />,
  },
  {
    title: "Set Downtime",
    subtitle: "Schedule offline hours",
    why: "Downtime blocks all apps except those you explicitly allow. It's the most effective way to enforce screen-free periods like bedtime or mornings.",
    instructions: [
      'Tap "Downtime" in Screen Time settings',
      "Choose Every Day or customize per day",
      "Set your start and end times",
      'Turn on "Block at Downtime"',
    ],
    icon: <Clock className="h-5 w-5" />,
    tip: "Block at Downtime is the key toggle — without it, downtime is just a suggestion.",
  },
  {
    title: "Set App Limits",
    subtitle: "Cap daily usage per app or category",
    why: "App Limits let you set a daily time budget for specific apps or whole categories like Social or Games. Once time's up, the app locks.",
    instructions: [
      'Tap "App Limits" > "Add Limit"',
      "Choose categories or specific apps",
      "Set your daily time allowance",
      'Tap "Add"',
    ],
    icon: <AppWindow className="h-5 w-5" />,
  },
  {
    title: "Content & Privacy Restrictions",
    subtitle: "Control what's accessible",
    why: "These restrictions limit web content, App Store purchases, explicit content, and app age ratings. Even adults benefit from reducing impulsive access.",
    instructions: [
      'Tap "Content & Privacy Restrictions"',
      "Turn the main toggle on",
      "Configure Web Content filtering",
      "Set App Store purchase restrictions",
      "Adjust Explicit Content settings",
      "Set App age ratings if desired",
    ],
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Always Allowed Apps",
    subtitle: "Keep essentials accessible",
    why: "Some apps need to work even during Downtime — like Phone, Maps, or anything safety-related. This ensures you're never truly locked out of what matters.",
    instructions: [
      'Tap "Always Allowed"',
      "Review the default allowed apps",
      "Add any essential apps (Phone, Maps, etc.)",
      "Remove any apps that shouldn't bypass Downtime",
    ],
    icon: <Star className="h-5 w-5" />,
  },
  {
    title: "Block Account Changes",
    subtitle: "Close the factory-reset loophole",
    why: "Without this, someone can simply sign out of their Apple ID and factory reset the device to bypass all Screen Time settings. This is the most common workaround.",
    instructions: [
      'Go to Content & Privacy Restrictions > Account Changes',
      'Set to "Don\'t Allow"',
      'Also consider: Passcode Changes > "Don\'t Allow"',
    ],
    required: true,
    icon: <UserX className="h-5 w-5" />,
    tip: "This is critical. Without it, all your other settings can be wiped in minutes.",
  },
  {
    title: "Confirm & Lock",
    subtitle: "Verify everything is in place",
    why: "A final check to make sure your Screen Time passcode is active and your key settings are locked down before we generate your Latch passcode.",
    instructions: [
      "Go back to the main Screen Time settings",
      'Verify "Lock Screen Time Settings" shows as locked',
      "Confirm your chosen Downtime and App Limits are visible",
      'Confirm Content & Privacy Restrictions shows "On"',
    ],
    required: true,
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

export function SetupSlider({
  deviceName,
  onComplete,
  onBack,
}: {
  deviceName: string;
  onComplete: () => void;
  onBack: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const step = SETUP_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === SETUP_STEPS.length - 1;
  const isCompleted = completedSteps.has(currentStep);

  function markComplete() {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function skipStep() {
    setCurrentStep((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary">
            Setup Guide
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {currentStep + 1} / {SETUP_STEPS.length}
          </span>
        </div>
        <h2 className="font-heading text-4xl tracking-wider uppercase">
          {step.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {SETUP_STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-1.5 flex-1 transition-colors ${
              i === currentStep
                ? "bg-primary"
                : completedSteps.has(i)
                ? "bg-primary/40"
                : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Screenshot placeholder */}
      <div className="border border-dashed border-border bg-card/50 aspect-[9/16] max-h-[320px] w-auto mx-auto flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs tracking-widest uppercase opacity-60">
            Screenshot
          </p>
        </div>
      </div>

      {/* Why this matters */}
      <div className="border-l-2 border-primary/30 pl-4">
        <p className="text-xs tracking-widest uppercase text-primary mb-1">
          Why this matters
        </p>
        <p className="text-sm text-muted-foreground">{step.why}</p>
      </div>

      {/* Instructions */}
      <div className="border border-border p-5 bg-card space-y-3">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
          On your {deviceName}
        </p>
        <ol className="space-y-2.5">
          {step.instructions.map((instruction, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-primary font-heading text-base shrink-0">
                {i + 1}.
              </span>
              <span className="text-muted-foreground">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Tip */}
      {step.tip && (
        <div className="border border-primary/30 bg-primary/5 p-4">
          <p className="text-xs text-primary">{step.tip}</p>
        </div>
      )}

      {/* Required badge */}
      {step.required && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[10px] tracking-widest uppercase text-primary">
            Recommended
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={isFirst ? onBack : () => setCurrentStep((prev) => prev - 1)}
          className="rounded-none text-xs tracking-widest uppercase"
        >
          <ArrowLeft className="h-3 w-3 mr-2" />
          {isFirst ? "Back" : "Prev"}
        </Button>

        <div className="flex-1" />

        {!step.required && !isLast && (
          <Button
            variant="outline"
            onClick={skipStep}
            className="rounded-none text-xs tracking-widest uppercase text-muted-foreground"
          >
            Skip
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}

        <Button
          onClick={markComplete}
          className="rounded-none text-xs tracking-widest uppercase"
        >
          {isLast ? (
            <>
              Continue <ArrowRight className="h-3 w-3 ml-2" />
            </>
          ) : (
            <>
              Done <Check className="h-3 w-3 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Smartphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
