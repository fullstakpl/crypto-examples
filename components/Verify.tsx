"use client";

import { useRef, useState } from "react";

function hexToUint8Array(hexString) {
  const hexArray = hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
  return new Uint8Array(hexArray);
}


async function verifySignature({ publicKey, signature, content }) {
  const encoder = new TextEncoder();
  const dataArray = encoder.encode(content);

  try {
    const key = await window.crypto.subtle.importKey(
      "jwk", 
      JSON.parse(publicKey),
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' }
      }, 
      false, 
      ["verify"]
    );

    const verified = await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: 'SHA-256' }
      }, 
      key,
      hexToUint8Array(signature),
      dataArray
    );

    return verified;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

const Hashing = () => {
  const [validated, setValidate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      publicKey: formData.get("publicKey"),
      signature: formData.get("signature"),
      content: formData.get("content")
    }

    const result = await verifySignature(payload)
    setValidate(result);
  }

  return (
    <form className="mb-6 w-full" onSubmit={handleSubmit}>
      <label htmlFor="publicKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Public key:
      </label>
      <input type="text" name="publicKey" className="block w-full p-4 mb-7 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <label htmlFor="signature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Signature:
      </label>
      <input type="text" name="signature" className="block w-full p-4 mb-7 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Content:
      </label>
      <input type="text" name="content" className="block w-full p-4 mb-7 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
  
      <button type="submit" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Validate signature
      </button>
      {validated && <p>✅ Valid</p>}
      {!validated && <p>❌ Invalid</p>}
    </form>    
  )
}

export default Hashing;