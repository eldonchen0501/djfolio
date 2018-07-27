import React, { Component } from 'react';
import './App.css';
import YouTube from 'react-youtube';
import { ListGroup, ListGroupItem } from 'reactstrap';

class App extends Component {
  state = {
    title: '',
    YT_id: '',
    seconds: '',
    queueLength: 0,
    playlist: []
  };

  componentDidMount() {
    this.getCurrentSong()
      .then(res => this.setState({ 
        title: res.title, 
        YT_id: res.YT_id, 
        seconds: res.seconds, 
        queueLength: res.video_queueLength,
        playlist: JSON.parse(res.playlist)
      }))
      .catch(err => console.error(err));
    setInterval(() => {
      console.log('getting updated playlist')
      this.getPlaylist()
      .then(res => this.setState({
        queueLength: res.video_queueLength,
        playlist: JSON.parse(res.playlist)
      }))
      .catch(err => console.error(err));
    }, 5000);
  }

  getCurrentSong = async () => {
    console.log('getCurrentSong');
    const response = await fetch('https://djfoliobackendbot.herokuapp.com/api/getSong');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getPlaylist = async () => {
    const response = await fetch('https://djfoliobackendbot.herokuapp.com/api/getPlaylist');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };
  
  _onEnd = (event) => {
    // access to player in all event handlers via event.target
    this.getCurrentSong()
      .then(res => this.setState({ 
        title: res.title, 
        YT_id: res.YT_id, 
        seconds: res.seconds, 
        queueLength: res.video_queueLength,
        playlist: JSON.parse(res.playlist)
      }))
      .catch(err => console.log(err));
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        // controls: 0,
        start: this.state.seconds
      }
    };

    function Playlist(props) {
      const list = props.list;

      if (list.length > 0) {
        const listItems = list.map((item) =>
          <ListGroupItem key={ item.url } tag="a" href={ item.url } target="_blank" action>
            { item.title }
          </ListGroupItem>
        );
        return (
          <ListGroup>{ listItems }</ListGroup>
        );
      } else {
        return (
          <ListGroup>
            <ListGroupItem>
              Come back later or request a new song through slack /djfolio command!
            </ListGroupItem>
          </ListGroup>
        )
      }
    }

    return (
      <div className="App">
        <h2>{ this.state.title }</h2>
        <YouTube
          videoId={ this.state.YT_id }
          opts={ opts }
          onEnd={ this._onEnd }
        />
        <h2>{ "Currently " + this.state.queueLength + " songs in queue" }</h2>
        <Playlist list={ this.state.playlist } />
      </div>
    );
  }
}

export default App;
