import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { AudioFile } from "@/types";

interface AudioThumbnailProps {
  file: AudioFile;
  index: number;
  isPlaying: boolean;
}

const AudioThumbnail: React.FC<AudioThumbnailProps> = ({
  file,
  index,
  isPlaying,
}) => {
  return (
    <Draggable draggableId={file.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`w-24 h-24 ${
            isPlaying ? "bg-green-500" : "bg-black"
          } text-white flex items-center justify-center rounded cursor-pointer hover:bg-gray-800 transition-colors`}
        >
          <span className="text-xs text-center break-words p-2">
            {file.name}
          </span>
        </div>
      )}
    </Draggable>
  );
};

export default AudioThumbnail;
