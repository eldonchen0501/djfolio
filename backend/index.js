const express = require('express');
const https = require('https');
const request = require('request');
const key = 'AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg';

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

app.get('/api/getSong', (req, res) => {
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

var video_queue = [];


app.get('/api/add-song', (req, res) => {
  var videoId;
  var videoTitle;
  var params = req.params;
  var keyword = params['keyword'];
  https.get(`https://www.googleapis.com/youtube/v3/search?q=${keyword}&part=snippet&key=${key}&maxResults=1`, (res) => {
    res.on('data', (data) => {
      d = JSON.parse(data);
      videoId = d.items[0].id.videoId;
      videoTitle = d.items[0].snippet.title;
      request('https://content.googleapis.com/youtube/v3/videos?id=aJOTlE1K90k&part=contentDetails&key=AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data = JSON.parse(body);
          console.log(data);
          videoDuration = data.items[0].contentDetails.duration;
          video_queue.push({id: videoId, title: videoTitle, duration: videoDuration});
          console.log(video_queue);
        }
      })
    });

  }).on('error', (e) => {
    console.error(e);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
