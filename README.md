# Happy Birthday, Ela ♡ — Railway Birthday Surprise Website

A romantic, mobile- and iPad-friendly interactive birthday website for **Ela**, ready to deploy on Railway. It includes the envelope invitation, realistic canvas candle flame positioned at the wick, microphone/tap/swipe candle blowing, a love letter, three cards, an optional photo gallery, and a 4–5-photo bomb that bursts into polaroid cards. Music plays from a file **you upload to your own GitHub repository**; Spotify and its embed have been removed.

No Node.js installation on your PC, API keys, database, or Railway environment variables are needed. Railway builds with the included `Dockerfile`.

## iPad Air 11-inch M2 support ✨

The same URL now adapts to **Ela's 11-inch iPad Air (6th generation, M2)** in both orientations. This includes its typical **820 × 1180 CSS-pixel portrait viewport** and **1180 × 820 landscape viewport**. Portrait uses a larger centered cake and letter; landscape shows a two-column invitation, a compact candle scene, and a roomy photo explosion. The candle flame remains attached to its wick because the candle and the flame are one scaled group.

The photo-bomb card layout recalculates after an iPad rotation or Split View resize; photos remain tappable and can be opened full-screen. Safari/iPadOS microphone permission and autoplay policies still apply: tap **Open your love letter** to start the song, and allow the microphone or use **Tap to blow**.

Tip: On Ela's iPad, test once in portrait, rotate to landscape, and try the photo bomb in both positions. To force a fresh version after uploading the ZIP, reload the website once (the CSS and scripts have updated version parameters).

## 1. Upload the music to GitHub (no code changes needed) 🎵

The music player is **already configured** to play `public/music/our-song.mp3`.

1. Prepare an MP3 file you have permission to host publicly. Rename it exactly **`our-song.mp3`** (lowercase; filename and extension matter).
2. Open your website's GitHub repository, then the `public` → `music` folder. The included `README.txt` keeps this folder in the repo until you upload the song.
3. Select **Add file** → **Upload files** and select `our-song.mp3`.
4. Select **Commit changes**. Railway automatically redeploys if connected to GitHub with auto-deploy enabled.
5. When Railway finishes deploying, visit `https://YOUR-RAILWAY-DOMAIN/music/our-song.mp3` in your phone browser. If it opens/plays the file instead of returning `Not Found`, the file is in the correct location.
6. Reopen the birthday website and tap the little **Play** record, or tap **Open your love letter**. She can also pause/play from the top-right music button.

**You do not have to edit `config.js` for an MP3.** The song dedication is already titled **“To the Bone” by Pamungkas**. You supply the audio file; the original copyrighted recording is **not included** in the download. Only upload a file you're authorized to distribute on your public website.

**Using M4A instead of MP3?** Upload `our-song.m4a`, then change just this line in `public/config.js`:

```js
musicUrl: "/music/our-song.m4a",
```

**Changing the song name or artist?** Edit `songTitle` and `songArtist` in `public/config.js`.

### Music behavior on mobile

- Mobile browsers prevent unprompted autoplay. The player starts after she taps **Open your love letter** (or the song Play control), not just from opening the link.
- It loops and uses a preset 38% volume; set `musicVolume` between `0` and `1` in `config.js` if you'd like.
- When she activates the microphone to blow out the candle, playback pauses to avoid false microphone readings and attempts to resume after she makes her wish. If the browser blocks resuming, she can tap Play.
- If the music file is not uploaded yet or is misspelled, the site still works; it just shows a gentle missing-music notice rather than trying Spotify.

## 2. Ela's birthday message 💌

Already set in `public/config.js`:

```js
recipientName: "Ela",
letterTitle: "To my Ela, my favorite person",
```

You can change your signature (`fromName`), the 3 `letterParagraphs`, the 3 reasons, and the ending message in that same file. Changes you commit on GitHub redeploy with Railway.

## 3. Add 4–5 of your photos 📷

Upload `photo-1.jpg` through `photo-5.jpg` to `public/photos/` on GitHub. Use JPG, PNG, or WebP, ideally under 1.5 MB per picture so her phone loads them quickly. Convert HEIC photos to JPG or WebP first.

Then edit this section of `public/config.js`:

```js
galleryPhotos: [
  { src: "/photos/photo-1.jpg", caption: "Our first little adventure ♡" },
  { src: "/photos/photo-2.jpg", caption: "One of my favorite smiles" },
  { src: "/photos/photo-3.jpg", caption: "A day I'll remember forever" },
  { src: "/photos/photo-4.jpg", caption: "Every day is sweeter with you" },
  { src: "/photos/photo-5.jpg", caption: "More memories to come ♡" }
],
photoBurstPhotos: [],
```

The photo bomb automatically takes the first **four or five** gallery photos. If you want a different set, list them under `photoBurstPhotos` instead. Before you upload photos, the explosion will show five clearly marked placeholders rather than fake photos.

Photos are public to anyone with the website's link. Don't include private or sensitive photos if you don't want others to see them.

**Updating an existing repo?** Keep your previously uploaded `public/music/our-song.mp3` and `public/photos/` image files when replacing the website code. The ZIP deliberately does not include your private photo/music assets; it will not recreate them if you delete them from GitHub.

## 4. Deploy to Railway 🚀

1. Extract the ZIP file. Upload the **contents of its project folder** to your existing GitHub repository, keeping the `public/` directory and putting `Dockerfile`, `package.json`, `railway.json`, and `server.js` in the repo's root (not in a nested folder).
2. Commit the change. In Railway, deploy the repo if it isn't connected already; otherwise auto-deploy picks up the changes.
3. In Railway service Networking, generate an HTTPS public domain if necessary.
4. Check the site on your own phone. To allow microphone use, open the HTTPS link in Safari/Chrome rather than an in-app browser that may block microphone access.
5. Upload the music file whenever you have it and commit; Railway will deploy again. No separate server configuration is required.

## Troubleshooting

- **No music?** Confirm the address `https://YOUR-RAILWAY-DOMAIN/music/our-song.mp3` serves the song. Check exact spelling, `public/music/` location, and Railway deployment status. Refresh the website after deployment and tap Play. iPhone silent-mode/volume levels may need adjusting.
- **Music stops when using microphone?** That's intentional so the microphone can detect breath. Tap the top-right Play button if it doesn't resume automatically.
- **Song title says Pamungkas but another track plays?** The file you uploaded is what's played. Replace it with your authorized audio recording.
- **No pictures?** Upload photos and set `galleryPhotos` in `public/config.js`; the bomb uses those files automatically.
- **Candle microphone not working?** Use the Railway HTTPS URL; permit microphone access. Tap or swipe is always available as a fallback.
- **Railway returns an error?** Visit `/health` on your domain. It should return `{"ok":true,"app":"birthday-surprise"}`.

## Folder layout

```text
birthday-surprise-ela-railway/
├── Dockerfile
├── railway.json
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── config.js             ← Ela, music path, photos, messages
    ├── app.js
    ├── effects.js
    ├── styles.css
    ├── favicon.svg
    ├── music/
    │   ├── README.txt
    │   └── our-song.mp3       ← YOU UPLOAD THIS TO GITHUB
    └── photos/
        ├── README.txt
        └── photo-1.jpg       ← YOUR PHOTOS
```
