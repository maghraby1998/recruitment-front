import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-[100vh]">
      <h1 className="font-bold text-2xl capitalize mb-[40px]">
        you're registering as ..
      </h1>
      <div className="flex gap-5">
        <Link
          className="border border-black p-4 rounded w-[300px]"
          href={"/register/employee"}
        >
          <p className="text-center font-bold mb-2">Employee</p>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat,
            qui!
          </p>
        </Link>

        <Link
          className="border border-black p-4 rounded w-[300px]"
          href={"/register/company"}
        >
          <p className="text-center font-bold mb-2">Company</p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quaerat,
            qui!
          </p>
        </Link>
      </div>
    </div>
  );
}
