import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, MessageSender, Participant } from '../types.ts';
import VideoTile from './VideoTile.tsx';
import ControlBar from './ControlBar.tsx';
import TranscriptPanel from './TranscriptPanel.tsx';
import ParticipantsPanel from './ParticipantsPanels.tsx';

const SIGNALING_SERVER_URL = 'http://localhost:3001';

interface MeetingViewProps {
  userName: string;
  roomId: string;
  onLeave: () => void;
  mediaStream: MediaStream | null;
}

const MeetingView: React.FC<MeetingViewProps> = ({ userName, roomId, onLeave, mediaStream }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(mediaStream);
  const cameraStreamRef = useRef<MediaStream | null>(mediaStream);

  // Helper function to create and configure a peer connection
  const createPeerConnection = (peerId: string, peerName: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          target: peerId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log(`Received track from ${peerName}`);
      setParticipants(prev =>
        prev.map(p => (p.id === peerId ? { ...p, stream: event.streams[0] } : p))
      );
    };

    // Add local stream tracks to the connection
    localStreamRef.current?.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current!);
    });

    peerConnectionsRef.current[peerId] = pc;
    return pc;
  };

  useEffect(() => {
    socketRef.current = io(SIGNALING_SERVER_URL);
    const socket = socketRef.current;

    // --- Join Room ---
    socket.emit('join-room', { roomId, userName });

    // --- Handle Room Users ---
    socket.on('room-users', (users: { id: string, name: string }[]) => {
      console.log('Existing users in room:', users);
      const initialParticipants: Participant[] = [];
      users.forEach(user => {
        initialParticipants.push({ id: user.id, name: user.name, isHandRaised: false });
        const pc = createPeerConnection(user.id, user.name);
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit('offer', { target: user.id, sdp: pc.localDescription });
          });
      });
      setParticipants(initialParticipants);
    });
    
    // --- Handle User Joined ---
    socket.on('user-joined', ({ id, name }: { id: string, name: string }) => {
      console.log(`User ${name} joined the room`);
      setParticipants(prev => [...prev, { id, name, isHandRaised: false }]);
      // The new user will send an offer, so we just wait for it.
    });

    // --- Handle Offer ---
    socket.on('offer', async ({ source, sourceName, sdp }) => {
      console.log(`Received offer from ${sourceName}`);
      // Ensure the user is in the participants list before creating the connection
      setParticipants(prev => {
        if (!prev.find(p => p.id === source)) {
          return [...prev, { id: source, name: sourceName, isHandRaised: false }];
        }
        return prev;
      });
      const pc = createPeerConnection(source, sourceName);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { target: source, sdp: pc.localDescription });
    });

    // --- Handle Answer ---
    socket.on('answer', ({ source, sdp }) => {
      const pc = peerConnectionsRef.current[source];
      if (pc) {
        pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    // --- Handle ICE Candidate ---
    socket.on('ice-candidate', ({ source, candidate }) => {
      const pc = peerConnectionsRef.current[source];
      if (pc && candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    
     // --- Handle User Left ---
    socket.on('user-left', (userId: string) => {
        console.log(`User ${userId} left`);
        if (peerConnectionsRef.current[userId]) {
            peerConnectionsRef.current[userId].close();
            delete peerConnectionsRef.current[userId];
        }
        setParticipants(prev => prev.filter(p => p.id !== userId));
    });


    return () => {
      Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
      peerConnectionsRef.current = {};
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userName]);
  

  const handleToggleVideo = () => {
    if (localStreamRef.current && !isScreenSharing) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const handleToggleMute = () => {
    if (localStreamRef.current) {
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if(audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    }
  };
  
   const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen share
      const screenTrack = localStreamRef.current?.getVideoTracks()[0];
      screenTrack?.stop();

      localStreamRef.current = cameraStreamRef.current;
      
      // Replace track for all peers
      for (const peerId in peerConnectionsRef.current) {
        const pc = peerConnectionsRef.current[peerId];
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender && localStreamRef.current) {
          sender.replaceTrack(localStreamRef.current.getVideoTracks()[0]);
        }
      }
      setIsScreenSharing(false);
    } else {
      // Start screen share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        
        screenTrack.onended = () => handleToggleScreenShare(); // Stop when browser UI button is clicked
        
        localStreamRef.current = new MediaStream([screenTrack, ...cameraStreamRef.current!.getAudioTracks()]);

        // Replace track for all peers
        for (const peerId in peerConnectionsRef.current) {
          const pc = peerConnectionsRef.current[peerId];
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }
        setIsScreenSharing(true);
        setIsVideoOn(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  };
  
  const handleSendChatMessage = (message: string) => {
    if (!message.trim()) return;
    const newChatMessage: ChatMessage = {
      sender: MessageSender.ME,
      senderName: userName,
      text: message,
    };
    setChatMessages(prev => [...prev, newChatMessage]);
    // In a real app, you'd emit this message via socket.io
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?roomId=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleToggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (isParticipantsOpen) setIsParticipantsOpen(false);
  };

  const handleToggleParticipants = () => {
    setIsParticipantsOpen(prev => !prev);
    if (isChatOpen) setIsChatOpen(false);
  };
  
  const handleToggleHandRaise = () => setIsHandRaised(prev => !prev); // Simplified for now

  const totalParticipants = participants.length + 1;
  const getGridClasses = (count: number) => {
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2';
    if (count <= 9) return 'grid-cols-3 grid-rows-3';
    return 'grid-cols-4'; // Default for more than 9
  };
  const gridLayoutClasses = getGridClasses(totalParticipants);


  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-gray-900 overflow-hidden">
      <main className="flex-1 relative">
         <div className={`absolute inset-0 grid ${gridLayoutClasses} gap-4 p-4`}>
            <VideoTile 
                name={`${userName} (You)`} 
                stream={localStreamRef.current}
                isMuted={isMuted}
                isVideoOn={isVideoOn} 
                isScreenSharing={isScreenSharing}
                isLocal
            />
            {participants.map(p => (
                <VideoTile
                    key={p.id}
                    name={p.name}
                    stream={p.stream}
                    isMuted={false} // Would need signaling for this
                    isVideoOn={true} // Would need signaling for this
                />
            ))}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-center">
            <ControlBar
              isMuted={isMuted}
              isVideoOn={isVideoOn}
              isScreenSharing={isScreenSharing}
              isHandRaised={isHandRaised}
              onToggleMute={handleToggleMute}
              onToggleVideo={handleToggleVideo}
              onToggleScreenShare={handleToggleScreenShare}
              onToggleHandRaise={handleToggleHandRaise}
              onAttemptLeave={() => setShowLeaveConfirmation(true)}
              onToggleChat={handleToggleChat}
              onToggleParticipants={handleToggleParticipants}
              onInvite={() => setShowInviteModal(true)}
            />
        </div>
      </main>
      
      {isChatOpen && <TranscriptPanel transcript={chatMessages} onSendMessage={handleSendChatMessage} />}
      {isParticipantsOpen && <ParticipantsPanel currentUser={{id: 'local', name: userName, isHandRaised, stream: localStreamRef.current!}} participants={participants} />}
      
      {showLeaveConfirmation && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col gap-4">
                <h2 className="text-xl font-bold">Leave Meeting?</h2>
                <p>Are you sure you want to leave this meeting?</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={() => setShowLeaveConfirmation(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">No</button>
                    <button onClick={onLeave} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500">Yes</button>
                </div>
            </div>
        </div>
      )}

      {showInviteModal && (
         <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col gap-4 w-full max-w-md">
                <h2 className="text-xl font-bold">Invite others to the meeting</h2>
                <p>Share this link with anyone you want to invite.</p>
                <div className="flex items-center gap-2 mt-2">
                    <input 
                        type="text" 
                        readOnly 
                        value={`${window.location.origin}/?roomId=${roomId}`}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    />
                    <button onClick={handleCopyLink} className={`px-4 py-2 font-bold rounded-lg transition-colors ${copied ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}>
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500">Close</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MeetingView;