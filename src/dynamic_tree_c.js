/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import * as b2Math from './include/math_functions_h.js';

import { B2_HUGE, B2_NULL_INDEX } from './include/core_h.js';
import { b2AABB_Overlaps, b2EnlargeAABB, b2Perimeter } from './include/aabb_h.js';

import { b2DynamicTree } from './include/dynamic_tree_h.js';
import { b2PairQueryCallback } from './include/broad_phase_h.js';
import { b2TreeNode } from './include/collision_h.js';

/**
 * @namespace DynamicTree
 */

/**
 * @import {b2AABB, b2Vec2} from './include/math_functions_h.js'
 * @import {b2RayCastInput, b2ShapeCastInput} from './include/collision_h.js'
 */

const B2_TREE_STACK_SIZE = 1024;

function b2IsLeaf(node)
{
    return node.height === 0;
}

/**
 * Creates and initializes a new b2DynamicTree instance.
 * @function b2DynamicTree_Create
 * @returns {b2DynamicTree} A new dynamic tree with:
 * - Initial node capacity of 16
 * - Empty root (B2_NULL_INDEX)
 * - Initialized node array with parent/next pointers
 * - All nodes set to height -1
 * - Free list starting at index 0
 * - Zero proxy count
 * - Null leaf indices and centers
 * - Zero rebuild capacity
 * @description
 * Creates a b2DynamicTree data structure used for efficient spatial partitioning.
 * The tree is initialized with a pre-allocated pool of nodes linked in a free list.
 */
export function b2DynamicTree_Create()
{

    const tree = new b2DynamicTree();
    tree.root = B2_NULL_INDEX;

    tree.nodeCapacity = 16;
    tree.nodeCount = 0;
    tree.nodes = Array.from({ length: tree.nodeCapacity }, () => new b2TreeNode());    // Array(tree.nodeCapacity).fill().map(() => new b2TreeNode());

    for (let i = 0; i < tree.nodeCapacity - 1; ++i)
    {
        tree.nodes[i].parent_next = i + 1;
        tree.nodes[i].height = -1;
    }
    tree.nodes[tree.nodeCapacity - 1].parent_next = B2_NULL_INDEX;
    tree.nodes[tree.nodeCapacity - 1].height = -1;
    tree.freeList = 0;

    tree.proxyCount = 0;
    tree.leafIndices = null;

    // tree.leafBoxes = null;
    tree.leafCenters = null;

    // tree.binIndices = null;
    tree.rebuildCapacity = 0;

    return tree;
}

/**
 * @summary Destroys a dynamic tree by clearing its internal data structures.
 * @function b2DynamicTree_Destroy
 * @param {b2DynamicTree} tree - The dynamic tree to destroy.
 * @returns {void}
 * @description
 * Clears the nodes, leaf indices, and leaf centers arrays of the dynamic tree,
 * effectively destroying the tree's data structure.
 */
export function b2DynamicTree_Destroy(tree)
{
    // In JavaScript, we don't need to manually free memory
    tree.nodes = null;
    tree.leafIndices = null;

    // tree.leafBoxes = null;
    tree.leafCenters = null;

    // tree.binIndices = null;
}

function b2AllocateNode(tree)
{
    if (tree.freeList === B2_NULL_INDEX)
    {
        const oldNodes = tree.nodes;
        tree.nodeCapacity += tree.nodeCapacity >> 1;

        tree.nodes = Array.from({ length: tree.nodeCapacity }, () => new b2TreeNode());    // Array(tree.nodeCapacity).fill().map(() => new b2TreeNode());
        // tree.nodes = new Array(tree.nodeCapacity).fill().map((_, i) => {
        //     if (i < oldNodes.length) {
        //         return oldNodes[i];
        //     } else {
        //         return new b2TreeNode();
        //     }
        // });
        tree.nodes = Array.from({ length: tree.nodeCapacity }, (_, i) =>
        {
            if (i < oldNodes.length)
            {
                return oldNodes[i];
            }
            else
            {
                return new b2TreeNode();
            }
        });
        
        for (let i = tree.nodeCount; i < tree.nodeCapacity - 1; ++i)
        {
            tree.nodes[i].parent_next = i + 1;
            tree.nodes[i].height = -1;
        }

        tree.nodes[tree.nodeCapacity - 1].parent_next = B2_NULL_INDEX;
        tree.nodes[tree.nodeCapacity - 1].height = -1;
        tree.freeList = tree.nodeCount;
    }

    const nodeIndex = tree.freeList;
    const node = tree.nodes[nodeIndex];
    tree.freeList = node.parent_next;
    tree.nodes[nodeIndex] = new b2TreeNode();
    ++tree.nodeCount;

    return nodeIndex;
}

function b2FreeNode(tree, nodeId)
{
    tree.nodes[nodeId].parent_next = tree.freeList;
    tree.nodes[nodeId].height = -1;
    tree.freeList = nodeId;
    --tree.nodeCount;
}

function b2FindBestSibling(tree, boxD)
{
    const centerD = b2Math.b2AABB_Center(boxD);
    const areaD = b2Perimeter(boxD);

    const nodes = tree.nodes;
    const rootIndex = tree.root;

    const rootBox = nodes[rootIndex].aabb;

    let areaBase = b2Perimeter(rootBox);

    let directCost = b2Perimeter(b2Math.b2AABB_Union(rootBox, boxD));
    let inheritedCost = 0;

    let bestSibling = rootIndex;
    let bestCost = directCost;

    let index = rootIndex;

    while (nodes[index].height > 0)
    {
        const child1 = nodes[index].child1;
        const child2 = nodes[index].child2;

        const cost = directCost + inheritedCost;

        if (cost < bestCost)
        {
            bestSibling = index;
            bestCost = cost;
        }

        inheritedCost += directCost - areaBase;

        const leaf1 = nodes[child1].height === 0;
        const leaf2 = nodes[child2].height === 0;

        let lowerCost1 = Number.MAX_VALUE;
        const box1 = nodes[child1].aabb;
        const directCost1 = b2Perimeter(b2Math.b2AABB_Union(box1, boxD));
        let area1 = 0;

        if (leaf1)
        {
            const cost1 = directCost1 + inheritedCost;

            if (cost1 < bestCost)
            {
                bestSibling = child1;
                bestCost = cost1;
            }
        }
        else
        {
            area1 = b2Perimeter(box1);
            lowerCost1 = inheritedCost + directCost1 + Math.min(areaD - area1, 0);
        }

        let lowerCost2 = Number.MAX_VALUE;
        const box2 = nodes[child2].aabb;
        const directCost2 = b2Perimeter(b2Math.b2AABB_Union(box2, boxD));
        let area2 = 0;

        if (leaf2)
        {
            const cost2 = directCost2 + inheritedCost;

            if (cost2 < bestCost)
            {
                bestSibling = child2;
                bestCost = cost2;
            }
        }
        else
        {
            area2 = b2Perimeter(box2);
            lowerCost2 = inheritedCost + directCost2 + Math.min(areaD - area2, 0);
        }

        if (leaf1 && leaf2)
        {
            break;
        }

        if (bestCost <= lowerCost1 && bestCost <= lowerCost2)
        {
            break;
        }

        if (lowerCost1 === lowerCost2 && !leaf1)
        {
            const d1 = b2Math.b2Sub(b2Math.b2AABB_Center(box1), centerD);
            const d2 = b2Math.b2Sub(b2Math.b2AABB_Center(box2), centerD);
            lowerCost1 = b2Math.b2LengthSquared(d1);
            lowerCost2 = b2Math.b2LengthSquared(d2);
        }

        if (lowerCost1 < lowerCost2 && !leaf1)
        {
            index = child1;
            areaBase = area1;
            directCost = directCost1;
        }
        else
        {
            index = child2;
            areaBase = area2;
            directCost = directCost2;
        }
    }

    return bestSibling;
}

