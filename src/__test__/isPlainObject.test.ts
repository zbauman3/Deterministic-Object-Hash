import isPlainObject from "../isPlainObject";

test('isPlainObject', ()=>{

	expect(isPlainObject( {} )).toBe(true);
	expect(isPlainObject( { constructor: 'test' } )).toBe(true);
	expect(isPlainObject( { valueOf: 'test' } )).toBe(true);
	expect(isPlainObject( Object(null) )).toBe(true);
	expect(isPlainObject( Object({}) )).toBe(true);
	expect(isPlainObject( Object({ constructor: 'test' }) )).toBe(true);
	expect(isPlainObject( Object({ valueOf: 'test' }) )).toBe(true);
	expect(isPlainObject( Object({ [Symbol.toStringTag]: 'test' }) )).toBe(false);
	expect(isPlainObject( Object.create(null) )).toBe(true);
	expect(isPlainObject( Object.create(Object.prototype) )).toBe(true);
	
	class Bar{};

	expect(isPlainObject( { [Symbol.toStringTag]: 'test' } )).toBe(false);
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