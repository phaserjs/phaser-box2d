export function B2_ARRAY_COUNT(A: any): any;
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
export function b2SetAllocator(): void;
/**
 * @summary Returns the byte count for Box2D memory usage.
 * @function b2GetByteCount
 * @returns {void}
 * @description
 * This function is a stub that warns users that byte count tracking is not
 * supported in the JavaScript implementation of Box2D for Phaser.
 */
export function b2GetByteCount(): void;
/**
 * @summary Creates a timer object for performance measurement.
 * @function b2CreateTimer
 * @returns {void} A timer object for measuring elapsed time.
 * @description
 * This function creates a timer object but is not supported in the Phaser Box2D JS implementation.
 * When called, it issues a console warning about lack of support.
 */
export function b2CreateTimer(): void;
/**
 * @summary Gets system ticks for timing purposes
 * @function b2GetTicks
 * @returns {void} Returns 0 since this function not supported
 * @description
 * This is a stub function that exists for compatibility with Box2D but is not
 * implemented in the Phaser Box2D JS port. It logs a warning when called.
 * @throws {Warning} Logs a console warning that the function is not supported
 */
export function b2GetTicks(): void;
/**
 * @summary Gets the elapsed time in milliseconds.
 * @function b2GetMilliseconds
 * @returns {void} The elapsed time in milliseconds.
 * @description
 * This function is a stub that warns that millisecond timing is not supported
 * in the Phaser Box2D JS implementation.
 * @throws {Warning} Console warning indicating lack of support.
 */
export function b2GetMilliseconds(): void;
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
export function b2GetMillisecondsAndReset(): void;
/**
 * @summary Placeholder function for sleep functionality in Box2D JS
 * @function b2SleepMilliseconds
 * @param {number} ms - The number of milliseconds to sleep
 * @returns {void}
 * @description
 * This function is a stub that issues a warning message when called, as the sleep
 * functionality is not supported in the Phaser Box2D JS implementation.
 */
export function b2SleepMilliseconds(ms: number): void;
/**
 * @summary Placeholder function for b2Yield functionality
 * @function b2Yield
 * @returns {void}
 * @description
 * This function serves as a placeholder for Box2D's b2Yield functionality, which is not supported
 * in the Phaser Box2D JS implementation. When called, it emits a warning to the console.
 */
export function b2Yield(): void;
export const b2_lengthUnitsPerMeter: 1;
export const B2_HUGE: number;
export const b2_graphColorCount: 2;
export const b2_linearSlop: number;
export const B2_MAX_WORLDS: 16;
export const B2_MAX_ROTATION: number;
export const b2_speculativeDistance: number;
export const b2_aabbMargin: number;
export const b2_timeToSleep: 0.5;
export { B2_NULL_INDEX, b2GetVersion, b2SetAssertFcn, b2SetLengthUnitsPerMeter, b2GetLengthUnitsPerMeter } from "../core_c.js";
