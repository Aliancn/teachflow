import { create } from 'zustand';

interface PaperContent {
    content: string;
    answer: string;
}

interface PaperStore {
    generatedPaper: PaperContent;
    title: string;
    setGeneratedPaper: (content: PaperContent) => void;
    setPaper: (question: string, answer: string, title: string) => void; // 新增：设置试卷数据
    loadMockData: () => Promise<void>;
}

export const usePaperStore = create<PaperStore>((set) => ({
    generatedPaper: { content: '', answer: '' },
    title: '',
    setGeneratedPaper: (content) => set({ generatedPaper: content }),
    setPaper: (question: string, answer: string, title: string) => set({
        generatedPaper: {
            content: question,
            answer: answer,
        },
        title: title,
    }),
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