const b2RotateType = {
    b2_rotateNone: 0,
    b2_rotateBF: 1,
    b2_rotateBG: 2,
    b2_rotateCD: 3,
    b2_rotateCE: 4
};

// Perform a left or right rotation if node A is imbalanced.
// Returns the new root index.
export function b2RotateNodes(tree, iA)
{
    console.assert(iA != B2_NULL_INDEX);

    const nodes = tree.nodes;

    const A = nodes[iA];

    if (A.height < 2)
    {
        return;
    }

    const iB = A.child1;
    const iC = A.child2;
    console.assert(0 <= iB && iB < tree.nodeCapacity);
    console.assert(0 <= iC && iC < tree.nodeCapacity);

    const B = nodes[iB];
    const C = nodes[iC];

    if (B.height === 0)
    {
        // B is a leaf and C is internal
        console.assert(C.height > 0);

        const iF = C.child1;
        const iG = C.child2;
        const F = nodes[iF];
        const G = nodes[iG];
        console.assert(0 <= iF && iF < tree.nodeCapacity);
        console.assert(0 <= iG && iG < tree.nodeCapacity);

        // Base cost
        const costBase = b2Perimeter(C.aabb);

        // Cost of swapping B and F
        const aabbBG = b2Math.b2AABB_Union(B.aabb, G.aabb);
        const costBF = b2Perimeter(aabbBG);

        // Cost of swapping B and G
        const aabbBF = b2Math.b2AABB_Union(B.aabb, F.aabb);
        const costBG = b2Perimeter(aabbBF);

        if (costBase < costBF && costBase < costBG)
        {
            // Rotation does not improve cost
            return;
        }

        if (costBF < costBG)
        {
            // Swap B and F
            A.child1 = iF;
            C.child1 = iB;

            B.parent_next = iC;
            F.parent_next = iA;

            C.aabb = aabbBG;

            C.height = 1 + Math.max(B.height, G.height);
            A.height = 1 + Math.max(C.height, F.height);
            C.categoryBits = B.categoryBits | G.categoryBits;
            A.categoryBits = C.categoryBits | F.categoryBits;
            C.enlarged = B.enlarged || G.enlarged;
            A.enlarged = C.enlarged || F.enlarged;
        }
        else
        {
            // Swap B and G
            A.child1 = iG;
            C.child2 = iB;

            B.parent_next = iC;
            G.parent_next = iA;

            C.aabb = aabbBF;

            C.height = 1 + Math.max(B.height, F.height);
            A.height = 1 + Math.max(C.height, G.height);
            C.categoryBits = B.categoryBits | F.categoryBits;
            A.categoryBits = C.categoryBits | G.categoryBits;
            C.enlarged = B.enlarged || F.enlarged;
            A.enlarged = C.enlarged || G.enlarged;
        }
    }
    else if (C.height === 0)
    {
        // C is a leaf and B is internal
        console.assert(B.height > 0);

        const iD = B.child1;
        const iE = B.child2;
        const D = nodes[iD];
        const E = nodes[iE];
        console.assert(0 <= iD && iD < tree.nodeCapacity);
        console.assert(0 <= iE && iE < tree.nodeCapacity);

        // Base cost
        const costBase = b2Perimeter(B.aabb);

        // Cost of swapping C and D
        const aabbCE = b2Math.b2AABB_Union(C.aabb, E.aabb);
        const costCD = b2Perimeter(aabbCE);

        // Cost of swapping C and E
        const aabbCD = b2Math.b2AABB_Union(C.aabb, D.aabb);
        const costCE = b2Perimeter(aabbCD);

        if (costBase < costCD && costBase < costCE)
        {
            // Rotation does not improve cost
            return;
        }

        if (costCD < costCE)
        {
            // Swap C and D
            A.child2 = iD;
            B.child1 = iC;

            C.parent_next = iB;
            D.parent_next = iA;

            B.aabb = aabbCE;

            B.height = 1 + Math.max(C.height, E.height);
            A.height = 1 + Math.max(B.height, D.height);
            B.categoryBits = C.categoryBits | E.categoryBits;
            A.categoryBits = B.categoryBits | D.categoryBits;
            B.enlarged = C.enlarged || E.enlarged;
            A.enlarged = B.enlarged || D.enlarged;
        }
        else
        {
            // Swap C and E
            A.child2 = iE;
            B.child2 = iC;

            C.parent_next = iB;
            E.parent_next = iA;

            B.aabb = aabbCD;
            B.height = 1 + Math.max(C.height, D.height);
            A.height = 1 + Math.max(B.height, E.height);
            B.categoryBits = C.categoryBits | D.categoryBits;
            A.categoryBits = B.categoryBits | E.categoryBits;
            B.enlarged = C.enlarged || D.enlarged;
            A.enlarged = B.enlarged || E.enlarged;
        }
    }
    else
    {
        const iD = B.child1;
        const iE = B.child2;
        const iF = C.child1;
        const iG = C.child2;

        const D = nodes[iD];
        const E = nodes[iE];
        const F = nodes[iF];
        const G = nodes[iG];

        console.assert(0 <= iD && iD < tree.nodeCapacity);
        console.assert(0 <= iE && iE < tree.nodeCapacity);
        console.assert(0 <= iF && iF < tree.nodeCapacity);
        console.assert(0 <= iG && iG < tree.nodeCapacity);

        // Base cost
        const areaB = b2Perimeter(B.aabb);
        const areaC = b2Perimeter(C.aabb);
        const costBase = areaB + areaC;
        let bestRotation = b2RotateType.b2_rotateNone;
        let bestCost = costBase;

        // Cost of swapping B and F
        const aabbBG = b2Math.b2AABB_Union(B.aabb, G.aabb);
        const costBF = areaB + b2Perimeter(aabbBG);

        if (costBF < bestCost)
        {
            bestRotation = b2RotateType.b2_rotateBF;
            bestCost = costBF;
        }

        // Cost of swapping B and G
        const aabbBF = b2Math.b2AABB_Union(B.aabb, F.aabb);
        const costBG = areaB + b2Perimeter(aabbBF);

        if (costBG < bestCost)
        {
            bestRotation = b2RotateType.b2_rotateBG;
            bestCost = costBG;
        }

        // Cost of swapping C and D
        const aabbCE = b2Math.b2AABB_Union(C.aabb, E.aabb);
        const costCD = areaC + b2Perimeter(aabbCE);

        if (costCD < bestCost)
        {
            bestRotation = b2RotateType.b2_rotateCD;
            bestCost = costCD;
        }

        // Cost of swapping C and E
        const aabbCD = b2Math.b2AABB_Union(C.aabb, D.aabb);
        const costCE = areaC + b2Perimeter(aabbCD);

        if (costCE < bestCost)
        {
            bestRotation = b2RotateType.b2_rotateCE;

            // bestCost = costCE;
        }

        switch (bestRotation)
        {
            case b2RotateType.b2_rotateNone:
                break;

            case b2RotateType.b2_rotateBF:
                A.child1 = iF;
                C.child1 = iB;

                B.parent_next = iC;
                F.parent_next = iA;

                C.aabb = aabbBG;
                C.height = 1 + Math.max(B.height, G.height);
                A.height = 1 + Math.max(C.height, F.height);
                C.categoryBits = B.categoryBits | G.categoryBits;
                A.categoryBits = C.categoryBits | F.categoryBits;
                C.enlarged = B.enlarged || G.enlarged;
                A.enlarged = C.enlarged || F.enlarged;

                break;

            case b2RotateType.b2_rotateBG:
                A.child1 = iG;
                C.child2 = iB;

                B.parent_next = iC;
                G.parent_next = iA;

                C.aabb = aabbBF;
                C.height = 1 + Math.max(B.height, F.height);
                A.height = 1 + Math.max(C.height, G.height);
                C.categoryBits = B.categoryBits | F.categoryBits;
                A.categoryBits = C.categoryBits | G.categoryBits;
                C.enlarged = B.enlarged || F.enlarged;
                A.enlarged = C.enlarged || G.enlarged;

                break;

            case b2RotateType.b2_rotateCD:
                A.child2 = iD;
                B.child1 = iC;

                C.parent_next = iB;
                D.parent_next = iA;

                B.aabb = aabbCE;
                B.height = 1 + Math.max(C.height, E.height);
                A.height = 1 + Math.max(B.height, D.height);
                B.categoryBits = C.categoryBits | E.categoryBits;
                A.categoryBits = B.categoryBits | D.categoryBits;
                B.enlarged = C.enlarged || E.enlarged;
                A.enlarged = B.enlarged || D.enlarged;

                break;

            case b2RotateType.b2_rotateCE:
                A.child2 = iE;
                B.child2 = iC;

                C.parent_next = iB;
                E.parent_next = iA;

                B.aabb = aabbCD;
                B.height = 1 + Math.max(C.height, D.height);
                A.height = 1 + Math.max(B.height, E.height);
                B.categoryBits = C.categoryBits | D.categoryBits;
                A.categoryBits = B.categoryBits | E.categoryBits;
                B.enlarged = C.enlarged || D.enlarged;
                A.enlarged = B.enlarged || E.enlarged;

                break;

            default:
                console.assert(false);

                break;
        }
    }
}

