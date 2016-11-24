import { generateID } from '../generateID';

describe('generateID()', () => {
    it('should generate unique IDs', () => {
        const test: string[] = [];
        for (let i = 0; i < 50; i++) {
            test.push(generateID());
        }
        expect(Array.from(new Set(test)).length).toBe(50);
    });
});
