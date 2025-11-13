import React from 'react';

interface HomeProps {
  onStartJoining: (mode: 'create' | 'join') => void;
}

const Home: React.FC<HomeProps> = ({ onStartJoining }) => {
  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center gap-6 text-center">
      <h1 className="text-5xl font-bold text-cyan-400">Gatherly</h1>
      <p className="text-lg text-gray-300">Connect with your friends 😀</p>
      <div className="w-full flex flex-col gap-4 mt-4">
        <button
          onClick={() => onStartJoining('create')}
          className="w-full px-4 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Create a new meeting
        </button>
        <button
          onClick={() => onStartJoining('join')}
          className="w-full px-4 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2"
        >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
          Join a meeting
        </button>
      </div>
    </div>
  );
};

export default Home;