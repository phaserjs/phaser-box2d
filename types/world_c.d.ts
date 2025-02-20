export function b2GetWorldFromId(id: any): any;
export function b2GetWorld(index: any): any;
export function b2GetWorldLocked(index: any): any;
/**
 * @function b2CreateWorldArray
 * @description
 * Initializes a global array of Box2D world instances if it hasn't been created yet.
 * Creates B2_MAX_WORLDS number of world instances and marks them as not in use.
 * If the array already exists, the function returns without doing anything.
 * @returns {void}
 * @see b2World
 */
export function b2CreateWorldArray(): void;
/**
 * @function b2CreateWorld
 * @param {b2WorldDef} def - World definition object containing initialization parameters including:
 * gravity, hitEventThreshold, restitutionThreshold, maximumLinearVelocity,
 * contactPushoutVelocity, contactHertz, contactDampingRatio, jointHertz,
 * jointDampingRatio, enableSleep, enableContinuous
 * @returns {b2WorldId} A world identifier object containing:
 * - index: number (worldId + 1)
 * - revision: number (world revision number)
 * @description
 * Creates and initializes a new Box2D physics world with the specified parameters.
 * The function allocates memory for physics entities (bodies, joints, contacts),
 * initializes contact registers, creates necessary pools and arrays, and sets up
 * the world properties according to the provided definition.
 * @throws {Error} Returns a null world ID (0,0) if no world slots are available
 */
export function b2CreateWorld(def: b2WorldDef): b2WorldId;
/**
 * @function b2DestroyWorld
 * @description
 * Destroys a Box2D world instance and all its associated resources, including debug sets,
 * task contexts, event arrays, chains, bodies, shapes, contacts, joints, islands,
 * solver sets, constraint graph, broad phase, ID pools, and stack allocator.
 * Creates a new empty world instance with an incremented revision number.
 * @param {b2WorldId} worldId - The ID of the world to destroy
 * @returns {void}
 * @throws {Error} Throws an assertion error if a null chain has non-null shape indices
 */
export function b2DestroyWorld(worldId: b2WorldId): void;
export function b2AddNonTouchingContact(world: any, contact: any, contactSim: any): void;
export function b2RemoveNonTouchingContact(world: any, setIndex: any, localIndex: any): void;
export function b2Collide(context: any): void;
/**
 * @function b2World_Step
 * @summary Advances the physics simulation by a specified time step.
 * @param {b2WorldId} worldId - The identifier of the physics world to step
 * @param {number} timeStep - The time increment to advance the simulation (in seconds)
 * @param {number} subStepCount - The number of sub-steps to use for the iteration
 * @returns {void}
 * @description
 * Performs one step of physics simulation by updating broad phase pairs,
 * handling collisions, and solving the physics constraints. The function
 * manages contact events, sensor events, and body movement events during
 * the simulation step. It also handles warm starting and enforces velocity
 * limits based on world settings.
 * @throws {Error} Throws an assertion error if the world's stack allocator
 * is not empty after the step completes.
 * @note The function will not execute if the world is locked or if timeStep is 0.
 */
export function b2World_Step(worldId: b2WorldId, timeStep: number, subStepCount: number): void;
export function b2DrawShape(draw: any, shape: any, transform: any, color: any): void;
/**
 * @function b2World_Draw
 * @description
 * Renders debug visualization of a Box2D world, including shapes, joints, AABBs,
 * mass centers, and contact points based on the debug draw flags.
 * @param {b2WorldId} worldId - ID of the Box2D world to render
 * @param {b2DebugDraw} draw - Debug drawing context with rendering flags and methods
 * @returns {void}
 * @throws {Error} Throws assertion error if world is locked or body transform is null
 * @note
 * Drawing is controlled by flags in the draw parameter:
 * - drawShapes: Renders physics bodies/shapes with color coding
 * - drawJoints: Renders all active joints
 * - drawAABBs: Renders axis-aligned bounding boxes
 * - drawMass: Renders center of mass and mass values
 * - drawContacts: Renders contact points and impulses
 * - useDrawingBounds: Uses bounded drawing region
 */
