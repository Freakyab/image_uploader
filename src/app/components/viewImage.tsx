import React from "react";
import { limit } from "../limit";

function ViewImage() {
  React.useEffect(() => {
    const fetchTotalImagesSize = async () => {
      const response = await fetch("https://image-uploader-backend-opal.vercel.app/getTotalSize");
      const data = await response.json();
      if(data.status){
        console.log("Total size of the images:", data.totalSizeInMB, "MB");
        const totalSizeInMB = data.totalSizeInMB;
        const chunks = Math.ceil(totalSizeInMB / limit);
        console.log("Total size of the images:", chunks, "chunks");
      }
    };
    fetchTotalImagesSize();
  }, []);
  return <div></div>;
}

export default ViewImage;
