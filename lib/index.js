const SettingsUI = require('tera-mod-ui').Settings;
const electron = require('electron');
const path = require('path');

module.exports = function UwuCore(mod) {
  
  let cooldowns = {};
  let overlayWindow;

  function createOverlayWindow(url) {
    overlayWindow = new electron.BrowserWindow({
      width: 1000,
      height: 800,
      transparent: true,
      frame: true,
      resizable: false,
      alwaysOnTop: true,
      movable: true,
      minimizable: false,
      closable: true,
      autoHideMenuBar: true,
      darkTheme: true,
      skipTaskbar: true,
      titleBarStyle: 'hidden',
      icon: path.join(__dirname, 'icon.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
  
    overlayWindow.loadURL(url);
  
    overlayWindow.focus();
  
    overlayWindow.setAlwaysOnTop(true, 'pop-up-menu', 1);

    overlayWindow.webContents.executeJavaScript(`
    const style = document.createElement('style');
    style.innerHTML = '::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
    ;0`).catch(error => {
    console.error('Error executing JavaScript:', error);
  });
};

  function handleCommand(args) {
    switch (args[0]) {
      case undefined:
        mod.settings.isEnabled = !mod.settings.isEnabled;
        msg(`Mod is now ${mod.settings.isEnabled ? 'enabled' : 'disabled'}.`);
        mod.saveSettings();
        break;
      case 'ask':
          createOverlayWindow('https://deconimus.github.io/magic-conch-shell/');
          msg('Ask the magic conch shell...');
          break;
      case 'ui':
        ui.show();
        break;
      case 'add':
        if (!args[1]) {
          msg('Please provide a phrase/emoji to add.');
          return;
        }

        let newPhrase = args.slice(1).join(' ');
        mod.settings.usedPhrases.push(newPhrase);
        msg(`Phrase "${newPhrase}" added.`);
        mod.saveSettings();
        break;
      case 'remove':
      case 'delete':
      case 'del':
        if (!args[1]) {
          msg('Please provide the phrase/emoji to remove.');
          return;
        }

        let phraseToRemove = args.slice(1).join(' ');
        let indexToRemove = mod.settings.usedPhrases.indexOf(phraseToRemove);

        if (indexToRemove !== -1) {
          mod.settings.usedPhrases.splice(indexToRemove, 1);
          msg(`Phrase "${phraseToRemove}" removed.`);
          mod.saveSettings();
        } else {
          msg(`The phrase "${phraseToRemove}" is not in the list.`);
        }
        break;
      case 'ch':
      case 'channel':
        if (!args[1]) {
          msg('Please enter a channel number.');
          return;
        }
        let channelNumber = parseInt(args[1]);
        switch (args[1]) {
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '27':
          case '32':
            mod.settings.outputChannel = channelNumber;
            msg(`Output channel set to: ${args[1]}`);
            mod.saveSettings();
            break;
          case 'auto':
            mod.settings.autoMode = !mod.settings.autoMode;
            msg(`Auto channel ${mod.settings.autoMode ? 'enabled' : 'disabled'}.`);
            mod.saveSettings();
            break;
          case 'list':
            msg('Available channels:');
            msg('0 - Say');
            msg('1 - Party');
            msg('2 - Guild');
            msg('3 - Area');
            msg('4 - Trade');
            msg('27 - Global');
            msg('32 - Raid');
            break;
          default:
            msg('Unknown channel! Please check the FAQ/HELP before reporting a bug.');
            break;
        }
        break;
      case 'help':
      case 'faq':
      case 'info':
        msg('Commands:');
        msg('/8 uwu - on/off.');
        msg('/8 uwu ui - settings ui.');
        msg('/8 uwu add (phrase)');
        msg('/8 uwu del (phrase)');
        msg('/8 uwu ch - switch ch.');
        msg('/8 uwu ch auto - auto ch');
        msg('/8 uwu ch list - ch ID list');
        msg('/8 uwu ask - opens magic conch shell.');
        msg('/8 uwu reload - reload config file.');
        msg(`Have Fun, ${mod.game.me.name}!`);
        break;
      default:
        msg('Unknown command!');
        break;
    }
  }

  function msg(message) {
    mod.command.message(message);
  }

  function handleChatMessage(event) {
    if (!mod.settings.isEnabled) return;
    if (event.name === mod.game.me.name) return;

    let userCooldown = cooldowns[event.name] || 0;
    if (userCooldown > Date.now()) return;

    let lowerCaseMessage = event.message.toLowerCase();

    let matchedPhrase = mod.settings.usedPhrases.find((phrase) => {
      let regex = new RegExp(`\\b${phrase.toLowerCase()}\\b`);
      return regex.test(lowerCaseMessage);
    });

    if (matchedPhrase) {
      if (mod.settings.autoMode) mod.settings.outputChannel = event.channel;
      if ([0, 1, 2, 3, 4, 27, 32].includes(event.channel) && event.channel === mod.settings.outputChannel) {
        mod.send('C_CHAT', 1, {
          message: matchedPhrase,
          channel: event.channel
        });
        cooldowns[event.name] = Date.now() + mod.settings.randomDelayMin + Math.floor(Math.random() * (mod.settings.randomDelayMax - mod.settings.randomDelayMin));
      }
    }
  }

  mod.command.add('uwu', (...args) => handleCommand(args));

  mod.hook('S_CHAT', 3, (event) => handleChatMessage(event));

  let ui = null;
  if (global.TeraProxy.GUIMode) {
    ui = new SettingsUI(mod, require('./settings/settings_structure'), mod.settings, { height: 200 });
    ui.on('update', (settings) => {
      mod.settings = settings;
    });

    this.destructor = () => {
      if (ui) {
        ui.close();
        ui = null;
      }
    };
  }
};
