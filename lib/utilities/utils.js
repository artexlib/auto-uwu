module.exports = {
    
    /**
    * @param channel - outputChannel The output to check. This is used to determine if the channel is valid
    * @param outputChannel
    * 
    * @return { boolean } True if the channel is valid
    */

    isValidChannel(channel, outputChannel) {
      const validChannels = [0, 1, 2, 3, 4, 27, 32]; 
      return validChannels.includes(channel) && channel === outputChannel;
    },
  
    /**
    * settings Settings for the random delay. Must contain at least Min and randomDelayMax
    * 
    * @param settings
    * 
    * @return { number } Random
    */
   
    randomDelay(settings) {
      return settings.randomDelayMin + Math.floor(Math.random() * (settings.randomDelayMax - settings.randomDelayMin));
    }
  }
  