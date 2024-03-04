const Interfaces = require('../interfaces/electron_interface');

class CommandHandler {
    constructor(mod) {
      this.mod = mod;
    }
  
    handleCommand(args) {
      switch (args[0]) {
        case undefined:
          this.mod.settings.isEnabled = !this.mod.settings.isEnabled;
          this.msg(`Mod is now ${this.mod.settings.isEnabled ? 'enabled' : 'disabled'}.`);
          this.mod.saveSettings();
          break;
  
        case 'ask':
          Interfaces.createOverlayWindow('https://deconimus.github.io/magic-conch-shell/');
          this.msg('Ask the magic conch shell...');
          break;

        case 'joke':
          this.handleJokeCommand();
          break
  
        case 'ui':
          this.mod.settingsManager.ui.show();
          break;
  
        case 'add':
          this.handleAddCommand(args);
          break;
  
        case 'del':
          this.handleRemoveCommand(args);
          break;
  
        case 'ch':
          this.handleChangeCommand(args);
          break; 
        
        case 'list':
          this.msg(this.getChannelListMessage());
          break;
  
        case 'help':
          this.msg(this.getHelpMessage());
          break;
  
        default:
          this.msg('Unknown command!');
      }
    }
  
    handleAddCommand(args) {
      if (!args[1]) {
        this.msg('Please provide a phrase/emoji to add.');
        return;
      }
  
      const newPhrase = args.slice(1).join(' ');
      this.mod.settings.usedPhrases.push(newPhrase);
      this.msg(`Phrase "${newPhrase}" added.`);
      this.mod.saveSettings();
    }
  
    handleRemoveCommand(args) {
      if (!args[1]) {
        this.msg('Please provide the phrase/emoji to remove.');
        return;
      }
  
      const phraseToRemove = args.slice(1).join(' ');
      const indexToRemove = this.mod.settings.usedPhrases.indexOf(phraseToRemove);
  
      if (indexToRemove !== -1) {
        this.mod.settings.usedPhrases.splice(indexToRemove, 1);
        this.msg(`Phrase "${phraseToRemove}" removed.`);
        this.mod.saveSettings();
      } else {
        this.msg(`The phrase "${phraseToRemove}" is not in the list.`);
      }
    }
  
    handleChangeCommand(args) {
      if (!args[1]) {  
        this.msg('Please enter a channel name. (Example: party, guild, say)');
        return;
      }
  
      const channelName = args[1].toLowerCase();
      const channelMappings = {
        'say': 0,
        'party': 1,
        'guild': 2,
        'area': 3,
        'trade': 4,
        'global': 27,
        'raid': 32,
        'auto': 'auto' 
      };
  
      if (channelName in channelMappings) {
        const channelId = channelMappings[channelName];
  
        if (channelId === 'auto') {
          this.mod.settings.autoMode = !this.mod.settings.autoMode;
          this.msg(`Auto channel ${this.mod.settings.autoMode ? 'enabled' : 'disabled'}.`);
        } else {
          this.mod.settings.outputChannel = channelId;
          this.msg(`Output channel set to: ${channelName}`);
        }
        this.mod.saveSettings();
      } else {
        this.msg('Unknown channel! Please check the FAQ/HELP before reporting a bug.');
      }
    }

  
    // Helper Functions

    msg(message) {
      this.mod.command.message(message);
    }
  
    getHelpMessage() {
      return `Commands:
             /8 uwu - on/off.
             /8 uwu add (phrase).
             /8 uwu del (phrase).
             /8 uwu ch - switch channel.
             /8 uwu ch auto - auto channel switch.
             /8 uwu list - channel list.
             /8 uwu ask - opens magic conch shell.
             /8 uwu joke - boomer jokes.
             Have Fun, ${this.mod.game.me.name}!`;
    }
  
    getChannelListMessage() {
      return 'Available channels: \n' +
             'auto\n' +
             'say\n' +
             'party\n' +
             'guild\n' +
             'area\n' +
             'trade\n' +
             'global\n' +
             'raid';
   }

    handleJokeCommand() {
        const jokes = require('../data/jokes.json').jokes;
        const randomIndex = Math.floor(Math.random() * jokes.length);
        this.msg(jokes[randomIndex]);
  }
  }
  
module.exports = CommandHandler;
  