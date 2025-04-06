/**
 * @namespace DistanceJoint
 */
/**
 * @function b2DistanceJoint_SetLength
 * @summary Sets the target length of a distance joint and resets its impulses.
 * @param {b2JointId} jointId - The identifier of the distance joint to modify.
 * @param {number} length - The desired length of the joint, clamped between b2_linearSlop and B2_HUGE.
 * @returns {void}
 * @description
 * Sets the target length of a distance joint. The length value is automatically
 * clamped between b2_linearSlop and B2_HUGE. After setting the length,
 * the joint's impulse values are reset to zero.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_SetLength(jointId: b2JointId, length: number): void;
/**
 * @summary Gets the length of a distance joint.
 * @function b2DistanceJoint_GetLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current length of the distance joint.
 * @description
 * Returns the current length of a distance joint. The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_GetLength(jointId: b2JointId): number;
/**
 * @summary Enables or disables the limit constraint on a distance joint.
 * @function b2DistanceJoint_EnableLimit
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {boolean} enableLimit - True to enable the joint's limit, false to disable it.
 * @returns {void}
 * @description
 * Sets the enable/disable state of the limit constraint for a distance joint.
 * The joint must be of type b2_distanceJoint or an error will occur.
 * @throws {Error} Throws an error if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_EnableLimit(jointId: b2JointId, enableLimit: boolean): void;
/**
 * @summary Checks if the limit is enabled for a distance joint.
 * @function b2DistanceJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the limit is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_IsLimitEnabled(jointId: b2JointId): boolean;
/**
 * @function b2DistanceJoint_SetLengthRange
 * @description
 * Sets the minimum and maximum length constraints for a distance joint.
 * The values are clamped between b2_linearSlop and B2_HUGE.
 * The function resets all impulse values to zero after updating the length range.
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @param {number} minLength - The minimum allowed length of the joint
 * @param {number} maxLength - The maximum allowed length of the joint
 * @returns {void}
 * @throws {Error} If the joint type is not b2_distanceJoint
 */
export function b2DistanceJoint_SetLengthRange(jointId: b2JointId, minLength: number, maxLength: number): void;
/**
 * Gets the minimum length of a distance joint.
 * @function b2DistanceJoint_GetMinLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The minimum length value of the distance joint.
 * @throws {Error} If the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_GetMinLength(jointId: b2JointId): number;
/**
 * Gets the maximum length of a distance joint.
 * @function b2DistanceJoint_GetMaxLength
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The maximum length value of the distance joint.
 * @throws {Error} If the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_GetMaxLength(jointId: b2JointId): number;
/**
 * @function b2DistanceJoint_GetCurrentLength
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @returns {number} The current length between the two anchor points of the distance joint
 * @description
 * Calculates the current distance between the two anchor points of a distance joint
 * in world coordinates. The function transforms the local anchor points of both bodies
 * to world coordinates and computes the distance between them.
 * @throws {Error} Returns 0 if the world is locked
 */
export function b2DistanceJoint_GetCurrentLength(jointId: b2JointId): number;
/**
 * @summary Enables or disables the spring behavior of a distance joint.
 * @function b2DistanceJoint_EnableSpring
 * @param {b2JointId} jointId - The identifier of the distance joint to modify.
 * @param {boolean} enableSpring - True to enable spring behavior, false to disable it.
 * @returns {void}
 * @description
 * Sets the spring behavior state of a distance joint. When enabled, the joint acts like
 * a spring between two bodies. When disabled, the joint maintains a fixed distance
 * between the connected bodies.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_EnableSpring(jointId: b2JointId, enableSpring: boolean): void;
/**
 * @summary Checks if the spring mechanism is enabled for a distance joint.
 * @function b2DistanceJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the spring mechanism is enabled, false otherwise.
 * @description
 * Returns the state of the spring enable flag for the specified distance joint.
 * The function validates that the joint is of type b2_distanceJoint before
 * accessing the spring enable property.
 * @throws {Error} Throws an error if the joint is not of type b2_distanceJoint.
 */
