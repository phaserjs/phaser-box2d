/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

/**
 * @namespace Table
 */

// use a map instead of an object: Map can use bigint as a key where object will convert it to a string first
// WARNING: map has property 'size' instead of the C original 'count' and does not have 'capacity'
// TODO: remove this utterly in the future, it's just an array wrapper in JS

export function b2CreateSet()
{
    return new Map();
}

export function b2DestroySet(set)
{
    set.clear();
}

export function b2ClearSet(set)
{
    set.clear();
}

export function b2ContainsKey(set, key)
{
    return set.has(key);
}

export function b2AddKey(set, key)
{
    if (set.has(key))
    {
        return true;
    }
    set.set(key, 1);

    return false;
}

export function b2RemoveKey(set, key)
{
    return set.delete(key);
}
