import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
type Resource = {
    id: string;
    type: 'document' | 'video' | 'image' | 'audio';
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
                { resources: mockData }
            )
        }
        catch (error) {
            console.error('Error loading mock data:', error);
        }

    }
}))

export type { Resource }

type SearchVideo = {
    id: string,
    title: string,
    url: string,
    source: string,
    thumbnail: string,
    duration: number | null,
    views: number | null,
    upload_date: string,
    channel: string,
    description: string,
}
type SearchDocument = {
    id: string,
    title: string,
    url: string,
    source: string,
    description: string,
    type: string,
    type_name: string,
    size: string,
    date: Date|null,
    score: number,
}
type SearchImage = {
    id: string,
    title: string,
    url: string,
    thumbnail: string,
    source: string,
    width: number,
    height: number,
    format: string,
    size: string,
}
type SearchResource = {
    videos: SearchVideo[],
    documents: SearchDocument[],
    images: SearchImage[],
}

export type { SearchVideo, SearchDocument, SearchImage, SearchResource }

type SearchState = {
    searchResource: SearchResource ;
    setSearchResource: (resource: SearchResource) => void;
    getSearchResource: () => SearchResource | null;
    loadMockData: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    searchResource: {
        videos: [],
        documents: [],
        images: [],
    },
    setSearchResource: (resource: SearchResource) => set({ searchResource: resource }),
    getSearchResource: (): SearchResource | null => useSearchStore.getState().searchResource,
    loadMockData: async () => {
        try {
            const mockData = (await import('@/types/search_result.mock.json')).default;
            set(
                {   
                    searchResource: {
                        documents  : mockData.data.documents.map((document) => ({
                            ...document,
                            id: uuidv4(),
                        })),
                        images: mockData.data.images.map((image) => ({
                           ...image,
                            id: uuidv4(),
                        })),
                        videos: mockData.data.videos.map((video) => ({
                            ...video,
                            duration: video.duration ? parseInt(video.duration) : null,
                            views: video.views ? parseInt(video.views) : null,
                            id: uuidv4(),
                        }))
                    }
                }
            )
        }
        catch (error) {
            console.error('Error loading mock data:', error);
        }
    }
}))