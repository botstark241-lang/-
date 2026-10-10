const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')
const { handleCommands } = require('./commande')

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

    if(!body.startsWith(prefix)) return

    const args = body.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase()

    // 1. Tes anciennes commandes (menu + ping avec image)
    if(command === 'menu' || command === 'help'){
      try {
        if(fs.existsSync('./commande.json')){
          const data = JSON.parse(fs.readFileSync('./commande.json'))
          let txt = `*${data.botName} MENU*\n\n`
          data.commands.forEach(c => { txt += `*${prefix}${c.cmd}* - ${c.desc}\n` })

          if(fs.existsSync('./menu.jpg')){
            await sock.sendMessage(from, {
              image: fs.readFileSync('./menu.jpg'),
              caption: txt
            }, { quoted: msg })
          } else {
            await sock.sendMessage(from, { text: txt }, { quoted: msg })
          }
        }
      } catch(e){ console.log(e) }
      return
    }

    if(command === 'ping'){
      await sock.sendMessage(from, { text: 'STARK-MD en ligne ✅' }, { quoted: msg })
      return
    }

    // 2. Toutes les nouvelles commandes (.vv.kick.kickall2.tagall etc)
    await handleCommands(sock, msg, args, command, from)
  })
}

start()
