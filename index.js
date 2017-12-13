const program = require('commander');
const colors = require('colors');
const utils = require('./utils');

module.exports = function() {
	program
		.version('1.0.0')
		.usage('[options] <Series Name>')
		.option('-s, --season [number]', 'Season Number', 1)
		.parse(process.argv);

	const [name] = program.args;
	const {season} = program;

	if (!name) {
		console.error(colors.red('Error: No series name provided'));
		program.outputHelp();
		process.exit(1);
	}

	utils.getMagnets(name, season)
	.then(magnets => magnets.reduce((text, magnet) => text += magnet + '\n\n', ''))
	.then(text => utils.pbcopy(text))
	.then(() => console.log('Copied magnet links to clipboard!'))
	.catch(err => {
		console.error(colors.red(`Error: ${err}`));
		process.exit(1);
	});
}
