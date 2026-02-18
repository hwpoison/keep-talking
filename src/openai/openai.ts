import { reactive } from "vue";
import OpenAI from "openai";
import * as model from "./models";
import { ChatMessage } from "../types";

const ENV_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const ENV_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || "";
const ENV_DEFAULT_MODEL = import.meta.env.VITE_OPENAI_DEFAULT_MODEL || model.allModels[model.defaultModel];

interface OpenAIConfiguration {
    temperature: number;
    model: string;
    showReasoning: boolean;
    apiKey: string;
    baseURL: string;
}

class OpenaiAPI {
    configuration: OpenAIConfiguration = {
        temperature: 0.7,
        model: ENV_DEFAULT_MODEL,
        showReasoning: false,
        apiKey: ENV_API_KEY,
        baseURL: ENV_BASE_URL
    };

    private openai: OpenAI | null = null;

    constructor() {
        this.initOpenAI();
    }

    private initOpenAI() {
        const hasValidKey = this.configuration.apiKey && !this.configuration.apiKey.includes("<YOUR");
        const hasBaseURL = !!this.configuration.baseURL;

        if (hasValidKey || hasBaseURL) {
            const config: any = {
                apiKey: hasValidKey ? this.configuration.apiKey : "dummy-key",
                dangerouslyAllowBrowser: true
            };
            if (this.configuration.baseURL) {
                config.baseURL = this.configuration.baseURL;
            }
            this.openai = new OpenAI(config);
        } else {
            this.openai = null;
        }
    }

    setApiKey(key: string) {
        this.configuration.apiKey = key;
        this.initOpenAI();
    }

    setBaseURL(url: string) {
        this.configuration.baseURL = url;
        this.initOpenAI();
    }

    setModel(modelName: string) {
        this.configuration.model = modelName;
    }

    setReasoning(show: boolean) {
        this.configuration.showReasoning = show;
    }

    setTemperature(temperature: number) {
        this.configuration.temperature = temperature;
    }

    async chatGen(messages: ChatMessage[], modelName: string | null = null, temperature: number | null = null) {
        if (!this.openai) {
            throw new Error("OpenAI API Key not set or invalid.");
        }

        const selectedModel = modelName || this.configuration.model;
        const selectedTemperature = temperature ?? this.configuration.temperature;

        console.info("Sent prompt:", messages,
            "\n\nModel:", selectedModel,
            "\n\nTemperature:", selectedTemperature);

        const requestPayload: any = {
            model: selectedModel,
            messages: messages.map(m => ({
                role: m.role,
                content: m.content || m.message
            })),
            max_tokens: 2048,
            temperature: selectedTemperature,
            top_p: 1,
            presence_penalty: 0.6,
            frequency_penalty: 0.0,
            n: 1,
        };

        if (this.configuration.showReasoning) {
            requestPayload.reasoning_format = "raw";
        }

        try {
            const response = await this.openai.chat.completions.create(requestPayload);
            console.info("API response:", response);
            return response;
        } catch (error: any) {
            const isReasoningError = error.status === 400 &&
                (error.message?.includes("reasoning_format") ||
                    JSON.stringify(error).includes("reasoning_format"));

            if (isReasoningError && requestPayload.reasoning_format) {
                console.warn("Reasoning format not supported, falling back.");
                delete requestPayload.reasoning_format;
                const retryResponse = await this.openai.chat.completions.create(requestPayload);
                console.info("=>Output (Fallback)", retryResponse);
                return retryResponse;
            }

            console.error("OpenAI API Error:", error);
            throw error;
        }
    }

    loadUserConfiguration() {
        const storedConfig = localStorage.getItem("openAIConfiguration");
        if (storedConfig) {
            try {
                const userConfig = JSON.parse(storedConfig);
                console.info("Loading custom AI configuration");
                this.configuration = { ...this.configuration, ...userConfig };
            } catch (e) {
                console.error("Failed to parse user configuration", e);
            }
        }
        this.initOpenAI();
    }

    saveConfiguration() {
        localStorage.setItem("openAIConfiguration", JSON.stringify(this.configuration));
    }
}

const openai = reactive(new OpenaiAPI());
openai.loadUserConfiguration();

export { openai };
