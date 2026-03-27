import { currentUser } from "@clerk/nextjs/server";
import { getDevices } from "@/lib/actions/device";
import { DeviceList } from "@/components/device-list";

export default async function DashboardPage() {
  const user = await currentUser();
  const devices = await getDevices();

  return (
    <div className="space-y-12">
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
      </div>

      <DeviceList devices={devices} />
    </div>
  );
}
