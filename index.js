var config = require('./config/config.json');
var NanoTwitter = require('./nanotwitter')
var prompt = require('readline-sync');

const env = process.argv[2].trim();

if (env != 'local' && env != 'remote') {
  console.log("FAIL: Choose either 'local' or 'remote' as arguments.");
  return;
}

const client = new NanoTwitter(env);

while(true) {
  var command = prompt.question('nt> ').trim();

  if (!command) {

    console.log("Error: Enter a valid command.");
    continue;

  }

  if (command == 'exit'){

    break;

  } else if (command == 'help') {

    console.log('Commands: exit, help, login, tweet, timeline');

  } else if (command == 'login') {

    var username = prompt.question('username: ').trim();
    var password = prompt.question('password: ').trim();

    if (!username || !password) {
      console.log("Error: Enter a valid username and password.");
      continue;
    }
    client.login(username, password);

  } else if (command == 'tweet') {

    var content = prompt.question('content: ').trim();
    client.tweet(content);

  } else if (command == 'timeline') {

    printTimeline(client.timeline());

  } else {

    console.log('Error: Enter a valid command.');

  }
}

function printTimeline(tweets) {

}
