import { reactive } from "vue";
import OpenAI from "openai";
import * as engines from "./engines";
import { ChatMessage } from "../types";

// Accessing VITE_ environment variables
const ENV_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";
const ENV_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || "";
const ENV_DEFAULT_MODEL = import.meta.env.VITE_OPENAI_DEFAULT_MODEL || engines.allEngines[engines.defaultEngine];

interface OpenAIConfiguration {
    temperature: number;
    engine: string;
    showReasoning: boolean;
}

class OpenaiAPI {
    apiKey: string;
    baseURL: string | undefined;
    configuration: OpenAIConfiguration;
    private openai: OpenAI | null = null;

    constructor() {
        this.apiKey = ENV_API_KEY;
        this.baseURL = ENV_BASE_URL || undefined;
        this.configuration = {
            temperature: 0.7,
            engine: ENV_DEFAULT_MODEL,
            showReasoning: false
        };
        this.initOpenAI();
    }

    private initOpenAI() {
        const hasValidKey = this.apiKey && !this.apiKey.includes("<YOUR");
        const hasBaseURL = !!this.baseURL;

        if (hasValidKey || hasBaseURL) {
            const config: any = {
                apiKey: hasValidKey ? this.apiKey : "dummy-key",
                dangerouslyAllowBrowser: true
            };
            if (this.baseURL) {
                config.baseURL = this.baseURL;
            }
            this.openai = new OpenAI(config);
        } else {
            this.openai = null;
        }
    }

    setApiKey(key: string) {
        this.apiKey = key;
        this.initOpenAI();
    }

    setBaseURL(url: string) {
        this.baseURL = url || undefined;
        this.initOpenAI();
    }

    setEngine(engine: string) {
        this.configuration.engine = engine;
    }

    setReasoning(show: boolean) {
        this.configuration.showReasoning = show;
    }

    async chatGen(messages: ChatMessage[], engine: string | null = null, temperature: number | null = null) {
        if (!this.openai) {
            throw new Error("OpenAI API Key not set or invalid.");
        }

        const selectedEngine = engine || this.configuration.engine;
        const selectedTemperature = temperature ?? this.configuration.temperature;

        console.log("=>Input Prompt:", messages,
            "\n\n=>Model:", selectedEngine,
            "\n\n=>Temperature:", selectedTemperature);

        const requestPayload: any = {
            model: selectedEngine,
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
            console.log("=>Output", response);
            return response;
        } catch (error: any) {
            // Check if error is 400 and mentions reasoning_format
            const isReasoningError = error.status === 400 &&
                (error.message?.includes("reasoning_format") ||
                    JSON.stringify(error).includes("reasoning_format"));

            if (isReasoningError && requestPayload.reasoning_format) {
                console.warn("Reasoning format not supported by model, falling back to standard completion.");
                delete requestPayload.reasoning_format;
                const retryResponse = await this.openai.chat.completions.create(requestPayload);
                console.log("=>Output (Fallback)", retryResponse);
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
                if (userConfig.temperature) this.configuration.temperature = userConfig.temperature;
                if (userConfig.engine) this.configuration.engine = userConfig.engine;
                if (userConfig.baseURL) this.baseURL = userConfig.baseURL;
                if (userConfig.apiKey) this.apiKey = userConfig.apiKey;
                if (userConfig.showReasoning !== undefined) this.configuration.showReasoning = userConfig.showReasoning;
            } catch (e) {
                console.error("Failed to parse user configuration", e);
            }
        }
        this.initOpenAI();
    }

    saveConfiguration() {
        localStorage.setItem(
            "openAIConfiguration",
            JSON.stringify({
                ...this.configuration,
                baseURL: this.baseURL,
                apiKey: this.apiKey
            })
        );
    }
}

const openai = reactive(new OpenaiAPI());
openai.loadUserConfiguration();

export { openai };


