import { VideoGenerator } from "@/components/VideoGenerator";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Text to Video Generator
        </h1>
        <VideoGenerator />
      </div>
    </div>
  );
}