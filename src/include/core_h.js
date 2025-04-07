/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export { B2_NULL_INDEX, b2GetVersion, b2SetAssertFcn, b2SetLengthUnitsPerMeter, b2GetLengthUnitsPerMeter } from '../core_c.js';

export const b2_lengthUnitsPerMeter = 1.0;

// Used to detect bad values. Positions greater than about 16km will have precision
// problems, so 100km as a limit should be fine in all cases.
export const B2_HUGE= 100000.0 * b2_lengthUnitsPerMeter;

// Maximum number of colors in the constraint graph. Constraints that cannot
// find a color are added to the overflow set which are solved single-threaded.
export const b2_graphColorCount = 2;

// A small length used as a collision and constraint tolerance. Usually it is
// chosen to be numerically significant, but visually insignificant. In meters.
// @warning modifying this can have a significant impact on stability
export const b2_linearSlop = 0.005 * b2_lengthUnitsPerMeter;

// Maximum number of simultaneous worlds that can be allocated
export const B2_MAX_WORLDS = 16;

// The maximum rotation of a body per time step. This limit is very large and is used
// to prevent numerical problems. You shouldn't need to adjust this.
// @warning increasing this to 0.5 * Math.PI or greater will break continuous collision.
export const B2_MAX_ROTATION = 0.25 * Math.PI;

// @warning modifying this can have a significant impact on performance and stability
export const b2_speculativeDistance = 4.0 * b2_linearSlop;

// This is used to fatten AABBs in the dynamic tree. This allows proxies
// to move by a small amount without triggering a tree adjustment.
// This is in meters.
// @warning modifying this can have a significant impact on performance
export const b2_aabbMargin = 0.1 * b2_lengthUnitsPerMeter;

// The time that a body must be still before it will go to sleep. In seconds.
export const b2_timeToSleep = 0.5;

// Returns the number of elements of an array
export function B2_ARRAY_COUNT(A)
{
    return A.length;
}

//
// Unsupported API features
//

/**
 * @summary Sets custom memory allocator functions for Box2D (Not supported in Phaser Box2D JS)
 * @function b2SetAllocator
 * @returns {void}
 * @description
 * This function is intended to set custom memory allocation and deallocation functions
 * for Box2D. However, in the Phaser Box2D JS implementation, this functionality
 * is not supported and will only generate a warning message.
 * @throws {Warning} Outputs a console warning indicating lack of support
 */
export function b2SetAllocator()
{
    console.warn("b2SetAllocator not supported");
}

/**
 * @summary Returns the byte count for Box2D memory usage.
 * @function b2GetByteCount
 * @returns {void}
 * @description
 * This function is a stub that warns users that byte count tracking is not
 * supported in the JavaScript implementation of Box2D for Phaser.
 */
export function b2GetByteCount()
{
    console.warn("b2GetByteCount not supported");
}

/**
 * @summary Creates a timer object for performance measurement.
 * @function b2CreateTimer
 * @returns {void} A timer object for measuring elapsed time.
 * @description
 * This function creates a timer object but is not supported in the Phaser Box2D JS implementation.
 * When called, it issues a console warning about lack of support.
 */
export function b2CreateTimer()
{
    console.warn("b2CreateTimer not supported");
}

/**
 * @summary Gets system ticks for timing purposes
 * @function b2GetTicks
 * @returns {void} Returns 0 since this function not supported
 * @description
 * This is a stub function that exists for compatibility with Box2D but is not
 * implemented in the Phaser Box2D JS port. It logs a warning when called.
 * @throws {Warning} Logs a console warning that the function is not supported
 */
export function b2GetTicks()
{
    console.warn("b2GetTicks not supported");
}

/**
 * @summary Gets the elapsed time in milliseconds.
 * @function b2GetMilliseconds
 * @returns {void} The elapsed time in milliseconds.
 * @description
 * This function is a stub that warns that millisecond timing is not supported
 * in the Phaser Box2D JS implementation.
 * @throws {Warning} Console warning indicating lack of support.
 */
export function b2GetMilliseconds()
{
    console.warn("b2GetMilliseconds not supported");
}

/**
 * @summary Gets elapsed milliseconds from a b2Timer and resets it.
 * @function b2GetMillisecondsAndReset
 * @returns {void} The elapsed time in milliseconds
 * @description
 * This function returns the elapsed milliseconds from a Box2D timer object and resets it.
 * In the JavaScript implementation for Phaser Box2D, this functionality is not supported
 * and will trigger a warning.
 * @throws {Warning} Logs a console warning that this function is not supported
 */
export function b2GetMillisecondsAndReset()
{
    console.warn("b2GetMillisecondsAndReset not supported");
}

/**
 * @summary Placeholder function for sleep functionality in Box2D JS
 * @function b2SleepMilliseconds
 * @param {number} ms - The number of milliseconds to sleep
 * @returns {void}
 * @description
 * This function is a stub that issues a warning message when called, as the sleep
 * functionality is not supported in the Phaser Box2D JS implementation.
 */
export function b2SleepMilliseconds(ms)
{
    console.warn("b2SleepMilliseconds not supported");
}

/**
 * @summary Placeholder function for b2Yield functionality
 * @function b2Yield
 * @returns {void}
 * @description
 * This function serves as a placeholder for Box2D's b2Yield functionality, which is not supported
 * in the Phaser Box2D JS implementation. When called, it emits a warning to the console.
 */
export function b2Yield()
{
    console.warn("b2Yield not supported");
}

