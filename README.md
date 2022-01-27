# Deterministic-Object-Hash
A deterministic object hashing algorithm for Node.js.

## The Problem
Using `JSON.stringify` on two objects that are deeply equal does not lead to the same output string. Instead the keys are ordered in the same order that they were added. This leads to two objects that are deeply equal being hashed to different values.

```typescript
import { createHash } from "crypto";
import { isEqual } from "lodash";

const obj1: Record<string, string> = {};
obj1['a'] = 'x';
obj1['b'] = 'y';
obj1['c'] = 'z';

const obj2: Record<string, string> = {};
obj2['c'] = 'z';
obj2['b'] = 'y';
obj2['a'] = 'x';

isEqual(obj1, obj2);
// -> true

const string1 = JSON.stringify(obj1);
// -> {"a":"x","b":"y","c":"z"}
const string2 = JSON.stringify(obj2);
// -> {"c":"z","b":"y","a":"x"}

createHash('sha1').update(string1).digest('hex');
// -> ff75fe071d236ce309c15d5636ecaa86c0519ebc
createHash('sha1').update(string2).digest('hex');
// -> 2e53bac865f7be77c8e10cd86d737fbbf259ed37
```


## Usage
Pass any Javascript value and receive a deterministic hash of the value. If an object is passed, only own enumerable string-keyed properties are used.

```typescript
import deterministicHash from 'deterministic-object-hash';

const objA = { a: 'x', arr: [1,2,3,4], b: 'y' };
const objB = { b: 'y', a: 'x', arr: [1,2,3,4] };

deterministicHash({
	c: [ objA, objB ],
	b: objA,
	e: objB,
	f: ()=>{ Math.random(); },
	g: Symbol('Unique identity'),
	h: new Error('AHHH')
});
// -> 455b32a99a84efad551409b39bd91fc028a98343

deterministicHash({
	h: new Error('AHHH'),
	e: objB,
	g: Symbol('Unique identity'),
	b: objA,
	f: ()=>{ Math.random(); },
	c: [ objA, objB ]
});
// -> 455b32a99a84efad551409b39bd91fc028a98343
```

## Settings

A hash algorithm can be passed as the second argument. This takes any value that is valid for `crypto.createHash`. The default is `sha1`. \
A digest format can be passed as the third argument. This takes any value that is valid for `Hash.digest`. The default is `hex`.


```typescript
deterministicHash('value', 'sha1');
// -> f32b67c7e26342af42efabc674d441dca0a281c5
deterministicHash('value', 'sha256', 'hex');
// -> cd42404d52ad55ccfa9aca4adc828aa5800ad9d385a0671fbcbf724118320619
deterministicHash('value', 'sha512', 'base64');
// -> 7CyD7ey2AwTRVOvbhb369hqSvRQuccT3sloVuctfPArjAc+zVpzyQORHADE4U0i8KW2NmdCeBrJvCVkal1Jylg==
```

## Support
Currently this has only been tested on Node.js `16.3.x`. More tests are to come and this section will be updated as I test them.