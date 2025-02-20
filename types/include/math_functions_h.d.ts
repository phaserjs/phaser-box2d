export const B2_PI: 3.14159265359;
export const eps: 1e-10;
export const epsSqr: number;
export namespace GlobalDebug {
    let b2Vec2Count: number;
    let b2Rot2Count: number;
    let b2ManifoldCount: number;
    let b2ManifoldPointCount: number;
    let b2FrameCount: number;
    let b2PolyCollideCount: number;
    let b2ContactSimCount: number;
    let b2TOIInputCount: number;
    let b2ShapeCastPairInputCount: number;
    let b2SweepCount: number;
}
export namespace b2Vec2Where {
    let calls: {};
}
export namespace b2Rot2Where {
    let calls_1: {};
    export { calls_1 as calls };
}
export namespace b2ManifoldPointWhere {
    let calls_2: {};
    export { calls_2 as calls };
}
export namespace b2ManifoldWhere {
    let calls_3: {};
    export { calls_3 as calls };
}
/**
 * @class b2Vec2
 * @summary 2D vector This can be used to represent a point or free vector
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 */
export class b2Vec2 {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    copy(v: any): this;
    clone(): b2Vec2;
}
/**
 * @class b2Rot
 * @summary 2D rotation. This is similar to using a complex number for rotation
 * @property {number} s - The sine component of the rotation
 * @property {number} c - The cosine component of the rotation
 */
export class b2Rot {
    constructor(c?: number, s?: number);
    c: number;
    s: number;
    copy(r: any): this;
    clone(): b2Rot;
}
/**
 * @class b2Transform
 * @summary A 2D rigid transform
 * @property {b2Vec2} p - Position vector
 * @property {b2Rot} q - Rotation component
 */
export class b2Transform {
    static identity(): b2Transform;
    constructor(p?: any, q?: any);
    p: any;
    q: any;
    clone(): b2Transform;
    deepClone(): b2Transform;
}
/**
 * @class b2Mat22
 * @summary A 2-by-2 Matrix
 * @property {b2Vec2} cy - Matrix columns
 */
export class b2Mat22 {
    constructor(cx?: b2Vec2, cy?: b2Vec2);
    cx: b2Vec2;
    cy: b2Vec2;
    clone(): b2Mat22;
}
/**
 * @class b2AABB
 * @summary Axis-aligned bounding box
 * @property {b2Vec2} lowerBound - The lower vertex of the bounding box
 * @property {b2Vec2} upperBound - The upper vertex of the bounding box
 */
export class b2AABB {
    constructor(lowerx?: number, lowery?: number, upperx?: number, uppery?: number);
    lowerBoundX: number;
    lowerBoundY: number;
    upperBoundX: number;
    upperBoundY: number;
}
/**
 * @summary Returns the minimum of two numbers.
 * @function b2MinFloat
 * @param {number} a - First number to compare
 * @param {number} b - Second number to compare
 * @returns {number} The smaller of the two input numbers
 */
export function b2MinFloat(a: number, b: number): number;
/**
 * @summary Returns the larger of two numbers.
 * @function b2MaxFloat
 * @param {number} a - First number to compare
 * @param {number} b - Second number to compare
 * @returns {number} The maximum value between a and b
 */
export function b2MaxFloat(a: number, b: number): number;
/**
 * @summary Returns the absolute value of a number
 * @function b2AbsFloat
 * @param {number} a - The input number
 * @returns {number} The absolute value of the input
 * @description
 * An implementation of absolute value that returns the positive magnitude
 * of the input number.
 */
export function b2AbsFloat(a: number): number;
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
export function b2ClampFloat(a: number, lower: number, upper: number): number;
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
export function b2MinInt(a: number, b: number): number;
/**
 * @summary Returns the larger of two integers.
 * @function b2MaxInt
 * @param {number} a - First integer to compare
 * @param {number} b - Second integer to compare
 * @returns {number} The larger of the two input integers
 */
export function b2MaxInt(a: number, b: number): number;
/**
 * @summary Returns the absolute value of an integer.
 * @function b2AbsInt
 * @param {number} a - The integer input value.
 * @returns {number} The absolute value of the input.
 * @description
 * Computes the absolute value of an integer using conditional logic rather than Math.abs().
 */
