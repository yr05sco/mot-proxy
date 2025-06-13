const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.get('/mot/:reg', async (req, res) => {
  const reg = req.params.reg;
  try {
    const tokenRes = await axios.post(process.env.TOKEN_URL, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE_URL,
    }));

    const token = tokenRes.data.access_token;

    const motRes = await axios.get(`https://api.dvsa.gov.uk/mot-history/${reg}`, {
      headers: {
        'x-api-key': process.env.API_KEY,
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    res.json(motRes.data);
  } catch (err) {
    console.error('DVLA API error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch MOT data' });
  }
});

app.get('/', (req, res) => {
  res.send('DVLA Proxy is running.');
});

app.listen(PORT, () => {
  console.log('DVLA Proxy running on port', PORT);
});
