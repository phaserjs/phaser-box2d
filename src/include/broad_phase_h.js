/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2BroadPhase,
    B2_PROXY_ID,
    B2_PROXY_KEY,
    B2_PROXY_TYPE,
    b2BufferMove,
    b2CreateBroadPhase,
    b2DestroyBroadPhase,
    b2BroadPhase_CreateProxy,
    b2BroadPhase_DestroyProxy,
    b2BroadPhase_MoveProxy,
    b2BroadPhase_EnlargeProxy,
    b2BroadPhase_RebuildTrees,
    b2BroadPhase_GetShapeIndex,
    b2UpdateBroadPhasePairs,
    b2BroadPhase_TestOverlap,
    b2PairQueryCallback
} from '../broad_phase_c.js';

