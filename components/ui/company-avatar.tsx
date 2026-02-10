import Image from "next/image";

enum JobPostStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

type JobPost = {
  id: number;
  title: string;
  description: string;
  status: JobPostStatus;
  company: {
    name: string;
    imgPath: string;
  };
  employee: {
    firstName: string;
    lastName: string;
    imgPath: string;
  };
  applicationsNumber: number;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join(".")
    .toUpperCase()
    .slice(0, 3);
}

const UserAvatar = ({
  company,
  employee,
  userType,
  size = "md",
}: {
  company?: JobPost["company"];
  employee?: JobPost["employee"];
  size?: "sm" | "md" | "lg";
  userType: "EMPLOYEE" | "COMPANY";
}) => {
  const sizeConfig = {
    sm: { className: "text-xs", pixels: 32 },
    md: { className: "text-sm", pixels: 40 },
    lg: { className: "text-base", pixels: 56 },
  };

  const { className, pixels } = sizeConfig[size];

  if ((company && company.imgPath) || (employee && employee.imgPath)) {
    return (
      <Image
        src={`http://localhost:5000${company ? company.imgPath : employee?.imgPath}`}
        alt={company ? company.name : (employee?.firstName ?? "user image")}
        width={pixels}
        height={pixels}
        className="rounded"
        style={{ width: pixels, height: pixels, objectFit: "cover" }}
        unoptimized
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-cyan-100 text-cyan-700 font-semibold flex items-center justify-center`}
      style={{ width: pixels, height: pixels }}
    >
      {getInitials(
        company ? company.name : employee?.firstName + " " + employee?.lastName,
      )}
    </div>
  );
};

export default UserAvatar;
