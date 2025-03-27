import { Card } from '@/components/Card';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { useSyllabusStore, CardData } from '@/lib/stores/syllabusStore';
import { CSS } from '@dnd-kit/utilities';
import { useState  , useEffect} from 'react';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface VerticalTimelineProps {
    cards: CardData[];
}

function SortableItem({ id, children }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export function VerticalTimeline({ cards }: VerticalTimelineProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const { updateCardOrder } = useSyllabusStore();
    const [totalTime, setTotalTime] = useState<number[]>([]);
    useEffect(() => {
        // 计算时长累计数列
        let prevTime = 0;
        const newTotalTime = cards.map(card => {
            const duration = parseInt(card.data.duration);
            return prevTime += duration;
        })
        console.log("totalTime ", newTotalTime);
        setTotalTime(newTotalTime);
    }, [cards]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            delay: 250,
            tolerance: 5
          }
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        console.log("drag end ", active.id, over.id);
        if (active.id !== over.id) {
            const oldIndex = cards.findIndex(card => card.id === active.id);
            const newIndex = cards.findIndex(card => card.id === over.id);
            const newCards = arrayMove(cards, oldIndex, newIndex);
            updateCardOrder(newCards.map(card => card.id));
        }
        setActiveId(null);
        // 计算时长累计数列
        let prevTime = 0;
        const newTotalTime = cards.map(card => {
            const duration = parseInt(card.data.duration);
            return prevTime += duration;
        })
        setTotalTime(newTotalTime);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToVerticalAxis]}
        >
            <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
                <ol className="relative border-s border-gray-200">
                    {cards.map((card) => (
                        <SortableItem key={card.id} id={card.id}>
                            <li className="mb-10 ms-6" onDoubleClick={(e) => e.stopPropagation()}>
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
                                    {totalTime[parseInt(card.id)]} 分钟
                                </time>

                                {card.description && (
                                    <Card card={card}></Card>
                                )}
                            </li>
                        </SortableItem>
                    ))}
                </ol>
            </SortableContext>

            <DragOverlay>
                {activeId ? (
                    <div className="opacity-50">
                        <li className="mb-10 ms-6" onDoubleClick={(e) => e.stopPropagation()}>
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
                                {cards.find(card => card.id === activeId)?.data.duration} 分钟
                            </time>
                            <Card card={cards.find(card => card.id === activeId)!} />
                        </li>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}