import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, VolumeX } from 'lucide-react';

interface Student {
  name: string;
  avatar: string;
  isActive: boolean;
  lastSpoke?: Date;
  subject_preference: string;
}

interface StudentGridProps {
  activeStudents: Student[];
  currentSpeaker?: string;
}

export const StudentGrid: React.FC<StudentGridProps> = ({ 
  activeStudents, 
  currentSpeaker 
}) => {
  const [animatingStudents, setAnimatingStudents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentSpeaker) {
      setAnimatingStudents(prev => new Set([...prev, currentSpeaker]));
      
      // Stop animation after 3 seconds
      const timer = setTimeout(() => {
        setAnimatingStudents(prev => {
          const newSet = new Set(prev);
          newSet.delete(currentSpeaker);
          return newSet;
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentSpeaker]);

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'physics':
        return 'bg-blue-100 text-blue-800';
      case 'chemistry':
        return 'bg-green-100 text-green-800';
      case 'mathematics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {activeStudents.map((student) => {
        const isCurrentSpeaker = currentSpeaker === student.name;
        const isAnimating = animatingStudents.has(student.name);
        
        return (
          <Card 
            key={student.name}
            className={`p-4 transition-all duration-300 ${
              isCurrentSpeaker 
                ? 'ring-2 ring-secondary shadow-lg scale-105' 
                : 'hover:shadow-md'
            }`}
          >
            <div className="text-center space-y-2">
              {/* Student Avatar */}
              <div 
                className={`text-4xl transition-transform duration-300 ${
                  isAnimating ? 'animate-pulse scale-110' : ''
                }`}
              >
                {student.avatar}
              </div>
              
              {/* Student Name */}
              <h4 className="font-medium text-sm text-foreground">
                {student.name}
              </h4>
              
              {/* Subject Preference */}
              <Badge 
                variant="secondary" 
                className={`text-xs ${getSubjectColor(student.subject_preference)}`}
              >
                {student.subject_preference}
              </Badge>
              
              {/* Speaking Indicator */}
              <div className="flex items-center justify-center">
                {isCurrentSpeaker ? (
                  <div className="flex items-center gap-1 text-secondary">
                    <Volume2 className="h-3 w-3 animate-pulse" />
                    <span className="text-xs">Speaking</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <VolumeX className="h-3 w-3" />
                    <span className="text-xs">Listening</span>
                  </div>
                )}
              </div>
              
              {/* Last Activity */}
              {student.lastSpoke && (
                <div className="text-xs text-muted-foreground">
                  Last spoke: {student.lastSpoke.toLocaleTimeString()}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};