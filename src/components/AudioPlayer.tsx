import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // Default styles

interface AudioPlayerProps {
  audio: string;
}

const AudioPlayerStyled: React.FC<AudioPlayerProps> = ({ audio }) => {
  return (
    <>
      {audio && audio !== '/' && (
        <AudioPlayer
          src={audio}
          className='w-full max-w-lg p-1 bg-[#FFFFFF] rounded-xl'
        />
      )}
    </>
  );
};

export default AudioPlayerStyled;
