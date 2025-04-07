/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2IsNormalized, b2Length, b2Vec2, eps } from "./include/math_functions_h.js";

/**
 * @namespace MathFunctions
 */

/**
 * @import {b2Rot} from './include/math_functions_h.js'
 */

/**
 * @summary Checks if a number is valid (finite and not NaN).
 * @function b2IsValid
 * @param {number} a - The number to validate.
 * @returns {boolean} True if the number is valid (finite and not NaN), false otherwise.
 * @description
 * This function performs a validation check on a number by ensuring it is both
 * finite and not NaN (Not a Number).
 */
export function b2IsValid(a)
{
    return !isNaN(a) && isFinite(a);
}

/**
 * Validates a b2Vec2 object by checking if it exists and its components are valid numbers.
 * @function b2Vec2_IsValid
 * @param {b2Vec2} v - The vector to validate, containing x and y components.
 * @returns {boolean} True if the vector exists and both x and y components are valid numbers.
 */
export function b2Vec2_IsValid(v)
{
    return !isNaN(v.x) && !isNaN(v.y) && isFinite(v.x) && isFinite(v.y);
}

/**
 * Validates a 2D rotation object.
 * @function b2Rot_IsValid
 * @param {b2Rot} q - A rotation object containing sine (s) and cosine (c) components
 * @returns {boolean} True if the rotation is valid, false otherwise
 * @description
 * Checks if a b2Rot object is valid by verifying:
 * 1. The object exists
 * 2. Both sine and cosine components contain valid numbers
 * 3. The rotation is properly normalized (s² + c² = 1)
 */
export function b2Rot_IsValid(q)
{
    if (isNaN(q.s) || isNaN(q.c) || !isFinite(q.s) || !isFinite(q.c))
    {
        return false;
    }

    return b2IsNormalized(q);
}

/**
 * @function b2Normalize
 * @summary Normalizes a 2D vector to unit length.
 * @param {b2Vec2} v - The vector to normalize.
 * @returns {(b2Vec2|boolean)} Returns a new normalized b2Vec2 if successful, or false if the input is null.
 * If the vector length is less than epsilon, returns a zero vector (0,0).
 * @description
 * Normalizes the input vector by dividing its components by its length.
 * If the vector's length is greater than the epsilon value, the function
 * returns a new vector with the same direction but unit length.
 */
export function b2Normalize(v)
{
    const length = b2Length(v);

    if (length < eps)
    {
        return new b2Vec2( 0, 0 );
    }

    const invLength = 1.0 / length;

    return new b2Vec2( invLength * v.x, invLength * v.y );
}

/**
 * Normalizes a 2D vector and performs length validation.
 * @function b2NormalizeChecked
 * @param {b2Vec2} v - The vector to normalize.
 * @returns {b2Vec2} A new normalized vector with unit length.
 * @throws {Error} Throws an assertion error if the vector length is less than or equal to eps.
 */
export function b2NormalizeChecked(v)
{
    const length = b2Length(v);

    if (length < eps)
    {
        // B2_ASSERT(false);
        return new b2Vec2( 0, 0 );
    }

    const invLength = 1.0 / length;

    return new b2Vec2( invLength * v.x, invLength * v.y );
}

/**
 * Calculates the length of a vector and returns its normalized form.
 * @function b2GetLengthAndNormalize
 * @param {b2Vec2} v - The input vector to normalize
 * @returns {{length: number, normal: b2Vec2}} An object containing:
 * - length: The original length of the vector
 * - normal: A normalized vector (unit length) in the same direction as v.
 * Returns (0,0) if the input vector length is below epsilon
 */
export function b2GetLengthAndNormalize(v)
{
    const length = b2Length(v);

    if (length < eps)
    {
        return { length: 0, normal: new b2Vec2(0, 0) };// PJB: the C version returns the vec2 here and the length via parameter float* length
    }

    const invLength = 1.0 / length;

    return { length: length, normal: new b2Vec2( invLength * v.x, invLength * v.y ) };// PJB: the C version returns the vec2 here and the length via parameter float* length
}
