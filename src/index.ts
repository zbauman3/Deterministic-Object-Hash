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

export function deterministicString(input: unknown){

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
		typeof input === 'bigint' ||
		typeof input === 'boolean' ||
		typeof input === 'number' ||
		input === undefined ||
		input === null ||
		typeof input !== 'object'
	){

		//cast to string for any of these
		return `${input}`;

	}else if(Array.isArray(input)){

		let ret = '[';

		//add all of the key value pairs
		for(let i = 0; i < input.length; i++){

			ret += `(${i}:${deterministicString(input[i])}),`;

		}

		ret += ']';

		return ret;

	}else{

		//add the constructor as a key
		let ret: string = `(${deterministicString(input.constructor)}:[`;

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

	}

}
