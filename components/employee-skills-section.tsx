"use client";

import React, { useState } from "react";
import { Card } from "./ui/card";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  GET_MY_SKILLS,
  GET_SKILLS_BASED_ON_POSITIONS,
} from "@/app/_graphql/queries";
import Link from "next/link";
import { PlusCircle, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

export type Skill = {
  id: number;
  name: string;
};

export const EmployeeSkillsSection: React.FC<{
  id: number;
  position: string;
}> = ({ position }) => {
  const { data } = useQuery<{ getMySkills: Skill[] }>(GET_MY_SKILLS);

  const [generatedSkills, setGeneratedSkills] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [generateSkills, { loading }] = useLazyQuery<{
    generateSkills: string[];
  }>(GET_SKILLS_BASED_ON_POSITIONS, {
    fetchPolicy: "network-only",
  });

  const handleGenerate = async () => {
    const { data: result } = await generateSkills({
      variables: { position },
    });
    if (result?.generateSkills) {
      setGeneratedSkills(result.generateSkills);
      setModalOpen(true);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setGeneratedSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiscard = () => {
    setModalOpen(false);
    setGeneratedSkills([]);
  };

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">Skills</h2>
          <Link href={"/account/new-skill"}>
            <PlusCircle />
          </Link>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles size={18} />
            {loading ? "Generating..." : "Generate with AI"}
          </button>
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

      <Dialog open={modalOpen} onOpenChange={handleDiscard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generated Skills</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {generatedSkills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-slate-500 text-white px-3 py-1.5 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="hover:bg-slate-600 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {generatedSkills.length === 0 && (
              <p className="text-gray-500 text-sm">
                All skills have been removed.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
            <Button disabled={generatedSkills.length === 0}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
