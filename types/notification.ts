export interface Notification {
    id: string;
    type: string;
    name: string;
    content: string;
    avatar: string;
    time: string;
    isRead: boolean;
    badge: number
}