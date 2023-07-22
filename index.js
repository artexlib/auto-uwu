const fs = require('fs');
const path = require('path');

module.exports = function UwuCore(uwu) {
  let isEnabled;
  let outputChannel;
  let autoMode;
  let randomDelayMin;
  let randomDelayMax;
  let usedPhrases;
  let cooldowns = {};

  function loadConfig() {
    let configPath = path.resolve(__dirname, 'config.json');
    let configData = fs.readFileSync(configPath, 'utf8');
    let config = JSON.parse(configData);

    isEnabled = config.isEnabled;
    outputChannel = config.outputChannel;
    autoMode = config.autoMode;
    randomDelayMin = config.randomDelayMin;
    randomDelayMax = config.randomDelayMax;
    usedPhrases = config.usedPhrases;
  }

  function saveConfig() {
    let configPath = path.resolve(__dirname, 'config.json');
    let configData = JSON.stringify({
      isEnabled,
      outputChannel,
      autoMode,
      randomDelayMin,
      randomDelayMax,
      usedPhrases
    }, null, 2);
  
    fs.writeFileSync(configPath, configData, 'utf8');
  }
  

  function reloadConfig() {
    loadConfig();
    msg('Config reloaded successfully.');
  }

  function Shell() {
    const uri = `https://deconimus.github.io/magic-conch-shell/`;

    try {
      const encoded_uri = encodeURI(uri);
      uwu.toClient('S_SHOW_AWESOMIUMWEB_SHOP', 1, {
        link: encoded_uri
      });
    } catch (e) {
      console.log(e);
    }
  };

  function handleCommand(args) {
    switch (args[0]) {
      case undefined:
        isEnabled = !isEnabled;
        msg(`Mod is now ${isEnabled ? 'enabled' : 'disabled'}.`);
        saveConfig();
        break;
      case 'shell':
          Shell();
          msg('Opening the magic conch shell.')
          break
      case 'add':
          if (!args[1]) {
            msg('Please provide a phrase/emoji to add.');
            return;
          }
    
          let newPhrase = args.slice(1).join(' ');
          usedPhrases.push(newPhrase);
          msg(`Phrase "${newPhrase}" added.`);
          saveConfig();
          break;
      case 'ch':
      case 'channel':
        if (!args[1]) {
          msg('Please enter a channel number.');
          return;
        }
        let channelNumber = parseInt(args[1]);
        switch (args[1]) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "27":
          case "32":
            outputChannel = channelNumber;
            msg(`Output channel set to: ${args[1]}`);
            saveConfig();
            break;
          case "auto":
            autoMode = !autoMode;
            msg(`Auto channel ${autoMode ? 'enabled' : 'disabled'}.`);
            saveConfig();
            break;
          case "list":
            msg('Avaiable channels:')
            msg('0 - Say')
            msg('1 - Party')
            msg('2 - Guild')
            msg('3 - Area')
            msg('4 - Trade')
            msg('27 - Global')
            msg('32 - Raid')
          default:
            msg('Unknown channel! Please check the FAQ/HELP before reporting a bug.');
            break;
        }
        break;
      case 'help':
      case 'faq':
      case 'info':
        msg('Commands:');
        msg('/8 uwu - on/off.');
        msg('/8 uwu add (phrase)')
        msg('/8 uwu ch - switch ch.');
        msg('/8 uwu ch auto - auto ch')
        msg('/8 uwu ch list - ch ID list')
        msg('/8 uwu shell - opens magic conch shell.')
        msg('/8 uwu reload - reload config file.');
        msg(`Have Fun, ${uwu.game.me.name}!`);
        break;
      case 'reload':
        reloadConfig();
        break;
      default:
        msg('Unknown command!');
        break;
    }
  }

  function msg(message) {
    uwu.command.message(message);
  }

  function handleChatMessage(event) {
    if (!isEnabled) return;
    if (event.name === uwu.game.me.name) return;

    let userCooldown = cooldowns[event.name] || 0;
    if (userCooldown > Date.now()) return;

    let matchedPhrase = usedPhrases.find(phrase => event.message.toLowerCase().includes(phrase));
    if (matchedPhrase) {
      if (autoMode) outputChannel = event.channel;
      if ([0, 1, 2, 3, 4, 27, 32].includes(event.channel) && event.channel === outputChannel) {
        uwu.send('C_CHAT', 1, {
          message: matchedPhrase,
          channel: event.channel
        });
        cooldowns[event.name] = Date.now() + randomDelayMin + Math.floor(Math.random() * (randomDelayMax - randomDelayMin));
      }
    }
  }

  uwu.command.add('uwu', (...args) => handleCommand(args));

  uwu.hook('S_CHAT', 3, event => handleChatMessage(event));

  loadConfig();
};
