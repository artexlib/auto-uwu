const SettingsManager = require('./settings/settings');
const CommandHandler = require('./handlers/command_handler');
const ChatHandler = require('./handlers/chat_handler');

module.exports = function UwuCore(mod) {

  const settingsManager = new SettingsManager(mod);
  const commandHandler = new CommandHandler(mod, settingsManager);
  const chatHandler = new ChatHandler(mod);

  mod.command.add('uwu', (...args) => commandHandler.handleCommand(args));
  mod.hook('S_CHAT', 3, (event) => chatHandler.handleChatMessage(event));

  if (global.TeraProxy.GUIMode) {
    settingsManager.initializeUI();
  }
};
