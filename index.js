const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ["STARK-MD", "Chrome", "1.0"]
  })
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if(!msg.message || msg.key.fromMe) return
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
    const from = msg.key.remoteJid
    const prefix = "."

    if(body === prefix + 'menu' || body === prefix + 'help'){
      if(fs.existsSync('./menu.jpg')){
        await sock.sendMessage(from, {
          image: fs.readFileSync('./menu.jpg'),
          caption: `*STARK-MD V2*\n\nPrefix: ${prefix}\n\n• ${prefix}menu\n• ${prefix}ping\n\nBot by STARK`
        }, { quoted: msg })
      } else {
        await sock.sendMessage(from, { text: `*STARK-MD V2*\n\n• ${prefix}menu\n• ${prefix}ping` }, { quoted: msg })
      }
    }
    if(body === prefix + 'ping'){
      await sock.sendMessage(from, { text: 'STARK-MD en ligne ✅' }, { quoted: msg })
    }
  })
}
start()
