const allEngines  : Record<string, string> = {
	'Davinci': 'davinci',
	'Davinci Instruct': 'text-davinci-001',
	'Ada': 'text-ada-001',
	'Curie': 'text-curie-001'
}

const defaultEngine : string = 'Davinci'

export { allEngines , defaultEngine }