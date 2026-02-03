"use client";

import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@apollo/client/react";
import { CREATE_JOB_POST, LOGIN } from "@/app/_graphql/mutations";
import Link from "next/link";
import { title } from "process";
import { description } from "@/components/chart-area-interactive";

type Inputs = {
  title: string;
  description: string;
};

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().max(500).required(),
  })
  .required();

export default function CreateJobPost() {
  const router = useRouter();

  const [createJobPost, { loading }] = useMutation(CREATE_JOB_POST, {
    onCompleted: (data: any) => {
      router.replace("/job-posts");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createJobPost({
      variables: {
        input: {
          title: data.title,
          description: data.description,
        },
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h1 className="font-bold text-lg mb-5">Create Job Post</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <Input id="title" {...register("title")} placeholder="Title" />
          {errors.title?.message ? (
            <p className="text-red-500">{errors.title?.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Password"
            className="border rounded-lg p-2"
          />
          {errors.description?.message ? (
            <p className="text-red-500">{errors.description?.message}</p>
          ) : null}
        </div>

        <Button className="ms-auto block" type="submit">
          Create
        </Button>
      </form>
    </div>
  );
}
