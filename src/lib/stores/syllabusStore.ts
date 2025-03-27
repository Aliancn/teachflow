import { create } from 'zustand';
import { produce } from 'immer';
export type CardData = {
    uuid: number;
    conversationId: string;
    id: string;
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
    updateCard: (updatedCard: CardData) => void;
    updateCardOrder: (newOrder: string[]) => void;
};

export const useSyllabusStore = create<SyllabusState>((set) => ({
    generatedCards: [],
    generating: false,
    setGeneratedCards: (cards) => set({ generatedCards: cards }),
    setGenerating: (generating:boolean) => set({ generating }),
    updateCard: (updatedCard) => set(produce((state) => {
      const index = state.generatedCards.findIndex((c : CardData)=> c.uuid === updatedCard.uuid);
      if (index !== -1) {
        state.generatedCards[index] = updatedCard;
      }
    })),
    updateCardOrder: (newOrder: string[]) => {
        set((state) => ({
            generatedCards: (() => {
                const cardMap = new Map(state.generatedCards.map(card => [card.id, card]));
                const reorderedCards = newOrder
                    .map(id => cardMap.get(id))
                    .filter((card): card is CardData => card !== undefined);
                if (reorderedCards.length !== state.generatedCards.length) {
                    console.warn('Some cards were not found in the new order');
                    const missingCards = state.generatedCards.filter(card => !newOrder.includes(card.id));
                    reorderedCards.push(...missingCards);
                }
                return reorderedCards;
            })()
        }));
    },
    loadMock: async () => {
        try {
            const mockData = await import('@/types/cards.mock.json');
            let _in =0 ;
            set(produce((state) => {
                state.generatedCards = mockData.default.cards.map((card: any, index: number) => ({
                    uuid: _in++,
                    conversationId: "",
                    id: index.toString(),
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