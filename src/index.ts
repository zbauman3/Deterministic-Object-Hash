import { createHash } from "crypto";

/**
 * Creates a deterministic hash for all input types. Optionally pass a hash
 * algorithm.
 */
export default function deterministicHash(
	input: unknown,
	algorithm: Parameters<typeof createHash>[0] = 'sha1',
	memo: Record<string, string> = {}
){
	
	//to store the key of the memo
	let key = '';

	if(
		typeof input === 'symbol' || 
		typeof input === 'function'
	){

		//use `toString` for an accurate representation of these
		key = input.toString();

	}else if(
		typeof input === 'bigint' ||
		typeof input === 'boolean' ||
		typeof input === 'number' ||
		typeof input === 'string' ||
		input === undefined ||
		input === null ||
		typeof input !== 'object'
	){

		//cast to string for any of these
		key = `${input}`;

	}else if(Array.isArray(input)){

		key += '[';

		//add all of the key value pairs
		for(let i = 0; i < input.length; i++){

			key += `(${i}:${deterministicHash(input[i], algorithm, memo)}),`;

		}

		key += ']';

	}else{

		//add the constructor as a key
		key += `(${deterministicHash(input.constructor, algorithm, memo)}:[`;

		//get key/value pairs
		const entries = Object.entries(input);

		//sort alphabetically by keys
		entries.sort(([a],[b])=>a.localeCompare(b));

		//add all of the key/value pairs
		for(const [k, v] of entries){

			key += `(${k}:${deterministicHash(v, algorithm, memo)}),`;

		}

		key += '])';

	}

	//add to the memo if not found
	if(!(key in memo)){

		memo[key] = createHash(algorithm).update(key).digest('hex');

	}

	//return memoized value
	return memo[key];

};