export function b2World_Draw(worldId: b2WorldId, draw: b2DebugDraw): void;
/**
 * @function b2World_GetBodyEvents
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @returns {b2BodyEvents} An object containing an array of body move events and their count
 * @description
 * Retrieves the body movement events from a Box2D world. Returns an empty events object
 * if the world is locked. The function copies the world's body move event array and count
 * into a new b2BodyEvents object.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_GetBodyEvents(worldId: b2WorldId): b2BodyEvents;
/**
 * @function b2World_GetSensorEvents
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @returns {b2SensorEvents} An object containing arrays of sensor begin and end events
 * @description
 * Retrieves the sensor events from a Box2D world. The function returns both begin and end
 * sensor events that occurred during the simulation step. If the world is locked, it returns
 * an empty events object.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_GetSensorEvents(worldId: b2WorldId): b2SensorEvents;
/**
 * @function b2World_GetContactEvents
 * @summary Retrieves the contact events from a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @returns {b2ContactEvents} An object containing arrays of begin, end, and hit contact events,
 * along with their respective counts.
 * @throws {Error} Throws an assertion error if the world is locked.
 * @description
 * Returns a b2ContactEvents object containing three arrays: contactBeginArray,
 * contactEndArray, and contactHitArray, representing different types of contact
 * events that occurred in the physics simulation. The object also includes
 * count values for each type of event.
 */
export function b2World_GetContactEvents(worldId: b2WorldId): b2ContactEvents;
/**
 * Validates a Box2D world identifier.
 * @function b2World_IsValid
 * @param {b2WorldId} id - The world identifier to validate, containing index1 and revision properties
 * @returns {boolean} True if the world ID is valid and matches the stored world revision, false otherwise
 * @description
 * Checks if a world ID is valid by verifying:
 * 1. The ID is not undefined
 * 2. The index is within valid bounds (1 to B2_MAX_WORLDS)
 * 3. The world exists at the specified index
 * 4. The revision number matches the world's current revision
 */
export function b2World_IsValid(id: b2WorldId): boolean;
/**
 * @function b2Body_IsValid
 * @summary Validates a body ID to ensure it references a valid body in the physics world.
 * @param {b2BodyId} id - The body ID to validate
 * @returns {boolean} True if the ID is valid and references an existing body, false otherwise
 * @description
 * Performs validation checks on a body ID including:
 * - Verifies the ID is defined and is a b2BodyId instance
 * - Checks the world index is within valid bounds
 * - Confirms the world exists and matches the ID
 * - Validates the body index exists in the world
 * - Ensures the body is active and the revision number matches
 */
export function b2Body_IsValid(id: b2BodyId): boolean;
/**
 * Validates a shape ID to ensure it references a valid shape in a valid world.
 * @function b2Shape_IsValid
 * @param {b2ShapeId} id - The shape ID to validate, containing world0, index1, and revision properties
 * @returns {boolean} True if the shape ID is valid and references an existing shape, false otherwise
 * @description
 * Checks if a shape ID is valid by verifying:
 * - The ID exists and is not undefined
 * - The world index is within bounds
 * - The referenced world exists and matches the world ID
 * - The shape index is within bounds of the world's shape array
 * - The shape exists and is not marked as null
 * - The shape revision matches the ID's revision
 */
export function b2Shape_IsValid(id: b2ShapeId): boolean;
/**
 * Validates a b2ChainId to ensure it references a valid chain in the Box2D world system.
 * @function b2Chain_IsValid
 * @param {b2ChainId} id - The chain identifier containing world0 (world index),
 * index1 (chain index), and revision properties
 * @returns {boolean} Returns true if the chain ID is valid and matches the current revision,
 * false otherwise
 * @description
 * Checks if a chain ID is valid by verifying:
 * - The ID exists
 * - The world index is within valid bounds
 * - The world exists and matches the ID
 * - The chain index is within valid bounds
 * - The chain exists and is not null
 * - The revision number matches
 */
