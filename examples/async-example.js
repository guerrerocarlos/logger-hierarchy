'strict'
const request = require('request')
const logger = require('../')('moduleName')

function fetch(kind) {
	const log = logger(arguments)
	log.showArguments()

	log.message('Fetching data for', kind)
	return new Promise((resolve, reject) => {
		request.get('https://gist.githubusercontent.com/guerrerocarlos/' +
		'd70978d766abe5065965bc1b820444af/raw/7f43a737bf2a73f36697efdd2379b3bb84aba546/' + kind + '.json')
		.on('response', res => {
			log.warn('Got data for', kind, '...')
			if (res.statusCode === 200) {
				log.success('Got', kind)
				resolve()
			} else {
				log.warn('Response status:', res.statusCode)
				log.error('No', kind, ':(')
				reject()
			}
			log.end()
		})
	})
}

function fetchAnimals() {
	const log = logger(arguments)
	log.showArguments()

	const promises = []
	promises.push(fetch('dogs'))
	promises.push(fetch('birds'))
	promises.push(fetch('cats'))

	log.message('All fetches sent')

	Promise.all(promises).then(() => {
		log.message('All promises finished successfully')
		log.end()
	})
	.catch(() => {
		log.message('Not all promises finished successfully')
		log.end()
	})
}

fetchAnimals()
