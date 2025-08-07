const axios = require("axios");

const asyncWait = ms => new Promise(resolve => setTimeout(resolve, ms));

const getPageContentLite = async (url) => {
    let attempts = 5;
    let lastError = null;
    while (attempts > 0) {
        try {
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://sofifa.com/"
            };

            const response = await axios.get(url, { headers });
            return response.data;
        } catch (err) {
            lastError = err;
            console.log(`Retrying... attempt=${attempts}, error=${err.message}`);
            await asyncWait(1000);
            attempts--;
        }
    }
    throw new Error(`Error fetching page ${url}: ${lastError?.message}`);
};

module.exports = {
    getPageContentLite
};
