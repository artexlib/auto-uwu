const Utils = require('../utilities/utils');

class ChatHandler {

  constructor(mod) {
    this.mod = mod;
    this.cooldowns = {};
  }
 
  handleChatMessage(event) {
    if (!this.mod.settings.isEnabled || event.name === this.mod.game.me.name) return;

    const userCooldown = this.cooldowns[event.name] || 0;
    if (userCooldown > Date.now()) return;

    const lowerCaseMessage = event.message.toLowerCase();
    const matchedPhrase = this.mod.settings.usedPhrases.find((phrase) => {
      return lowerCaseMessage.includes(phrase.toLowerCase());
    });


    if (matchedPhrase) {
      if (this.mod.settings.autoMode) {
        this.mod.settings.outputChannel = event.channel;
      }
      if (Utils.isValidChannel(event.channel, this.mod.settings.outputChannel)) {
        this.mod.send('C_CHAT', 1, {
          channel: event.channel,
          message: matchedPhrase,
        });
        this.cooldowns[event.name] = Date.now() + Utils.randomDelay(this.mod.settings);
      }
    }
  }
}

module.exports = ChatHandler;
