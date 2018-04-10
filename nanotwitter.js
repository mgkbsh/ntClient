var config = require('./config/config.json');
var axios = require('axios');

// axios.defaults.withCredentials = true;

class NanoTwitter {
  constructor(env) {
    this.url = config[env];
  }

  async login(username, password) {
    try {
      var result = await axios.post(this.url + '/login', {
        username: username,
        password: password
      });
    } catch (err) {

    }
  }

  logout() {

  }

  async tweet(content) {
    try {
      var result = await axios.post(this.url + '/tweets/new', {
        content: content,
        // withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "same-origin"
      });
    } catch (err) {
      console.log(this.url)
      console.log(err);
    }
  }

  async getTimeline() {

  }


}

module.exports = NanoTwitter;
