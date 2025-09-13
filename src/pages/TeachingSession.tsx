import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Camera, CameraOff, Mic, MicOff, Users, MessageSquare, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/components/ChatMessage';
import { StudentSimulator } from '@/utils/studentSimulator';
import { Message } from '@/components/TeachingInterface';

interface Student {
  name: string;
  avatar: string;
  isActive: boolean;
  lastSpoke?: Date;
  subject_preference: string;
}

const TeachingSession: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { selectedSubject, selectedChapter, subjectName, chapterName } = location.state || {};
  
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const studentSimulator = useRef(new StudentSimulator());

  // Real-time processing helpers
  const pendingChunkRef = useRef<string>('');
  const silenceTimerRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);
  const isRecordingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);
  useEffect(() => { isRecordingRef.current = isRecording; }, [isRecording]);

  const processTeacherInput = useCallback(async (transcript: string) => {
    setIsProcessing(true);

    // Add teacher message
    const teacherMessage: Message = {
      id: `teacher-${Date.now()}`,
      type: 'teacher',
      content: transcript,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, teacherMessage]);

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
            voiceType: response.voiceType,
          };

          setMessages((prev) => [...prev, studentMessage]);

          // Update student activity
          setActiveStudents((prev) =>
            prev.map((student) =>
              student.name === response.studentName
                ? { ...student, lastSpoke: new Date() }
                : student
            )
          );

          // Set current speaker
          setCurrentSpeaker(response.studentName);

          // Text-to-speech for student response
          speakText(response.content, response.studentName, response.voiceType);

          // Clear current speaker after speaking
          setTimeout(() => setCurrentSpeaker(''), 3000);
        }, (i + 1) * 2000);
      }
    } catch (error) {
      console.error('Error processing teacher input:', error);
      toast({
        title: 'Processing Error',
        description: 'There was an issue processing your input. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setCurrentTranscript('');
    }
  }, [selectedSubject, toast]);

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

  // Initialize camera
  useEffect(() => {
    if (isCameraOn) {
      startVideo();
    } else {
      stopVideo();
    }
    
    return () => stopVideo();
  }, [isCameraOn]);

  // Initialize speech recognition with real-time chunking
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();

      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      const scheduleProcess = (force: boolean) => {
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        // If not recording, skip scheduling
        if (!isRecordingRef.current) return;
        // On short pause, process what we have
        silenceTimerRef.current = window.setTimeout(() => {
          const chunk = pendingChunkRef.current.trim();
          if (!chunk) return;
          pendingChunkRef.current = '';
          // Process remaining chunk
          processTeacherInput(chunk);
        }, force ? 0 : 1200); // 1.2s of silence means "end of thought"
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // Accumulate final phrases into pending chunk
            const trimmed = transcript.trim();
            pendingChunkRef.current = [pendingChunkRef.current, trimmed]
              .filter(Boolean)
              .join(' ')
              .trim();

            // If sentence-like end or long chunk, process immediately; otherwise wait for silence
            if (/[.!?)]$/.test(trimmed) || pendingChunkRef.current.length > 100) {
              scheduleProcess(true);
            } else {
              scheduleProcess(false);
            }
          } else {
            interimTranscript += transcript;
          }
        }

        const combined = [pendingChunkRef.current, interimTranscript].filter(Boolean).join(' ').trim();
        setCurrentTranscript(combined);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: 'Speech Recognition Error',
          description: 'There was an issue with speech recognition. Please try again.',
          variant: 'destructive',
        });
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
        // Clear any pending timers when recognition ends
        if (silenceTimerRef.current) {
          window.clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };

      setRecognition(rec);
    }

    return () => {
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [toast, processTeacherInput]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 },
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

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

      // Clear any pending timer and flush remaining chunk
      if (silenceTimerRef.current) {
        window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      const leftover = pendingChunkRef.current.trim();
      pendingChunkRef.current = '';

      if (leftover && leftover.length > 10) {
        await processTeacherInput(leftover);
      }

      setCurrentTranscript('');
    }
  }, [recognition, processTeacherInput]);


  const speakText = (text: string, studentName: string, voiceType: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        let selectedVoice = null;
        
        switch (voiceType) {
          case 'female-high':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('female') || 
              voice.name.toLowerCase().includes('zira')
            );
            utterance.pitch = 1.2;
            break;
          case 'male-deep':
            selectedVoice = voices.find(voice => 
              voice.name.toLowerCase().includes('male') || 
              voice.name.toLowerCase().includes('david')
            );
            utterance.pitch = 0.8;
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

  const getStudentTileColor = (student: Student) => {
    if (currentSpeaker === student.name) {
      return 'ring-4 ring-primary ring-opacity-50 shadow-glow';
    }
    return 'hover:shadow-md';
  };

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

  if (!selectedSubject || !selectedChapter) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">No Lesson Selected</h2>
          <p className="text-muted-foreground mb-6">Please select a subject and chapter to start teaching.</p>
          <Button onClick={() => navigate('/lesson-plan')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lesson Plan
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/lesson-plan')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lesson Plan
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {subjectName} - {chapterName}
              </h1>
              <p className="text-sm text-muted-foreground">Live Teaching Session</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{activeStudents.length} Students</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Teaching Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Teacher Video */}
            <Card className="overflow-hidden shadow-medium">
              <div className="aspect-video bg-black relative">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900">
                    <div className="text-center text-white">
                      <CameraOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera is off</p>
                    </div>
                  </div>
                )}
                
                {/* Teacher Controls Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <Button
                    onClick={toggleCamera}
                    size="lg"
                    variant={isCameraOn ? "secondary" : "destructive"}
                    className="rounded-full"
                  >
                    {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    disabled={isProcessing}
                    className="rounded-full px-6"
                  >
                    {isRecording ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                    {isRecording ? "Stop Teaching" : "Start Teaching"}
                  </Button>
                </div>

                {/* Live Transcript Overlay */}
                {currentTranscript && (
                  <div className="absolute bottom-20 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm">You're saying: "{currentTranscript}"</p>
                  </div>
                )}
                
                {/* Teacher Label */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>Teacher</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Student Grid */}
            <Card className="p-6 shadow-medium">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                AI Students ({activeStudents.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {activeStudents.map((student) => (
                  <div
                    key={student.name}
                    className={`relative bg-gray-900 rounded-lg aspect-video overflow-hidden transition-all ${getStudentTileColor(student)}`}
                  >
                    {/* Student Video Placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <div className={`text-4xl mb-2 ${currentSpeaker === student.name ? 'animate-bounce' : ''}`}>
                          {student.avatar}
                        </div>
                        <div className="text-white text-sm font-medium">{student.name}</div>
                      </div>
                    </div>
                    
                    {/* Student Info Overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-medium">{student.name}</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${getSubjectColor(student.subject_preference).split(' ')[0]}`} />
                          {currentSpeaker === student.name && (
                            <div className="flex gap-1">
                              <div className="w-1 h-3 bg-green-400 rounded animate-pulse" />
                              <div className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }} />
                              <div className="w-1 h-4 bg-green-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-medium">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Classroom Chat</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI students will ask questions here
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🎓</div>
                    <p className="text-sm text-muted-foreground">
                      Start teaching to see student questions and interactions here
                    </p>
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
              
              <div className="p-4 border-t border-border">
                <Button
                  onClick={clearConversation}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={isRecording || isProcessing}
                >
                  Clear Chat
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingSession;