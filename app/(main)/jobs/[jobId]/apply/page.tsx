export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const jobId = (await params).jobId;
  return (
    <div>
      <p>Job application page {jobId}</p>
      {/* This page shows on direct navigation/refresh */}
    </div>
  );
}
