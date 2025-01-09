export function b2PrepareOverflowContacts(context: any): void;
export function b2WarmStartOverflowContacts(context: any): void;
export function b2SolveOverflowContacts(context: any, useBias: any): void;
export function b2ApplyOverflowRestitution(context: any): void;
export function b2StoreOverflowImpulses(context: any): void;
/**
 * @namespace ContactSolver
 */
export class b2ContactConstraint {
    indexA: number;
    indexB: number;
    normalX: number;
    normalY: number;
    friction: number;
    restitution: number;
    pointCount: number;
    softness: b2Softness;
    invMassA: number;
    invIA: number;
    invMassB: number;
    invIB: number;
    points: any[];
}
export class b2ContactConstraintPoint {
    normalImpulse: number;
    tangentImpulse: number;
    maxNormalImpulse: number;
    anchorAX: number;
    anchorAY: number;
    anchorBX: number;
    anchorBY: number;
    baseSeparation: number;
    normalMass: number;
    tangentMass: number;
    relativeVelocity: number;
}
import { b2Softness } from './include/solver_h.js';
