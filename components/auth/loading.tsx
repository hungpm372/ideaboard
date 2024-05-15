import Image from "next/image";
import React from "react";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center size-full">
      <Image
        src={"/logo.svg"}
        alt="Ideaboard"
        width={120}
        height={120}
        className="animate-pulse duration-700"
      />
    </div>
  );
};
