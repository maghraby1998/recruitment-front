import ApplicationDetailsComp from "@/components/ApplicationDetails";

export default async function JobPostApplication({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const applicationId = (await params).applicationId;
  return (
    <ApplicationDetailsComp applicationId={applicationId} userType="COMPANY" />
  );
}
