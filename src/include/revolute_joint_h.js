/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2DrawRevoluteJoint, b2PrepareRevoluteJoint, b2WarmStartRevoluteJoint, b2SolveRevoluteJoint,
    b2GetRevoluteJointForce, b2GetRevoluteJointTorque,
    b2RevoluteJoint_EnableSpring,
    b2RevoluteJoint_SetSpringHertz,
    b2RevoluteJoint_GetSpringHertz,
    b2RevoluteJoint_SetSpringDampingRatio,
    b2RevoluteJoint_GetSpringDampingRatio,
    b2RevoluteJoint_GetAngle,
    b2RevoluteJoint_EnableLimit,
    b2RevoluteJoint_IsLimitEnabled,
    b2RevoluteJoint_GetLowerLimit,
    b2RevoluteJoint_GetUpperLimit,
    b2RevoluteJoint_SetLimits,
    b2RevoluteJoint_EnableMotor,
    b2RevoluteJoint_IsMotorEnabled,
    b2RevoluteJoint_SetMotorSpeed,
    b2RevoluteJoint_GetMotorSpeed,
    b2RevoluteJoint_GetMotorTorque,
    b2RevoluteJoint_SetMaxMotorTorque,
    b2RevoluteJoint_GetMaxMotorTorque,
    b2RevoluteJoint_IsSpringEnabled,
} from '../revolute_joint_c.js';
