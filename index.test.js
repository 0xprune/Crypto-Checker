const axios = require('axios');
const getCryptoPrice = require('./index');

jest.mock('axios');

describe('getCryptoPrice', () => {
    let consoleErrorSpy;

    beforeAll(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    it('should return the price of a valid crypto ticker', async () => {
        axios.get.mockResolvedValue({
            data: {
                price: 50000
            }
        });

        const price = await getCryptoPrice('bitcoin');
        expect(price).toBe(50000);
    });

    it('should throw an error for an invalid crypto ticker', async () => {
        axios.get.mockResolvedValue({
            data: {}
        });

        await expect(getCryptoPrice('invalidticker')).rejects.toThrow('Ticker invalidticker not found');
    });

    it('should handle network errors gracefully', async () => {
        axios.get.mockRejectedValue(new Error('Network Error'));

        const price = await getCryptoPrice('bitcoin');
        expect(price).toBeNull();
    });

    it('should return the price of another valid crypto ticker', async () => {
        axios.get.mockResolvedValue({
            data: {
                price: 3000
            }
        });

        const price = await getCryptoPrice('ethereum');
        expect(price).toBe(3000);
    });

    it('should handle case sensitivity in ticker names', async () => {
        axios.get.mockResolvedValue({
            data: {
                price: 3000
            }
        });

        const price = await getCryptoPrice('Ethereum');
        expect(price).toBe(3000);
    });

    it('should handle multiple valid tickers', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                price: 50000
            }
        });
        axios.get.mockResolvedValueOnce({
            data: {
                price: 3000
            }
        });

        const btcPrice = await getCryptoPrice('bitcoin');
        const ethPrice = await getCryptoPrice('ethereum');
        expect(btcPrice).toBe(50000);
        expect(ethPrice).toBe(3000);
    });
});