export function b2AbsInt(a: number): number;
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
export function b2ClampInt(a: number, lower: number, upper: number): number;
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
export function b2Dot(a: b2Vec2, b: b2Vec2): number;
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
export function b2Cross(a: b2Vec2, b: b2Vec2): number;
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
export function b2CrossVS(v: b2Vec2, s: number): b2Vec2;
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
export function b2CrossSV(s: number, v: b2Vec2): b2Vec2;
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
export function b2LeftPerp(v: b2Vec2): b2Vec2;
/**
 * @summary Returns a vector rotated 90 degrees clockwise.
 * @function b2RightPerp
 * @param {b2Vec2} v - The input vector to rotate.
 * @returns {b2Vec2} A new vector perpendicular to the input, rotated 90 degrees clockwise.
 * @description
 * Creates a new vector that is perpendicular (rotated 90 degrees clockwise) to the input vector.
 * For a vector (x,y), returns (y,-x).
 */
export function b2RightPerp(v: b2Vec2): b2Vec2;
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
export function b2Add(a: b2Vec2, b: b2Vec2): b2Vec2;
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
export function b2Sub(a: b2Vec2, b: b2Vec2): b2Vec2;
/**
 * @summary Returns the negation of a 2D vector.
 * @function b2Neg
 * @param {b2Vec2} a - The input vector to negate.
 * @returns {b2Vec2} A new vector with components (-a.x, -a.y).
 * @description
 * Creates a new b2Vec2 with the negated x and y components of the input vector.
 */
export function b2Neg(a: b2Vec2): b2Vec2;
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
export function b2Lerp(a: b2Vec2, b: b2Vec2, t: number): b2Vec2;
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
export function b2Mul(a: b2Vec2, b: b2Vec2): b2Vec2;
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
export function b2MulSV(s: number, v: b2Vec2): b2Vec2;
/**
 * @function b2MulAdd
 * @summary Performs vector addition with scalar multiplication (a + s * b).
 * @param {b2Vec2} a - First vector operand
 * @param {number} s - Scalar multiplier
 * @param {b2Vec2} b - Second vector operand
 * @returns {b2Vec2} A new vector representing the result of a + s * b
 */
export function b2MulAdd(a: b2Vec2, s: number, b: b2Vec2): b2Vec2;
/**
 * @function b2MulSub
 * @summary Performs vector subtraction with scalar multiplication: a - s * b
 * @param {b2Vec2} a - The first vector operand
 * @param {number} s - The scalar multiplier
 * @param {b2Vec2} b - The second vector operand
 * @returns {b2Vec2} A new vector representing the result of a - s * b
 */
export function b2MulSub(a: b2Vec2, s: number, b: b2Vec2): b2Vec2;
/**
 * Returns a new b2Vec2 with the absolute values of the input vector's components.
 * @function b2Abs
 * @param {b2Vec2} a - The input vector whose components will be converted to absolute values.
 * @returns {b2Vec2} A new vector containing the absolute values of the input vector's x and y components.
 */
export function b2Abs(a: b2Vec2): b2Vec2;
/**
 * @function b2Min
 * @summary Returns a new vector containing the minimum x and y components from two vectors.
 * @param {b2Vec2} a - First 2D vector
 * @param {b2Vec2} b - Second 2D vector
 * @returns {b2Vec2} A new vector with x = min(a.x, b.x) and y = min(a.y, b.y)
 */
export function b2Min(a: b2Vec2, b: b2Vec2): b2Vec2;
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
export function b2Max(a: b2Vec2, b: b2Vec2): b2Vec2;
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
export function b2Clamp(v: b2Vec2, a: b2Vec2, b: b2Vec2): b2Vec2;
/**
 * @summary Calculates the length (magnitude) of a 2D vector.
 * @function b2Length
 * @param {b2Vec2} v - A 2D vector with x and y components.
 * @returns {number} The scalar length of the vector.
 * @description
 * Computes the Euclidean length of a 2D vector using the formula sqrt(x² + y²).
 */
export function b2Length(v: b2Vec2): number;
export function b2LengthXY(x: any, y: any): number;
/**
 * @summary Calculates the squared length (magnitude) of a 2D vector.
 * @function b2LengthSquared
 * @param {b2Vec2} v - A 2D vector with x and y components.
 * @returns {number} The squared length of the vector (x² + y²).
 * @description
 * Computes the dot product of a vector with itself, which gives the squared
 * length of the vector without performing a square root operation.
 */
