/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

/**
 * @defgroup id Ids
 * These ids serve as handles to internal Box2D objects.
 * These should be considered opaque data and passed by value.
 * Include this header if you need the id types and not the whole Box2D API.
 * All ids are considered null if initialized to zero.
 *
 * For example in JavaScript:
 *
 * @code{.js}
 * let worldId = {};
 * @endcode
 *
 * This is considered null.
 *
 * @warning Do not use the internals of these ids. They are subject to change. Ids should be treated as opaque objects.
 * @warning You should use ids to access objects in Box2D. Do not access files within the src folder. Such usage is unsupported.
 */

/**
 * @class b2WorldId
 * @summary World id references a world instance. This should be treated as an opaque handle.
 * @property {number} index1 - Index value stored as unsigned 16-bit integer
 * @property {number} revision - Revision value stored as unsigned 16-bit integer
 */
export class b2WorldId
{
    constructor(index = 0, revision = 0)
    {
        this.index1 = index;
        this.revision = revision;
    }
}

/**
 * @class b2BodyId
 * @summary Body id references a body instance. This should be treated as an opaque handle.
 * @property {number} index1 - Integer index value
 * @property {number} world0 - 16-bit world identifier
 * @property {number} revision - 16-bit revision number
 */
export class b2BodyId
{
    constructor(index = 0, world = 0, revision = 0)
    {
        this.index1 = index;
        this.world0 = world;
        this.revision = revision;
    }
}

/**
 * @class b2ShapeId
 * @summary Shape id references a shape instance. This should be treated as an opaque handle.
 * @property {number} index1 - Integer index value
 * @property {number} world0 - 16-bit unsigned integer value
 * @property {number} revision - 16-bit unsigned integer value
 */
export class b2ShapeId
{
    constructor(index = 0, world = 0, revision = 0)
    {
        this.index1 = index;
        this.world0 = world;
        this.revision = revision;
    }
}

/**
 * @class b2JointId
 * @summary Joint id references a joint instance. This should be treated as an opaque handle.
 * @property {number} index1 - Integer index value
 * @property {number} world0 - 16-bit world identifier
 * @property {number} revision - 16-bit revision number
 */
export class b2JointId
{
    constructor(index = 0, world = 0, revision = 0)
    {
        this.index1 = index;
        this.world0 = world;
        this.revision = revision;
    }
}

/**
 * @class b2ChainId
 * @summary Chain id references a chain instances. This should be treated as an opaque handle.
 * @property {number} index1 - Integer index value
 * @property {number} world0 - 16-bit unsigned integer value
 * @property {number} revision - 16-bit unsigned integer value
 */
export class b2ChainId
{
    constructor(index = 0, world = 0, revision = 0)
    {
        this.index1 = index;
        this.world0 = world;
        this.revision = revision;
    }
}

// Use these to make your identifiers null.
// You may also use zero initialization to get null.
// JS conversion NOTE: replace with new call in-situ, make sure c'tor sets all to 0
// export const b2_nullWorldId = B2_ZERO_INIT;  // b2WorldId
// export const b2_nullBodyId = B2_ZERO_INIT;   // b2BodyId
// export const b2_nullShapeId = B2_ZERO_INIT;  // b2ShapeId
// export const b2_nullJointId = B2_ZERO_INIT;  // b2JointId
// export const b2_nullChainId = B2_ZERO_INIT;  // b2ChainId

/**
 * @summary Checks if a contact ID is null/invalid
 * @function B2_IS_NULL
 * @param {Object} id - A contact ID object containing index1 property
 * @returns {boolean} Returns true if the contact ID is null (index1 === 0), false otherwise
 * @description
 * Tests if a contact ID represents a null/invalid contact by checking if its index1
 * property equals 0. In Box2D, an index1 value of 0 indicates a null contact ID.
 */
export function B2_IS_NULL(id)
{
    return id.index1 === 0;
}

/**
 * @summary Checks if a contact ID is non-null.
 * @function B2_IS_NON_NULL
 * @param {Object} id - A contact ID object containing an index1 property.
 * @returns {boolean} Returns true if the contact ID is non-null (index1 !== 0), false otherwise.
 * @description
 * Tests whether a contact ID represents a valid contact by checking if its index1
 * property is not equal to 0. A zero value for index1 indicates a null contact ID.
 */
export function B2_IS_NON_NULL(id)
{
    return id.index1 !== 0;
}

/**
 * @summary Compares two ID objects for equality.
 * @function B2_ID_EQUALS
 * @param {Object} id1 - First ID object containing index1, world0, and revision properties.
 * @param {Object} id2 - Second ID object containing index1, world0, and revision properties.
 * @returns {boolean} True if all corresponding properties between id1 and id2 are equal, false otherwise.
 * @description
 * Performs a strict equality comparison between corresponding properties of two ID objects.
 * Checks equality of index1, world0, and revision properties.
 */
export function B2_ID_EQUALS(id1, id2)
{
    return id1.index1 === id2.index1 && id1.world0 === id2.world0 && id1.revision === id2.revision;
}
