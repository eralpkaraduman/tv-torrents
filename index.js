const EztvApi = require('eztv-api-pt');
const R = require('ramda');

const eztv = new EztvApi({
  baseUrl: 'https://eztv.ag/', // The base url of eztv. Defaults to 'https://eztv.ag/'.
  debug: true // Show extra output. Defaults to 'false'.
});

const getMagnets = (show, season = 1) => {
  return eztv.getAllShows()
  .then(res => {
    const datas = res.filter(data => R.contains(show, data.show));
    console.log('Found shows: ' + datas.map(data => data.show));
    const [data] = datas;
    console.log('Using show: ' + data.show);
    return eztv.getShowData(data);
  })
  .then(res => {
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
    pair => ({number: pair[0], data: pair[1]})
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
  return new Promise(function(resolve, reject) {
    const proc = require('child_process').spawn('pbcopy');
    proc.on('error', function(err) {
      reject(err);
    });
    proc.on('close', function(err) {
      resolve();
    });
    proc.stdin.write(data);
    proc.stdin.end();
  })
};

getMagnets('Adventure Time', 9)
.then(magnets => magnets.reduce((text, magnet) => text += magnet + '\n\n', ''))
.then(text => pbcopy(text))
.then(() => console.log('Copied magnet links to clipboard!'))
.catch(err => console.error(err));
