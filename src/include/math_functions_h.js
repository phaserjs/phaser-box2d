/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2GetLengthAndNormalize } from '../math_functions_c.js';

export const B2_PI = 3.14159265359;
export const eps = 1.0e-10;
export const epsSqr = eps * eps;

export const GlobalDebug = {
    b2Vec2Count: 0,
    b2Rot2Count: 0,
    b2ManifoldCount: 0,
    b2ManifoldPointCount: 0,
    b2FrameCount: 0,
    b2PolyCollideCount: 0,
    b2ContactSimCount: 0,
    b2TOIInputCount: 0,
    b2ShapeCastPairInputCount: 0,
    b2SweepCount: 0
};

export const b2Vec2Where = {
    calls: {}
};

export const b2Rot2Where = {
    calls: {}
};

export const b2ManifoldPointWhere = {
    calls: {}
};

export const b2ManifoldWhere = {
    calls: {}
};

/**
 * @class b2Vec2
 * @summary 2D vector This can be used to represent a point or free vector
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 */
class b2Vec2
{
    constructor(x = 0, y = 0)
    {
        // track number created
        // GlobalDebug.b2Vec2Count++;

        // // track where they were created
        // const lines = new Error().stack.split('\n');
        // const [, file1, line1, column1] = (lines[1] || '').match(/[@](\S+):(\d+):(\d+)/) || [];
        // const [, file2, line2, column2] = (lines[2] || '').match(/[@](\S+):(\d+):(\d+)/) || [];
        // const key = `${file1}:${line1} <- ${file2}:${line2}`;
        // if (b2Vec2Where.calls[key] == undefined) b2Vec2Where.calls[key] = 0;
        // b2Vec2Where.calls[key]++;

        this.x = x;
        this.y = y;
    }

    copy(v)
    {
        this.x = v.x;
        this.y = v.y;

        return this;
    }

    clone()
    {
        return new b2Vec2(this.x, this.y);
    }
}

/**
 * @class b2Rot
 * @summary 2D rotation. This is similar to using a complex number for rotation
 * @property {number} s - The sine component of the rotation
 * @property {number} c - The cosine component of the rotation
 */
class b2Rot
{
    constructor(c = 1, s = 0)
    {
        // track number created
        // GlobalDebug.b2Rot2Count++;

        // // track where they were created
        // const lines = new Error().stack.split('\n');
        // const [, file1, line1, column1] = (lines[1] || '').match(/[@](\S+):(\d+):(\d+)/) || [];
        // const [, file2, line2, column2] = (lines[2] || '').match(/[@](\S+):(\d+):(\d+)/) || [];
        // const key = `${file1}:${line1} <- ${file2}:${line2}`;
        // if (b2Rot2Where.calls[key] == undefined) b2Rot2Where.calls[key] = 0;
        // b2Rot2Where.calls[key]++;

        this.c = c;
        this.s = s;
    }

    copy(r)
    {
        this.c = r.c;
        this.s = r.s;

        return this;
    }

    clone()
    {
        return new b2Rot(this.c, this.s);
    }
}

/**
 * @class b2Transform
 * @summary A 2D rigid transform
 * @property {b2Vec2} p - Position vector
 * @property {b2Rot} q - Rotation component
 */
class b2Transform
{
    constructor(p = null, q = null)
    {
        this.p = p;
        this.q = q;
    }

    static identity()
    {
        return new b2Transform(new b2Vec2(), new b2Rot());
    }

    clone()
    {
        const xf = new b2Transform(this.p, this.q);

        return xf;
    }

    deepClone()
    {
        const xf = new b2Transform(this.p.clone(), this.q.clone());

        return xf;
    }
}

/**
 * @class b2Mat22
 * @summary A 2-by-2 Matrix
 * @property {b2Vec2} cy - Matrix columns
 */
class b2Mat22
{
    constructor(cx = new b2Vec2(), cy = new b2Vec2())
    {
        this.cx = cx;
        this.cy = cy;
    }

    clone()
    {
        return new b2Mat22(this.cx.clone(), this.cy.clone());
    }
}

/**
 * @class b2AABB
 * @summary Axis-aligned bounding box
 * @property {b2Vec2} lowerBound - The lower vertex of the bounding box
 * @property {b2Vec2} upperBound - The upper vertex of the bounding box
 */
class b2AABB
{
    constructor(lowerx = 0, lowery = 0, upperx = 0, uppery = 0)
    {
        this.lowerBoundX = lowerx;
        this.lowerBoundY = lowery;
        this.upperBoundX = upperx;
        this.upperBoundY = uppery;
    }
}

// Constants
// PJB replaced with 'new' in each case. TODO: use an improved const as suggested by Claude
// const b2Rot_identity = new b2Rot(1, 0);
// const b2Transform_identity = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
// const b2Mat22_zero = new b2Mat22(new b2Vec2(0, 0), new b2Vec2(0, 0));

// Inline functions

/**
 * @summary Returns the minimum of two numbers.
 * @function b2MinFloat
 * @param {number} a - First number to compare
 * @param {number} b - Second number to compare
 * @returns {number} The smaller of the two input numbers
 */
function b2MinFloat(a, b)
{
    return a < b ? a : b;
}

/**
 * @summary Returns the larger of two numbers.
 * @function b2MaxFloat
 * @param {number} a - First number to compare
 * @param {number} b - Second number to compare
 * @returns {number} The maximum value between a and b
 */
function b2MaxFloat(a, b)
{
    return a > b ? a : b;
}

/**
 * @summary Returns the absolute value of a number
 * @function b2AbsFloat
 * @param {number} a - The input number
 * @returns {number} The absolute value of the input
 * @description
 * An implementation of absolute value that returns the positive magnitude
 * of the input number.
 */
