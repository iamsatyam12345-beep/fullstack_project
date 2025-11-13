import React, { useEffect, useRef } from 'react';

interface VideoTileProps {
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  stream?: MediaStream | null;
  isScreenSharing?: boolean;
  isLocal?: boolean;
}

const MicOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
        <path fillRule="evenodd" d="M5.5 8.5A.5.5 0 016 8v1.5a4 4 0 007.873 1.253.5.5 0 01.93.364A5 5 0 015 9.5V8a.5.5 0 01.5-.5z" clipRule="evenodd" />
    </svg>
);

const MicOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v6a1 1 0 01-2 0V4a1 1 0 011.383-.924zM8 7a3 3 0 015.758 1.417l-1.5 1.5A1.5 1.5 0 008 8.5V7zM5 6a1 1 0 00-2 0v1.5a4.5 4.5 0 005.122 4.38L6.879 10.63A2.5 2.5 0 015 8.5V6zM13.617 4.924A1 1 0 0115 6v2.5a2.5 2.5 0 01-1.38 2.263l-1.293-1.292A1.5 1.5 0 0013.5 8.5V6a1 1 0 01.117-.465z" clipRule="evenodd"/>
      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l12 12a1 1 0 001.414-1.414l-12-12z" clipRule="evenodd"/>
    </svg>
);


const VideoTile: React.FC<VideoTileProps> = ({ name, stream, isMuted, isVideoOn, isScreenSharing = false, isLocal = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-gray-700 flex items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        muted={isLocal}
        playsInline 
        className={`w-full h-full transition-opacity duration-300 ${isScreenSharing ? 'object-contain' : 'object-cover'} ${isLocal && !isScreenSharing ? 'transform scaleX-[-1]' : ''} ${isVideoOn && stream ? 'opacity-100' : 'opacity-0'}`} />
      
      {(!isVideoOn || !stream) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
            </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm flex items-center gap-2">
        {(isLocal ? isMuted : false) ? <MicOffIcon /> : <MicOnIcon />}
        <span>{name}</span>
      </div>
    </div>
  );
};

export default VideoTile;