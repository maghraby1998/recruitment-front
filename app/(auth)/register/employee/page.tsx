"use client";

import { Card, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Camera, CircleArrowLeft, X } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@apollo/client/react";
import { REGISTER_EMPLOYEE } from "@/app/_graphql/mutations";

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
    image: yup.mixed<FileList>(),
  })
  .required();

type Inputs = yup.InferType<typeof schema>;

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
    watch,
    resetField,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema) as Resolver<Inputs>,
  });

  const selectedImage = watch("image");
  const imagePreview =
    selectedImage?.[0] && URL.createObjectURL(selectedImage[0]);

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
        image: data.image?.[0],
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
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => resetField("image")}
                      className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                  >
                    <Camera className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 text-xs text-gray-500">Upload</span>
                  </label>
                )}
                <input
                  id="image"
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {errors.image?.message ? (
                <p className="text-red-500 text-sm">{errors.image?.message}</p>
              ) : null}
            </div>

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
