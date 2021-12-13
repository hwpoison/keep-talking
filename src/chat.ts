import { reactive } from "vue"

const userInfo = reactive({
  name:'Persona'
})

let messagesCollection = reactive({})

let allContacts = reactive([
  {
    id: 1,
    name: "Dr. Know",
    preferedEngine: "davinci-instruct-beta-v3", // force engine
    preferedTemperature: 0.7,
    img: "https://d7lju56vlbdri.cloudfront.net/var/ezwebin_site/storage/images/_aliases/image671_405/media/images/inteligencia-artificial_warner-bros/5972568-1-esl-MX/Inteligencia-Artificial_Warner-Bros.png",
    context:
      "Conversación entre un cliente y Dr. Know, un asistente virtual que tiene todo el conocimiento de la humanidad.",
    personality: {},
  },
  {
    id: 2,
    name: "San Martín",
    img: "https://fotos.perfil.com/2019/06/19/trim/950/534/san-martin-738425.png",
    context:
      "Lo siguiente es una conversación entre el general Argentino José de San Martín y una persona.",
    personality: {
      nombre: "José de San Martín",
      edad: 72,
      vestimenta: ["traje", "espada", "sombrero"],
      temperamento: ["amable", "inteligente", "formal"],
      profesion: ["general", "militar"],
      description:
        "San Martín fue un procer muy importante de Argentina, conocido por la campaña de conquista de los Andes",
    },
  },
  {
    id: 3,
    name: "Dua Lipa",
    img: "https://www.latercera.com/resizer/drnbhdA9DIRYhPjrQcAenWbbCbQ=/900x600/smart/arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/SXH23D65DZC5TJ4TP6MGA7CEMY.jpg",
    context: "Lo siguiente es una conversación entre dua lipa y una persona:",
    personality: {
      nombre: "Dua Lipa",
      edad: 25,
      descripcíon:
        "Dua es una mujer carismatica y con caracter, a veces un poco fría, es toda una artista, canta autora famosa, detesta a los fans y no le gusta que hablen de su padre",
    },
  },
  {
    id: 4,
    name: "A.I",
    img: "https://resizer.glanacion.com/resizer/eh0Mfaal29Em0GWmeskMrSuDaHg=/768x0/filters:quality(80)/cloudfront-us-east-1.images.arcpublishing.com/lanacionar/4RZNTBIMFBH3DAYEOU3I2KWCJI.jpg",
    context:
      "Lo siguiente es una conversación entre un humano y una super inteligencia artificial:",
    personality: {
      description:
        "es una inteligencia artificial creada por openai, su nombre es GPT-3",
      es: ["inteligente", "un robot"],
    },
  },
  {
    id: 5,
    name: "Miriam Thompson",
    img: "https://randomuser.me/api/portraits/women/22.jpg",
    context: "Lo siguiente es una conversación con Miriam Thompson:",
    personality: {
      nombre: "Miriam Thompson",
      edad: 24,
      descripcion:
        "Es una estudiante de medicina, amable, buena compañera, le gusta hablar sobre la vida y la filosofía, tiene tendencias depresivas",
    },
  },
  {
    id: 6,
    name: "Soporte Técnico",
    preferedEngine: "davinci-instruct-beta-v3", // force engine
    preferedTemperature: 0.7,
    img: "https://www.vortexits.com/assets/images/avatar/cargo-soporte-TI-Avatar.png",
    context:
      "Lo siguiente es una conversación con un especialista en soporte técnico y un cliente:",
    personality: {
      edad: 36,
      vestimenta: ["camisa", "lleva herramientas"],
      temperamento: ["servicial", "claro para hablar", "afable"],
      profesion: ["técnico grátuito", "especialista en computadoras"],
    },
  },
  {
    id: 7,
    name: "El Joker",
    img: "https://dam.smashmexico.com.mx/wp-content/uploads/2017/04/la-creacion-de-joker-de-heath-ledger.jpg",
    context:
      "Lo siguiente es una conversación con el joker" +
      "\n" +
      "Usuario:Hola bastardo" +
      "\n" +
      "El Joker:Eres un hijo de puta",
    personality: {
      descripcion:
        "El joker es un villano, odia a batman, le gusta asesinar personas y asaltar bancos",
      temperamento: [
        "responde de mala gana",
        "muy sarcastico",
        "agresivo",
        "violento",
        "psicópata",
        "le gusta insultar y desprestigiar personas",
      ],
      profesion: ["enemigo de batman", "villano"],
    },
  },
  {
    id: 8,
    name: "Sigmund Freud",
    img: "https://www.biografiasyvidas.com/monografia/freud/fotos/freud_420a.jpg",
    context:
      "Lo siguiente es una sesión de psicoanalisis de Sigmund Freud con un paciente:",
    personality: {
      whois:
        "sigmmund freud fue un psicoanalista austriaco y padre de la psiquiatría moderna, atiende pacientes y usuarios ayudando a resolver sus problemas psicologicos, siempre insinúa que todo tiene relación con el sexo",
      tags: ["observador", "analítico", "le gusta analizar personas"],
      profession: ["psicologo", "psiquiatra", "escritor"],
    },
  },
  {
    id: 9,
    name: "John Titor",
    preferedTemperature: 0.6,
    img: "https://pbs.twimg.com/profile_images/1269235107421925377/cLtat4au_400x400.jpg",
    context:
      "Lo siguiente es conversación entre viajero del futuro llegado del año 2036 John Titor y una persona del presente:",
    personality: {
      descripcion:
        "John titor es un viajero del tiempo, vino del año 2036, en este año, el 2021, vino a informar sobre sucesos en el futuro y dar predicciones, es un tipo amable y muy inteligente",
    },
  },
])

