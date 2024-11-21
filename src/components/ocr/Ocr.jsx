import { div } from "@tensorflow/tfjs-core";
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import Gpt from "../gpt-2/Gpt";

const TextExtractor = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); 
    }
  };

  const extractText = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, "eng");
      setExtractedText(result.data.text);
    } catch (error) {
      console.error("Error extracting text:", error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex items-center justify-center
     p-2">
      <div className="flex flex-col w-1/3 bg-gray-950">
    <div className="w-full flex items-center justify-center p-2 ">
      <label for="upload" class="flex items-center gap-2 cursor-pointer">
                <img src="src\assets\upload.png" alt="Upload Icon" className="h-7"/>
                <span class="text-neutral-300 font-medium">Upload file</span>
              </label>
              <input id="upload" type="file" class="hidden" onChange={handleImageUpload} />
            </div>
      <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 items-center justify-center ">
      <div>
      {image && <img src={image} alt="Uploaded" className="mt-4 rounded max-w-xs" />}
      </div>
      <div>
      {extractedText && (
        <div className="mt-4 w-full text-center">
          <p className="text-green-400 font-bold">Extracted Text:</p>
          {/* <p className="text-white first-letter:capitalize">{extractedText}</p> */}
          {
            extractedText &&
            <Gpt textToBeExtracted={extractedText} />
          }
        </div>
      )}
      </div>
      </div>
      <div className="w-full flex items-center justify-center">
      <button
        onClick={extractText}
        disabled={loading}
        className="bg-gradient-to-r from-indigo-500 to-pink-400 text-pink-100 w-1/3 rounded-3xl p-2"
      >
        {loading ? "Extracting..." : "Extract Text"}
      </button>
      </div>
      </div>
      </div>
      </div>
  );
};

export default TextExtractor;
