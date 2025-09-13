import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trophy, Coins, Award, Star, Sparkles, Crown, Clock } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinsEarned: number;
  experienceEarned: number;
  duration: number;
  subject: string;
  chapter: string;
  subChapter?: string;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  coinsEarned,
  experienceEarned,
  duration,
  subject,
  chapter,
  subChapter
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [newTitle, setNewTitle] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
      
      // Check for new titles based on total coins
      const currentCoins = parseInt(localStorage.getItem('totalCoins') || '0') + coinsEarned;
      const currentTitle = localStorage.getItem('currentTitle') || 'Beginner';
      
      const titles = [
        { threshold: 0, title: 'Beginner', icon: '🌱' },
        { threshold: 100, title: 'Student', icon: '📚' },
        { threshold: 300, title: 'Scholar', icon: '🎓' },
        { threshold: 600, title: 'Expert', icon: '⭐' },
        { threshold: 1000, title: 'Master Teacher', icon: '👨‍🏫' },
        { threshold: 1500, title: 'Professor', icon: '🎯' },
        { threshold: 2500, title: 'Guru', icon: '🧙‍♂️' },
        { threshold: 5000, title: 'Legend', icon: '👑' }
      ];
      
      const newTitleObj = titles.reverse().find(t => currentCoins >= t.threshold);
      if (newTitleObj && newTitleObj.title !== currentTitle) {
        setNewTitle(newTitleObj.title);
        localStorage.setItem('currentTitle', newTitleObj.title);
      }
      
      // Update total coins and experience
      localStorage.setItem('totalCoins', currentCoins.toString());
      const currentXP = parseInt(localStorage.getItem('totalExperience') || '0') + experienceEarned;
      localStorage.setItem('totalExperience', currentXP.toString());
    }
  }, [isOpen, coinsEarned, experienceEarned]);

  const handleClaim = () => {
    setShowAnimation(false);
    onClose();
  };

  const getSubjectEmoji = (subject: string) => {
    switch (subject) {
      case 'physics': return '⚡';
      case 'chemistry': return '🧪';
      case 'mathematics': return '📊';
      default: return '📚';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Session Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Animation Effect */}
          {showAnimation && (
            <div className="text-center">
              <div className="text-6xl animate-bounce mb-2">🎉</div>
              <div className="text-lg font-semibold text-primary">
                Congratulations!
              </div>
            </div>
          )}

          {/* Session Summary */}
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-lg font-medium">
                <span className="text-2xl">{getSubjectEmoji(subject)}</span>
                <span className="capitalize">{subject}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {chapter} {subChapter && `• ${subChapter}`}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{duration} minutes taught</span>
              </div>
            </div>
          </Card>

          {/* Rewards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center bg-yellow-50 border-yellow-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Coins Earned</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">+{coinsEarned}</div>
            </Card>
            
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Experience</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">+{experienceEarned}</div>
            </Card>
          </div>

          {/* New Title Unlock */}
          {newTitle && (
            <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Title Unlocked!</span>
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2">
                  {newTitle}
                </Badge>
                <div className="text-sm text-purple-700">
                  You've earned a new title for your dedication!
                </div>
              </div>
            </Card>
          )}

          {/* Motivational Message */}
          <div className="text-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 inline mr-1" />
            Keep teaching to unlock more rewards and titles!
          </div>

          {/* Claim Button */}
          <Button onClick={handleClaim} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white">
            <Trophy className="h-4 w-4 mr-2" />
            Claim Rewards
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};