export function b2Chain_IsValid(id: b2ChainId): boolean;
/**
 * Validates a joint ID to ensure it references a valid joint in the Box2D world.
 * @function b2Joint_IsValid
 * @param {b2JointId} id - The joint ID to validate, containing world0 (world index),
 * index1 (joint index), and revision properties
 * @returns {boolean} True if the joint ID is valid and references an existing joint,
 * false otherwise
 * @description
 * Checks if a joint ID is valid by verifying:
 * - The world index is within bounds
 * - The referenced world exists and matches the ID
 * - The joint index is within bounds
 * - The joint exists and is not null
 * - The revision number matches the joint's revision
 */
export function b2Joint_IsValid(id: b2JointId): boolean;
/**
 * @function b2World_EnableSleeping
 * @summary Controls the sleep state management of bodies in a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @param {boolean} flag - When true, enables sleep management. When false, wakes all sleeping bodies.
 * @returns {void}
 * @description
 * Enables or disables the sleep management system for the specified Box2D world.
 * When sleep is disabled, all sleeping bodies are awakened. The function has no effect
 * if the world is locked or if the requested sleep state matches the current state.
 * @throws {Error} Throws an assertion error if the world is locked.
 */
export function b2World_EnableSleeping(worldId: b2WorldId, flag: boolean): void;
/**
 * @function b2World_EnableWarmStarting
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {boolean} flag - Boolean value to enable or disable warm starting
 * @returns {void}
 * @description
 * Enables or disables warm starting for the specified Box2D world. Warm starting
 * cannot be modified while the world is locked. If the world is locked when this
 * function is called, the function will return without making any changes.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_EnableWarmStarting(worldId: b2WorldId, flag: boolean): void;
/**
 * @function b2World_EnableContinuous
 * @summary Enables or disables continuous collision detection for a Box2D world.
 * @param {b2WorldId} worldId - The identifier of the Box2D world.
 * @param {boolean} flag - True to enable continuous collision detection, false to disable it.
 * @returns {void}
 * @description
 * Sets the continuous collision detection state for the specified Box2D world.
 * The function will not execute if the world is currently locked.
 * @throws {Error} Throws an assertion error if the world is locked when this function is called.
 */
export function b2World_EnableContinuous(worldId: b2WorldId, flag: boolean): void;
/**
 * @function b2World_SetRestitutionThreshold
 * @summary Sets the restitution threshold for a Box2D world.
 * @param {b2WorldId} worldId - The identifier for the Box2D world.
 * @param {number} value - The restitution threshold value to set.
 * @returns {void}
 * @description
 * Sets the restitution threshold for collision response in the specified Box2D world.
 * The value is clamped between 0 and Number.MAX_VALUE. The function will not execute
 * if the world is locked.
 * @throws {Error} Throws an assertion error if attempting to modify a locked world.
 */
export function b2World_SetRestitutionThreshold(worldId: b2WorldId, value: number): void;
/**
 * @function b2World_SetHitEventThreshold
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {number} value - The new hit event threshold value to set
 * @returns {void}
 * @description
 * Sets the hit event threshold for a Box2D world. The value is clamped between 0 and Number.MAX_VALUE.
 * The function will not execute if the world is locked.
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2World_SetHitEventThreshold(worldId: b2WorldId, value: number): void;
/**
 * Sets the contact tuning parameters for a Box2D world.
 * @function b2World_SetContactTuning
 * @param {b2WorldId} worldId - The identifier for the Box2D world.
 * @param {number} hertz - The frequency for contact constraint solving.
 * @param {number} dampingRatio - The damping ratio for contact constraint solving.
 * @param {number} pushOut - The velocity used for contact separation.
 * @returns {void}
 * @description
 * Sets three contact-related parameters for physics simulation: the constraint frequency (hertz),
 * damping ratio, and push-out velocity. All input parameters are clamped between 0 and MAX_VALUE.
 * The function will not execute if the world is locked.
 * @throws {Error} Throws an assertion error if attempting to modify a locked world.
 */