export function b2LengthSquared(v: b2Vec2): number;
/**
 * @function b2Distance
 * @summary Calculates the Euclidean distance between two 2D points.
 * @param {b2Vec2} a - The first 2D vector point
 * @param {b2Vec2} b - The second 2D vector point
 * @returns {number} The distance between points a and b
 * @description
 * Computes the straight-line distance between two points using the Pythagorean theorem.
 */
export function b2Distance(a: b2Vec2, b: b2Vec2): number;
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
export function b2DistanceSquared(a: b2Vec2 | {
    x: number;
    y: number;
}, b: b2Vec2 | {
    x: number;
    y: number;
}): number;
/**
 * Creates a new b2Rot object representing a 2D rotation.
 * @function b2MakeRot
 * @param {number} angle - The rotation angle in radians
 * @returns {b2Rot} A new b2Rot object containing the cosine and sine of the input angle
 * @description
 * Constructs a b2Rot object by computing the cosine and sine of the provided angle.
 * The resulting b2Rot contains these values as its 'c' and 's' components respectively.
 */
export function b2MakeRot(angle: number): b2Rot;
/**
 * Normalizes a rotation by scaling its components to create a unit vector.
 * @function b2NormalizeRot
 * @param {b2Rot} q - A rotation object containing cosine (c) and sine (s) components
 * @returns {b2Rot} A new normalized b2Rot object where the components form a unit vector
 * @description
 * Computes the magnitude of the rotation vector and divides both components by it
 * to create a normalized rotation. If the magnitude is 0, returns a default rotation.
 */
export function b2NormalizeRot(q: b2Rot): b2Rot;
export function b2InvMagRot(c: any, s: any): number;
/**
 * @function b2IsNormalized
 * @summary Checks if a rotation is properly normalized.
 * @param {b2Rot} q - A rotation object containing sine (s) and cosine (c) components
 * @returns {boolean} True if the rotation is normalized within a tolerance of 6e-4
 * @description
 * Verifies that the sum of squares of the sine and cosine components
 * equals 1 within a tolerance of ±6e-4, which indicates a valid rotation.
 */
export function b2IsNormalized(q: b2Rot): boolean;
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
export function b2NLerp(q1: b2Rot, q2: b2Rot, t: number): b2Rot;
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
export function b2IntegrateRotation(q1: b2Rot, deltaAngle: number): b2Rot;
export function b2IntegrateRotationOut(q1: any, deltaAngle: any, out: any): void;
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
export function b2ComputeAngularVelocity(q1: b2Rot, q2: b2Rot, inv_h: number): number;
/**
 * @function b2Rot_GetAngle
 * @summary Gets the angle of a rotation object in radians.
 * @param {b2Rot} q - A rotation object containing cosine (c) and sine (s) components.
 * @returns {number} The angle in radians, calculated using arctangent of s/c.
 * @description
 * Calculates the angle of a rotation by computing the arctangent of the sine
 * component divided by the cosine component using Math.atan2.
 */
export function b2Rot_GetAngle(q: b2Rot): number;
/**
 * Returns the x-axis vector from a rotation matrix.
 * @function b2Rot_GetXAxis
 * @param {b2Rot} q - A rotation matrix containing cosine (c) and sine (s) components
 * @returns {b2Vec2} A 2D vector representing the x-axis direction (c, s)
 * @description
 * Extracts the x-axis direction vector from a rotation matrix by returning
 * a vector containing the cosine component in x and sine component in y.
 */
export function b2Rot_GetXAxis(q: b2Rot): b2Vec2;
/**
 * Returns the Y axis vector from a rotation matrix.
 * @function b2Rot_GetYAxis
 * @param {b2Rot} q - A rotation matrix containing cosine (c) and sine (s) components
 * @returns {b2Vec2} A 2D vector (-sin, cos) representing the Y axis of the rotation
 * @description
 * Extracts the Y axis vector from a rotation matrix by returning the vector (-sin, cos).
 * This represents the vertical basis vector of the rotated coordinate system.
 */
