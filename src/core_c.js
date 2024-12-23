/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2Version } from './include/base_h.js';

/**
 * @namespace Core
 */

let b2_lengthUnitsPerMeter = 1.0;
const B2_NULL_INDEX = -1;

export { B2_NULL_INDEX };

/**
 * @summary Sets the length units per meter for Box2D physics calculations.
 * @function b2SetLengthUnitsPerMeter
 * @param {number} lengthUnits - The number of length units that represent one meter.
 * @returns {void}
 * @description
 * Sets the global scaling factor that defines how many length units in the physics
 * simulation correspond to one meter in the real world. This affects all subsequent
 * physics calculations in the Box2D engine.
 */
export function b2SetLengthUnitsPerMeter(lengthUnits)
{
    // B2_ASSERT(b2IsValid(lengthUnits) && lengthUnits > 0.0);
    b2_lengthUnitsPerMeter = lengthUnits;
}

/**
 * @function b2GetLengthUnitsPerMeter
 * @summary Returns the global length units per meter scaling factor.
 * @returns {number} The number of length units per meter used in the physics simulation.
 * @description
 * Returns the value of b2_lengthUnitsPerMeter, which defines the conversion factor
 * between physics simulation units and real-world meters.
 */
export function b2GetLengthUnitsPerMeter()
{
    return b2_lengthUnitsPerMeter;
}

/**
 * Sets the assertion function handler for Box2D.
 * @function b2SetAssertFcn
 * @param {Function|null} assertFcn - The assertion function to handle Box2D assertions.
 * If null, assertions will be disabled.
 * @returns {void}
 * @description
 * This function sets the global assertion handler used by Box2D for runtime checks.
 * The assertion handler is called when a Box2D assertion fails.
 */
export function b2SetAssertFcn(assertFcn)
{
    console.warn("b2SetAssertFcn not supported");
}

/**
 * @summary Returns the current version of Box2D
 * @function b2GetVersion
 * @returns {b2Version} A b2Version object containing major version 3, minor version 0, and revision 0
 * @description
 * This function creates and returns a new b2Version object initialized with Box2D version 3.0.0
 */
export function b2GetVersion()
{
    return new b2Version(3, 0, 0);
}
