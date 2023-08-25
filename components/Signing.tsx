"use client";

import { useRef, useState } from "react";

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const Hashing = () => {
  const [privkey, setPrivKey] = useState();
  const [pubkey, setPubKey] = useState();
  const [sig, setSig] = useState();
  const textRef = useRef();

  const generateKeys = async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: 'SHA-256' }
      },
      true,
      ['sign', 'verify']
    );

    const privateKey = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);

    setPrivKey(privateKey);
    setPubKey(publicKey);
    let pwdCredential = new PasswordCredential({
      id: "example-username", // Username/ID
      name: JSON.stringify(publicKey), // Display name
      password: JSON.stringify(privateKey), // Password
    });

    window.navigator.credentials.store(pwdCredential)
  }

  const handleSign = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(textRef.current.value);

    try {
      const key = await window.crypto.subtle.importKey(
        "jwk", 
        privkey,
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
          hash: { name: 'SHA-256' }
        }, 
        false, 
        ["sign"]
      );
      const signature = await window.crypto.subtle.sign(
        {
          name: 'RSASSA-PKCS1-v1_5',
        },
        key,
        data
      );

      const hexSignature = bufferToHex(signature);
      setSig(hexSignature)
    } catch (error) {
      console.error('Error signing content:', error);
    }
  }


  return (
    <div className="mb-6 w-full">
      <button onClick={generateKeys} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate keys
      </button>
      <p>Public key</p>
      {pubkey && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{JSON.stringify(pubkey)}</blockquote>}  
      <p>Private key</p>
      {privkey && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{JSON.stringify(privkey)}</blockquote>}  
      <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Content to sign:
      </label>
      <input ref={textRef} type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      <button onClick={handleSign} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate Signature
      </button>
      {sig && <blockquote className="text-sm break-all mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{sig}</blockquote>}  
      <button onClick={async () => {
        const creds = await navigator.credentials.get({
          password: true
        });
        console.log({ creds })
      }} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Get keys
      </button>
    </div>    
  )
}

export default Hashing;