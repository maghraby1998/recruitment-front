"use client";

import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { usePathname } from "next/navigation";
import { allLinks } from "./app-sidebar";
import {
  GET_MY_NOTIFICATIONS,
  GET_NOTIFICATIONS_COUNT,
} from "@/app/_graphql/queries";
import { gql } from "@apollo/client";
import { IconBell } from "@tabler/icons-react";

const NOTIFICATION_RECEIVED_SUBSCRIPTION = gql`
  subscription OnNotificationReceived {
    notificationReceived {
      id
      title
      body
      created_at
    }
  }
`;

export function SiteHeader() {
  const pathName = usePathname();
  const [page, setPage] = useState(1);

  const { data } = useQuery(GET_MY_NOTIFICATIONS, {
    variables: {
      pagination: { page, limit: 5 },
    },
    notifyOnNetworkStatusChange: true,
  }) as {
    data?: {
      myNotifications: {
        data: { id: string; title: string; body: string; created_at: string }[];
        pagination: {
          totalItems: number;
          totalPages: number;
          currentPage: number;
          limit: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        };
      };
    };
  };

  const notifications = data?.myNotifications?.data || [];
  const pagination = data?.myNotifications?.pagination;

  const { data: countData, refetch: refetchCount } = useQuery(
    GET_NOTIFICATIONS_COUNT,
    {
      fetchPolicy: "network-only",
    },
  ) as {
    data?: {
      notificationsCount: number;
    };
    refetch: () => void;
  };
  const unreadCount = countData?.notificationsCount ?? 0;

  useSubscription(NOTIFICATION_RECEIVED_SUBSCRIPTION, {
    onData: () => {
      console.log("subscription data received");

      refetchCount();
    },
  });

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {allLinks.find((link) => pathName.startsWith(link.url))?.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <IconBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {/* {unreadCount > 9 ? "9+" : unreadCount} */}
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 max-h-96 overflow-y-auto"
            >
              <div className="px-2 py-1.5 text-sm font-semibold">
                Notifications
              </div>
              <Separator />
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <>
                  {notifications.map((notification: any) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                    >
                      <span className="font-medium text-sm">
                        {notification.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {notification.body}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  {pagination && pagination.totalPages > 1 && (
                    <>
                      <Separator />
                      <div className="p-2">
                        <Pagination
                          meta={pagination}
                          onPageChange={(newPage) => setPage(newPage)}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
