import { create } from 'zustand';
import { produce } from 'immer';

type Resource = {
    id: string;
    type: 'document' | 'video' | 'image' | 'book';
    title: string;
    url: string[];
    description: string[];
};

type ResourceState = {
    resources: Resource[];
    addResource: (resource: Resource) => void;
    deleteResource: (id: string) => void;
    getResourceByid: (id: string) => Resource | undefined;
    loadMockData: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
    resources: [],
    addResource: (resource: Resource) => set(produce((state) => {
        state.resources.push(resource);
    })),
    deleteResource: (id: string) => set(produce((state) => {
        state.resources = state.resources.filter((resource: Resource) => resource.id !== id);
        console.log(state.resources);
    })),
    getResourceByid: (id: string): Resource | undefined => {
        return useResourceStore.getState().resources.find((resource: Resource) => resource.id === id);
    },
    loadMockData: async () => {
        try {
            const mockData = (await import('@/types/resources.mock.json')).default as Resource[];
            set(
               {resources: mockData} 
            )
        }
        catch (error) {
            console.error('Error loading mock data:', error);
        }

    }
}))

export type { Resource }
