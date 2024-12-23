/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import {
    B2_SHAPE_PAIR_KEY,
    b2AddKey,
    b2ClearSet,
    b2ContainsKey,
    b2CreateSet,
    b2DestroySet,
    b2RemoveKey
} from "./include/table_h.js";
import { b2AllocateStackItem, b2FreeStackItem } from "./include/stack_allocator_h.js";
import { b2CreateContact, b2ShouldShapesCollide } from "./include/contact_h.js";
import { b2DynamicTree, b2DynamicTree_GetUserData, b2DynamicTree_QueryAll } from "./include/dynamic_tree_h.js";
import {
    b2DynamicTree_Create,
    b2DynamicTree_CreateProxy,
    b2DynamicTree_Destroy,
    b2DynamicTree_DestroyProxy,
    b2DynamicTree_EnlargeProxy,
    b2DynamicTree_MoveProxy,
    b2DynamicTree_Rebuild
} from "./include/dynamic_tree_h.js";
import { b2GetBody, b2ShouldBodiesCollide } from "./include/body_h.js";

import { B2_NULL_INDEX } from "./include/core_h.js";
import { b2AABB_Overlaps } from "./include/aabb_h.js";
import { b2BodyType } from "./include/types_h.js";
import { b2ShapeId } from "./include/id_h.js";
import { b2ValidateSolverSets } from "./world_c.js";

/**
 * @namespace Broadphase
 */

/**
 * @description The broad-phase is used for computing pairs and performing volume queries and ray casts.
 * This broad-phase does not persist pairs. Instead, this reports potentially new pairs.
 * It is up to the client to consume the new pairs and to track subsequent overlap.
 */
class b2BroadPhase
{
    constructor()
    {
        this.trees = new Array(b2BodyType.b2_bodyTypeCount).fill().map(() => new b2DynamicTree());

        // this.proxyCount = 0;
        this.moveSet = null;
        this.moveArray = null;
        this.moveResults = null;
        this.movePairs = null;
        this.movePairCapacity = 0;
        this.movePairIndex = 0;
        this.pairSet = null;
    }
}

// Store the proxy type in the lower 2 bits of the proxy key. This leaves 30 bits for the id.
const B2_PROXY_TYPE = (KEY) => KEY & 3;
const B2_PROXY_ID = (KEY) => KEY >> 2;
const B2_PROXY_KEY = (ID, TYPE) => (ID << 2) | TYPE;

// This is what triggers new contact pairs to be created
// Warning: this must be called in deterministic order
// PJB: possible bug in C code, queryProxy is not uint64_t
// PJB: note that return from b2AddKey is 'false' when the key is added... it returns the 'already added' status
function b2BufferMove(bp, queryProxy)
{
    // Adding 1 because 0 is the sentinel
    if (!b2AddKey(bp.moveSet, queryProxy + 1))
    {
        bp.moveArray.push(queryProxy);
    }
}

function b2CreateBroadPhase(bp)
{
    // bp.proxyCount = 0;
    bp.moveSet = b2CreateSet();
    bp.moveArray = [];
    bp.moveResults = null;
    bp.movePairs = null;
    bp.movePairCapacity = 0;
    bp.movePairIndex = 0;
    bp.pairSet = b2CreateSet();

    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        bp.trees[i] = b2DynamicTree_Create();
    }
}

function b2DestroyBroadPhase(bp)
{
    for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i)
    {
        b2DynamicTree_Destroy(bp.trees[i]);
    }

    b2DestroySet(bp.moveSet);
    bp.moveArray = null;
    b2DestroySet(bp.pairSet);

    Object.keys(bp).forEach(key => delete bp[key]);
}

function b2UnBufferMove(bp, proxyKey)
{
    const found = b2RemoveKey(bp.moveSet, proxyKey + 1);

    if (found)
    {
        const count = bp.moveArray.length;

        for (let i = 0; i < count; ++i)
        {
            if (bp.moveArray[i] === proxyKey)
            {
                // swap and pop to remove that element
                bp.moveArray[i] = bp.moveArray[count - 1];
                bp.moveArray.pop();

                break;
            }
        }
    }
}

function b2BroadPhase_CreateProxy(bp, proxyType, aabb, categoryBits, shapeIndex, forcePairCreation)
{
    console.assert(0 <= proxyType && proxyType < b2BodyType.b2_bodyTypeCount);
    const proxyId = b2DynamicTree_CreateProxy(bp.trees[proxyType], aabb, categoryBits, shapeIndex);
    const proxyKey = B2_PROXY_KEY(proxyId, proxyType);

    if (proxyType !== b2BodyType.b2_staticBody || forcePairCreation)
    {
        b2BufferMove(bp, proxyKey);
    }

    return proxyKey;
}

