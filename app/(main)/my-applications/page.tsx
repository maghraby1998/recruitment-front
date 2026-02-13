"use client";

import { GET_MY_APPLICATIONS } from "@/app/_graphql/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import UserAvatar from "@/components/ui/company-avatar";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";

enum ApplicationStatus {
  PENDING = "PENDING",
  IN_CONSIDERATION = "IN_CONSIDERATION",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

type Applicaion = {
  id: number;
  jobPost: {
    title: string;
    company: {
      name: string;
      imgPath: string;
    };
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

function CompanyAvatar({
  company,
  size = "md",
}: {
  company: Applicaion["jobPost"]["company"];
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

export default function MyApplications() {
  1;
  const { data } = useQuery(GET_MY_APPLICATIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
  }) as {
    data: {
      getMyApplications: [Applicaion];
    };
    loading: boolean;
  };

  const applications = data?.getMyApplications as [Applicaion];

  return (
    <div className="flex items-start gap-6 h-[85vh]">
      <div className="flex flex-col gap-3 flex-1 max-w-md h-full overflow-y-auto pr-2">
        {applications?.map((application) => (
          <Link
            key={application.id}
            href={`/my-applications/${application.id}`}
          >
            <Card
              className={`p-5 cursor-pointer transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <UserAvatar
                  company={application.jobPost.company}
                  userType="COMPANY"
                  size="lg"
                />
                <div className="flex-1">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-cyan-600 capitalize">
                        {application.jobPost.company.name}
                      </h2>
                      <Badge
                        style={{
                          backgroundColor:
                            application.status == ApplicationStatus.PENDING
                              ? "orange"
                              : application.status ==
                                  ApplicationStatus.IN_CONSIDERATION
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
