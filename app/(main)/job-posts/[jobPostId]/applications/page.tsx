"use client";

import { GET_JOB_POST_APPLICATIONS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import UserAvatar from "@/components/ui/company-avatar";
import Link from "next/link";

enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export type Applicaion = {
  id: number;
  jobPost: {
    title: string;
    company: {
      name: string;
      imgPath: string;
    };
    form: {
      id: string;
      requireCV: boolean;
      questions: {
        id: string;
        label: string;
        isRequired: boolean;
        type: "TEXT" | "RADIO" | "TEXTAREA";
        options: {
          id: string;
          value: string;
        }[];
      }[];
    };
  };
  answers: {
    id: string;
    value: string;
    questionId: string;
  }[];
  CVFilePath: string;
  employee: {
    firstName: string;
    lastName: string;
    imgPath: string;
    user: {
      email: string;
    };
  };
  company: {
    name: string;
    imgPath: string;
  };
  status: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join(".")
    .toUpperCase()
    .slice(0, 3);
}

function EmployeeAvatar({
  employee,
  size = "md",
}: {
  employee: Applicaion["employee"];
  size?: "sm" | "md" | "lg";
}) {
  const sizeConfig = {
    sm: { className: "text-xs", pixels: 32 },
    md: { className: "text-sm", pixels: 40 },
    lg: { className: "text-base", pixels: 56 },
  };

  const { className, pixels } = sizeConfig[size];

  if (employee.imgPath) {
    return (
      <Image
        src={`http://localhost:5000${employee.imgPath}`}
        alt={employee.firstName}
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
      {getInitials(employee.firstName + " " + employee.lastName)}
    </div>
  );
}

export default function JobPostApplications() {
  const params = useParams();
  const jobPostId = params?.jobPostId;

  const { data } = useQuery(GET_JOB_POST_APPLICATIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    variables: {
      jobPostId,
    },
    skip: !jobPostId,
  }) as {
    data: {
      getJobPostApplications: [Applicaion];
    };
    loading: boolean;
  };

  const applications = data?.getJobPostApplications as [Applicaion];

  return (
    <div className="flex items-start gap-6 h-[85vh]">
      <div className="flex flex-col gap-3 flex-1 max-w-md h-full overflow-y-auto pr-2">
        {applications?.map((application) => (
          <Link
            key={application.id}
            href={`/job-posts/${jobPostId}/applications/${application?.id}`}
          >
            <Card
              className={`p-5 cursor-pointer transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  userType="EMPLOYEE"
                  employee={application.employee}
                  size="lg"
                />
                <div className="flex-1">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-cyan-600 capitalize">
                        {application.employee.firstName +
                          " " +
                          application.employee.lastName}
                      </h2>
                      <Badge
                        style={{
                          backgroundColor:
                            application.status == ApplicationStatus.PENDING
                              ? "orange"
                              : application.status == ApplicationStatus.ACCEPTED
                                ? "green"
                                : application.status ==
                                    ApplicationStatus.REJECTED
                                  ? "red"
                                  : "orangered",
                        }}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardContent className="p-0 text-sm my-1 text-gray-600">
                    {application.jobPost.title}
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