function b2BroadPhase_DestroyProxy(bp, proxyKey)
{
    console.assert(bp.moveArray.length === bp.moveSet.size);
    b2UnBufferMove(bp, proxyKey);

    // --bp.proxyCount;

    const proxyType = B2_PROXY_TYPE(proxyKey);
    const proxyId = B2_PROXY_ID(proxyKey);

    console.assert(0 <= proxyType && proxyType <= b2BodyType.b2_bodyTypeCount);
    b2DynamicTree_DestroyProxy(bp.trees[proxyType], proxyId);
}

function b2BroadPhase_MoveProxy(bp, proxyKey, aabb)
{
    const proxyType = B2_PROXY_TYPE(proxyKey);
    const proxyId = B2_PROXY_ID(proxyKey);

    b2DynamicTree_MoveProxy(bp.trees[proxyType], proxyId, aabb);
    b2BufferMove(bp, proxyKey);
}

function b2BroadPhase_EnlargeProxy(bp, proxyKey, aabb)
{
    console.assert(proxyKey !== B2_NULL_INDEX);
    const typeIndex = B2_PROXY_TYPE(proxyKey);
    const proxyId = B2_PROXY_ID(proxyKey);

    console.assert(typeIndex !== b2BodyType.b2_staticBody);

    b2DynamicTree_EnlargeProxy(bp.trees[typeIndex], proxyId, aabb);
    b2BufferMove(bp, proxyKey);
}

class b2MovePair
{
    constructor()
    {
        this.shapeIndexA = 0;
        this.shapeIndexB = 0;
        this.next = null;
    }
}

class b2MoveResult
{
    constructor()
    {
        this.pairList = null;
    }
}

class b2QueryPairContext
{
    constructor()
    {
        this.world = null;
        this.moveResult = null;     // b2MoveResult
        this.queryTreeType = 0;
        this.queryProxyKey = 0;
        this.queryShapeIndex = 0;
    }
}

export function b2PairQueryCallback(proxyId, shapeId, context)
{
    const queryContext = context;
    const bp = queryContext.world.broadPhase;

    const proxyKey = B2_PROXY_KEY(proxyId, queryContext.queryTreeType);

    if (proxyKey === queryContext.queryProxyKey)
    {
        return true;
    }

    if (queryContext.queryTreeType !== b2BodyType.b2_staticBody)
    {
        if (proxyKey < queryContext.queryProxyKey && b2ContainsKey(bp.moveSet, proxyKey + 1))
        {
            return true;
        }
    }

    const pairKey = B2_SHAPE_PAIR_KEY(shapeId, queryContext.queryShapeIndex);

    if (b2ContainsKey(bp.pairSet, pairKey)) // key in set.items
    {
        return true;
    }

    let shapeIdA, shapeIdB;

    if (proxyKey < queryContext.queryProxyKey)
    {
        shapeIdA = shapeId;
        shapeIdB = queryContext.queryShapeIndex;
    }
    else
    {
        shapeIdA = queryContext.queryShapeIndex;
        shapeIdB = shapeId;
    }

    const world = queryContext.world;

    // b2CheckId(world.shapeArray, shapeIdA);
    // b2CheckId(world.shapeArray, shapeIdB);

    const shapeA = world.shapeArray[shapeIdA];
    const shapeB = world.shapeArray[shapeIdB];

    const bodyIdA = shapeA.bodyId;
    const bodyIdB = shapeB.bodyId;

    if (bodyIdA === bodyIdB)
    {
        return true;
    }

    if (!b2ShouldShapesCollide(shapeA.filter, shapeB.filter))
    {
        return true;
    }

    if (shapeA.isSensor && shapeB.isSensor)
    {
        return true;
    }

    const bodyA = b2GetBody(world, bodyIdA);
    const bodyB = b2GetBody(world, bodyIdB);

    if (!b2ShouldBodiesCollide(world, bodyA, bodyB))
    {
        return true;
    }

    const customFilterFcn = queryContext.world.customFilterFcn;

    if (customFilterFcn)
    {
        const idA = new b2ShapeId(shapeIdA + 1, world.worldId, shapeA.revision);
        const idB = new b2ShapeId(shapeIdB + 1, world.worldId, shapeB.revision);
        const shouldCollide = customFilterFcn(idA, idB, queryContext.world.customFilterContext);

        if (!shouldCollide)
        {
            return true;
        }
    }

    const pairIndex = bp.movePairIndex++;

    let pair;

    if (pairIndex < bp.movePairCapacity)
    {
        pair = bp.movePairs[pairIndex];
    }
    else
    {
        pair = new b2MovePair();
    }

    pair.shapeIndexA = shapeIdA;
    pair.shapeIndexB = shapeIdB;
    pair.next = queryContext.moveResult.pairList;
    queryContext.moveResult.pairList = pair;

    return true;
}

