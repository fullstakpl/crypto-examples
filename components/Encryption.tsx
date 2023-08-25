"use client";

import { useRef, useState } from "react";

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const Hashing = () => {
  const [cipher, setCipher] = useState();
  const [pubkey, setPubKey] = useState();
  const [sig, setSig] = useState();
  const textRef = useRef();

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

  const handleEncrypt = async () => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(textRef.current.value);

    try {
      const key = await window.crypto.subtle.importKey(
        "jwk", 
        pubkey,
        {
          name: 'AES-GCM',
          length: 128,
        }, 
        false, 
        ['encrypt', 'decrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector (IV) for AES-GCM
      const algorithm = {
        name: 'AES-GCM',
        iv: iv,
      };

      const ciphertextBuffer = await crypto.subtle.encrypt(
        algorithm,
        key,
        dataBuffer
      );

      const encryption = { 
        iv: bufferToHex(iv), 
        ciphertext: bufferToHex(ciphertextBuffer) 
      };

      setCipher(JSON.stringify(encryption))

    } catch (error) {
      console.error('Error signing content:', error);
    }
  }


  return (
    <div className="mb-6 w-full">
      <button onClick={generateKeys} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate key
      </button>
      <p>Key</p>
      {pubkey && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{JSON.stringify(pubkey)}</blockquote>}  
      <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Content to encrypt:
      </label>
      <input ref={textRef} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <button onClick={handleEncrypt} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Encrypt
      </button>
      {cipher && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{cipher}</blockquote>}  
    </div>    
  )
}

export default Hashing;