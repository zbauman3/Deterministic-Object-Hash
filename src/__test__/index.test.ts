import deterministicHash, {deterministicString} from "../index";
import { isEqual as _isEqual } from "lodash";
import crypto from "crypto";

const createHashSpy = jest.spyOn(crypto, 'createHash');

beforeEach(()=>{
	createHashSpy.mockClear();
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
			deterministicString(null)
		).not.toBe(
			deterministicString('null')
		);
	
		expect(
			deterministicString(undefined)
		).not.toBe(
			deterministicString('undefined')
		);
	
		expect(
			deterministicString(true)
		).not.toBe(
			deterministicString('true')
		);
	
		expect(
			deterministicString(false)
		).not.toBe(
			deterministicString('false')
		);
	
		expect(
			deterministicString(Number('will be "NaN"'))
		).not.toBe(
			deterministicString('NaN')
		);
	
		expect(
			deterministicString(123)
		).not.toBe(
			deterministicString('123')
		);
	
		expect(
			deterministicString(BigInt(123))
		).not.toBe(
			deterministicString('123n')
		);
	
	});

	test('undefined', ()=>{

		expect(
			deterministicString(undefined)
		).toBe('undefined');

	});

	test('null', ()=>{

		expect(
			deterministicString(null)
		).toBe('null');

	});

	test('globalThis', ()=>{

		expect(
			deterministicString(globalThis)
		).toBe('[object Object]');

	});

	test('Function', ()=>{

		expect(
			deterministicString( function(){ 'test'; } ).replace(/[\s\t\r\n]/g, '')//remove white space to test against
		).toBe("function(){'test';}");

		expect(
			deterministicString( ()=>{ 'test'; } ).replace(/[\s\t\r\n]/g, '')//remove white space to test against
		).toBe("()=>{'test';}");

	});

	test('Boolean', ()=>{

		expect(
			deterministicString(true)
		).toBe('true');

		expect(
			deterministicString(false)
		).toBe('false');

	});

	test('Symbol', ()=>{

		expect(
			deterministicString(Symbol('test'))
		).toBe("Symbol(test)");

	});

	test('Number', ()=>{

		expect(
			deterministicString(1)
		).toBe("1");

		expect(
			deterministicString(-0)
		).toBe("0");

	});

	test('Infinity', ()=>{

		expect(
			deterministicString(Infinity)
		).toBe('Infinity');

		expect(
			deterministicString(-Infinity)
		).toBe('-Infinity');

	});

	test('NaN', ()=>{

		expect(
			deterministicString(NaN)
		).toBe('NaN');

		expect(
			deterministicString(-NaN)
		).toBe('NaN');

	});

	test('BigInt', ()=>{

		expect(
			deterministicString(BigInt(1))
		).toBe('1n');

	});

	test('Date', ()=>{

		expect(
			deterministicString(new Date(0))
		).toBe('(Date:0)');

		expect(
			deterministicString(new Date(-1000))
		).toBe('(Date:-1000)');

	});

	test('String', ()=>{

		expect(
			deterministicString('test')
		).toBe('"test"');

		expect(
			deterministicString('te"st')
		).toBe('"te\\"st"');

	});

	test('RegExp', ()=>{

		expect(
			deterministicString(/this|is|a|test/gim)
		).toBe('(RegExp:/this|is|a|test/gim)');

		expect(
			deterministicString(new RegExp('this|is|a|test', 'gim'))
		).toBe('(RegExp:/this|is|a|test/gim)');

	});

	test('Array', ()=>{

		expect(
			deterministicString([ 'this', 'is', 'a', 'test' ])
		).toBe(`(Array:[(0:"this"),(1:"is"),(2:"a"),(3:"test"),])`);

		expect(
			deterministicString(new Array(...[ 'this', 'is', 'a', 'test' ]))
		).toBe(`(Array:[(0:"this"),(1:"is"),(2:"a"),(3:"test"),])`);

		expect(
			deterministicString(Array.from([ 'this', 'is', 'a', 'test' ]))
		).toBe(`(Array:[(0:"this"),(1:"is"),(2:"a"),(3:"test"),])`);

	});

	test('Int8Array', ()=>{

		const typedArr = new Int8Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Int8Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Uint8Array', ()=>{

		const typedArr = new Uint8Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Uint8Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Uint8ClampedArray', ()=>{

		const typedArr = new Uint8ClampedArray(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Uint8ClampedArray:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Int16Array', ()=>{

		const typedArr = new Int16Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Int16Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Uint16Array', ()=>{

		const typedArr = new Uint16Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Uint16Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Int32Array', ()=>{

		const typedArr = new Int32Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Int32Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Uint32Array', ()=>{

		const typedArr = new Uint32Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Uint32Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Float32Array', ()=>{

		const typedArr = new Float32Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Float32Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('Float64Array', ()=>{

		const typedArr = new Float64Array(4);
		typedArr[0] = 1;
		typedArr[1] = 1;

		expect(
			deterministicString(typedArr)
		).toBe(`(Float64Array:[(0:1),(1:1),(2:0),(3:0),])`);

	});

	test('BigInt64Array', ()=>{

		const typedArr = new BigInt64Array(4);
		typedArr[0] = BigInt(1);
		typedArr[1] = BigInt(1);

		expect(
			deterministicString(typedArr)
		).toBe(`(BigInt64Array:[(0:1n),(1:1n),(2:0n),(3:0n),])`);

	});

	test('BigUint64Array', ()=>{

		const typedArr = new BigUint64Array(4);
		typedArr[0] = BigInt(1);
		typedArr[1] = BigInt(1);

		expect(
			deterministicString(typedArr)
		).toBe(`(BigUint64Array:[(0:1n),(1:1n),(2:0n),(3:0n),])`);

	});

	// //---------to test
	// Object
	// Map
	// Set
	// WeakMap
	// WeakSet
	// ArrayBuffer
	// SharedArrayBuffer

	//Symbol keys in a plain object/map/class
	//Class inheritance


	// //-----------not handling
	// Atomics
	// DataView
	// Promise
	// Reflect
	// Proxy

});