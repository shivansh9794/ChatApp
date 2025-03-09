import React from "react";
import { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";

export default function CameraCapture() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button onClick={startCamera} disabled={stream}>Open Camera</button>
      <button onClick={stopCamera} disabled={!stream}>Stop Camera</button>
      <video ref={videoRef} disabled={!stream} autoPlay className="border-2 border-red-600 rounded-lg shadow-md" />
    </div>
  );
}

