const axios = require("axios");

const asyncWait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Récupère le contenu HTML d'une page Sofifa rapidement via axios.
 * Réessaie jusqu’à 5 fois en cas d’échec réseau (403, 500, etc).
 * @param {string} url
 * @returns {Promise<string>} HTML de la page
 */
const getPageContentLite = async (url) => {
    let attempts = 5;
    let lastError = null;

    while (attempts > 0) {
        try {
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://sofifa.com/",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
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

// ✅ Export standard pour être utilisé dans parser-lite.js
module.exports = {
    getPageContent: getPageContentLite
};
