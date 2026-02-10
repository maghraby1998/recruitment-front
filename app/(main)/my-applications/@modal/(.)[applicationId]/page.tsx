import ApplicationDetailsComp from "@/components/ApplicationDetails";

export default async function ApplicationDetails({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const applicationId = (await params).applicationId;
  return (
    <ApplicationDetailsComp applicationId={applicationId} userType="EMPLOYEE" />
  );
}
