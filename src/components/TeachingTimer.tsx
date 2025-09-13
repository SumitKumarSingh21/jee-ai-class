import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeachingTimerProps {
  targetDuration: number; // in minutes
  isActive: boolean;
  onComplete: () => void;
  onTimeUpdate?: (elapsed: number, remaining: number) => void;
}

export const TeachingTimer: React.FC<TeachingTimerProps> = ({
  targetDuration,
  isActive,
  onComplete,
  onTimeUpdate
}) => {
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [isPaused, setIsPaused] = useState(false);

  const targetSeconds = targetDuration * 60;
  const remainingTime = Math.max(0, targetSeconds - elapsedTime);
  const progress = (elapsedTime / targetSeconds) * 100;

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = prev + 1;
        const newRemaining = Math.max(0, targetSeconds - newElapsed);
        
        onTimeUpdate?.(newElapsed, newRemaining);
        
        if (newElapsed >= targetSeconds) {
          onComplete();
          return targetSeconds;
        }
        
        return newElapsed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, targetSeconds, onComplete, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setElapsedTime(0);
    setIsPaused(false);
  };

  return (
    <Card className="p-4 shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Teaching Timer</h3>
          </div>
          
          <div className="flex gap-2">
            {isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetTimer}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Elapsed</span>
            <span className="text-muted-foreground">Remaining</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              {formatTime(elapsedTime)}
            </span>
            <span className="text-lg font-medium text-muted-foreground">
              {formatTime(remainingTime)}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="text-center">
            <span className="text-xs text-muted-foreground">
              Target: {targetDuration} minutes
            </span>
          </div>
        </div>

        {progress >= 100 && (
          <div className="text-center p-3 bg-green-100 text-green-800 rounded-lg">
            🎉 Teaching session completed! Time to collect your rewards!
          </div>
        )}

        {isPaused && isActive && (
          <div className="text-center p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            ⏸️ Timer paused
          </div>
        )}
      </div>
    </Card>
  );
};