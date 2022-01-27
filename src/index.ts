import { createHash } from "crypto";

/**
 * Creates a deterministic hash for all input types.
 */
export default function deterministicHash(
	input: unknown,
	algorithm: Parameters<typeof createHash>[0] = 'sha1',
	output: Parameters<ReturnType<typeof createHash>['digest']>[0] = 'hex',
){

	return createHash(algorithm).update(deterministicString(input)).digest(output);

};

export function deterministicString(input: unknown): string{

	if(typeof input === 'string'){

		//wrap in quotes to distinguish from the primitive versions (e.g. "null"/null)
		return `"${input}"`;

	}else if(
		typeof input === 'symbol' || 
		typeof input === 'function'
	){

		//use `toString` for an accurate representation of these
		return input.toString();

	}else if(
		input === undefined ||
		input === null ||
		typeof input === 'bigint' ||
		typeof input === 'boolean' ||
		typeof input === 'number' ||
		typeof input !== 'object'
	){

		//cast to string for any of these
		return `${input}`;

	}else if(
		input instanceof Date ||
		input instanceof RegExp || 
		input instanceof Error ||
		input instanceof WeakMap || //non-iterable
		input instanceof WeakSet    //non-iterable
	){

		//add the constructor as a key, use simple `toString`
		return `(${input.constructor.name}:${input.toString()})`;

	}else if(input instanceof Set){

		//add the constructor as a key
		let ret = `(${input.constructor.name}:[`;

		//add all unique values
		for(const val of input.values()){

			ret += `(${deterministicString(val)}),`;

		}

		ret += ']';

		return ret;

	}else if(
		Array.isArray(input) ||
		input instanceof Int8Array ||
		input instanceof Uint8Array ||
		input instanceof Uint8ClampedArray ||
		input instanceof Int16Array ||
		input instanceof Uint16Array ||
		input instanceof Int32Array ||
		input instanceof Uint32Array ||
		input instanceof Float32Array ||
		input instanceof Float64Array ||
		input instanceof BigInt64Array ||
		input instanceof BigUint64Array
	){

		//add the constructor as a key
		let ret = `(${input.constructor.name}:[`;

		for(const [k, v] of input.entries()){

			ret += `(${k}:${deterministicString(v)}),`;

		}

		ret += ']';

		return ret;

	}else if(
		input instanceof ArrayBuffer ||
		input instanceof SharedArrayBuffer
	){

		if(input.byteLength % 8 === 0){

			return deterministicString(new BigUint64Array(input));

		}else if(input.byteLength % 4 === 0){

			return deterministicString(new Uint32Array(input));

		}else if(input.byteLength % 2 === 0){

			return deterministicString(new Uint16Array(input));

		}else{

			let ret = '(';

			for(let i = 0; i < input.byteLength; i++){

				ret += deterministicString(new Uint8Array(input.slice(i, i+1)));

			}

			ret += ')';

			return ret;

		}

	}else if(
		input instanceof Map ||
		isPlainObject(input)
	){

		//add the constructor as a key
		let ret: string = `(${input.constructor.name}:[`;

		//get key/value pairs
		const entries = Object.entries(input);

		//sort alphabetically by keys
		entries.sort(([a],[b])=>a.localeCompare(b));

		//add all of the key/value pairs
		for(const [k, v] of entries){

			ret += `(${k}:${deterministicString(v)}),`;

		}

		ret += '])';

		return ret;

	}else{

		//add the constructor as a key
		let ret: string = `(${input.constructor.name}:[`;

		const allEntries: [string, unknown][] = [];

		for(const k in input){

			allEntries.push([
				`${k}`,
				//have to ignore because `noImplicitAny` is `true` but this is implicitly `any`
				//@ts-ignore
				input[k]
			]);

		}

		//sort alphabetically by keys
		allEntries.sort(([a],[b])=>a.localeCompare(b));

		//add all of the key/value pairs
		for(const [k, v] of allEntries){

			ret += `(${k}:${deterministicString(v)}),`;

		}

		ret += '])';

		return ret;

	}

}

const objConstructorString = Function.prototype.toString.call(Object);
export function isPlainObject(value: unknown){

	//base object
	if(
		typeof value !== 'object' ||
		value === null ||
		Object.prototype.toString.call(value) !== '[object Object]'
	){
		return false;
	}

	//get the prototype
	const proto = Object.getPrototypeOf(value);

	//no prototype === all good
	if(proto === null){
		return true;
	}

	// validate that the constructor is `Object`
	const cTor = (Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor);
	return (
		typeof cTor === 'function' &&
		cTor instanceof cTor &&
		Function.prototype.toString.call(cTor) === objConstructorString
	);

};
