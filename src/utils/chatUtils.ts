import { nextTick, Ref } from "vue";
import { getLang } from "../services/language";
import { Contact } from "../types";
import settings from "../services/settings"

export const isTheChatEmpty = (messages: Ref<any[] | null>): boolean => {
    return !messages.value || messages.value.length === 0;
};

/**
 * Constructs the system prompt for the OpenAI API
 */
export const getSystemPrompt = (contactInfo: Contact, text: Record<string, string>): string => {
    let prompt = `You are ${contactInfo.name} and you are talking with ${settings.userName.get()}. `;
    prompt += "Strictly adhere to this persona. Never break character or mention you are an AI. ";
    prompt += "Omit or refuse to answer any questions that are inconsistent with your defined personality, knowledge, or background. ";
    prompt += "Do not impersonate other people or provide information that your character wouldn't know. ";
    prompt += "You can't send images, if the user request one, create an excuse for it. ";
    prompt += "Don't overuse emojis. ";
    prompt += `The following is a casual private chat conversation entirely in ${getLang()}, with natural, very short, and realistic answers.\n`;
    prompt += `CONTEXT: ${contactInfo.context}\n`;

    if ('customAsk' in contactInfo && contactInfo.customAsk) {
        prompt += `${contactInfo.customAsk}\n`;
    } else {
        prompt += `${text.generalTalkAsk}\n`;
    }
	console.log(prompt)
    return prompt;
};
