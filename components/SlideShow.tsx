import React, { useState, useEffect } from 'react';

interface SlideShowProps {
  content: string[];
  title?: string;
}

const getMediaType = (url: string): 'video' | 'image' => {
  if (!url) return 'image';
  if (url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('video')) {
    return 'video';
  }
  return 'image';
};

export const SlideShow: React.FC<SlideShowProps> = ({ content, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!content || content.length === 0) return;
    if (content.length === 1) return;

    // Determine duration based on current slide index
    // Index 0 (First Slide): 10 seconds (10000ms)
    // Others: 8 seconds (8000ms)
    const duration = currentIndex === 0 ? 10000 : 8000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % content.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, content]);

  const handleInteraction = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  if (!content || content.length === 0) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', color: 'white' }}>
            <h1>No Images Loaded</h1>
        </div>
      );
  }

  return (
    <div 
      onClick={handleInteraction}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000', // Deep black base
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {content.map((src, index) => {
        const isActive = index === currentIndex;
        const type = getMediaType(src);

        return (
          <div 
            key={index} 
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: isActive ? 1 : 0, // Simple fade
                transition: 'opacity 1s ease-in-out',
                zIndex: isActive ? 2 : 1,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
          >
            {type === 'image' ? (
                <>
                    {/* 
                        LAYER 1: Background Fill 
                        Using 'opacity' is much lighter on the GPU than blur.
                    */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3, // Darkened background
                        transform: isActive ? 'scale(1.1)' : 'scale(1.0)',
                        transition: 'transform 10s linear',
                        zIndex: 1
                    }} />

                    {/* LAYER 2: Main Image */}
                    <img 
                        src={src}
                        alt={`Slide ${index}`}
                        onError={(e) => {
                            // Fallback if image fails
                            e.currentTarget.style.display = 'none';
                            console.error("Image failed to load:", src);
                        }}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain', // Ensure full image is seen
                            position: 'relative',
                            zIndex: 2,
                            boxShadow: '0 0 40px rgba(0,0,0,0.8)',
                            transform: isActive ? 'scale(1.02)' : 'scale(1.0)',
                            transition: 'transform 10s linear',
                        }}
                    />
                </>
            ) : (
                <video 
                    src={src} 
                    autoPlay={isActive} 
                    muted 
                    loop 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} 
                />
            )}
            
            {/* Title Overlay */}
            {title && isActive && (
                <div style={{
                    position: 'absolute',
                    bottom: '5%',
                    left: 0,
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 10,
                }}>
                    <span style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                        color: 'white',
                        padding: '15px 30px', 
                        borderRadius: '50px',
                        fontSize: '2vw',
                        fontFamily: 'sans-serif',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                    }}>
                        {title}
                    </span>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
