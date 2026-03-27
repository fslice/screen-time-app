import { Webhook } from "svix";
import { headers } from "next/headers";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("CLERK_WEBHOOK_SECRET is not set", { status: 500 });
  }

  // Verify the webhook signature using svix
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;
  try {
    evt = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  // Handle events
  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, primary_email_address_id } = evt.data;
    const email =
      email_addresses.find((e) => e.id === primary_email_address_id)
        ?.email_address ?? "";

    await db.user.upsert({
      where: { id },
      create: { id, email },
      update: { email },
    });
  }

  if (evt.type === "user.deleted" && evt.data.id) {
    // Cascade deletes handle related records (ScreenTimePassword, etc.)
    await db.user.delete({ where: { id: evt.data.id } }).catch(() => {
      // Ignore if user doesn't exist in our DB yet
    });
  }

  return new Response("OK", { status: 200 });
}
