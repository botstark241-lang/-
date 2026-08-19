const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');
const fs = require('fs');

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

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connexion fermée. Reconnexion...', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ STARK MD Connecté !');
    }
  });
}

startBot();
