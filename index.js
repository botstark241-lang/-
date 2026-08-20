const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, downloadMediaMessage } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');
const fs = require('fs');
const { commandes } = require('./commandes.js') // <-- AJOUTÉ

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('STARK MD Bot is running ✅');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('session');
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  // ========== GESTION DES MESSAGES ==========
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

    // Bloquer les users ban
    global.banned = global.banned || []
    if (global.banned.includes(sender)) return

    // Lancer toutes les commandes
    await commandes(sock, msg, body, from, isGroup, groupMetadata, pushname, sender)
  })
  // ==========================================

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
