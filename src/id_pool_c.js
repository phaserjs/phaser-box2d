/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Validation } from './include/types_h.js';

/**
 * @namespace IDPool
 */

export class b2IdPool
{
    constructor(name)
    {
        this.name = name;
        this.freeArray = [];
        this.nextIndex = 0;
    }
}

export function b2GetIdCapacity(pool)
{
    return pool.nextIndex;
}

export function b2CreateIdPool(name = 'pool')
{
    return new b2IdPool(name);
}

export function b2DestroyIdPool(pool)
{
    pool.freeArray = null;
    pool.nextIndex = 0;
}

export function b2AllocId(pool)
{
    if (pool.freeArray.length > 0)
    {
        return pool.freeArray.pop();
    }

    const id = pool.nextIndex;
    pool.nextIndex++;

    return id;
}

export function b2FreeId(pool, id)
{
    if (id === pool.nextIndex - 1)
    {
        pool.nextIndex--;

        return;
    }

    pool.freeArray.push(id);
}

export function b2GetIdCount(pool)
{
    return pool.nextIndex - pool.freeArray.length;
}

export function b2ValidateFreeId(pool, id)
{
    if (!b2Validation) { return; }

    const freeCount = pool.freeArray.length;

    if (id == pool.nextIndex)
    { return; }
    
    for (let i = 0; i < freeCount; ++i)
    {
        if (pool.freeArray[i] == id)
        {
            return;
        }
    }

    console.warn("pool " + pool.constructor.name + " has no free Id " + id);
    console.warn(pool.freeArray);
}
