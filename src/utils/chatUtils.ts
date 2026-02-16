import { nextTick, Ref } from "vue";
import { getLang } from "../services/language";
import { Contact } from "../types";

/**
 * Checks if the chat messages array is empty
 */
export const isTheChatEmpty = (messages: Ref<any[] | null>): boolean => {
    return !messages.value || messages.value.length === 0;
};

/**
 * Constructs the system prompt for the OpenAI API
 */
export const getSystemPrompt = (contactInfo: Contact, text: Record<string, string>): string => {
    let prompt = `You are ${contactInfo.name}. `;
    prompt += "Strictly adhere to this persona. Never break character or mention you are an AI. ";
    prompt += "Omit or refuse to answer any questions that are inconsistent with your defined personality, knowledge, or background. ";
    prompt += "Do not impersonate other people or provide information that your character wouldn't know. ";
    prompt += "Never use markdown styling (e.g., bold, italics, code blocks, bullet points). Use only plain text as in a conventional instant message. ";
    prompt += `The following is a casual private chat conversation entirely in ${getLang()}, with natural, very short, and realistic answers.\n`;
    prompt += `CONTEXT: ${contactInfo.context}\n`;

    if ('customAsk' in contactInfo && contactInfo.customAsk) {
        prompt += `${contactInfo.customAsk}\n`;
    } else {
        prompt += `${text.generalTalkAsk}\n`;
    }
    return prompt;
};

/**
 * Scrolls the chat box to the bottom
 */
export const scrollChatToBottom = async (chatBox: Ref<HTMLElement | null>) => {
    await nextTick();
    if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
};

