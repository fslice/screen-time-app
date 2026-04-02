"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { freeEmergencyUnlock, getFreeUnlockStatus } from "@/lib/actions/device";
import { HelpCircle, Unlock, Check } from "lucide-react";

interface Device {
  id: string;
  name: string;
}

export function DashboardFaq({ devices }: { devices: Device[] }) {
  const router = useRouter();
  const [showRecovery, setShowRecovery] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const status = await getFreeUnlockStatus();
      setFreeUsed(status.used);
    });
  }, []);

  function handleFreeUnlock() {
    if (!selectedDevice) return;
    setError(null);
    startTransition(async () => {
      const res = await freeEmergencyUnlock(selectedDevice);
      if ("error" in res && res.error) {
        if (res.error === "already_used") {
          setFreeUsed(true);
          setError("You\u2019ve already used your free recovery. Use the $5 emergency unlock or contact support.");
        } else {
          setError(res.error);
        }
        return;
      }
      setUnlocked(true);
      setFreeUsed(true);
      // Redirect to the unlock page where they can reveal the passcode
      setTimeout(() => {
        router.push(`/dashboard/unlock/${selectedDevice}?emergency=success`);
      }, 1000);
    });
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
          FAQ
        </span>
      </div>

      <Accordion defaultValue={[]} className="max-w-2xl">
        <AccordionItem value="how-passcode">
          <AccordionTrigger className="text-sm text-left">
            How does the passcode work?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Latch generates a random 4-digit Screen Time passcode and encrypts it.
            You enter it on your device during setup. To see it again, you need to
            complete the word-typing challenge. The passcode is never stored in
            plaintext.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="multiple-devices">
          <AccordionTrigger className="text-sm text-left">
            Can I use Latch on multiple devices?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Yes. Each device gets its own passcode and unlock challenge. Add as
            many devices as you like from the dashboard.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="change-settings">
          <AccordionTrigger className="text-sm text-left">
            Can I change my word count or auto-unlock timer?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Yes — hover over a device card and click the gear icon. For active
            locks, you can increase the word count or extend the auto-unlock timer
            but not lower them. If you&apos;ve already unlocked, you have full control
            over settings.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cancel">
          <AccordionTrigger className="text-sm text-left">
            How do I cancel my subscription?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            Click &ldquo;Manage Subscription&rdquo; at the top of your dashboard. This opens
            the Stripe billing portal where you can cancel, upgrade, or update
            payment details.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="urgent">
          <AccordionTrigger className="text-sm text-left">
            I need to access my passcode urgently
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-4">
            <p>
              The typing challenge exists to create friction. If you&apos;re in a real
              emergency, you have two options:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Use the <strong>Emergency Unlock ($5)</strong> button on the unlock
                page to skip the challenge instantly.
              </li>
              <li>
                Contact support at{" "}
                <a href="mailto:support@getlatch.app" className="text-primary underline">
                  support@getlatch.app
                </a>
              </li>
            </ul>

            {!showRecovery && !freeUsed && (
              <button
                onClick={() => setShowRecovery(true)}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline"
              >
                I can&apos;t do either of those right now
              </button>
            )}

            {showRecovery && !freeUsed && !unlocked && (
              <div className="border border-border p-4 bg-card space-y-3 mt-2">
                <p className="text-xs text-muted-foreground">
                  You can unlock one device for free, one time per account.
                </p>

                {devices.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {devices.map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDevice(d.id)}
                          className={`border px-3 py-1.5 text-xs transition-colors ${
                            selectedDevice === d.id
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {d.name}
                        </button>
                      ))}
                    </div>

                    {error && (
                      <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button
                      onClick={handleFreeUnlock}
                      disabled={!selectedDevice || isPending}
                      variant="outline"
                      className="rounded-none text-xs tracking-widest uppercase gap-2"
                    >
                      <Unlock className="h-3 w-3" />
                      {isPending ? "Unlocking..." : "Unlock Device"}
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">No devices to unlock.</p>
                )}
              </div>
            )}

            {unlocked && (
              <div className="border border-primary/30 bg-primary/5 p-4 flex items-center gap-3">
                <Check className="h-4 w-4 text-primary" />
                <p className="text-xs text-primary">
                  Device unlocked. Redirecting to reveal your passcode...
                </p>
              </div>
            )}

            {freeUsed && !unlocked && showRecovery && (
              <p className="text-xs text-muted-foreground">
                You&apos;ve already used your free recovery. Use the $5 emergency unlock
                or contact{" "}
                <a href="mailto:support@getlatch.app" className="text-primary underline">
                  support
                </a>.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
