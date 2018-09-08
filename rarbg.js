const RarbgApi = require('rarbg');
const utils = require('./utils');

const rarbg = new RarbgApi();
const torrentNameRegex = /(.*?)\.S?(\d{1,2})E?(\d{2})\.(.*)/;
function parseTorrentName(torrentName) {
  const results = torrentNameRegex.exec(torrentName);
  return {
    showName: results && results[1],
    season: results && parseInt(results[2]),
    episode: results && parseInt(results[3])
  }
}

module.exports = search_string => rarbg.search({
  search_string,
  sort: 'seeders',
  category: rarbg.categories.TV_HD_EPISODES,
  min_seeders: 2
})
.catch(err => console.error(err))
.then(response => Promise.resolve(
    response
    .filter(item => item.filename.includes('1080p'))
    .map(item => ({ ...item, parsedName: parseTorrentName(item.filename) }))
    .sort((a, b) => a.parsedName.episode - b.parsedName.episode)
  )
)
.then(magnets => Promise.resolve(magnets.map(magnet => magnet.download)));