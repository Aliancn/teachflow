import { create } from 'zustand';
import { produce } from 'immer';



type MarkdownContent = {
    type: 'text' | 'image';
    content: string;
}
type Plan = {
    id: string;
    title: {
        topic: string;
        subject: string;
        grade: string;
    };
    teachingObjective: MarkdownContent;
    description: MarkdownContent;
    syllabus: MarkdownContent;
    resource: MarkdownContent;
    exercise: MarkdownContent;
}

type PlanState = {
    currentPlan: Plan;
    plans: Plan[];
    setCurrentPlan: (plans: Plan) => void;
    addPlan: (plan: Plan) => void;
    updatePlan: (updatedPlan: Plan) => void;
    loadMockData: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
    plans: [],
    currentPlan: {
        id: '1',
        title: {
            topic: '暂无内容',
            subject: '暂无内容',
            grade: '暂无内容'
        },
        teachingObjective: {
            type: 'text',
            content: '暂无内容'
        },
        description: {
            type: 'text',
            content: '暂无内容'
        },
        syllabus: {
            type: 'text',
            content: '暂无内容'
        },
        resource: {
            type: 'text',
            content: '暂无内容'
        },
        exercise: {
            type: 'text',
            content: '暂无内容'
        }
    },
    setCurrentPlan: (plan: Plan) => set({ currentPlan: plan }),
    addPlan: (plan: Plan) => set((state: PlanState) => ({ plans: [...state.plans, plan] })),
    updatePlan: (updatedPlan: Plan) => set(produce((state) => {
        const index = state.plans.findIndex((p: Plan) => p.id === updatedPlan.id);
    })),
    loadMockData: async() => {
        const mockData =  (await import('@/types/content.mock.json'))
        set({
            currentPlan: {
                id: '1',
                title: {
                    topic: mockData.topic,
                    subject: mockData.subject,
                    grade: mockData.grade
                },
                teachingObjective: {
                    type: 'text',
                    content: mockData.goal
                },
                description: {
                    type: 'text',
                    content: mockData.text
                },
                syllabus: {
                    type: 'text',
                    content: mockData.text
                },
                resource: {
                    type: 'text',
                    content: mockData.text
                },
                exercise: {
                    type: 'text',
                    content: mockData.text
                }
            }
        })
    },
}))

