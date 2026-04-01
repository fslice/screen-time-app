import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Latch",
  description: "Terms and conditions for using Latch.",
};

export default function TermsOfService() {
  return (
    <>
      <header className="py-6 px-6 border-b border-border">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="font-heading text-xl tracking-wide text-foreground"
          >
            Latch
          </Link>
        </div>
      </header>

      <main className="py-16 px-6">
        <article className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
          <h1 className="font-heading text-3xl mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: April 1, 2026
          </p>

          <h2>1. Overview</h2>
          <p>
            Latch is a web application that generates and securely stores a random Screen Time
            passcode for your Apple device, then locks it behind a word-typing challenge. By
            creating an account or using Latch, you agree to these terms.
          </p>

          <h2>2. How Latch Works</h2>
          <p>
            Latch generates a passcode that you enter into your device&apos;s Screen Time
            settings. Latch stores the passcode in encrypted form. To retrieve it, you must
            complete a typing challenge of the word count you selected. Latch does not connect
            to your device, Apple ID, or iCloud account in any way — it is a standalone web
            tool.
          </p>

          <h2>3. Account Responsibility</h2>
          <p>
            You are responsible for maintaining access to the email address associated with your
            Latch account. If you lose access to your account, we can assist via our support
            email, but we cannot guarantee recovery of your encrypted passcode outside of the
            normal unlock flow.
          </p>

          <h2>4. Subscriptions and Billing</h2>
          <p>Latch offers the following plans:</p>
          <ul>
            <li><strong>Monthly</strong> — $2.99/month, billed monthly.</li>
            <li><strong>Annual</strong> — $9.99/year, billed annually.</li>
            <li><strong>Lifetime</strong> — $14.99 one-time payment.</li>
          </ul>
          <p>
            Payments are processed by Stripe. Subscriptions renew automatically unless canceled
            before the end of the billing period. You can manage or cancel your subscription at
            any time from your dashboard.
          </p>

          <h2>5. Refunds</h2>
          <p>
            Monthly and annual subscriptions may be refunded within 7 days of the most recent
            charge if you have not used the unlock feature during that billing period. Lifetime
            purchases may be refunded within 14 days of purchase. To request a refund, email{" "}
            <a href="mailto:support@getlatch.app">support@getlatch.app</a>.
          </p>

          <h2>6. Disclaimer of Warranty</h2>
          <p>
            Latch is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
            guarantee that the service will be uninterrupted, error-free, or that it will meet
            your specific requirements. Latch is not affiliated with, endorsed by, or connected
            to Apple Inc. in any way.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Latch and its operators shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, including
            but not limited to loss of access to your device, loss of data, or inability to
            retrieve a passcode.
          </p>
          <p>
            Our total liability for any claim arising from use of the service shall not exceed
            the amount you paid to Latch in the 12 months preceding the claim.
          </p>

          <h2>8. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use Latch to lock someone else&apos;s device without their consent.</li>
            <li>Attempt to circumvent the unlock challenge through automated means.</li>
            <li>Reverse-engineer, decompile, or disassemble any part of the service.</li>
            <li>Use the service for any unlawful purpose.</li>
          </ul>

          <h2>9. Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these terms. You may delete
            your account at any time. Upon termination, your encrypted passcodes and associated
            data will be permanently deleted.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of Latch after changes
            constitutes acceptance of the updated terms.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:support@getlatch.app">support@getlatch.app</a>.
          </p>
        </article>
      </main>
    </>
  );
}
