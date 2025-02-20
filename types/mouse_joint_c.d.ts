/**
 * @namespace MouseJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * @summary Sets the target position for a mouse joint.
 * @function b2MouseJoint_SetTarget
 * @param {b2JointId} jointId - The identifier of the mouse joint to modify.
 * @param {b2Vec2} target - The new target position vector to set.
 * @returns {void}
 * @description
 * Updates the target position of a mouse joint by cloning the provided target vector.
 * The joint must be of type b2_mouseJoint.
 * @throws {Error} Throws an error if the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_SetTarget(jointId: b2JointId, target: b2Vec2): void;
/**
 * @function b2MouseJoint_GetTarget
 * @summary Gets the target point of a mouse joint.
 * @param {b2JointId} jointId - The identifier of the mouse joint.
 * @returns {b2Vec2} The target point of the mouse joint.
 * @throws {Error} If the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_GetTarget(jointId: b2JointId): b2Vec2;
/**
 * @summary Sets the spring frequency (in Hertz) for a mouse joint.
 * @function b2MouseJoint_SetSpringHertz
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} hertz - The spring frequency in Hertz (Hz).
 * @returns {void}
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_SetSpringHertz(jointId: b2JointId, hertz: number): void;
/**
 * Gets the spring frequency in Hertz from a mouse joint.
 * @function b2MouseJoint_GetSpringHertz
 * @param {b2JointId} jointId - The identifier for the mouse joint.
 * @returns {number} The spring frequency in Hertz.
 * @throws {Error} If the joint is not a mouse joint type.
 */
export function b2MouseJoint_GetSpringHertz(jointId: b2JointId): number;
/**
 * Sets the damping ratio for a mouse joint.
 * @function b2MouseJoint_SetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} dampingRatio - The damping ratio value to set.
 * @returns {void}
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_SetSpringDampingRatio(jointId: b2JointId, dampingRatio: number): void;
/**
 * Gets the spring damping ratio of a mouse joint.
 * @function b2MouseJoint_GetSpringDampingRatio
 * @param {b2JointId} jointId - The identifier of the mouse joint.
 * @returns {number} The spring damping ratio value of the mouse joint.
 * @throws {Error} Throws if the joint is not a mouse joint type.
 */
export function b2MouseJoint_GetSpringDampingRatio(jointId: b2JointId): number;
/**
 * @summary Sets the maximum force for a mouse joint.
 * @function b2MouseJoint_SetMaxForce
 * @param {b2JointId} jointId - The identifier for the mouse joint to modify.
 * @param {number} maxForce - The maximum force value to set for the joint.
 * @returns {void}
 * @description
 * Sets the maximum force that can be applied by the mouse joint to maintain its constraint.
 * @throws {Error} Throws an error if the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_SetMaxForce(jointId: b2JointId, maxForce: number): void;
/**
 * Gets the maximum force value from a mouse joint.
 * @function b2MouseJoint_GetMaxForce
 * @param {b2JointId} jointId - The identifier for the mouse joint.
 * @returns {number} The maximum force value of the mouse joint.
 * @throws {Error} If the joint is not of type b2_mouseJoint.
 */
export function b2MouseJoint_GetMaxForce(jointId: b2JointId): number;
export function b2GetMouseJointForce(world: any, base: any): b2Vec2;
export function b2GetMouseJointTorque(world: any, base: any): number;
export function b2PrepareMouseJoint(base: any, context: any): void;
export function b2WarmStartMouseJoint(base: any, context: any): void;
export function b2SolveMouseJoint(base: any, context: any): void;
import type { b2JointId } from './include/id_h.js';
import { b2Vec2 } from "./include/math_functions_h.js";
