"use client";

import { CREATE_EMPLOYEE_SKILL } from "@/app/_graphql/mutations";
import { GET_ALL_SKILLS, GET_MY_SKILLS } from "@/app/_graphql/queries";
import { Skill } from "@/components/employee-skills-section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSkill() {
  const router = useRouter();

  const [createSkill] = useMutation(CREATE_EMPLOYEE_SKILL, {
    onCompleted: () => {
      router.back();
    },
    refetchQueries: [{ query: GET_MY_SKILLS }],
  });

  const [name, setName] = useState<string>("");
  const [skillId, setSkillId] = useState<string | undefined>();

  const { data } = useQuery<{ skills: Skill[] }>(GET_ALL_SKILLS, {
    fetchPolicy: "network-only",
    skip: !name,
    variables: {
      search: name,
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleSave = () => {
    createSkill({
      variables: skillId
        ? {
            input: {
              skillId,
            },
          }
        : {
            input: {
              name: name,
            },
          },
    });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Skill</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <input
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value ?? "");
              setSkillId(undefined);
            }}
            className="p-2 border border-gray-400 rounded outline-gray-600 w-full"
            placeholder="Add Skill..."
          />
          {data?.skills && data.skills.length > 0 && !skillId && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
              {data.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSkillId(String(skill.id));
                    setName(skill.name);
                  }}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button disabled={!skillId && !name} onClick={handleSave}>
            save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
