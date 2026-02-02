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
import { LOGIN, REGISTER_EMPLOYEE } from "@/app/_graphql/mutations";
import Link from "next/link";
import { useAuth } from "@/components/context-provider";

type Inputs = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().min(6).required(),
  })
  .required();

export default function Login() {
  const router = useRouter();

  const [attemptLogin, { loading }] = useMutation(LOGIN, {
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
    attemptLogin({
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="p-5 w-[400px] border-black">
          <CardTitle className="flex items-center gap-3">Login</CardTitle>
          <CardContent className="flex flex-col gap-3">
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
          </CardContent>
          <p>
            Don't have an account yet ? <Link href={"/register"}>Register</Link>
          </p>
          <CardAction className="ms-auto">
            <Button type="submit">Login</Button>
          </CardAction>
        </Card>
      </form>
    </div>
  );
}
