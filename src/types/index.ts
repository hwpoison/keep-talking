export interface ChatMessage {
    id?: number;
    role?: 'system' | 'user' | 'assistant';
    content?: string; // used for OpenAI API
    message?: string; // used internally in messages array
    from?: string;    // used internally in messages array
    type?: 'normal' | 'action';
}

export interface Contact {
    id: number;
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
