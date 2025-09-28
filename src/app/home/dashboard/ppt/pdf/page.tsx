"use client";
import { PDFViewer } from '@/components/PDFViewer';

export default function PDFResult() {

  return (
    <div className="p-8 bg-white h-full">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">PDF预览</h2>
        <PDFViewer
            pdfUrl='/test.pdf'
          className="h-[700px] shadow-lg rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
}