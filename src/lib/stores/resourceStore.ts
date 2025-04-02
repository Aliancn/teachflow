import { create } from 'zustand';
import { produce } from 'immer';

type Resource = {
    id: string;
    type: 'document' | 'video' | 'image' | 'book';
    title: string;
};

type ResourceState = {
    resources: Resource[];
    addResource: (resource: Resource) => void;
    deleteResource: (id: string) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
    resources: [],
    addResource: (resource: Resource) => set(produce((state) => {
        state.resources.push(resource);
    })),
    deleteResource: (id: string) => set(produce((state) => {
        state.resources = state.resources.filter((resource : Resource)=> resource.id !== id);
    }))
}))

export type {Resource }
