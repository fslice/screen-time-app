"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Check, X, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <span className="font-heading text-2xl tracking-wide text-foreground">
          Shutout
        </span>

        <nav className="hidden md:flex items-center gap-8">
          {["How It Works", "Compare", "Pricing"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/sign-up"
          className={cn(
            buttonVariants(),
            "rounded-full px-6 text-sm font-medium"
          )}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-36 pb-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="animate-in">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full mb-10">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
              New
            </span>
            The screen time app that actually works →
          </span>
        </div>

        <h1 className="font-heading text-[clamp(3rem,7vw,5.5rem)] leading-[1.05] tracking-tight animate-in delay-1">
          Stop ignoring your{" "}
          <span className="text-primary italic">Screen Time</span>{" "}
          limits with unbreakable{" "}
          <span className="text-primary italic">willpower.</span>
        </h1>

        <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in delay-2">
          Shutout hides your Screen Time password and makes you type 600 random words
          before you can get it back. No shortcuts. No &ldquo;Ignore Limit.&rdquo;
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in delay-3">
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 text-base font-medium"
            )}
          >
            Try Shutout for free
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See how it works <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-6 text-xs text-muted-foreground animate-in delay-4">
          iOS 16 or later · App Store billing · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ─── Social Proof ───────────────────────────────────────────────────────────

const pressNames = [
  "TechCrunch",
  "The Verge",
  "Wired",
  "Lifehacker",
  "MacStories",
];

