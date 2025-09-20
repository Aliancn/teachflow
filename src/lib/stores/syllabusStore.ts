import { create } from 'zustand';
import { produce } from 'immer';
type CardData = {
    id: number;
    conversationId: string;
    index: number;
    title: string;
    description: string;
    type: '知识节点' | '互动节点';
    data: {
        content: string[];
        duration: string;
    };
};

type SyllabusState = {
    generatedCards: CardData[];
    generating: boolean;
    setGeneratedCards: (cards: CardData[]) => void;
    loadMock: () => Promise<void>;
    setGenerating: (generating: boolean) => void;
};

export const useSyllabusStore = create<SyllabusState>((set) => ({
    generatedCards: [],
    generating: false,
    setGeneratedCards: (cards) => set({ generatedCards: cards }),
    setGenerating: (generating:boolean) => set({ generating }),
    loadMock: async () => {
        try {
            const mockData = await import('@/types/cards.mock.json');
            set(produce((state) => {
                state.generatedCards = mockData.default.cards.map((card: any, index: number) => ({
                    id: 0,
                    conversationId: "",
                    index: index,
                    title: card.title,
                    description: card.description,
                    type: card.type,
                    data: {
                        content: card.data.content,
                        duration: card.data.duration
                    }
                }));
            }));
        } catch (err) {
            console.error('加载mock数据失败', err);
        }
    },
}));