import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ClearConversationProps {
  onClear: () => void;
  disabled: boolean;
}

export const ClearConversation: React.FC<ClearConversationProps> = ({ onClear, disabled }) => {
  return (
    <Card className="p-4 shadow-soft">
      <div className="space-y-2">
        <h4 className="font-medium text-foreground">Session Controls</h4>
        <Button 
          variant="outline" 
          onClick={onClear}
          className="w-full"
          disabled={disabled}
        >
          Clear Conversation
        </Button>
        <p className="text-xs text-muted-foreground">
          Start a fresh teaching session
        </p>
      </div>
    </Card>
  );
};