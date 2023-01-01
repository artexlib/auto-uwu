module.exports = function uwuCore(uwu) {

    let isEnabled = uwu.settings.isEnabled;
    let uChannel = uwu.settings.uChannel;
    let autoCh = uwu.settings.autoMode;
    // let checkMe = 0;
    let randomMs = Math.floor(Math.random() * 402) + 807;
    let allChnls = [0, 1, 2, 3, 4, 27, 32];
    let used = ['uwu', 'owo', 'qwq', 'qvq', 'ewo', 'uwo', 'q_q', 'owu', 'owe', 'ewe', 'u.u'];

    uwu.command.add('uwu', (...args) => {
        switch(args[0]) {
            case undefined:
                isEnabled = !isEnabled;
                msg('Mod is now ' + (isEnabled ? 'enabled' : 'disabled') + '.');
                break
            case 'ch': case 'channel':
                if (!args[1]) {
                    msg('Plase enter channel number.')
                    return
                }
                if (args[1]) {
                    if (args[1] === "0") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: SAY')
                        return
                    }
                    if (args[1] === "1") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: PARTY')
                        return
                    }
                    if (args[1] === "2") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: GUILD')
                        return
                    }
                    if (args[1] === "3") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: AREA')
                        return
                    }
                    if (args[1] === "4") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: TRADE')
                        return
                    }
                    if (args[1] === "27") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: GLOBAL')
                        return
                    }
                    if (args[1] === "32") {
                        uChannel = parseInt(args[1])
                        msg('Output channel set to: RAID')
                        return
                    }
                    if (args[1] === "auto") {
                        autoCh = !autoCh;
                        msg('Auto channel ' + (autoCh ? 'enabled' : 'disabled' + '.'));
                        break
                    }
                } else {
                    msg('Unknown channel! Please, check the FAQ/HELP before reporting a bug.')
                    return
                }
            case 'help': case 'faq': case 'info':
                msg('Commands:')
                msg('/8 uwu - on/off.')
                msg('/8 uwu ch - switch ch.')
                msg('Have Fun, ' + uwu.game.me.name + '!')
                return
            default:
                msg('Unknown command!')
                return
        }
    });

    // Functions

    function msg(mSm) { 
        uwu.command.message(mSm); 
    }

/*   function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
      } */

    function include(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == obj) return true;
        }
      }

    // Hooks

    uwu.hook('S_CHAT', 3, (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.length() === 3) return;
//       if (checkMe == 0) return;
        if (used.some(v => event.message.toLowerCase().includes(v))) {
            if (autoCh) { uChannel = event.channel };
            if (event.channel == uChannel && include(allChnls, event.channel)) {
                uwu.send('C_CHAT', 1, {
                    message: event.message,
                    channel: event.channel
                })
            /*    checkMe + 1;
                delay(randomMs).then(() => checkMe - 1); */
        }} 
    });

}
