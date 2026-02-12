import React, { ChangeEvent, useState } from 'react';

interface ImageUploaderProps {
  onStart: (images: string[], title: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onStart }) => {
  const [hasFiles, setHasFiles] = useState(false);
  const [title, setTitle] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newImages = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file as File)
      );
      if (newImages.length > 0) {
        setHasFiles(true);
        // Automatically start when files are chosen, passing the title
        onStart(newImages, title);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-black/90 text-white">
      <div className="bg-gray-900/80 p-10 rounded-2xl shadow-2xl border border-gray-700 text-center max-w-lg w-full backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-6 text-[#e50914] drop-shadow-md">
          LG UT80 Slideshow
        </h1>
        
        <p className="mb-6 text-gray-300">
          Anti-Sleep Mode Enabled.<br/>
          Select photos to display in a grid.
        </p>

        <div className="mb-6 w-full text-left">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="title">
            Slideshow Title (Optional)
          </label>
          <input
            id="title"
            type="text"
            placeholder="សកម្មភាពចុះសិក្សា..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded text-black font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <label
          htmlFor="file-input"
          className="inline-block w-full px-8 py-4 bg-[#e50914] hover:bg-[#b80710] text-white text-xl font-bold rounded-lg cursor-pointer transition-all transform hover:scale-105 border-2 border-white/20 shadow-lg"
        >
          ជ្រើសរើសរូបភាព (Select Images)
        </label>
        
        <input
          type="file"
          id="file-input"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mt-8 text-sm text-gray-500">
          <p>Tip: Tap screen if fullscreen exits.</p>
        </div>
      </div>
    </div>
  );
};