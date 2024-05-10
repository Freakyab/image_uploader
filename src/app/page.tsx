"use client";
import React, { useState } from "react";

import UploadContainer from "./components/uploadContainer";
import ViewImage from "./components/viewImage";
import Image from "next/image";

export default function Home() {
  const [viewType, setViewType] = useState<boolean>(true);
  return (
    <main
      className="min-h-screen min-w-screen flex flex-col justify-center items-center bg-black">
        <Image src={"http://localhost:3000/api/getImage/663d9a771498df2a2009bad4"} width={500} height={500} alt={"image"} />
      <div className="flex gap-2">
        <div
          className="bg-white  h-full gap-4 p-4 rounded-lg shadow-xl capitalize my-2"
          onClick={() => setViewType(true)}>
          <p>Upload Image</p>
        </div>
        <div
          className="bg-white  h-full p-4 rounded-lg shadow-xl capitalize my-2"
          onClick={() => setViewType(false)}>
          <p>View Image</p>
        </div>
      </div>
      {viewType ? <UploadContainer /> : <ViewImage />}
    </main>
  );
}
