import { reactive } from "vue"
import OpenAI from "openai-api"

const OPENAI_API_KEY = "<YOUR API KEY>"

class openaiAPI {
  constructor() {
    this.apiKey = OPENAI_API_KEY
    this.configuration = {
      temperature: 0.8,
      engine: "ada",
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

  async chatGen(prompt, botName, engine = null, temperature = null) {
    let stopwords = ["Usuario:", botName + ":"]
    let selectedEngine = engine?engine:this.configuration.engine
    let selectedTemperature = temperature? temperature:this.configuration.temperature

    if (selectedEngine != "davinci-instruct-beta-v3") stopwords.push("\n")

    console.log("=>Input:", prompt, "\n\n=>Engine:", selectedEngine)
      const gptResponse = await this._openai.complete({
          engine: selectedEngine,
          prompt: prompt,
          maxTokens: 150,
          temperature: selectedTemperature,
          topP: 1,
          presencePenalty: 0.7,
          frequencyPenalty: 0,
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
