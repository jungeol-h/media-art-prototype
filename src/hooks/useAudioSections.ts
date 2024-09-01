import { useState, useEffect } from "react";
import { AudioSection, AudioFile } from "@/types";

const useAudioSections = () => {
  const [sections, setSections] = useState<AudioSection[]>([
    { id: "inbox", title: "Inbox", items: [] },
    { id: "loop", title: "Loop", items: [] },
  ]);

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch("/api/audio-files");
        if (!response.ok) {
          throw new Error("Failed to fetch audio files");
        }
        const data: AudioFile[] = await response.json();
        setSections((prev) => [{ ...prev[0], items: data }, prev[1]]);
      } catch (error) {
        console.error("Error fetching audio files:", error);
      }
    };

    fetchAudioFiles();
  }, []);

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceSection = sections.find(
      (section) => section.id === source.droppableId
    );
    const destSection = sections.find(
      (section) => section.id === destination.droppableId
    );

    if (!sourceSection || !destSection) return;

    const sourceItems = Array.from(sourceSection.items);
    const destItems = Array.from(destSection.items);
    const [reorderedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, reorderedItem);
      const newSections = sections.map((section) =>
        section.id === sourceSection.id
          ? { ...section, items: sourceItems }
          : section
      );
      setSections(newSections);
    } else {
      destItems.splice(destination.index, 0, reorderedItem);
      const newSections = sections.map((section) => {
        if (section.id === sourceSection.id)
          return { ...section, items: sourceItems };
        if (section.id === destSection.id)
          return { ...section, items: destItems };
        return section;
      });
      setSections(newSections);
    }
  };

  return { sections, onDragEnd };
};

export default useAudioSections;
