"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_APPLICATION_ANSWERS_DETAILS,
  GET_JOB_POST_APPLICATIONS,
  GET_MY_APPLICATIONS,
} from "@/app/_graphql/queries";
import { Applicaion } from "@/app/(main)/job-posts/[jobPostId]/applications/page";
import { Button } from "./ui/button";
import { UPDATE_APPLICATION_STATUS } from "@/app/_graphql/mutations";
import { BACKEND_URL } from "@/app/_config";

interface Props {
  applicationId: string;
  userType: "EMPLOYEE" | "COMPANY";
}

const ApplicationDetailsComp: React.FC<Props> = ({
  applicationId,
  userType,
}) => {
  const router = useRouter();

  const { data } = useQuery<{ application: Applicaion }>(
    GET_APPLICATION_ANSWERS_DETAILS,
    {
      skip: !applicationId,
      variables: {
        id: applicationId,
      },
    },
  );

  const questions = data?.application?.jobPost?.form?.questions ?? [];
  const answers = data?.application?.answers ?? [];

  const handleClose = () => {
    router.back();
  };

  const [updateStatus] = useMutation(UPDATE_APPLICATION_STATUS, {
    onCompleted: () => {
      router.back();
    },
    refetchQueries:
      userType == "COMPANY"
        ? [
            {
              query: GET_JOB_POST_APPLICATIONS,
              variables: {
                jobPostId: data?.application?.jobPost?.id,
              },
            },
          ]
        : [{ query: GET_MY_APPLICATIONS }],
  });

  const handleUpdateApplicationStatus = (status: Applicaion["status"]) => {
    updateStatus({
      variables: {
        input: {
          id: applicationId,
          status,
        },
      },
    });
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          {data?.application?.CVFilePath && (
            <a
              target="_blank"
              href={`${BACKEND_URL}${data?.application?.CVFilePath}`}
              className="flex items-center gap-3 rounded-lg border p-3 mb-3 hover:bg-muted transition-colors"
            >
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm font-medium">Resume / CV</span>
              <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          )}
          {questions?.map((question, index) => (
            <div key={question?.id}>
              {index != 0 ? <hr className="bg-black h-[1px] my-2" /> : null}
              <div>
                <p className="font-semibold mb-1 text-gray-500">
                  {question?.label}
                </p>
                {question?.type == "TEXT" || question?.type == "TEXTAREA" ? (
                  <p className="font-semibold">
                    {
                      answers?.find(
                        (answer) => answer?.questionId == question?.id,
                      )?.value
                    }
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    {question?.options?.map((option) => (
                      <p
                        className={`px-2 py-1 rounded border border-slate-500 w-fit capitalize ${
                          answers?.find(
                            (answer) => answer?.questionId == question?.id,
                          )?.value == option?.id
                            ? "bg-slate-500 text-white"
                            : ""
                        }`}
                        key={option.id}
                      >
                        {option?.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {data?.application?.status == "PENDING" ? (
            userType == "EMPLOYEE" ? (
              <div className="my-3 ms-auto">
                <Button
                  variant={"destructive"}
                  onClick={() => handleUpdateApplicationStatus("CANCELLED")}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="my-3 flex items-center gap-3 ms-auto">
                <Button
                  variant={"destructive"}
                  onClick={() => handleUpdateApplicationStatus("REJECTED")}
                >
                  Reject
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateApplicationStatus("IN_CONSIDERATION")
                  }
                >
                  Consider
                </Button>
              </div>
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsComp;
