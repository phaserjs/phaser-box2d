/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2DistanceJoint_SetLength, b2DistanceJoint_GetLength,
    b2DistanceJoint_EnableLimit, b2DistanceJoint_IsLimitEnabled,
    b2DistanceJoint_SetLengthRange, b2DistanceJoint_GetMinLength, b2DistanceJoint_GetMaxLength,
    b2DistanceJoint_GetCurrentLength,
    b2DistanceJoint_EnableSpring, b2DistanceJoint_IsSpringEnabled,
    b2DistanceJoint_SetSpringHertz, b2DistanceJoint_SetSpringDampingRatio,
    b2DistanceJoint_GetHertz, b2DistanceJoint_GetDampingRatio,
    b2DistanceJoint_EnableMotor, b2DistanceJoint_IsMotorEnabled,
    b2DistanceJoint_SetMotorSpeed, b2DistanceJoint_GetMotorSpeed,
    b2DistanceJoint_GetMotorForce, b2DistanceJoint_SetMaxMotorForce, b2DistanceJoint_GetMaxMotorForce,
    b2GetDistanceJointForce,
    b2PrepareDistanceJoint, b2WarmStartDistanceJoint, b2SolveDistanceJoint,
    b2DrawDistanceJoint
} from '../distance_joint_c.js';
