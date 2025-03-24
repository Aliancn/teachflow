"use client";
import { useState, useEffect } from 'react';

interface MediaPreviewProps {
  src: string;
  type: 'image' | 'video';
  className?: string;
}

export default function MediaPreview({ src, type, className }: MediaPreviewProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const media = new Image();
    media.src = src;
    media.onload = () => setLoading(false);
  }, [src]);

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 4V2A10 10 0 00 2 12h2a8 8 0 018-8z"/>
          </svg>
        </div>
      )}

      {type === 'image' ? (
        <img 
          src={src} 
          alt="AI生成内容"
          className={`w-full h-auto transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setLoading(false)}
        />
      ) : (
        <video
          src={src}
          controls
          className={`w-full rounded-lg ${loading ? 'hidden' : 'block'}`}
          onLoadedData={() => setLoading(false)}
        />
      )}
    </div>
  );
}