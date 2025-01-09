/**
 * Get proxy user data
 * @param {Object} tree - The dynamic tree object
 * @param {number} proxyId - The proxy ID
 * @returns {number} The proxy user data or 0 if the id is invalid
 */
export function b2DynamicTree_GetUserData(tree: any, proxyId: number): number;
export function b2DynamicTree_GetAABB(tree: any, proxyId: any): any;
/**
 * @class b2DynamicTree
 * @summary The dynamic tree structure used internally for performance reasons
 * @property {b2TreeNode[]} nodes - The tree nodes
 * @property {number} root - The root index
 * @property {number} nodeCount - The number of nodes
 * @property {number} nodeCapacity - The allocated node space
 * @property {number} freeList - Node free list
 * @property {number} proxyCount - Number of proxies created
 * @property {number[]} leafIndices - Leaf indices for rebuild
 * @property {b2AABB[]} leafBoxes - Leaf bounding boxes for rebuild
 * @property {b2Vec2[]} leafCenters - Leaf bounding box centers for rebuild
 * @property {number[]} binIndices - Bins for sorting during rebuild
 * @property {number} rebuildCapacity - Allocated space for rebuilding
 */
export class b2DynamicTree {
    nodes: any[];
    root: number;
    nodeCount: number;
    nodeCapacity: number;
    freeList: number;
    proxyCount: number;
    leafIndices: any[];
    leafCenters: any[];
    rebuildCapacity: number;
}
export { b2DynamicTree_Create, b2DynamicTree_Destroy, b2DynamicTree_CreateProxy, b2DynamicTree_DestroyProxy, b2DynamicTree_GetProxyCount, b2DynamicTree_MoveProxy, b2DynamicTree_EnlargeProxy, b2DynamicTree_GetHeight, b2DynamicTree_GetAreaRatio, b2DynamicTree_Validate, b2DynamicTree_Query, b2DynamicTree_QueryAll, b2DynamicTree_RayCast, b2DynamicTree_ShapeCast, b2DynamicTree_Rebuild, b2RotateNodes, b2InsertLeaf, b2RemoveLeaf, b2DynamicTree_GetMaxBalance, b2DynamicTree_RebuildBottomUp, b2DynamicTree_ShiftOrigin, b2DynamicTree_GetByteCount } from "../dynamic_tree_c.js";
