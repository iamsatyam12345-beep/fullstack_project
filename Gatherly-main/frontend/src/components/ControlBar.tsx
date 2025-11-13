import React from 'react';

interface ControlBarProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleHandRaise: () => void;
  onAttemptLeave: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onInvite: () => void;
}

const MicIcon = ({ muted }: { muted: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {muted ? (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414m-2.828-2.828L6.343 5.343m11.314 11.314L5.343 5.343" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3m0 0a3 3 0 013 3v1" />
            </>
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 013-3m0 0a3 3 0 013 3v3a3 3 0 01-3 3z" />
        )}
    </svg>
);

const VideoIcon = ({ on }: { on: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {on ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        ) : (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" />
            </>
        )}
    </svg>
);

const ScreenShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ParticipantsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a4 4 0 11-8 0 4 4 0 018 0zM21 21v-1a6 6 0 00-6-6" />
  </svg>
);

const InviteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const HandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11" />
    </svg>
);

const EndCallIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 9c-1.6 0-3.15.25-4.62.72v3.1c0 .47-.23.92-.62 1.22-1.18.88-2.54 1.9-3.68 3.01-.13.13-.2.32-.2.51v.1c0 .35.34.62.68.55 1.21-.24 2.37-.62 3.42-1.12.4-.18.85-.18 1.25 0 2.18 1.01 4.58 1.57 7.15 1.57 2.57 0 4.97-.56 7.15-1.57.4-.18.85-.18 1.25 0 1.05.5 2.21.88 3.42 1.12.34.07.68-.2.68-.55v-.1c0-.19-.07-.38-.2-.51-1.13-1.11-2.5-2.13-3.68-3.01-.39-.3-.62-.75-.62-1.22v-3.1C15.15 9.25 13.6 9 12 9z"/>
    </svg>
);


const ControlBar: React.FC<ControlBarProps> = ({ isMuted, isVideoOn, isScreenSharing, isHandRaised, onToggleMute, onToggleVideo, onToggleScreenShare, onToggleHandRaise, onAttemptLeave, onToggleChat, onToggleParticipants, onInvite }) => {
  return (
    <div className="w-full bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-xl p-4 flex justify-center items-center gap-4">
      <button 
        onClick={onToggleMute}
        className={`p-3 rounded-full transition-colors duration-300 ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <MicIcon muted={isMuted} />
      </button>
      <button 
        onClick={onToggleVideo}
        disabled={isScreenSharing}
        className={`p-3 rounded-full transition-colors duration-300 ${!isVideoOn ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'} disabled:bg-gray-600 disabled:cursor-not-allowed`}
        aria-label={isVideoOn ? 'Stop Video' : 'Start Video'}
      >
        <VideoIcon on={isVideoOn} />
      </button>
       <button 
        onClick={onToggleScreenShare}
        className={`p-3 rounded-full transition-colors duration-300 ${isScreenSharing ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        aria-label={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        <ScreenShareIcon />
      </button>
      <button 
        onClick={onToggleHandRaise}
        className={`p-3 rounded-full transition-colors duration-300 ${isHandRaised ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        aria-label={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
      >
        <HandIcon />
      </button>
      <div className="h-8 border-l border-gray-600 mx-2"></div>
      <button 
        onClick={onInvite}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        aria-label="Invite"
      >
        <InviteIcon />
      </button>
      <button 
        onClick={onToggleParticipants}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        aria-label="Participants"
      >
        <ParticipantsIcon />
      </button>
      <button 
        onClick={onToggleChat}
        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
        aria-label="Chat"
      >
        <ChatIcon />
      </button>
      <div className="h-8 border-l border-gray-600 mx-2"></div>
      <button
        onClick={onAttemptLeave}
        className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors duration-300"
        aria-label="End Call"
      >
        <EndCallIcon />
      </button>
    </div>
  );
};

export default ControlBar;