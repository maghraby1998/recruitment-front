"use client";

import { createContext, useContext, useState } from "react";

export enum UserType {
  EMPLOYEE = "EMPLOYEE",
  COMPANY = "COMPANY",
}

export type User = {
  id: string;
  user_type: UserType;
  email: string;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
  };
  company: {
    id: number;
    name: string;
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
