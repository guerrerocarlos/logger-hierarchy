'use strict'
const crypto = require('crypto')
const chalk = require('chalk')

const sha1 = function (data) {
	return crypto.createHash('sha1').update(data).digest('hex')
}

let spaces = 0
function Logger(moduleName) {
	return function (arg, anonName) {
		let fName = 'Anonymous'

		try {
			fName = arg.callee.toString().match(/function ([^(]+)/)[1]
		} catch (err) {
			console.log(err)
			if (anonName !== undefined) {
				fName = anonName
			}
		}
		const cl = chalk.hex('#' + sha1(moduleName + fName).slice(0, 7))
		const clb = chalk.bold.hex('#' + sha1(moduleName + fName).slice(0, 7))
		const clu = chalk.bold.underline.hex('#' + sha1(moduleName + fName).slice(0, 7))
		const thisspaces = spaces
		spaces++

		function coloredLogger(color) {
			return function () {
				const concatenated = []
				for (let a = 0; a < arguments.length; a++) {
					if (typeof (arguments[a]) === 'string') {
						concatenated.push((arguments[a]))
					}
					if (typeof (arguments[a]) === 'object') {
						concatenated.push((JSON.stringify(arguments[a])))
					}
				}
				console.log('', ' '.repeat(thisspaces * 2), clb('|'), color(concatenated.join(' ')))
				return ('', ' '.repeat(thisspaces * 2), clb('|'), color(concatenated.join(' ')))
			}
		}

		function printArguments() {
			const concatenated = []
			for (let a = 0; a < arg.length; a++) {
				try {
					switch (arg[a].constructor.name) {
						case 'String':
							concatenated.push('\'' + arg[a] + '\'')
							break
						case 'Number':
							concatenated.push(String(arg[a]))
							break
						case 'Array':
							concatenated.push(String(arg[a].toString().length > 15 ? (arg[a][0] + '...') : (arg[a])))
							break
						case 'Function':
							concatenated.push(arg[a].constructor.name + ':' + arg[a].toString().match(/function ([^(]+)/)[0])
							break
						case 'Buffer':
							concatenated.push(arg[a].constructor.name + ':(' + arg[a].length + ' Bytes)')
							break
						case 'Object':
							concatenated.push(arg[a].constructor.name + ':{...' + arg[a].toString().length + ' bytes...}')
							break
						default:
							concatenated.push(arg[a].constructor.name + ':' + arg[a])
					}
				} catch (err) {
					if (arg[a] === null || arg[a] === undefined) {
						concatenated.push(arg[a])
					} else if (arg[a].toString().indexOf('function') > -1) {
						concatenated.push(arg[a].toString().split(')')[0] + ') {...}')
					} else {
						concatenated.push('[e:' + typeof (arg[a]) + ']' + arg[a])
					}
				}
			}
			console.log('', ' '.repeat(thisspaces * 2) + cl(' \\\n') + ' '.repeat(spaces * 2) + clb('+'), clu(moduleName) + '.' + cl(fName), cl.apply(this, ['(', concatenated.join(', '), ')']))
			return ['', ' '.repeat(thisspaces * 2) + cl(' \\\n') + ' '.repeat(spaces * 2) + clb('+'), clu(moduleName) + '.' + cl(fName), cl.apply(this, ['(', concatenated.join(', '), ')'])].join(' ')
		}

		function finished() {
			spaces -= 1
			console.log('', ' '.repeat(thisspaces * 2), cl('/'))
			return ('', ' '.repeat(thisspaces * 2), cl('/'))
		}

		return {
			message: coloredLogger(chalk.hex('#ffffff')),
			description: coloredLogger(chalk.bold.hex('#ffffff')),
			log: coloredLogger(chalk.hex('#ffffff')),
			error: coloredLogger(chalk.hex('#ff0000')),
			err: coloredLogger(chalk.hex('#ff0000')),
			warning: coloredLogger(chalk.hex('#ffe500')),
			warn: coloredLogger(chalk.hex('#ffe500')),
			success: coloredLogger(chalk.hex('#00cc21')),
			finished,
			end: finished,
			printArguments
		}
	}
}

module.exports = Logger