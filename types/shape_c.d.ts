export function b2GetOwnerTransform(world: any, shape: any): any;
export function b2CreateShape(bodyId: any, def: any, geometry: any, shapeType: any): b2ShapeId;
/**
 * Creates a circle shape and attaches it to a body.
 * @function b2CreateCircleShape
 * @param {b2BodyId} bodyId - The identifier of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition containing properties like friction and density
 * @param {b2Circle} circle - The circle geometry definition
 * @returns {b2ShapeId} The identifier of the created circle shape
 */
export function b2CreateCircleShape(bodyId: b2BodyId, def: b2ShapeDef, circle: b2Circle): b2ShapeId;
/**
 * @function b2CreateCapsuleShape
 * @summary Creates either a capsule shape or circle shape based on the distance between centers
 * @param {b2BodyId} bodyId - The body ID to attach the shape to
 * @param {b2ShapeDef} def - The shape definition parameters
 * @param {b2Capsule} capsule - The capsule geometry containing center1, center2 and radius
 * @returns {b2ShapeId} The ID of the created shape
 * @description
 * Creates a capsule shape if the distance between centers is greater than b2_linearSlop.
 * If centers are closer than b2_linearSlop, creates a circle shape instead with radius
 * equal to the capsule radius and center at the midpoint between capsule centers.
 */
export function b2CreateCapsuleShape(bodyId: b2BodyId, def: b2ShapeDef, capsule: b2Capsule): b2ShapeId;
/**
 * Creates a polygon shape and attaches it to a body.
 * @function b2CreatePolygonShape
 * @param {b2BodyId} bodyId - The identifier of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition containing common shape properties
 * @param {b2Polygon} polygon - The polygon data including vertices and radius
 * @returns {b2ShapeId} The identifier of the created polygon shape
 * @throws {Error} Throws an assertion error if the polygon radius is invalid or negative
 */
export function b2CreatePolygonShape(bodyId: b2BodyId, def: b2ShapeDef, polygon: b2Polygon): b2ShapeId;
/**
 * @summary Creates a segment shape attached to a body
 * @function b2CreateSegmentShape
 * @param {b2BodyId} bodyId - The ID of the body to attach the shape to
 * @param {b2ShapeDef} def - The shape definition parameters
 * @param {b2Segment} segment - The segment geometry defined by point1 and point2
 * @returns {b2ShapeId} The ID of the created segment shape
 * @description
 * Creates a segment shape between two points and attaches it to the specified body.
 * The function validates that the segment length is greater than b2_linearSlop
 * before creating the shape.
 * @throws {Error} Throws an assertion error if the segment length squared is less
 * than or equal to b2_linearSlop squared
 */
export function b2CreateSegmentShape(bodyId: b2BodyId, def: b2ShapeDef, segment: b2Segment): b2ShapeId;
/**
 * @function b2DestroyShape
 * @summary Destroys a shape in the physics world and updates the parent body's mass if needed.
 * @param {b2ShapeId} shapeId - The identifier of the shape to destroy.
 * @description
 * Removes a shape from the physics world. If the parent body has automatic mass calculation enabled,
 * the body's mass properties are recalculated after the shape is destroyed.
 * The function performs the following operations:
 * 1. Retrieves the world and shape from the provided shapeId
 * 2. Destroys the shape internally
 * 3. Updates the parent body's mass data if automatic mass calculation is enabled
 */
export function b2DestroyShape(shapeId: b2ShapeId): void;
/**
 * @function b2CreateChain
 * @description Creates a chain shape composed of connected line segments attached to a body.
 * The chain can be either a closed loop or an open chain.
 * @param {b2BodyId} bodyId - The ID of the body to attach the chain to
 * @param {b2ChainDef} def - The chain definition containing:
 * - {number} count - Number of vertices (must be >= 4)
 * - {b2Vec2[]} points - Array of vertex points
 * - {boolean} isLoop - Whether the chain forms a closed loop
 * - {number} friction - Friction coefficient (must be >= 0)
 * - {number} restitution - Restitution coefficient (must be >= 0)
 * - {b2Filter} filter - Collision filter data
 * - {*} userData - User data pointer
 * @returns {b2ChainId} The ID of the created chain shape
 * @throws {Error} Throws assertion error if friction or restitution are invalid/negative,
 * or if count is less than 4
 */
