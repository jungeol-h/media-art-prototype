"use client";

import React from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import InboxSection from "./InboxSection";
import LoopSection from "./LoopSection";
import { AudioSection } from "@/types";

interface ClientSideDragDropProps {
  sections: AudioSection[];
  onDragEnd: (result: DropResult) => void;
  isPlaying: boolean; // 추가
}

const ClientSideDragDrop: React.FC<ClientSideDragDropProps> = ({
  sections,
  onDragEnd,
  isPlaying, // 추가
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full max-w-4xl flex flex-col space-y-8">
        <InboxSection section={sections[0]} isPlaying={isPlaying} />
        <LoopSection section={sections[1]} isPlaying={isPlaying} />
      </div>
    </DragDropContext>
  );
};

export default ClientSideDragDrop;
