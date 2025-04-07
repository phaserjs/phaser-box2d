/**
 * @namespace WeldJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * Sets the linear frequency (hertz) for a weld joint.
 * @function b2WeldJoint_SetLinearHertz
 * @param {b2JointId} jointId - The identifier for the weld joint to modify
 * @param {number} hertz - The frequency in hertz (must be >= 0)
 * @returns {void}
 * @throws {Error} If the hertz value is invalid or negative
 */
export function b2WeldJoint_SetLinearHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the linear Hertz value from a weld joint.
 * @function b2WeldJoint_GetLinearHertz
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The linear Hertz value of the weld joint.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetLinearHertz(jointId: b2JointId): number;
/**
 * Sets the linear damping ratio for a weld joint.
 * @function b2WeldJoint_SetLinearDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} dampingRatio - The damping ratio value. Must be non-negative.
 * @returns {void}
 * @throws {Error} If dampingRatio is invalid or negative.
 */
export function b2WeldJoint_SetLinearDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the linear damping ratio of a weld joint.
 * @function b2WeldJoint_GetLinearDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The linear damping ratio of the weld joint.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetLinearDampingRatio(jointId: b2JointId): number;
/**
 * Sets the angular frequency (hertz) for a weld joint's angular spring-damper.
 * @function b2WeldJoint_SetAngularHertz
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} hertz - The angular frequency in Hertz (must be >= 0).
 * @returns {void}
 * @throws {Error} If the hertz value is invalid (NaN, negative, or infinity).
 * @throws {Error} If the joint is not a weld joint.
 */
export function b2WeldJoint_SetAngularHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the angular frequency (hertz) of a weld joint.
 * @function b2WeldJoint_GetAngularHertz
 * @param {b2JointId} jointId - The identifier for the weld joint.
 * @returns {number} The angular frequency in hertz.
 * @throws {Error} If the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetAngularHertz(jointId: b2JointId): number;
/**
 * Sets the angular damping ratio for a weld joint.
 * @function b2WeldJoint_SetAngularDampingRatio
 * @param {b2JointId} jointId - The identifier for the weld joint to modify.
 * @param {number} dampingRatio - The angular damping ratio. Must be non-negative.
 * @returns {void}
 * @throws {Error} If dampingRatio is invalid or negative.
 */
export function b2WeldJoint_SetAngularDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the angular damping ratio of a weld joint.
 * @function b2WeldJoint_GetAngularDampingRatio
 * @param {b2JointId} jointId - The identifier of the weld joint.
 * @returns {number} The angular damping ratio of the weld joint.
 * @throws {Error} Throws an error if the joint is not of type b2_weldJoint.
 */
export function b2WeldJoint_GetAngularDampingRatio(jointId: b2JointId): number;
export function b2GetWeldJointForce(world: any, base: any): b2Vec2;
export function b2GetWeldJointTorque(world: any, base: any): number;
export function b2PrepareWeldJoint(base: any, context: any): void;
export function b2WarmStartWeldJoint(base: any, context: any): void;
export function b2SolveWeldJoint(base: any, context: any, useBias: any): void;
import type { b2JointId } from './include/id_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