export function b2CreateChain(bodyId: b2BodyId, def: b2ChainDef): b2ChainId;
/**
 * @function b2DestroyChain
 * @description
 * Destroys a chain of shapes attached to a body in a Box2D world. The function removes all shapes
 * associated with the chain and frees the chain ID from the world's chain ID pool.
 * @param {b2ChainId} chainId - The identifier for the chain to be destroyed, containing world and index information
 * @returns {void}
 * @throws {Error} Throws an assertion error if the chain is not found in the body's chain list
 */
export function b2DestroyChain(chainId: b2ChainId): void;
export function b2ComputeShapeAABB(shape: any, xf: any): b2AABB;
export function b2GetShapeCentroid(shape: any): any;
export function b2GetShapePerimeter(shape: any): number;
export function b2ComputeShapeMass(shape: any): b2MassData;
export function b2ComputeShapeExtent(shape: any, localCenter: any): b2ShapeExtent;
export function b2RayCastShape(input: any, shape: any, transform: any): b2CastOutput;
export function b2ShapeCastShape(input: any, shape: any, transform: any): b2CastOutput;
export function b2CreateShapeProxy(shape: any, bp: any, type: any, transform: any, forcePairCreation: any): void;
export function b2DestroyShapeProxy(shape: any, bp: any): void;
export function b2MakeShapeDistanceProxy(shape: any): b2DistanceProxy;
/**
 * @function b2Shape_GetBody
 * @summary Gets the body ID associated with a given shape ID.
 * @param {b2ShapeId} shapeId - The ID of the shape to query.
 * @returns {b2BodyId} The ID of the body that owns the shape.
 * @description
 * Retrieves the body ID for a given shape by first accessing the world object,
 * then getting the shape from the world, and finally creating a body ID
 * from the shape's stored body reference.
 */
export function b2Shape_GetBody(shapeId: b2ShapeId): b2BodyId;
export function b2Shape_GetWorld(shapeId: any): b2WorldId;
/**
 * @summary Sets the user data associated with a shape.
 * @function b2Shape_SetUserData
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {*} userData - The user data to associate with the shape.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a shape identified by shapeId. The shape must exist
 * in the world referenced by the shapeId. The function retrieves the shape from the world
 * and updates its userData property.
 */
export function b2Shape_SetUserData(shapeId: b2ShapeId, userData: any): void;
/**
 * @summary Gets the user data associated with a shape.
 * @function b2Shape_GetUserData
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {void} The user data associated with the shape.
 * @description
 * This function retrieves the user data that was previously attached to a shape
 * by looking up the shape in the world using the provided shape ID.
 */
export function b2Shape_GetUserData(shapeId: b2ShapeId): void;
/**
 * Checks if a shape is marked as a sensor.
 * @function b2Shape_IsSensor
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if the shape is a sensor, false otherwise.
 * @description
 * Retrieves a shape from the physics world using its ID and returns
 * whether it is configured as a sensor. Sensor shapes detect collisions
 * but do not generate physical responses.
 */
export function b2Shape_IsSensor(shapeId: b2ShapeId): boolean;
/**
 * Tests if a point lies within a shape.
 * @function b2Shape_TestPoint
 * @param {b2ShapeId} shapeId - The identifier for the shape to test against
 * @param {b2Vec2} point - The world space point to test
 * @returns {boolean} True if the point is inside the shape, false otherwise
 * @description
 * Transforms the test point into the shape's local space and performs
 * point-in-shape testing based on the shape type (capsule, circle, or polygon).
 * Returns false for unrecognized shape types.
 */
export function b2Shape_TestPoint(shapeId: b2ShapeId, point: b2Vec2): boolean;
/**
 * @function b2Shape_RayCast
 * @description
 * Performs a ray cast against a shape in world space, transforming the input/output
 * between local and world coordinates.
 * @param {b2ShapeId} shapeId - The identifier for the shape to test
 * @param {b2Vec2} origin - The starting point of the ray in world coordinates
 * @param {b2Vec2} translation - The direction and length of the ray in world coordinates
 * @returns {b2CastOutput} The ray cast results containing:
 * - hit: boolean indicating if the ray intersects the shape
 * - point: intersection point in world coordinates (if hit is true)
 * - normal: surface normal at intersection in world coordinates (if hit is true)
 * - fraction: fraction of translation where intersection occurs (if hit is true)
 * @throws {Error} Throws assertion error if shape type is invalid
 */
