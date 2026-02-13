"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_JOB_POST_DETAILS, GET_JOB_POSTS } from "@/app/_graphql/queries";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CREATE_JOB_APPLICATIONS } from "@/app/_graphql/mutations";
import { FileText, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function JobApplicationModal({}: {}) {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();

  const { register, handleSubmit, watch, setValue } = useForm<any>();

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
    refetchQueries: [{ query: GET_JOB_POSTS }],
  });

  const onSubmit = (data: any) => {
    console.log("tt", data?.CVFilePdf?.[0]);

    const answers = data?.answers ?? [];

    const questionsIds = Object.keys(answers);
    applyForJob({
      variables: {
        input: {
          jobPostId: jobId,
          answers: questionsIds?.map((questionId) => ({
            questionId: questionId,
            value: answers?.[questionId],
          })),
        },
        CVFilePdf: data?.CVFilePdf?.[0],
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
                  <Select
                    value={watch(`answers.${question.id}`) ?? ""}
                    onValueChange={(val) =>
                      setValue(`answers.${question.id}`, val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options?.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ),
            )}
          </div>

          <div className="mb-3">
            {data?.jobPost?.form?.requireCV ? (
              watch("CVFilePdf")?.[0] ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">
                    {watch("CVFilePdf")[0].name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setValue("CVFilePdf", null)}
                    className="ml-auto shrink-0 rounded-full p-1 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="pdf"
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    Upload your CV (PDF)
                  </span>
                  <input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    {...register("CVFilePdf")}
                  />
                </label>
              )
            ) : null}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
