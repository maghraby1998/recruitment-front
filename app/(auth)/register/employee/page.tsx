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
import { REGISTER_EMPLOYEE } from "@/app/_graphql/mutations";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
  })
  .required();

export default function EmployeeForm() {
  const router = useRouter();

  const [registerEmployee, { loading }] = useMutation(REGISTER_EMPLOYEE, {
    onCompleted: (data: any) => {
      router.replace("/");
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
    registerEmployee({
      variables: {
        input: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-5 w-[400px] border-black">
          <CardTitle className="flex items-center gap-3">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              <CircleArrowLeft />
            </button>
            <p>Employee Registration</p>
          </CardTitle>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="firstName">First Name</label>
              <Input
                id="firstName"
                {...register("firstName")}
                placeholder="First Name"
              />
              {errors.firstName?.message ? (
                <p className="text-red-500">{errors.firstName?.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="lastName">Last Name</label>
              <Input
                id="lastName"
                {...register("lastName")}
                placeholder="Last Name"
              />
              {errors.lastName?.message ? (
                <p className="text-red-500">{errors.lastName?.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <Input id="email" {...register("email")} placeholder="Email" />
              {errors.email?.message ? (
                <p className="text-red-500">{errors.email?.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                {...register("password")}
                placeholder="Password"
                type="password"
              />
              {errors.password?.message ? (
                <p className="text-red-500">{errors.password?.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Input
                id="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                type="password"
              />
              {errors.confirmPassword?.message ? (
                <p className="text-red-500">
                  {errors.confirmPassword?.message}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardAction className="ms-auto">
            <Button type="submit">Register</Button>
          </CardAction>
        </Card>
      </form>
    </div>
  );
}