export function b2Shape_RayCast(shapeId: b2ShapeId, origin: b2Vec2, translation: b2Vec2): b2CastOutput;
/**
 * @function b2Shape_SetDensity
 * @summary Sets the density of a shape and optionally updates the parent body's mass.
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {number} density - The new density value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets a new density value for the specified shape. If the new density matches
 * the current density, no changes are made. The function performs validation
 * to ensure the density is a valid non-negative number.
 * @throws {Error} Throws an assertion error if the density is invalid or negative.
 */
export function b2Shape_SetDensity(shapeId: b2ShapeId, density: number): void;
/**
 * @summary Gets the density value of a shape.
 * @function b2Shape_GetDensity
 * @param {b2ShapeId} shapeId - The identifier for the shape within a Box2D world.
 * @returns {number} The density value of the specified shape.
 * @description
 * Retrieves the density property of a shape by first accessing the world object
 * using the world identifier stored in the shapeId, then accessing the specific
 * shape within that world.
 */
export function b2Shape_GetDensity(shapeId: b2ShapeId): number;
/**
 * Sets the friction coefficient for a shape.
 * @function b2Shape_SetFriction
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify
 * @param {number} friction - The friction coefficient value (must be >= 0)
 * @returns {void}
 * @throws {Error} Throws an assertion error if friction is invalid or negative
 * @throws {Error} Throws an assertion error if the world is locked
 * @description
 * Sets a new friction value for the specified shape. The operation will not proceed
 * if the physics world is locked. The friction parameter must be a valid number
 * greater than or equal to zero.
 */
export function b2Shape_SetFriction(shapeId: b2ShapeId, friction: number): void;
/**
 * Gets the friction coefficient of a shape.
 * @function b2Shape_GetFriction
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world.
 * @returns {number} The friction coefficient of the shape.
 * @description
 * Retrieves the friction value from a shape object in the Box2D physics world
 * using the provided shape identifier.
 */
export function b2Shape_GetFriction(shapeId: b2ShapeId): number;
/**
 * Sets the restitution (bounciness) value for a shape.
 * @function b2Shape_SetRestitution
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify.
 * @param {number} restitution - The restitution value to set. Must be non-negative.
 * @returns {void}
 * @throws {Error} Throws an assertion error if restitution is invalid or negative,
 * or if the world is locked.
 */
export function b2Shape_SetRestitution(shapeId: b2ShapeId, restitution: number): void;
/**
 * Gets the restitution coefficient of a shape.
 * @function b2Shape_GetRestitution
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world.
 * @returns {number} The restitution coefficient of the shape.
 * @description
 * Retrieves the restitution (bounciness) value associated with the specified shape
 * from the physics world.
 */
export function b2Shape_GetRestitution(shapeId: b2ShapeId): number;
/**
 * Gets the filter data for a shape.
 * @function b2Shape_GetFilter
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {b2Filter} The collision filter data associated with the shape.
 * @description
 * Retrieves the collision filtering data from a shape by first accessing the world
 * object using the world identifier stored in the shapeId, then accessing the
 * shape within that world using the shapeId.
 */
export function b2Shape_GetFilter(shapeId: b2ShapeId): b2Filter;
/**
 * Sets the collision filter for a shape.
 * @function b2Shape_SetFilter
 * @param {b2ShapeId} shapeId - The identifier for the shape to modify.
 * @param {b2Filter} filter - The new collision filter settings to apply.
 * @returns {void}
 * @description
 * Updates the collision filter properties of a shape. If the new filter settings
 * match the existing ones, no changes are made. When the categoryBits change,
 * the shape's broad-phase proxy is destroyed and recreated. The function also
 * wakes connected bodies when the filter changes.
 */
export function b2Shape_SetFilter(shapeId: b2ShapeId, filter: b2Filter): void;
/**
 * @function b2Shape_EnableSensorEvents
 * @summary Enables or disables sensor events for a specific shape.
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {boolean} flag - True to enable sensor events, false to disable them.
 * @returns {void}
 * @description
 * Sets the enableSensorEvents property of a shape in the physics world. The shape
 * must exist in a valid world context for the operation to succeed.
 */
