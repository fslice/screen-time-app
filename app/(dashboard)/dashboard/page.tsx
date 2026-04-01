import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { getDevices } from "@/lib/actions/device";
import { getSubscription } from "@/lib/subscription";
import { DeviceList } from "@/components/device-list";
import { ManageSubscription } from "@/components/manage-subscription";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();
  const { userId } = await auth();

  let devices: Awaited<ReturnType<typeof getDevices>> = [];
  try {
    devices = await getDevices();
  } catch (e) {
    console.error("Failed to fetch devices:", e);
  }

  const subscription = userId ? await getSubscription(userId) : null;
  const isActive =
    subscription?.status === "active" || subscription?.status === "lifetime";

  const dashboardHeader = (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-8 bg-primary" />
        <span className="text-xs tracking-[0.25em] uppercase text-primary">
          Dashboard
        </span>
      </div>
      <h1 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
        Your Devices
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Signed in as{" "}
        <span className="text-foreground">
          {user?.emailAddresses[0]?.emailAddress}
        </span>
      </p>

      {subscription ? (
        <div className="mt-4">
          <ManageSubscription
            status={subscription.status}
            planType={subscription.planType}
          />
        </div>
      ) : (
        <div className="mt-4 border border-primary/30 bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            You don&apos;t have an active plan.{" "}
            <Link href="/#pricing" className="text-primary underline">
              Choose a plan
            </Link>{" "}
            to start locking down your devices.
          </p>
        </div>
      )}
    </div>
  );

  if (!isActive) {
    return (
      <div className="space-y-12">
        {dashboardHeader}
        <div className="border border-border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Subscribe to add and manage devices.
          </p>
          <Link
            href="/#pricing"
            className="text-primary text-sm underline mt-2 inline-block"
          >
            View plans
          </Link>
        </div>
      </div>
    );
  }

  return <DeviceList devices={devices} header={dashboardHeader} />;
}
