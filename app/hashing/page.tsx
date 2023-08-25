import Hashing from "@/components/Hashing";

export const metadata = {
  title: 'Hashing | Cryptography in JS',
  description: 'Cryptographic hash functions can be used to ensure the integrity of data. When data is received, the frontend can compute the hash and compare it to a previously computed hash to ensure that the data has not been tampered with during transmission.',
}


export default function HashingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Hashing />
    </main>
  )
}