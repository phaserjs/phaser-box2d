/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */


/**
 * @namespace Allocate
*/

// In JS we don't need to allocate space for the array or grow it because it can't become 'full'
// however the initCallback is useful for ensuring that class object constructors get called

export function b2Alloc(size, initCallback = null)
{
    const ptr = [];

    if (initCallback)
    {
        for (let i = 0; i < size; i++)
        { ptr[i] = initCallback(); }
    }

    return ptr;
}

export function b2Grow(mem, newSize, initCallback = null)
{
    const oldSize = mem.length;

    if (initCallback)
    {
        for (let i = oldSize; i < newSize; i++)
        { mem[i] = initCallback(); }
    }

    return mem;
}
