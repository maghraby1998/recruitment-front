"use client";

import React, { useState } from "react";
import { Card } from "./ui/card";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client/react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Image from "next/image";
import { CREATE_EXPERIENCE, DELETE_EXPERIENCE } from "@/app/_graphql/mutations";
import {
  GET_AUTH_USER,
  GET_POSITIONS,
  GET_COMPANIES,
} from "@/app/_graphql/queries";
import { Experience, User } from "./context-provider";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { BACKEND_URL } from "@/app/_config";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join(".")
    .toUpperCase()
    .slice(0, 3);
}

type Option = {
  value: string;
  label: string;
  __isNew__?: boolean;
};

type FormData = {
  position: Option | null;
  company: Option | null;
  description: string;
  from: string;
  to: string;
  isCurrentJob: boolean;
};

type PositionOption = { id: string; title: string };
type CompanyOption = { id: string; name: string };

export const EmployeeExperiencesSection: React.FC = () => {
  const { data } = useQuery<{ getAuthUser: User }>(GET_AUTH_USER);
  const [modalOpen, setModalOpen] = useState(false);

  const [positionInput, setPositionInput] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      position: null,
      company: null,
      description: "",
      from: "",
      to: "",
      isCurrentJob: false,
    },
  });

  const [loadPositions, { data: positionsData }] = useLazyQuery<{
    positions: PositionOption[];
  }>(GET_POSITIONS);
  const [loadCompanies, { data: companiesData }] = useLazyQuery<{
    companies: CompanyOption[];
  }>(GET_COMPANIES);

  const [createExperience, { loading: creating }] = useMutation(
    CREATE_EXPERIENCE,
    {
      refetchQueries: [{ query: GET_AUTH_USER }],
    },
  );

  const [deleteExperience, { loading: deleting }] = useMutation(
    DELETE_EXPERIENCE,
    {
      refetchQueries: [{ query: GET_AUTH_USER }],
    },
  );

  const experiences = data?.getAuthUser?.employee?.experiences || [];

  const positionOptions =
    positionsData?.positions?.map((p) => ({
      value: p.id,
      label: p.title,
    })) || [];

  const companyOptions =
    companiesData?.companies?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || [];

  const handlePositionInputChange = (value: string) => {
    setPositionInput(value);
    if (value.length >= 2) {
      loadPositions({ variables: { name: value } });
    }
  };

  const handleCompanyInputChange = (value: string) => {
    setCompanyInput(value);
    if (value.length >= 2) {
      loadCompanies({ variables: { name: value } });
    }
  };

  const onSubmit = async (formData: FormData) => {
    const position = formData.position;
    const company = formData.company;

    await createExperience({
      variables: {
        input: {
          positionId:
            position && !position.__isNew__ ? position.value : undefined,
          positionName: position?.__isNew__ ? position.label : undefined,
          companyId: company && !company.__isNew__ ? company.value : undefined,
          companyName: company?.__isNew__ ? company.label : undefined,
          description: formData.description,
          from: formData.from,
          to: formData.isCurrentJob ? null : formData.to || null,
        },
      },
    });

    setModalOpen(false);
    reset();
  };

  const handleDelete = async (id: number) => {
    await deleteExperience({ variables: { id } });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      setPositionInput("");
      setCompanyInput("");
    }
    setModalOpen(open);
  };

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-lg">Experiences</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            <PlusCircle size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {experiences.length === 0 ? (
            <p className="text-gray-500 text-sm">No experiences added yet.</p>
          ) : (
            experiences.map((exp) => {
              const companyName = exp.company?.name || exp.companyName;
              return (
                <div
                  key={exp.id}
                  className="flex justify-between items-start border-b pb-3 last:border-0"
                >
                  <div>
                    <h3 className="font-medium">{exp.position?.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {exp.company?.imgPath ? (
                        <Image
                          src={`${BACKEND_URL}${exp.company.imgPath}`}
                          alt={companyName}
                          width={30}
                          height={30}
                          className="rounded-full"
                          style={{ width: 30, height: 30, objectFit: "cover" }}
                          unoptimized
                        />
                      ) : (
                        <div className="rounded-full bg-cyan-100 text-cyan-700 font-semibold flex items-center justify-center text-xs w-5 h-5">
                          {getInitials(companyName)}
                        </div>
                      )}
                      <span>{companyName}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {exp.from && new Date(exp.from).toLocaleDateString()} -{" "}
                      {exp.to
                        ? new Date(exp.to).toLocaleDateString()
                        : "Present"}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deleting}
                    className="text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Dialog open={modalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Experience</DialogTitle>
          </DialogHeader>

          <form className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="position">Position *</Label>
              <Controller
                name="position"
                control={control}
                rules={{ required: "Position is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="position"
                    options={positionOptions}
                    isClearable
                    isSearchable
                    onInputChange={handlePositionInputChange}
                    onChange={(option) => {
                      field.onChange(option);
                      if (
                        option &&
                        !(option as Option).__isNew__ &&
                        positionInput
                      ) {
                        const newOption = {
                          value: positionInput,
                          label: positionInput,
                          __isNew__: true,
                        };
                        field.onChange(newOption);
                      }
                    }}
                    placeholder="Search or enter position..."
                    noOptionsMessage={() =>
                      positionInput
                        ? "Type to add new position"
                        : "Type to search..."
                    }
                    filterOption={null}
                  />
                )}
              />
              {errors.position && (
                <p className="text-sm text-red-500">
                  {errors.position.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company *</Label>
              <Controller
                name="company"
                control={control}
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="company"
                    options={companyOptions}
                    isClearable
                    isSearchable
                    onInputChange={handleCompanyInputChange}
                    onChange={(option) => {
                      field.onChange(option);
                      if (
                        option &&
                        !(option as Option).__isNew__ &&
                        companyInput
                      ) {
                        const newOption = {
                          value: companyInput,
                          label: companyInput,
                          __isNew__: true,
                        };
                        field.onChange(newOption);
                      }
                    }}
                    placeholder="Search or enter company..."
                    noOptionsMessage={() =>
                      companyInput
                        ? "Type to add new company"
                        : "Type to search..."
                    }
                    filterOption={null}
                  />
                )}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="from">From *</Label>
              <Input
                id="from"
                type="date"
                {...control.register("from", {
                  required: "Start date is required",
                })}
              />
              {errors.from && (
                <p className="text-sm text-red-500">{errors.from.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Controller
                name="isCurrentJob"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCurrentJob"
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        if (e.target.checked) {
                          setValue("to", "");
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isCurrentJob" className="font-normal">
                      I currently work here
                    </Label>
                  </div>
                )}
              />
            </div>
            {!watch("isCurrentJob") && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" {...control.register("to")} />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...control.register("description")}
                placeholder="Describe your responsibilities..."
              />
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={creating}>
              {creating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
