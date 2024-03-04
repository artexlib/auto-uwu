const ChatHandler = require('./handlers/chat_handler');
const CommandHandler = require('./handlers/command_handler');
const SettingsManager = require('./settings/settings');
const Utils = require('./utilities/utils');
const Interfaces = require('./interfaces/magic_shell');

module.exports = function UwuCore(mod) {

  const chatHandler = new ChatHandler(mod);
  const commandHandler = new CommandHandler(mod);
  const settingsManager = new SettingsManager(mod);

  mod.command.add('uwu', (...args) => commandHandler.handleCommand(args));
  mod.hook('S_CHAT', 3, (event) => chatHandler.handleChatMessage(event));

  if (global.TeraProxy.GUIMode) {
    settingsManager.initializeUI();
    mod.hook('S_LOGIN', 14, () => { settingsManager.destructor(); });
  }

};