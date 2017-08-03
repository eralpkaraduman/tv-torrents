#### Fetches tv torrent magnet links and puts them to your clipboard so you can paste to your favorite bittorrent client.

`$ npm install`

modify following lines
```js
getMagnets(
  'Adventure Time', // show name
  7 // episode number
)
```

`$ npm start`

possible successful output
```sh
Making request to: 'showlist/'
Found shows: Adventure Time,Ghost Adventures,Ghost Adventures: Aftershocks,Lego Star Wars: The Freemaker Adventures,New Adventures Of Old Christine, The,Sarah Jane Adventures, The
Using show: Adventure Time
Making request to: 'shows/779/adventure-time/'
Found season: 7
1 -> 720p
2 -> 720p
...
37 -> 720p
Copied magnet links to clipboard!
```

