"use client";

import { GET_JOB_POSTS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserAvatar from "@/components/ui/company-avatar";
import { useAuth } from "@/components/context-provider";
import moment from "moment";
import { Pagination, type PaginationMeta } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skill } from "@/components/employee-skills-section";

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
  applicationsNumber: number;
  created_at: Date;
  canApply: boolean;
  skills: Skill[];
  position: {
    id: number;
    title: string;
  };
};

function JobDetails({ job }: { job: JobPost }) {
  const authUser = useAuth();

  return (
    <div className="p-6 border-l w-100 flex-1 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <UserAvatar company={job.company} userType="COMPANY" size="lg" />
        <div>
          <h1 className="font-bold text-xl capitalize text-gray-900">{job.company.name}</h1>
          <p className="text-sm text-gray-500">Posted {moment(job?.created_at).fromNow()}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-cyan-600 capitalize">
          {job.title}
        </h1>
        <Badge
          className={job.status === JobPostStatus.OPEN ? "bg-green-500" : "bg-red-500"}
        >
          {job.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-gray-900">{job.applicationsNumber ?? 0}</span> Applicants
        </span>
        {job?.position?.title && (
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">{job.position.title}</span>
          </span>
        )}
      </div>
      
      {authUser?.user?.user_type == "EMPLOYEE" ? (
        job?.canApply ? (
          <Link
            className="inline-flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition-colors mb-6"
            href={`/jobs/${job.id}/apply?jobId=${job.id}`}
          >
            Apply Now
          </Link>
        ) : (
          <p className="inline-flex items-center justify-center bg-gray-200 text-gray-600 px-4 py-2 rounded-md font-medium mb-6">
            Applied
          </p>
        )
      ) : null}
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>
        
        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  className="bg-cyan-50 text-cyan-700 border border-cyan-200 rounded-full px-3 py-1 text-sm font-medium"
                  key={skill.id}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Jobs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/jobs?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilter("search", searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/jobs?${params.toString()}`);
  };

  const filter: Record<string, unknown> = {};
  if (search) filter.search = search;
  if (status && status !== "all") filter.status = status;

  const { data } = useQuery(GET_JOB_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      pagination: { page, limit: 10 },
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    },
  }) as {
    data: {
      jobPosts: {
        data: JobPost[];
        meta: PaginationMeta;
      };
    };
    loading: boolean;
  };

  const jobPosts = data?.jobPosts?.data;
  const paginationMeta = data?.jobPosts?.meta;

  const selectedJobId = searchParams.get("jobId");
  const selectedJob = jobPosts?.find((job) => job.id == Number(selectedJobId));

  const handleJobSelect = (jobId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("jobId", jobId.toString());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search jobs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Select
          value={status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
                <UserAvatar
                  company={jobPost.company}
                  userType="COMPANY"
                  size="lg"
                />
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
                    <p className="text-gray-500">
                      {moment(jobPost?.created_at).fromNow()}
                    </p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
          {paginationMeta && (
            <>
              <Pagination meta={paginationMeta} onPageChange={setPage} />
            </>
          )}
        </div>
        {selectedJob ? <JobDetails job={selectedJob} /> : null}
      </div>
    </div>
  );
}
