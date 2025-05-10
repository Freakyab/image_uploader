// "use client";
// import React from "react";

// function ViewImage() {
//   const [imageUrls, setImageUrls] = React.useState<string[]>([]);

//   React.useEffect(() => {
//     const fetchTotalImagesSize = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/getTotalSize");
//         const data = await response.json();

//         if (data.status) {
//           const totalImages = data.totalImages;
//           const imagesString: string[] = [];

//           for (let i = 0; i < totalImages.length; i++) {
//             const { id, chunks } = totalImages[i];
//             let fullImageString = "";

//             for (let j = 0; j < chunks; j++) {
//               const chunkRes = await fetch(`http://localhost:8000/getImages/${j}/${id}`);
//               const chunkData = await chunkRes.json();

//               if (chunkData.status) {
//                 const imageString = chunkData.image.imageString; // ✅ fix
//                 fullImageString += imageString;
//               } else {
//                 console.error(chunkData.message);
//                 return;
//               }
//             }

//             imagesString[i] = fullImageString;
//           }

//           console.log("Total images fetched:", imagesString.length);
//           setImageUrls(imagesString);
//         }
//       } catch (error) {
//         console.error("Error fetching image data:", error);
//       }
//     };

//     fetchTotalImagesSize();
//   }, []);

//   return (
//     <div>
//       {imageUrls.map((imageUrl, index) => (
//         <img
//           key={index}
//           src={`data:image/jpeg;base64,${imageUrl}`}
//           alt={`Image ${index + 1}`}
//           style={{ width: "100px", height: "100px", objectFit: "cover", margin: "10px" }}
//         />
//       ))}
//     </div>
//   );
// }

// export default ViewImage;

"use client";

import React, { useEffect, useState } from "react";

function ViewImage() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:8000/getTotalSize");
        const data = await res.json();

        if (!data.status) throw new Error("Failed to get total size");

        const allImageUrls: string[] = [];

        for (const image of data.totalImages) {
          const id = image.id;
          const res = await fetch(`http://localhost:8000/getAllChunks/${id}`);
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
