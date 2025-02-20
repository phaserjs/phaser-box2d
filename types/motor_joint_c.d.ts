/**
 * @namespace MotorJoint
 */
/**
 * @import {b2JointId} from './include/id_h.js'
 */
/**
 * @summary Sets the target linear offset for a motor joint.
 * @function b2MotorJoint_SetLinearOffset
 * @param {b2JointId} jointId - The identifier for the motor joint to modify.
 * @param {b2Vec2} linearOffset - The desired linear offset in local coordinates.
 * @returns {void}
 * @description
 * Updates the target linear offset of a motor joint. The linear offset represents
 * the desired translation between the two bodies connected by the joint.
 * @throws {Error} Throws if the joint is not a motor joint or if the jointId is invalid.
 */
export function b2MotorJoint_SetLinearOffset(jointId: b2JointId, linearOffset: b2Vec2): void;
/**
 * Gets the linear offset of a motor joint.
 * @function b2MotorJoint_GetLinearOffset
 * @param {b2JointId} jointId - The identifier of the motor joint.
 * @returns {b2Vec2} The linear offset vector of the motor joint.
 * @throws {Error} If the joint is not a motor joint or the joint ID is invalid.
 */
export function b2MotorJoint_GetLinearOffset(jointId: b2JointId): b2Vec2;
/**
 * @summary Sets the target angular offset for a motor joint.
 * @function b2MotorJoint_SetAngularOffset
 * @param {b2JointId} jointId - The identifier for the motor joint to modify.
 * @param {number} angularOffset - The desired angular offset in radians, clamped between -π and π.
 * @returns {void}
 * @description
 * Sets the target angular offset for a motor joint, which defines the desired relative rotation
 * between the connected bodies. The input angle is automatically clamped to the range [-π, π].
 * @throws {Error} Throws if the joint is not a motor joint type.
 */
export function b2MotorJoint_SetAngularOffset(jointId: b2JointId, angularOffset: number): void;
/**
 * @summary Gets the angular offset of a motor joint.
 * @function b2MotorJoint_GetAngularOffset
 * @param {b2JointId} jointId - The identifier of the motor joint.
 * @returns {number} The angular offset value of the motor joint in radians.
 * @throws {Error} Throws if the joint is not a motor joint or if the joint ID is invalid.
 */
export function b2MotorJoint_GetAngularOffset(jointId: b2JointId): number;
/**
 * Sets the maximum force that can be applied by a motor joint.
 * @function b2MotorJoint_SetMaxForce
 * @param {b2JointId} jointId - The identifier for the motor joint
 * @param {number} maxForce - The maximum force value to set. Will be clamped to non-negative values.
 * @returns {void}
 * @throws {Error} If the joint is not a motor joint type
 */
export function b2MotorJoint_SetMaxForce(jointId: b2JointId, maxForce: number): void;
/**
 * Gets the maximum force value from a motor joint.
 * @function b2MotorJoint_GetMaxForce
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The maximum force value of the motor joint.
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_GetMaxForce(jointId: b2JointId): number;
/**
 * Sets the maximum torque that can be applied by a motor joint.
 * @function b2MotorJoint_SetMaxTorque
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @param {number} maxTorque - The maximum torque value. Will be clamped to non-negative values.
 * @returns {void}
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_SetMaxTorque(jointId: b2JointId, maxTorque: number): void;
/**
 * Gets the maximum torque value for a motor joint.
 * @function b2MotorJoint_GetMaxTorque
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The maximum torque value of the motor joint.
 * @throws {Error} If the joint is not of type b2_motorJoint.
 */
export function b2MotorJoint_GetMaxTorque(jointId: b2JointId): number;
/**
 * @function b2MotorJoint_SetCorrectionFactor
 * @summary Sets the position correction factor for a motor joint.
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @param {number} correctionFactor - The correction factor value, clamped between 0 and 1.
 * @returns {void}
 * @description
 * Sets the position correction factor for a motor joint, which determines how much position error is corrected each time step.
 * The correction factor is automatically clamped between 0 and 1.
 * @throws {Error} Throws an error if the joint is not a motor joint type.
 */
export function b2MotorJoint_SetCorrectionFactor(jointId: b2JointId, correctionFactor: number): void;
/**
 * Gets the correction factor of a motor joint.
 * @function b2MotorJoint_GetCorrectionFactor
 * @param {b2JointId} jointId - The identifier for the motor joint.
 * @returns {number} The correction factor value of the motor joint.
 * @throws {Error} If the joint is not a motor joint type.
 */
export function b2MotorJoint_GetCorrectionFactor(jointId: b2JointId): number;
export function b2GetMotorJointForce(world: any, base: any): b2Vec2;
export function b2GetMotorJointTorque(world: any, base: any): number;
export function b2PrepareMotorJoint(base: any, context: any): void;
export function b2WarmStartMotorJoint(base: any, context: any): void;
export function b2SolveMotorJoint(base: any, context: any, useBias: any): void;
import type { b2JointId } from './include/id_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