export function b2World_SetContactTuning(worldId: b2WorldId, hertz: number, dampingRatio: number, pushOut: number): void;
export function b2World_SetJointTuning(worldId: any, hertz: any, dampingRatio: any): void;
/**
 * @summary Dumps memory statistics for a Box2D world (Not supported in Phaser Box2D JS)
 * @function b2World_DumpMemoryStats
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @returns {void}
 * @description
 * This function is a stub that displays a warning message indicating that memory statistics
 * dumping is not supported in the Phaser Box2D JavaScript implementation.
 */
export function b2World_DumpMemoryStats(worldId: b2WorldId): void;
/**
 * @function b2World_OverlapAABB
 * @summary Queries an AABB region in the physics world for overlapping fixtures
 * @param {b2WorldId} worldId - The ID of the physics world to query
 * @param {b2AABB} aabb - The axis-aligned bounding box defining the query region
 * @param {b2QueryFilter} filter - Filter settings to control which fixtures are included
 * @param {b2OverlapResultFcn} fcn - Callback function that receives each overlapping fixture
 * @param {*} context - User context data passed to the callback function
 * @description
 * Performs a broadphase query using the world's dynamic tree to find all fixtures
 * that overlap with the given AABB. For each overlapping fixture that passes the
 * filter, the callback function is invoked.
 * @throws {Error} Throws an assertion error if the world is locked or if the AABB is invalid
 */
export function b2World_OverlapAABB(worldId: b2WorldId, aabb: b2AABB, filter: b2QueryFilter, fcn: b2OverlapResultFcn, context: any): void;
/**
 * @function b2World_OverlapCircle
 * @summary Tests for overlaps between a circle shape and all shapes in the world.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Circle} circle - The circle shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation transform of the circle
 * @param {b2QueryFilter} filter - Filtering options for the overlap test
 * @param {function} fcn - Callback function that handles overlap results
 * @param {*} context - User context data passed to the callback function
 * @description
 * Performs broad-phase AABB queries to find potential overlaps between the given circle
 * and all shapes in the world that match the filter criteria. For each potential overlap,
 * the callback function is invoked with the overlap details.
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * contains invalid values.
 */
export function b2World_OverlapCircle(worldId: b2WorldId, circle: b2Circle, transform: b2Transform, filter: b2QueryFilter, fcn: Function, context: any): void;
/**
 * @function b2World_OverlapCapsule
 * @summary Performs overlap queries for a capsule shape against all shapes in the world.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Capsule} capsule - The capsule shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation of the capsule
 * @param {b2QueryFilter} filter - Filtering options for the query
 * @param {b2OverlapResultFcn} fcn - Callback function that handles overlap results
 * @param {*} context - User context data passed to the callback function
 * @description
 * Tests a capsule shape against all shapes in the world that pass the filter criteria.
 * For each potential overlap, calls the provided callback function.
 * Uses a broad phase tree structure to efficiently find potential overlaps.
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * contains invalid position/rotation values.
 */
export function b2World_OverlapCapsule(worldId: b2WorldId, capsule: b2Capsule, transform: b2Transform, filter: b2QueryFilter, fcn: b2OverlapResultFcn, context: any): void;
/**
 * @function b2World_OverlapPolygon
 * @description
 * Performs overlap queries for a polygon shape against all shapes in the physics world
 * that match the provided filter criteria.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Polygon} polygon - The polygon shape to test for overlaps
 * @param {b2Transform} transform - The position and rotation of the polygon
 * @param {b2QueryFilter} filter - Filtering criteria for the overlap test
 * @param {b2OverlapResultFcn} fcn - Callback function to handle overlap results
 * @param {void} context - User data passed to the callback function
 * @throws {Error} Throws an assertion error if the world is locked or if the transform
 * components are invalid
 */
