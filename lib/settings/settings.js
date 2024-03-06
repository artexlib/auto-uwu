const SettingsUI = require('tera-mod-ui').Settings;

class SettingsManager {

  /**
  * @param mod
  */

  constructor(mod) {
    this.mod = mod;
    this.ui = null;
  }

  /**
  * / / object / list to be used in a call to any of the methods of the object
  */
 
  initializeUI() {
    const settingsStructure = require('./settings_structure');
    this.ui = new SettingsUI(this.mod, settingsStructure, this.mod.settings, { height: 200 });
    this.ui.on('update', (settings) => {
      this.mod.settings = settings;
    });

    this.destructor = () => {
      // Closes the UI and closes the UI.
      if (this.ui) {
        this.ui.close();
        this.ui = null;
      }
    };
  }
}

module.exports = SettingsManager;
