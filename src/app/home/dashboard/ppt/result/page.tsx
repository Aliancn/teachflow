"use client";
import { PptxViewer } from '@/components/PptxViewer';

export default function PPTResult() {
  const pptData = {
    slides: [
      {
        thumbnail: '/images/image1.png',
        elements: [
          {
            type: 'text',
            content: '这是一张幻灯片的文本内容',
            position: { x: 0, y: 0 },
            style: { fontSize: 24, color: '#333' }
          },
          {
            type: 'image',
            src: '/images/image1.png',
            position: { x: 0, y: 60 },
            style: { width: 400, height: 200 }
          }
        ],
        note : "这是这张幻灯片的笔记内容",
      },
      {
        thumbnail: '/images/image2.png',
        elements: [
          {
            type: 'text',
            content: '这是另一张幻灯片的文本内容',
            position: { x: 0, y: 0 },
            style: { fontSize: 28, color: '#555' }
          },
          {
            type: 'image',
            src: '/images/image2.png',
            position: { x: 0, y: 60 },
            style: { width: 400, height: 400 }
          }
        ],
        note : "这是这张幻灯片的笔记内容",
      }
    ]
  }
  
  return (
    <div className="p-8 bg-white h-full">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">PPT预览</h2>
        <PptxViewer 
          data={pptData}
          className="h-[700px] shadow-lg rounded-lg overflow-hidden"
          showThumbnails
          enableEdit
          showNotes
        />
      </div>
    </div>
  );
}