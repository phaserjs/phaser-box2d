export namespace b2ContactSimFlags {
    let b2_simTouchingFlag: number;
    let b2_simDisjoint: number;
    let b2_simStartedTouching: number;
    let b2_simStoppedTouching: number;
    let b2_simEnableHitEvent: number;
    let b2_simEnablePreSolveEvents: number;
}
export { b2ContactFlags, b2ContactSim, b2Contact, b2ContactEdge, b2InitializeContactRegisters, b2CreateContact, b2DestroyContact, b2GetContactSim, b2ShouldShapesCollide, b2UpdateContact } from "../contact_c.js";
