"use client";

import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@apollo/client/react";
import { CREATE_JOB_POST } from "@/app/_graphql/mutations";

type QuestionType = "TEXT" | "TEXTAREA" | "RADIO";

type Inputs = {
  title: string;
  description: string;
  form?: {
    requireCV?: boolean;
    questions?: {
      label: string;
      isRequired?: boolean;
      type: QuestionType;
      options?: {
        value?: string;
      }[];
    }[];
  };
};

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().max(500).required(),
    form: yup
      .object({
        requireCV: yup.boolean().optional(),
        questions: yup
          .array(
            yup.object({
              label: yup.string().required(),
              isRequired: yup.boolean().optional(),
              type: yup.string().required(),
              options: yup
                .array(
                  yup.object({
                    value: yup.string().optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
      })
      .notRequired(),
  })
  .required();

function QuestionItem({
  index,
  control,
  register,
  watch,
  errors,
  remove,
}: {
  index: number;
  control: any;
  register: any;
  watch: any;
  errors: any;
  remove: (index: number) => void;
}) {
  const questionType = watch(`form.questions.${index}.type`);

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `form.questions.${index}.options`,
  });

  return (
    <div className="border rounded-lg p-4 mb-3 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Question {index + 1}</h3>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
        >
          Remove
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`question-label-${index}`}>Question Label</label>
        <Input
          id={`question-label-${index}`}
          {...register(`form.questions.${index}.label`)}
          placeholder="e.g., What is your experience?"
        />
        {errors.form?.questions?.[index]?.label?.message ? (
          <p className="text-red-500">
            {errors.form?.questions?.[index]?.label?.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`question-type-${index}`}>Question Type</label>
        <select
          id={`question-type-${index}`}
          {...register(`form.questions.${index}.type`)}
          className="border rounded-lg p-2"
        >
          <option value="TEXT">Text</option>
          <option value="TEXTAREA">Long Text</option>
          <option value="RADIO">Multiple Choice</option>
        </select>
        {errors.form?.questions?.[index]?.type?.message ? (
          <p className="text-red-500">
            {errors.form?.questions?.[index]?.type?.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          id={`question-required-${index}`}
          {...register(`form.questions.${index}.isRequired`)}
          type="checkbox"
        />
        <label htmlFor={`question-required-${index}`}>Required</label>
      </div>

      {questionType === "RADIO" && (
        <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <label className="font-medium">Options</label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => appendOption({ value: "" })}
            >
              Add Option
            </Button>
          </div>

          {optionFields.map((optionField, optionIndex) => (
            <div key={optionField.id} className="flex items-center gap-2">
              <Input
                {...register(
                  `form.questions.${index}.options.${optionIndex}.value`,
                )}
                placeholder={`Option ${optionIndex + 1}`}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeOption(optionIndex)}
              >
                Remove
              </Button>
            </div>
          ))}

          {optionFields.length === 0 && (
            <p className="text-sm text-gray-500">
              No options yet. Click "Add Option" to add choices.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CreateJobPost() {
  const router = useRouter();

  const [createJobPost, { loading }] = useMutation(CREATE_JOB_POST, {
    onCompleted: () => {
      router.replace("/job-posts");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema) as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "form.questions",
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createJobPost({
      variables: {
        input: {
          title: data.title,
          description: data.description,
          form: data.form,
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
            placeholder="Description"
            className="border rounded-lg p-2"
          />
          {errors.description?.message ? (
            <p className="text-red-500">{errors.description?.message}</p>
          ) : null}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              id="requireCV"
              {...register("form.requireCV")}
              type="checkbox"
            />
            <label htmlFor="requireCV">Require CV from applicants</label>
          </div>
          {errors.form?.requireCV?.message ? (
            <p className="text-red-500">{errors.form?.requireCV?.message}</p>
          ) : null}
        </div>

        <div className="mb-4">
          <div className="flex items-center border-b pb-2 justify-between mb-3">
            <h2 className="font-semibold">Application Questions</h2>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                append({
                  label: "",
                  type: "TEXT",
                  isRequired: false,
                  options: [],
                })
              }
            >
              Add Question
            </Button>
          </div>

          {fields.map((field, index) => {
            return (
              <QuestionItem
                key={field.id}
                index={index}
                control={control}
                register={register}
                watch={watch}
                errors={errors}
                remove={remove}
              />
            );
          })}
        </div>

        <Button className="ms-auto block" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
}
