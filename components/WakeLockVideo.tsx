import React, { useEffect, useRef } from 'react';

interface WakeLockVideoProps {
  active: boolean;
}

export const WakeLockVideo: React.FC<WakeLockVideoProps> = ({ active }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  
  useEffect(() => {
    if (!active) return;

    let intervalId: ReturnType<typeof setInterval>;

    // FUNCTION 1: Native Wake Lock (Standard API)
    const requestNativeLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('✅ Native Wake Lock Active');
          
          wakeLockRef.current.addEventListener('release', () => {
            console.log('⚠️ Native Wake Lock Released - Re-acquiring...');
            wakeLockRef.current = null;
            requestNativeLock(); // Immediately try to get it back
          });
        }
      } catch (err) {
        // Some older TVs don't support this, just ignore.
        console.warn('Native Wake Lock warning (Non-fatal):', err);
      }
    };

    // FUNCTION 2: Video Hack (The "Movie Mode" trick)
    const playVideoHack = async () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
            try {
                await videoRef.current.play();
                console.log('✅ Video Hack Playing');
            } catch (err) {
                console.warn('Video Hack Autoplay prevented:', err);
            }
        }
      }
    };

    // FUNCTION 3: The Watchdog (Runs every 10 seconds)
    // Ensures everything is still running.
    const startWatchdog = () => {
      requestNativeLock();
      playVideoHack();

      intervalId = setInterval(() => {
        // 1. Re-trigger native lock if lost
        if (!wakeLockRef.current) {
            requestNativeLock();
        }

        // 2. Ensure video is playing
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
        }
      }, 10000); // Check every 10 seconds
    };

    // Initialize
    startWatchdog();

    // Re-trigger on visibility change (e.g. user switches tabs and comes back)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        startWatchdog();
        playVideoHack();
      }
    };
    
    // User interaction listeners to kickstart everything if browser blocked autoplay initially
    const handleUserInteraction = () => {
        playVideoHack();
        requestNativeLock();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* 
        This video acts as a background process. 
        It is "visible" to the DOM (opacity > 0) so browser doesn't optimize it away,
        but invisible to the human eye.
      */}
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        autoPlay
        width="10"
        height="10"
        style={{ 
            opacity: 0.01, 
            pointerEvents: 'none', 
            position: 'absolute', 
            bottom: 0, 
            right: 0,
            zIndex: -1 
        }}
      >
        {/* Tiny WebM loop */}
        <source
          src="data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmRBfW74xwwqxkpnmwerCo+SKPmA9DTN82AQV4CUMgBAChOIDlAA=="
          type="video/webm"
        />
        {/* Fallback MP4 */}
        <source 
          src="data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAQBAAAABAAAABgdtb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAhkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAAZnYXJ1AAAAAAR0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABAAAAAAIAAAACAAAAA2VkdHMAAAAQM3N0dAAAAAAAAAAQAAAAAAAACG1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAABxoZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAAhzdGJsAAAAcnN0ZHNkAAAAAAAAAAEAAABiamF2YwE3AAAAAgAAAAIIAAAAAgAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABhdmNjAAAAHAAAAAAAEAAEAAr/4AALCwAAAAEBAAAAAAAhY2xhcAAAAAEAAABfc3R0cwAAAAAAAAABAAAAAQAAAAwAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAwc3RzegAAAAAAAAAAAAAAAQAAABRzdGNvAAAAAAAAAAEAAAAbAAAAYXVkdGEAAAAQbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAA=" 
          type="video/mp4" 
        />
      </video>
    </>
  );
};