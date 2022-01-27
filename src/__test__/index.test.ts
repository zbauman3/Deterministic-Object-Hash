import deterministicHash from "../index";
import * as crypto from "crypto";

const createHashSpy = jest.spyOn(crypto, 'createHash');

beforeEach(()=>{
	createHashSpy.mockClear();
});

test('Similar objects are the same', ()=>{

	const obj1 = {
		a: 'b',
		c: 'd',
		e: 'f',
	};

	const obj2 = {
		c: 'd',
		e: 'f',
		a: 'b',
	};

	expect(
		deterministicHash(obj1)
	).toBe(
		deterministicHash(obj2)
	);

	const arr1 = [obj1, obj2];
	const arr2 = [obj2, obj1];

	expect(
		deterministicHash(arr1)
	).toBe(
		deterministicHash(arr2)
	);

});

test('All types work', ()=>{

	expect(typeof deterministicHash(Symbol('test'))).toBe('string');
	expect(typeof deterministicHash(function(){ console.log({ some: 'thing' }); })).toBe('string');
	expect(typeof deterministicHash(()=>{ console.log({ some: 'thing' }); })).toBe('string');
	expect(typeof deterministicHash(BigInt(1))).toBe('string');
	expect(typeof deterministicHash(false)).toBe('string');
	expect(typeof deterministicHash(123)).toBe('string');
	expect(typeof deterministicHash('123')).toBe('string');
	expect(typeof deterministicHash(undefined)).toBe('string');
	expect(typeof deterministicHash(null)).toBe('string');
	expect(typeof deterministicHash(new Error('test'))).toBe('string');
	expect(typeof deterministicHash(['test'])).toBe('string');
	expect(typeof deterministicHash({test: 'string'})).toBe('string');

});