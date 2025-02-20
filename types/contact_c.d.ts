export function b2CircleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2CapsuleAndCircleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2CapsuleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): void;
export function b2PolygonAndCircleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2PolygonAndCapsuleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2PolygonManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2SegmentAndCircleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2SegmentAndCapsuleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): void;
export function b2SegmentAndPolygonManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2ChainSegmentAndCircleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): any;
export function b2ChainSegmentAndCapsuleManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2ChainSegmentAndPolygonManifold(shapeA: any, xfA: any, shapeB: any, xfB: any, cache: any, manifold: any): b2Manifold;
export function b2AddType(fcn: any, type1: any, type2: any): void;
export function b2InitializeContactRegisters(): void;
export function b2CreateContact(world: any, shapeA: any, shapeB: any): void;
export function b2DestroyContact(world: any, contact: any, wakeBodies: any): void;
export function b2GetContactSim(world: any, contact: any): any;
export function b2ShouldShapesCollide(filterA: any, filterB: any): boolean;
export function b2UpdateContact(world: any, contactSim: any, shapeA: any, transformA: any, centerOffsetA: any, shapeB: any, transformB: any, centerOffsetB: any): any;
export function b2ComputeManifold(shapeA: any, transformA: any, shapeB: any, transformB: any, manifold: any): any;
export namespace b2ContactFlags {
    let b2_contactTouchingFlag: number;
    let b2_contactHitEventFlag: number;
    let b2_contactSensorFlag: number;
    let b2_contactSensorTouchingFlag: number;
    let b2_contactEnableSensorEvents: number;
    let b2_contactEnableContactEvents: number;
}
export class b2ContactEdge {
    bodyId: number;
    prevKey: number;
    nextKey: number;
}
export class b2Contact {
    setIndex: number;
    colorIndex: number;
    localIndex: number;
    edges: b2ContactEdge[];
    shapeIdA: number;
    shapeIdB: number;
    islandPrev: number;
    islandNext: number;
    islandId: number;
    contactId: number;
    flags: number;
    isMarked: boolean;
}
export class b2ContactSim {
    constructor(manifold?: b2Manifold);
    contactId: number;
    _bodyIdA: number;
    _bodyIdB: number;
    bodySimIndexA: number;
    bodySimIndexB: number;
    shapeIdA: number;
    shapeIdB: number;
    invMassA: number;
    invIA: number;
    invMassB: number;
    invIB: number;
    manifold: b2Manifold;
    friction: number;
    restitution: number;
    tangentSpeed: number;
    simFlags: number;
    cache: b2DistanceCache;
    set(src: any): void;
}
import { b2Manifold } from './include/collision_h.js';
import { b2DistanceCache } from './include/collision_h.js';
