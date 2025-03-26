import { Card as UICard } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type CardType = {
  title: string;
  description: string;
  type: '知识节点' | '互动节点';
  data: {
    content: string[];
    duration: string;
  };
};

const TypeBadge = ({ type }: { type: CardType['type'] }) => (
  <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-sm
    ${type === '知识节点' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
    {type}
  </div>
);

export const Card = ({ card }: { card: CardType }) => (
    <UICard className="relative p-4 mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
    <TypeBadge type={card.type} />
    <h3 className="text-xl font-bold mb-2 text-gray-900">{card.title}</h3>
    <p className="text-sm text-gray-500 mb-6">{card.description}</p>
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
      {card.data.content.map((text, index) => (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
        >
          {text}
        </ReactMarkdown>
      ))}
    </div>
    <div className="mt-4 pt-3 text-sm text-gray-600 border-t border-gray-100 text-right">
      预计时长：{card.data.duration}
    </div>
  </UICard>
);