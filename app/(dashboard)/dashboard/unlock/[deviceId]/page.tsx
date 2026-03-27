import { UnlockChallenge } from "@/components/unlock-challenge";

export default async function UnlockPage({
  params,
}: {
  params: Promise<{ deviceId: string }>;
}) {
  const { deviceId } = await params;

  return <UnlockChallenge deviceId={deviceId} />;
}
