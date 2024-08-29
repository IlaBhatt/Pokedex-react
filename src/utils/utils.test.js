import { getBgColor } from "./utils";

const colorMap = {
    'fire': '#EDC2C4',
    'water': '#CBD5ED',
    'grass': '#C0D4C8'
};

describe('getBgColor', () => {
    it("returns correct background for single type", () => {
        const pokemonDetails = {
            types: [ { type: {name: 'fire'}} ]
        };
        const style = getBgColor(pokemonDetails);
        expect(style).toEqual({background: '#EDC2C4'});
    })

    it('returns a linear-gradient for multiple types', () => {
        const pokemonDetails = {
            types: [{ type: { name: 'fire' } }, { type: { name: 'water' } }]
        };
        const style = getBgColor(pokemonDetails);
        expect(style).toEqual({ background: 'linear-gradient(#EDC2C4, #CBD5ED)' });
    });

    it('handles empty types', () => {
        const pokemonDetails = { types: [] };
        const style = getBgColor(pokemonDetails);
        expect(style).toEqual({ background: undefined });
    });
})