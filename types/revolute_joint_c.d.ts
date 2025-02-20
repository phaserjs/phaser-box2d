/**
 * @namespace RevoluteJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * @function b2RevoluteJoint_EnableSpring
 * @description
 * Enables or disables the spring functionality of a revolute joint.
 * When the spring state changes, the spring impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier of the revolute joint to modify
 * @param {boolean} enableSpring - True to enable the spring, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_EnableSpring(jointId: b2JointId, enableSpring: boolean): void;
/**
 * @summary Checks if spring functionality is enabled for a revolute joint.
 * @function b2RevoluteJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if spring functionality is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsSpringEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the spring frequency (in Hertz) for a revolute joint.
 * @function b2RevoluteJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the revolute joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @description
 * Sets the spring oscillation frequency for a revolute joint. The joint must be
 * of type b2_revoluteJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetSpringHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the spring frequency in Hertz for a revolute joint.
 * @function b2RevoluteJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetSpringHertz(jointId: b2JointId): number;
/**
 * Sets the damping ratio for a revolute joint's spring.
 * @function b2RevoluteJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} dampingRatio - The damping ratio for the spring.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetSpringDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the spring damping ratio of a revolute joint.
 * @function b2RevoluteJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier of the revolute joint.
 * @returns {number} The spring damping ratio value of the revolute joint.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetSpringDampingRatio(jointId: b2JointId): number;
/**
 * @function b2RevoluteJoint_GetAngle
 * @summary Gets the current angle between two bodies connected by a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The current angle in radians between the two connected bodies,
 * relative to the reference angle.
 * @description
 * Calculates the relative angle between two bodies connected by a revolute joint by
 * comparing their transforms and subtracting the joint's reference angle. The result
 * is unwound to ensure consistent angle representation.
 */
export function b2RevoluteJoint_GetAngle(jointId: b2JointId): number;
/**
 * @function b2RevoluteJoint_EnableLimit
 * @summary Enables or disables the joint angle limits for a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {boolean} enableLimit - True to enable the joint limits, false to disable them.
 * @returns {void}
 * @description
 * When enabled, the joint will restrict rotation to be between its upper and lower angle limits.
 * When the limit state changes, the joint's limit impulses are reset to zero.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_EnableLimit(jointId: b2JointId, enableLimit: boolean): void;
/**
 * @summary Checks if the limit is enabled for a revolute joint.
 * @function b2RevoluteJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if the joint's limit is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsLimitEnabled(jointId: b2JointId): boolean;
/**
 * Gets the lower angle limit of a revolute joint.
 * @function b2RevoluteJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The lower angle limit in radians.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetLowerLimit(jointId: b2JointId): number;
/**
 * Gets the upper angle limit of a revolute joint.
 * @function b2RevoluteJoint_GetUpperLimit
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The upper angle limit in radians.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetUpperLimit(jointId: b2JointId): number;
/**
 * @function b2RevoluteJoint_SetLimits
 * @description
 * Sets the lower and upper angle limits for a revolute joint. The function automatically
 * orders the limits so that the lower value is always less than or equal to the upper value.
 * When the limits change, the joint impulses are reset to zero.
 * @param {b2JointId} jointId - The identifier for the revolute joint to modify
 * @param {number} lower - The lower angle limit in radians
 * @param {number} upper - The upper angle limit in radians
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_SetLimits(jointId: b2JointId, lower: number, upper: number): void;
/**
 * @function b2RevoluteJoint_EnableMotor
 * @description
 * Enables or disables the motor on a revolute joint. When the motor is disabled,
 * its accumulated impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the revolute joint
 * @param {boolean} enableMotor - True to enable the joint's motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_revoluteJoint
 */
export function b2RevoluteJoint_EnableMotor(jointId: b2JointId, enableMotor: boolean): void;
/**
 * @summary Checks if the motor is enabled on a revolute joint.
 * @function b2RevoluteJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the revolute joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_IsMotorEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the motor speed for a revolute joint.
 * @function b2RevoluteJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @description
 * Sets the angular velocity for the motor of a revolute joint. A positive velocity
 * means the joint will rotate counterclockwise.
 * @throws {Error} Throws an error if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetMotorSpeed(jointId: b2JointId, motorSpeed: number): void;
/**
 * Gets the motor speed of a revolute joint.
 * @function b2RevoluteJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier of the revolute joint.
 * @returns {number} The current motor speed in radians per second.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMotorSpeed(jointId: b2JointId): number;
/**
 * @function b2RevoluteJoint_GetMotorTorque
 * @summary Gets the current motor torque of a revolute joint.
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The current motor torque in Newton-meters.
 * @description
 * Calculates the motor torque by multiplying the motor impulse by the inverse
 * of the time step. The joint must be of type b2_revoluteJoint.
 * @throws {Error} If the joint type is not b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMotorTorque(jointId: b2JointId): number;
/**
 * Sets the maximum motor torque for a revolute joint.
 * @function b2RevoluteJoint_SetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @param {number} torque - The maximum motor torque value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_SetMaxMotorTorque(jointId: b2JointId, torque: number): void;
/**
 * Gets the maximum motor torque of a revolute joint.
 * @function b2RevoluteJoint_GetMaxMotorTorque
 * @param {b2JointId} jointId - The identifier for the revolute joint.
 * @returns {number} The maximum motor torque value.
 * @throws {Error} If the joint is not of type b2_revoluteJoint.
 */
export function b2RevoluteJoint_GetMaxMotorTorque(jointId: b2JointId): number;
export function b2GetRevoluteJointForce(world: any, base: any): b2Vec2;
export function b2GetRevoluteJointTorque(world: any, base: any): number;
export function b2PrepareRevoluteJoint(base: any, context: any): void;
export function b2WarmStartRevoluteJoint(base: any, context: any): void;
export function b2SolveRevoluteJoint(base: any, context: any, useBias: any): void;
export function b2DrawRevoluteJoint(draw: any, base: any, transformA: any, transformB: any, drawSize: any): void;
import type { b2JointId } from './include/id_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