export function b2DistanceJoint_IsSpringEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the spring frequency (hertz) of a distance joint.
 * @function b2DistanceJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (oscillations per second).
 * @returns {void}
 * @description
 * Sets the spring oscillation frequency for a distance joint. The frequency
 * determines how quickly the spring oscillates when disturbed from equilibrium.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_SetSpringHertz(jointId: b2JointId, hertz: number): void;
/**
 * Sets the damping ratio for a distance joint's spring.
 * @function b2DistanceJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the distance joint to modify
 * @param {number} dampingRatio - The damping ratio for the spring (0 = no damping, 1 = critical damping)
 * @returns {void}
 * @description
 * Sets the damping ratio parameter for a distance joint's spring mechanism.
 * The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint
 */
export function b2DistanceJoint_SetSpringDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the hertz frequency parameter of a distance joint.
 * @function b2DistanceJoint_GetSpringHertz
 * @param {number} jointId - The identifier for the distance joint.
 * @returns {number} The hertz frequency value of the distance joint.
 * @throws {Error} If the joint is not a distance joint or the jointId is invalid.
 */
export function b2DistanceJoint_GetSpringHertz(jointId: number): number;
/**
 * Gets the damping ratio of a distance joint.
 * @function b2DistanceJoint_GetSpringDampingRatio
 * @param {number} jointId - The identifier for the distance joint.
 * @returns {number} The damping ratio of the distance joint.
 * @throws {Error} If the joint is not a distance joint or the jointId is invalid.
 */
export function b2DistanceJoint_GetSpringDampingRatio(jointId: number): number;
/**
 * @function b2DistanceJoint_EnableMotor
 * @description
 * Enables or disables the motor on a distance joint. When the motor state changes,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the distance joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not a distance joint type
 */
export function b2DistanceJoint_EnableMotor(jointId: b2JointId, enableMotor: boolean): void;
/**
 * @summary Checks if the motor is enabled on a distance joint.
 * @function b2DistanceJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the distance joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not a distance joint.
 */
export function b2DistanceJoint_IsMotorEnabled(jointId: b2JointId): boolean;
/**
 * Sets the motor speed for a distance joint.
 * @function b2DistanceJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} motorSpeed - The new motor speed value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a distance joint type.
 */
export function b2DistanceJoint_SetMotorSpeed(jointId: b2JointId, motorSpeed: number): void;
/**
 * Gets the motor speed of a distance joint.
 * @function b2DistanceJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current motor speed of the distance joint in radians per second.
 * @throws {Error} If the joint is not a distance joint or the joint ID is invalid.
 */
export function b2DistanceJoint_GetMotorSpeed(jointId: b2JointId): number;
/**
 * Gets the current motor force for a distance joint.
 * @function b2DistanceJoint_GetMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The current motor force in Newtons, calculated as the motor impulse divided by the step time.
 * @description
 * Calculates the motor force by dividing the joint's motor impulse by the inverse time step (inv_h).
 * The joint must be of type b2_distanceJoint.
 * @throws {Error} Throws if the joint type is not b2_distanceJoint.
 */
export function b2DistanceJoint_GetMotorForce(jointId: b2JointId): number;
/**
 * Sets the maximum motor force for a distance joint.
 * @function b2DistanceJoint_SetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint to modify.
 * @param {number} force - The maximum force the motor can generate.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a distance joint type.
 */
export function b2DistanceJoint_SetMaxMotorForce(jointId: b2JointId, force: number): void;
/**
 * Gets the maximum motor force of a distance joint.
 * @function b2DistanceJoint_GetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the distance joint.
 * @returns {number} The maximum force that can be applied by the joint's motor.
 * @throws {Error} If the joint is not a distance joint or the joint ID is invalid.
 */
export function b2DistanceJoint_GetMaxMotorForce(jointId: b2JointId): number;
export function b2GetDistanceJointForce(world: any, base: any): import("./include/math_functions_h.js").b2Vec2;
export function b2PrepareDistanceJoint(base: any, context: any): void;
export function b2WarmStartDistanceJoint(base: any, context: any): void;
export function b2SolveDistanceJoint(base: any, context: any, useBias: any): void;
export function b2DrawDistanceJoint(draw: any, base: any, transformA: any, transformB: any): void;
