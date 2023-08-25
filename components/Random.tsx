"use client";

import { useState } from "react";

const Random = () => {
  const [randomInt, setRandomInt] = useState<number>(0);

  const handleRandomInt = () => {
    const randomValues = new Uint32Array(1);
    setRandomInt(window.crypto.getRandomValues(randomValues)[0]);
  }

  return (
    <div className="mb-6 w-full">
      <button onClick={handleRandomInt} type="button" className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Generate Random Integer
      </button>
      {randomInt && <blockquote className="mt-6 p-4 my-4 border-l-4 border-blue-300 bg-gray-50 dark:border-blue-500 dark:bg-gray-800">{randomInt}</blockquote>}
    </div>    
  )
}

export default Random;