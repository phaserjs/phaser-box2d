/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

/**
 * @namespace StackAllocator
*/

// TODO: remove this utterly in the future, it's just an array wrapper in JS

export class b2StackAllocator
{
    constructor()
    {
        this.data = null;
        this.entries = null;
        
    }
}

class b2StackEntry
{
    constructor()
    {
        this.data = null;
        this.name = null;
        this.size = 0;
        
    }
}

export function b2CreateStackAllocator(capacity)
{
    const allocator = new b2StackAllocator();
    allocator.data = [];
    allocator.entries = [];

    return allocator;
}

export function b2DestroyStackAllocator(allocator)
{
    allocator.data = null;
    allocator.entries = null;
}

export function b2AllocateStackItem(alloc, size, name, ctor = null)
{
    console.assert(size >= 0);
    const entry = new b2StackEntry();
    entry.size = size;
    entry.name = name;
    entry.data = [];

    for (let i = 0; i < size; i++)
    {
        if (ctor)
        { entry.data.push(ctor()); }
        else
        { entry.data.push(null); }
    }
    alloc.entries.push(entry);

    return entry.data;
}

export function b2FreeStackItem(alloc, mem)
{
    const entryCount = alloc.entries.length;
    console.assert(entryCount > 0);
    const entry = alloc.entries[entryCount - 1];
    console.assert(entry.data == mem);
    console.assert(entry.size >= 0);
    alloc.entries.pop();
}

export function b2GrowStack(alloc)
{
}

export function b2GetStackCapacity(alloc)
{
    return Number.MAX_SAFE_INTEGER;
}

export function b2GetStackAllocation(alloc)
{
    return alloc.entries.length;
}

export function b2GetMaxStackAllocation(alloc)
{
    return Number.MAX_SAFE_INTEGER;
}
