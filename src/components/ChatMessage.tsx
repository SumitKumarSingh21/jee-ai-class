import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { Message } from '@/components/TeachingInterface';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStudentAvatar = (studentName: string) => {
    const avatars: Record<string, string> = {
      'Priya': 'P',
      'Arjun': 'A',
      'Rahul': 'R',
      'Sneha': 'S'
    };
    return avatars[studentName] || 'S';
  };

  const getStudentColor = (studentName: string) => {
    const colors: Record<string, string> = {
      'Priya': 'bg-secondary text-secondary-foreground',
      'Arjun': 'bg-primary text-primary-foreground',
      'Rahul': 'bg-accent text-accent-foreground',
      'Sneha': 'bg-muted text-muted-foreground'
    };
    return colors[studentName] || 'bg-secondary text-secondary-foreground';
  };

  if (message.type === 'teacher') {
    return (
      <div className="flex gap-3 animate-fade-in">
        <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Teacher</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          </div>
          <Card className="p-3 bg-teacher-bg border-l-4 border-l-primary">
            <p className="text-foreground leading-relaxed">{message.content}</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in ml-8">
      <Avatar className={`h-10 w-10 ${getStudentColor(message.studentName || 'Student')}`}>
        <AvatarFallback>
          {getStudentAvatar(message.studentName || 'Student')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Users className="h-4 w-4" />
            {message.studentName || 'Student'}
          </span>
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
        </div>
        <Card className="p-3 bg-student-bg border-l-4 border-l-secondary">
          <p className="text-foreground leading-relaxed">{message.content}</p>
        </Card>
      </div>
    </div>
  );
};