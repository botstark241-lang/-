const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')
const express = require('express')
const { handleCommands } = require('./commande')

const app = express()
const PORT = process.env.PORT || 3000

app.get('/', (req,res)=> res.sendFile(__dirname+'/pair.html'))

app.get('/pair', async (req,res)=>{
  let num = req.query.number?.replace(/[^0-9]/g,'')
  if(!num) return res.json({error:'Numéro invalide'})
  try{
    const { state, saveCreds } = await useMultiFileAuthState('./session-pair')
    const sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), printQRInTerminal:false, browser:["STARK-MD","Chrome","1.0"] })
    sock.ev.on('creds.update', saveCreds)
    if(!sock.authState.creds.registered){
      let code = await sock.requestPairingCode(num)
      res.json({code: code})
    }
  }catch(e){ res.json({error: e.message}) }
})

app.listen(PORT, ()=> console.log('Web en ligne sur port '+PORT))

// Lancement du bot principal
async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), printQRInTerminal: true, browser: ["STARK-MD", "Chrome", "1.0"] })
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
    if(command==='menu'){
      let data = JSON.parse(fs.readFileSync('./commande.json'))
      let txt = `*${data.botName} MENU*\n\n`
      data.commands.forEach(c=>{ txt+=`*${prefix}${c.cmd}* - ${c.desc}\n` })
      await sock.sendMessage(from, {text: txt}, {quoted: msg})
      return
    }
    await handleCommands(sock, msg, args, command, from)
  })
}
start()
