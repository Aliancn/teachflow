import { Card as UICard } from '@/components/ui/Card';
import { useSyllabusStore, CardData } from '@/lib/stores/syllabusStore';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MathMarkdown from './MathMarkdown';

const TypeBadge = ({ type }: { type: CardData['type'] }) => (
    <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-sm
    ${type === '知识节点' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
        {type}
    </div>
);

export const Card = ({ card }: { card: CardData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(card.data.content);
    const [editedTitle, setEditedTitle] = useState(card.title);
    const [editedDesc, setEditedDesc] = useState(card.description);
    const [editedDuration, setEditedDuration] = useState(card.data.duration);
    const { updateCard } = useSyllabusStore();

    const handleSave = () => {
        updateCard({
            ...card,
            title: editedTitle,
            description: editedDesc,
            data: {
                ...card.data,
                content: editedContent,
                duration: editedDuration
            }
        });
        setIsEditing(false);
    };

    return (
        <UICard
            className="relative p-4 mb-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        >
            <TypeBadge type={card.type} />
            {isEditing ? (
                <div className="space-y-4">
                    <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        value={editedDesc}
                        onChange={(e) => setEditedDesc(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <div className="space-y-2">
                        {editedContent.map((text, index) => (
                            <input
                                key={index}
                                value={text}
                                onChange={(e) => {
                                    const newContent = [...editedContent];
                                    newContent[index] = e.target.value;
                                    setEditedContent(newContent);
                                }}
                                className="w-full p-2 border rounded"
                            />
                        ))}
                    </div>
                    <input
                        value={editedDuration}
                        onChange={(e) => setEditedDuration(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleSave}
                        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        保存
                    </button>
                </div>
            ) : (
                <>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{editedTitle}</h3>
                    <p className="text-sm text-gray-500 mb-6">{editedDesc}</p>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        {editedContent.map((text, index) => (
                            <MathMarkdown key={index} content={text}>
                            </MathMarkdown>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 text-sm text-gray-600 border-t border-gray-100 text-right">
                        预计时长：{editedDuration}
                    </div>
                </>
            )}
        </UICard>
    );
};