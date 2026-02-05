"use client";

import { GET_JOB_POSTS, GET_MY_JOB_POSTS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { useSearchParams, useRouter } from "next/navigation";

enum JobPostStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type JobPost = {
  id: number;
  title: string;
  description: string;
  status: JobPostStatus;
  company: {
    name: string;
  };
};

function JobDetails({ job }: { job: JobPost }) {
  return (
    <div className="p-6 border-l w-100">
      <h1 className="font-bold text-xl mb-3 capitalize">{job.company.name}</h1>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-cyan-600 capitalize">
          {job.title}
        </h1>
        <Badge
          style={{
            backgroundColor:
              job.status === JobPostStatus.OPEN ? "green" : "red",
          }}
        >
          {job.status}
        </Badge>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{job.description}</p>
      </div>
    </div>
  );
}

export default function Jobs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data } = useQuery(GET_JOB_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  }) as {
    data: {
      jobPosts: [JobPost];
    };
    loading: any;
  };

  const jobPosts = data?.jobPosts as [JobPost];

  const selectedJobId = searchParams.get("jobId");
  const selectedJob = jobPosts?.find((job) => job.id == Number(selectedJobId));

  const handleJobSelect = (jobId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("jobId", jobId.toString());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="flex items-start gap-6 h-[90vh]">
      <div className="flex flex-col gap-3 flex-1 max-w-md h-full overflow-y-auto pr-2">
        {jobPosts?.map((jobPost) => (
          <Card
            key={jobPost.id}
            className={`p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedJob?.id === jobPost.id
                ? "border-cyan-500 border-2"
                : "border"
            }`}
            onClick={() => handleJobSelect(jobPost.id)}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-cyan-600 capitalize">{jobPost.title}</h2>
                <Badge
                  style={{
                    backgroundColor:
                      jobPost.status == JobPostStatus.OPEN ? "green" : "red",
                  }}
                >
                  {jobPost.status}
                </Badge>
              </div>
            </CardTitle>
            <CardContent className="p-0">{jobPost.company.name}</CardContent>
          </Card>
        ))}
      </div>
      {selectedJob ? (
        <div className="w-[300px] h-full overflow-y-auto">
          <JobDetails job={selectedJob} />
        </div>
      ) : null}
    </div>
  );
}
