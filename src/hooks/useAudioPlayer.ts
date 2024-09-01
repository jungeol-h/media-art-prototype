// src/hooks/useAudioPlayer.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { AudioFile } from "@/types";

const BEATS_PER_BAR = 4;
const BPM = 90;
const SECONDS_PER_BEAT = 60 / BPM;
const SECONDS_PER_BAR = SECONDS_PER_BEAT * BEATS_PER_BAR;

const useAudioPlayer = (initialAudioFiles: AudioFile[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudioFiles, setActiveAudioFiles] =
    useState<AudioFile[]>(initialAudioFiles);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const totalBars = useRef(0);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const loadAudio = async (file: AudioFile) => {
    const response = await fetch(file.path);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContextRef.current!.decodeAudioData(
      arrayBuffer
    );
    return audioBuffer;
  };

  const updateTotalBars = useCallback(() => {
    totalBars.current = Math.max(
      ...activeAudioFiles.map((file) => file.duration)
    );
  }, [activeAudioFiles]);

  const getCurrentBar = useCallback(() => {
    if (!startTimeRef.current || !audioContextRef.current) return 0;
    const elapsedTime =
      audioContextRef.current.currentTime - startTimeRef.current;
    return Math.floor(elapsedTime / SECONDS_PER_BAR) % totalBars.current;
  }, []);

  const playAudio = useCallback(async (file: AudioFile, startBar: number) => {
    if (!audioContextRef.current) return;

    const audioBuffer = await loadAudio(file);
    const sourceNode = audioContextRef.current.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContextRef.current.destination);
    sourceNode.loop = true;
    sourceNode.loopEnd = file.duration * SECONDS_PER_BAR;

    const startTime = audioContextRef.current.currentTime;
    const offset = (startBar % file.duration) * SECONDS_PER_BAR;
    sourceNode.start(startTime, offset);

    sourceNodesRef.current.set(file.id, sourceNode);
  }, []);

  const stopAudio = useCallback((fileId: string) => {
    const sourceNode = sourceNodesRef.current.get(fileId);
    if (sourceNode) {
      sourceNode.stop();
      sourceNodesRef.current.delete(fileId);
    }
  }, []);

  const updateActiveAudioFiles = useCallback(
    (newAudioFiles: AudioFile[]) => {
      setActiveAudioFiles(newAudioFiles);
      updateTotalBars();

      if (isPlaying) {
        const currentBar = getCurrentBar();

        // Stop audio for removed files
        sourceNodesRef.current.forEach((_, fileId) => {
          if (!newAudioFiles.some((file) => file.id === fileId)) {
            stopAudio(fileId);
          }
        });

        // Start audio for new files
        newAudioFiles.forEach((file) => {
          if (!sourceNodesRef.current.has(file.id)) {
            playAudio(file, currentBar);
          }
        });
      }
    },
    [isPlaying, playAudio, stopAudio, getCurrentBar, updateTotalBars]
  );

  const play = useCallback(async () => {
    if (!audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime;
    startTimeRef.current = currentTime;

    for (const file of activeAudioFiles) {
      await playAudio(file, 0);
    }

    setIsPlaying(true);

    const updateLoop = () => {
      if (isPlaying) {
        // 여기에 추가적인 동기화 로직을 구현할 수 있습니다.
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };
    updateLoop();
  }, [activeAudioFiles, playAudio, isPlaying]);

  const pause = useCallback(() => {
    if (!audioContextRef.current) return;
    audioContextRef.current.suspend();
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  const resume = useCallback(() => {
    if (!audioContextRef.current) return;
    audioContextRef.current.resume();
    setIsPlaying(true);
    const updateLoop = () => {
      if (isPlaying) {
        // 여기에 추가적인 동기화 로직을 구현할 수 있습니다.
        animationFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };
    updateLoop();
  }, [isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      if (sourceNodesRef.current.size > 0) {
        resume();
      } else {
        play();
      }
    }
  }, [isPlaying, pause, play, resume]);

  return { isPlaying, togglePlayPause, updateActiveAudioFiles };
};

export default useAudioPlayer;
