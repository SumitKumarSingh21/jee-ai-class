import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/ChatMessage';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { VideoControls } from '@/components/VideoControls';
import { StudentGrid } from '@/components/StudentGrid';
import { ChapterSelector } from '@/components/ChapterSelector';
import { ClearConversation } from '@/components/ClearConversation';
import { StudentSimulator } from '@/utils/studentSimulator';

export interface Message {
  id: string;
  type: 'teacher' | 'student';
  content: string;
  timestamp: Date;
  studentName?: string;
  avatar?: string;
  voiceType?: string;
}

interface Student {
  name: string;
  avatar: string;
  isActive: boolean;
  lastSpoke?: Date;
  subject_preference: string;
}

const subjects = [
  { value: 'physics', label: 'Physics', icon: '⚡' },
  { value: 'chemistry', label: 'Chemistry', icon: '🧪' },
  { value: 'mathematics', label: 'Mathematics', icon: '📊' }
];

export const TeachingInterface: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('mechanics');
  const [selectedSubChapter, setSelectedSubChapter] = useState<string>('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const studentSimulator = useRef(new StudentSimulator());

  // Initialize active students
  useEffect(() => {
    const students: Student[] = [
      { name: 'Priya', avatar: '👩‍🎓', isActive: true, subject_preference: 'mathematics' },
      { name: 'Arjun', avatar: '👨‍🎓', isActive: true, subject_preference: 'physics' },
      { name: 'Sneha', avatar: '👩‍💻', isActive: true, subject_preference: 'chemistry' },
      { name: 'Rohit', avatar: '👨‍💻', isActive: true, subject_preference: 'mathematics' },
      { name: 'Ananya', avatar: '👩‍🔬', isActive: true, subject_preference: 'physics' },
      { name: 'Karthik', avatar: '👨‍🔬', isActive: true, subject_preference: 'chemistry' },
      { name: 'Divya', avatar: '👩‍🏫', isActive: true, subject_preference: 'mathematics' },
      { name: 'Varun', avatar: '👨‍🎯', isActive: true, subject_preference: 'physics' }
    ];
    setActiveStudents(students);
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';
      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setCurrentTranscript(finalTranscript + interimTranscript);
      };
      
      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive"
        });
        setIsRecording(false);
      };
      
      rec.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(rec);
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome or Edge.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = useCallback(() => {
    if (recognition) {
      setCurrentTranscript('');
      recognition.start();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Start teaching! The AI students are listening.",
      });
    }
  }, [recognition, toast]);

  const stopRecording = useCallback(async () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      
      if (currentTranscript.trim()) {
        await processTeacherInput(currentTranscript.trim());
      }
    }
  }, [recognition, currentTranscript]);

  const processTeacherInput = async (transcript: string) => {
    setIsProcessing(true);
    
    // Add teacher message
    const teacherMessage: Message = {
      id: `teacher-${Date.now()}`,
      type: 'teacher',
      content: transcript,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, teacherMessage]);
    
    try {
      // Get AI student responses
      const studentResponses = await studentSimulator.current.generateResponses(
        transcript, 
        selectedSubject
      );
      
      // Add student messages with delays for natural conversation flow
      for (let i = 0; i < studentResponses.length; i++) {
        setTimeout(() => {
          const response = studentResponses[i];
          const studentMessage: Message = {
            id: `student-${Date.now()}-${i}`,
            type: 'student',
            content: response.content,
            timestamp: new Date(),
            studentName: response.studentName,
            avatar: response.avatar,
            voiceType: response.voiceType
          };
          
          setMessages(prev => [...prev, studentMessage]);
          
          // Update student activity
          setActiveStudents(prev => prev.map(student => 
            student.name === response.studentName 
              ? { ...student, lastSpoke: new Date() }
              : student
          ));
          
          // Set current speaker
          setCurrentSpeaker(response.studentName);
          
          // Text-to-speech for student response
          speakText(response.content, response.studentName, response.voiceType);
          
          // Clear current speaker after speaking
          setTimeout(() => setCurrentSpeaker(''), 3000);
        }, (i + 1) * 2000); // 2 second delay between responses
      }
    } catch (error) {
      console.error('Error processing teacher input:', error);
      toast({
        title: "Processing Error",
        description: "There was an issue processing your input. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setCurrentTranscript('');
    }
  };

  const speakText = (text: string, studentName: string, voiceType: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Enhanced voice selection based on voiceType
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        let selectedVoice = null;
        
        // Voice mapping based on voiceType
        switch (voiceType) {
          case 'female-high':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female') || 
              voice.name.toLowerCase().includes('zira') ||
              voice.name.toLowerCase().includes('susan')
            );
            utterance.pitch = 1.2;
            break;
          case 'male-deep':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('male') || 
              voice.name.toLowerCase().includes('david') ||
              voice.name.toLowerCase().includes('mark')
            );
            utterance.pitch = 0.8;
            break;
          case 'female-medium':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female') || 
              voice.name.toLowerCase().includes('hazel')
            );
            utterance.pitch = 1.0;
            break;
          case 'male-medium':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('male') && 
              !voice.name.toLowerCase().includes('deep')
            );
            utterance.pitch = 0.9;
            break;
          case 'female-soft':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female')
            );
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            break;
          case 'male-energetic':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('male')
            );
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            break;
          case 'female-calm':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female')
            );
            utterance.rate = 0.7;
            utterance.pitch = 0.9;
            break;
          case 'male-quick':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('male')
            );
            utterance.rate = 1.2;
            utterance.pitch = 1.1;
            break;
          default:
            selectedVoice = voices[Math.floor(Math.random() * Math.min(voices.length, 4))];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentTranscript('');
    toast({
      title: "Conversation Cleared",
      description: "Ready for a new teaching session!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">JEE Virtual Classroom</h1>
                <p className="text-muted-foreground">Teach with AI students in an immersive Zoom-like experience</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">{activeStudents.length} AI Students Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Chapter Selection */}
          <div className="xl:col-span-1 space-y-6">
            <ChapterSelector
              selectedSubject={selectedSubject}
              selectedChapter={selectedChapter}
              selectedSubChapter={selectedSubChapter}
              onSubjectChange={setSelectedSubject}
              onChapterChange={setSelectedChapter}
              onSubChapterChange={setSelectedSubChapter}
            />
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Teacher Video */}
              <div className="lg:col-span-1">
                <VideoControls
                  isRecording={isRecording}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Live Transcript */}
              <div className="lg:col-span-2">
                <TranscriptDisplay 
                  transcript={currentTranscript}
                  isRecording={isRecording}
                />
              </div>
            </div>

            {/* Student Grid */}
            <Card className="p-6 shadow-medium">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Students
              </h3>
              <StudentGrid 
                activeStudents={activeStudents}
                currentSpeaker={currentSpeaker}
              />
            </Card>
            {/* Chat Interface */}
            <Card className="h-[400px] flex flex-col shadow-medium">
              <div className="p-4 border-b border-border bg-teacher-bg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Classroom Conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your AI students will ask questions and engage with your teaching
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="space-y-2">
                      <div className="text-6xl">🎓</div>
                      <h4 className="text-lg font-medium text-foreground">Ready to Start Teaching!</h4>
                      <p className="text-muted-foreground">
                        Click "Start Teaching" and begin explaining a {selectedSubject} topic.
                        <br />Your AI students will ask questions and engage with you.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </Card>
            
            {/* Clear Conversation */}
            <ClearConversation
              onClear={clearConversation}
              disabled={isRecording || isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};