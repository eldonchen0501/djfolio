const express = require('express');
const request = require('request');

const app = express();
const port = process.env.PORT || 5000;

let currentSecond = 0;
let queue = [
  { title: 'X-Japan - Kurenai', id: 'N6lKT8REALw', duration: 414 },
  { title: 'X JAPAN - Rusty Nail(PV)', id: 'IXvreqrrh3o', duration: 329 },
  { title: 'DESTINY - GALNERYUS', id: '-hL-iO86vdI', duration: 330 }
];

let playlist = queue.map(obj =>{ 
  var rObj = {};
  rObj['title'] = obj.title;
  rObj['url'] = 'https://www.youtube.com/watch?v=' + obj.id
  return rObj;
});

let intervalObj = setInterval(() => {
  if (queue.length > 0) {
    currentSecond = currentSecond + 1;
  
    if (currentSecond === queue[0].duration) {
      currentSecond = 0;
      queue.shift();
    }
  } else {
    clearInterval(intervalObj);
  }
}, 1000);

app.get('/getSong', (req, res) => {
  if (queue.length > 0) {
    currentSong = queue[0];

    res.send({
      title: currentSong.title,
      YT_id: currentSong.id,
      seconds: currentSecond,
      queueLength: queue.length,
      playlist: JSON.stringify(playlist)
    });
  } else {
    res.send('No song left');
  }
});

app.get('/addSong', (req, res) => {
  request('https://content.googleapis.com/youtube/v3/videos?id=aJOTlE1K90k&part=contentDetails&key=AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  })
});

app.listen(port, () => console.log(`Listening on port ${port}`));