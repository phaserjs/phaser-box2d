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
export function b2DynamicTree_Create(): b2DynamicTree;
/**
 * @summary Destroys a dynamic tree by clearing its internal data structures.
 * @function b2DynamicTree_Destroy
 * @param {b2DynamicTree} tree - The dynamic tree to destroy.
 * @returns {void}
 * @description
 * Clears the nodes, leaf indices, and leaf centers arrays of the dynamic tree,
 * effectively destroying the tree's data structure.
 */
export function b2DynamicTree_Destroy(tree: b2DynamicTree): void;
export function b2RotateNodes(tree: any, iA: any): void;
export function b2InsertLeaf(tree: any, leaf: any, shouldRotate: any): void;
export function b2RemoveLeaf(tree: any, leaf: any): void;
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
export function b2DynamicTree_CreateProxy(tree: b2DynamicTree, aabb: b2Math.b2AABB, categoryBits: number, userData: number): number;
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
export function b2DynamicTree_DestroyProxy(tree: b2DynamicTree, proxyId: number): void;
/**
 * @summary Gets the total number of proxies in a dynamic tree.
 * @function b2DynamicTree_GetProxyCount
 * @param {b2DynamicTree} tree - The dynamic tree to query.
 * @returns {number} The total count of proxies in the tree.
 * @description
 * Returns the number of proxies currently stored in the dynamic tree by accessing
 * the proxyCount property.
 */
export function b2DynamicTree_GetProxyCount(tree: b2DynamicTree): number;
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
export function b2DynamicTree_MoveProxy(tree: b2DynamicTree, proxyId: number, aabb: b2Math.b2AABB): void;
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
export function b2DynamicTree_EnlargeProxy(tree: b2DynamicTree, proxyId: number, aabb: b2Math.b2AABB): void;
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
export function b2DynamicTree_GetHeight(tree: b2DynamicTree): number;
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
export function b2DynamicTree_GetAreaRatio(tree: b2DynamicTree): number;
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
export function b2DynamicTree_Validate(tree: b2DynamicTree): void;
/**
 * @function b2DynamicTree_GetMaxBalance
 * @summary Calculates the maximum height difference between sibling nodes in a dynamic tree
 * @param {b2DynamicTree} tree - The dynamic tree to analyze
 * @returns {number} The maximum balance value (height difference) found between any pair of sibling nodes
 * @description
 * Iterates through all non-leaf nodes in the tree and calculates the absolute height difference
 * between their child nodes. Returns the largest height difference found.
 */
export function b2DynamicTree_GetMaxBalance(tree: b2DynamicTree): number;
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
export function b2DynamicTree_RebuildBottomUp(tree: b2DynamicTree): void;
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
export function b2DynamicTree_ShiftOrigin(tree: b2DynamicTree, newOrigin: b2Math.b2Vec2): void;
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
export function b2DynamicTree_GetByteCount(tree: b2DynamicTree): number;
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
export function b2DynamicTree_Query(tree: b2DynamicTree, aabb: b2Math.b2AABB, maskBits: number, callback: Function, context: any): void;
export function b2DynamicTree_QueryAll(tree: any, aabb: any, context: any): void;
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
export function b2DynamicTree_RayCast(tree: b2DynamicTree, input: b2RayCastInput, maskBits: number, callback: Function, context: any): void;
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
export function b2DynamicTree_ShapeCast(tree: b2DynamicTree, input: b2ShapeCastInput, maskBits: number, callback: Function, context: any): void;
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
export function b2DynamicTree_Rebuild(tree: b2DynamicTree): number;
import { b2DynamicTree } from './include/dynamic_tree_h.js';
import * as b2Math from './include/math_functions_h.js';
import type { b2RayCastInput } from './include/collision_h.js';
import type { b2ShapeCastInput } from './include/collision_h.js';
