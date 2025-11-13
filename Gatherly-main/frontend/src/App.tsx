
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Home from './components/Home.tsx';
import Lobby from './components/Lobby.tsx';
import MeetingView from './components/MeetingView.tsx';

type AppState = 'home' | 'joining' | 'inMeeting';
type JoinMode = 'create' | 'join';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [userName, setUserName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const mediaStreamRef = useRef(mediaStream);
  mediaStreamRef.current = mediaStream;

  // Effect to handle joining via URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const queryRoomId = urlParams.get('roomId');
    if (queryRoomId && appState === 'home') {
      setRoomId(queryRoomId);
      setAppState('joining');
    }
  }, [appState]);


  useEffect(() => {
    const cleanupStream = () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    };

    const setupStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        setMediaError(null);
      } catch (err) {
        console.error('Error accessing media devices.', err);
        setMediaError('Could not access camera and microphone. Please check permissions and try again.');
        cleanupStream(); // Ensure any partial stream is cleaned up
      }
    };

    if (appState === 'joining' && !mediaStream) {
      setupStream();
    } else if (appState === 'home') {
      cleanupStream();
    }
  }, [appState]);


  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const handleStartJoining = useCallback((mode: JoinMode) => {
    if (mode === 'create') {
      const newRoomId = generateRoomId();
      setRoomId(newRoomId);
    } else {
      setRoomId(''); // Clear room ID for joining
    }
    setAppState('joining');
  }, []);

  const handleJoinMeeting = useCallback((name: string, id: string) => {
    setUserName(name || 'You');
    setRoomId(id);
    setAppState('inMeeting');

    // Update URL if not already set correctly
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('roomId') !== id) {
        const newUrl = `${window.location.pathname}?roomId=${id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }, []);

  const handleLeaveMeeting = useCallback(() => {
    setUserName('');
    setRoomId('');
    // Clear roomId from URL
    if (window.location.search) {
      window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
    }
    setAppState('home');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'inMeeting':
        return <MeetingView userName={userName} roomId={roomId} onLeave={handleLeaveMeeting} mediaStream={mediaStream} />;
      case 'joining':
        return <Lobby onJoin={handleJoinMeeting} initialRoomId={roomId} mediaStream={mediaStream} error={mediaError} />;
      case 'home':
      default:
        return <Home onStartJoining={handleStartJoining} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans">
      {renderContent()}
    </div>
  );
};

export default App;