export function b2Shape_EnableSensorEvents(shapeId: b2ShapeId, flag: boolean): void;
/**
 * Checks if sensor events are enabled for a given shape.
 * @function b2Shape_AreSensorEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if sensor events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and returns
 * the state of its sensor events flag.
 */
export function b2Shape_AreSensorEventsEnabled(shapeId: b2ShapeId): boolean;
/**
 * @summary Enables or disables contact events for a shape.
 * @function b2Shape_EnableContactEvents
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @param {boolean} flag - True to enable contact events, false to disable.
 * @returns {void}
 * @description
 * Sets whether a shape should generate contact events during collision detection.
 * The shape must belong to a valid world, otherwise the function returns without effect.
 */
export function b2Shape_EnableContactEvents(shapeId: b2ShapeId, flag: boolean): void;
/**
 * Checks if contact events are enabled for a given shape.
 * @function b2Shape_AreContactEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if contact events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * the enableContactEvents property of that shape.
 */
export function b2Shape_AreContactEventsEnabled(shapeId: b2ShapeId): boolean;
/**
 * @function b2Shape_EnablePreSolveEvents
 * @param {b2ShapeId} shapeId - The identifier for the shape in the physics world
 * @param {boolean} flag - Boolean value to enable or disable pre-solve events for the shape
 * @returns {void}
 * @description
 * Enables or disables pre-solve events for a specific shape in the physics simulation.
 * The function first validates the world reference and returns if invalid.
 * If valid, it updates the shape's pre-solve events setting according to the flag parameter.
 */
export function b2Shape_EnablePreSolveEvents(shapeId: b2ShapeId, flag: boolean): void;
/**
 * @summary Checks if pre-solve events are enabled for a given shape.
 * @function b2Shape_ArePreSolveEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if pre-solve events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * the enablePreSolveEvents property of that shape.
 */
export function b2Shape_ArePreSolveEventsEnabled(shapeId: b2ShapeId): boolean;
/**
 * @summary Enables or disables hit event notifications for a shape.
 * @function b2Shape_EnableHitEvents
 * @param {b2ShapeId} shapeId - The identifier of the shape to modify.
 * @param {boolean} flag - True to enable hit events, false to disable.
 * @returns {void}
 * @description
 * Sets whether a shape should generate hit events during collision detection.
 * The shape must belong to a valid world, otherwise the function returns without effect.
 * @throws {Error} If the world associated with the shapeId is locked.
 */
export function b2Shape_EnableHitEvents(shapeId: b2ShapeId, flag: boolean): void;
/**
 * Checks if hit events are enabled for a given shape.
 * @function b2Shape_AreHitEventsEnabled
 * @param {b2ShapeId} shapeId - The identifier for the shape to check.
 * @returns {boolean} True if hit events are enabled for the shape, false otherwise.
 * @description
 * This function retrieves a shape from the physics world using its ID and checks
 * if hit events are enabled for that shape by accessing the enableHitEvents property.
 */
export function b2Shape_AreHitEventsEnabled(shapeId: b2ShapeId): boolean;
/**
 * Gets the type of a shape from the physics world using its shape ID.
 * @function b2Shape_GetType
 * @param {b2ShapeId} shapeId - The ID of the shape to query
 * @returns {b2ShapeType} The type of the specified shape
 * @description
 * Retrieves a shape from the physics world using the provided shape ID
 * and returns its type classification.
 */
export function b2Shape_GetType(shapeId: b2ShapeId): {
    b2_circleShape: number;
    b2_capsuleShape: number;
    b2_segmentShape: number;
    b2_polygonShape: number;
    b2_chainSegmentShape: number;
    b2_shapeTypeCount: number;
};
/**
 * @function b2Shape_GetCircle
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference
 * @returns {b2Circle} The circle shape object
 * @description
 * Retrieves a circle shape from the physics world using the provided shape identifier.
 * @throws {Error} Throws an assertion error if the shape type is not b2_circleShape
 */
export function b2Shape_GetCircle(shapeId: b2ShapeId): b2Circle;
/**
 * @function b2Shape_GetSegment
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference
 * @returns {b2Segment} The segment data from the specified shape
 * @description
 * Retrieves the segment data from a shape in the physics world. The shape must be of type b2_segmentShape.
 * @throws {Error} Throws an assertion error if the shape type is not b2_segmentShape
 */
