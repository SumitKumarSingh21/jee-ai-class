import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isProcessing: boolean;
}

export const VideoControls: React.FC<VideoControlsProps> = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording, 
  isProcessing 
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isVideoEnabled) {
      startVideo();
    } else {
      stopVideo();
    }

    return () => {
      stopVideo();
    };
  }, [isVideoEnabled]);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast({
        title: "Camera Started",
        description: "Your video is now live!",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
      setIsVideoEnabled(false);
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

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  return (
    <Card className="p-4 shadow-teaching">
      <div className="space-y-4">
        {/* Teacher Video */}
        <div className="relative">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            {isVideoEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera Off</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Teacher Label */}
          <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
            Teacher
            {isRecording && <div className="inline-block w-2 h-2 bg-destructive rounded-full ml-2 animate-pulse"></div>}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            {isVideoEnabled ? (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Camera On
              </>
            ) : (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Turn On Camera
              </>
            )}
          </Button>
          
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={isProcessing}
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            className="flex-1"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Teaching
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Teaching
              </>
            )}
          </Button>
        </div>

        {isProcessing && (
          <div className="text-center text-sm text-muted-foreground">
            <div className="animate-pulse">Processing your lesson...</div>
          </div>
        )}
      </div>
    </Card>
  );
};