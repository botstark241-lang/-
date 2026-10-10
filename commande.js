// STARK MD - fichier commande.js

let antilink = [];
let autoreact = [];

async function handleCommands(sock, m, args, command, from) {
    const isGroup = from.endsWith('@g.us');
    const sender = m.key.participant || from;

    switch(command) {
        // Voir une fois
        case 'vv': {
            let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
            if(!q) return sock.sendMessage(from,{text:"Réponds à une photo vue unique avec.vv"});
            let media = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q;
            await sock.sendMessage(from,{forward: media},{quoted:m});
            break;
        }
        case 'vv2': {
            let q = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
            if(!q) return;
            let media = q.viewOnceMessageV2?.message || q.viewOnceMessage?.message || q;
            await sock.sendMessage(sender, media);
            sock.sendMessage(from,{text:"✅ Envoyé en privé"});
            break;
        }

        // Groupe
        case 'antilink': {
            if(!isGroup) return;
            if(args[0]=='on'){ if(!antilink.includes(from)) antilink.push(from); sock.sendMessage(from,{text:"✅ Antilink ON"}); }
            else { antilink=antilink.filter(g=>g!=from); sock.sendMessage(from,{text:"❌ Antilink OFF"}); }
            break;
        }
        case 'kick': {
            if(!isGroup) return;
            let users = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
            if(!users ||!users[0]) return sock.sendMessage(from,{text:"Usage:.kick @user"});
            await sock.groupParticipantsUpdate(from, users, "remove");
            break;
        }
        case 'kickall2': {
            if(!isGroup) return;
            let meta = await sock.groupMetadata(from);
            let isAdmin = meta.participants.find(p=>p.id==sender)?.admin;
            if(!isAdmin) return sock.sendMessage(from,{text:"Admin seulement"});
            sock.sendMessage(from,{text:"⚠️ Kickall2 en cours..."});
            let members = meta.participants.filter(p=>!p.admin).map(p=>p.id);
            for(let id of members){ await sock.groupParticipantsUpdate(from, [id], "remove"); await new Promise(r=>setTimeout(r,1500)); }
            break;
        }
        case 'tagall': {
            if(!isGroup) return;
            let meta = await sock.groupMetadata(from);
            let mentions = meta.participants.map(p=>p.id);
            await sock.sendMessage(from,{text:`📢 ${args.join(' ') || 'Salut tous'}`, mentions});
            break;
        }
        case 'hidetag': {
            if(!isGroup) return;
            let meta = await sock.groupMetadata(from);
            let mentions = meta.participants.map(p=>p.id);
            await sock.sendMessage(from,{text: args.join(' ') || 'Stark MD', mentions});
            break;
        }
        case 'bannumber': {
            let num = args[0]?.replace(/[^0-9]/g,'');
            if(!num) return sock.sendMessage(from,{text:".bannumber 241xxxxxxxx"});
            await sock.updateBlockStatus(num+"@s.whatsapp.net","block");
            sock.sendMessage(from,{text:`🚫 ${num} bloqué`});
            break;
        }

        // Fun
        case 'quizz': {
            let list = [{q:"Capitale du Gabon?",a:"Libreville"},{q:"2+2*2?",a:"6"},{q:"Créateur du bot?",a:"Stark"}];
            let r = list[Math.floor(Math.random()*list.length)];
            sock.sendMessage(from,{text:`🧠 QUIZZ: ${r.q}\nRéponse: ${r.a}`});
            break;
        }
        case 'ping': {
            sock.sendMessage(from,{text:`⚡ Pong! Stark MD actif`});
            break;
        }
        case 'menu': {
            let fs = require('fs');
            if(fs.existsSync('./commande.json')){
                let data = JSON.parse(fs.readFileSync('./commande.json'));
                let txt = `*${data.botName} MENU*\n\n`;
                data.commands.forEach(c=>{ txt+= `*${data.prefix}${c.cmd}* - ${c.desc}\n`; });
                sock.sendMessage(from,{text:txt});
            } else {
                sock.sendMessage(from,{text:"Menu:.vv.vv2.kick.kickall2.tagall.antilink.bannumber.quizz"});
            }
            break;
        }
    }
}

module.exports = { handleCommands, antilink, autoreact };