function b2UpdateBroadPhasePairs(world)
{
    const bp = world.broadPhase;
    const moveCount = bp.moveArray.length;
    
    if (moveCount === 0) { return; }

    const alloc = world.stackAllocator;
    bp.moveResults = b2AllocateStackItem(alloc, moveCount, "move results", () => new b2MoveResult());
    
    b2FindPairsTask(0, moveCount, world);

    const shapes = world.shapeArray;

    for (const result of bp.moveResults)
    {
        for (let pair = result.pairList; pair; pair = pair.next)
        {
            b2CreateContact(world, shapes[pair.shapeIndexA], shapes[pair.shapeIndexB]);
        }
    }

    bp.moveArray.length = 0;
    b2ClearSet(bp.moveSet);
    b2FreeStackItem(alloc, bp.moveResults);
    bp.moveResults = null;

    b2ValidateSolverSets(world);
}

function b2FindPairsTask(startIndex, endIndex, world)
{
    const bp = world.broadPhase;
    const queryContext = new b2QueryPairContext();
    queryContext.world = world;

    for (let i = startIndex; i < endIndex; ++i)
    {
        const proxyKey = bp.moveArray[i];

        if (proxyKey === B2_NULL_INDEX) { continue; }

        const proxyType = B2_PROXY_TYPE(proxyKey);  // possible values = 0,1,2,3
        const proxyId = B2_PROXY_ID(proxyKey);
        queryContext.queryProxyKey = proxyKey;
        
        const baseTree = bp.trees[proxyType];
        const fatAABB = baseTree.nodes[proxyId].aabb;   // b2DynamicTree_GetAABB(baseTree, proxyId);
        queryContext.queryShapeIndex = b2DynamicTree_GetUserData(baseTree, proxyId);
        
        const moveResult = bp.moveResults[i];
        moveResult.pairList = null;
        queryContext.moveResult = moveResult;

        if (proxyType === b2BodyType.b2_dynamicBody)
        {
            b2QueryTreeForPairs(bp, fatAABB, queryContext, b2BodyType.b2_kinematicBody);
            b2QueryTreeForPairs(bp, fatAABB, queryContext, b2BodyType.b2_staticBody);
        }
        
        queryContext.queryTreeType = b2BodyType.b2_dynamicBody;
        b2DynamicTree_QueryAll(bp.trees[b2BodyType.b2_dynamicBody], fatAABB, queryContext);
    }
}

function b2QueryTreeForPairs(bp, fatAABB, queryContext, treeType)
{
    queryContext.queryTreeType = treeType;
    b2DynamicTree_QueryAll(bp.trees[treeType], fatAABB, queryContext);
}

function b2BroadPhase_TestOverlap(bp, proxyKeyA, proxyKeyB)
{
    const typeIndexA = B2_PROXY_TYPE(proxyKeyA);
    const proxyIdA = B2_PROXY_ID(proxyKeyA);
    const typeIndexB = B2_PROXY_TYPE(proxyKeyB);
    const proxyIdB = B2_PROXY_ID(proxyKeyB);

    const aabbA = bp.trees[typeIndexA].nodes[proxyIdA].aabb; // b2DynamicTree_GetAABB(bp.trees[typeIndexA], proxyIdA);
    const aabbB = bp.trees[typeIndexB].nodes[proxyIdB].aabb; // b2DynamicTree_GetAABB(bp.trees[typeIndexB], proxyIdB);

    return b2AABB_Overlaps(aabbA, aabbB);
}

function b2BroadPhase_RebuildTrees(bp)
{
    b2DynamicTree_Rebuild(bp.trees[b2BodyType.b2_dynamicBody]);
    b2DynamicTree_Rebuild(bp.trees[b2BodyType.b2_kinematicBody]);
}

function b2BroadPhase_GetShapeIndex(bp, proxyKey)
{
    const typeIndex = B2_PROXY_TYPE(proxyKey);
    const proxyId = B2_PROXY_ID(proxyKey);

    return b2DynamicTree_GetUserData(bp.trees[typeIndex], proxyId);
}

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
};
