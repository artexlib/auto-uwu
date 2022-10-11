module.exports = function uwuCore(uwu) {

    let isEnabled = uwu.settings.isEnabled;
    let uChannel = uwu.settings.uChannel;
    let randomMs = Math.floor(Math.random() * 402) + 807;
    let used = ['uwu', 'owo', 'qwq', 'qvq', 'ewo', 'uwo', 'q_q', 'owu', 'owe', 'ewe'];

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

    async function AntiSpam() {
        await new Promise(resolve => setTimeout(resolve, randomMs));
    }

    // Hooks

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("uwu") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'UwU',
                channel: event.channel
        })} 
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("owo") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'OwO',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("qwq") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'QwQ',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("qvq") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'QvQ',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("ewo") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'EwO',
                channel: event.channel
        })}
    });
    
    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("uwo") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'UwO',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("q_q") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'Q_Q',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("owu") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'OwU',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("OwE") && event.channel == uChannel) {
            uwu.send('C_CHAT', 1, {
                message: 'OwE',
                channel: event.channel
        })}
    });

    uwu.hook('S_CHAT', 3 , (event) => {
        if (!isEnabled) return;
        if (event.name === uwu.game.me.name) return;
        if (event.message.toLowerCase().includes("ewe") && event.channel == uChannel) {
            AntiSpam();
            uwu.send('C_CHAT', 1, {
                message: 'EwE',
                channel: event.channel
        })}
    });

}
