const Interfaces = require('../interfaces/electron_interface');

class CommandHandler {

    constructor(mod, settingsManager) {
      this.mod = mod;
      this.settingsManager = settingsManager;
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
          this.settingsManager.ui.show();
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

        case 'settings':
          this.handleSettingsCommand();
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

      if (this.mod.settings.usedPhrases.includes(newPhrase)) {
        this.msg(`The phrase "${newPhrase}" is already in the list.`);
        return;
      }

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

    msg(message) {
      this.mod.command.message(message);
    }

    getHelpMessage() {
      return `Commands:\n` +
             `- uwu - on/off.\n` +
             `- uwu add (phrase)\n` +
             `- uwu del (phrase)\n` +
             `- uwu ch (name) - switch and limit channel by name\n` +
             `- uwu ch auto - auto channel switching\n` +
             `- uwu list - available channel list\n` +
             `- uwu settings - displays your current config\n` +
             `- uwu ask - opens magic conch shell\n` +
             `- uwu joke - some boomer jokes\n` +
             `Have Fun, ${this.mod.game.me.name}!`;
    }

    getChannelListMessage() {
      return 'Available channels: \n' +
             '- auto - enables automatic channel switching and response.\n' +
             '- say - responds in the say chat\n' +
             '- party - responds in the party chat\n' +
             '- guild - responds in the say guild\n' +
             '- area - responds in the say area\n' +
             '- trade - responds in the say trade\n' +
             '- global - responds in the say global\n' +
             '- raid - responds in the raid chat';
    }

    handleSettingsCommand() {
      const settings = this.mod.settings;
      const channelMappings = {
        0: 'say',
        1: 'party',
        2: 'guild',
        3: 'area',
        4: 'trade',
        27: 'global',
        32: 'raid',
        'auto': 'auto'
      };
  
      const outputChannelName = settings.autoMode ? 'auto' : channelMappings[settings.outputChannel];
  
      const settingsMessage = `Current Settings:\n` +
      `- Module Status: ${settings.isEnabled ? 'Enabled' : 'Disabled'}\n` +
      `- Output Channel: ${outputChannelName}\n` +
      `- Auto Mode: ${settings.autoMode ? 'Enabled' : 'Disabled'}\n` +
      `- Used Phrases: ${settings.usedPhrases.join(', ')}`;

      this.msg(settingsMessage);
    }

    handleJokeCommand() {
        const jokes = require('../data/jokes.json').jokes;
        const randomIndex = Math.floor(Math.random() * jokes.length);
        this.msg(jokes[randomIndex]);
    }
  }
  
module.exports = CommandHandler;