export interface ChatMessage {
    id?: number;
    role?: 'system' | 'user' | 'assistant';
    message: string,
    content?: string;
    from?: string;
    type?: 'normal' | 'action';
}

export interface Contact {
    name: string;
    img: string;
    context: string;
    preferedEngine?: string;
    preferedTemperature?: number;
    customAsk?: string;
}

export interface UserProfile {
    userName: string;
}

export interface Settings {
    userProfile: UserProfile;
    maxMessages: number;
    lang: string;
}