function b2AbsFloat(a)
{
    return a < 0 ? -a : a;
}

/**
 * @summary Clamps a floating point value between a lower and upper bound.
 * @function b2ClampFloat
 * @param {number} a - The value to clamp
 * @param {number} lower - The lower bound
 * @param {number} upper - The upper bound
 * @returns {number} The clamped value between lower and upper bounds
 * @description
 * Returns lower if a < lower, upper if a > upper, otherwise returns a.
 */
function b2ClampFloat(a, lower, upper)
{
    return a < lower ? lower : (a > upper ? upper : a);
}

/**
 * @summary Returns the smaller of two integers.
 * @function b2MinInt
 * @param {number} a - First integer to compare
 * @param {number} b - Second integer to compare
 * @returns {number} The smaller of the two input integers
 * @description
 * A comparison function that returns the minimum value between two integers
 * using a ternary operator.
 */
function b2MinInt(a, b)
{
    return a < b ? a : b;
}

/**
 * @summary Returns the larger of two integers.
 * @function b2MaxInt
 * @param {number} a - First integer to compare
 * @param {number} b - Second integer to compare
 * @returns {number} The larger of the two input integers
 */
function b2MaxInt(a, b)
{
    return a > b ? a : b;
}

/**
 * @summary Returns the absolute value of an integer.
 * @function b2AbsInt
 * @param {number} a - The integer input value.
 * @returns {number} The absolute value of the input.
 * @description
 * Computes the absolute value of an integer using conditional logic rather than Math.abs().
 */
function b2AbsInt(a)
{
    return a < 0 ? -a : a;
}

/**
 * Clamps an integer value between a lower and upper bound.
 * @function b2ClampInt
 * @param {number} a - The integer value to clamp
 * @param {number} lower - The lower bound (inclusive)
 * @param {number} upper - The upper bound (inclusive)
 * @returns {number} The clamped integer value
 * @description
 * Returns lower if a < lower, upper if a > upper, otherwise returns a.
 */
function b2ClampInt(a, lower, upper)
{
    return a < lower ? lower : (a > upper ? upper : a);
}

/**
 * @summary Calculates the dot product of two 2D vectors.
 * @function b2Dot
 * @param {b2Vec2} a - First 2D vector.
 * @param {b2Vec2} b - Second 2D vector.
 * @returns {number} The dot product of vectors a and b.
 * @description
 * Computes the dot product (scalar product) of two 2D vectors using the formula:
 * dot = a.x * b.x + a.y * b.y
 */
function b2Dot(a, b)
{
    return a.x * b.x + a.y * b.y;
}

/**
 * Computes the 2D cross product of two vectors.
 * @function b2Cross
 * @param {b2Vec2} a - The first 2D vector
 * @param {b2Vec2} b - The second 2D vector
 * @returns {number} The cross product (a.x * b.y - a.y * b.x)
 * @description
 * Calculates the cross product between two 2D vectors, which represents
 * the signed area of the parallelogram formed by these vectors.
 */
function b2Cross(a, b)
{
    return a.x * b.y - a.y * b.x;
}

/**
 * @summary Performs a cross product between a 2D vector and a scalar.
 * @function b2CrossVS
 * @param {b2Vec2} v - The input vector
 * @param {number} s - The scalar value
 * @returns {b2Vec2} A new vector where x = s * v.y and y = -s * v.x
 * @description
 * Computes the cross product of a vector and scalar, returning a new vector
 * that is perpendicular to the input vector and scaled by the scalar value.
 */
function b2CrossVS(v, s)
{
    return new b2Vec2(s * v.y, -s * v.x);
}

/**
 * Performs a cross product between a scalar and a 2D vector.
 * @function b2CrossSV
 * @param {number} s - The scalar value
 * @param {b2Vec2} v - The 2D vector
 * @returns {b2Vec2} A new vector perpendicular to the input vector, scaled by s
 * @description
 * Computes s × v, where × denotes the cross product.
 * The result is a new vector (-s * v.y, s * v.x).
 */
function b2CrossSV(s, v)
{
    return new b2Vec2(-s * v.y, s * v.x);
}

/**
 * @summary Returns a vector rotated 90 degrees counter-clockwise.
 * @function b2LeftPerp
 * @param {b2Vec2} v - The input vector to rotate.
 * @returns {b2Vec2} A new vector perpendicular to the input, rotated 90 degrees counter-clockwise.
 * @description
 * Creates a new vector that is perpendicular to the input vector by rotating it
 * 90 degrees counter-clockwise. The new vector is computed by setting the x component
 * to the negative y component of the input, and the y component to the x component
 * of the input.
 */
function b2LeftPerp(v)
{
    return new b2Vec2(-v.y, v.x);
}

/**
 * @summary Returns a vector rotated 90 degrees clockwise.
 * @function b2RightPerp
 * @param {b2Vec2} v - The input vector to rotate.
 * @returns {b2Vec2} A new vector perpendicular to the input, rotated 90 degrees clockwise.
 * @description
 * Creates a new vector that is perpendicular (rotated 90 degrees clockwise) to the input vector.
 * For a vector (x,y), returns (y,-x).
 */
function b2RightPerp(v)
{
    return new b2Vec2(v.y, -v.x);
}

/**
 * @summary Adds two 2D vectors.
 * @function b2Add
 * @param {b2Vec2} a - The first vector.
 * @param {b2Vec2} b - The second vector.
 * @returns {b2Vec2} A new vector representing the sum of the input vectors (a + b).
 * @description
 * Creates a new b2Vec2 where the x and y components are the sums of the
 * corresponding components of the input vectors.
 */
