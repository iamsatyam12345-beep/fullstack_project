export enum MessageSender {
  ME = 'ME',
  // OTHER = 'OTHER' // For future peer-to-peer implementation
}

export interface ChatMessage {
  sender: MessageSender;
  senderName: string;
  text: string;
}

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isHandRaised: boolean;
}