"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserAvatar from "@/components/ui/company-avatar";
import { BACKEND_URL } from "@/app/_config";
import { UserType } from "@/components/context-provider";

type UserBasicInfo = {
  id: string;
  user_type: string;
  employee?: {
    firstName: string;
    lastName: string;
    imgPath: string;
    position?: {
      title: string;
    };
  };
  company?: {
    name: string;
    imgPath: string;
  };
};

interface UserHoverCardProps {
  user: UserBasicInfo;
  children: React.ReactNode;
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEmployee = user.user_type === UserType.EMPLOYEE;
  const userName = isEmployee
    ? `${user.employee?.firstName} ${user.employee?.lastName}`
    : (user.company?.name ?? "Unknown");
  const userImage = isEmployee ? user.employee?.imgPath : user.company?.imgPath;
  const userPosition = isEmployee ? user.employee?.position?.title : undefined;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 200);
  };

  const handleClick = () => {
    router.push(`/users/${user.id}`);
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {showPopup && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-3 min-w-[200px]">
          <div className="flex items-center gap-3">
            {userImage ? (
              <Image
                src={`${BACKEND_URL}${userImage}`}
                alt={userName}
                width={50}
                height={50}
                className="rounded-full object-cover"
                style={{ width: 50, height: 50 }}
                unoptimized
              />
            ) : (
              <UserAvatar
                employee={
                  isEmployee
                    ? {
                        firstName: user.employee?.firstName ?? "",
                        lastName: user.employee?.lastName ?? "",
                        imgPath: "",
                      }
                    : undefined
                }
                company={
                  !isEmployee
                    ? { name: user.company?.name ?? "", imgPath: "" }
                    : undefined
                }
                userType={isEmployee ? "EMPLOYEE" : "COMPANY"}
                size="lg"
              />
            )}
            <div>
              <p className="font-semibold text-sm">{userName}</p>
              {userPosition && (
                <p className="text-xs text-gray-500">{userPosition}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
