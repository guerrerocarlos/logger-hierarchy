'strict'
const logger = require('../')('moduleName')

function thirdFunction(numberProvided) {
	const log = logger(arguments)
	log.printArguments()

	log.message('Number received', numberProvided)
	log.error('There was an error message over here on the "thirdFunction"')

	log.finished()
}

function secondFunction(stringProvided, numberProvided) {
	const log = logger(arguments)
	log.printArguments()

	log.message('String received:', stringProvided)
	thirdFunction(numberProvided)
	log.warning('Secondary Function Warned')

	log.finished()
}

function mainFunction(stringProvided, numberProvided) {
	const log = logger(arguments)
	log.printArguments()

	log.message('Going to call Secondafy Function')
	secondFunction(stringProvided + ' and passed to secondary function', numberProvided)
	log.success('Secondary Function Finished!')

	log.finished()
}

mainFunction('string parameter provided', 1234123)
