"use client";

import { GET_MY_JOB_POSTS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";

enum JobPostStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type JobPost = {
  id: number;
  title: string;
  description: string;
  status: JobPostStatus;
};

export default function JobPosts() {
  const { data, loading } = useQuery(GET_MY_JOB_POSTS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  }) as {
    data: {
      myJobPosts: [JobPost];
    };
    loading: any;
  };

  const jobPosts = data?.myJobPosts as [JobPost];

  return (
    <div>
      <div className="flex flex-col gap-3">
        {jobPosts?.map((jobPost) => (
          <Card key={jobPost.id} className="p-5">
            <CardTitle className="flex items-center justify-between">
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
            </CardTitle>
            <CardContent className="p-0">{jobPost.description}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
