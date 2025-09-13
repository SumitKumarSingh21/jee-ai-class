import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, Coins } from 'lucide-react';

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
}

const durationOptions = [
  { value: 15, label: '15 minutes', coins: 10, experience: 25, difficulty: 'Quick' },
  { value: 30, label: '30 minutes', coins: 25, experience: 50, difficulty: 'Standard' },
  { value: 45, label: '45 minutes', coins: 40, experience: 75, difficulty: 'Extended' },
  { value: 60, label: '1 hour', coins: 60, experience: 100, difficulty: 'Full Session' },
  { value: 90, label: '1.5 hours', coins: 100, experience: 150, difficulty: 'Master Class' }
];

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  const selectedOption = durationOptions.find(option => option.value === selectedDuration);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Quick':
        return 'bg-green-100 text-green-800';
      case 'Standard':
        return 'bg-blue-100 text-blue-800';
      case 'Extended':
        return 'bg-yellow-100 text-yellow-800';
      case 'Full Session':
        return 'bg-orange-100 text-orange-800';
      case 'Master Class':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Teaching Duration</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Select Duration:</label>
          <Select value={selectedDuration.toString()} onValueChange={(value) => onDurationChange(parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose teaching duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                      <Badge variant="outline" className={getDifficultyColor(option.difficulty)}>
                        {option.difficulty}
                      </Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOption && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Reward Preview</h4>
              <Badge variant="outline" className={getDifficultyColor(selectedOption.difficulty)}>
                {selectedOption.difficulty}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Coins</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">+{selectedOption.coins}</span>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">XP</span>
                </div>
                <span className="text-lg font-bold text-blue-600">+{selectedOption.experience}</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Complete the full {selectedOption.label} session to earn these rewards!
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};