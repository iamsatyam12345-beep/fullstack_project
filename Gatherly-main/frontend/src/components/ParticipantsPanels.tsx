import React from 'react';
import { Participant } from '../types';

interface ParticipantsPanelProps {
  currentUser: Participant;
  participants: Participant[];
}

const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({ currentUser, participants }) => {
  const allParticipants = [currentUser, ...participants];

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-gray-800 flex flex-col h-1/3 md:h-full">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center">Participants ({allParticipants.length})</h2>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {allParticipants.map(p => (
            <div key={p.id} className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{p.name}{p.id === currentUser.id ? ' (You)' : ''}</span>
                </div>
                {p.isHandRaised && (
                  <span role="img" aria-label="Hand raised">✋</span>
                )}
            </div>
        ))}
      </div>
    </aside>
  );
};

export default ParticipantsPanel;