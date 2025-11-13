import React, { useState, useRef, useEffect } from 'react';

interface LobbyProps {
  onJoin: (userName: string, roomId: string) => void;
  initialRoomId?: string;
  mediaStream: MediaStream | null;
  error: string | null;
}

const Lobby: React.FC<LobbyProps> = ({ onJoin, initialRoomId, mediaStream, error }) => {
  const [userName, setUserName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>(initialRoomId || '');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const handleJoin = () => {
    if (userName.trim() && roomId.trim()) {
      onJoin(userName, roomId);
    }
  };
  
  const isCreating = !!initialRoomId;
  const canJoin = (isCreating ? userName.trim() : userName.trim() && roomId.trim()) && !error && !!mediaStream;


  return (
    <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-cyan-400">{isCreating ? 'Create Meeting' : 'Join Meeting'}</h1>
      <p className="text-lg text-gray-300">Get your camera and microphone ready.</p>
      
      <div className="w-full md:w-2/3 lg:w-1/2 bg-black rounded-lg overflow-hidden border-2 border-gray-700 aspect-video">
        {error ? (
          <div className="w-full h-full flex items-center justify-center p-4 text-red-400">
            {error}
          </div>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform scaleX-[-1]"></video>
        )}
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        {!isCreating && (
            <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            readOnly={isCreating}
            placeholder="Enter Room ID"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-600"
            />
        )}
        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className="w-full px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
        >
          {isCreating ? 'Create Meeting' : 'Join Meeting'}
        </button>
      </div>
    </div>
  );
};

export default Lobby;