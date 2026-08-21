const fs = require('fs')
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys');
const express = require('express');

const fs = require('fs');
const { commandes } = require('./commandes.js') // Connecte commandes.js

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('STARK MD Bot is running ✅');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

// Système BAN global
global.banned = []

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);
  // CHANGER PHOTO DE PROFIL DU BOT AVEC stark.jpg
sock.ev.on('creds.update', async () => {
    try {
        const pp = fs.readFileSync('./stark.jpg') 
        await sock.updateProfilePicture(sock.user.id, pp)
        console.log('✅ Photo de profil 𝐒𝐭么𝐫𝐤 𝙼𝙳 mise à jour')
    } catch (e) {
        console.log('Erreur PP:', e)
    }
})
  // Écouter tous les messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    if (msg.key && msg.key.remoteJid === 'status@broadcast') return // ignore status

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
    const from = msg.key.remoteJid
    const sender = msg.key.participant || msg.key.remoteJid
    const pushname = msg.pushName || 'User'
    const isGroup = from.endsWith('@g.us')
    const groupMetadata = isGroup? await sock.groupMetadata(from) : ''

    // SYSTÈME BAN : si le numéro est ban il bloque direct
    if (global.banned.includes(sender)) return

    // Envoyer au fichier commandes.js
    await commandes(sock, msg, body, from, isGroup, groupMetadata, pushname, sender)
  })

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut;
      console.log('Connexion fermée. Reconnexion...', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ STARK MD Connecté!');
    }
  });
}

startBot();
