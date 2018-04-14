var config = require('./config/config.json');
var NtClient = require('./ntclient')
var prompt = require('readline-sync');

const env = process.argv[2].trim();

if (env != 'local' && env != 'remote') {
  console.log("FAIL: Choose either 'local' or 'remote' as arguments.");
  return;
}

const client = new NtClient(env);


async function repl() {
  while(true) {

    var command = prompt.question('nt> ');

    if (!command) {

      console.log("Error: Enter a valid command.");
      continue;

    }

    if (command == 'exit'){

      break;

    } else if (command == 'help') {

      console.log('Commands: exit, help, login, tweet, my tweets, timeline');

    } else if (command == 'login') {

      var username = prompt.question('username: ').trim();
      var password = prompt.question('password: ').trim();

      if (!username || !password) {
        console.log("Error: Enter a valid username and password.");
        continue;
      }

      var response = await client.login(username, password);

      if (response) {
        console.log("You logged in!")
      } else {
        console.log("Whoops! Something went wrong.");
      }

    } else if (command == 'tweet') {

      var content = prompt.question('content: ').trim();
      var response = await client.tweet(content);

      if (response) {
        printTimeline(tweets);
      } else {
        console.log("Whoops! Something went wrong.")
      }

    } else if (command == 'my tweets') {

      var tweets = await client.getMyTweets();

      if (tweets) {
        printTimeline(tweets);
      } else {
        console.log("Whoops! Something went wrong.")
      }

    } else if (command == 'timeline') {

      var tweets = await client.getFolloweeTweets();

      if (tweets) {
        printTimeline(tweets);
      } else {
        console.log("Whoops! Something went wrong.")
      }

    } else if (command == 'about me') {

      var user = await client.getMyInfo();

      if (user) {
        console.log(user);
        printUser(user);
      } else {
        console.log("Whoops! Something went wrong.");
      }

    } else {
      console.log('Error: Enter a valid command.');

    }
  }
}

function printTimeline(tweets) {
  try {
    tweets.forEach(function(tweet) {
      var date = new Date(Date.parse(tweet.createdAt))
      var dateString = date.getMonth() + '/' + date.getDate() + '/' +
        date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()
      console.log(dateString + ': @' + tweet.user.username +
        ' \"' + tweet.content + '\"');
    });
  } catch (e) {
    console.log("Whoops! Something went wrong.");
  }
}

function printUser(user) {
  console.log('@' + user.username)
  console.log(user.numTweets + ' tweets, ' + user.numFollowers +
    ' followers, ' + user.numFollowees + ' followees');
}

repl();
