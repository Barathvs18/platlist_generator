import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

const app = express();
app.use(cors());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Get access token from Spotify
async function authorizeSpotify() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("✅ Spotify authorized.");
  } catch (err) {
    console.error("❌ Failed to authorize Spotify:", err);
  }
}
authorizeSpotify();

const moodMap = {
  "😊": "feel-good tamil",
  "😭": "sad tamil",
  "😍": "romantic tamil",
  "😎": "mass tamil hits",
  "💔": "breakup tamil",
  "🕺": "party tamil",
  "🤩": "latest tamil hits",
  "😴": "relax tamil",
  "🤯": "motivational tamil",
  "🥳": "celebration tamil",
  "😡": "anger tamil",
  "😇": "peace tamil",
  "😜": "funny tamil",
  "🤗": "warm tamil",
  "😢": "emotional tamil",
  "🤤": "chill tamil",
  "🙃": "casual tamil",
  "😤": "rage tamil",
  "😌": "soothing tamil",
  "😋": "energetic tamil"
};

app.get("/playlist/:emoji", async (req, res) => {
  const emoji = req.params.emoji;
  const query = moodMap[emoji];

  if (!query) {
    return res.status(400).json({ message: "Invalid emoji/mood." });
  }

  try {
    const result = await spotifyApi.searchPlaylists(query + " songs", { limit: 1 });
    const playlist = result.body.playlists.items[0];

    res.json({
      name: playlist.name,
      url: playlist.external_urls.spotify,
      image: playlist.images[0]?.url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Spotify search failed." });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
