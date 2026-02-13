"use client";

import { GET_AUTH_USER } from "@/app/_graphql/queries";
import { useQuery } from "@apollo/client/react";
import { User } from "./context-provider";
import Image from "next/image";

const pixels = 150;

export const EmployeeAccountPage = () => {
  const { data } = useQuery<{ getAuthUser: User }>(GET_AUTH_USER);

  const employee = data?.getAuthUser?.employee;

  return employee ? (
    <div>
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
        src={`http://localhost:5000${employee?.imgPath}`}
      />
      <h3 className="capitalize font-bold text-2xl">{`${employee?.firstName} ${employee?.lastName}`}</h3>
    </div>
  ) : null;
};
