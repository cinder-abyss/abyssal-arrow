# A Little Magic — Interactive Birthday Surprise 🎂

A complete, **mobile-first** interactive birthday website. The recipient opens an envelope, makes a wish, blows out a candle with her **phone microphone** (or taps/swipes instead), then discovers a birthday letter, three flip cards, and a wrapped digital gift. Includes optional original soft music and lightweight confetti.

**No database, API key, paid asset, local Node installation, or build step is required.** Railway will run the included Dockerfile.

## 🩷 STEP 1 — Personalize the website (IMPORTANT)

Open **`public/config.js`** in any text editor. You can also edit it directly on GitHub, without installing anything.

```js
recipientName: "Her name or nickname",
fromName: "Your name",
introLine: "I made you a little corner of the universe.",
```

Change the three `letterParagraphs`, the `giftMessage` and the three `reasons` as much as you like. **Only change the text inside quotes.** Keep quotes, commas and brackets in place. Special characters and emoji are welcome.

### Optional photo
1. Add a compressed JPG, PNG, or WebP photo to `public/photos/`, e.g. `public/photos/us.jpg`.
2. Set `photoUrl: "/photos/us.jpg"` in `public/config.js`.
3. Edit `photoCaption`. The photo appears inside the final gift after it is unwrapped.

If no photo is provided, the gift reveals a beautifully styled secret message instead.

**Privacy:** This website is publicly accessible to anyone with the link. Do not put secrets, private identifiers, passwords, or confidential details in config.js or photos. Anyone can view the public page's source.

## 🚀 STEP 2 — Deploy to Railway without Node on your PC

1. Extract this ZIP. Go to **[github.com/new](https://github.com/new)** and create a new GitHub repository, preferably **private**.
2. In that new repo on GitHub, choose **Add file → Upload files**. Drag **all project files and folders** from the extracted `birthday-surprise-railway` folder into the uploader, preserving their directory structure. Alternatively use GitHub Desktop or Git. Commit your files. Make sure `Dockerfile`, `server.js`, `package.json`, `railway.json` and the `public` folder are at the repository root — NOT inside another folder.
3. Go to **[railway.com/new](https://railway.com/new)** → **Deploy from GitHub repo** and select that repository. (Authorize GitHub if asked.)
4. Railway detects the `Dockerfile`, builds the container and starts your site automatically. **No environment variables are needed.**
5. Open your Railway service → **Settings → Networking → Generate Domain** (wording may differ slightly). The public URL is HTTPS, e.g. `https://my-birthday-site.up.railway.app`.
6. Test the URL on your own phone, including microphone permission, **before sending it** to her.
7. Send the **HTTPS link** in Messenger, WhatsApp or text. For the most reliable mic experience, she should open it directly in Safari or Chrome; embedded in-app browsers sometimes limit microphone access. The tap option always works.

### Updating a deployed website
Edit `public/config.js` on GitHub and commit. Railway will redeploy (if autodeploy is enabled). No need to install Node locally.

### Quick test with Node (optional, not required)

```bash
npm start
```

Visit http://localhost:3000 and http://localhost:3000/health.

## 🎁 Features

- Responsive layout for narrow iPhones, Android phones, and desktops.
- Interactive invitation + CSS-illustrated layered birthday cake.
- Candle blow detection via **getUserMedia** + Web Audio analysis: permission asked only when she taps the microphone button. Blow a short, sustained breath into the phone mic. Ambient noise varies, so tap/swipe is always an alternative.
- Swiping horizontally across the cake also blows the candle out; tap fallback requires **no microphone permission**.
- Microphone audio is analyzed **locally in the browser**, never recorded, uploaded or stored. Microphone tracks are stopped on success, when you stop listening, on page hide, and when leaving.
- Personalized letter and message, three touch-friendly flip cards, and a tap-to-unwrap gift.
- Optional custom photo and an **original synthesized** music loop (opt-in, off by default).
- Short confetti celebration, respects **Reduce Motion** settings.
- No third-party JS or database; optional online Google Fonts gracefully fall back to system fonts.
- `/health` endpoint for Railway health checks, public content served by a tiny built-in Node server.

## 🛠 Troubleshooting

**Microphone doesn't detect a blow?** Make sure she's on the **HTTPS** public domain, has granted microphone permission, and blows close to the phone's bottom microphone. Different phones suppress wind or noise differently. **Tap to blow** or **swipe across the cake** will work regardless.

**Microphone isn't showing in a messenger app?** Open the public HTTPS link in Safari or Chrome. Some embedded browsers don't provide microphone access.

**Railway deploy failed?** Make sure `Dockerfile` is at the repo root, GitHub is connected, the source uses the correct repo, and Railway logs show the Docker build. The server listens to Railway's `$PORT` on `0.0.0.0`.

**Blank page?** Open Browser DevTools Console and confirm the project has `public/app.js`, `public/styles.css`, and `public/config.js`.

**Want different colors?** Edit the CSS variables at the top of `public/styles.css`.

## File structure

```text
birthday-surprise-railway/
├── Dockerfile
├── railway.json
├── package.json
├── server.js
├── README.md
└── public/
    ├── index.html
    ├── config.js       ← Personalize this file
    ├── app.js
    ├── styles.css
    ├── favicon.svg
    └── photos/
        └── README.txt
```

Made to be sweet, not complicated. ♡
