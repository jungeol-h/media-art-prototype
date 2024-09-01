"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import PlayPauseButton from "@/components/PlayPauseButton";
import { DropResult } from "@hello-pangea/dnd";
import { AudioFile, AudioSection } from "@/types";
import useAudioPlayer from "@/hooks/useAudioPlayer";

const ClientSideDragDrop = dynamic(
  () => import("@/components/ClientSideDragDrop"),
  {
    ssr: false,
  }
);

export default function Home() {
  const [sections, setSections] = useState<AudioSection[]>([
    { id: "inbox", title: "Inbox", items: [] },
    { id: "loop", title: "Loop", items: [] },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isPlaying, togglePlayPause, updateActiveAudioFiles } = useAudioPlayer(
    sections[1].items
  );

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/audio-files");
        if (!response.ok) {
          throw new Error("Failed to fetch audio files");
        }
        const data: AudioFile[] = await response.json();
        setSections((prev) => [{ ...prev[0], items: data }, prev[1]]);
        setError(null);
      } catch (error) {
        console.error("Error fetching audio files:", error);
        setError("Failed to load audio files. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioFiles();
  }, []);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination) return;

      const newSections = [...sections];
      const sourceSection = newSections.find(
        (section) => section.id === source.droppableId
      );
      const destSection = newSections.find(
        (section) => section.id === destination.droppableId
      );

      if (!sourceSection || !destSection) return;

      const [movedItem] = sourceSection.items.splice(source.index, 1);
      destSection.items.splice(destination.index, 0, movedItem);

      setSections(newSections);

      // Update active audio files if the Loop section changed
      if (destSection.id === "loop" || sourceSection.id === "loop") {
        updateActiveAudioFiles(newSections[1].items);
      }
    },
    [sections, updateActiveAudioFiles]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Media Art Prototype</h1>
      <ClientSideDragDrop
        sections={sections}
        onDragEnd={onDragEnd}
        isPlaying={isPlaying}
      />
      <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayPause} />
    </main>
  );
}