export function b2InsertLeaf(tree, leaf, shouldRotate)
{
    if (tree.root === B2_NULL_INDEX)
    {
        tree.root = leaf;
        tree.nodes[tree.root].parent_next = B2_NULL_INDEX;

        return;
    }

    // Stage 1: find the best sibling for this node
    const leafAABB = tree.nodes[leaf].aabb;
    const sibling = b2FindBestSibling(tree, leafAABB);

    // Stage 2: create a new parent for the leaf and sibling
    const oldParent = tree.nodes[sibling].parent_next;
    const newParent = b2AllocateNode(tree);

    // warning: node pointer can change after allocation
    const nodes = tree.nodes;
    nodes[newParent].parent_next = oldParent;
    nodes[newParent].userData = -1;
    nodes[newParent].aabb = b2Math.b2AABB_Union(leafAABB, nodes[sibling].aabb);
    nodes[newParent].categoryBits = nodes[leaf].categoryBits | nodes[sibling].categoryBits;
    nodes[newParent].height = nodes[sibling].height + 1;

    if (oldParent !== B2_NULL_INDEX)
    {
        // The sibling was not the root.
        if (nodes[oldParent].child1 === sibling)
        {
            nodes[oldParent].child1 = newParent;
        }
        else
        {
            nodes[oldParent].child2 = newParent;
        }
        nodes[newParent].child1 = sibling;
        nodes[newParent].child2 = leaf;
        nodes[sibling].parent_next = newParent;
        nodes[leaf].parent_next = newParent;
    }
    else
    {
        // The sibling was the root.
        nodes[newParent].child1 = sibling;
        nodes[newParent].child2 = leaf;
        nodes[sibling].parent_next = newParent;
        nodes[leaf].parent_next = newParent;
        tree.root = newParent;
    }

    // Stage 3: walk back up the tree fixing heights and AABBs
    let index = nodes[leaf].parent_next;

    while (index !== B2_NULL_INDEX)
    {
        const child1 = nodes[index].child1;
        const child2 = nodes[index].child2;
        console.assert(child1 !== B2_NULL_INDEX);
        console.assert(child2 !== B2_NULL_INDEX);
        nodes[index].aabb = b2Math.b2AABB_Union(nodes[child1].aabb, nodes[child2].aabb);
        nodes[index].categoryBits = nodes[child1].categoryBits | nodes[child2].categoryBits;
        nodes[index].height = 1 + Math.max(nodes[child1].height, nodes[child2].height);
        nodes[index].enlarged = nodes[child1].enlarged || nodes[child2].enlarged;

        if (shouldRotate)
        {
            b2RotateNodes(tree, index);
        }
        index = nodes[index].parent_next;
    }
}

export function b2RemoveLeaf(tree, leaf)
{
    if (leaf === tree.root)
    {
        tree.root = B2_NULL_INDEX;

        return;
    }

    const nodes = tree.nodes;
    const parent = nodes[leaf].parent_next;
    const grandParent = nodes[parent].parent_next;
    let sibling;

    if (nodes[parent].child1 === leaf)
    {
        sibling = nodes[parent].child2;
    }
    else
    {
        sibling = nodes[parent].child1;
    }

    if (grandParent !== B2_NULL_INDEX)
    {
        // Destroy parent and connect sibling to grandParent.
        if (nodes[grandParent].child1 === parent)
        {
            nodes[grandParent].child1 = sibling;
        }
        else
        {
            nodes[grandParent].child2 = sibling;
        }
        nodes[sibling].parent_next = grandParent;
        b2FreeNode(tree, parent);

        // Adjust ancestor bounds.
        let index = grandParent;

        while (index !== B2_NULL_INDEX)
        {
            const node = nodes[index];
            const child1 = nodes[node.child1];
            const child2 = nodes[node.child2];

            node.aabb = b2Math.b2AABB_Union(child1.aabb, child2.aabb);
            node.categoryBits = child1.categoryBits | child2.categoryBits;
            node.height = 1 + Math.max(child1.height, child2.height);
            index = node.parent_next;
        }
    }
    else
    {
        tree.root = sibling;
        tree.nodes[sibling].parent_next = B2_NULL_INDEX;
        b2FreeNode(tree, parent);
    }
}

