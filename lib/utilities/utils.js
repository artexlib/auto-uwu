module.exports = {
    
    isValidChannel(channel, outputChannel) {
      const validChannels = [0, 1, 2, 3, 4, 27, 32]; 
      return validChannels.includes(channel) && channel === outputChannel;
    },
  
    randomDelay(settings) {
      return settings.randomDelayMin + Math.floor(Math.random() * (settings.randomDelayMax - settings.randomDelayMin));
    }
  }
  