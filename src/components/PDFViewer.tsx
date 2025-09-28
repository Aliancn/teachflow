"use client";
import { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { AutoScrollActivator } from '@dnd-kit/core';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};
const maxWidth = 800;
const resizeObserverOptions = {};

export function PDFViewer({ pdfUrl, className }: { pdfUrl: string; className?: string }) {
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [containerWidth, setContainerWidth] = useState<number>();
    const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
    const onResize = useCallback<ResizeObserverCallback>((entries) => {
        const [entry] = entries;
        if (entry) {
            setContainerWidth(entry.contentRect.width);
        }
    }, []);
    useEffect(() => {
        setError('');
        setLoading(true);

        if (!pdfUrl) {
            setError('PDF链接无效');
            setLoading(false);
        }
    }, [pdfUrl]);
    function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const { files } = event.target;

        const nextFile = files?.[0];

        if (nextFile) {
            pdfUrl = URL.createObjectURL(nextFile);
        }
    }
    useResizeObserver(containerRef, resizeObserverOptions, onResize);

    function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
        setNumPages(nextNumPages);
        setLoading(false);
    }

    return (
        <div className={`${className} bg-gray-50 rounded-xl p-4`}>
            {loading && !error && (
                <div className="h-full flex items-center justify-center text-gray-500">
                    加载中...
                </div>
            )}

            {error ? (
                <div className="h-full flex items-center justify-center text-red-500">
                    {error}
                </div>
            ) : (
                <div className="overflow-auto h-full w-full">
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={options}
                        className={'flex flex-col items-center justify-center'}
                    >
                        <Page pageNumber={pageNumber} width={containerWidth || maxWidth} className="mx-auto flex"/>
                    </Document>
                    <p className='flex justify-center mt-4'>
                        第 {pageNumber} 页 (共 {numPages} 页)
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(pageNumber - 1)}
                        >
                            上一页
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(pageNumber + 1)}
                        >
                            下一页
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}