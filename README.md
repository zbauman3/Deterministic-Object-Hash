# Deterministic-Hash
A deterministic value hashing algorithm for node.js.

## Usage
Pass any Javascript value and receive a deterministic hash (in hexadecimal) of the value. If an object is passed, only own enumerable string-keyed properties are used, the order of the keys does not matter as long as all of the values match.

```typescript
import deterministicHash from 'deterministic-hash';

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

A hash algorithm can be passed as the second argument. This takes any value that is valid for `crypto.createHash`. The default is `sha1`.

```typescript
deterministicHash('value', 'sha1');
// -> f32b67c7e26342af42efabc674d441dca0a281c5
deterministicHash('value', 'sha256');
// -> cd42404d52ad55ccfa9aca4adc828aa5800ad9d385a0671fbcbf724118320619
deterministicHash('value', 'sha512');
// -> ec2c83edecb60304d154ebdb85bdfaf61a92bd142e71c4f7b25a15b9cb5f3c0ae301cfb3569cf240e4470031385348bc296d8d99d09e06b26f09591a97527296
```

## Support
Currently this has only been tested on Node.js `16.3.x`. More tests are to come and this section will be updated as I test them.