function SocialProof() {
  return (
    <section className="py-12 px-6 border-y border-border">
      <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">
          As seen in
        </span>
        {pressNames.map((name) => (
          <span
            key={name}
            className="font-heading text-xl text-muted-foreground/50 tracking-wide"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "I deleted every blocker app because I always bypassed them. Shutout is the first thing that actually works.",
    name: "Marcus T.",
    detail: "Product Designer",
  },
  {
    quote:
      "I used to tap 'Ignore Limit' without thinking. Turns out I almost never want Instagram badly enough to type 600 words.",
    name: "Priya S.",
    detail: "Software Engineer",
  },
  {
    quote:
      "My therapist asked if she could recommend Shutout to other patients. That says everything.",
    name: "Jordan K.",
    detail: "Writer & Editor",
  },
  {
    quote:
      "After one week I genuinely have a different relationship with my phone. I didn't think an app could do that.",
    name: "Alex R.",
    detail: "Data Analyst",
  },
];

function Testimonials() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight text-center mb-16">
          People who&apos;ve tried{" "}
          <span className="italic text-primary">everything</span> else.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="relative">
              {/* Speech bubble */}
              <div className="bg-card border border-border rounded-2xl p-6 relative mb-4">
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Bubble tail */}
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
              </div>
              <div className="pl-4 pt-2">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────

const steps = [
  {
    number: "1",
    title: "Set your limits.",
    description:
      "Choose which apps to restrict using iOS Screen Time. Social media, streaming, games — whatever you binge. No profiles or sideloading needed.",
  },
  {
    number: "2",
    title: "Lock the password.",
    description:
      "Shutout generates a random passcode and hides it from you immediately. Your current self chose those limits — your impulsive self can't undo them.",
  },
  {
    number: "3",
    title: "Earn it back.",
    description:
      "Need to override? Type 600 random words, one at a time. By the time you finish — if you finish — you'll know if it was worth it.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight text-center mb-4">
          How it <span className="italic text-primary">works.</span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Three steps between you and a phone you actually control.
        </p>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-heading text-xl mb-6">
                {step.number}
              </div>
              <h3 className="font-heading text-2xl tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── The 600 Word Challenge ─────────────────────────────────────────────────

function Challenge() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-[clamp(5rem,12vw,10rem)] leading-[0.9] tracking-tight text-primary">
          600
        </h2>
        <p className="font-heading text-[clamp(1.5rem,3vw,2.5rem)] tracking-tight mt-2">
          random words to get your password back.
        </p>
        <div className="mt-8 max-w-lg mx-auto text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>Typed, not clicked. Every single one.</p>
          <p>About 15 minutes of uninterrupted effort.</p>
          <p>Enough friction to make you reconsider.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Comparison ─────────────────────────────────────────────────────────────

type Tri = "yes" | "no" | "partial";

interface CompRow {
  feature: string;
  vanilla: Tri;
  thirdParty: Tri;
  shutout: Tri;
}

const compRows: CompRow[] = [
  { feature: "Built into iOS — no profiles or MDM", vanilla: "yes", thirdParty: "no", shutout: "yes" },
  { feature: "Can't be bypassed in under a minute", vanilla: "no", thirdParty: "partial", shutout: "yes" },
  { feature: "Survives deleting the app", vanilla: "yes", thirdParty: "no", shutout: "yes" },
  { feature: "Real friction before overriding limits", vanilla: "no", thirdParty: "partial", shutout: "yes" },
  { feature: "You control the rules, not an algorithm", vanilla: "yes", thirdParty: "partial", shutout: "yes" },
  { feature: "Works without a jailbreak", vanilla: "yes", thirdParty: "yes", shutout: "yes" },
];

function TriIcon({ value }: { value: Tri }) {
  if (value === "yes") return <Check className="h-4 w-4 text-primary mx-auto" strokeWidth={2.5} />;
  if (value === "no") return <X className="h-4 w-4 text-muted-foreground/30 mx-auto" strokeWidth={2} />;
  return <Minus className="h-4 w-4 text-muted-foreground/50 mx-auto" strokeWidth={2} />;
}

function Comparison() {
  return (
    <section id="compare" className="py-24 px-6 bg-card">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight text-center mb-4">
          Why <span className="italic text-primary">Shutout?</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Vanilla Screen Time is trivially bypassable. Third-party blockers can be deleted.
          Shutout makes iOS itself the enforcement.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-4 font-normal text-xs text-muted-foreground w-1/2">
                  Feature
                </th>
                <th className="text-center px-4 py-4 font-normal text-xs text-muted-foreground">
                  Vanilla<br />Screen Time
                </th>
                <th className="text-center px-4 py-4 font-normal text-xs text-muted-foreground">
                  Third-party<br />Blockers
                </th>
                <th className="text-center px-4 py-4 font-heading text-base text-primary bg-primary/5 rounded-t-lg">
                  Shutout
                </th>
              </tr>
            </thead>
            <tbody>
              {compRows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-5 py-4 text-foreground/70 text-sm">
                    {row.feature}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TriIcon value={row.vanilla} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TriIcon value={row.thirdParty} />
                  </td>
                  <td className="px-4 py-4 text-center bg-primary/5">
                    <TriIcon value={row.shutout} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Monthly",
    price: "$4.99",
    period: "/month",
    description: "Start here. Cancel anytime.",
    features: [
      "Unlimited app & category limits",
      "600-word retrieval challenge",
      "Password obfuscation engine",
      "iCloud sync across devices",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Annual",
    price: "$14.99",
    period: "/year",
    description: "Save 75%. Commit to the habit.",
    features: [
      "Everything in Monthly",
      "Priority support",
      "Early access to features",
      "Usage stats and streaks",
    ],
    cta: "Get Annual",
    highlighted: true,
    badge: "Best Value",
  },
  {
    name: "Lifetime",
    price: "$19.99",
    period: "once",
    description: "Pay once. Own it forever.",
    features: [
      "Everything in Annual",
      "All future updates, free",
      "Lifetime priority support",
      "Founding member status",
    ],
    cta: "Get Lifetime",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight text-center mb-4">
          Simple, <span className="italic text-primary">honest</span> pricing.
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Less than a single impulse purchase you&apos;ll regret.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 flex flex-col gap-6 border",
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border bg-card"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-5xl tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <div className="h-px bg-border" />

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/70">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: plan.highlighted ? "default" : "outline" }),
                  "w-full rounded-full text-sm font-medium py-5",
                )}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          All prices USD · Billed through the App Store · Cancel anytime
        </p>
      </div>
    </section>
  );
}

// ─── CTA Banner ─────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="py-24 px-6 bg-foreground text-background">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight">
          Your limits are only as good as your{" "}
          <span className="italic opacity-70">enforcement.</span>
        </h2>
        <p className="mt-6 text-background/60 max-w-lg mx-auto">
          Stop negotiating with your impulses. Let Shutout hold you to the
          boundaries you set when you were thinking clearly.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className={cn(
              "inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-medium",
              "bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            )}
          >
            Start Free Trial
          </Link>
          <p className="text-sm text-background/40">No credit card required.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-heading text-xl tracking-wide text-foreground">
            Shutout
          </span>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {["Privacy", "Terms", "Support", "Press"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 h-px bg-border" />

        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shutout. All rights reserved.</p>
          <p>Apple and Screen Time are trademarks of Apple Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Testimonials />
        <Challenge />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
