import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API = 'https://localhost:5000/';

class App extends Component {
  state = {
    response: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.YT_id }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <iframe id="player" type="text/html" width="640" height="390"
          src={ this.state.response }
          frameborder="0"></iframe>
      </div>
    );
  }
}

export default App;
