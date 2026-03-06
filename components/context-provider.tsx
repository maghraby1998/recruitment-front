"use client";

import { createContext, useContext, useState } from "react";

export enum UserType {
  EMPLOYEE = "EMPLOYEE",
  COMPANY = "COMPANY",
}

export type Experience = {
  id: number;
  position: {
    id: number;
    title: string;
  };
  description: string;
  company: {
    id: number;
    name: string;
    imgPath: string;
  } | null;
  companyName: string;
  from: string;
  to: string | null;
};

export type User = {
  id: string;
  user_type: UserType;
  email: string;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    imgPath: string;
    position: {
      id: number;
      title: string;
    };
    experiences: Experience[];
  };
  company: {
    id: number;
    name: string;
    imgPath: string;
  };
} | null;

type AuthContextType = {
  user: User;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
