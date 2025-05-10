"use client";

import React, { useEffect, useState } from "react";

function ViewImage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("https://image-uploader-backend-opal.vercel.app/getTotalSize");
        const data = await res.json();

        if (!data.status) throw new Error("Failed to get total size");

        const allImageUrls: string[] = [];

        for (const image of data.totalImages) {
          const id = image.id;
          const res = await fetch(`https://image-uploader-backend-opal.vercel.app/getAllChunks/${id}`);
          const json = await res.json();

          if (json.status) {
            const fullImage = json.chunks.join(""); // Safe order
            allImageUrls.push(fullImage);
          } else {
            console.warn(`Failed to get chunks for ID: ${id}`);
          }
        }

        setImageUrls(allImageUrls);
      } catch (err) {
        console.error("Image fetch failed", err);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      {imageUrls.map((img, i) => (
        <img
          key={i}
          src={`${img}`}
          alt={`Image ${i}`}
        //   style={{ width: "100px", height: "100px", objectFit: "cover", margin: "10px" }}
        />
      ))}
    </div>
  );
}

export default ViewImage;