/**
 * Creates a proxy in a dynamic tree for collision detection. The proxy is added as a leaf node.
 * @function b2DynamicTree_CreateProxy
 * @param {b2DynamicTree} tree - The dynamic tree to add the proxy to
 * @param {b2AABB} aabb - The axis-aligned bounding box for the proxy
 * @param {number} categoryBits - The collision category bits for filtering
 * @param {number} userData - User data associated with this proxy
 * @returns {number} The ID of the created proxy node
 * @throws {Error} Throws assertion error if AABB bounds are outside valid range
 */
export function b2DynamicTree_CreateProxy(tree, aabb, categoryBits, userData)
{
    console.assert( -B2_HUGE< aabb.lowerBoundX && aabb.lowerBoundX < B2_HUGE);
    console.assert( -B2_HUGE< aabb.lowerBoundY && aabb.lowerBoundY < B2_HUGE);
    console.assert( -B2_HUGE< aabb.upperBoundX && aabb.upperBoundX < B2_HUGE);
    console.assert( -B2_HUGE< aabb.upperBoundY && aabb.upperBoundY < B2_HUGE);

    const proxyId = b2AllocateNode(tree);
    const node = tree.nodes[proxyId];

    node.aabb = aabb;
    node.userData = userData;
    node.categoryBits = categoryBits;
    node.height = 0;

    const shouldRotate = true;
    b2InsertLeaf(tree, proxyId, shouldRotate);

    tree.proxyCount += 1;

    return proxyId;
}

/**
 * @function b2DynamicTree_DestroyProxy
 * @summary Removes and frees a proxy from the dynamic tree.
 * @param {b2DynamicTree} tree - The dynamic tree containing the proxy
 * @param {number} proxyId - The ID of the proxy to destroy (must be >= 0 and < nodeCapacity)
 * @returns {void}
 * @throws {Error} Throws an assertion error if:
 * - proxyId is out of bounds
 * - the node is not a leaf
 * - the tree has no proxies
 * @description
 * Removes a leaf node from the tree, frees the node's memory, and decrements
 * the proxy count. The proxy must be a valid leaf node in the tree.
 */
export function b2DynamicTree_DestroyProxy(tree, proxyId)
{
    console.assert( 0 <= proxyId && proxyId < tree.nodeCapacity );
    console.assert( b2IsLeaf( tree.nodes[proxyId] ) );

    b2RemoveLeaf(tree, proxyId);
    b2FreeNode(tree, proxyId);

    console.assert( tree.proxyCount > 0 );
    tree.proxyCount -= 1;
}

/**
 * @summary Gets the total number of proxies in a dynamic tree.
 * @function b2DynamicTree_GetProxyCount
 * @param {b2DynamicTree} tree - The dynamic tree to query.
 * @returns {number} The total count of proxies in the tree.
 * @description
 * Returns the number of proxies currently stored in the dynamic tree by accessing
 * the proxyCount property.
 */
export function b2DynamicTree_GetProxyCount(tree)
{
    return tree.proxyCount;
}

/**
 * @function b2DynamicTree_MoveProxy
 * @description
 * Updates the position of a proxy in the dynamic tree by removing and reinserting it
 * with a new AABB.
 * @param {b2DynamicTree} tree - The dynamic tree containing the proxy
 * @param {number} proxyId - The ID of the proxy to move (must be within tree.nodeCapacity)
 * @param {b2AABB} aabb - The new axis-aligned bounding box for the proxy
 * @returns {void}
 * @throws {Error} Throws assertion errors if:
 * - The AABB is invalid
 * - The AABB dimensions exceed B2_HUGE
 * - The proxyId is out of bounds
 * - The node at proxyId is not a leaf node
 */
export function b2DynamicTree_MoveProxy(tree, proxyId, aabb)
{
    console.assert( b2Math.b2AABB_IsValid( aabb ) );
    console.assert( aabb.upperBoundX - aabb.lowerBoundX < B2_HUGE);
    console.assert( aabb.upperBoundY - aabb.lowerBoundY < B2_HUGE);
    console.assert( 0 <= proxyId && proxyId < tree.nodeCapacity );
    console.assert( b2IsLeaf( tree.nodes[proxyId] ) );

    b2RemoveLeaf(tree, proxyId);

    tree.nodes[proxyId].aabb = aabb;

    const shouldRotate = false;
    b2InsertLeaf(tree, proxyId, shouldRotate);
}

/**
 * @function b2DynamicTree_EnlargeProxy
 * @description
 * Updates a proxy's AABB in the dynamic tree and rebalances the tree structure by
 * enlarging parent nodes' AABBs as needed.
 * @param {b2DynamicTree} tree - The dynamic tree containing the proxy
 * @param {number} proxyId - The ID of the proxy to enlarge
 * @param {b2AABB} aabb - The new axis-aligned bounding box for the proxy
 * @returns {void}
 * @throws {Error} Throws assertion errors if:
 * - The AABB is invalid
 * - The AABB dimensions exceed B2_HUGE
 * - The proxyId is out of bounds
 * - The node is not a leaf
 * - The new AABB is contained within the old one
 */
export function b2DynamicTree_EnlargeProxy(tree, proxyId, aabb)
{
    const nodes = tree.nodes;

    console.assert( b2Math.b2AABB_IsValid( aabb ) );
    console.assert( aabb.upperBoundX - aabb.lowerBoundX < B2_HUGE);
    console.assert( aabb.upperBoundY - aabb.lowerBoundY < B2_HUGE);
    console.assert( 0 <= proxyId && proxyId < tree.nodeCapacity );
    console.assert( b2IsLeaf( tree.nodes[proxyId] ) );

    // Caller must ensure this
    console.assert( b2Math.b2AABB_Contains( nodes[proxyId].aabb, aabb ) == false );

    nodes[proxyId].aabb = aabb;

    // enlarge parents until they don't need to be bigger to encompass aabb
    let parentIndex = nodes[proxyId].parent_next;

    while (parentIndex !== B2_NULL_INDEX)
    {
        const changed = b2EnlargeAABB(nodes[parentIndex].aabb, aabb);
        nodes[parentIndex].enlarged = true;
        parentIndex = nodes[parentIndex].parent_next;

        if (!changed)
        {
            break;
        }
    }

    // mark all remaining parents 'enlarged' up to root (or previously marked)
    while (parentIndex !== B2_NULL_INDEX)
    {
        if (nodes[parentIndex].enlarged === true)
        {
            // early out because this ancestor was previously ascended and marked as enlarged
            break;
        }

        nodes[parentIndex].enlarged = true;
        parentIndex = nodes[parentIndex].parent_next;
    }
}

