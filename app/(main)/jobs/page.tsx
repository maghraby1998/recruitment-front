"use client";

import { GET_JOB_POSTS, GET_MY_JOB_POSTS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    imgPath: string;
  };
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join(".")
    .toUpperCase()
    .slice(0, 3);
}

function CompanyAvatar({
  company,
  size = "md",
}: {
  company: JobPost["company"];
  size?: "sm" | "md" | "lg";
}) {
  const sizeConfig = {
    sm: { className: "text-xs", pixels: 32 },
    md: { className: "text-sm", pixels: 40 },
    lg: { className: "text-base", pixels: 56 },
  };

  const { className, pixels } = sizeConfig[size];

  if (company.imgPath) {
    return (
      <Image
        src={`http://localhost:5000${company.imgPath}`}
        alt={company.name}
        width={pixels}
        height={pixels}
        className="rounded"
        style={{ width: pixels, height: pixels, objectFit: "cover" }}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-cyan-100 text-cyan-700 font-semibold flex items-center justify-center`}
      style={{ width: pixels, height: pixels }}
    >
      {getInitials(company.name)}
    </div>
  );
}

function JobDetails({ job }: { job: JobPost }) {
  return (
    <div className="p-6 border-l w-100 flex-1">
      <div className="flex items-center gap-3 mb-3">
        <CompanyAvatar company={job.company} />
        <h1 className="font-bold text-xl capitalize">{job.company.name}</h1>
      </div>
      <div className="flex items-center gap-3 my-3">
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
      <Link
        className="my-3 bg-slate-500 text-white px-2 py-1 rounded block w-fit"
        href={`/jobs/${job.id}/apply?jobId=${job.id}`}
      >
        Apply
      </Link>
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
    loading: boolean;
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
    <div className="flex items-start gap-6 h-[85vh]">
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
            <div className="flex items-center gap-3">
              <CompanyAvatar company={jobPost.company} size="lg" />
              <div className="flex-1">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-cyan-600 capitalize">
                      {jobPost.title}
                    </h2>
                    <Badge
                      style={{
                        backgroundColor:
                          jobPost.status == JobPostStatus.OPEN
                            ? "green"
                            : "red",
                      }}
                    >
                      {jobPost.status}
                    </Badge>
                  </div>
                </CardTitle>
                <CardContent className="p-0">
                  {jobPost.company.name}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedJob ? <JobDetails job={selectedJob} /> : null}
    </div>
  );
}
