<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,24&height=250&section=header&text=Bot%20%F0%9D%90%92%F0%9D%90%AD么%F0%9D%90%AB%F0%9D%90%A4%20%F0%9D%99%BC%F0%9D%99%BD&fontSize=42&fontColor=fff&animation=twinkling&fontAlignY=35"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=30&duration=3000&pause=500&color=F00000&center=true&vCenter=true&width=600&lines=TONY+STARK+TECHNOLOGY;Powered+by+Arc+Reactor" />
</p>

<p align="center">
  <img src="https://github.com/ABSphreak/ABSphreak/raw/master/gifs/Hi.gif" width="250"/>
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
