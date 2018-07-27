const express = require('express');
const https = require('https');
const request = require('request');
const key = 'AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg';

const app = express();
const port = process.env.PORT || 5000;

let currentSecond = 0;
let video_queue = [
];

let playlist = video_queue.map(obj =>{
  var rObj = {};
  rObj['title'] = obj.title;
  rObj['url'] = 'https://www.youtube.com/watch?v=' + obj.id
  return rObj;
});

let intervalObj = setInterval(() => {
  if (video_queue.length > 0) {
    currentSecond = currentSecond + 1;

    if (currentSecond === video_queue[0].duration) {
      currentSecond = 0;
      video_queue.shift();
    }
  } else {
    clearInterval(intervalObj);
  }
}, 1000);

let convert_time = (duration) => {
  console.log('before convert: ', duration);
  var a = duration.match(/\d+/g);

  if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
    a = [0, a[0], 0];
  }

  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
    a = [a[0], 0, a[1]];
  }
  if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
    a = [a[0], 0, 0];
  }

  duration = 0;

  if (a.length == 3) {
    duration = duration + parseInt(a[0]) * 3600;
    duration = duration + parseInt(a[1]) * 60;
    duration = duration + parseInt(a[2]);
  }

  if (a.length == 2) {
    duration = duration + parseInt(a[0]) * 60;
    duration = duration + parseInt(a[1]);
  }

  if (a.length == 1) {
    duration = duration + parseInt(a[0]);
  }
  console.log('after convert: ', duration);
  return duration
};


app.get('/api/getSong', (req, res) => {
  if (video_queue.length > 0) {
    currentSong = video_queue[0];

    res.send({
      title: currentSong.title,
      YT_id: currentSong.id,
      seconds: currentSecond,
      video_queueLength: video_queue.length,
      playlist: JSON.stringify(playlist)
    });
  } else {
    res.send('No song left');
  }
});

app.get('/api/add-song', (req, cli_res) => {
  var videoId;
  var videoTitle;
  var params = req.query;
  var keyword = params.keyword;
  console.log('params: ', params);
  https.get(`https://www.googleapis.com/youtube/v3/search?q=${keyword}&part=snippet&key=${key}&maxResults=1`, (res) => {
    res.on('data', (data) => {
      d = JSON.parse(data);
      if(d.items[0] && d.items[0].id.videoId){
        videoId = d.items[0].id.videoId;
        videoTitle = d.items[0].snippet.title;
        console.log('request url: ', `https://content.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg`);
        request(`https://content.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg`, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            data = JSON.parse(body);
            // console.log(data);
            videoDuration = convert_time(data.items[0].contentDetails.duration.toString());
            video_queue.push({id: videoId, title: videoTitle, duration: videoDuration});
            // console.log(video_queue);
            console.log('Song pushed in queue successfully');
            cli_res.send('Song added');
          }
        });
      }
      else
        cli_res.send('Invlid query');
    });

  }).on('error', (e) => {
    console.error(e);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
