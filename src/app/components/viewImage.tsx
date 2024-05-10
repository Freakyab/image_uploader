"use client";

import React, { useState } from "react";
import { getImages, deleteImage } from "@/app/actions/uploader";
import { ToastContainer } from "react-toastify";
import { handleToast } from "./HandleToast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa6";
import { CiLink, CiShare2 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function ViewImage() {
  const [allImage, setAllImage] = useState<imageProps[]>([]);
  const [imagefetch, setImagefetch] = useState<boolean>(true);
  const [filteredImages, setFilteredImages] = useState<imageProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [hover, setHover] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (imagefetch) {
      const fetchImages = async () => {
        console.time("fetch images");
        const images = await getImages();
        if (images) {
          setAllImage(images);
          setImagefetch(false);
        } else if (!images) {
          handleToast("Error fetching images", "error");
        }
        // time in sec to fetch images
        console.timeEnd("fetch images");
      };
      fetchImages();
    }
  }, [imagefetch]);

  React.useEffect(() => {
    if (search.trim() === "") {
      setFilteredImages(allImage);
    } else {
      const filteredImages = allImage.filter((file) =>
        file.image.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredImages(filteredImages);
    }
  }, [search, allImage]);

  const download = (e: imageProps) => {
    if (!e.link || !e.image) {
      console.error("Invalid imageProps:", e);
      return;
    }
    console.log("Downloading image:", e.image, e.link);
    const downloadLink = document.createElement("a");
    downloadLink.href = e.link;
    downloadLink.download = e.image;
    downloadLink.click();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (file: imageProps) => {
    if (file.id) {
      setImagefetch(true);
      const isDelete = await deleteImage(file.id);
      if (isDelete) {
        handleToast("delete done", "success");
      } else {
        handleToast("delete not done", "error");
      }
    }
  };

  const onHover = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    setHover(true); // turn true
    console.log("hovered");
  };

  const onHoverOver = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault(); // turn false
    setHover(false);
  };
  return (
    <div className="bg-white w-[90%] h-full p-4 rounded-lg shadow-xl">
      {imagefetch ? (
        <h1>Image loading....</h1>
      ) : (
        <>
          <input
            type="text"
            placeholder="find the image by name"
            onChange={handleSearch}
            className="border-2 border-gray-300 p-2 rounded-md my-3"
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4 ">
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="grid gap-2 justify-center w-fit border-4 relative border-black rounded-md">
                  {/* {hover && <p className={hover ? "absolute z-10 backdrop-filter backdrop-blur-sm text-white h-20 p-3 transition-all duration-100000" : "hidden"}> {image.image} </p>} */}
                  <Image
                    // onMouseEnter={(e) => onHover(e)}
                    // onMouseLeave={(e) => onHoverOver(e)}
                    src={image.link.toString()}
                    alt={image.image.toString()}
                    width={1500}
                    height={1500}
                    className="border-b-2 border-black shadow-sm object-cover w-[350px] h-[400px]"
                  />
                  <p className="text-center capitalize ">{image.image}</p>
                  <div className="flex justify-evenly py-3 border-t-4  bottom-0 border-black">
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => download(image)}>
                      <FaDownload size={30} />
                    </p>
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        handleToast("Opening to new tab", "info");
                        router.push("/getImage/" + image.id);
                      }}>
                      <CiShare2 size={30} />
                    </p>
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "https://imageuploaderfreakyab.vercel.app/api/getImage/" + image.id
                        );
                        handleToast("Link copied to clipboard", "success");
                      }}>
                      <CiLink size={30} />
                    </p>
                    <span
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(image)}>
                      <MdDelete size={30} />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <h1>No images found</h1>
            )}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default ViewImage;
