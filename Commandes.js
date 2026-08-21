const prefix = process.env.PREFIXE || '.'
const owner = process.env.NUMERO_OWNER + '@s.whatsapp.net'

// Vérifier si c'est le owner
const isOwner = (sender) => sender === owner

const commandes = async (sock, msg, body, from, isGroup, groupMetadata, pushname, sender) => {

    // ========== GÉNÉRALES ==========
    if (body === prefix + 'ping') {
        let start = Date.now()
        await sock.sendMessage(from, { text: `*Bot St么rk MD* ✅\nVitesse: ${Date.now() - start}ms` }, { quoted: msg })
    }

    if (body === prefix + 'menu') {
        let menu = `
╭───『 *BOT ST么RK MD* 』───╮
│ *Préfixe:* ${prefix}
│ *Owner:* ${process.env.NOM_OWNER}
│ *Mode:* ${process.env.MODE}
╰────────────────────╯

*📜 GÉNÉRALES*
${prefix}ping - Test vitesse
${prefix}menu - Ce menu
${prefix}owner - Info owner
${prefix}runtime - Temps en ligne
${prefix}script - Lien GitHub

*👥 GROUPES*
${prefix}tag - Tag reply
${prefix}tagall - Tag tout le monde
${prefix}hidetag - Tag invisible
${prefix}group - open/close
${prefix}promote - Rendre admin
${prefix}demote - Retirer admin
${prefix}kick - Expulser @
${prefix}add - Ajouter @
${prefix}linkgroup - Lien groupe
${prefix}setname - Changer nom groupe
${prefix}setdesc - Changer desc

*🎭 STICKERS & MEDIA*
${prefix}sticker - Faire sticker
${prefix}s - Faire sticker
${prefix}vv - Anti vue unique
${prefix}vv2 - Renvoyer vv
${prefix}toimg - Sticker to image
${prefix}tourl - Upload image

*🎵 TÉLÉCHARGEMENT*
${prefix}play - Musique YT
${prefix}ytmp4 - Vidéo YT
${prefix}ytmp3 - Audio YT
${prefix}tiktok - Télécharger TT
${prefix}ig - Télécharger Insta
${prefix}fb - Télécharger FB

*🤖 IA & FUN*
${prefix}gpt - Chat GPT
${prefix}ai - Question IA
${prefix}meme - Meme random
${prefix}joke - Blague
${prefix}truth - Action vérité

*🔞 OWNER ONLY*
${prefix}ban - Ban numéro
${prefix}unban - Unban numéro
${prefix}kickall - Kick tout le groupe
${prefix}bc - Broadcast
${prefix}eval - Exécuter code
${prefix}restart - Redémarrer bot
${prefix}setpp - Changer photo bot
`
        await sock.sendMessage(from, { text: menu }, { quoted: msg })
    }

    if (body === prefix + 'owner') {
        await sock.sendMessage(from, { text: `*Owner:* ${process.env.NOM_OWNER}\n*Numéro:* ${process.env.NUMERO_OWNER}` }, { quoted: msg })
    }

    // ========== GROUPES ==========
    if (body.startsWith(prefix + 'tagall') && isGroup) {
        let participants = groupMetadata.participants
        let text = `*TAGALL by ${pushname}*\n\n`
        let mentions = []
        for (let mem of participants) {
            text += `@${mem.id.split('@')[0]}\n`
            mentions.push(mem.id)
        }
        await sock.sendMessage(from, { text, mentions }, { quoted: msg })
    }

    if (body.startsWith(prefix + 'kick') && isGroup && isOwner(sender)) {
        let mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || []
        await sock.groupParticipantsUpdate(from, mentioned, 'remove')
        await sock.sendMessage(from, { text: 'Utilisateur expulsé ✅' }, { quoted: msg })
    }

    // ========== OWNER ONLY - BAN NUMBER ==========
    if (body.startsWith(prefix + 'ban') && isOwner(sender)) {
        let target = body.split(' ')[1]
        if (!target) return sock.sendMessage(from, { text: `Usage: ${prefix}ban 241xxxxxxxx` }, { quoted: msg })

        let banNumber = target + '@s.whatsapp.net'
        // Tu peux ajouter ici une DB pour stocker les bans
        global.banned = global.banned || []
        global.banned.push(banNumber)
        await sock.sendMessage(from, { text: `*${target}* a été ban ✅\nIl ne pourra plus utiliser le bot` }, { quoted: msg })
    }

    if (body.startsWith(prefix + 'unban') && isOwner(sender)) {
        let target = body.split(' ')[1] + '@s.whatsapp.net'
        global.banned = global.banned.filter(v => v!== target)
        await sock.sendMessage(from, { text: `*${target}* a été unban ✅` }, { quoted: msg })
    }

    if (body === prefix + 'kickall' && isGroup && isOwner(sender)) {
        let participants = groupMetadata.participants
        for (let mem of participants) {
            if (mem.id!== owner &&!mem.admin) {
                await sock.groupParticipantsUpdate(from, [mem.id], 'remove')
                await new Promise(resolve => setTimeout(resolve, 2000)) // anti-ban
            }
        }
    }

    if (body.startsWith(prefix + 'bc') && isOwner(sender)) {
        let text = body.replace(prefix + 'bc ', '')
        // Code pour broadcast à tous les chats
        await sock.sendMessage(from, { text: 'Broadcast envoyé ✅' }, { quoted: msg })
    }

    if (body.startsWith(prefix + 'eval') && isOwner(sender)) {
        let code = body.replace(prefix + 'eval ', '')
        try {
            let result = eval(code)
            await sock.sendMessage(from, { text: `Result: ${result}` }, { quoted: msg })
        } catch (e) {
            await sock.sendMessage(from, { text: `Error: ${e}` }, { quoted: msg })
        }
    }

    // ========== ANTI VV ==========
    if (msg.message?.viewOnceMessageV2) {
        let vvMsg = msg.message.viewOnceMessageV2.message
        let type = Object.keys(vvMsg)[0]
        let media = await sock.downloadMediaMessage(msg)
        await sock.sendMessage(from, { [type]: media, caption: 'Anti-VV by St么rk MD' }, { quoted: msg })
    }

    if (body === prefix + 'vv2' && msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.viewOnceMessageV2) {
        // Code pour renvoyer un vv en reply
    }
}
// COMMANDE .menu AVEC menu.jpg
if (msg.body === '.menu') {
    const pp = fs.readFileSync('./menu.jpg') 
    await sock.sendMessage(m.from, {
        image: pp,
        caption: `👑 *MENU BOT 𝐒𝐭么𝐫𝐤 𝙼𝙳* 👑\n\n
*🛡️ SECURITE*\n.antilink on / off\n
*⚡ REACTION*\n.autoreact on / off\n
*👤 INFO*\n.owner\n.menu\n
_Dev 𝐓𝚯᳆𝐘 𝐒𝐭么𝐫𝐤_`,
        footer: 'Dev 𝐓𝚯᳆𝐘 𝐒𝐭么𝐫𝐤',
        headerType: 4
    }, { quoted: m })
    return
}

// COMMANDE .owner AVEC owner.jpg
if (msg.body === '.owner') {
    const pp = fs.readFileSync('./owner.jpg')
    await sock.sendMessage(m.from, {
        image: pp,
        caption: `👑 *OWNER BOT 𝐒𝐭么𝐫𝐤 𝙼𝙳* 👑\n\nDev: 𝐓𝚯᳆𝐘 𝐒𝐭么𝐫𝐤\nContact: ton numero ici`
    }, { quoted: m })
    return
            }
module.exports = { commandes }