export function b2Rot_GetYAxis(q: b2Rot): b2Vec2;
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
export function b2MulRot(q: b2Rot, r: b2Rot): b2Rot;
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
export function b2InvMulRot(q: b2Rot, r: b2Rot): b2Rot;
export function b2MulRotC(q: any, r: any): number;
export function b2MulRotS(q: any, r: any): number;
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
export function b2RelativeAngle(b: b2Rot, a: b2Rot): number;
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
export function b2UnwindAngle(angle: number): number;
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
export function b2RotateVector(q: b2Rot, v: b2Vec2): b2Vec2;
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
export function b2InvRotateVector(q: b2Rot, v: b2Vec2): b2Vec2;
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
export function b2TransformPoint(t: b2Transform, p: b2Vec2): b2Vec2;
export function b2TransformPointOut(t: any, p: any, out: any): void;
export function b2TransformPointOutXf(t: any, p: any, out: any): void;
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
export function b2InvTransformPoint(t: b2Transform, p: b2Vec2): b2Vec2;
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
export function b2MulTransforms(A: b2Transform, B: b2Transform): b2Transform;
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
export function b2InvMulTransforms(A: b2Transform, B: b2Transform): b2Transform;
export function b2InvMulTransformsOut(A: any, B: any, out: any): void;
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
export function b2MulMV(A: b2Mat22, v: b2Vec2): b2Vec2;
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
export function b2GetInverse22(A: b2Mat22): b2Mat22;
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
export function b2Solve22(A: b2Mat22, b: b2Vec2): b2Vec2;
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
export function b2AABB_Contains(a: b2AABB, b: b2AABB): boolean;
/**
 * @function b2AABB_Center
 * @summary Calculates the center point of an Axis-Aligned Bounding Box (AABB).
 * @param {b2AABB} a - The AABB object containing lowerBound and upperBound coordinates.
 * @returns {b2Vec2} A 2D vector representing the center point of the AABB.
 * @description
 * Computes the center point of an AABB by averaging its lower and upper bounds
 * in both X and Y dimensions.
 */
export function b2AABB_Center(a: b2AABB): b2Vec2;
/**
 * @summary Calculates the half-widths (extents) of an Axis-Aligned Bounding Box (AABB)
 * @function b2AABB_Extents
 * @param {b2AABB} a - The AABB to calculate extents for
 * @returns {b2Vec2} A vector containing the half-width and half-height of the AABB
 * @description
 * Computes the extents of an AABB by calculating half the difference between
 * its upper and lower bounds in both x and y dimensions.
 */
export function b2AABB_Extents(a: b2AABB): b2Vec2;
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
export function b2AABB_Union(a: b2AABB, b: b2AABB): b2AABB;
/**
 * @summary Checks if a number is valid (finite and not NaN).
 * @function b2IsValid
 * @param {number} a - The number to validate.
 * @returns {boolean} True if the number is valid (finite and not NaN), false otherwise.
 * @description
 * This function performs a validation check on a number by ensuring it is both
 * finite and not NaN (Not a Number).
 */
export function b2IsValid(a: number): boolean;
/**
 * Validates a b2Vec2 object by checking if it exists and its components are valid numbers.
 * @function b2Vec2_IsValid
 * @param {b2Vec2} v - The vector to validate, containing x and y components.
 * @returns {boolean} True if the vector exists and both x and y components are valid numbers.
 */
export function b2Vec2_IsValid(v: b2Vec2): boolean;
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
export function b2Rot_IsValid(q: b2Rot): boolean;
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
export function b2AABB_IsValid(aabb: b2AABB): boolean;
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
export function b2Normalize(v: b2Vec2): b2Vec2;
export function b2NormalizeXY(x: any, y: any): b2Vec2;
/**
 * Normalizes a 2D vector and performs length validation.
 * @function b2NormalizeChecked
 * @param {b2Vec2} v - The vector to normalize.
 * @returns {b2Vec2} A new normalized vector with unit length.
 * @throws {Error} Throws an assertion error if the vector length is less than or equal to eps.
 */
export function b2NormalizeChecked(v: b2Vec2): b2Vec2;
import { b2GetLengthAndNormalize } from '../math_functions_c.js';
export function b2DotSub(sub1: any, sub2: any, dot: any): number;
export function b2MulAddOut(a: any, s: any, b: any, out: any): void;
export { b2GetLengthAndNormalize };
