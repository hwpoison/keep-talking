const allEngines: Record<string, string> = {
	'GPT-4o': 'gpt-4o',
	'GPT-4 Turbo': 'gpt-4-turbo',
	'GPT-3.5 Turbo': 'gpt-3.5-turbo'
}

const defaultEngine: string = 'GPT-3.5 Turbo'

export { allEngines, defaultEngine }