#!/usr/bin/env node

const getCryptoPrice = require('../index');
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
        console.error('Error fetching the crypto price:', error.message);
        return null;
    }
}

async function fetchPrice() {
    const args = process.argv.slice(2);
    const ticker = args[0];
    const currency = args[1] || 'usd';

    if (!ticker) {
        console.error('Please provide a cryptocurrency ticker');
        process.exit(1);
    }

    const price = await getCryptoPrice(ticker, currency);
    if (price !== null) {
        console.log(`The current price of ${ticker} in ${currency} is ${price}`);
    } else {
        console.error('Failed to fetch the price');
    }
}

fetchPrice();
