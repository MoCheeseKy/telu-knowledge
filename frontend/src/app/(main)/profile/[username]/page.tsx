import OtherProfile from "@/components/_views/Profiles/OtherProfile";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function OtherProfilePage({
  params,
}: PageProps) {
  const { username } = await params;

  return <OtherProfile username={username} />;
}
