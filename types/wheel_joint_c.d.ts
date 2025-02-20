/**
 * @namespace WheelJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * @function b2WheelJoint_EnableSpring
 * @description
 * Enables or disables the spring functionality of a wheel joint. When the spring state
 * changes, the spring impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify
 * @param {boolean} enableSpring - True to enable the spring, false to disable it
 * @returns {void}
 * @throws {Error} If the joint identified by jointId is not a wheel joint
 */
export function b2WheelJoint_EnableSpring(jointId: b2JointId, enableSpring: boolean): void;
/**
 * @summary Checks if the spring mechanism is enabled for a wheel joint.
 * @function b2WheelJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the spring is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_IsSpringEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the spring frequency for a wheel joint.
 * @function b2WheelJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @description
 * Sets the spring frequency for a wheel joint's oscillation. The frequency is specified
 * in Hertz (Hz). The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_wheelJoint.
 */
export function b2WheelJoint_SetSpringHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the spring frequency in Hertz for a wheel joint.
 * @function b2WheelJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetSpringHertz(jointId: b2JointId): number;
/**
 * Sets the damping ratio for a wheel joint's spring.
 * @function b2WheelJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify
 * @param {number} dampingRatio - The damping ratio for the spring (0 = no damping, 1 = critical damping)
 * @returns {void}
 * @throws {Error} If the joint is not a wheel joint type
 */
export function b2WheelJoint_SetSpringDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the damping ratio of a wheel joint's spring.
 * @function b2WheelJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The spring damping ratio value.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetSpringDampingRatio(jointId: b2JointId): number;
/**
 * @function b2WheelJoint_EnableLimit
 * @summary Enables or disables the joint's translation limit.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {boolean} enableLimit - True to enable the translation limit, false to disable it.
 * @returns {void}
 * @description
 * Sets whether the wheel joint's translation limit is active. When the limit is enabled,
 * the joint's translation will be constrained. When the limit state changes, the joint's
 * lower and upper impulses are reset to zero.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_EnableLimit(jointId: b2JointId, enableLimit: boolean): void;
/**
 * @summary Checks if the limit is enabled for a wheel joint.
 * @function b2WheelJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the limit is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint.
 */
export function b2WheelJoint_IsLimitEnabled(jointId: b2JointId): boolean;
/**
 * Gets the lower translation limit of a wheel joint.
 * @function b2WheelJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The lower translation limit of the wheel joint.
 * @throws {Error} If the joint is not a wheel joint or the jointId is invalid.
 */
export function b2WheelJoint_GetLowerLimit(jointId: b2JointId): number;
/**
 * Gets the upper translation limit of a wheel joint.
 * @function b2WheelJoint_GetUpperLimit
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The upper translation limit of the wheel joint.
 * @throws {Error} If the joint is not a wheel joint or the joint ID is invalid.
 */
export function b2WheelJoint_GetUpperLimit(jointId: b2JointId): number;
/**
 * @function b2WheelJoint_SetLimits
 * @summary Sets the translation limits for a wheel joint.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {number} lower - The lower translation limit.
 * @param {number} upper - The upper translation limit.
 * @returns {void}
 * @description
 * Sets new translation limits for a wheel joint. The function automatically orders
 * the limits so that the lower value is always less than or equal to the upper value.
 * When the limits change, the joint's impulses are reset to zero.
 * @throws {Error} If the provided jointId does not reference a valid wheel joint.
 */
export function b2WheelJoint_SetLimits(jointId: b2JointId, lower: number, upper: number): void;
/**
 * @function b2WheelJoint_EnableMotor
 * @description
 * Enables or disables the motor on a wheel joint. When the motor state changes,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the wheel joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not a wheel joint type
 */
export function b2WheelJoint_EnableMotor(jointId: b2JointId, enableMotor: boolean): void;
/**
 * @summary Checks if the motor is enabled on a wheel joint.
 * @function b2WheelJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the wheel joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_IsMotorEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the motor speed for a wheel joint.
 * @function b2WheelJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the wheel joint to modify.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a wheel joint type.
 */
export function b2WheelJoint_SetMotorSpeed(jointId: b2JointId, motorSpeed: number): void;
/**
 * Gets the motor speed of a wheel joint.
 * @function b2WheelJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The current motor speed of the wheel joint in radians per second.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetMotorSpeed(jointId: b2JointId): number;
/**
 * @function b2WheelJoint_GetMotorTorque
 * @summary Gets the current motor torque of a wheel joint.
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The current motor torque normalized by the step time (N⋅m).
 * @description
 * Calculates the motor torque by multiplying the motor impulse by the inverse
 * of the time step. The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws if the joint type is not b2_wheelJoint.
 */
export function b2WheelJoint_GetMotorTorque(jointId: b2JointId): number;
/**
 * @summary Sets the maximum motor torque for a wheel joint.
 * @function b2WheelJoint_SetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @param {number} torque - The maximum motor torque value to set.
 * @returns {void}
 * @description
 * Sets the maximum torque that can be applied by the wheel joint's motor.
 * The joint must be of type b2_wheelJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_wheelJoint.
 */
export function b2WheelJoint_SetMaxMotorTorque(jointId: b2JointId, torque: number): void;
/**
 * Gets the maximum motor torque of a wheel joint.
 * @function b2WheelJoint_GetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the wheel joint.
 * @returns {number} The maximum motor torque value.
 * @throws {Error} If the joint is not a wheel joint type.
 */
export function b2WheelJoint_GetMaxMotorTorque(jointId: b2JointId): number;
export function b2GetWheelJointForce(world: any, base: any): import("./include/math_functions_h.js").b2Vec2;
export function b2GetWheelJointTorque(world: any, base: any): number;
export function b2PrepareWheelJoint(base: any, context: any): void;
export function b2WarmStartWheelJoint(base: any, context: any): void;
export function b2SolveWheelJoint(base: any, context: any, useBias: any): void;
export function b2DrawWheelJoint(draw: any, base: any, transformA: any, transformB: any): void;
import type { b2JointId } from './include/id_h.js';