export function b2World_OverlapPolygon(worldId: b2WorldId, polygon: b2Polygon, transform: b2Transform, filter: b2QueryFilter, fcn: b2OverlapResultFcn, context: void): void;
/**
 * @function b2World_CastRay
 * @description
 * Performs a ray cast operation in the physics world to detect intersections between
 * a ray and physics bodies.
 * @param {b2WorldId} worldId - The ID of the physics world
 * @param {b2Vec2} origin - The starting point of the ray
 * @param {b2Vec2} translation - The direction and length of the ray
 * @param {b2QueryFilter} filter - Filtering options for the ray cast
 * @param {b2CastResultFcn} fcn - Callback function to handle ray cast results
 * @param {void} context - User context data passed to the callback
 * @returns {b2TreeStats}
 * @throws {Error} Throws assertion error if world is locked
 * @throws {Error} Throws assertion error if origin or translation vectors are invalid
 */
export function b2World_CastRay(worldId: b2WorldId, origin: b2Vec2, translation: b2Vec2, filter: b2QueryFilter, fcn: b2CastResultFcn, context: void): b2TreeStats;
/**
 * Performs a ray cast operation to find the closest intersection in the physics world.
 * @function b2World_CastRayClosest
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Vec2} origin - The starting point of the ray
 * @param {b2Vec2} translation - The direction and length of the ray
 * @param {b2QueryFilter} filter - Filter settings for the ray cast
 * @returns {b2RayResult} Information about the closest intersection found
 * @description
 * Casts a ray through the physics world and returns information about the closest
 * intersection. The ray is defined by an origin point and a translation vector.
 * The operation checks all body types in the broad phase using a dynamic tree
 * structure.
 * @throws {Error} Throws an assertion error if the world is locked or if the
 * origin/translation vectors are invalid
 */
export function b2World_CastRayClosest(worldId: b2WorldId, origin: b2Vec2, translation: b2Vec2, filter: b2QueryFilter): b2RayResult;
/**
 * @function b2World_CastCircle
 * @summary Performs a shape cast of a circle through the physics world.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Circle} circle - The circle shape to cast
 * @param {b2Transform} originTransform - The initial transform of the circle
 * @param {b2Vec2} translation - The displacement vector for the cast
 * @param {b2QueryFilter} filter - Filtering options for the cast
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {void} context - User data passed to the callback function
 * @description
 * Casts a circle shape through the physics world from its initial position
 * along a translation vector, detecting collisions with other shapes. The cast
 * is performed against all body types in the broad phase, stopping if a collision
 * occurs at fraction 0.
 * @throws {Error} Throws an assertion error if the world is locked or if the
 * transform position, rotation, or translation vectors are invalid.
 */
export function b2World_CastCircle(worldId: b2WorldId, circle: b2Circle, originTransform: b2Transform, translation: b2Vec2, filter: b2QueryFilter, fcn: b2CastResultFcn, context: void): void;
/**
 * @function b2World_CastCapsule
 * @description
 * Performs a shape cast of a capsule through the physics world, detecting collisions
 * along the specified translation path.
 * @param {b2WorldId} worldId - The identifier for the physics world
 * @param {b2Capsule} capsule - The capsule shape to cast
 * @param {b2Transform} originTransform - The initial transform of the capsule, containing position (p) and rotation (q)
 * @param {b2Vec2} translation - The translation vector defining the cast path
 * @param {b2QueryFilter} filter - Filter settings for the cast operation
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {void} context - User context data passed to the callback function
 * @throws {Error} Throws assertion error if world is locked or if transform/translation vectors are invalid
 */
