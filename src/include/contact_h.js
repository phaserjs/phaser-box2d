/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2ContactFlags,
    b2ContactSim, b2Contact, b2ContactEdge,
    b2InitializeContactRegisters, b2CreateContact, b2DestroyContact, b2GetContactSim, b2ShouldShapesCollide, b2UpdateContact
} from '../contact_c.js';

export const b2ContactSimFlags = {
    b2_simTouchingFlag: 0x00010000,
    b2_simDisjoint: 0x00020000,
    b2_simStartedTouching: 0x00040000,
    b2_simStoppedTouching: 0x00080000,
    b2_simEnableHitEvent: 0x00100000,
    b2_simEnablePreSolveEvents: 0x00200000,
};

