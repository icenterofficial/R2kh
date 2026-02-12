import React from 'react';
import { SlideShow } from './components/SlideShow';
import { WakeLockVideo } from './components/WakeLockVideo';

// Updated content with static images
const STATIC_CONTENT = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcKgLDhK0Sdm-q7MxZSTzisBxP9fp61fzpGABZm94ilVYIfVv9Qs6Dynem2b3us6VKOZY3q3Qlf9QkVMYt-K60mtmcmEGVTCBsakksNJb5O6d2HScBXHOs0LrfTmVmUuhpAcOJwqbfcmJB_HzbaqnIEbffeVNUcJzErSZIMyBFM0seRSsb_ayAewmoUF0/s1600/man.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLXakOnv_Sj0fsN7fFHwdLgEiEsWSlIX2RBwmEfD7AES954UqbYX0hr10mgdfiiYP12CMsPa5rtbLGwyp0Xb7N8yYTQilWMmhhmb_hkIaS7N7JL1VwrCQ4SHnx1zh3ouCs-628xYPoiaeTgS76cv-Ixsp7trfaNbjQCpdmnyr2Tck6__e9SQA8XyTTIvU/s1600/women.jpg"
];

export default function App() {
  return (
    <div className="w-full h-full bg-black text-white relative overflow-hidden">
      {/* 
        WakeLockVideo: z-index -1 to stay behind
      */}
      <div style={{ position: 'absolute', zIndex: -1, top: 0, left: 0 }}>
        <WakeLockVideo active={true} />
      </div>

      {/* 
        SlideShow: z-index 10 to stay on top 
      */}
      <div style={{ position: 'absolute', zIndex: 10, top: 0, left: 0, width: '100%', height: '100%' }}>
        <SlideShow 
          content={STATIC_CONTENT} 
        />
      </div>
    </div>
  );
}