export function b2World_CastCapsule(worldId: b2WorldId, capsule: b2Capsule, originTransform: b2Transform, translation: b2Vec2, filter: b2QueryFilter, fcn: b2CastResultFcn, context: void): void;
/**
 * @function b2World_CastPolygon
 * @description
 * Performs a shape cast of a polygon through the physics world, detecting collisions along the way.
 * @param {b2WorldId} worldId - ID of the physics world
 * @param {b2Polygon} polygon - The polygon shape to cast
 * @param {b2Transform} originTransform - Initial transform of the polygon, containing position and rotation
 * @param {b2Vec2} translation - The displacement vector to cast the polygon along
 * @param {b2QueryFilter} filter - Filter to determine which fixtures to check against
 * @param {b2CastResultFcn} fcn - Callback function to handle cast results
 * @param {*} context - User context data passed to the callback function
 * @throws {Error} Throws assertion error if world is locked or if transform/translation vectors are invalid
 */
export function b2World_CastPolygon(worldId: b2WorldId, polygon: b2Polygon, originTransform: b2Transform, translation: b2Vec2, filter: b2QueryFilter, fcn: b2CastResultFcn, context: any): void;
/**
 * @function b2World_SetPreSolveCallback
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance
 * @param {b2PreSolveFcn} fcn - The pre-solve callback function to be executed
 * @param {void} context - User data pointer passed to the callback function
 * @returns {void}
 * @description
 * Sets a callback function that is invoked before the physics solver runs.
 * The callback receives the provided context pointer when executed.
 */
export function b2World_SetPreSolveCallback(worldId: b2WorldId, fcn: b2PreSolveFcn, context: void): void;
/**
 * @summary Sets a custom filter callback for a Box2D world.
 * @function b2World_SetCustomFilterCallback
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @param {b2CustomFilterFcn} fcn - The custom filter callback function.
 * @param {void} context - A pointer to user-defined context data.
 * @returns {void}
 * @description
 * Sets a custom filter callback function for a Box2D world instance. The callback
 * can be used to implement custom collision filtering logic. The context parameter
 * allows passing additional data to the callback function.
 */
export function b2World_SetCustomFilterCallback(worldId: b2WorldId, fcn: b2CustomFilterFcn, context: void): void;
/**
 * @summary Sets the gravity vector for a Box2D world.
 * @function b2World_SetGravity
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @param {b2Vec2} gravity - The gravity vector to apply to the world. Defaults to (0,0).
 * @returns {void}
 * @description
 * Updates the gravity vector of the specified Box2D world. The gravity vector
 * defines the global acceleration applied to all dynamic bodies in the world.
 */
export function b2World_SetGravity(worldId: b2WorldId, gravity: b2Vec2): void;
/**
 * @summary Gets the gravity vector from a Box2D world instance.
 * @function b2World_GetGravity
 * @param {b2WorldId} worldId - The identifier for the Box2D world instance.
 * @returns {b2Vec2} The gravity vector of the world. A 2D vector with x and y components.
 * @description
 * Retrieves the current gravity vector from the specified Box2D world instance.
 * The gravity vector represents the global gravity force applied to all dynamic bodies in the world.
 */
export function b2World_GetGravity(worldId: b2WorldId): b2Vec2;
/**
 * @function b2World_Explode
 * @summary Creates an explosion effect that applies forces to nearby dynamic bodies
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2Vec2} position - The center point of the explosion
 * @param {number} radius - The radius of the explosion effect
 * @param {number} magnitude - The force magnitude of the explosion
 * @returns {void}
 * @description
 * Creates a circular explosion centered at the given position that applies radial forces
 * to dynamic bodies within the explosion radius. The explosion force decreases with
 * distance from the center point.
 * @throws {Error} Throws assertion errors if:
 * - position is invalid
 * - radius is invalid or <= 0
 * - magnitude is invalid
 * - world is locked
 */
export function b2World_Explode(worldId: b2WorldId, position: b2Vec2, radius: number, magnitude: number): void;
export function b2CheckId(a: any, id: any): void;
export function b2CheckIndex(a: any, i: any): void;
export function b2ValidateConnectivity(world: any): void;
export function b2ValidateSolverSets(world: any): void;
export function b2ValidateContacts(world: any): void;
/**
 * @namespace World
 */
