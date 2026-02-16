import { reactive } from 'vue';
import * as store from "../utils/localStorage";
import defaultSettings from "../utils/defaultSettings";
import { Settings } from "../types";

class SettingsManager {
    values: Settings = reactive({
        userProfile: { userName: "User" },
        maxMessages: 50,
        lang: "english"
    });

    loadSettings() {
        const storedSettings = store.read("settings");
        if (storedSettings == null) {
            Object.assign(this.values, defaultSettings);
            return true;
        }
        console.info("[+] Loading stored settings");
        Object.assign(this.values, storedSettings);
    }

    saveSettings() {
        console.log("Saving:", this.values);
        store.write("settings", this.values);
    }

    userName = {
        get: () => {
            return this.values.userProfile.userName;
        },
        set: (newUserName: string) => {
            this.values.userProfile.userName = newUserName;
        }
    };

    maxMessages = {
        get: () => {
            return this.values.maxMessages;
        },
        set: (max: number) => {
            this.values.maxMessages = max;
        }
    };

    language = {
        get: () => {
            return this.values.lang;
        },
        set: (lang: string) => {
            this.values.lang = lang;
        }
    };
}

const settings = new SettingsManager();
settings.loadSettings();

export default settings;

