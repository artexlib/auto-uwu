const Interfaces = require('../interfaces/electron_interface');

class CommandHandler {

    /**
    * @param mod
    * @param settingsManager
    */

    constructor(mod, settingsManager) {
      this.mod = mod;
      this.settingsManager = settingsManager;
  }
  
    /**
    * @param args
    */
   
    handleCommand(args) {
      // The command to be executed.
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
  
    /**
    * @param args
    * 
    * @return { undefined } -
    */
   
    handleAddCommand(args) {
      // If the phrase emoji is not specified.
      if (!args[1]) {
        this.msg('Please provide a phrase/emoji to add.');
        return;
      }
  
      const newPhrase = args.slice(1).join(' ');

      // Checks if the phrase is already in the list.
      if (this.mod.settings.usedPhrases.includes(newPhrase)) {
        this.msg(`The phrase "${newPhrase}" is already in the list.`);
        return;
      }

      this.mod.settings.usedPhrases.push(newPhrase);
      this.msg(`Phrase "${newPhrase}" added.`);
      this.mod.saveSettings();
    }
  
    /**
    * @param args
    * 
    * @return { undefined } -
    */
   
    handleRemoveCommand(args) {
      // If the phrase emoji is not specified the phrase emoji will be removed.
      if (!args[1]) {
        this.msg('Please provide the phrase/emoji to remove.');
        return;
      }
  
      const phraseToRemove = args.slice(1).join(' ');
      const indexToRemove = this.mod.settings.usedPhrases.indexOf(phraseToRemove);
  
      // Removes a phrase from the list.
      if (indexToRemove !== -1) {
        this.mod.settings.usedPhrases.splice(indexToRemove, 1);
        this.msg(`Phrase "${phraseToRemove}" removed.`);
        this.mod.saveSettings();
      } else {
        this.msg(`The phrase "${phraseToRemove}" is not in the list.`);
      }
    }
  
    /**
    * @param args
    * 
    * @return { undefined } No return
    */
   
    handleChangeCommand(args) {
      // If the channel name is not provided
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
  
      // Set the channel to the channel name.
      if (channelName in channelMappings) {
        const channelId = channelMappings[channelName];
  
        // Set the output channel to the channel.
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

    /**
    * @param message
    */
   
    msg(message) {
      this.mod.command.message(message);
    }
  
    /**
    * @return { string } Help message for uwu's command list. This is used to show help
    */

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
  
    /**
    * @return { string } Available channels : auto enables automatic channel switching and response channel list and message to be shown
    */

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

    /**
    * / / object / list object is used to determine the type of object that is being
    */

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

    /**
    * a / object / string / number. The same as the C ++ version but with a string
    */

    handleJokeCommand() {
        const jokes = require('../data/jokes.json').jokes;
        const randomIndex = Math.floor(Math.random() * jokes.length);
        this.msg(jokes[randomIndex]);
    }
  }
  
module.exports = CommandHandler;
  