/**
 * @import {b2WorldDef, b2DebugDraw, b2QueryFilter} from './include/types_h.js'
 * @import {b2ChainId, b2JointId} from './include/id_h.js'
 * @import {b2PreSolveFcn, b2CastResultFcn, b2OverlapResultFcn, b2CustomFilterFcn} from './include/types_h.js'
 * @import {b2TreeStats, b2Circle, b2Capsule, b2Polygon} from './include/collision_h.js'
 */
export const B2_MAX_WORLDS: 32;
export namespace b2SetType {
    let b2_staticSet: number;
    let b2_disabledSet: number;
    let b2_awakeSet: number;
    let b2_firstSleepingSet: number;
}
export class b2World {
    stackAllocator: b2StackAllocator;
    broadPhase: b2BroadPhase;
    constraintGraph: b2ConstraintGraph;
    bodyArray: any[];
    /** @type {b2SolverSet[]} */
    solverSetArray: b2SolverSet[];
    jointArray: any[];
    /** @type {b2Contact[]} */
    contactArray: b2Contact[];
    islandArray: any[];
    shapeArray: any[];
    chainArray: any[];
    taskContextArray: any[];
    bodyMoveEventArray: any[];
    sensorBeginEventArray: any[];
    sensorEndEventArray: any[];
    contactBeginArray: any[];
    contactEndArray: any[];
    contactHitArray: any[];
    debugBodySet: b2BitSet;
    debugJointSet: b2BitSet;
    debugContactSet: b2BitSet;
    stepIndex: number;
    splitIslandId: number;
    gravity: b2Vec2;
    hitEventThreshold: number;
    restitutionThreshold: number;
    maxLinearVelocity: number;
    contactPushoutVelocity: number;
    contactHertz: number;
    contactDampingRatio: number;
    jointHertz: number;
    jointDampingRatio: number;
    revision: number;
    preSolveFcn: any;
    preSolveContext: any;
    customFilterFcn: any;
    customFilterContext: any;
    workerCount: number;
    userTaskContext: any;
    userTreeTask: any;
    inv_h: number;
    worldId: b2WorldId;
    enableSleep: boolean;
    locked: boolean;
    enableWarmStarting: boolean;
    enableContinuous: boolean;
    inUse: boolean;
}
export class b2TaskContext {
    contactStateBitSet: b2BitSet;
    enlargedSimBitSet: b2BitSet;
    awakeIslandBitSet: b2BitSet;
    splitSleepTime: number;
    splitIslandId: number;
}
import type { b2WorldDef } from './include/types_h.js';
import { b2WorldId } from './include/id_h.js';
import type { b2DebugDraw } from './include/types_h.js';
import { b2BodyEvents } from './include/types_h.js';
import { b2SensorEvents } from './include/types_h.js';
import { b2ContactEvents } from './include/types_h.js';
import { b2BodyId } from './include/id_h.js';
import { b2ShapeId } from './include/id_h.js';
import type { b2ChainId } from './include/id_h.js';
import type { b2JointId } from './include/id_h.js';
import { b2AABB } from './include/math_functions_h.js';
import type { b2QueryFilter } from './include/types_h.js';
import type { b2OverlapResultFcn } from './include/types_h.js';
import type { b2Circle } from './include/collision_h.js';
import { b2Transform } from './include/math_functions_h.js';
import type { b2Capsule } from './include/collision_h.js';
import type { b2Polygon } from './include/collision_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
import type { b2CastResultFcn } from './include/types_h.js';
import type { b2TreeStats } from './include/collision_h.js';
import { b2RayResult } from './include/types_h.js';
import type { b2PreSolveFcn } from './include/types_h.js';
import type { b2CustomFilterFcn } from './include/types_h.js';
import { b2StackAllocator } from './include/stack_allocator_h.js';
import { b2BroadPhase } from './include/broad_phase_h.js';
import { b2ConstraintGraph } from './include/constraint_graph_h.js';
import { b2SolverSet } from './include/solver_set_h.js';
import { b2Contact } from './include/contact_h.js';
import { b2BitSet } from './include/bitset_h.js';
