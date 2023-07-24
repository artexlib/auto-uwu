const SettingsUI = require('tera-mod-ui').Settings;

module.exports = function UwuCore(mod) {

  let cooldowns = {};

  function Shell() {
    const uri = `https://deconimus.github.io/magic-conch-shell/`;

    try {
      const encoded_uri = encodeURI(uri);
      mod.toClient('S_SHOW_AWESOMIUMWEB_SHOP', 1, {
        link: encoded_uri
      });
    } catch (e) {
      console.log(e);
    }
  };

  function handleCommand(args) {
    switch (args[0]) {
      case undefined:
        mod.settings.isEnabled = !mod.settings.isEnabled;
        msg(`Mod is now ${mod.settings.isEnabled ? 'enabled' : 'disabled'}.`);
        break;
      case 'shell':
          Shell();
          msg('Opening the magic conch shell.')
          break
      case 'ui':
          ui.show();
          break
      case 'add':
          if (!args[1]) {
            msg('Please provide a phrase/emoji to add.');
            return;
          }
    
          let newPhrase = args.slice(1).join(' ');
          mod.settings.usedPhrases.push(newPhrase);
          msg(`Phrase "${newPhrase}" added.`);
          break;
      case 'ch':
      case 'channel':
        if (!args[1]) {
          msg('Please enter a channel number.');
          return;
        }
        let channelNumber = parseInt(args[1]);
        switch (args[1]) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "27":
          case "32":
            mod.settings.outputChannel = channelNumber;
            msg(`Output channel set to: ${args[1]}`);
            break;
          case "auto":
            mod.settings.autoMode = !mod.settings.autoMode;
            msg(`Auto channel ${mod.settings.autoMode ? 'enabled' : 'disabled'}.`);
            break;
          case "list":
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
        msg('/8 uwu ui - settings ui.')
        msg('/8 uwu add (phrase)')
        msg('/8 uwu ch - switch ch.');
        msg('/8 uwu ch auto - auto ch')
        msg('/8 uwu ch list - ch ID list')
        msg('/8 uwu shell - opens magic conch shell.')
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

    let matchedPhrase = mod.settings.usedPhrases.find(phrase => event.message.toLowerCase().includes(phrase));
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

  mod.hook('S_CHAT', 3, event => handleChatMessage(event));

  let ui = null;
    if (global.TeraProxy.GUIMode) {
    ui = new SettingsUI(mod, require('./settings_structure'), mod.settings, { height: 200 });
    ui.on('update', settings => { mod.settings = settings; });

    this.destructor = () => {
      if (ui) {
        ui.close();
        ui = null;
      }
    };
  }

};
