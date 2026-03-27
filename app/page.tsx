import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, ArrowRight, Lock } from "lucide-react";

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-primary" strokeWidth={2.5} />
          <span className="font-heading text-2xl tracking-widest">SHUTOUT</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {["How It Works", "Compare", "Pricing"].map((label, i) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <Button
          size="sm"
          className="text-xs tracking-widest uppercase rounded-none px-5"
          asChild
        >
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    </header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 pt-28 pb-16 border-b border-border">
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid md:grid-cols-[1fr_320px] gap-16 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-10 animate-in">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                iOS Screen Time Lock
              </span>
            </div>

            <h1 className="font-heading text-[clamp(4.5rem,13vw,11rem)] leading-[0.88] tracking-wider uppercase animate-in delay-1">
              Stop<br />
              Ignoring<br />
              <span className="text-primary">Your</span><br />
              Limits.
            </h1>

            <div className="mt-10 w-12 h-[2px] bg-primary animate-in delay-2" />

            <p className="mt-6 max-w-lg text-sm text-muted-foreground leading-[1.9] animate-in delay-2">
              Shutout obfuscates your Screen Time password so you can&apos;t recall it on
              impulse. Need it back? Earn it — by typing 600 randomly chosen words,
              one at a time. No shortcuts. No &ldquo;Ignore Limit.&rdquo; Just friction that
              actually works.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5 animate-in delay-3">
              <Button className="rounded-none px-7 py-5 text-xs tracking-[0.2em] uppercase font-semibold" asChild>
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                How it works <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <p className="mt-6 text-xs text-muted-foreground/60 tracking-wide animate-in delay-4">
              iOS 16 or later · App Store billing · Cancel anytime
            </p>
          </div>

          {/* Right — 600 challenge box */}
          <div className="hidden md:block animate-in delay-3">
            <div className="border border-border p-8 relative bg-card">
              <div className="absolute -top-px left-0 right-0 h-px bg-primary" />
              <div className="text-xs tracking-[0.3em] uppercase text-primary mb-6">
                To retrieve your password
              </div>
              <div className="font-heading text-[9rem] leading-none text-foreground">
                600
              </div>
              <div className="font-heading text-2xl tracking-[0.15em] uppercase text-muted-foreground mt-1">
                Random Words
              </div>
              <div className="mt-6 h-px bg-border" />
              <ul className="mt-6 space-y-3 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 shrink-0">—</span>
                  Typed, not clicked. Every single one.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 shrink-0">—</span>
                  About 15 minutes of uninterrupted effort.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-0.5 shrink-0">—</span>
                  Enough friction to make you reconsider.
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Mobile 600 stat */}
        <div className="md:hidden mt-12 pt-8 border-t border-border flex items-baseline gap-4">
          <span className="font-heading text-6xl text-primary">600</span>
          <span className="text-sm text-muted-foreground leading-relaxed">
            words to type before<br />you get your password back
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Set Your Limits",
    description:
      "Choose which apps and categories to restrict using the same Screen Time tools you already know. Social media, streaming, games — whatever you're prone to bingeing. Shutout works with iOS natively, no profiles or sideloading required.",
  },
  {
    number: "02",
    title: "Lock Your Password",
    description:
      "Shutout sets a Screen Time passcode that is long, random, and immediately hidden from you. You won't see it. You won't remember it. Your current self chose those limits — Shutout makes sure your impulsive self can't undo them in 10 seconds.",
  },
  {
    number: "03",
    title: "Earn It Back",
    description:
      "Need to override a limit for a genuine reason? Open Shutout and start the retrieval challenge. 600 words, typed one at a time, chosen at random. By the time you finish — if you finish — you'll know whether it was actually worth it.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-baseline gap-6 mb-16">
          <h2 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            How It Works
          </h2>
          <div className="flex-1 h-px bg-border hidden md:block" />
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-16 py-12 border-t border-border group"
            >
              <div>
                <span className="font-heading text-6xl text-muted-foreground/30 group-hover:text-primary transition-colors duration-500 leading-none">
                  {step.number}
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="font-heading text-3xl tracking-wider uppercase text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.9] max-w-2xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── Comparison ──────────────────────────────────────────────────────────────

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
  { feature: "Doesn't require a monthly subscription", vanilla: "yes", thirdParty: "no", shutout: "yes" },
];

function TriIcon({ value }: { value: Tri }) {
  if (value === "yes") return <Check className="h-4 w-4 text-primary mx-auto" strokeWidth={2.5} />;
  if (value === "no") return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" strokeWidth={2} />;
  return <Minus className="h-4 w-4 text-muted-foreground/60 mx-auto" strokeWidth={2} />;
}

