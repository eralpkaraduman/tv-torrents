const RarbgApi = require('rarbg')
 
// Create a new instance of the module.
const rarbg = new RarbgApi();

const search_string = 'Black.Mirror.S04';
rarbg.search({
    search_string,
    sort: 'seeders',
    category: rarbg.categories.TV_HD_EPISODES,
    min_seeders: 50
  })
  .then(response => {
    // response = response.filer(item => item.filename.includes(search_string));
    const magnets = response
      .filter(item => item.filename.includes('1080p'))
      .filter(item => item.filename.includes('STRiFE'))
      .map(item => item.download);

    magnets.forEach(magnet => console.log(magnet));
    // Output:
    // [
    //   {
    //     "filename": "Star.Wars.Episode.VII.The.Force.Awakens.2015.1080p.BluRay.H264.AAC-RARBG",
    //     "category": "Movies/x264/1080",
    //     "download": "magnet:?xt=urn:btih:..."
    //   },
    //   {
    //     "filename": "Star.Wars.Episode.VII.The.Force.Awakens.2015.1080p.BluRay.x264-Replica",
    //     "category": "Movies/x264/1080",
    //     "download": "magnet:?xt=urn:btih:..."
    //   }
    // ]
  })
  .catch(err => console.error(err))
 
// List recent torrents
// rarbg.list()
//   .then(response => {
//     console.log(response)
    // Output:
    // [
    //   {
    //     "filename": "Those.Who.Cant.S02E02.HDTV.x264-AMBIT[rartv]",
    //     "category": "TV Episodes",
    //     "download": "magnet:?xt=urn:btih:..."
    //   },
    //   {
    //     "filename": "Those.Who.Cant.S02E02.720p.HDTV.x264-AMBIT[rartv]",
    //     "category": "TV HD Episodes",
    //     "download": "magnet:?xt=urn:btih:..."
    //   }
    //   ...
    // ]
  // })
  // .catch(err => console.error(err))