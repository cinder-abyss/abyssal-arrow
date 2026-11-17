/*
 * PERSONALIZE YOUR SURPRISE HERE — no coding experience required!
 * Change only the words inside the quotation marks.
 * Avoid putting private information here: everything is public on your website.
 * After editing this file on GitHub, Railway automatically redeploys.
 */
window.BIRTHDAY_CONFIG = {
  recipientName: "Ela",
  fromName: "Zel",
  introLine: "Ela, you make every ordinary day feel magical. I made this little surprise just for you. ♡",
  wishInstruction: "Close those pretty eyes, make a wish, and let me make your day a little sweeter.",
  letterTitle: "To my Noela, my favorite person",
  letterParagraphs: [
    "Happy birthday, Noela, my love. Today is for celebrating the girl who makes the ordinary days feel like the ones I never want to forget. Your smile, your laugh, the way you are so beautifully you — I fall a little harder for all of it.",
    "I wish I could wrap every beautiful thing in the world and give it to you today. Until then, I hope this tiny surprise makes you smile and reminds you just how loved you are.",
    "More than anything, I hope we get to make a thousand more memories, celebrate a thousand more little wins, and hold onto each other through every new chapter. I love you. ♡"
  ],
  giftTitle: "My favorite memory is us ♡",
  giftMessage: "If I could choose one gift for the rest of my life, it would be more days with you. Happy birthday, baby. I choose you — today and every day. 💗",
  reasons: [
    { front: "Your smile", back: "It is still my favorite view in the whole world." },
    { front: "Your heart", back: "You love so beautifully, and I feel lucky to be loved by you." },
    { front: "Every little thing", back: "Even the smallest moments feel like home with you." }
  ],
  // OUR SONG — Upload your own audio file to the GitHub repo at:
  // public/music/our-song.mp3  (lowercase, exactly this filename)
  // This path is ready to use immediately after the file is uploaded and Railway redeploys.
  // Do not paste a Spotify/YouTube webpage link here.
  // If using an M4A file instead, upload "our-song.m4a" and change the path below.
  // Only host music you have permission to share online.
  songTitle: "To the Bone",
  songArtist: "Pamungkas",
  musicUrl: "/music/our-song.mp3",
  musicVolume: 0.40, // 0 (silent) to 1 (full volume)
  musicLoop: true,
  musicStartOnOpen: true, // Begin on the Open your love letter tap (mobile-friendly).

  // PHOTO BOMB PHOTOS: Put photo-1 through photo-10 into public/photos/.
  // All ten appear ONLY when the surprise photo bomb is tapped, in two waves of five.
  // The separate gallery section is hidden on all devices.
  galleryTitle: "Every little moment with you",
  galleryPhotos: [
    { src: "/photos/photo-1.jpg", caption: "My beautiful Wife ♡" },
    { src: "/photos/photo-2.jpg", caption: "A beautiful little memory" },
    { src: "/photos/photo-3.jpeg", caption: "My little Princess -- so cute!" },
    { src: "/photos/photo-4.jpg", caption: "Yieee Graduatinggg...." },
    { src: "/photos/photo-5.jpg", caption: "invisible Thread Theory?" },
    { src: "/photos/photo-6.jpg", caption: "Another memory with you ♡" },
    { src: "/photos/photo-7.jpg", caption: "Our little story continues ♡" },
    { src: "/photos/photo-8.jpg", caption: "A moment worth keeping ♡" },
    { src: "/photos/photo-9.jpg", caption: "One more reason to smile ♡" },
    { src: "/photos/photo-10.jpg", caption: "More memories with you ♡" }
  ],

  // PHOTO BOMB: photos 1–5 burst first, then tap Next 5 to see photos 6–10.
  // Leave this empty to use ALL TEN galleryPhotos above, including their captions.
  // Photos not yet uploaded show a placeholder until you add them on GitHub.
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
