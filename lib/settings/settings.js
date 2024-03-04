const SettingsUI = require('tera-mod-ui').Settings;

class SettingsManager {
  constructor(mod) {
    this.mod = mod;
    this.ui = null;
  }

  initializeUI() {
    const settingsStructure = require('./settings_structure');
    this.ui = new SettingsUI(this.mod, settingsStructure, this.mod.settings, { height: 200 });
    this.ui.on('update', (settings) => {
      this.mod.settings = settings;
    });

    this.destructor = () => {
      if (this.ui) {
        this.ui.close();
        this.ui = null;
      }
    };
  }
}

module.exports = SettingsManager;
