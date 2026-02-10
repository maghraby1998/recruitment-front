"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_APPLICATION_ANSWERS_DETAILS } from "@/app/_graphql/queries";
import { Applicaion } from "@/app/(main)/job-posts/[jobPostId]/applications/page";

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

  console.log("data", data?.application);

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsComp;
