const SettingsManager = require('./settings/settings');
const CommandHandler = require('./handlers/command_handler');
const ChatHandler = require('./handlers/chat_handler');

/**
* The UwuCore is the top - level Tera API for mod. It adds commands and chat messages to the mod.
* 
* @param mod - The AngularJS mod object for this plugin
*/

module.exports = function UwuCore(mod) {

  const settingsManager = new SettingsManager(mod);
  const commandHandler = new CommandHandler(mod, settingsManager);
  const chatHandler = new ChatHandler(mod);

  mod.command.add('uwu', (...args) => commandHandler.handleCommand(args));
  mod.hook('S_CHAT', 3, (event) => chatHandler.handleChatMessage(event));

  // Initialize the GUI if the GUI mode is enabled.
  if (global.TeraProxy.GUIMode) {
    settingsManager.initializeUI();
  }
};
