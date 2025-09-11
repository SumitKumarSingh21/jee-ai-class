import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, Users, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/ChatMessage';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { StudentSimulator } from '@/utils/studentSimulator';

export interface Message {
  id: string;
  type: 'teacher' | 'student';
  content: string;
  timestamp: Date;
  studentName?: string;
}

const subjects = [
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'mathematics', label: 'Mathematics' }
];

export const TeachingInterface: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('physics');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const studentSimulator = useRef(new StudentSimulator());

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
          const studentMessage: Message = {
            id: `student-${Date.now()}-${i}`,
            type: 'student',
            content: studentResponses[i].content,
            timestamp: new Date(),
            studentName: studentResponses[i].studentName
          };
          
          setMessages(prev => [...prev, studentMessage]);
          
          // Text-to-speech for student response
          speakText(studentResponses[i].content, studentResponses[i].studentName);
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

  const speakText = (text: string, studentName: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Try to use a different voice for each student
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const femaleVoices = voices.filter(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('susan')
        );
        const maleVoices = voices.filter(voice => 
          voice.name.toLowerCase().includes('male') || 
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('mark')
        );
        
        if (studentName === 'Priya' && femaleVoices.length > 0) {
          utterance.voice = femaleVoices[0];
        } else if (studentName === 'Arjun' && maleVoices.length > 0) {
          utterance.voice = maleVoices[0];
        } else if (voices.length > 1) {
          utterance.voice = voices[1];
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
                <h1 className="text-3xl font-bold text-foreground">JEE Teaching Assistant</h1>
                <p className="text-muted-foreground">Teach with AI students who ask questions and engage</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">2 AI Students Online</span>
            </div>
          </div>
          
          {/* Subject Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Subject:</label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teaching Controls & Transcript */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recording Controls */}
            <Card className="p-6 shadow-teaching">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Teaching Controls
              </h3>
              
              <div className="space-y-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-full h-12 text-lg font-medium transition-smooth ${
                    isRecording 
                      ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                      : 'bg-gradient-primary hover:opacity-90 text-primary-foreground'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      Stop & Send
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Teaching
                    </>
                  )}
                </Button>
                
                {isProcessing && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <div className="animate-pulse mr-2">●</div>
                    AI students are thinking...
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={clearConversation}
                  className="w-full"
                  disabled={isRecording || isProcessing}
                >
                  Clear Conversation
                </Button>
              </div>
            </Card>

            {/* Live Transcript */}
            <TranscriptDisplay 
              transcript={currentTranscript}
              isRecording={isRecording}
            />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col shadow-medium">
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
          </div>
        </div>
      </div>
    </div>
  );
};