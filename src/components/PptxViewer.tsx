'use client';
import {  useState } from 'react';

import MediaPreview from '@/components/AI/MediaPreview';

interface PptxViewerProps {
  data: any;
  className?: string;
  showThumbnails?: boolean;
  enableEdit?: boolean;
  showNotes?: boolean;
}

interface sildeElement {
  type: string;
  content: string;
  position: { x: number; y: number };
  style: { [key: string]: string | number };
}

interface Slide {
  elements: sildeElement[];
  thumbnail: string;
  notes?: string;
}

export function PptxViewer({
  data,
  className,
  showThumbnails = true,
  enableEdit = false,
  showNotes = false
}: PptxViewerProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // 解析PPT数据结构
  const slides: Slide[] = data?.slides || [];

  return (
    <div className={`flex gap-6 ${className}`}>
      {/* 缩略图侧边栏 */}
      {showThumbnails && (
        <div className="w-48 space-y-4 overflow-y-auto">
          {slides.map((slide: any, index: number) => (
            <div
              key={index}
              className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${index === activeSlide
                  ? 'border-blue-500 scale-105'
                  : 'border-transparent hover:border-gray-200'
                }`}
              onClick={() => setActiveSlide(index)}
            >
              <MediaPreview
                src={slide.thumbnail}
                type="image"
                className="h-32 w-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* 主幻灯片视图 */}
      <div className="flex-1 relative bg-gray-50 rounded-xl p-4">
        {slides.map((slide: any, index: number) => (
          <div
            key={index}
            className={`transition-opacity duration-300 ${index === activeSlide ? 'opacity-100' : 'hidden'
              }`}
          >
            <div className="aspect-video bg-white rounded-lg shadow-xl p-8 relative" style={{ position: 'relative' }}>
              {slide.elements.map((element: any, elIndex: number) => (
                <EditableElement
                  key={elIndex}
                  element={element}
                  enabled={enableEdit}
                />
              ))}
            </div>

            {/* 演讲者备注 */}
            {showNotes && slide.notes && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
                {slide.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 可编辑元素组件
const EditableElement = ({ element, enabled, onUpdate }: any) => {
  const [content, setContent] = useState(element.content);

  const handleBlur = () => {
    onUpdate(content);
  };

  switch (element.type) {
    case 'text':
      return enabled ? (
        <textarea
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          style={{
            ...element.style,
            position: 'absolute',
            left: `${element.position.x}px`,
            top: `${element.position.y}px`,
            transform: `translate(${element.position.x}px, ${element.position.y}px)`
          }}
        />
      ) : (
        <div style={{
          ...element.style,
          position: 'absolute',
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          transform: `translate(${element.position.x}px, ${element.position.y}px)`
        }}>{content}</div>
      );
    case 'image':
      return (
        <div
          style={{
            position: 'absolute',
            left: `${element.position.x}px`,
            top: `${element.position.y}px`,
            transform: `translate(${element.position.x}px, ${element.position.y}px)`,
            width: `${element.style.width}px`,
            height: `${element.style.height}px`
          }}
        >
          <MediaPreview src={element.src} type="image"/>
        </div>
      );
    default:
      return null;
  }
};