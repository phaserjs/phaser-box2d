/**
 * @namespace PrismaticJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * @function b2PrismaticJoint_EnableSpring
 * @summary Enables or disables the spring functionality of a prismatic joint.
 * @param {b2JointId} jointId - The identifier of the prismatic joint to modify.
 * @param {boolean} enableSpring - Whether to enable (true) or disable (false) the spring.
 * @returns {void}
 * @description
 * Sets the spring state of a prismatic joint. When the spring state changes,
 * the spring impulse is reset to zero. If the state doesn't change, no action is taken.
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_EnableSpring(jointId: b2JointId, enableSpring: boolean): void;
/**
 * @summary Checks if the spring mechanism is enabled for a prismatic joint.
 * @function b2PrismaticJoint_IsSpringEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the spring mechanism is enabled, false otherwise.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsSpringEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the spring frequency (in Hertz) for a prismatic joint.
 * @function b2PrismaticJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the prismatic joint to modify.
 * @param {number} hertz - The spring frequency in Hertz.
 * @returns {void}
 * @description
 * Updates the spring frequency of a prismatic joint. The joint must be of type b2_prismaticJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetSpringHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the spring frequency in Hertz for a prismatic joint.
 * @function b2PrismaticJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetSpringHertz(jointId: b2JointId): number;
/**
 * @summary Sets the damping ratio for a prismatic joint's spring.
 * @function b2PrismaticJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} dampingRatio - The damping ratio for the spring.
 * @returns {void}
 * @description
 * Sets the spring damping ratio for a prismatic joint. The joint must be of type b2_prismaticJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetSpringDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the spring damping ratio of a prismatic joint.
 * @function b2PrismaticJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The spring damping ratio value.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetSpringDampingRatio(jointId: b2JointId): number;
/**
 * @function b2PrismaticJoint_EnableLimit
 * @description
 * Enables or disables the translation limits on a prismatic joint. When the limit is disabled,
 * the joint's limit impulses are reset to zero.
 * @param {b2JointId} jointId - The identifier for the prismatic joint
 * @param {boolean} enableLimit - True to enable the translation limit, false to disable it
 * @returns {void}
 * @throws {Error} If the joint identified by jointId is not a prismatic joint
 */
export function b2PrismaticJoint_EnableLimit(jointId: b2JointId, enableLimit: boolean): void;
/**
 * @summary Checks if the limit is enabled for a prismatic joint.
 * @function b2PrismaticJoint_IsLimitEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the limit is enabled for the joint, false otherwise.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsLimitEnabled(jointId: b2JointId): boolean;
/**
 * @summary Gets the lower translation limit of a prismatic joint.
 * @function b2PrismaticJoint_GetLowerLimit
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The lower translation limit of the prismatic joint.
 * @throws {Error} Throws an error if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetLowerLimit(jointId: b2JointId): number;
/**
 * @function b2PrismaticJoint_GetUpperLimit
 * @summary Gets the upper translation limit of a prismatic joint.
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The upper translation limit of the prismatic joint.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetUpperLimit(jointId: b2JointId): number;
/**
 * Sets the translation limits for a prismatic joint.
 * @function b2PrismaticJoint_SetLimits
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} lower - The lower translation limit.
 * @param {number} upper - The upper translation limit.
 * @returns {void}
 * @description
 * Sets new translation limits for a prismatic joint. The function automatically
 * orders the limits so that the lower value is always less than or equal to
 * the upper value. When the limits change, the joint's impulses are reset to zero.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetLimits(jointId: b2JointId, lower: number, upper: number): void;
/**
 * @function b2PrismaticJoint_EnableMotor
 * @description
 * Enables or disables the motor on a prismatic joint. When the motor is disabled,
 * the motor impulse is reset to zero.
 * @param {b2JointId} jointId - The identifier for the prismatic joint
 * @param {boolean} enableMotor - True to enable the motor, false to disable it
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_prismaticJoint
 */
export function b2PrismaticJoint_EnableMotor(jointId: b2JointId, enableMotor: boolean): void;
/**
 * @summary Checks if the motor is enabled on a prismatic joint.
 * @function b2PrismaticJoint_IsMotorEnabled
 * @param {b2JointId} jointId - The identifier for the prismatic joint to check.
 * @returns {boolean} True if the motor is enabled, false otherwise.
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_IsMotorEnabled(jointId: b2JointId): boolean;
/**
 * @summary Sets the motor speed for a prismatic joint.
 * @function b2PrismaticJoint_SetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the prismatic joint to modify.
 * @param {number} motorSpeed - The desired motor speed in radians per second.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetMotorSpeed(jointId: b2JointId, motorSpeed: number): void;
/**
 * Gets the motor speed of a prismatic joint.
 * @function b2PrismaticJoint_GetMotorSpeed
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The current motor speed of the prismatic joint.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetMotorSpeed(jointId: b2JointId): number;
/**
 * @function b2PrismaticJoint_GetMotorForce
 * @param {b2JointId} jointId - The ID of the prismatic joint
 * @returns {number} The current motor force in Newtons
 * @description
 * Gets the current motor force of a prismatic joint. The force is calculated by
 * multiplying the joint's motor impulse by the inverse of the world's time step.
 * @throws {Error} Throws if the joint type is not a prismatic joint
 */
export function b2PrismaticJoint_GetMotorForce(jointId: b2JointId): number;
/**
 * Sets the maximum motor force for a prismatic joint.
 * @function b2PrismaticJoint_SetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @param {number} force - The maximum force the motor can apply.
 * @returns {void}
 * @throws {Error} Throws if the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_SetMaxMotorForce(jointId: b2JointId, force: number): void;
/**
 * Gets the maximum motor force of a prismatic joint.
 * @function b2PrismaticJoint_GetMaxMotorForce
 * @param {b2JointId} jointId - The identifier for the prismatic joint.
 * @returns {number} The maximum force that can be applied by the joint's motor.
 * @throws {Error} If the joint is not of type b2_prismaticJoint.
 */
export function b2PrismaticJoint_GetMaxMotorForce(jointId: b2JointId): number;
export function b2GetPrismaticJointForce(world: any, base: any): b2Vec2;
export function b2GetPrismaticJointTorque(world: any, base: any): number;
export function b2PreparePrismaticJoint(base: any, context: any): void;
export function b2WarmStartPrismaticJoint(base: any, context: any): void;
export function b2SolvePrismaticJoint(base: any, context: any, useBias: any): void;
export function b2DrawPrismaticJoint(draw: any, base: any, transformA: any, transformB: any): void;
import type { b2JointId } from './include/id_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