export function b2Shape_GetSegment(shapeId: b2ShapeId): b2Segment;
/**
 * Gets the chain segment data from a shape identified by its ID.
 * @function b2Shape_GetChainSegment
 * @param {Object} shapeId - An object containing the shape identifier and world reference.
 * @param {number} shapeId.world0 - The world identifier.
 * @returns {Object} The chain segment data associated with the shape.
 * @throws {Error} Throws an assertion error if the shape type is not b2_chainSegmentShape.
 */
export function b2Shape_GetChainSegment(shapeId: {
    world0: number;
}): any;
/**
 * @function b2Shape_GetCapsule
 * @param {b2ShapeId} shapeId - A shape identifier containing world and shape reference information
 * @returns {b2Capsule} The capsule shape data associated with the given shape ID
 * @description
 * Retrieves the capsule shape data from a shape in the physics world using the provided shape ID.
 * @throws {Error} Throws an assertion error if the shape type is not b2_capsuleShape
 */
export function b2Shape_GetCapsule(shapeId: b2ShapeId): b2Capsule;
/**
 * Gets a polygon shape from a shape ID.
 * @function b2Shape_GetPolygon
 * @param {b2ShapeId} shapeId - The ID of the shape to retrieve.
 * @returns {b2Polygon} The polygon shape associated with the given shape ID.
 * @throws {Error} Throws an assertion error if the shape type is not b2_polygonShape.
 */
export function b2Shape_GetPolygon(shapeId: b2ShapeId): b2Polygon;
/**
 * @function b2Shape_SetCircle
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Circle} circle - The circle shape configuration to set
 * @returns {void}
 * @description
 * Sets a shape's type to circle and updates its properties. The function updates
 * the shape's proxy in the broad-phase collision system and can wake connected bodies.
 * If the world is locked or invalid, the function returns without making changes.
 */
export function b2Shape_SetCircle(shapeId: b2ShapeId, circle: b2Circle): void;
/**
 * @function b2Shape_SetCapsule
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Capsule} capsule - The capsule shape configuration to set
 * @returns {void}
 * @description
 * Sets a shape's type to capsule and updates its configuration. The function
 * resets the shape's proxy in the broad-phase collision system, optionally
 * waking connected bodies and destroying the existing proxy.
 * @throws {Error} If the world reference is invalid (null)
 */
export function b2Shape_SetCapsule(shapeId: b2ShapeId, capsule: b2Capsule): void;
/**
 * @function b2Shape_SetSegment
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Segment} segment - The segment data to assign to the shape
 * @returns {void}
 * @description
 * Sets a shape's type to segment and updates its segment data. After updating,
 * it resets the shape's collision proxy in the physics world. The function requires
 * a valid world lock to execute successfully.
 */
export function b2Shape_SetSegment(shapeId: b2ShapeId, segment: b2Segment): void;
/**
 * @function b2Shape_SetPolygon
 * @param {b2ShapeId} shapeId - The identifier for the shape to be modified
 * @param {b2Polygon} polygon - The polygon data to assign to the shape
 * @returns {void}
 * @description
 * Sets a shape's type to polygon and assigns polygon data to it. The function
 * updates the shape's proxy in the broad-phase collision system and can wake
 * connected bodies.
 * @throws {Error} If the world associated with the shapeId is not found
 */
export function b2Shape_SetPolygon(shapeId: b2ShapeId, polygon: b2Polygon): void;
/**
 * @function b2Shape_GetParentChain
 * @param {b2ShapeId} shapeId - The identifier of the shape to check for parent chain
 * @returns {b2ChainId} A b2ChainId object. Returns an empty b2ChainId (default values) if the shape
 * is not a chain segment shape or has no parent chain
 * @description
 * Retrieves the parent chain identifier for a given shape if it is a chain segment shape
 * and has an associated chain. The function checks if the shape is of type b2_chainSegmentShape
 * and has a valid chain reference before returning the chain identifier.
 */
export function b2Shape_GetParentChain(shapeId: b2ShapeId): b2ChainId;
/**
 * Sets the friction value for all shapes in a chain.
 * @function b2Chain_SetFriction
 * @param {b2ChainId} chainId - The identifier for the chain whose friction will be modified
 * @param {number} friction - The friction value to set for all shapes in the chain
 * @returns {void}
 * @description
 * Updates the friction property of each shape within the specified chain. The function
 * retrieves the chain shape from the world, then iterates through all shapes in the
 * chain and sets their friction to the specified value.
 */
