import { helloWorld } from '../src/helloWorld';

describe('helloWorld', () => {
    it('should return "Hello, World!"', () => {
        expect(helloWorld()).toBe('Hello, World!');
    });
});