import React from 'react';
import { Card } from '@/components/ui/card';
import { Mic, FileText } from 'lucide-react';

interface TranscriptDisplayProps {
  transcript: string;
  isRecording: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  transcript, 
  isRecording 
}) => {
  return (
    <Card className="p-6 shadow-soft">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Live Transcript
      </h3>
      
      <div className="min-h-[120px] p-4 bg-transcript-bg rounded-lg border border-border">
        {isRecording && (
          <div className="flex items-center gap-2 mb-3 text-primary">
            <Mic className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
        )}
        
        {transcript ? (
          <p className="text-foreground leading-relaxed">
            {transcript}
          </p>
        ) : (
          <p className="text-muted-foreground italic">
            {isRecording 
              ? "Start speaking to see your words appear here..." 
              : "Your speech will appear here when you start teaching"
            }
          </p>
        )}
      </div>
      
      {isRecording && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            Recording in progress - click "Stop & Send" when finished
          </div>
        </div>
      )}
    </Card>
  );
};