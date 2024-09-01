import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import AudioThumbnail from "./AudioThumbnail";
import { AudioSection } from "@/types";

interface LoopSectionProps {
  section: AudioSection;
  isPlaying: boolean;
}

const LoopSection: React.FC<LoopSectionProps> = ({ section, isPlaying }) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-bold mb-4">{section.title}</h2>
      <Droppable droppableId={section.id} type="AUDIO">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col space-y-2"
          >
            {section.items.map((file, index) => (
              <AudioThumbnail
                key={file.id}
                file={file}
                index={index}
                isPlaying={isPlaying}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default LoopSection;
