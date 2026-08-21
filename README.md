<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,20&height=280&section=header&text=Dev%20%F0%9D%90%93%F0%9D%90%AE%F0%9D%90%AE%F0%9D%90%98%20%20%F0%9D%90%92%F0%9D%90%AD么%F0%9D%90%AB%F0%9D%90%A4&fontSize=45&fontColor=ffffff&animation=twinkling&fontAlignY=40"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=25&duration=2000&pause=1000&color=FF0000;0000FF&center=true&vCenter=true&width=600&lines=Bienvenue+chez+%F0%9D%90%93%F0%9D%90%AE%F0%9D%90%AE%F0%9D%90%98%20%20%F0%9D%90%92%F0%9D%90%AD么%F0%9D%90%AB%F0%9D%90%A4" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=35&duration=1500&pause=0&color=FF0000&center=true&vCenter=true&width=500&height=70&lines=Bot+%F0%9D%90%92%F0%9D%90%AD么%F0%9D%90%AB%F0%9D%90%A4+%F0%9D%99%BC%F0%9D%99%BD" />
</p># Bot St么rk MD 🤖
[[Deploy to Render] (https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/botstark241-lang/-)

Bot WhatsApp Multi-Device basé sur Baileys. Mode Pairing Code.
Bot WhatsApp Multi-Device basé sur Baileys. Mode Pairing Code.

## Fonctionnalités
- Réponses auto
- Stickers 
- Mode Private/Public
- Pairing Code sans QR

## Déploiement sur Render - Méthode Docker

### 1. Fork ce repo
Clique sur "Fork" en haut à droite

### 2. Créer un Web Service sur Render
1.  Va sur https://render.com et connecte ton GitHub
2.  Clique `New +` → `Web Service`
3.  Connecte ton repo `Bot-Stark-MD`
4.  Dans `Runtime` choisi `Docker`
5.  Dans `Instance Type` choisi `Free`

### 3. Ajouter le Disk pour la session
1.  Dans Render va dans `Disk`
2.  Clique `Add Disk`
3.  Name: `session`
4.  Mount Path: `/app/session`
5.  Size: `1GB`

### 4. Ajouter les Variables d'environnement
Dans `Environment` ajoute ces variables :

| Clé | Valeur | Exemple |
| --- | --- | --- |
| `PREFIXE` | `.` |  |
| `NOM_OWNER` | Ton nom | `T𝚯᳆𝐘 𝐒𝐭么𝐫𝐤` |
| `NUMERO_OWNER` | Ton numéro avec indicatif | `24102767750` |
| `MODE` | `private` ou `public` | `private` |
| `SESSION_ID` | Laisse vide |  |
| `STICKER_PACK_NAME` | Nom pack sticker | `C-ICE SERVICE` |
| `STICKER_AUTHOR_NAME` | Ton nom | `T𝚯᳆𝐘 𝐒𝐭么𝐫𝐤` |
| `NOM_BOT` | Nom du bot | `Bot St么rk MD` |

Clique `Create Web Service`

### 5. Récupérer le Pairing Code
1.  Attends que le déploiement finisse
2.  Va dans `Logs`
3.  Le bot va afficher: `Entrez ce code sur WhatsApp: XXX-XXX`
4.  Ouvre WhatsApp → Appareils liés → Lier un appareil → Entrez le code

Le bot est en ligne 24/24 ✅

## Installation en Local
```bash
git clone https://github.com/botstark241-lang/-
cd -
npm install
node index.js
