"use client";
import React, { useState } from "react";
import {
  getImages,
  deleteImage,
  totalLength,
  changeVisibility,
} from "@/app/actions/uploader";
import { ToastContainer } from "react-toastify";
import { handleToast } from "./HandleToast";
import Image from "next/image";
import { FaDownload } from "react-icons/fa6";
import { CiLink, CiShare2 } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function ViewImage() {
  const [allImage, setAllImage] = useState<imageProps[]>([]);
  const [imagefetch, setImagefetch] = useState<boolean>(true);
  const [filteredImages, setFilteredImages] = useState<imageProps[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loadingString, setLoadingString] = useState<string>("");
  const [userType, setUserType] = useState<string>("");

  React.useEffect(() => {
    const type = localStorage.getItem("userTypeOfUploader");
    if (type) {
      console.log("User type:", type);
      setUserType(type);
    }
  }, []);

  React.useEffect(() => {
    if (imagefetch) {
      const fetchImages = async () => {
        console.time("fetch images");
        let index = 0;
        let fetchedImages: imageProps[] = [];
        let length = await totalLength(); // Assuming this function gives the total length of images
        while (index < length) {
          setLoadingString(`Image fetch.. (${index}/${length})`);
          const images = await getImages(index);
          if (images) {
            fetchedImages = [...fetchedImages, ...images];
          }
          index += 2; // Increment index for pagination
        }

        setAllImage(fetchedImages.reverse());
        console.log("All images:", fetchedImages.reverse());
        setImagefetch(false);
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

  const handleVisiblity = async (image: imageProps) => {
    const id = image.id;
    const visibility = image.visibility;
    const success = await changeVisibility(id, !visibility);
    if (success) {
      const updatedImages = allImage.map((image) =>
        image.id === id ? { ...image, visibility: !visibility } : image
      );
      setAllImage(updatedImages);
      setFilteredImages(updatedImages);
      handleToast(
        `Image visibility ${visibility ? "hidden" : "restored"} successfully`,
        "success"
      );
    } else {
      handleToast("Failed to change image visibility", "error");
    }
  };
  return (
    <div className="bg-white w-[90%] h-full p-4 rounded-lg shadow-xl">
      {imagefetch ? (
        <h1 className="text-black">
          {loadingString ? loadingString : "loading....."}
        </h1>
      ) : (
        <>
          {filteredImages.filter((image) => image.visibility).length > 0 ||
          userType == "AdminUser" ? (
            <input
              type="text"
              placeholder="find the image by name"
              onChange={handleSearch}
              className="border-2 border-gray-300 p-2 rounded-md my-3"
            />
          ) : null}
          <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4 ">
            {filteredImages.filter((image) => image.visibility).length > 0 ||
            userType == "AdminUser" ? (
              filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="grid gap-2 justify-center w-fit border-4 relative border-black rounded-md">
                  {image.visibility || userType === "AdminUser" ? (
                    <>
                      <Image
                        src={image.link.toString()}
                        alt={image.image.toString()}
                        width={1500}
                        height={1500}
                        className="border-b-2 border-black shadow-sm object-cover w-[350px] h-[400px]"
                      />
                      <p className="text-center capitalize ">{image.image}</p>
                      <div className="flex justify-evenly py-3 border-t-4  bottom-0 border-black">
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => download(image)}>
                          <FaDownload size={30} />
                        </button>
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => {
                            window.open(
                              "https://imageuploaderfreakyab.vercel.app/getImage/" +
                                image.id
                            );
                          }}>
                          <CiShare2 size={30} />
                        </button>
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "https://imageuploaderfreakyab.vercel.app/api/getImage/" +
                                image.id
                            );
                            handleToast("Link copied to clipboard", "success");
                          }}>
                          <CiLink size={30} />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(image)}>
                          <MdDelete size={30} />
                        </button>
                        {userType === "AdminUser" && (
                          <>
                            <button
                              className="cursor-pointer"
                              onClick={() => handleVisiblity(image)}>
                              {image.visibility ? (
                                <FaRegEye size={30} />
                              ) : (
                                <FaRegEyeSlash size={30} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  ) : null}
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