/**
 * @summary Gets the height of a dynamic tree
 * @function b2DynamicTree_GetHeight
 * @param {b2DynamicTree} tree - The dynamic tree to measure
 * @returns {number} The height of the tree. Returns 0 if the tree is empty (root is null)
 * @description
 * Returns the height of the specified dynamic tree by accessing the height property
 * of the root node. The height represents the maximum number of levels from the root
 * to any leaf node.
 */
export function b2DynamicTree_GetHeight(tree)
{
    if (tree.root === B2_NULL_INDEX)
    {
        return 0;
    }

    return tree.nodes[tree.root].height;
}

/**
 * @function b2DynamicTree_GetAreaRatio
 * @summary Calculates the ratio of total internal node perimeter to root node perimeter in a dynamic tree
 * @param {b2DynamicTree} tree - The dynamic tree structure to analyze
 * @returns {number} The ratio of total internal node perimeter to root perimeter. Returns 0 if the tree is empty.
 * @description
 * Computes the sum of all internal node perimeters (excluding leaves and root)
 * divided by the root node perimeter. This ratio provides a measure of the tree's
 * spatial organization.
 */
export function b2DynamicTree_GetAreaRatio(tree)
{
    if (tree.root === B2_NULL_INDEX)
    {
        return 0.0;
    }

    const root = tree.nodes[tree.root];
    const rootArea = b2Perimeter(root.aabb);

    let totalArea = 0.0;

    for (let i = 0; i < tree.nodeCapacity; ++i)
    {
        const node = tree.nodes[i];

        if (node.height < 0 || b2IsLeaf(node) || i === tree.root)
        {
            // Free node in pool
            continue;
        }

        totalArea += b2Perimeter(node.aabb);
    }

    return totalArea / rootArea;
}

// // Compute the height of a sub-tree.
// function b2ComputeHeight(tree, nodeId) {
//     console.assert( 0 <= nodeId && nodeId < tree.nodeCapacity );
//     const node = tree.nodes[nodeId];

//     if (b2IsLeaf(node)) {
//         return 0;
//     }

//     const height1 = b2ComputeHeight(tree, node.child1);
//     const height2 = b2ComputeHeight(tree, node.child2);
//     return 1 + Math.max(height1, height2);
// }

// export function b2DynamicTree_ComputeHeight(tree) {
//     const height = b2ComputeHeight(tree, tree.root);
//     return height;
// }

/**
 * @summary Validates the internal state of a dynamic tree
 * @function b2DynamicTree_Validate
 * @param {b2DynamicTree} tree - The dynamic tree to validate
 * @returns {void}
 * @description
 * Performs validation checks on a b2DynamicTree data structure to ensure
 * its internal state is consistent. This is typically used for debugging
 * and testing purposes.
 */
export function b2DynamicTree_Validate(tree)
{
    // Implementation skipped due to conditional compilation
}

/**
 * @function b2DynamicTree_GetMaxBalance
 * @summary Calculates the maximum height difference between sibling nodes in a dynamic tree
 * @param {b2DynamicTree} tree - The dynamic tree to analyze
 * @returns {number} The maximum balance value (height difference) found between any pair of sibling nodes
 * @description
 * Iterates through all non-leaf nodes in the tree and calculates the absolute height difference
 * between their child nodes. Returns the largest height difference found.
 */
export function b2DynamicTree_GetMaxBalance(tree)
{
    let maxBalance = 0;

    for (let i = 0; i < tree.nodeCapacity; ++i)
    {
        const node = tree.nodes[i];

        if (node.height <= 1)
        {
            continue;
        }

        console.assert(b2IsLeaf(node) == false);

        const child1 = node.child1;
        const child2 = node.child2;
        const balance = Math.abs(tree.nodes[child2].height - tree.nodes[child1].height);
        maxBalance = Math.max(maxBalance, balance);
    }

    return maxBalance;
}

/**
 * @function b2DynamicTree_RebuildBottomUp
 * @description
 * Rebuilds a dynamic tree from the bottom up by iteratively combining nodes with the lowest perimeter cost.
 * The function first identifies all leaf nodes, then pairs them based on minimum combined AABB perimeter,
 * creating parent nodes until a single root node remains.
 * @param {b2DynamicTree} tree - The dynamic tree to rebuild
 * @returns {void}
 * @note The function validates the tree structure after rebuilding
 */
export function b2DynamicTree_RebuildBottomUp(tree)
{
    const nodes = new Array(tree.nodeCount);
    let count = 0;

    // Build array of leaves. Free the rest.
    for (let i = 0; i < tree.nodeCapacity; ++i)
    {
        if (tree.nodes[i].height < 0)
        {
            // free node in pool
            continue;
        }

        if (b2IsLeaf(tree.nodes[i]))
        {
            tree.nodes[i].parent_next = B2_NULL_INDEX;
            nodes[count] = i;
            ++count;
        }
        else
        {
            b2FreeNode(tree, i);
        }
    }

    while (count > 1)
    {
        let minCost = Number.MAX_VALUE;
        let iMin = -1,
            jMin = -1;

        for (let i = 0; i < count; ++i)
        {
            const aabbi = tree.nodes[nodes[i]].aabb;

            for (let j = i + 1; j < count; ++j)
            {
                const aabbj = tree.nodes[nodes[j]].aabb;
                const b = b2Math.b2AABB_Union(aabbi, aabbj);
                const cost = b2Perimeter(b);

                if (cost < minCost)
                {
                    iMin = i;
                    jMin = j;
                    minCost = cost;
                }
            }
        }

        const index_i = nodes[iMin];
        const index_j = nodes[jMin];
        const child1 = tree.nodes[index_i];
        const child2 = tree.nodes[index_j];

        const parentIndex = b2AllocateNode(tree);
        const parent = tree.nodes[parentIndex];
        parent.child1 = index_i;
        parent.child2 = index_j;
        parent.aabb = b2Math.b2AABB_Union(child1.aabb, child2.aabb);
        parent.categoryBits = child1.categoryBits | child2.categoryBits;
        parent.height = 1 + Math.max(child1.height, child2.height);
        parent.parent_next = B2_NULL_INDEX;

        child1.parent_next = parentIndex;
        child2.parent_next = parentIndex;

        nodes[jMin] = nodes[count - 1];
        nodes[iMin] = parentIndex;
        --count;
    }

    tree.root = nodes[0];

    b2DynamicTree_Validate(tree);
}

/**
 * @function b2DynamicTree_ShiftOrigin
 * @summary Shifts the coordinate system of all nodes in a dynamic tree by subtracting a new origin.
 * @param {b2DynamicTree} tree - The dynamic tree whose nodes will be shifted
 * @param {b2Vec2} newOrigin - The vector to subtract from all node boundaries
 * @returns {void}
 * @description
 * Updates the axis-aligned bounding boxes (AABBs) of all nodes in the tree by
 * subtracting the newOrigin vector from both their lower and upper bounds.
 */
export function b2DynamicTree_ShiftOrigin(tree, newOrigin)
{
    // shift all AABBs
    for (let i = 0; i < tree.nodeCapacity; ++i)
    {
        const n = tree.nodes[i];
        n.aabb.lowerBoundX -= newOrigin.x;
        n.aabb.lowerBoundY -= newOrigin.y;
        n.aabb.upperBoundX -= newOrigin.x;
        n.aabb.upperBoundY -= newOrigin.y;
    }
}

