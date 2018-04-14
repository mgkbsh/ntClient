var config = require('./config/config.json');
var axios = require('axios');

axios.defaults.withCredentials = true;

class NtClient {
  constructor(env) {
    this.mainUrl = config[env].main;
    this.tweetsUrl = config[env].tweet_service;
    this.usersUrl = config[env].user_service;

  }

  async login(username, password) {
    try {
      if (!username || !password) {
        throw new Error('Unspecified parameters.');
      }

      this.username = username;
      this.password = password;

      var result = await axios(this.mainUrl + '/api/v1/public/login', {
        method: "post",
        data: {
          username: this.username,
          password: this.password
        },
        // Supress redirection to get the redirect URL in the headers.
        maxRedirects: 0,
        withCredentials: true,
        credentials: 'same-origin'
      });

    } catch (err) {
      if (err && err.response && err.response.status == 302) {  // If a redirection has occurred.

        // Parse the URL to infer the user ID.
        var tokenized = err.response.headers.location.split('/')
        if (tokenized.length == 5 && !isNaN(tokenized[3])) {
          this.id = parseInt(tokenized[3])
          return 'success'
        }
      }
    }

    return null;

  }

  async tweet(content) {
    try {
      if (!this.username || !this.password) {
        throw new Error('Unspecified parameters.');
      }

      await axios.post(this.tweetsUrl + '/tweet', {
          content: content,
          username: this.username,
          password: this.password
      });

      return 'success';

    } catch (err) {
      return null;
    }
  }

  async getMyTweets() {
    try {
      if (!this.id) {
        throw new Error('Unspecified parameters.');
      }

      var tweets = await axios.get(this.tweetsUrl + '/timeline/user', {
        data: { id: this.id }
      });

      return JSON.parse(JSON.stringify(tweets.data));
    } catch (err) {
      return null;
    }
  }

  async getFolloweeTweets() {
    try {
      if (!this.id) {
        throw new Error('Unspecified parameters.');
      }

      var tweets = await axios.get(this.tweetsUrl + '/timeline/followees', {
        data: { id: this.id }
      });

      return JSON.parse(JSON.stringify(tweets.data));
    } catch (err) {
      return null;
    }
  }

  async getMyInfo() {
    try {
      if (!this.id) {
        throw new Error('Unspecified parameters.');
      }

      var user = await axios.get(this.usersUrl + '/user', {
        data: { id: this.id }
      });

      return JSON.parse(JSON.stringify(user.data));
    } catch (err) {
      return null;
    }
  }
}

module.exports = NtClient;
