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
        if (localStorage.getItem("userTypeOfUploader") !== "AdminUser") {
          console.log("Fetched images:", fetchedImages);
          setAllImage(
            fetchedImages.filter((image) => image.visibility).reverse()
          );
        } else setAllImage(fetchedImages.reverse());
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

  const handleVisibility = async (image: imageProps) => {
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
    <div className="bg-white md:w-[90%] w-full h-full p-4 rounded-lg shadow-xl">
      {imagefetch ? (
        <h1 className="text-black">
          {loadingString ? loadingString : "Loading....."}
        </h1>
      ) : (
        <>
          {filteredImages.length > 0 || userType == "AdminUser" ? (
            <input
              type="text"
              placeholder="Find the image by name"
              onChange={handleSearch}
              className="border-2 border-gray-300 p-2 rounded-md my-3 w-full"
            />
          ) : null}

          <div className="grid  grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
            {filteredImages.length > 0 ? (
              filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-600 rounded-md overflow-hidden relative">
                  {(image.visibility || userType === "AdminUser") && (
                    <>
                      <Image
                        src={image.link.toString()}
                        alt={image.image.toString()}
                        width={600}
                        height={400}
                        className="object-cover max-h-[600px]"
                      />
                      <p className="text-center p-2">{image.image}</p>
                      <div className="flex justify-evenly py-3 border-t border-gray-600">
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() => download(image)}>
                          <FaDownload size={20} />
                        </button>
                        <button
                          className="text-blue-500 cursor-pointer"
                          onClick={() =>
                            window.open(
                              "https://imageuploaderfreakyab.vercel.app/getImage/" +
                                image.id
                            )
                          }>
                          <CiShare2 size={20} />
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
                          <CiLink size={20} />
                        </button>
                        <button
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDelete(image)}>
                          <MdDelete size={20} />
                        </button>
                        {userType === "AdminUser" && (
                          <button
                            className="cursor-pointer"
                            onClick={() => handleVisibility(image)}>
                            {image.visibility ? (
                              <FaRegEye size={20} />
                            ) : (
                              <FaRegEyeSlash size={20} />
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <h1 className="text-black">No images found</h1>
            )}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default ViewImage;
