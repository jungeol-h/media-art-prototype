import { useState, useEffect } from "react";
import { AudioFile } from "@/types";

const useAudioFiles = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch("/api/audio-files");
        if (!response.ok) {
          throw new Error("Failed to fetch audio files");
        }
        const data = await response.json();
        setAudioFiles(data);
      } catch (error) {
        console.error("Error fetching audio files:", error);
      }
    };

    fetchAudioFiles();
  }, []);

  return audioFiles;
};

export default useAudioFiles;
