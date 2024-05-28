const axios = require('axios');

async function getCryptoPrice(ticker, currency = 'usd') {
    try {
        const response = await axios.get(`https://api.pyth.network/v1/price/${ticker}?vs_currency=${currency}`);
        if (response.data.price) {
            return response.data.price;
        } else {
            throw new Error(`Ticker ${ticker} not found`);
        }
    } catch (error) {
        if (error.message.includes('Ticker')) {
            throw error;  // Re-throw the error if it was due to an invalid ticker
        }
        console.error('Error fetching the crypto price:', error.message);
        return null;
    }
}

module.exports = getCryptoPrice;