function b2Add(a, b)
{
    return new b2Vec2(a.x + b.x, a.y + b.y);
}

/**
 * @summary Subtracts two 2D vectors.
 * @function b2Sub
 * @param {b2Vec2} a - The first vector.
 * @param {b2Vec2} b - The second vector.
 * @returns {b2Vec2} A new vector representing (a - b).
 * @description
 * Creates a new 2D vector by subtracting the components of vector b from vector a.
 * The resulting vector has coordinates (a.x - b.x, a.y - b.y).
 */
function b2Sub(a, b)
{
    return new b2Vec2(a.x - b.x, a.y - b.y);
}

/**
 * @summary Returns the negation of a 2D vector.
 * @function b2Neg
 * @param {b2Vec2} a - The input vector to negate.
 * @returns {b2Vec2} A new vector with components (-a.x, -a.y).
 * @description
 * Creates a new b2Vec2 with the negated x and y components of the input vector.
 */
function b2Neg(a)
{
    return new b2Vec2(-a.x, -a.y);
}

/**
 * @function b2Lerp
 * @summary Performs linear interpolation between two 2D vectors.
 * @param {b2Vec2} a - The starting vector
 * @param {b2Vec2} b - The ending vector
 * @param {number} t - The interpolation parameter between 0 and 1
 * @returns {b2Vec2} A new vector representing the interpolated point
 * @description
 * Calculates a point that lies on the straight line between vectors a and b,
 * where t=0 returns a, t=1 returns b, and values in between return proportionally
 * interpolated points.
 */
function b2Lerp(a, b, t)
{
    return new b2Vec2((1 - t) * a.x + t * b.x, (1 - t) * a.y + t * b.y);
}

/**
 * @summary Performs component-wise multiplication of two 2D vectors.
 * @function b2Mul
 * @param {b2Vec2} a - First 2D vector with x and y components.
 * @param {b2Vec2} b - Second 2D vector with x and y components.
 * @returns {b2Vec2} A new vector where each component is the product of the corresponding components of a and b.
 * @description
 * Multiplies the x components of both vectors together and the y components of both vectors together,
 * returning a new b2Vec2 with these products as its components.
 */
function b2Mul(a, b)
{
    return new b2Vec2(a.x * b.x, a.y * b.y);
}

/**
 * @summary Multiplies a scalar value with a 2D vector.
 * @function b2MulSV
 * @param {number} s - The scalar value to multiply with the vector.
 * @param {b2Vec2} v - The 2D vector to be multiplied.
 * @returns {b2Vec2} A new b2Vec2 representing the scaled vector (s * v).
 * @description
 * Performs scalar multiplication on a 2D vector, where each component
 * of the vector is multiplied by the scalar value.
 */
function b2MulSV(s, v)
{
    return new b2Vec2(s * v.x, s * v.y);
}

/**
 * @function b2MulAdd
 * @summary Performs vector addition with scalar multiplication (a + s * b).
 * @param {b2Vec2} a - First vector operand
 * @param {number} s - Scalar multiplier
 * @param {b2Vec2} b - Second vector operand
 * @returns {b2Vec2} A new vector representing the result of a + s * b
 */
function b2MulAdd(a, s, b)
{
    return new b2Vec2(a.x + s * b.x, a.y + s * b.y);
}

function b2MulAddOut(a, s, b, out)
{
    out.x = a.x + s * b.x;
    out.y = a.y + s * b.y;
}

/**
 * @function b2MulSub
 * @summary Performs vector subtraction with scalar multiplication: a - s * b
 * @param {b2Vec2} a - The first vector operand
 * @param {number} s - The scalar multiplier
 * @param {b2Vec2} b - The second vector operand
 * @returns {b2Vec2} A new vector representing the result of a - s * b
 */
function b2MulSub(a, s, b)
{
    return new b2Vec2(a.x - s * b.x, a.y - s * b.y);
}

function b2DotSub(sub1, sub2, dot)
{
    const subX = sub1.x - sub2.x;
    const subY = sub1.y - sub2.y;

    return subX * dot.x + subY * dot.y;
}

/**
 * Returns a new b2Vec2 with the absolute values of the input vector's components.
 * @function b2Abs
 * @param {b2Vec2} a - The input vector whose components will be converted to absolute values.
 * @returns {b2Vec2} A new vector containing the absolute values of the input vector's x and y components.
 */
function b2Abs(a)
{
    return new b2Vec2(Math.abs(a.x), Math.abs(a.y));
}

/**
 * @function b2Min
 * @summary Returns a new vector containing the minimum x and y components from two vectors.
 * @param {b2Vec2} a - First 2D vector
 * @param {b2Vec2} b - Second 2D vector
 * @returns {b2Vec2} A new vector with x = min(a.x, b.x) and y = min(a.y, b.y)
 */
function b2Min(a, b)
{
    return new b2Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
}

/**
 * @function b2Max
 * @summary Returns a new vector containing the component-wise maximum values from two vectors.
 * @param {b2Vec2} a - First input vector
 * @param {b2Vec2} b - Second input vector
 * @returns {b2Vec2} A new vector where each component is the maximum of the corresponding components from vectors a and b
 * @description
 * Creates a new b2Vec2 where:
 * - x component is the maximum of a.x and b.x
 * - y component is the maximum of a.y and b.y
 */
function b2Max(a, b)
{
    return new b2Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
}

/**
 * @function b2Clamp
 * @summary Clamps a 2D vector's components between minimum and maximum bounds.
 * @param {b2Vec2} v - The vector to clamp
 * @param {b2Vec2} a - The minimum bounds vector
 * @param {b2Vec2} b - The maximum bounds vector
 * @returns {b2Vec2} A new vector with components clamped between a and b
 * @description
 * Creates a new 2D vector where each component (x,y) is clamped between
 * the corresponding components of vectors a and b. Uses b2ClampFloat
 * internally to clamp individual components.
 */
