const Utils = require('../utilities/utils');

class ChatHandler {

  /**
  * @param mod
  */

  constructor(mod) {
    this.mod = mod;
    this.cooldowns = {};
  }

  /**
  * @param event
  * 
  * @return { boolean } Whether or not the event was
  */
 
  handleChatMessage(event) {
    // If the game is enabled or not
    if (!this.mod.settings.isEnabled || event.name === this.mod.game.me.name) return;

    const userCooldown = this.cooldowns[event.name] || 0;
    // If the user cooldown is less than the current time then return false.
    if (userCooldown > Date.now()) return;

    const lowerCaseMessage = event.message.toLowerCase();
    const matchedPhrase = this.mod.settings.usedPhrases.find((phrase) => {
      return lowerCaseMessage.includes(phrase.toLowerCase());
    });

    // Send a C_CHAT event to the server.
    if (matchedPhrase) {
      // Set the output channel to the output channel
      if (this.mod.settings.autoMode) {
        this.mod.settings.outputChannel = event.channel;
      }

      // Send C_CHAT 1 message to the server.
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
