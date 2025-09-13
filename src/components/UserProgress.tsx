import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Award, Crown, TrendingUp, User, Star } from 'lucide-react';

export const UserProgress: React.FC = () => {
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalExperience, setTotalExperience] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('Beginner');

  useEffect(() => {
    const coins = parseInt(localStorage.getItem('totalCoins') || '0');
    const xp = parseInt(localStorage.getItem('totalExperience') || '0');
    const title = localStorage.getItem('currentTitle') || 'Beginner';
    
    setTotalCoins(coins);
    setTotalExperience(xp);
    setCurrentTitle(title);
  }, []);

  const titles = [
    { threshold: 0, title: 'Beginner', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { threshold: 100, title: 'Student', icon: '📚', color: 'bg-blue-100 text-blue-800' },
    { threshold: 300, title: 'Scholar', icon: '🎓', color: 'bg-purple-100 text-purple-800' },
    { threshold: 600, title: 'Expert', icon: '⭐', color: 'bg-yellow-100 text-yellow-800' },
    { threshold: 1000, title: 'Master Teacher', icon: '👨‍🏫', color: 'bg-orange-100 text-orange-800' },
    { threshold: 1500, title: 'Professor', icon: '🎯', color: 'bg-red-100 text-red-800' },
    { threshold: 2500, title: 'Guru', icon: '🧙‍♂️', color: 'bg-indigo-100 text-indigo-800' },
    { threshold: 5000, title: 'Legend', icon: '👑', color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' }
  ];

  const currentTitleIndex = titles.findIndex(t => t.title === currentTitle);
  const nextTitle = titles[currentTitleIndex + 1];
  const currentTitleData = titles[currentTitleIndex];
  
  const progressToNext = nextTitle 
    ? ((totalCoins - currentTitleData.threshold) / (nextTitle.threshold - currentTitleData.threshold)) * 100
    : 100;

  const level = Math.floor(totalExperience / 100) + 1;
  const xpProgress = (totalExperience % 100);

  return (
    <Card className="p-6 shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Your Progress</h3>
        </div>

        {/* Current Title */}
        <div className="text-center space-y-2">
          <div className="text-3xl">{currentTitleData.icon}</div>
          <Badge className={`text-lg px-4 py-2 ${currentTitleData.color}`}>
            {currentTitle}
          </Badge>
          <div className="text-sm text-muted-foreground">
            Teaching Level {level}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Coins className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Total Coins</span>
            </div>
            <div className="text-xl font-bold text-yellow-600">{totalCoins}</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Experience</span>
            </div>
            <div className="text-xl font-bold text-blue-600">{totalExperience}</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Level {level} Progress</span>
            <span className="text-muted-foreground">{xpProgress}/100 XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>

        {/* Next Title Progress */}
        {nextTitle && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextTitle.title}</span>
              <span className="text-muted-foreground">
                {totalCoins}/{nextTitle.threshold} coins
              </span>
            </div>
            <Progress value={Math.min(progressToNext, 100)} className="h-2" />
            <div className="text-center">
              <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {nextTitle.threshold - totalCoins} coins to unlock {nextTitle.icon} {nextTitle.title}
              </span>
            </div>
          </div>
        )}

        {/* Achievement Message */}
        {currentTitle === 'Legend' && (
          <div className="text-center p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-300">
            <Crown className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
            <div className="text-sm font-medium text-yellow-800">
              🎉 Maximum title achieved! You are a true teaching legend!
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};