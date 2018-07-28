const program = require('commander');
const colors = require('colors');
const utils = require('./utils');
const inquirer = require('inquirer');
const rarbg = require('./rarbg');

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

const seasonString = parseInt(season).toLocaleString(undefined, {minimumIntegerDigits: 2});
const searchTerm = `${name}.s${seasonString}`;
console.log(searchTerm);

rarbg(searchTerm)
.catch(e => { process.exit(1); console.log(e) })
.then(list => Promise.resolve(list.reduce((collection, magnetUrl) => collection += `${magnetUrl}\r\r`, '')))
.then(collection => {
  utils.pbcopy(collection);
  console.log('copied to clipboard');
});
