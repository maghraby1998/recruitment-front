"use client";

import { GET_USER } from "@/app/_graphql/queries";
import { useQuery } from "@apollo/client/react";
import { use } from "react";
import Image from "next/image";
import { Card } from "./ui/card";
import UserAvatar from "./ui/company-avatar";
import { BACKEND_URL } from "@/app/_config";

const pixels = 150;

type Experience = {
  id: string;
  position: {
    id: string;
    title: string;
  };
  description: string;
  company: {
    id: string;
    name: string;
    imgPath: string;
  };
  companyName: string;
  from: string;
  to: string;
};

type Skill = {
  id: string;
  name: string;
};

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  imgPath: string;
  position: {
    id: string;
    title: string;
  };
  skills: Skill[];
  experiences: Experience[];
};

type Company = {
  name: string;
  imgPath: string;
};

type User = {
  id: string;
  email: string;
  user_type: string;
  employee?: Employee;
  company?: Company;
};

export const UserProfileView = ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = use(params);

  const { data, loading } = useQuery<{ getUser: User }>(GET_USER, {
    variables: { userId },
  });

  const user = data?.getUser;
  const isEmployee = user?.user_type === "EMPLOYEE";

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const employee = user.employee;

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <div className="flex gap-5">
          {isEmployee && employee?.imgPath ? (
            <Image
              alt={employee?.firstName ?? ""}
              width={pixels}
              height={pixels}
              className="rounded"
              style={{
                width: pixels,
                height: pixels,
                objectFit: "cover",
                borderRadius: 999,
              }}
              unoptimized
              src={`${BACKEND_URL}${employee?.imgPath}`}
            />
          ) : isEmployee ? (
            <UserAvatar
              userType="EMPLOYEE"
              employee={employee}
              customSize={{
                fontSize: 30,
                pixels: 150,
              }}
            />
          ) : user.company?.imgPath ? (
            <Image
              alt={user.company?.name ?? ""}
              width={pixels}
              height={pixels}
              className="rounded"
              style={{
                width: pixels,
                height: pixels,
                objectFit: "cover",
                borderRadius: 999,
              }}
              unoptimized
              src={`${BACKEND_URL}${user.company?.imgPath}`}
            />
          ) : (
            <UserAvatar
              userType="COMPANY"
              company={{ name: user.company?.name ?? "", imgPath: "" }}
              customSize={{
                fontSize: 30,
                pixels: 150,
              }}
            />
          )}
          <div>
            <h3 className="capitalize font-bold text-2xl mb-2">
              {isEmployee
                ? `${employee?.firstName} ${employee?.lastName}`
                : user.company?.name}
            </h3>
            <h4 className="capitalize font-semibold text-gray-500">
              {isEmployee ? employee?.position?.title : "Company"}
            </h4>
          </div>
        </div>
      </Card>

      {isEmployee && employee?.skills && employee.skills.length > 0 && (
        <Card className="p-5">
          <h4 className="font-semibold text-lg mb-3">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill) => (
              <span
                key={skill.id}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {isEmployee &&
        employee?.experiences &&
        employee.experiences.length > 0 && (
          <Card className="p-5">
            <h4 className="font-semibold text-lg mb-3">Experience</h4>
            <div className="space-y-4">
              {employee.experiences.map((exp) => (
                <div key={exp.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    {exp.company?.imgPath ? (
                      <Image
                        alt={exp.company.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                        unoptimized
                        src={`${BACKEND_URL}${exp.company.imgPath}`}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">
                          {exp.companyName?.[0] ?? "C"}
                        </span>
                      </div>
                    )}
                    <div>
                      <h5 className="font-semibold">{exp.position?.title}</h5>
                      <p className="text-sm text-gray-500">
                        {exp.companyName || exp.company?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {exp.from} - {exp.to || "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
    </div>
  );
};
