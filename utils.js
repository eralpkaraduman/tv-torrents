const EztvApi = require('eztv-api-pt');
const R = require('ramda');

const eztv = new EztvApi({
	baseUrl: 'https://eztv.ag/', // The base url of eztv. Defaults to 'https://eztv.ag/'.
	debug: true // Show extra output. Defaults to 'false'.
});

const getShows = (show) => new Promise((resolve, reject) => {
	return eztv.getAllShows()
		.then(res => {
			const datas = res.filter(data => R.contains(show, data.show));
			return resolve(datas.map(data => ({ title: data.show, data })));
		})
		.catch(err => reject(err));
});

const getMagnetsOfShow = (showData, season = 1) => {
	return eztv.getShowData(showData).then(res => {
		const seasonData = res.episodes[String(season)];
		if (seasonData) {
			console.log('Found season: ' + season);
			return seasonData;
		}
		else {
			throw 'Season ' + season + ' not found!';
		}
	})
		.then(seasonData => R.toPairs(seasonData).map(
			pair => ({ number: pair[0], data: pair[1] })
		))
		.then(episodes => episodes.map(episode => {
			const bestQuality = R.head(R.keys(episode.data).sort(
				(a, b) => parseInt(a) <= parseInt(b)
			));
			console.log(episode.number + ' -> ' + bestQuality);
			return episode.data[bestQuality].url;
		}));
}

function pbcopy(data) {
	return new Promise(function (resolve, reject) {
		const proc = require('child_process').spawn('pbcopy');
		proc.on('error', function (err) {
			reject(err);
		});
		proc.on('close', function (err) {
			resolve();
		});
		proc.stdin.write(data);
		proc.stdin.end();
	})
};

module.exports = {
	getShows,
	getMagnetsOfShow,
	pbcopy
};