"use client";

import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-white text-1xl focus:outline-none"
    >
      <BiArrowBack className="icon" size={40} />
    </button>
  );
};

export default BackButton;