export function b2Chain_SetFriction(chainId: b2ChainId, friction: number): void;
/**
 * @function b2Chain_SetRestitution
 * @summary Sets the restitution value for all shapes in a chain.
 * @param {b2ChainId} chainId - The identifier for the chain whose restitution will be set
 * @param {number} restitution - The restitution value to apply to all shapes in the chain
 * @returns {void}
 * @description
 * Sets the restitution coefficient for all shapes that make up the specified chain.
 * If the world is not found using the provided chainId, the function returns without making changes.
 */
export function b2Chain_SetRestitution(chainId: b2ChainId, restitution: number): void;
/**
 * Gets the contact capacity for a given shape.
 * @function b2Shape_GetContactCapacity
 * @param {b2ShapeId} shapeId - The identifier for the shape to check
 * @returns {number} The number of contacts for the shape's body. Returns 0 if the world is invalid,
 * or if the shape is a sensor.
 * @description
 * Retrieves the number of contacts associated with the body that owns the specified shape.
 * If the shape is a sensor or the world reference is invalid, the function returns 0.
 */
export function b2Shape_GetContactCapacity(shapeId: b2ShapeId): number;
/**
 * @function b2Shape_GetContactData
 * @param {b2ShapeId} shapeId - The identifier of the shape to get contact data for
 * @param {Array<{shapeIdA: b2ShapeId, shapeIdB: b2ShapeId, manifold: b2Manifold}>} contactData - Array to store the contact data
 * @param {number} capacity - Maximum number of contacts to retrieve
 * @returns {number} The number of contacts found and stored in contactData
 * @description
 * Retrieves contact data for a specified shape. For each valid contact involving the shape,
 * stores the shape IDs of both bodies in contact and their contact manifold.
 * Only stores contacts where the touching flag is set and ignores sensor shapes.
 * @throws {Error} If the world is locked or invalid
 */
export function b2Shape_GetContactData(shapeId: b2ShapeId, contactData: Array<{
    shapeIdA: b2ShapeId;
    shapeIdB: b2ShapeId;
    manifold: b2Manifold;
}>, capacity: number): number;
/**
 * @function b2Shape_GetAABB
 * @summary Gets the Axis-Aligned Bounding Box (AABB) for a shape.
 * @param {b2ShapeId} shapeId - The identifier for the shape.
 * @returns {b2AABB} The AABB of the shape. Returns an empty AABB if the world is null.
 * @description
 * Retrieves the Axis-Aligned Bounding Box (AABB) associated with a shape in the physics world.
 * If the world reference is invalid, returns a default AABB with zero dimensions.
 */
export function b2Shape_GetAABB(shapeId: b2ShapeId): b2AABB;
/**
 * @function b2Shape_GetClosestPoint
 * @summary Gets the closest point on a shape to a target point
 * @param {b2ShapeId} shapeId - ID of the shape to query
 * @param {b2Vec2} target - The target point to find the closest point to
 * @returns {b2Vec2} The closest point on the shape to the target point. Returns (0,0) if the world is invalid.
 * @description
 * Calculates the closest point on a shape to a given target point, taking into account
 * the shape's position and rotation in world space. Uses the distance calculation
 * algorithm with shape proxies and transforms.
 */
export function b2Shape_GetClosestPoint(shapeId: b2ShapeId, target: b2Vec2): b2Vec2;
import { b2ShapeId } from './include/id_h.js';
import type { b2BodyId } from './include/id_h.js';
import type { b2ShapeDef } from './include/types_h.js';
import { b2Circle } from './include/collision_h.js';
import type { b2Capsule } from './include/collision_h.js';
import type { b2Polygon } from './include/collision_h.js';
import { b2Segment } from './include/collision_h.js';
import type { b2ChainDef } from './include/types_h.js';
import { b2ChainId } from './include/id_h.js';
import { b2AABB } from './include/math_functions_h.js';
import { b2MassData } from './include/collision_h.js';
import { b2ShapeExtent } from './include/shape_h.js';
import { b2CastOutput } from './include/collision_h.js';
import { b2DistanceProxy } from './include/collision_h.js';
import { b2WorldId } from './include/id_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
import type { b2Filter } from './include/types_h.js';
import type { b2Manifold } from './include/collision_h.js';
