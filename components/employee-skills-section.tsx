"use client";

import React from "react";
import { Card } from "./ui/card";

export const EmployeeSkillsSection: React.FC<{ id: number }> = () => {
  return (
    <Card className="p-5">
      <h2 className="font-semibold text-lg">Skills</h2>
    </Card>
  );
};
