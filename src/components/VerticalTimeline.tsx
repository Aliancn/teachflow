import { Card } from '@/components/Card';
interface TimelineCard {
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
    timestamp: string; 
    buttonLink?: string;
    buttonText?: string;
}

interface VerticalTimelineProps {
    cards: TimelineCard[];
}

export function VerticalTimeline({ cards }: VerticalTimelineProps) {
    return (
        <ol className="relative border-s border-gray-200">
            {cards.map((card) => (
                <li key={card.id} className="mb-10 ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
                        <svg
                            className="w-2.5 h-2.5 text-blue-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </span>


                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                        {card.timestamp}
                    </time>

                    {card.description && (
                        <Card card={card}></Card>
                    )}
                </li>
            ))}
        </ol>
    );
}