/**
 * @function b2DynamicTree_GetByteCount
 * @summary Calculates the approximate memory usage of a dynamic tree in bytes.
 * @param {b2DynamicTree} tree - The dynamic tree instance to measure.
 * @returns {number} The estimated memory usage in bytes.
 * @description
 * Calculates the memory footprint by summing:
 * - Base object properties
 * - Node array storage
 * - Rebuild capacity storage
 */
export function b2DynamicTree_GetByteCount(tree)
{
    const size = Object.keys(tree).length * 8 + // Rough estimate for object properties
               tree.nodeCapacity * Object.keys(tree.nodes[0]).length * 8 + // Estimate for nodes
               tree.rebuildCapacity * (4 + 16 + 8 + 4); // Estimate for rebuild data

    return size;
}

/**
 * @function b2DynamicTree_Query
 * @description
 * Queries a dynamic tree to find all nodes that overlap with the given AABB and match the category mask bits.
 * Uses a stack-based traversal to efficiently search the tree structure.
 * @param {b2DynamicTree} tree - The dynamic tree to query
 * @param {b2AABB} aabb - The axis-aligned bounding box to test for overlaps
 * @param {number} maskBits - Category bits used to filter nodes
 * @param {function} callback - Function called for each overlapping leaf node.
 * Return false to terminate early, true to continue.
 * @param {*} context - User context data passed to the callback function
 * @returns {void}
 */
export function b2DynamicTree_Query(tree, aabb, maskBits, callback, context)
{
    if (tree.root == B2_NULL_INDEX)
    {
        return;
    }
        
    const stack = [];
    stack.push(tree.root);

    while (stack.length > 0)
    {
        const nodeId = stack.pop();

        if (nodeId == B2_NULL_INDEX)
        {
            continue;
        }

        const node = tree.nodes[nodeId];

        if ((node.categoryBits & maskBits) !== 0 && b2AABB_Overlaps(node.aabb, aabb))
        {
            // PJB: this is called a LOT, remove function call overhead
            if (node.height == 0)   // b2IsLeaf(node))
            {
                // callback to user code with proxy id
                const proceed = callback(nodeId, node.userData, context);

                if (proceed === false)
                {
                    return;
                }
            }
            else
            {
                stack.push(node.child1);
                stack.push(node.child2);
            }
        }
    }
}

const stack = Array(64);        // 14 is the deepest I have seen

export function b2DynamicTree_QueryAll(tree, aabb, context)
{
    if (tree.root == B2_NULL_INDEX)
    {
        return;
    }

    const lx = aabb.lowerBoundX,
        ux = aabb.upperBoundX;
    const ly = aabb.lowerBoundY,
        uy = aabb.upperBoundY;
    const nodes = tree.nodes;

    let stackCount = 0;
    stack[stackCount++] = tree.root;

    let nodeId, node, a;

    while (stackCount > 0)
    {
        nodeId = stack[--stackCount];
        node = nodes[nodeId];

        if (node.height == 0)   // b2IsLeaf(node)
        {
            a = node.aabb;      // weird JS optimisation, we gain 100ms (from 8600ms) if this is done inside each branch compared with doing it before

            if (a.lowerBoundX < ux &&
                a.upperBoundX > lx &&
                a.lowerBoundY < uy &&
                a.upperBoundY > ly)
            {
                b2PairQueryCallback(nodeId, node.userData, context);
            }
        }
        else
        {
            a = node.aabb;

            if (a.lowerBoundX < ux &&
                a.upperBoundX > lx &&
                a.lowerBoundY < uy &&
                a.upperBoundY > ly)
            {
                // assumes both children will exist, following the pattern in (e.g.) b2FindBestSibling
                stack[stackCount++] = node.child1;
                stack[stackCount++] = node.child2;
            }
        }
    }
}

/**
 * @summary Performs a ray cast query on a dynamic tree
 * @function b2DynamicTree_RayCast
 * @param {b2DynamicTree} tree - The dynamic tree to query
 * @param {b2RayCastInput} input - Input parameters for the ray cast including:
 * - origin: b2Vec2 starting point
 * - translation: b2Vec2 ray direction and length
 * - maxFraction: number maximum ray length multiplier
 * @param {number} maskBits - Bit mask to filter nodes by category
 * @param {Function} callback - Function called for each leaf node intersection
 * - Parameters: (input: b2RayCastInput, nodeId: number, userData: any, context: any)
 * - Returns: number between 0 and 1 to continue search, 0 to terminate
 * @param {*} context - User context passed to callback
 * @description
 * Traverses the dynamic tree and finds all leaf nodes that intersect with the input ray.
 * For each intersection, calls the callback function which can control continuation of the search.
 * Uses an AABB overlap test and separating axis test to efficiently cull branches.
 */
export function b2DynamicTree_RayCast(tree, input, maskBits, callback, context)
{
    const p1 = input.origin;
    const d = input.translation;

    const r = b2Math.b2Normalize(d);

    // v is perpendicular to the segment.
    const v = b2Math.b2CrossSV(1.0, r);
    const abs_v = b2Math.b2Abs(v);

    // Separating axis for segment (Gino, p80).
    // |dot(v, p1 - c)| > dot(|v|, h)

    let maxFraction = input.maxFraction;

    let p2 = b2Math.b2MulAdd(p1, maxFraction, d);

    // Build a bounding box for the segment.
    // let segmentAABB = new b2Math.b2AABB(b2Math.b2Min(p1, p2), b2Math.b2Max(p1, p2));
    const segmentAABB = new b2Math.b2AABB(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));

    const stack = [];
    stack.push(tree.root);

    const subInput = input;

    while (stack.length > 0)
    {
        const nodeId = stack.pop();

        if (nodeId == B2_NULL_INDEX)
        {
            continue;
        }

        const node = tree.nodes[nodeId];

        if (b2AABB_Overlaps(node.aabb, segmentAABB) == false || (node.categoryBits & maskBits) == 0)
        {
            continue;
        }

        // Separating axis for segment (Gino, p80).
        // |dot(v, p1 - c)| > dot(|v|, h)
        // radius extension is added to the node in this case
        const c = b2Math.b2AABB_Center(node.aabb);
        const h = b2Math.b2AABB_Extents(node.aabb);
        const term1 = Math.abs(b2Math.b2Dot(v, b2Math.b2Sub(p1, c)));
        const term2 = b2Math.b2Dot(abs_v, h);

        if (term2 < term1)
        {
            continue;
        }

        if (node.height == 0)   // b2IsLeaf(node))
        {
            subInput.maxFraction = maxFraction;

            const value = callback(subInput, nodeId, node.userData, context);

            if (value == 0.0)
            {
                // The client has terminated the ray cast.
                return;
            }

            if (0.0 < value && value <= maxFraction)
            {
                // Update segment bounding box.
                maxFraction = value;
                p2 = b2Math.b2MulAdd(p1, maxFraction, d);
                segmentAABB.lowerBoundX = Math.min(p1.x, p2.x);
                segmentAABB.lowerBoundY = Math.min(p1.y, p2.y);
                segmentAABB.upperBoundX = Math.max(p1.x, p2.x);
                segmentAABB.upperBoundY = Math.max(p1.y, p2.y);
            }
        }
        else
        {
            // TODO_ERIN just put one node on the stack, continue on a child node
            // TODO_ERIN test ordering children by nearest to ray origin
            stack.push(node.child1);
            stack.push(node.child2);
        }
    }
}