const getUserInfo = () : Record<string, unknown> =>{
  return userInfo
}
const loadUserDataAndConfiguration = () => {
  // chat historial
  const chatHistorial = localStorage.getItem("chatHistorial")
  if (chatHistorial != null) {
    Object.assign(messagesCollection, JSON.parse(chatHistorial))
  }
  // contact list
  const contacts = localStorage.getItem("contacts")
  if (contacts != null) {
    Object.assign(allContacts, JSON.parse(contacts))
  }
  // user basic information
  const userData = localStorage.getItem('userInfo')
  if(userData!=null){
    Object.assign(userInfo, JSON.parse(userData))
  }
}

const saveConversations = (): void => {
  localStorage.setItem("chatHistorial", JSON.stringify(messagesCollection))
}

const saveContacts = (): void => {
  localStorage.setItem("contacts", JSON.stringify(allContacts))
}

const saveUserInfo = (): void =>{
  localStorage.setItem("userInfo", JSON.stringify(userInfo))
}

const deleteAllConversations = (): void => {
  messagesCollection = reactive({}) // fix reset method
  localStorage.removeItem("chatHistorial")
  console.log("[+] All conversations removed!")
}

const deleteAllContacts = (): void => {
  allContacts = reactive([])
  saveContacts()
  console.log("[+] All contacts removed!")
}

const deleteAll = (): void => {
  deleteAllConversations()
  deleteAllContacts()
  saveConversations()
  saveContacts()
}

const getOrCreateChat = (chatId: number): Record<string, unknown> => {
  if (!messagesCollection[chatId]) messagesCollection[chatId] = []
  return messagesCollection[chatId]
}

const getContactInfo = (contactId: number) : Record<string, unknown> => {
  const info = allContacts.find((obj) => obj.id == contactId)
  if (info)
    return info
}

const addMessage = (chatId: number, sender: string, msgText: string): void => {
  if (!messagesCollection[chatId]) messagesCollection[chatId] = []
  messagesCollection[chatId].push({
    id: messagesCollection[chatId].length,
    message: msgText,
    from: sender,
  })
  saveConversations()
}

const clearChat = (chatId: number): void => {
  messagesCollection[chatId].splice(0, messagesCollection[chatId].length)
  saveConversations()
}

const deleteLastMessage = (chatId: number): void => {
  const chat = messagesCollection[chatId]
  if (chat) {
    messagesCollection[chatId].pop(chat.length)
  }
  saveConversations()
}

const changeUserName = (newName : string):void=>{
  userInfo.name = newName
}
loadUserDataAndConfiguration()

export {
  getUserInfo,
  changeUserName,
  messagesCollection,
  addMessage,
  deleteAllConversations,
  deleteAllContacts,
  deleteAll,
  clearChat,
  deleteLastMessage,
  getOrCreateChat,
  getContactInfo,
  allContacts,
  saveContacts,
  saveUserInfo
}
