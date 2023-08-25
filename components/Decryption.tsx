"use client";

import { useRef, useState } from "react";

function hexToUint8Array(hexString) {
  const hexArray = hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
  return new Uint8Array(hexArray);
}

const Hashing = () => {
  const [result, setResult] = useState();
  const cipherRef = useRef();
  const keyRef = useRef();

  const generateEncryptionKey = async () => {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 128,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  const generateKeys = async () => {
    const key = await generateEncryptionKey();
    const jwk = await window.crypto.subtle.exportKey("jwk", key);
    setPubKey(jwk);
  }

  const handleDecrypt = async () => {
    try {
      const key = await window.crypto.subtle.importKey(
        "jwk", 
        JSON.parse(keyRef.current.value),
        {
          name: 'AES-GCM',
          length: 128,
        }, 
        false, 
        ['encrypt', 'decrypt']
      );

      const cipher = JSON.parse(cipherRef.current.value); 

      const ivUint8Array = hexToUint8Array(cipher.iv);
      const ciphertextUint8Array = hexToUint8Array(cipher.ciphertext);

      const algorithm = {
        name: 'AES-GCM',
        iv: ivUint8Array,
      };

      const decryptedBuffer = await crypto.subtle.decrypt(
        algorithm,
        key,
        ciphertextUint8Array
      );

      const decoder = new TextDecoder();
      const decryptedData = decoder.decode(decryptedBuffer);

      setResult(decryptedData);

    } catch (error) {
      setResult(false);
      console.error('Error encrypting content:', error);
    }
  }


  return (
    <div className="mb-6 w-full">
      <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Key:
      </label>
      <input ref={keyRef} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Content to decrypt:
      </label>
      <input ref={cipherRef} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <button onClick={handleDecrypt} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Decrypt
      </button>
      {result && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{result}</blockquote>}  
    </div>    
  )
}

export default Hashing;