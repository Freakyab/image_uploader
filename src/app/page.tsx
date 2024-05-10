"use client";
import React, { useState } from "react";

import UploadContainer from "./components/uploadContainer";
import ViewImage from "./components/viewImage";

export default function Home() {
  const [viewType, setViewType] = useState<boolean>(true);
  return (
    <main
      className="min-h-screen min-w-screen flex flex-col justify-center items-center bg-black">
      <div className="flex gap-2">
        <div
          className="bg-white h-full p-4 rounded-lg shadow-xl capitalize my-2 cursor-pointer"
          onClick={() => setViewType(true)}>
          <p>Upload Image</p>
        </div>
        <div
          className="bg-white  h-full p-4 rounded-lg shadow-xl capitalize my-2 cursor-pointer"
          onClick={() => setViewType(false)}>
          <p>View Image</p>
        </div>
      </div>
      {viewType ? <UploadContainer /> : <ViewImage />}
    </main>
  );
}
