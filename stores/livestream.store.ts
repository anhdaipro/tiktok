
import { zustandStorage } from '@/lib/storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


// Types
export interface LiveStream {
    id: string;
    roomId: string;
    hostId: string;
    hostName: string;
    hostAvatar: string;
    title: string;
    thumbnail: string;
    viewerCount: number;
    status: 'live' | 'ended';
    startedAt: string;
}

export interface ChatMessage {
    id: string;
    userId: string;
    username: string;
    avatar: string;
    message: string;
    timestamp: number;
}

export interface Reaction {
    id: string;
    userId: string;
    type: 'like' | 'heart' | 'gift' | 'coin';
    value?: string; // For gifts
    timestamp: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    discount?: string;
}

interface LivestreamState {
    // Connection
    isConnected: boolean;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'failed';

    // Current stream
    currentStream: LiveStream | null;
    isStreamer: boolean;

    // Viewers
    viewerCount: number;
    viewerList: string[];

    // Chat
    messages: ChatMessage[];
    maxMessages: number;

    // Reactions
    reactions: Reaction[];

    // Products
    activeProduct: Product | null;
    productList: Product[];

    // Settings
    videoQuality: 'auto' | 'high' | 'medium' | 'low';
    isMuted: boolean;
    isCameraOff: boolean;

    // Recent streams (cached)
    recentStreams: LiveStream[];

    // Actions
    setConnected: (connected: boolean) => void;
    setConnectionStatus: (status: LivestreamState['connectionStatus']) => void;
    setCurrentStream: (stream: LiveStream | null) => void;
    setIsStreamer: (isStreamer: boolean) => void;
    setViewerCount: (count: number) => void;
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    addReaction: (reaction: Reaction) => void;
    clearReactions: () => void;
    setActiveProduct: (product: Product | null) => void;
    addProduct: (product: Product) => void;
    setVideoQuality: (quality: LivestreamState['videoQuality']) => void;
    toggleMute: () => void;
    toggleCamera: () => void;
    addRecentStream: (stream: LiveStream) => void;
    reset: () => void;
}

export const useLivestreamStore = create<LivestreamState>()(
    persist(
        (set) => ({
            // Initial state
            isConnected: false,
            connectionStatus: 'disconnected',
            currentStream: null,
            isStreamer: false,
            viewerCount: 0,
            viewerList: [],
            messages: [],
            maxMessages: 100,
            reactions: [],
            activeProduct: null,
            productList: [],
            videoQuality: 'auto',
            isMuted: false,
            isCameraOff: false,
            recentStreams: [],

            // Actions
            setConnected: (connected) => set({ isConnected: connected }),

            setConnectionStatus: (status) => set({ connectionStatus: status }),

            setCurrentStream: (stream) => set({ currentStream: stream }),

            setIsStreamer: (isStreamer) => set({ isStreamer }),

            setViewerCount: (count) => set({ viewerCount: count }),

            addMessage: (message) =>
                set((state) => ({
                    messages: [
                        ...state.messages.slice(-state.maxMessages + 1),
                        message,
                    ],
                })),

            clearMessages: () => set({ messages: [] }),

            addReaction: (reaction) =>
                set((state) => ({
                    reactions: [...state.reactions, reaction],
                })),

            clearReactions: () => set({ reactions: [] }),

            setActiveProduct: (product) => set({ activeProduct: product }),

            addProduct: (product) =>
                set((state) => ({
                    productList: [...state.productList, product],
                })),

            setVideoQuality: (quality) => set({ videoQuality: quality }),

            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

            toggleCamera: () =>
                set((state) => ({ isCameraOff: !state.isCameraOff })),

            addRecentStream: (stream) =>
                set((state) => ({
                    recentStreams: [
                        stream,
                        ...state.recentStreams.filter((s) => s.id !== stream.id),
                    ].slice(0, 10),
                })),

            reset: () =>
                set({
                    isConnected: false,
                    connectionStatus: 'disconnected',
                    currentStream: null,
                    viewerCount: 0,
                    viewerList: [],
                    messages: [],
                    reactions: [],
                    activeProduct: null,
                }),
        }),
        {
            name: 'livestream-storage',
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({
                // Only persist these fields
                recentStreams: state.recentStreams,
                videoQuality: state.videoQuality,
            }),
        }
    )
);
