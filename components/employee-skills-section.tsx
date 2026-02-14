"use client";

import React from "react";
import { Card } from "./ui/card";
import { useQuery } from "@apollo/client/react";
import { GET_MY_SKILLS } from "@/app/_graphql/queries";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export type Skill = {
  id: number;
  name: string;
};

export const EmployeeSkillsSection: React.FC<{ id: number }> = () => {
  const { data } = useQuery<{ getMySkills: Skill[] }>(GET_MY_SKILLS);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-lg">Skills</h2>
        <Link href={"/account/new-skill"}>
          <PlusCircle />
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        {data?.getMySkills?.map((skill) => (
          <p
            className="bg-slate-500 text-white w-fit p-2 rounded-full"
            key={skill.id}
          >
            {skill.name}
          </p>
        ))}
      </div>
    </Card>
  );
};
