const cheerio = require('cheerio');
const { getPageContent } = require('./scraper-lite');
const { formatDate } = require('./../utils/formatDate');

async function getPlayerDetailsCsvRow(url) {
    const html = await getPageContent(url);
    const $ = cheerio.load(html);

    const player_id = url.split('/')[4];
    const name = $('title').text().split(' FC ')[0] || '';
    const full_name = $('h1').first().text() || '';
    const description = $('meta[name=description]').attr('content') || '';
    const image = $('.profile img').attr('data-src') || '';

    const profileText = $('.profile p').text();
    const dobMatch = profileText.match(/\((.*?)\)/);
    const dob = dobMatch ? formatDate(dobMatch[1]) : '';

    const heightMatch = profileText.match(/(\d+)cm/);
    const height_cm = heightMatch ? heightMatch[1] : '';

    const weightMatch = profileText.match(/(\d+)kg/);
    const weight_kg = weightMatch ? weightMatch[1] : '';

    const position = $('.profile p span').map((i, el) => $(el).text()).get().join(',');

    // Pour gagner du temps, on ne scrape que les colonnes minimales
    const overall_rating = $('.grid .col em').eq(0).text() || '';
    const potential = $('.grid .col em').eq(1).text() || '';
    const value = $('.grid .col em').eq(2).text() || '';
    const wage = $('.grid .col em').eq(3).text() || '';

    const row = [
        player_id,
        '', // version
        name,
        full_name,
        description,
        image,
        height_cm,
        weight_kg,
        dob,
        position,
        overall_rating,
        potential,
        value,
        wage
    ].map(col => col.includes('"') ? col.replace(/"/g, '""') : col);

    return `"${row.join('","')}"`;
}

module.exports = { getPlayerDetailsCsvRow };
