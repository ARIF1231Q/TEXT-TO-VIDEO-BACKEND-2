require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

app.post('/api/text-to-speech', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      { text },
      {
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );
    const audioPath = path.join(__dirname, 'audio', `${Date.now()}.mp3`);
    fs.writeFileSync(audioPath, response.data);
    res.json({ audioPath });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).send('Error generating speech');
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
