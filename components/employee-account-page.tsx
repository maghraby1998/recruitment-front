"use client";

import { GET_AUTH_USER } from "@/app/_graphql/queries";
import { CHANGE_PROFILE_IMAGE } from "@/app/_graphql/mutations";
import { useMutation, useQuery } from "@apollo/client/react";
import { User } from "./context-provider";
import Image from "next/image";
import { EmployeeSkillsSection } from "./employee-skills-section";
import { Card } from "./ui/card";
import UserAvatar from "./ui/company-avatar";
import { BACKEND_URL } from "@/app/_config";
import { Camera } from "lucide-react";
import { useRef } from "react";

const pixels = 150;

export const EmployeeAccountPage = () => {
  const { data } = useQuery<{ getAuthUser: User }>(GET_AUTH_USER);
  const [changeImage, { loading: changingImage }] = useMutation(
    CHANGE_PROFILE_IMAGE,
    { refetchQueries: [{ query: GET_AUTH_USER }] }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const employee = data?.getAuthUser?.employee;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await changeImage({ variables: { image: file } });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return employee ? (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <div className="relative w-fit">
          {employee.imgPath ? (
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
                marginBottom: 15,
              }}
              unoptimized
              src={`${BACKEND_URL}${employee?.imgPath}`}
            />
          ) : (
            <UserAvatar
              userType="EMPLOYEE"
              employee={employee}
              customSize={{
                fontSize: 30,
                pixels: 150,
              }}
            />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            disabled={changingImage}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-3 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div>
          <h3 className="capitalize font-bold text-2xl mb-2">{`${employee?.firstName} ${employee?.lastName}`}</h3>
          <h4 className="capitalize font-semibold text-gray-500">
            {employee.position.title}
          </h4>
        </div>
      </Card>

      <EmployeeSkillsSection
        id={employee?.id}
        position={employee.position.title}
      />
    </div>
  ) : null;
};
