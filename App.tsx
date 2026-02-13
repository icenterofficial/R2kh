import React from 'react';
import { SlideShow } from './components/SlideShow';
import { WakeLockVideo } from './components/WakeLockVideo';

// Updated content with static images
const STATIC_CONTENT = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0YWD5KoblgX5E2nv4tfbDscBsxtb8Vrj4Zp7U7N1X4zLhii4jvy3NtDS5M-98-Bc1jxWW4voqza7-v06ShNPbg0ojGpTAmvGOWog_5nKImGmm18_-UirYcDVEmwFG2sE0dW8e3IURQcY7mg9i1kglig3_HfpRv7nLX3JDHJHh2H0SWZ-jgSxYDY8utuc/s1600/%E1%9E%98%E1%9E%BE%E1%9E%9B%E1%9E%81%E1%9F%92%E1%9E%93%E1%9E%BE%E1%9E%8F%E1%9E%81%E1%9F%82%20%284%29.jpg",
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
