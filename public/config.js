/*
 * PERSONALIZE YOUR SURPRISE HERE — no coding experience required!
 * Change only the words inside the quotation marks.
 * Avoid putting private information here: everything is public on your website.
 * After editing this file on GitHub, Railway automatically redeploys.
 */
window.BIRTHDAY_CONFIG = {
  recipientName: "Birthday Girl",
  fromName: "Someone who adores you",
  introLine: "I made you a little corner of the universe.",
  wishInstruction: "Close your eyes, think of something beautiful, and make a wish.",
  letterTitle: "For a very special you",
  letterParagraphs: [
    "Today is about celebrating you — your kindness, your laughter, your little quirks, and everything that makes you wonderfully you.",
    "I hope this new chapter brings you more late-night laughs, more beautiful adventures, and more reasons to smile than you can count.",
    "You deserve every good thing the universe has to offer. Never forget how loved and appreciated you are."
  ],
  giftTitle: "One more little surprise...",
  giftMessage: "This is your official reminder: the best moments of your story are still ahead. And I hope I get to cheer you on through all of them. 💗",
  reasons: [
    { front: "Your smile", back: "It makes ordinary moments feel like magic." },
    { front: "Your heart", back: "The way you care for people is a gift all its own." },
    { front: "Just being you", back: "The world is genuinely better with you in it." }
  ],
  // MUSIC: Put your MP3 or M4A in public/music/. Leave musicUrl blank to use the built-in melody.
  // Tap the music icon to start/stop. musicStartOnOpen tries to play when she taps "Open your surprise".
  musicUrl: "",  // Example: "/music/our-song.mp3"
  musicVolume: 0.35, // 0 (silent) to 1 (full volume); start gentle on phones
  musicLoop: true,
  musicStartOnOpen: false,

  // PHOTO GALLERY: Put photos into public/photos/ and list them here, in your chosen order.
  // The gallery appears AFTER she blows out the candle and reads the letter.
  galleryTitle: "A few moments I treasure",
  galleryPhotos: [
    // { src: "/photos/photo-1.jpg", caption: "That day I couldn't stop smiling ♡" },
    // { src: "/photos/photo-2.jpg", caption: "A beautiful little memory" }
  ],

  // PHOTO BOMB: 4 or 5 pictures burst across her screen when she taps the bottom surprise.
  // Leave this empty to automatically use the FIRST FIVE galleryPhotos above.
  // Until you upload photos, five clearly labeled placeholder cards appear.
  photoBurstPhotos: [
    // { src: "/photos/photo-1.jpg", caption: "A day worth remembering ♡" },
    // { src: "/photos/photo-2.jpg", caption: "You and your beautiful smile" },
    // { src: "/photos/photo-3.jpg", caption: "Our favorite moment" },
    // { src: "/photos/photo-4.jpg", caption: "A little adventure" },
    // { src: "/photos/photo-5.jpg", caption: "Here's to many more" }
  ],
  // Older photoUrl is also supported as a fallback first photo (optional).
  photoUrl: "",
  photoCaption: "A moment worth keeping forever ♡"
};
