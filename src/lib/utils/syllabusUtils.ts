import { CardData } from '@/lib/stores/syllabusStore';
import { SyllabusCardItem } from '@/lib/agents/card_build';

// 将API返回的卡片转换为Store使用的CardData格式
export function convertToCardData(cards: SyllabusCardItem[], conversationId: string): CardData[] {
  return cards.map((card, index) => ({
    uuid: index,
    conversationId: conversationId,
    id: index.toString(),
    title: card.title,
    description: card.description,
    type: card.type,
    data: {
      content: card.data.content,
      duration: card.data.duration
    }
  }));
}
