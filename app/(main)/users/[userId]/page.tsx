"use client";

import { UserProfileView } from "@/components/user-profile-view";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return <UserProfileView params={params} />;
}