/**
 * @function b2DynamicTree_ShapeCast
 * @description
 * Performs a shape cast query against nodes in a dynamic tree, testing for overlaps
 * between a moving shape and static shapes in the tree.
 * @param {b2DynamicTree} tree - The dynamic tree to query against
 * @param {b2ShapeCastInput} input - Contains the shape definition, translation vector,
 * radius, and maximum fraction for the cast
 * @param {number} maskBits - Bit mask to filter tree nodes by category
 * @param {Function} callback - Function called when potential overlaps are found.
 * Returns a fraction value to continue or terminate the cast
 * @param {*} context - User data passed to the callback function
 * @returns {void}
 * The callback function should have the signature:
 * function(input: b2ShapeCastInput, nodeId: number, userData: any, context: any): number
 * It should return 0 to terminate the cast, or a fraction between 0 and 1 to update the cast distance
 */
export function b2DynamicTree_ShapeCast(tree, input, maskBits, callback, context)
{
    if (input.count == 0)
    {
        return;
    }

    const originAABB = new b2Math.b2AABB(input.points[0], input.points[0]);

    for (let i = 1; i < input.count; ++i)
    {
        originAABB.lowerBoundX = Math.min(originAABB.lowerBoundX, input.points[i].x);
        originAABB.lowerBoundY = Math.min(originAABB.lowerBoundY, input.points[i].y);
        originAABB.upperBoundX = Math.max(originAABB.upperBoundX, input.points[i].x);
        originAABB.upperBoundY = Math.max(originAABB.upperBoundY, input.points[i].y);
    }

    // let radius = new b2Math.b2Vec2(input.radius, input.radius);

    // originAABB.lowerBound = b2Math.b2Sub(originAABB.lowerBound, radius);
    originAABB.lowerBoundX = originAABB.lowerBoundX - input.radius;
    originAABB.lowerBoundY = originAABB.lowerBoundY - input.radius;
    originAABB.upperBoundX = originAABB.upperBoundX + input.radius;
    originAABB.upperBoundY = originAABB.upperBoundY + input.radius;

    const p1 = b2Math.b2AABB_Center(originAABB);
    const extension = b2Math.b2AABB_Extents(originAABB);

    // v is perpendicular to the segment.
    const r = input.translation;
    const v = b2Math.b2CrossSV(1.0, r);
    const abs_v = b2Math.b2Abs(v);

    // Separating axis for segment (Gino, p80).
    // |dot(v, p1 - c)| > dot(|v|, h)

    let maxFraction = input.maxFraction;

    // Build total box for the shape cast
    let t = b2Math.b2MulSV(maxFraction, input.translation);

    // let totalAABB = new b2Math.b2AABB(b2Math.b2Min(originAABB.lowerBound, b2Math.b2Add(originAABB.lowerBound, t)),b2Math.b2Max(originAABB.upperBound, b2Math.b2Add(originAABB.upperBound, t)));
    const totalAABB = new b2Math.b2AABB(
        Math.min(originAABB.lowerBoundX, originAABB.lowerBoundX + t.x),
        Math.min(originAABB.lowerBoundY, originAABB.lowerBoundY + t.y),
        Math.max(originAABB.upperBoundX, originAABB.upperBoundX + t.x),
        Math.max(originAABB.upperBoundY, originAABB.upperBoundY + t.y)
    );

    const subInput = input;

    const stack = []; // new Array(B2_TREE_STACK_SIZE);
    stack.push(tree.root);

    while (stack.length > 0)
    {
        const nodeId = stack.pop();

        if (nodeId == B2_NULL_INDEX)
        {
            continue;
        }

        const node = tree.nodes[nodeId];

        if (b2AABB_Overlaps(node.aabb, totalAABB) == false || (node.categoryBits & maskBits) == 0)
        {
            continue;
        }

        // Separating axis for segment (Gino, p80).
        // |dot(v, p1 - c)| > dot(|v|, h)
        // radius extension is added to the node in this case
        const c = b2Math.b2AABB_Center(node.aabb);
        const h = b2Math.b2Add(b2Math.b2AABB_Extents(node.aabb), extension);
        const term1 = Math.abs(b2Math.b2Dot(v, b2Math.b2Sub(p1, c)));
        const term2 = b2Math.b2Dot(abs_v, h);

        if (term2 < term1)
        {
            continue;
        }

        if (node.height == 0)   // b2IsLeaf(node))
        {
            subInput.maxFraction = maxFraction;

            const value = callback(subInput, nodeId, node.userData, context);

            if (value == 0.0)
            {
                // The client has terminated the ray cast.
                return;
            }

            if (0.0 < value && value < maxFraction)
            {
                // Update segment bounding box.
                maxFraction = value;
                t = b2Math.b2MulSV(maxFraction, input.translation);

                // totalAABB.lowerBound = b2Math.b2Min(originAABB.lowerBound, b2Math.b2Add(originAABB.lowerBound, t));
                // totalAABB.upperBound = b2Math.b2Max(originAABB.upperBound, b2Math.b2Add(originAABB.upperBound, t));
                totalAABB.lowerBoundX = Math.min(originAABB.lowerBoundX, originAABB.lowerBoundX + t.x);
                totalAABB.lowerBoundY = Math.min(originAABB.lowerBoundY, originAABB.lowerBoundY + t.y);
                totalAABB.upperBoundX = Math.max(originAABB.upperBoundX, originAABB.upperBoundX + t.x);
                totalAABB.upperBoundY = Math.max(originAABB.upperBoundY, originAABB.upperBoundY + t.y);
            }
        }
        else
        {
            // TODO_ERIN just put one node on the stack, continue on a child node
            // TODO_ERIN test ordering children by nearest to ray origin
            stack.push(node.child1);
            stack.push(node.child2);
        }
    }
}

