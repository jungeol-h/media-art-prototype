import React from "react";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
}

const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
}) => {
  return (
    <button
      className={`px-4 py-2 ${
        isPlaying ? "bg-red-500" : "bg-green-500"
      } text-white rounded mt-4`}
      onClick={onClick}
    >
      {isPlaying ? "Pause" : "Play"}
    </button>
  );
};

export default PlayPauseButton;
