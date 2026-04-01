import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Latch",
  description: "How Latch collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
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
          <h1 className="font-heading text-3xl mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-10">
            Last updated: April 1, 2026
          </p>

          <h2>1. What We Collect</h2>
          <p>
            When you create a Latch account, we collect your <strong>email address</strong> and
            basic profile information provided through our authentication provider (Clerk). We do
            not collect your name, phone number, or physical address unless you provide it voluntarily.
          </p>
          <p>
            When you add a device, we generate a random Screen Time passcode on our server and
            store it <strong>encrypted at rest</strong> using AES-256-GCM. We never store your
            passcode in plaintext. We also store the device name you choose and your unlock
            challenge settings (word count).
          </p>
          <p>
            When you subscribe, payment processing is handled entirely by <strong>Stripe</strong>.
            We store your Stripe customer ID and subscription status but never see or store your
            credit card number.
          </p>

          <h2>2. How We Use Your Data</h2>
          <ul>
            <li>To authenticate you and protect your account.</li>
            <li>To store and retrieve your encrypted passcodes when you complete an unlock challenge.</li>
            <li>To manage your subscription and billing status.</li>
            <li>To send transactional communications (e.g., payment confirmations).</li>
          </ul>
          <p>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>

          <h2>3. Third-Party Services</h2>
          <p>Latch uses the following services to operate:</p>
          <ul>
            <li><strong>Clerk</strong> — authentication and user management.</li>
            <li><strong>Stripe</strong> — payment processing.</li>
            <li><strong>Supabase</strong> — PostgreSQL database hosting.</li>
            <li><strong>Vercel</strong> — application hosting and deployment.</li>
          </ul>
          <p>
            Each service processes data according to their own privacy policies. We encourage you
            to review them.
          </p>

          <h2>4. Data Security</h2>
          <p>
            All passcodes are encrypted with AES-256-GCM before storage. Encryption keys are
            stored as environment variables and never committed to source control. All connections
            use TLS encryption in transit.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            Your data is retained as long as your account is active. If you delete your account,
            we delete your user record, all associated devices, encrypted passcodes, and challenge
            sessions. Stripe may retain payment records independently per their data retention
            policies.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Export your data in a portable format.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:support@getlatch.app">support@getlatch.app</a>.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Latch uses only essential cookies required for authentication and session management.
            We do not use advertising or tracking cookies.
          </p>

          <h2>8. Children</h2>
          <p>
            Latch is not directed at children under 13. We do not knowingly collect personal data
            from children under 13.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of material changes
            by posting the updated policy on this page with a revised date.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href="mailto:support@getlatch.app">support@getlatch.app</a>.
          </p>
        </article>
      </main>
    </>
  );
}
