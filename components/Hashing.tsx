"use client";

import { useRef, useState } from "react";

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateSHA256Hash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = bufferToHex(hashBuffer);
    return hashHex;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}


const Hashing = () => {
  const [textHash, setTextHash] = useState();
  const [fileHash, setFileHash] = useState();
  const textRef = useRef();
  const uploadRef = useRef();

  const handleTextHash = async () => {
    const hash = await generateSHA256Hash(textRef.current.value);
    setTextHash(hash);
  }

  const handleFileHash = async () => {
    const file = uploadRef.current.files[0];

    if (!file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async function(event) {
      const fileContent = event.target.result;
      const data = new TextEncoder().encode(fileContent);
      const hash = await generateSHA256Hash(data);

      setFileHash(hash);
    };

    reader.readAsText(file);
  }  

  return (
    <div className="mb-6 w-full">
      <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Content to hash:
      </label>
      <input ref={textRef} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <button onClick={handleTextHash} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate Hash
      </button>
      {textHash && <blockquote className="mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{textHash}</blockquote>}
    
      <label htmlFor="large-input" className="block mb-2 mt-20 text-sm font-medium text-gray-900 dark:text-white">
        File content to hash:
      </label>
      <input ref={uploadRef} type="file" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <button onClick={handleFileHash} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate Hash
      </button>
      {fileHash && <blockquote className="mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{fileHash}</blockquote>}    
    </div>    
  )
}

export default Hashing;