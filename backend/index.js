const express = require('express');
const https = require('https');
const request = require('request');
const key = 'AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg';
const search_url = 'https://www.googleapis.com/youtube/v3/search?';


const app = express();
const port = process.env.PORT || 5000;

var video_queue = [];


app.get('/api/add-song', (req, res) => {
  var videoId;
  var videoTitle;
  var params = req.params;
  var keyword = params['keyword'];
  https.get('https://www.googleapis.com/youtube/v3/search?q=sss&part=snippet&key=AIzaSyANFzcN4h9L4qwdwdarPR__Nv2ETalSfVg&maxResults=1', (res) => {
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
