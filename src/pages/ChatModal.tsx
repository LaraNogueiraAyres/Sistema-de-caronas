import { useState, useRef, useEffect } from 'react';
import { X, Send, User } from 'lucide-react';
import { formatLocalDate } from "../utils/date";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  otherUser: {
    id: string;
    name: string;
    rating: number;
  };
  rideInfo: {
    date: string;
    origin: string;
    destination: string;
  };
}

export function ChatModal({ isOpen, onClose, otherUser, rideInfo }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: otherUser.id,
      senderName: otherUser.name,
      text: 'Olá! Tudo bem?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Você',
      text: 'Oi! Tudo ótimo, obrigado!',
      timestamp: new Date(Date.now() - 3000000),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Você',
      text: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return formatLocalDate(dateString, {
      day: '2-digit',
      month: 'short',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary text-primary-foreground rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">{otherUser.name}</h3>
              <p className="text-xs text-primary-foreground/80">
                {formatDate(rideInfo.date)} • {rideInfo.origin.split(',')[0]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ride Info Banner */}
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs text-blue-800">
            <span className="font-medium">Carona:</span> {rideInfo.origin.split(',')[0]} → {rideInfo.destination.split(',')[0]}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] ${
                  message.senderId === 'me'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-gray-900 border border-gray-200'
                } rounded-2xl px-4 py-2 shadow-sm`}
              >
                <p className="text-sm break-words">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.senderId === 'me' ? 'text-primary-foreground/70' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-background rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
            />
            <button
              type="submit"
              disabled={newMessage.trim() === ''}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-[#2d4a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
