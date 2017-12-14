const program = require('commander');
const colors = require('colors');
const utils = require('./utils');
const inquirer = require('inquirer');

program
	.version('1.0.0')
	.usage('[options] <Series Name>')
	.option('-s, --season [number]', 'Season Number', 1)
	.parse(process.argv);

const [name] = program.args;
const { season } = program;

if (!name) {
	console.error(colors.red('Error: No series name provided'));
	program.outputHelp();
	process.exit(1);
}

utils.getShows(name)
	.then(options => {
		if (options.length > 1) {
			return inquirer.prompt([{
				message: 'Multiple shows found, choose one',
				name: 'selectedShow',
				type: 'list',
				choices: options.map(option => option.title)
			}])
				.then(answers => ({ selectedShow: answers.selectedShow, options }));
		}
		else if (options.length === 1) {
			return { selectedShow: options[0].title, options }
		}
		else {
			throw 'No shows found';
		}
	})
	.then(({ selectedShow, options }) => {
		const [selectedOption] = options.filter(option => {
			return option.title === selectedShow;
		});
		const { data } = selectedOption;
		return data;
	})
	.then(data => utils.getMagnetsOfShow(data, season))
	.then(magnets => magnets.reduce((text, magnet) => text += magnet + '\n\n', ''))
	.then(text => utils.pbcopy(text))
	.then(() => console.log('Copied magnet links to clipboard!'))
	.catch(err => {
		console.error(colors.red(`Error: ${err}`));
		process.exit(1);
	});