// Median split heuristic
function b2PartitionMid(indices, centers, startIndex, endIndex, count)
{
    // Handle trivial case
    if (count <= 2)
    {
        return startIndex + (count >> 1);
    }

    // Create bounding box enclosing all centers
    let lowerBoundX = centers[startIndex].x;
    let upperBoundX = centers[startIndex].x;
    let lowerBoundY = centers[startIndex].y;
    let upperBoundY = centers[startIndex].y;

    for (let i = startIndex + 1; i < endIndex; ++i)
    {
        const x = centers[i].x;
        const y = centers[i].y;

        if (x < lowerBoundX) { lowerBoundX = x; }
        else if (x > upperBoundX) { upperBoundX = x; }

        if (y < lowerBoundY) { lowerBoundY = y; }
        else if (y > upperBoundY) { upperBoundY = y; }
    }

    // Find the longer box dimension
    const dX = upperBoundX - lowerBoundX;
    const dY = upperBoundY - lowerBoundY;
    const dirX = dX > dY;

    // Partition using the Hoare partition scheme
    let left = startIndex;
    let right = endIndex - 1;

    if (dirX)
    {
        const pivot = 0.5 * (lowerBoundX + upperBoundX);

        while (true)
        {
            while (left <= right && centers[left].x < pivot) { left++; }

            while (left <= right && centers[right].x > pivot) { right--; }

            if (left >= right) { break; }

            // Swap indices and centers
            let temp = indices[left];
            indices[left] = indices[right];
            indices[right] = temp;

            temp = centers[left];
            centers[left] = centers[right];
            centers[right] = temp;

            left++;
            right--;
        }
    }
    else
    {
        const pivot = 0.5 * (lowerBoundY + upperBoundY);

        while (true)
        {
            while (left <= right && centers[left].y < pivot)
            {
                left++;
            }

            while (left <= right && centers[right].y > pivot)
            {
                right--;
            }

            if (left >= right)
            {
                break;
            }

            // Swap indices and centers
            let temp = indices[left];
            indices[left] = indices[right];
            indices[right] = temp;

            temp = centers[left];
            centers[left] = centers[right];
            centers[right] = temp;

            left++;
            right--;
        }
    }

    return left > startIndex && left < endIndex ? left : (startIndex + (count >> 1));
}

function b2BuildTree(tree, leafCount)
{
    const { nodes, leafIndices, leafCenters } = tree;

    if (leafCount === 1)
    {
        nodes[leafIndices[0]].parent_next = B2_NULL_INDEX;

        return leafIndices[0];
    }

    const stack = new Array(B2_TREE_STACK_SIZE);
    let top = 0;

    stack[0] = {
        nodeIndex: b2AllocateNode(tree),
        childCount: -1,
        startIndex: 0,
        endIndex: leafCount,
        splitIndex: b2PartitionMid(leafIndices, leafCenters, 0, leafCount, leafCount)
    };

    while (true)
    {
        const item = stack[top];
        item.childCount++;

        if (item.childCount === 2)
        {
            if (top === 0) { break; }

            const parentItem = stack[top - 1];
            const parentNode = nodes[parentItem.nodeIndex];
            const childIndex = item.nodeIndex;

            if (parentItem.childCount === 0)
            {
                parentNode.child1 = childIndex;
            }
            else
            {
                parentNode.child2 = childIndex;
            }

            const node = nodes[childIndex];
            node.parent_next = parentItem.nodeIndex;

            const child1 = nodes[node.child1];
            const child2 = nodes[node.child2];

            node.aabb = b2Math.b2AABB_Union(child1.aabb, child2.aabb);
            node.height = 1 + Math.max(child1.height, child2.height);
            node.categoryBits = child1.categoryBits | child2.categoryBits;

            top--;
        }
        else
        {
            const [ startIndex, endIndex ] = item.childCount === 0
                ? [ item.startIndex, item.splitIndex ]
                : [ item.splitIndex, item.endIndex ];

            const count = endIndex - startIndex;

            if (count === 1)
            {
                const childIndex = leafIndices[startIndex];
                const node = nodes[item.nodeIndex];
                
                node[item.childCount === 0 ? 'child1' : 'child2'] = childIndex;

                nodes[childIndex].parent_next = item.nodeIndex;
            }
            else
            {
                stack[++top] = {
                    nodeIndex: b2AllocateNode(tree),
                    childCount: -1,
                    startIndex,
                    endIndex,
                    splitIndex: b2PartitionMid(
                        leafIndices,
                        leafCenters,
                        startIndex, endIndex,
                        count
                    )
                };
            }
        }
    }

    const rootNode = nodes[stack[0].nodeIndex];
    const child1 = nodes[rootNode.child1];
    const child2 = nodes[rootNode.child2];

    rootNode.aabb = b2Math.b2AABB_Union(child1.aabb, child2.aabb);
    rootNode.height = 1 + Math.max(child1.height, child2.height);
    rootNode.categoryBits = child1.categoryBits | child2.categoryBits;

    return stack[0].nodeIndex;
}

/**
 * @function b2DynamicTree_Rebuild
 * @description
 * Rebuilds a dynamic tree by collecting all leaf nodes and reconstructing the tree structure.
 * The function deallocates internal nodes during traversal and builds a new balanced tree
 * from the collected leaf nodes.
 * @param {b2DynamicTree} tree - The dynamic tree to rebuild
 * @returns {number} The number of leaf nodes in the rebuilt tree
 * @note If the proxy count exceeds the rebuild capacity, the internal arrays are resized
 * to accommodate the new size plus 50% additional capacity. It is not safe to access the tree during this operation because it may grow.
 */
export function b2DynamicTree_Rebuild(tree)
{
    const proxyCount = tree.proxyCount;

    if (proxyCount === 0)
    {
        return 0;
    }

    // Ensure capacity for rebuild space
    if (proxyCount > tree.rebuildCapacity)
    {
        const newCapacity = proxyCount + Math.floor(proxyCount / 2);

        tree.leafIndices = Array(newCapacity);
        tree.leafCenters = Array(newCapacity);
        tree.rebuildCapacity = newCapacity;
    }

    let leafCount = 0;
    const stack = [];   // new Array(B2_TREE_STACK_SIZE);

    let nodeIndex = tree.root;
    const nodes = tree.nodes;
    let node = nodes[nodeIndex];

    // These are the nodes that get sorted to rebuild the tree.
    // I'm using indices because the node pool may grow during the build.
    const leafIndices = tree.leafIndices;
    const leafCenters = tree.leafCenters;

    // Gather all proxy nodes that have grown and all internal nodes that haven't grown. Both are
    // considered leaves in the tree rebuild.
    // Free all internal nodes that have grown.
    while (true)
    {
        if (node.height === 0 || node.enlarged === false)
        {
            leafIndices[leafCount] = nodeIndex;
            leafCenters[leafCount] = b2Math.b2AABB_Center(node.aabb);
            leafCount++;

            // Detach
            node.parent_next = B2_NULL_INDEX;
        }
        else
        {
            const doomedNodeIndex = nodeIndex;

            // Handle children, push child2 for later, process child1 immediately
            stack.push(node.child2);

            nodeIndex = node.child1;
            node = nodes[nodeIndex];

            // Remove doomed node
            b2FreeNode(tree, doomedNodeIndex);

            continue;
        }

        // check here instead of in while, node is carried around to the next iteration
        if (stack.length === 0)
        {
            break;
        }

        nodeIndex = stack.pop();
        node = nodes[nodeIndex];
    }

    console.assert(leafCount <= proxyCount);

    tree.root = b2BuildTree(tree, leafCount);

    return leafCount;
}
