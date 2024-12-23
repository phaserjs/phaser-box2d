/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2DrawWheelJoint, b2PrepareWheelJoint, b2WarmStartWheelJoint, b2SolveWheelJoint,
    b2WheelJoint_GetMotorSpeed, b2WheelJoint_SetMotorSpeed,
    b2WheelJoint_EnableLimit, b2WheelJoint_EnableSpring, b2WheelJoint_EnableMotor,
    b2WheelJoint_GetMaxMotorTorque, b2WheelJoint_GetLowerLimit, b2WheelJoint_GetUpperLimit, b2WheelJoint_GetSpringDampingRatio,
    b2WheelJoint_SetLimits, b2WheelJoint_SetMaxMotorTorque, b2WheelJoint_SetSpringDampingRatio, b2WheelJoint_SetSpringHertz,
    b2GetWheelJointForce, b2GetWheelJointTorque,
    b2WheelJoint_IsSpringEnabled, b2WheelJoint_GetSpringHertz, b2WheelJoint_IsLimitEnabled, b2WheelJoint_IsMotorEnabled, b2WheelJoint_GetMotorTorque
} from '../wheel_joint_c.js';
