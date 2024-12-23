/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2PrepareMotorJoint, b2WarmStartMotorJoint, b2SolveMotorJoint,
    b2MotorJoint_GetAngularOffset, b2MotorJoint_SetAngularOffset, b2MotorJoint_GetCorrectionFactor, b2MotorJoint_SetCorrectionFactor,
    b2MotorJoint_GetLinearOffset, b2MotorJoint_SetLinearOffset, b2MotorJoint_GetMaxForce, b2MotorJoint_SetMaxForce,
    b2MotorJoint_GetMaxTorque, b2MotorJoint_SetMaxTorque,
    b2GetMotorJointForce, b2GetMotorJointTorque
} from '../motor_joint_c.js';
