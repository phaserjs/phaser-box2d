export function b2PairQueryCallback(proxyId: any, shapeId: any, context: any): boolean;
/**
 * @namespace Broadphase
 */
/**
 * @description The broad-phase is used for computing pairs and performing volume queries and ray casts.
 * This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
 * It is up to the client to consume the new pairs and to track subsequent overlap.
 */
export class b2BroadPhase {
    trees: any;
    moveSet: any;
    moveArray: any;
    moveResults: any;
    movePairs: any;
    movePairCapacity: number;
    movePairIndex: number;
    pairSet: any;
}
export function B2_PROXY_ID(KEY: any): number;
export function B2_PROXY_KEY(ID: any, TYPE: any): number;
export function B2_PROXY_TYPE(KEY: any): number;
export function b2BufferMove(bp: any, queryProxy: any): void;
export function b2CreateBroadPhase(bp: any): void;
export function b2DestroyBroadPhase(bp: any): void;
export function b2BroadPhase_CreateProxy(bp: any, proxyType: any, aabb: any, categoryBits: any, shapeIndex: any, forcePairCreation: any): number;
export function b2BroadPhase_DestroyProxy(bp: any, proxyKey: any): void;
export function b2BroadPhase_MoveProxy(bp: any, proxyKey: any, aabb: any): void;
export function b2BroadPhase_EnlargeProxy(bp: any, proxyKey: any, aabb: any): void;
export function b2BroadPhase_RebuildTrees(bp: any): void;
export function b2BroadPhase_GetShapeIndex(bp: any, proxyKey: any): number;
export function b2UpdateBroadPhasePairs(world: any): void;
export function b2BroadPhase_TestOverlap(bp: any, proxyKeyA: any, proxyKeyB: any): boolean;
