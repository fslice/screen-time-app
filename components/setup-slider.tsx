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
  ChevronLeft,
  Ruler,
} from "lucide-react";

// ─── Image Carousel ────────────────────────────────────────────────────────────

function ImageCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 w-[240px] shrink-0">
      {/* Stacked image container */}
      <div className="relative w-[240px] h-[480px]">
        {images.map((src, i) => {
          const isActive = i === active;
          const offset = (i - active) * 14;
          const zIndex = images.length - Math.abs(i - active);
          const scale = isActive ? 1 : 0.95;
          const opacity = isActive ? 1 : 0.5;

          return (
            <div
              key={src}
              className="absolute inset-0 transition-all duration-300 ease-out cursor-pointer flex items-center justify-center"
              style={{
                transform: `translateX(${offset}px) translateY(${Math.abs(offset) * 0.5}px) rotate(${offset * 0.15}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              onClick={() => setActive(i)}
            >
              <div className="border-2 border-border rounded-2xl overflow-hidden shadow-lg bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Step screenshot ${i + 1}`}
                  className="w-[220px] h-auto"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows + dots */}
      {images.length > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActive((prev) => Math.max(0, prev - 1))}
            disabled={active === 0}
            className="p-1.5 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActive((prev) => Math.min(images.length - 1, prev + 1))}
            disabled={active === images.length - 1}
            className="p-1.5 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Step Data ──────────────────────────────────────────────────────────────────

interface SetupStep {
  title: string;
  subtitle: string;
  why: string;
  instructions: string[];
  required?: boolean;
  icon: React.ReactNode;
  tip?: string;
  images: string[];
}

const SETUP_STEPS: SetupStep[] = [
  {
    title: "App & Website Activity",
    subtitle: "Required before limits work",
    why: "This lets Screen Time track what you\u2019re using. Without it, limits and downtime can\u2019t enforce anything.",
    instructions: [
      'Open Settings > Screen Time',
      'Tap "App & Website Activity"',
      'Tap "Turn On App & Website Activity"',
    ],
    required: true,
    icon: <Eye className="h-5 w-5" />,
    images: ["/setup/11.png", "/setup/12.png"],
  },
  {
    title: "Set a Passcode",
    subtitle: "Temporary passcode to get started",
    why: "You need a Screen Time passcode to lock your settings. We\u2019ll start with a temporary one \u2014 you\u2019ll replace it with your Latch passcode later.",
    instructions: [
      'Tap "Lock Screen Time Settings"',
      "Enter 1111 as your temporary passcode",
      "Confirm 1111 again",
      "When prompted for an Apple ID, tap Cancel",
      'Tap "Skip" to confirm',
    ],
    required: true,
    icon: <Lock className="h-5 w-5" />,
    tip: "We\u2019ll generate your real passcode in the next step and have you swap it in.",
    images: ["/setup/21.png", "/setup/22.png", "/setup/23.png", "/setup/24.png"],
  },
  {
    title: "Set Downtime",
    subtitle: "Schedule offline hours",
    why: "Downtime blocks all apps except those you explicitly allow. It\u2019s the most effective way to enforce screen-free periods like bedtime or mornings.",
    instructions: [
      'Tap "Downtime" in Screen Time settings',
      "Choose Every Day or customize per day",
      "Set your start and end times",
      'Turn on "Block at Downtime"',
    ],
    icon: <Clock className="h-5 w-5" />,
    tip: "Block at Downtime is the key toggle \u2014 without it, downtime is just a suggestion.",
    images: ["/setup/31.png", "/setup/32.png"],
  },
  {
    title: "Set App Limits",
    subtitle: "Cap daily usage per app or category",
    why: "App Limits let you set a daily time budget for specific apps or whole categories like Social or Games. Once time\u2019s up, the app locks.",
    instructions: [
      'Tap "App Limits" > "Add Limit"',
      "Choose categories or specific apps",
      "Set your daily time allowance",
      'Tap "Add"',
    ],
    icon: <AppWindow className="h-5 w-5" />,
    images: [],
  },
  {
    title: "Content & Privacy Restrictions",
    subtitle: "Control what\u2019s accessible",
    why: "These restrictions limit web content, App Store purchases, explicit content, and app age ratings. Even adults benefit from reducing impulsive access.",
    instructions: [
      'Tap "Content & Privacy Restrictions"',
      "Turn the main toggle on",
      "Configure Web Content filtering",
      "Set App Store purchase restrictions",
      "Adjust Explicit Content settings",
    ],
    icon: <Shield className="h-5 w-5" />,
    images: [],
  },
  {
    title: "Always Allowed Apps",
    subtitle: "Keep essentials accessible",
    why: "Some apps need to work even during Downtime \u2014 like Phone, Maps, or anything safety-related. This ensures you\u2019re never truly locked out of what matters.",
    instructions: [
      'Tap "Always Allowed"',
      "Review the default allowed apps",
      "Add any essential apps (Phone, Maps, etc.)",
      "Remove any apps that shouldn\u2019t bypass Downtime",
    ],
    icon: <Star className="h-5 w-5" />,
    images: [],
  },
  {
    title: "Block Account Changes",
    subtitle: "Close the factory-reset loophole",
    why: "Without this, you can simply sign out of your Apple ID and factory reset the device to bypass all Screen Time settings.",
    instructions: [
      'Go to Content & Privacy Restrictions > Account Changes',
      'Set to "Don\'t Allow"',
      'Also consider: Passcode Changes > "Don\'t Allow"',
    ],
    required: true,
    icon: <UserX className="h-5 w-5" />,
    tip: "This is critical. Without it, all your other settings can be wiped in minutes.",
    images: [],
  },
  {
    title: "Screen Distance",
    subtitle: "Reduce eye strain",
    why: "Screen Distance uses the TrueDepth camera to alert you when you\u2019re holding your device too close. Optional, but a healthy habit to build.",
    instructions: [
      'Tap "Screen Distance" in Screen Time settings',
      "Turn on Screen Distance",
    ],
    icon: <Ruler className="h-5 w-5" />,
    images: [],
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
    images: [],
  },
];

// ─── Setup Slider ───────────────────────────────────────────────────────────────

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
  const hasImages = step.images.length > 0;

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

      {/* Content: side-by-side on desktop when images exist */}
      <div className={hasImages ? "flex flex-col-reverse md:flex-row gap-8 items-start" : ""}>
        {/* Text content */}
        <div className="space-y-5 flex-1 min-w-0">
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
        </div>

        {/* Images — beside text on desktop, above on mobile */}
        {hasImages ? (
          <ImageCarousel key={currentStep} images={step.images} />
        ) : (
          <div className="border border-dashed border-border bg-card/50 w-[220px] h-[380px] mx-auto flex items-center justify-center rounded-2xl shrink-0">
            <div className="text-center text-muted-foreground">
              <SmartphoneIcon className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs tracking-widest uppercase opacity-60">
                Screenshot
              </p>
            </div>
          </div>
        )}
      </div>

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

function SmartphoneIcon(props: React.SVGProps<SVGSVGElement>) {
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
