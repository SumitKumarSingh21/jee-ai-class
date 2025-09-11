import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target } from 'lucide-react';

interface ChapterSelectorProps {
  selectedSubject: string;
  selectedChapter: string;
  onSubjectChange: (subject: string) => void;
  onChapterChange: (chapter: string) => void;
}

const subjectData = {
  physics: {
    name: 'Physics',
    icon: '⚡',
    chapters: {
      mechanics: {
        name: 'Mechanics',
        topics: ['Motion in One Dimension', 'Motion in Two Dimensions', 'Laws of Motion', 'Work Energy Power', 'Circular Motion', 'Rotational Motion', 'Gravitation', 'Simple Harmonic Motion'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      thermodynamics: {
        name: 'Thermodynamics',
        topics: ['Kinetic Theory of Gases', 'First Law of Thermodynamics', 'Second Law of Thermodynamics', 'Heat Engines', 'Entropy'],
        difficulty: 'Hard',
        examWeight: '15%'
      },
      electromagnetism: {
        name: 'Electromagnetism',
        topics: ['Electric Charges and Fields', 'Electric Potential', 'Capacitance', 'Current Electricity', 'Magnetic Fields', 'Electromagnetic Induction', 'AC Circuits'],
        difficulty: 'Hard',
        examWeight: '30%'
      },
      waves_and_optics: {
        name: 'Waves and Optics',
        topics: ['Wave Motion', 'Sound Waves', 'Light Waves', 'Interference', 'Diffraction', 'Polarization'],
        difficulty: 'Medium',
        examWeight: '20%'
      },
      modern_physics: {
        name: 'Modern Physics',
        topics: ['Dual Nature of Matter', 'Atoms and Nuclei', 'Electronic Devices'],
        difficulty: 'Medium',
        examWeight: '10%'
      }
    }
  },
  chemistry: {
    name: 'Chemistry',
    icon: '🧪',
    chapters: {
      physical_chemistry: {
        name: 'Physical Chemistry',
        topics: ['Atomic Structure', 'Chemical Bonding', 'Gaseous State', 'Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry'],
        difficulty: 'Hard',
        examWeight: '35%'
      },
      organic_chemistry: {
        name: 'Organic Chemistry',
        topics: ['Basic Principles', 'Hydrocarbons', 'Haloalkanes and Haloarenes', 'Alcohols Phenols Ethers', 'Aldehydes Ketones Carboxylic Acids', 'Nitrogen Compounds', 'Biomolecules', 'Polymers'],
        difficulty: 'Medium',
        examWeight: '40%'
      },
      inorganic_chemistry: {
        name: 'Inorganic Chemistry',
        topics: ['Classification of Elements', 'Hydrogen', 'S-Block Elements', 'P-Block Elements', 'D-Block and F-Block Elements', 'Coordination Compounds', 'Environmental Chemistry'],
        difficulty: 'Easy',
        examWeight: '25%'
      }
    }
  },
  mathematics: {
    name: 'Mathematics',
    icon: '📊',
    chapters: {
      algebra: {
        name: 'Algebra',
        topics: ['Sets Relations Functions', 'Complex Numbers', 'Quadratic Equations', 'Sequences and Series', 'Permutations and Combinations', 'Binomial Theorem', 'Mathematical Induction'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      calculus: {
        name: 'Calculus',
        topics: ['Limits and Derivatives', 'Applications of Derivatives', 'Integrals', 'Applications of Integrals', 'Differential Equations'],
        difficulty: 'Hard',
        examWeight: '35%'
      },
      coordinate_geometry: {
        name: 'Coordinate Geometry',
        topics: ['Straight Lines', 'Circles', 'Parabola', 'Ellipse', 'Hyperbola', 'Three Dimensional Geometry'],
        difficulty: 'Medium',
        examWeight: '25%'
      },
      trigonometry: {
        name: 'Trigonometry',
        topics: ['Trigonometric Functions', 'Inverse Trigonometric Functions', 'Trigonometric Equations', 'Properties of Triangles'],
        difficulty: 'Easy',
        examWeight: '10%'
      },
      probability_and_statistics: {
        name: 'Probability and Statistics',
        topics: ['Probability', 'Random Variables', 'Distributions', 'Statistics'],
        difficulty: 'Medium',
        examWeight: '5%'
      }
    }
  }
};

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({
  selectedSubject,
  selectedChapter,
  onSubjectChange,
  onChapterChange
}) => {
  const currentSubject = subjectData[selectedSubject as keyof typeof subjectData];
  const currentChapter = currentSubject?.chapters[selectedChapter as keyof typeof currentSubject.chapters] as any;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 shadow-medium">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Daily Lesson Plan</h3>
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subject:</label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(subjectData).map(([key, subject]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{subject.icon}</span>
                    <span>{subject.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Chapter:</label>
          <Select value={selectedChapter} onValueChange={onChapterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a chapter" />
            </SelectTrigger>
            <SelectContent>
              {currentSubject && Object.entries(currentSubject.chapters).map(([key, chapter]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center justify-between w-full">
                    <span>{chapter.name}</span>
                    <Badge variant="secondary" className={getDifficultyColor(chapter.difficulty)}>
                      {chapter.difficulty}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter Details */}
        {currentChapter && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">{currentChapter.name}</h4>
              <div className="flex gap-2">
                <Badge variant="outline" className={getDifficultyColor(currentChapter.difficulty)}>
                  <Target className="h-3 w-3 mr-1" />
                  {currentChapter.difficulty}
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentChapter.examWeight}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Topics to cover:</p>
              <div className="flex flex-wrap gap-1">
                {currentChapter.topics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};