function Comparison() {
  return (
    <section id="compare" className="py-24 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-baseline gap-6 mb-16">
          <h2 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            Compare
          </h2>
          <div className="flex-1 h-px bg-border hidden md:block" />
        </div>

        <p className="text-sm text-muted-foreground mb-12 max-w-xl leading-relaxed">
          Vanilla Screen Time is trivially bypassable. Third-party blockers can be deleted.
          Shutout makes iOS itself the enforcement mechanism — and puts the friction where it matters.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-5 font-normal text-xs tracking-widest uppercase text-muted-foreground w-1/2 bg-card">
                  Feature
                </th>
                <th className="text-center px-4 py-5 font-normal text-xs tracking-widest uppercase text-muted-foreground bg-card">
                  Vanilla<br />Screen Time
                </th>
                <th className="text-center px-4 py-5 font-normal text-xs tracking-widest uppercase text-muted-foreground bg-card">
                  Third-party<br />Blockers
                </th>
                <th className="text-center px-4 py-5 font-heading text-lg tracking-wider text-primary bg-primary/5 border-l border-primary/20">
                  SHUTOUT
                </th>
              </tr>
            </thead>
            <tbody>
              {compRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-foreground/70 text-xs tracking-wide">
                    {row.feature}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TriIcon value={row.vanilla} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <TriIcon value={row.thirdParty} />
                  </td>
                  <td className="px-4 py-4 text-center bg-primary/5 border-l border-primary/20">
                    <TriIcon value={row.shutout} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/50 tracking-wide">
          Partial = technically possible but easily circumvented with 2–3 taps.
        </p>

      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Monthly",
    price: "$4.99",
    period: "per month",
    description:
      "Start here. See if you can actually stick to your limits. Cancel any time — though the fact that you're reading this suggests you should probably keep it.",
    features: [
      "Unlimited app & category limits",
      "600-word retrieval challenge",
      "Password obfuscation engine",
      "iCloud sync across your devices",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Annual",
    price: "$14.99",
    period: "per year",
    description:
      "Three dollars a month. Less than a single mindless purchase you'll regret. Commit to the habit and save 75% versus monthly.",
    features: [
      "Everything in Monthly",
      "Priority support",
      "Early access to new features",
      "Usage stats and daily streaks",
    ],
    cta: "Get Annual",
    highlighted: true,
    badge: "Best Value",
  },
  {
    name: "Lifetime",
    price: "$19.99",
    period: "one time",
    description:
      "Pay once. Own it forever. The version of you that finally stopped doom-scrolling will thank you for not making it a recurring expense.",
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
    <section id="pricing" className="py-24 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-baseline gap-6 mb-16">
          <h2 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            Pricing
          </h2>
          <div className="flex-1 h-px bg-border hidden md:block" />
        </div>

        <div className="grid md:grid-cols-3 gap-0 border border-border">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative p-8 flex flex-col gap-6 ${
                i < plans.length - 1 ? "md:border-r border-b md:border-b-0 border-border" : ""
              } ${plan.highlighted ? "bg-card" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              )}

              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs tracking-widest uppercase text-primary border border-primary/40 px-2 py-0.5">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-6xl tracking-wider">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground tracking-wide">
                    {plan.period}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-[1.9]">
                {plan.description}
              </p>

              <div className="h-px bg-border" />

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-xs text-foreground/70">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-none text-xs tracking-[0.2em] uppercase py-5 ${
                  plan.highlighted ? "" : "bg-transparent border border-border text-foreground hover:bg-foreground hover:text-background"
                }`}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="/sign-up">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground/50 tracking-wide">
          All prices USD · Billed through the App Store · Cancel or manage from Apple ID settings
        </p>

      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

const testimonials = [
  {
    quote:
      "I deleted Freedom, Opal, and every other app I tried because I always bypassed them within five minutes. Shutout is the first thing that actually works. The 600-word thing sounds insane — that's exactly why it works.",
    name: "Marcus T.",
    detail: "Product Designer",
  },
  {
    quote:
      "I used to tap 'Ignore Limit' without even thinking. Now I have to actually want to open Instagram badly enough to earn it. Turns out I almost never want it that badly.",
    name: "Priya S.",
    detail: "Software Engineer",
  },
  {
    quote:
      "My therapist suggested I try something to reduce doom-scrolling. I told her about Shutout and she asked if she could recommend it to other patients.",
    name: "Jordan K.",
    detail: "Writer & Editor",
  },
  {
    quote:
      "After the first week I genuinely feel like I have a different relationship with my phone. I didn't think an app could do that. I thought I just had bad willpower.",
    name: "Alex R.",
    detail: "Data Analyst",
  },
];

function Testimonials() {
  return (
    <section className="py-24 px-6 border-b border-border">
      <div className="mx-auto max-w-7xl">

        <div className="flex items-baseline gap-6 mb-16">
          <h2 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
            From People Who&apos;ve<br className="hidden md:block" /> Tried Everything Else
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-border">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`p-8 md:p-10 relative ${
                i % 2 === 0 && i < testimonials.length - 1 ? "md:border-r border-border" : ""
              } ${i < 2 ? "border-b border-border" : ""}`}
            >
              <div className="font-heading text-8xl text-primary/20 leading-none select-none mb-4">
                &ldquo;
              </div>
              <p className="text-sm text-foreground/80 leading-[1.9] italic">
                {t.quote}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase text-foreground font-semibold">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="py-24 px-6 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs tracking-[0.25em] uppercase text-primary">
                Ready to commit?
              </span>
            </div>
            <h2 className="font-heading text-5xl md:text-7xl tracking-wider uppercase leading-[0.9]">
              Your Limits<br />
              Are Only As<br />
              Good As Your<br />
              <span className="text-primary">Enforcement.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <Button className="rounded-none px-10 py-6 text-xs tracking-[0.2em] uppercase font-semibold" asChild>
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
            <p className="text-xs text-muted-foreground tracking-wide">
              No credit card required to try.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <Lock className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
            <span className="font-heading text-xl tracking-widest">SHUTOUT</span>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-xs tracking-widest uppercase text-muted-foreground">
            {["Privacy Policy", "Terms of Service", "Support", "Press Kit"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 h-px bg-border" />

        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-muted-foreground/50 tracking-wide">
          <p>© {new Date().getFullYear()} Shutout. All rights reserved.</p>
          <p>Apple and Screen Time are trademarks of Apple Inc.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
