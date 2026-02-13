"use client";

import { GET_MY_JOB_POSTS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Pagination, type PaginationMeta } from "@/components/ui/pagination";

enum JobPostStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type JobPost = {
  id: number;
  title: string;
  description: string;
  status: JobPostStatus;
  applicationsNumber: number;
};

export default function JobPosts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/job-posts?${params.toString()}`);
  };

  const { data, loading } = useQuery(GET_MY_JOB_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      pagination: { page, limit: 10 },
    },
  }) as {
    data: {
      myJobPosts: {
        data: JobPost[];
        meta: PaginationMeta;
      };
    };
    loading: any;
  };

  const jobPosts = data?.myJobPosts?.data;
  const paginationMeta = data?.myJobPosts?.meta;

  return (
    <div>
      <div className="flex flex-col gap-3">
        {jobPosts?.map((jobPost) => (
          <Card key={jobPost.id} className="p-5">
            <CardTitle>
              <div className="flex items-center gap-2">
                <h2 className="text-cyan-600">{jobPost.title}</h2>
                <Badge
                  style={{
                    backgroundColor:
                      jobPost.status == JobPostStatus.OPEN ? "green" : "red",
                  }}
                >
                  {jobPost.status}
                </Badge>
              </div>
              <Link href={`/job-posts/${jobPost.id}/applications`}>
                <p className="my-2 text-gray-600 font-normal">
                  <b>{jobPost.applicationsNumber ?? 0}</b> Applicants
                </p>
              </Link>
            </CardTitle>
            <CardContent className="p-0">{jobPost.description}</CardContent>
          </Card>
        ))}
        {paginationMeta && (
          <Pagination meta={paginationMeta} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
