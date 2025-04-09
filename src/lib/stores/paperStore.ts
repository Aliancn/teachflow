import { create } from 'zustand';

interface PaperContent {
    content: string;
    answer: string;
}

interface PaperStore {
    generatedPaper: PaperContent;
    title: string;
    setGeneratedPaper: (content: PaperContent) => void;
    loadMockData: () => Promise<void>;
}

export const usePaperStore = create<PaperStore>((set) => ({
    generatedPaper: { content: '', answer: '' },
    title: '',
    setGeneratedPaper: (content) => set({ generatedPaper: content }),
    loadMockData: async () => {
        const mockData = (await import('@/types/paper.mock.json')).default;
        console.log(mockData);
        set({
            generatedPaper: {
                content: mockData.question,
                answer: mockData.answer,
            },
            title: mockData.title,
        });
    }
}));