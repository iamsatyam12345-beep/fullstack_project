import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage, MessageSender } from '../types';

interface ChatPanelProps {
  transcript: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const TranscriptPanel: React.FC<ChatPanelProps> = ({ transcript, onSendMessage }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 flex flex-col h-1/3 md:h-full">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">Meeting Chat</h2>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {transcript.map((entry, index) => (
          <div
            key={index}
            className={`flex flex-col ${entry.sender === MessageSender.ME ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-sm rounded-lg px-4 py-2 ${
                entry.sender === MessageSender.ME
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="font-bold text-sm mb-1">
                {entry.senderName}
              </p>
              <p className="whitespace-pre-wrap break-words">{entry.text}</p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input 
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 disabled:bg-gray-600" disabled={!message.trim()}>
                Send
            </button>
        </form>
      </div>
    </aside>
  );
};

export default TranscriptPanel;