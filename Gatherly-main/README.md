Gatherly

Gatherly is a real-time video conferencing application built using React, Node.js, Socket.IO and WebRTC. It allows users to host and join multi-person video meetings directly in the browser without installing any external app or plugin.

Features

• Create instant meeting rooms
• Join meetings using room ID or shareable link
• Pre-join lobby to preview camera and set display name
• Real-time video and audio communication using WebRTC
• Option to mute or unmute microphone anytime
• Option to start or stop camera anytime
• Screen sharing support
• Raise Hand feature to highlight attention
• Real-time text chat panel
• Participant list section to view all attendees

Tech Stack

Frontend uses React, TypeScript, Tailwind CSS and Vite for fast UI development.
Backend uses Node.js, Express.js and Socket.IO for signaling and real-time events.
WebRTC is used as the core protocol for peer-to-peer audio and video communication.

Project Structure

The project contains two main folders:
The “backend” folder contains the Node.js signaling server which manages rooms and message events. It does not handle actual media.
The “frontend” folder contains the React application responsible for camera access, UI, WebRTC connection, meeting controls and user interface.

Running Instructions (in short)

Start the backend server, then start the frontend app in a separate terminal. After both are running, open the frontend local URL in your browser and create or join a meeting.

Future Improvements

Some planned upgrades are authentication system for login, cloud deployment of both frontend and backend, persistence of chat using a database, and adding a TURN server to improve connectivity in restricted networks.

Conclusion

Gatherly demonstrates the fundamental working of modern real-time communication by using WebRTC, and shows how browser based video meetings can be built using clean architecture and modern web technologies.
