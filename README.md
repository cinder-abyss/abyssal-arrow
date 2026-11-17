# A Little Magic — Birthday Website (Candle + Photo Bomb) 🎂

A mobile-first surprise website ready for Railway. She opens the invitation, blows out a natural flickering candle (microphone, swipe, or tap), reads a birthday letter, flips three cards, views optional photo memories, and finally **taps a cute photo bomb** to send **4–5 polaroid pictures flying across her screen**. Each polaroid can be opened full-screen, swiped, and closed. A personal closing message appears beneath the photo bomb afterward.

No database, API keys, extra JavaScript libraries, local Node installation, or build step needed. Railway uses the included `Dockerfile`.

## 1. Personalize the birthday message

Open `public/config.js` (you can edit it directly on GitHub). Change:

```js
recipientName: "Her nickname",
fromName: "Your name",
introLine: "I made you a little corner of the universe.",
```

Edit `letterTitle`, the three `letterParagraphs`, the three `reasons`, `giftTitle` and `giftMessage` too. The gift title and message now show in a closing card after the photo explosion.

## 2. Upload her photos 📷

Place **four or five** JPG, PNG, or WebP photos in `public/photos/` and give them simple names (e.g. `photo-1.jpg` through `photo-5.jpg`). Recommend 500 KB–1.5 MB per photo for fast mobile loads. Convert iPhone HEIC files to JPEG first.

Then list them in `public/config.js` under `galleryPhotos`:

```js
galleryTitle: "Our favorite memories",
galleryPhotos: [
  { src: "/photos/photo-1.jpg", caption: "That unforgettable day ♡" },
  { src: "/photos/photo-2.jpg", caption: "One of my favorite smiles" },
  { src: "/photos/photo-3.jpg", caption: "Our happy little adventure" },
  { src: "/photos/photo-4.jpg", caption: "You make moments magical" },
  { src: "/photos/photo-5.jpg", caption: "Here's to more memories" }
],
photoBurstPhotos: [],
```

**How the photo bomb picks photos:** With `photoBurstPhotos: []` it automatically uses the **first five** `galleryPhotos` (four if you supplied only four). For a different sequence, fill `photoBurstPhotos` with four or five `{ src, caption }` entries in the same format. All photographs are bundled into the deployed website rather than uploaded by the person visiting it.

**No photos uploaded yet?** The effect still works: five beautiful cards labeled `YOUR PHOTO HERE` burst across the phone screen. They are intentionally placeholders; they will not show a fake photo of your loved one. If any file is missing or mistyped, that card also shows a placeholder instead of a broken image.

**Privacy:** Anyone with the website's public link may view its photos and `config.js`. Avoid uploading sensitive or confidential photographs or data.

## 3. Add a song 🎵

Place a legally shareable MP3 or M4A file in `public/music/`, e.g. `public/music/our-song.mp3`, then configure:

```js
musicUrl: "/music/our-song.mp3",
musicVolume: 0.35,
musicLoop: true,
musicStartOnOpen: true,
```

The top-right music button turns music on/off. The website pauses music while listening to microphone input and tries to restart it after the candle is extinguished. On iPhone/Android, sound may need to be started by tapping the music button because phone browsers block unsolicited autoplay. Leave `musicUrl: ""` for the built-in original gentle melody (no song file required).

## 4. Deploy with Railway (without Node.js on your PC) 🚀

1. Extract the ZIP and make a **private** repository at https://github.com/new.
2. On GitHub use **Add file → Upload files** to upload the extracted project contents, preserving the `public/` folder. `Dockerfile`, `package.json`, `server.js`, and `railway.json` must be at the repository root.
3. Go to https://railway.com/new → **Deploy from GitHub repo**, select the repo, and deploy.
4. In the service's settings generate a public HTTPS domain (Networking → Generate Domain).
5. Test the link on your own phone, then send it to her. For microphone access, open the HTTPS link in Safari/Chrome if a Messenger in-app browser blocks microphone requests.

No Railway environment variables are required. Changes committed to GitHub trigger a redeploy when autodeploy is enabled.

## How the effects work

- The flame is **canvas-rendered**, not a static GIF: warmer moving outer edges, amber inner layer, white-hot central wick glow, gentle turbulent flicker and a soft halo. It bends briefly during microphone blowing and vanishes with a smoke wisp after she extinguishes the candle. To save battery, it animates at approximately 30 FPS only while the cake scene is visible. Reduced Motion accessibility settings show a stable flame.
- The photo bomb is the pink heart-topped orb near the bottom of the page. When tapped, **four or five** polaroids launch outward from the tapped position and settle across the screen; tap any image to enlarge it, swipe or use arrows to browse, tap Back or ✕ to dismiss. The effect works with the phone held vertically and on small screens and desktops.
- The photo-gallery section still works if you list `galleryPhotos`. It appears above the bomb and supports swipes, arrows, and page indicators.
- The original microphone detection still runs locally; no microphone audio is recorded, stored, or sent to any server. If microphone permission is denied, **Tap to blow** and swipe still work.
- The greeting, confetti, cards, music, and replay button remain available. Effects honor the browser's reduced-motion preference.

## Troubleshooting

**Photo bomb shows placeholder cards?** Upload four or five photos into `public/photos/` and reference their exact case-sensitive paths in the config file. You can list them under `galleryPhotos` or `photoBurstPhotos`.

**Custom song won't play?** Make sure filename, extension and case match `musicUrl`; tap the music button manually. Avoid Spotify/YouTube streaming links — use an audio file you can legally share.

**Mic won't work?** Use HTTPS, grant permission, and try a gentle breath close to the phone microphone. Use the tap or swipe fallback if noise suppression on the device filters blowing sounds.

**Deploy fails?** Check that `Dockerfile` is at the repository root and the Node server receives Railway's `PORT`. `/health` should respond with `{ "ok": true, ... }`.

## Project structure

```text
birthday-surprise-photo-burst/
├── Dockerfile
├── railway.json
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── config.js          ← Edit texts, photos and music here
    ├── app.js             ← Original birthday interactions
    ├── effects.js         ← Animated candle flame + photo bomb
    ├── styles.css
    ├── favicon.svg
    ├── photos/             ← Add her 4–5 photos here
    └── music/              ← Add your soundtrack here
```
