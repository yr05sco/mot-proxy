const express = require('express');
const axios = require('axios');
const app = express();

const DVLA_API_KEY = process.env.DVLA_API_KEY;

app.get('/mot/:reg', async (req, res) => {
  const { reg } = req.params;

  try {
    const response = await axios.get(`https://beta.check-mot.service.gov.uk/trade/vehicles/mot-tests?registration=${reg}`, {
      headers: {
        'x-api-key': DVLA_API_KEY,
        'Accept': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch MOT data' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy server running on port ${port}`));
