import deterministicHash, { isPlainObject } from "../index";
import { isEqual as _isEqual } from "lodash";
import crypto from "crypto";

const createHashSpy = jest.spyOn(crypto, 'createHash');

beforeEach(()=>{
	createHashSpy.mockClear();
});

test('isPlainObject', ()=>{

	expect(isPlainObject( {} )).toBe(true);
	expect(isPlainObject( { constructor: 'test' } )).toBe(true);
	expect(isPlainObject( Object(null) )).toBe(true);
	expect(isPlainObject( Object({}) )).toBe(true);
	expect(isPlainObject( Object({ constructor: 'test' }) )).toBe(true);
	expect(isPlainObject( Object.create(null) )).toBe(true);
	expect(isPlainObject( Object.create(Object.prototype) )).toBe(true);
	expect(isPlainObject( { valueOf: 'test' } )).toBe(true);
	
	class Bar{};

	expect(isPlainObject( Object.create({ constructor: 'test' }) )).toBe(false);
	expect(isPlainObject( Object.create({ [Symbol.toStringTag]: 'test' }) )).toBe(false);
	expect(isPlainObject( 1 )).toBe(false);
	expect(isPlainObject( BigInt(1) )).toBe(false);
	expect(isPlainObject( '1' )).toBe(false);
	expect(isPlainObject( undefined )).toBe(false);
	expect(isPlainObject( false )).toBe(false);
	expect(isPlainObject( null )).toBe(false);
	expect(isPlainObject( function(){} )).toBe(false);
	expect(isPlainObject( ()=>{} )).toBe(false);
	expect(isPlainObject( [1,2,3] )).toBe(false);
	//@ts-ignore
	expect(isPlainObject( (function() {function Foo(){};return new Foo()}()) )).toBe(false);
	expect(isPlainObject( Bar )).toBe(false);
	expect(isPlainObject( new Bar() )).toBe(false);
	expect(isPlainObject( Math )).toBe(false);
	expect(isPlainObject( new Error('blahh') )).toBe(false);
	expect(isPlainObject( Symbol )).toBe(false);
	expect(isPlainObject( Symbol('test') )).toBe(false);

});

describe('deterministicHash', ()=>{

	test('Deeply equal objects are the same', ()=>{
	
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
	
		expect( _isEqual(obj1, obj2) ).toBe(true);
	
		expect(
			deterministicHash(obj1)
		).toBe(
			deterministicHash(obj2)
		);
	
		const arr1 = [obj1, obj2];
		const arr2 = [obj2, obj1];
	
		expect( _isEqual(arr1, arr2) ).toBe(true);
	
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
	
	test('Settings are passed', ()=>{
	
		expect(
			deterministicHash('TEST_VALUE')
		).toEqual(
			crypto.createHash('sha1').update('"TEST_VALUE"').digest('hex')
		);
	
		expect(
			deterministicHash('TEST_VALUE', 'sha1', 'hex')
		).toEqual(
			crypto.createHash('sha1').update('"TEST_VALUE"').digest('hex')
		);
	
		expect(
			deterministicHash('TEST_VALUE', 'sha1', 'base64')
		).toEqual(
			crypto.createHash('sha1').update('"TEST_VALUE"').digest('base64')
		);
	
		expect(
			deterministicHash('TEST_VALUE', 'sha512', 'hex')
		).toEqual(
			crypto.createHash('sha512').update('"TEST_VALUE"').digest('hex')
		);
	
		expect(
			deterministicHash('TEST_VALUE', 'sha512', 'base64')
		).toEqual(
			crypto.createHash('sha512').update('"TEST_VALUE"').digest('base64')
		);
	
	});

});

describe('deterministicString', ()=>{

	test('Primitives don\'t match their string versions.', ()=>{
	
		expect(
			deterministicHash(null)
		).not.toBe(
			deterministicHash('null')
		);
	
		expect(
			deterministicHash(undefined)
		).not.toBe(
			deterministicHash('undefined')
		);
	
		expect(
			deterministicHash(true)
		).not.toBe(
			deterministicHash('true')
		);
	
		expect(
			deterministicHash(false)
		).not.toBe(
			deterministicHash('false')
		);
	
		expect(
			deterministicHash(Number('will be "NaN"'))
		).not.toBe(
			deterministicHash('NaN')
		);
	
		expect(
			deterministicHash(123)
		).not.toBe(
			deterministicHash('123')
		);
	
		expect(
			deterministicHash(BigInt(123))
		).not.toBe(
			deterministicHash('123n')
		);
	
	});

});