function b2Clamp(v, a, b)
{
    return new b2Vec2(
        b2ClampFloat(v.x, a.x, b.x),
        b2ClampFloat(v.y, a.y, b.y)
    );
}

/**
 * @summary Calculates the length (magnitude) of a 2D vector.
 * @function b2Length
 * @param {b2Vec2} v - A 2D vector with x and y components.
 * @returns {number} The scalar length of the vector.
 * @description
 * Computes the Euclidean length of a 2D vector using the formula sqrt(x² + y²).
 */
function b2Length(v)
{
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

function b2LengthXY(x, y)
{
    return Math.sqrt(x * x + y * y);
}

/**
 * @summary Calculates the squared length (magnitude) of a 2D vector.
 * @function b2LengthSquared
 * @param {b2Vec2} v - A 2D vector with x and y components.
 * @returns {number} The squared length of the vector (x² + y²).
 * @description
 * Computes the dot product of a vector with itself, which gives the squared
 * length of the vector without performing a square root operation.
 */
function b2LengthSquared(v)
{
    return v.x * v.x + v.y * v.y;
}

/**
 * @function b2Distance
 * @summary Calculates the Euclidean distance between two 2D points.
 * @param {b2Vec2} a - The first 2D vector point
 * @param {b2Vec2} b - The second 2D vector point
 * @returns {number} The distance between points a and b
 * @description
 * Computes the straight-line distance between two points using the Pythagorean theorem.
 */
function b2Distance(a, b)
{
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @function b2DistanceSquared
 * @summary Calculates the squared distance between two 2D points.
 * @param {b2Vec2 | {x: number, y: number}} a - The first 2D vector point
 * @param {b2Vec2 | {x: number, y: number}} b - The second 2D vector point
 * @returns {number} The squared distance between points a and b
 * @description
 * Computes the squared Euclidean distance between two points without taking the square root.
 * The calculation is (b.x - a.x)² + (b.y - a.y)²
 */
function b2DistanceSquared(a, b)
{
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return dx * dx + dy * dy;
}

/**
 * Creates a new b2Rot object representing a 2D rotation.
 * @function b2MakeRot
 * @param {number} angle - The rotation angle in radians
 * @returns {b2Rot} A new b2Rot object containing the cosine and sine of the input angle
 * @description
 * Constructs a b2Rot object by computing the cosine and sine of the provided angle.
 * The resulting b2Rot contains these values as its 'c' and 's' components respectively.
 */
function b2MakeRot(angle)
{
    return new b2Rot(Math.cos(angle), Math.sin(angle));
}

/**
 * Normalizes a rotation by scaling its components to create a unit vector.
 * @function b2NormalizeRot
 * @param {b2Rot} q - A rotation object containing cosine (c) and sine (s) components
 * @returns {b2Rot} A new normalized b2Rot object where the components form a unit vector
 * @description
 * Computes the magnitude of the rotation vector and divides both components by it
 * to create a normalized rotation. If the magnitude is 0, returns a default rotation.
 */
function b2NormalizeRot(q)
{
    const mag = Math.sqrt(q.s * q.s + q.c * q.c);
    const invMag = mag > 0 ? 1 / mag : 0;

    return new b2Rot(q.c * invMag, q.s * invMag);
}

function b2InvMagRot(c, s)
{
    const mag = Math.sqrt(s * s + c * c);
    const invMag = mag > 0 ? 1 / mag : 0;

    return invMag;
}

/**
 * @function b2IsNormalized
 * @summary Checks if a rotation is properly normalized.
 * @param {b2Rot} q - A rotation object containing sine (s) and cosine (c) components
 * @returns {boolean} True if the rotation is normalized within a tolerance of 6e-4
 * @description
 * Verifies that the sum of squares of the sine and cosine components
 * equals 1 within a tolerance of ±6e-4, which indicates a valid rotation.
 */
function b2IsNormalized(q)
{
    const qq = q.s * q.s + q.c * q.c;

    return 1 - 0.0006 < qq && qq < 1 + 0.0006;
}

/**
 * @function b2NLerp
 * @summary Performs normalized linear interpolation between two rotations.
 * @param {b2Rot} q1 - The first rotation
 * @param {b2Rot} q2 - The second rotation
 * @param {number} t - Interpolation factor between 0 and 1
 * @returns {b2Rot} The normalized interpolated rotation
 * @description
 * Linearly interpolates between two rotations and normalizes the result.
 * When t=0 returns q12, when t=1 returns q22.
 */
function b2NLerp(q1, q2, t)
{
    const omt = 1 - t;
    const q = new b2Rot(
        omt * q1.c + t * q2.c,
        omt * q1.s + t * q2.s
    );

    return b2NormalizeRot(q);
}

/**
 * @function b2IntegrateRotation
 * @summary Integrates a rotation by a specified angle while maintaining normalization.
 * @param {b2Rot} q1 - The initial rotation.
 * @param {number} deltaAngle - The angle to rotate by, in radians.
 * @returns {b2Rot} A new normalized rotation after applying the integration.
 * @description
 * Performs rotation integration while ensuring the resulting rotation remains
 * normalized through magnitude scaling. The function handles the case where
 * magnitude could be zero by returning a default rotation.
 */
function b2IntegrateRotation(q1, deltaAngle)
{
    const q2C =  q1.c - deltaAngle * q1.s;
    const q2S =  q1.s + deltaAngle * q1.c;
    const mag = Math.sqrt(q2S * q2S + q2C * q2C);
    const invMag = mag > 0 ? 1 / mag : 0;

    return new b2Rot(q2C * invMag, q2S * invMag);
}

function b2IntegrateRotationOut(q1, deltaAngle, out)
{
    const q2C =  q1.c - deltaAngle * q1.s;
    const q2S =  q1.s + deltaAngle * q1.c;
    const mag = Math.sqrt(q2S * q2S + q2C * q2C);
    const invMag = mag > 0 ? 1 / mag : 0;
    out.c = q2C * invMag;
    out.s = q2S * invMag;
}

/**
 * @function b2ComputeAngularVelocity
 * @summary Computes the angular velocity between two rotations given a time step.
 * @param {b2Rot} q1 - The first rotation
 * @param {b2Rot} q2 - The second rotation
 * @param {number} inv_h - The inverse of the time step (1/dt)
 * @returns {number} The computed angular velocity in radians per second
 * @description
 * Calculates the angular velocity by comparing two rotations and dividing by the time step.
 * Uses the formula (θ2 - θ1)/dt where θ is extracted from the rotations using their sine
 * and cosine components.
 */
function b2ComputeAngularVelocity(q1, q2, inv_h)
{
    return inv_h * (q2.s * q1.c - q2.c * q1.s);
}

/**
 * @function b2Rot_GetAngle
 * @summary Gets the angle of a rotation object in radians.
 * @param {b2Rot} q - A rotation object containing cosine (c) and sine (s) components.
 * @returns {number} The angle in radians, calculated using arctangent of s/c.
 * @description
 * Calculates the angle of a rotation by computing the arctangent of the sine
 * component divided by the cosine component using Math.atan2.
 */
function b2Rot_GetAngle(q)
{
    return Math.atan2(q.s, q.c);
}

/**
 * Returns the x-axis vector from a rotation matrix.
 * @function b2Rot_GetXAxis
 * @param {b2Rot} q - A rotation matrix containing cosine (c) and sine (s) components
 * @returns {b2Vec2} A 2D vector representing the x-axis direction (c, s)
 * @description
 * Extracts the x-axis direction vector from a rotation matrix by returning
 * a vector containing the cosine component in x and sine component in y.
 */
function b2Rot_GetXAxis(q)
{
    return new b2Vec2(q.c, q.s);
}

/**
 * Returns the Y axis vector from a rotation matrix.
 * @function b2Rot_GetYAxis
 * @param {b2Rot} q - A rotation matrix containing cosine (c) and sine (s) components
 * @returns {b2Vec2} A 2D vector (-sin, cos) representing the Y axis of the rotation
 * @description
 * Extracts the Y axis vector from a rotation matrix by returning the vector (-sin, cos).
 * This represents the vertical basis vector of the rotated coordinate system.
 */
function b2Rot_GetYAxis(q)
{
    return new b2Vec2(-q.s, q.c);
}

/**
 * @function b2MulRot
 * @summary Multiplies two rotations together.
 * @param {b2Rot} q - First rotation
 * @param {b2Rot} r - Second rotation
 * @returns {b2Rot} A new rotation representing the product of the two input rotations
 * @description
 * Performs rotation multiplication by combining the cosine and sine components
 * of two b2Rot objects using the formula:
 * result.c = q4.c * r.c - q4.s * r.s
 * result.s = q4.s * r.c + q4.c * r.s
 */
function b2MulRot(q, r)
{
    return new b2Rot(
        q.c * r.c - q.s * r.s,
        q.s * r.c + q.c * r.s
    );
}

function b2MulRotC(q, r)
{
    return q.c * r.c - q.s * r.s;
}

function b2MulRotS(q, r)
{
    return q.s * r.c + q.c * r.s;
}

/**
 * @function b2InvMulRot
 * @summary Multiplies the inverse of the first rotation with the second rotation.
 * @param {b2Rot} q - The first rotation to be inverted
 * @param {b2Rot} r - The second rotation to be multiplied
 * @returns {b2Rot} A new rotation representing q^-1 * r
 * @description
 * Computes the product of the inverse of rotation q with rotation r.
 * For rotations, the inverse multiplication is equivalent to using the transpose
 * of the rotation matrix.
 */
function b2InvMulRot(q, r)
{
    return new b2Rot(
        q.c * r.c + q.s * r.s,
        q.c * r.s - q.s * r.c
    );
}

/**
 * @function b2RelativeAngle
 * @summary Calculates the relative angle between two rotations.
 * @param {b2Rot} b - The first rotation
 * @param {b2Rot} a - The second rotation
 * @returns {number} The relative angle in radians between the two rotations
 * @description
 * Computes the angle between two rotations by using their sine and cosine components.
 * The result is the angle needed to rotate from rotation 'a' to rotation 'b'.
 */
function b2RelativeAngle(b, a)
{
    const s = b.s * a.c - b.c * a.s;
    const c = b.c * a.c + b.s * a.s;

    return Math.atan2(s, c);
}

/**
 * @function b2UnwindAngle
 * @summary Normalizes an angle to be within the range [-π, π].
 * @param {number} angle - The input angle in radians to normalize.
 * @returns {number} The normalized angle in radians within the range [-π, π].
 * @description
 * This function takes an angle in radians and ensures it falls within the range [-π, π]
 * by adding or subtracting 2π as needed. If the input angle is already within
 * the valid range, it is returned unchanged.
 */
function b2UnwindAngle(angle)
{
    if (angle < -B2_PI)
    {
        return angle + 2 * B2_PI;
    }
    else if (angle > B2_PI)
    {
        return angle - 2 * B2_PI;
    }

    return angle;
}

/**
 * @function b2RotateVector
 * @summary Rotates a 2D vector by a given rotation
 * @param {b2Rot} q - A rotation object containing cosine (c) and sine (s) components
 * @param {b2Vec2} v - The vector to rotate
 * @returns {b2Vec2} A new vector representing the rotated result
 * @description
 * Applies a 2D rotation to a vector using the formula:
 * x' = c*x - s*y
 * y' = s*x + c*y
 * where (x,y) is the input vector and (c,s) represents the rotation
 */
function b2RotateVector(q, v)
{
    return new b2Vec2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
}

/**
 * @function b2InvRotateVector
 * @summary Performs an inverse rotation of a vector using a rotation matrix
 * @param {b2Rot} q - A rotation matrix containing cosine (c) and sine (s) components
 * @param {b2Vec2} v - The vector to be inversely rotated
 * @returns {b2Vec2} A new vector representing the inverse rotation of v by q4
 * @description
 * Applies the inverse of the rotation defined by q4 to vector v.
 * The operation is equivalent to multiplying the vector by the transpose
 * of the rotation matrix represented by q4.
 */
function b2InvRotateVector(q, v)
{
    return new b2Vec2(q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y);
}

/**
 * @function b2TransformPoint
 * @summary Transforms a point using a rigid body transform.
 * @param {b2Transform} t - A transform containing position (p) and rotation (q) components
 * @param {b2Vec2} p - The point to transform
 * @returns {b2Vec2} The transformed point
 * @description
 * Applies a rigid body transformation to a 2D point. The transformation consists of
 * a rotation followed by a translation. The rotation is applied using the rotation
 * matrix stored in t.q (cosine and sine components), and the translation is applied
 * using the position vector stored in t.p.
 */
function b2TransformPoint(t, p)
{
    const x = (t.q.c * p.x - t.q.s * p.y) + t.p.x;
    const y = (t.q.s * p.x + t.q.c * p.y) + t.p.y;

    return new b2Vec2(x, y);
}

function b2TransformPointOut(t, p, out)
{
    const x = (t.q.c * p.x - t.q.s * p.y) + t.p.x;
    const y = (t.q.s * p.x + t.q.c * p.y) + t.p.y;

    // safe: i.e. out = t.p
    out.x = x;
    out.y = y;
}

function b2TransformPointOutXf(t, p, out)
{
    out.p.x = (t.q.c * p.x - t.q.s * p.y) + t.p.x;
    out.p.y = (t.q.s * p.x + t.q.c * p.y) + t.p.y;
    out.q.c = t.q.c;
    out.q.s = t.q.s;
}

/**
 * Applies an inverse transform to a point.
 * @function b2InvTransformPoint
 * @param {b2Transform} t - A transform containing position (p) and rotation (q) components
 * @param {b2Vec2} p - The point to transform
 * @returns {b2Vec2} The inverse transformed point
 * @description
 * Computes the inverse transform of a point by first translating relative to the transform's
 * position, then applying the inverse rotation. The rotation inverse is computed using
 * the transpose of the rotation matrix.
 */
function b2InvTransformPoint(t, p)
{
    const vx = p.x - t.p.x;
    const vy = p.y - t.p.y;

    return new b2Vec2(t.q.c * vx + t.q.s * vy, -t.q.s * vx + t.q.c * vy);
}

/**
 * @function b2MulTransforms
 * @summary Multiplies two transforms together to create a new transform.
 * @param {b2Transform} A - The first transform
 * @param {b2Transform} B - The second transform
 * @returns {b2Transform} A new transform C that represents the multiplication of A and B
 * @description
 * Combines two transforms by first multiplying their rotations (q components),
 * then rotating B's position vector by A's rotation and adding it to A's position.
 * The result represents the combined transformation of first applying B, then A.
 */
function b2MulTransforms(A, B)
{
    const C = new b2Transform();
    C.q = b2MulRot(A.q, B.q);
    C.p = b2Add(b2RotateVector(A.q, B.p), A.p);

    return C;
}

/**
 * @function b2InvMulTransforms
 * @summary Computes the inverse multiplication of two transforms.
 * @param {b2Transform} A - The first transform
 * @param {b2Transform} B - The second transform
 * @returns {b2Transform} A new transform representing the inverse multiplication of A and B
 * @description
 * Calculates A^-1 * B, where A^-1 is the inverse of transform A.
 * The result combines both the rotational and translational components
 * of the transforms using their quaternion and position vectors.
 */
function b2InvMulTransforms(A, B)
{
    const C = new b2Transform(new b2Vec2(), new b2Rot());

    // C.q = b2InvMulRot(A.q, B.q);
    // q.c * r.c + q.s * r.s, q.c * r.s - q.s * r.c
    C.q.c = A.q.c * B.q.c + A.q.s * B.q.s;
    C.q.s = A.q.c * B.q.s - A.q.s * B.q.c;

    // C.p = b2InvRotateVector(A.q, b2Sub(B.p, A.p));
    // q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y
    const subX = B.p.x - A.p.x;
    const subY = B.p.y - A.p.y;
    C.p.x = A.q.c * subX + A.q.s * subY;
    C.p.y = -A.q.s * subX + A.q.c * subY;

    return C;
}

function b2InvMulTransformsOut(A, B, out)
{
    const C = out;

    // C.q = b2InvMulRot(A.q, B.q);
    // q.c * r.c + q.s * r.s, q.c * r.s - q.s * r.c
    C.q.c = A.q.c * B.q.c + A.q.s * B.q.s;
    C.q.s = A.q.c * B.q.s - A.q.s * B.q.c;

    // C.p = b2InvRotateVector(A.q, b2Sub(B.p, A.p));
    // q.c * v.x + q.s * v.y, -q.s * v.x + q.c * v.y
    const subX = B.p.x - A.p.x;
    const subY = B.p.y - A.p.y;
    C.p.x = A.q.c * subX + A.q.s * subY;
    C.p.y = -A.q.s * subX + A.q.c * subY;
}

/**
 * @function b2MulMV
 * @summary Multiplies a 2x2 matrix by a 2D vector.
 * @param {b2Mat22} A - A 2x2 matrix with components cx and cy, each containing x and y values
 * @param {b2Vec2} v - A 2D vector with x and y components
 * @returns {b2Vec2} The resulting 2D vector from the matrix-vector multiplication
 * @description
 * Performs matrix-vector multiplication of the form Av, where A is a 2x2 matrix
 * and v is a 2D vector. The result is a new 2D vector.
 */
function b2MulMV(A, v)
{
    return new b2Vec2(
        A.cx.x * v.x + A.cy.x * v.y,
        A.cx.y * v.x + A.cy.y * v.y
    );
}

/**
 * Calculates the inverse of a 2x2 matrix.
 * @function b2GetInverse22
 * @param {b2Mat22} A - The input 2x2 matrix to invert
 * @returns {b2Mat22} The inverse of matrix A. If the determinant is 0, returns a matrix with undefined values
 * @description
 * Computes the inverse of a 2x2 matrix using the formula:
 * For matrix [[a,b],[c,d]], inverse = (1/det) * [[d,-c],[-b,a]]
 * where det = ad-bc
 */
function b2GetInverse22(A)
{
    const a = A.cx.x,
        b = A.cy.x,
        c = A.cx.y,
        d = A.cy.y;
    let det = a * d - b * c;

    if (det !== 0)
    {
        det = 1 / det;
    }

    return new b2Mat22(
        new b2Vec2(det * d, -det * c),
        new b2Vec2(-det * b, det * a)
    );
}

/**
 * @function b2Solve22
 * @summary Solves a 2x2 linear system of equations Ax = b using Cramer's rule.
 * @param {b2Mat22} A - A 2x2 matrix represented as two column vectors (cx, cy)
 * @param {b2Vec2} b - A 2D vector representing the right-hand side of the equation
 * @returns {b2Vec2} The solution vector x that satisfies Ax = b. Returns a zero vector if the system is singular (det = 0)
 * @description
 * Solves the system using the formula:
 * x = (1/det) * [a22 -a12] * [b.x]
 * [-a21  a11]   [b.y]
 * where det = a11*a22 - a12*a21
 */
function b2Solve22(A, b)
{
    const a11 = A.cx.x,
        a12 = A.cy.x,
        a21 = A.cx.y,
        a22 = A.cy.y;
    let det = a11 * a22 - a12 * a21;

    if (det !== 0)
    {
        det = 1 / det;
    }

    return new b2Vec2(
        det * (a22 * b.x - a12 * b.y),
        det * (a11 * b.y - a21 * b.x)
    );
}

/**
 * @function b2AABB_Contains
 * @summary Determines if one Axis-Aligned Bounding Box (AABB) completely contains another.
 * @param {b2AABB} a - The containing AABB
 * @param {b2AABB} b - The AABB to test for containment
 * @returns {boolean} True if AABB 'a' completely contains AABB 'b', false otherwise
 * @description
 * Tests if AABB 'b' is completely contained within AABB 'a' by comparing their bounds.
 * An AABB contains another if its lower bounds are less than or equal to the other's lower bounds
 * and its upper bounds are greater than or equal to the other's upper bounds.
 */
function b2AABB_Contains(a, b)
{
    return (
        a.lowerBoundX <= b.lowerBoundX &&
        a.lowerBoundY <= b.lowerBoundY &&
        b.upperBoundX <= a.upperBoundX &&
        b.upperBoundY <= a.upperBoundY
    );
}

/**
 * @function b2AABB_Center
 * @summary Calculates the center point of an Axis-Aligned Bounding Box (AABB).
 * @param {b2AABB} a - The AABB object containing lowerBound and upperBound coordinates.
 * @returns {b2Vec2} A 2D vector representing the center point of the AABB.
 * @description
 * Computes the center point of an AABB by averaging its lower and upper bounds
 * in both X and Y dimensions.
 */
function b2AABB_Center(a)
{
    return new b2Vec2(
        0.5 * (a.lowerBoundX + a.upperBoundX),
        0.5 * (a.lowerBoundY + a.upperBoundY)
    );
}

/**
 * @summary Calculates the half-widths (extents) of an Axis-Aligned Bounding Box (AABB)
 * @function b2AABB_Extents
 * @param {b2AABB} a - The AABB to calculate extents for
 * @returns {b2Vec2} A vector containing the half-width and half-height of the AABB
 * @description
 * Computes the extents of an AABB by calculating half the difference between
 * its upper and lower bounds in both x and y dimensions.
 */
function b2AABB_Extents(a)
{
    return new b2Vec2(
        0.5 * (a.upperBoundX - a.lowerBoundX),
        0.5 * (a.upperBoundY - a.lowerBoundY)
    );
}

/**
 * @function b2AABB_Union
 * @summary Creates a new AABB that contains both input AABBs.
 * @param {b2AABB} a - The first axis-aligned bounding box
 * @param {b2AABB} b - The second axis-aligned bounding box
 * @returns {b2AABB} A new AABB that encompasses both input boxes
 * @description
 * Computes the union of two axis-aligned bounding boxes by creating a new AABB
 * with a lower bound at the minimum coordinates and an upper bound at the
 * maximum coordinates of both input boxes.
 */
function b2AABB_Union(a, b)
{
    const c = new b2AABB();
    c.lowerBoundX = Math.min(a.lowerBoundX, b.lowerBoundX);
    c.lowerBoundY = Math.min(a.lowerBoundY, b.lowerBoundY);
    c.upperBoundX = Math.max(a.upperBoundX, b.upperBoundX);
    c.upperBoundY = Math.max(a.upperBoundY, b.upperBoundY);

    return c;
}

/**
 * @summary Checks if a number is valid (finite and not NaN).
 * @function b2IsValid
 * @param {number} a - The number to validate.
 * @returns {boolean} True if the number is valid (finite and not NaN), false otherwise.
 * @description
 * This function performs a validation check on a number by ensuring it is both
 * finite and not NaN (Not a Number).
 */
function b2IsValid(a)
{
    return isFinite(a) && !isNaN(a);
}

/**
 * Validates a b2Vec2 object by checking if it exists and its components are valid numbers.
 * @function b2Vec2_IsValid
 * @param {b2Vec2} v - The vector to validate, containing x and y components.
 * @returns {boolean} True if the vector exists and both x and y components are valid numbers.
 */
function b2Vec2_IsValid(v)
{
    return v && b2IsValid(v.x) && b2IsValid(v.y);
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
function b2Rot_IsValid(q)
{
    return q && b2IsValid(q.s) && b2IsValid(q.c) && b2IsNormalized(q);
}

/**
 * Validates an Axis-Aligned Bounding Box (AABB)
 * @function b2AABB_IsValid
 * @param {b2AABB} aabb - The AABB to validate
 * @returns {boolean} True if the AABB exists and has valid dimensions and coordinates
 * @description
 * Checks if an AABB is valid by verifying:
 * 1. The AABB object exists
 * 2. The width (upperBoundX - lowerBoundX) is non-negative
 * 3. The height (upperBoundY - lowerBoundY) is non-negative
 * 4. All coordinate values are valid numbers
 */
function b2AABB_IsValid(aabb)
{
    if (!aabb) { return false; }
    const dx = aabb.upperBoundX - aabb.lowerBoundX;
    const dy = aabb.upperBoundY - aabb.lowerBoundY;
    const valid = dx >= 0 && dy >= 0;

    return valid &&
        b2IsValid(aabb.lowerBoundX) && b2IsValid(aabb.lowerBoundY) &&
        b2IsValid(aabb.upperBoundX) && b2IsValid(aabb.upperBoundY);
}

/**
 * @function b2Normalize
 * @summary Normalizes a 2D vector to unit length.
 * @param {b2Vec2} v - The vector to normalize.
 * @returns {b2Vec2} Returns a new normalized b2Vec2 if successful.
 * If the vector length is less than epsilon, returns a zero vector (0,0).
 * @description
 * Normalizes the input vector by dividing its components by its length.
 * If the vector's length is greater than the epsilon value, the function
 * returns a new vector with the same direction but unit length.
 */
function b2Normalize(v)
{
    if (!v) { console.assert(false); }  // why would this ever happen? make sure it doesn't...
    const length = b2Length(v);

    if (length > eps)
    {
        const invLength = 1 / length;

        return new b2Vec2(v.x * invLength, v.y * invLength);
    }

    return new b2Vec2(0, 0);
}

function b2NormalizeXY(x, y)
{
    const length = Math.sqrt(x * x + y * y);

    if (length > eps)
    {
        const invLength = 1 / length;

        return new b2Vec2(x * invLength, y * invLength);
    }

    return new b2Vec2(0, 0);
}

/**
 * Normalizes a 2D vector and performs length validation.
 * @function b2NormalizeChecked
 * @param {b2Vec2} v - The vector to normalize.
 * @returns {b2Vec2} A new normalized vector with unit length.
 * @throws {Error} Throws an assertion error if the vector length is less than or equal to eps.
 */
function b2NormalizeChecked(v)
{
    const length = b2Length(v);
    console.assert(length > eps);
    const invLength = 1 / length;

    return new b2Vec2(v.x * invLength, v.y * invLength);
}

export {
    b2Vec2, b2Rot, b2Transform, b2Mat22, b2AABB,
    b2MinFloat, b2MaxFloat, b2AbsFloat, b2ClampFloat,
    b2MinInt, b2MaxInt, b2AbsInt, b2ClampInt,
    b2Dot, b2Cross, b2CrossVS, b2CrossSV,
    b2LeftPerp, b2RightPerp, b2Add, b2Sub,
    b2Neg, b2Lerp, b2Mul, b2MulSV,
    b2MulAdd, b2MulSub, b2Abs, b2Min,
    b2Max, b2Clamp, b2Length, b2LengthXY, b2LengthSquared,
    b2Distance, b2DistanceSquared, b2MakeRot,
    b2NormalizeRot, b2InvMagRot,
    b2IsNormalized, b2NLerp,
    b2IntegrateRotation, b2IntegrateRotationOut,
    b2ComputeAngularVelocity,
    b2Rot_GetAngle, b2Rot_GetXAxis, b2Rot_GetYAxis,
    b2MulRot, b2InvMulRot, b2MulRotC, b2MulRotS,
    b2RelativeAngle, b2UnwindAngle,
    b2RotateVector, b2InvRotateVector,
    b2TransformPoint, b2TransformPointOut, b2TransformPointOutXf, b2InvTransformPoint,
    b2MulTransforms,
    b2InvMulTransforms, b2InvMulTransformsOut,
    b2MulMV, b2GetInverse22, b2Solve22,
    b2AABB_Contains, b2AABB_Center, b2AABB_Extents, b2AABB_Union,
    b2IsValid, b2Vec2_IsValid, b2Rot_IsValid, b2AABB_IsValid,
    b2Normalize, b2NormalizeXY, b2NormalizeChecked, b2GetLengthAndNormalize,
    b2DotSub, b2MulAddOut
};
