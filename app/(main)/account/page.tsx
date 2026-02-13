"use client";

import { useAuth } from "@/components/context-provider";
import { EmployeeAccountPage } from "@/components/employee-account-page";

export default function AccountPage() {
  const auth = useAuth();

  return auth?.user?.user_type == "EMPLOYEE" ? (
    <EmployeeAccountPage />
  ) : (
    <div>company page</div>
  );
}
