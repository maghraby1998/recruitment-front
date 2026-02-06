"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_JOB_POST_DETAILS } from "@/app/_graphql/queries";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CREATE_JOB_APPLICATIONS } from "@/app/_graphql/mutations";

export default function JobApplicationModal({}: {}) {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();

  const { register, handleSubmit } = useForm<any>();

  const jobId = params?.jobId;
  const handleClose = () => {
    router.back();
  };

  const { data } = useQuery<{
    jobPost: {
      title: string;
      description: string;
      form: {
        requireCV: boolean;
        questions: {
          id: string;
          label: string;
          isRequired: boolean;
          type: "TEXT" | "TEXTAREA" | "RADIO";
          options: { id: string; value: string }[];
        }[];
      };
    };
  }>(GET_JOB_POST_DETAILS, {
    skip: !jobId,
    variables: {
      id: jobId,
    },
  });

  const [applyForJob, { loading }] = useMutation(CREATE_JOB_APPLICATIONS, {
    onCompleted: (data: any) => {
      if (data?.applyForJob?.id) {
        handleClose();
      }
    },
  });

  const onSubmit = (data: any) => {
    console.log("submitting", data);

    const answers = data?.answers ?? [];

    const questionsIds = Object.keys(answers);
    applyForJob({
      variables: {
        input: {
          jobPostId: jobId,
          answers: questionsIds?.map((questionId) => ({
            questiondId: questionId,
            value: answers?.[questionId],
          })),
        },
      },
    });
  };
  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            {data?.jobPost?.form?.questions?.map((question) =>
              question?.type == "TEXT" || question?.type == "TEXTAREA" ? (
                <div className="my-2" key={question.id}>
                  <label className="font-semibold mb-2" htmlFor={question.id}>
                    {question.label}
                  </label>
                  {question.type == "TEXT" ? (
                    <Input
                      id={question.id}
                      {...register(`answers.${question.id}`, {
                        required: question.isRequired,
                      })}
                    />
                  ) : (
                    <textarea
                      className="border rounded-lg p-2 w-100"
                      id={question.id}
                      {...register(`answers.${question.id}`, {
                        required: question.isRequired,
                      })}
                    />
                  )}
                </div>
              ) : (
                <div className="my-2" key={question.id}>
                  <label
                    className="font-semibold mb-2 block"
                    htmlFor={question.id}
                  >
                    {question.label}
                  </label>
                  <select
                    id={question.id}
                    {...register(`answers.${question.id}`)}
                  >
                    {question.options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            )}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
