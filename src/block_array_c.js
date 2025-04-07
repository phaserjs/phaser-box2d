/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Alloc, b2Grow } from './include/allocate_h.js';
import { b2BodySim, b2BodyState, resetProperties } from './include/body_h.js';

import { B2_NULL_INDEX } from './include/core_h.js';
import { b2ContactSim } from './include/contact_h.js';
import { b2IslandSim } from './include/island_h.js';
import { b2JointSim } from './include/joint_h.js';

/**
 * @namespace BlockArray
 */

const B2_INITIAL_CAPACITY = 16;

export class b2BodySimArray
{
    constructor(capacity = 0)
    {
        this.data = [];
        this.count = 0;
        this.capacity = capacity;
    }
}

export class b2BodyStateArray
{
    constructor(capacity = 0)
    {
        this.data = [];
        this.count = 0;
        this.capacity = capacity;
    }
}

export class b2ContactArray
{
    constructor(capacity = 0)
    {
        /** @type {b2ContactSim[]} */
        this.data = [];
        this.count = 0;
        this.capacity = capacity;
    }
}

export class b2IslandArray
{
    constructor(capacity = 0)
    {
        this.data = [];
        this.count = 0;
        this.capacity = capacity;
    }
}

export class b2JointArray
{
    constructor(capacity = 0)
    {
        this.data = [];
        this.count = 0;
        this.capacity = capacity;
    }
}

export function b2CreateBodySimArray(capacity)
{
    const array = new b2BodySimArray(capacity);

    if (capacity > 0)
    {
        array.data = b2Alloc(capacity, () => { return new b2BodySim(); });

        return array;
    }
    array.data = null;

    return array;
}

export function b2CreateBodyStateArray(capacity)
{
    const array = new b2BodyStateArray(capacity);

    if (capacity > 0)
    {
        array.data = b2Alloc(capacity, () => { return new b2BodyState(); });

        return array;
    }
    array.data = null;

    return array;
}

export function b2CreateContactArray(capacity)
{
    const array = new b2ContactArray(capacity);

    if (capacity > 0)
    {
        array.data = b2Alloc(capacity, () => { return new b2ContactSim(); });

        // console.warn("b2CreateContactArray " + capacity);
        return array;
    }
    array.data = null;

    return array;
}

export function b2CreateJointArray(capacity)
{
    const array = new b2JointArray(capacity);

    if (capacity > 0)
    {
        array.data = b2Alloc(capacity, () => { return new b2JointSim(); });

        return array;
    }
    array.data = null;

    return array;
}

export function b2CreateIslandArray(capacity)
{
    const array = new b2IslandArray(capacity);

    if (capacity > 0)
    {
        array.data = b2Alloc(capacity, () => { return new b2IslandSim(); });

        return array;
    }
    array.data = null;

    return array;
}

export function b2AddBodySim(array)
{
    if (array.capacity === 0)
    {
        console.assert(array.count === 0);
        array.data = b2Alloc(B2_INITIAL_CAPACITY, () => { return new b2BodySim(); });
        array.capacity = B2_INITIAL_CAPACITY;
        array.count = 0;
    }
    else if (array.count === array.capacity)
    {
        const newCapacity = 2 * array.capacity;
        b2Grow(array.data, newCapacity, () => { return new b2BodySim(); });
        array.capacity = newCapacity;
    }
    else
    {
        resetProperties(array.data[array.count]);
    }

    array.count += 1;

    return array.data[array.count - 1];
}

export function b2AddBodyState(array)
{
    if (array.capacity === 0)
    {
        console.assert(array.count === 0);
        array.data = b2Alloc(B2_INITIAL_CAPACITY, () => { return new b2BodyState(); });
        array.capacity = B2_INITIAL_CAPACITY;
        array.count = 0;
    }
    else if (array.count === array.capacity)
    {
        const newCapacity = 2 * array.capacity;
        b2Grow(array.data, newCapacity, () => { return new b2BodyState(); });
        array.capacity = newCapacity;
    }
    else
    {
        resetProperties(array.data[array.count]);
    }

    array.count += 1;

    return array.data[array.count - 1];
}

// create a b2ContactSim and add it to array, maintain count and capacity
export function b2AddContact(array)
{
    if (array.capacity === 0)
    {
        console.assert(array.count === 0);
        array.data = b2Alloc(B2_INITIAL_CAPACITY, () => { return new b2ContactSim(); });
        array.capacity = B2_INITIAL_CAPACITY;
        array.count = 0;
    }
    else if (array.count === array.capacity)
    {
        // PJB: grow quickly to avoid a bunch of these...
        const newCapacity = 8 * array.capacity;
        b2Grow(array.data, newCapacity, () => { return new b2ContactSim(); });
        array.capacity = newCapacity;
    }
    else
    {
        const sim = array.data[array.count];
        resetProperties(sim);
        sim._bodyIdA = sim._bodyIdB = B2_NULL_INDEX;
    }

    array.count += 1;

    return array.data[array.count - 1];
}

export function b2AddJoint(array)
{
    // array type: b2JointArray*
    if (array.capacity === 0)
    {
        console.assert(array.count === 0);
        array.data = b2Alloc(B2_INITIAL_CAPACITY, () => { return new b2JointSim(); });
        array.capacity = B2_INITIAL_CAPACITY;
        array.count = 0;
    }
    else if (array.count === array.capacity)
    {
        const newCapacity = 2 * array.capacity;
        b2Grow(array.data, newCapacity, () => { return new b2JointSim(); });
        array.capacity = newCapacity;
    }
    else
    {
        resetProperties(array.data[array.count]);
    }

    array.count += 1;
    console.assert(array.data[array.count - 1].type !== undefined, `${new Error().stack}`);

    return array.data[array.count - 1];
}

export function b2AddIsland(array)
{
    if (array.capacity === 0)
    {
        console.assert(array.count === 0);
        array.data = b2Alloc(B2_INITIAL_CAPACITY, () => { return new b2IslandSim(); });
        array.capacity = B2_INITIAL_CAPACITY;
        array.count = 0;
    }
    else if (array.count === array.capacity)
    {
        const newCapacity = 2 * array.capacity;
        b2Grow(array.data, newCapacity, () => { return new b2IslandSim(); });
        array.capacity = newCapacity;
    }
    else
    {
        resetProperties(array.data[array.count]);
    }

    array.count += 1;
    array.data[array.count - 1].islandId = B2_NULL_INDEX;

    return array.data[array.count - 1];
}

function removeArrayIndex(array, index)
{
    console.assert(0 <= index && index < array.count);

    if (index < array.count - 1)
    {
        const swapA = array.data[array.count - 1];
        const swapB = array.data[index];
        array.data[index] = swapA;
        array.data[array.count - 1] = swapB;
        array.count -= 1;

        return array.count;
    }
    array.count -= 1;

    return B2_NULL_INDEX;
}

export function b2RemoveBodySim(array, index)
{
    return removeArrayIndex(array, index);
}

export function b2RemoveBodyState(array, index)
{
    return removeArrayIndex(array, index);
}

export function b2RemoveContact(array, index)
{
    return removeArrayIndex(array, index);
}

export function b2RemoveJoint(array, index)
{
    return removeArrayIndex(array, index);
}

export function b2RemoveIsland(array, index)
{
    return removeArrayIndex(array, index);
}
