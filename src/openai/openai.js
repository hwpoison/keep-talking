import { reactive } from "vue"
import OpenAI from "openai-api"
import { engines } from '../openai/engines.ts'

const OPENAI_API_KEY = "<YOUR API KEY>"

class openaiAPI {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.configuration = {
      temperature: 0.9,
      engine: "curie"
    }
    this._openai = new OpenAI(this.apiKey)
  }

  setApiKey(key) {
    this.apiKey = key
    this._openai._api_key = this.apiKey
  }

  setEngine(engine) {
    this.configuration.engine = engine
  }

  async chatGen(prompt, userName, botName, engine = null, temperature = null) {
    let stopwords = [userName + ':', botName + ":"]
    let selectedEngine = engine?engine:this.configuration.engine
    let selectedTemperature = temperature? temperature:this.configuration.temperature

    if (!selectedEngine.includes('text-')) stopwords.push("\n")
    console.log("=>Input:", prompt, 
      "\n\n=>Engine:", selectedEngine,
      "\n\n=>Temperature:", selectedTemperature)
      const gptResponse = await this._openai.complete({
          engine: selectedEngine,
          prompt: prompt,
          maxTokens: 150,
          temperature: selectedTemperature, // a number between 0 and 1 that determines how many creative risks the engine takes when generating text.
          topP: 1,
          presencePenalty: 0.6, // a number between 0 and 1. The higher this value the model will make a bigger effort in talking about new topics.
          frequencyPenalty: 0.0, // a number between 0 and 1. The higher this value the model will make a bigger effort in not repeating itself.
          bestOf: 1,
          n: 1,
          stream: false,
          stop: stopwords,
        })

    console.log("=>Output", gptResponse.data.choices[0].text)
    return gptResponse
  }

  loadUserConfiguration() {
    // get prefered engine
    // console.log("[+]Loading OpenAI userconfig.")
    const userConfig = JSON.parse(localStorage.getItem("openAIConfiguration"))
    if (userConfig) {
      if (userConfig.temperature)
        this.configuration.temperature = userConfig.temperature
      if (userConfig.engine) this.configuration.engine = userConfig.engine
    }else{
      this.configuration.engine = engines['Davinci Instruct']
    }
  }

  saveConfiguration() {
    // console.log("[+]Saving openai userconfig.")
    localStorage.setItem(
      "openAIConfiguration",
      JSON.stringify(this.configuration)
    )
  }
}

const openai = reactive(new openaiAPI())
openai.loadUserConfiguration()

export { openai }
