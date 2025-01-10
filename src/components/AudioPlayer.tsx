import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'; // Default styles
import { FaDownload } from 'react-icons/fa';

interface AudioPlayerProps {
  audio: string;
}

const AudioPlayerStyled: React.FC<AudioPlayerProps> = ({ audio }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    // Make sure the link includes the direct file URL and use the correct file name
    link.href = audio;
    link.download = audio.split('/').pop()?.split('?')[0] || 'audio-file.ogg'; // Clean up the URL to get the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {audio && audio !== '/' && (
        <div className='w-full max-w-lg p-1 rounded-xl relative'>
          <AudioPlayer src={audio} className='w-full' />
          {/* Custom Download Button */}
          <button
            onClick={handleDownload}
            className='absolute top-11 text-[#868686] rounded-full p-2'
            title='Download Audio'
            style={{
              marginLeft: '50px',
            }}
          >
            <FaDownload size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default AudioPlayerStyled;
