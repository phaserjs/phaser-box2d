/**
 * @namespace Body
 */
export function b2MakeSweep(bodySim: any, out: any): any;
export function b2GetBody(world: any, bodyId: any): any;
export function b2GetBodyFullId(world: any, bodyId: any): any;
export function b2GetBodyTransformQuick(world: any, body: any): any;
export function b2GetBodyTransform(world: any, bodyId: any): any;
export function b2MakeBodyId(world: any, bodyId: any): b2BodyId;
export function b2GetBodySim(world: any, body: any): any;
export function b2GetBodyState(world: any, body: any): any;
export function b2CreateIslandForBody(world: any, setIndex: any, body: any): void;
export function b2RemoveBodyFromIsland(world: any, body: any): void;
export function b2DestroyBodyContacts(world: any, body: any, wakeBodies: any): void;
/**
 * @function b2CreateBody
 * @param {b2WorldId} worldId - The ID of the world to create the body in
 * @param {b2BodyDef} def - The body definition containing initialization parameters
 * @returns {b2BodyId} The ID of the newly created body
 * @description
 * Creates a new physics body in the specified world based on the provided body definition.
 * The body is added to the appropriate solver set based on its type and state.
 * The function initializes the body's physical properties including position, rotation,
 * velocities, damping values and other simulation parameters.
 * @throws {Error} Throws assertion errors if:
 * - Position vector is invalid
 * - Rotation value is invalid
 * - Linear velocity vector is invalid
 * - Angular velocity is invalid
 * - Linear damping is invalid or negative
 * - Angular damping is invalid or negative
 * - Sleep threshold is invalid or negative
 * - Gravity scale is invalid
 */
export function b2CreateBody(worldId: b2WorldId, def: b2BodyDef): b2BodyId;
export function b2IsBodyAwake(world: any, body: any): boolean;
export function b2WakeBody(world: any, body: any): boolean;
/**
 * @function b2DestroyBody
 * @description
 * Destroys a body and all associated joints, contacts, shapes, and chains in the physics world.
 * The function cleans up all resources and removes the body from the simulation system.
 * @param {b2BodyId} bodyId - The identifier of the body to destroy
 * @returns {void}
 * @throws {Error} Throws assertion errors if body indices are invalid during removal
 * @note This function performs the following cleanup operations:
 * - Destroys all joints connected to the body
 * - Removes all contacts associated with the body
 * - Destroys all shapes attached to the body
 * - Removes all chains connected to the body
 * - Removes the body from the island structure
 * - Cleans up solver sets and simulation data
 */
export function b2DestroyBody(bodyId: b2BodyId): void;
/**
 * Gets the contact capacity of a body.
 * @function b2Body_GetContactCapacity
 * @param {b2BodyId} bodyId - The identifier for the body to query
 * @returns {number} The number of contacts associated with the body. Returns 0 if the world is invalid.
 * @description
 * Retrieves the current number of contacts associated with the specified body.
 * The function first validates the world reference before accessing the body's contact count.
 */
export function b2Body_GetContactCapacity(bodyId: b2BodyId): number;
/**
 * @function b2Body_GetContactData
 * @param {b2BodyId} bodyId - The ID of the body to get contact data from
 * @param {Array<b2ContactData>} contactData - Array to store the contact data
 * @param {number} capacity - Maximum number of contacts to retrieve
 * @returns {number} The number of contacts stored in contactData
 * @description
 * Retrieves contact data for a specified body. For each active contact, stores the shape IDs
 * of both bodies involved and the contact manifold. Only stores contacts that have the
 * touching flag set.
 * @throws {Error} If the world is locked or invalid
 */
export function b2Body_GetContactData(bodyId: b2BodyId, contactData: Array<b2ContactData>, capacity: number): number;
/**
 * @function b2Body_ComputeAABB
 * @summary Computes the Axis-Aligned Bounding Box (AABB) for a body and all its shapes.
 * @param {b2BodyId} bodyId - The identifier for the body whose AABB is to be computed.
 * @returns {b2AABB} An AABB that encompasses the body and all its shapes. Returns an empty AABB if the world is not found.
 * @description
 * For bodies with no shapes, returns an AABB containing only the body's position.
 * For bodies with shapes, computes the union of AABBs of all shapes attached to the body.
 */
export function b2Body_ComputeAABB(bodyId: b2BodyId): b2AABB;
export function b2UpdateBodyMassData(world: any, body: any): void;
/**
 * @function b2Body_GetPosition
 * @summary Gets the current position of a body in the physics world.
 * @param {b2BodyId} bodyId - The identifier for the body whose position is being queried.
 * @returns {b2Vec2} The position vector of the body in world coordinates.
 * @description
 * Retrieves the current position component of a body's transform from the physics world.
 * The position is returned as a b2Vec2 representing the body's location in world space.
 */
export function b2Body_GetPosition(bodyId: b2BodyId): b2Vec2;
/**
 * Gets the rotation component of a body's transform.
 * @function b2Body_GetRotation
 * @param {b2BodyId} bodyId - The identifier for the body whose rotation is being queried.
 * @returns {b2Rot} A rotation object containing the cosine and sine of the body's angle.
 * @description
 * Retrieves the rotation component (q) from the body's transform. The returned b2Rot
 * object represents the body's angular orientation in 2D space.
 */
export function b2Body_GetRotation(bodyId: b2BodyId): b2Rot;
/**
 * @summary Gets the transform of a body in the physics world.
 * @function b2Body_GetTransform
 * @param {Object} bodyId - The identifier object for the body, containing world reference.
 * @param {number} bodyId.world0 - The world identifier.
 * @returns {Object} The body's transform containing:
 * - position {b2Vec2} The position vector (x, y)
 * - rotation {b2Rot} The rotation values (c, s)
 * @description
 * Retrieves the current transform (position and rotation) of a physics body
 * from the specified Box2D world using the body's identifier.
 */
export function b2Body_GetTransform(bodyId: {
    world0: number;
}): any;
/**
 * Converts a point from world coordinates to local body coordinates.
 * @function b2Body_GetLocalPoint
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} worldPoint - A point in world coordinates
 * @returns {b2Vec2} The point expressed in the body's local coordinates
 * @description
 * Takes a point given in world coordinates and converts it to the body's local
 * coordinate system by applying the inverse of the body's transform.
 */
export function b2Body_GetLocalPoint(bodyId: b2BodyId, worldPoint: b2Vec2): b2Vec2;
/**
 * @function b2Body_GetWorldPoint
 * @summary Converts a point from local body coordinates to world coordinates.
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @param {b2Vec2} localPoint - A point in the body's local coordinates.
 * @returns {b2Vec2} The point transformed to world coordinates.
 * @description
 * Takes a point given in body-local coordinates and converts it to world coordinates
 * using the body's current transform (position and rotation).
 */
export function b2Body_GetWorldPoint(bodyId: b2BodyId, localPoint: b2Vec2): b2Vec2;
/**
 * @function b2Body_GetLocalVector
 * @summary Converts a vector from world space to a body's local space
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} worldVector - A vector in world coordinates
 * @returns {b2Vec2} The vector transformed into the body's local coordinates
 * @description
 * Takes a vector defined in world coordinates and transforms it to be relative
 * to the body's local coordinate system by applying the inverse of the body's rotation.
 */
export function b2Body_GetLocalVector(bodyId: b2BodyId, worldVector: b2Vec2): b2Vec2;
/**
 * @function b2Body_GetWorldVector
 * @summary Converts a vector from local body coordinates to world coordinates.
 * @param {b2BodyId} bodyId - The identifier for the body
 * @param {b2Vec2} localVector - A vector in local body coordinates
 * @returns {b2Vec2} The vector transformed into world coordinates
 * @description
 * Transforms a vector from the body's local coordinate system to the world
 * coordinate system. This operation only performs rotation (not translation)
 * using the body's current rotation matrix.
 */
export function b2Body_GetWorldVector(bodyId: b2BodyId, localVector: b2Vec2): b2Vec2;
/**
 * @function b2Body_SetTransform
 * @description
 * Sets the position and rotation of a body, updating its transform and associated shape AABBs.
 * The function updates the body's center, handles broad-phase movement, and adjusts collision bounds.
 * @param {b2BodyId} bodyId - The identifier of the body to transform
 * @param {b2Vec2} position - The new position vector for the body
 * @param {b2Rot} [rotation] - The new rotation for the body. If undefined, keeps current rotation
 * @returns {void}
 * @throws {Error} Throws assertion error if:
 * - The position vector is invalid
 * - The body ID is invalid
 * - The world is locked
 * - The rotation (if provided) is invalid
 */
export function b2Body_SetTransform(bodyId: b2BodyId, position: b2Vec2, rotation?: b2Rot): void;
/**
 * Gets a clone of the linear velocity of a body.
 * @function b2Body_GetLinearVelocity
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {b2Vec2} The linear velocity vector of the body. Returns a zero vector (0,0) if the body state is null.
 * @description
 * Retrieves the current linear velocity of a body from its state in the physics world.
 * If the body state cannot be found, returns a zero vector.
 * Linear velocity is often used for calculations (damping, direction, etc) and must be cloned to avoid unwanted effects in the Physics engine.
 */
export function b2Body_GetLinearVelocity(bodyId: b2BodyId): b2Vec2;
/**
 * Gets the angular velocity of a body.
 * @function b2Body_GetAngularVelocity
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The angular velocity in radians per second. Returns 0 if the body state cannot be retrieved.
 * @description
 * Retrieves the current angular velocity of a body from its state in the physics world.
 * Angular velocity represents how fast the body is rotating.
 */
export function b2Body_GetAngularVelocity(bodyId: b2BodyId): number;
/**
 * Sets the linear velocity of a body.
 * @function b2Body_SetLinearVelocity
 * @param {b2BodyId} bodyId - The identifier of the body to modify.
 * @param {b2Vec2} linearVelocity - The new linear velocity vector to set.
 * @returns {void}
 * @description
 * Sets the linear velocity of a body. If the body is static, the function returns without
 * making changes. If the new velocity has a non-zero magnitude, the body will be awakened.
 * The function will return early if the body state cannot be retrieved.
 */
export function b2Body_SetLinearVelocity(bodyId: b2BodyId, linearVelocity: b2Vec2): void;
/**
 * Sets the angular velocity of a body.
 * @function b2Body_SetAngularVelocity
 * @param {b2BodyId} bodyId - The identifier of the body to modify
 * @param {number} angularVelocity - The new angular velocity in radians per second
 * @returns {void}
 * @description
 * Sets the angular velocity of a body. If the body is static or has fixed rotation,
 * the function returns without making changes. The body is woken up if a non-zero
 * angular velocity is set.
 */
export function b2Body_SetAngularVelocity(bodyId: b2BodyId, angularVelocity: number): void;
/**
 * @function b2Body_ApplyForce
 * @description
 * Applies a force at a world point to a body. If the force is not applied at the
 * center of mass, it will generate a torque and affect angular motion.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the force to
 * @param {b2Vec2} force - The world force vector
 * @param {b2Vec2} point - The world position of the point of application
 * @param {boolean} wake - Whether to wake the body if it is sleeping
 * @returns {void}
 * @note The force is accumulated and applied during the next time step. The body
 * must be awake for the force to be applied.
 */
export function b2Body_ApplyForce(bodyId: b2BodyId, force: b2Vec2, point: b2Vec2, wake: boolean): void;
/**
 * @function b2Body_ApplyForceToCenter
 * @description
 * Applies a force to the center of mass of a body. If the body is sleeping, it can optionally be woken up.
 * The force is only applied if the body is in the awake set.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the force to
 * @param {b2Vec2} force - The world force vector to apply to the body's center
 * @param {boolean} wake - Whether to wake the body if it is sleeping
 * @returns {void}
 */
export function b2Body_ApplyForceToCenter(bodyId: b2BodyId, force: b2Vec2, wake: boolean): void;
/**
 * @function b2Body_ApplyTorque
 * @summary Applies a torque to a body.
 * @param {b2BodyId} bodyId - The identifier of the body to apply torque to
 * @param {number} torque - The amount of torque to apply
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @description
 * Adds the specified torque to the body's total torque. If the wake parameter
 * is true and the body is sleeping, it will be awakened. The torque is only
 * applied if the body is in the awake set.
 */
export function b2Body_ApplyTorque(bodyId: b2BodyId, torque: number, wake: boolean): void;
/**
 * @function b2Body_ApplyLinearImpulse
 * @description
 * Applies a linear impulse to a body at a specified world point, affecting both its linear
 * and angular velocities.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {b2Vec2} impulse - The world impulse vector to apply
 * @param {b2Vec2} point - The world position where the impulse is applied
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @throws {Error} Throws an assertion error if the body's local index is invalid
 */
export function b2Body_ApplyLinearImpulse(bodyId: b2BodyId, impulse: b2Vec2, point: b2Vec2, wake: boolean): void;
/**
 * @function b2Body_ApplyLinearImpulseToCenter
 * @description
 * Applies a linear impulse to the center of mass of a body. If the body is sleeping,
 * it can optionally be woken up.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {b2Vec2} impulse - The linear impulse vector to be applied
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @note The impulse is applied immediately, changing the body's linear velocity based
 * on its mass and the magnitude/direction of the impulse.
 */
export function b2Body_ApplyLinearImpulseToCenter(bodyId: b2BodyId, impulse: b2Vec2, wake: boolean): void;
/**
 * @function b2Body_ApplyAngularImpulse
 * @description
 * Applies an angular impulse to a body, affecting its angular velocity. The impulse is
 * scaled by the body's inverse inertia.
 * @param {b2BodyId} bodyId - The identifier of the body to apply the impulse to
 * @param {number} impulse - The angular impulse to apply
 * @param {boolean} wake - Whether to wake the body if it's sleeping
 * @returns {void}
 * @throws {Error} Throws an assertion error if the body ID is invalid or if the body
 * revision doesn't match
 */
export function b2Body_ApplyAngularImpulse(bodyId: b2BodyId, impulse: number, wake: boolean): void;
/**
 * Gets the type of a body in the physics world.
 * @function b2Body_GetType
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {b2BodyType} The type of the specified body.
 * @description
 * Retrieves the body type (static, kinematic, or dynamic) for a given body ID
 * by looking up the body in the physics world using the provided identifier.
 */
export function b2Body_GetType(bodyId: b2BodyId): {
    b2_staticBody: number;
    b2_kinematicBody: number;
    b2_dynamicBody: number;
    b2_bodyTypeCount: number;
};
/**
 * @function b2Body_SetType
 * @summary Changes the type of a body in the physics simulation.
 * @param {b2BodyId} bodyId - The ID of the body to modify
 * @param {b2BodyType} type - The new body type to set (static, kinematic, or dynamic)
 * @returns {void}
 * @description
 * Updates a body's type and handles all necessary simulation changes including:
 * - Destroying existing contacts
 * - Waking the body and connected bodies
 * - Unlinking and relinking joints
 * - Transferring the body between solver sets
 * - Updating broad-phase proxies
 * - Recalculating mass data
 * If the body is disabled or the type is unchanged, minimal processing occurs.
 * Special handling exists for transitions to/from static body type.
 */
export function b2Body_SetType(bodyId: b2BodyId, type: {
    b2_staticBody: number;
    b2_kinematicBody: number;
    b2_dynamicBody: number;
    b2_bodyTypeCount: number;
}): void;
/**
 * @summary Sets the user data associated with a body.
 * @function b2Body_SetUserData
 * @param {b2BodyId} bodyId - The identifier of the body to modify.
 * @param {*} userData - The user data to associate with the body.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a physics body. The user data can be
 * retrieved later and can be of any type. The body is located using its
 * world identifier and the user data is stored directly on the body object.
 */
export function b2Body_SetUserData(bodyId: b2BodyId, userData: any): void;
/**
 * @summary Gets the user data associated with a body.
 * @function b2Body_GetUserData
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {object} The user data associated with the body.
 * @description
 * Retrieves the custom user data that was previously attached to the specified body.
 * The function first gets the world from the body ID, then retrieves the full body
 * object, and finally returns its user data.
 */
export function b2Body_GetUserData(bodyId: b2BodyId): object;
/**
 * Gets the mass of a body.
 * @function b2Body_GetMass
 * @param {b2BodyId} bodyId - The identifier for the body whose mass is to be retrieved.
 * @returns {number} The mass of the body in kilograms.
 * @description
 * Retrieves the mass value from a body's simulation data by accessing the world
 * and body objects using the provided body identifier.
 */
export function b2Body_GetMass(bodyId: b2BodyId): number;
/**
 * Get the rotational inertia of the body, typically in kg*m^2
 * @function b2Body_GetRotationalInertia
 * @param {b2BodyId} bodyId - The ID of the body to get the inertia tensor from.
 * @returns {number} The inertia tensor value of the body.
 * @description
 * Retrieves the rotational inertia value from a body's simulation data using the body's ID.
 * The inertia tensor represents the body's resistance to rotational acceleration.
 */
export function b2Body_GetRotationalInertia(bodyId: b2BodyId): number;
/**
 * Gets the local center of mass for a body.
 * @function b2Body_GetLocalCenterOfMass
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {b2Vec2} The local center of mass position vector.
 * @description
 * Returns a copy of the body's local center of mass position vector.
 * The local center is expressed in the body's local coordinate system.
 */
export function b2Body_GetLocalCenterOfMass(bodyId: b2BodyId): b2Vec2;
/**
 * Gets the world position of a body's center of mass.
 * @function b2Body_GetWorldCenterOfMass
 * @param {b2BodyId} bodyId - The identifier for the body whose center of mass position is being queried.
 * @returns {b2Vec2} A vector representing the world position of the body's center of mass.
 * @description
 * Returns a copy of the body's center of mass position in world coordinates.
 * The returned vector is a clone of the internal state, preventing external
 * modification of the body's actual center position.
 */
export function b2Body_GetWorldCenterOfMass(bodyId: b2BodyId): b2Vec2;
/**
 * @function b2Body_SetMassData
 * @description
 * Sets the mass properties of a body including mass, rotational inertia, and center of mass.
 * The function updates both the primary mass properties and derived values like inverse mass.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {b2MassData} massData - An object containing:
 * - mass: The mass of the body (must be >= 0)
 * - rotationalInertia: The rotational inertia (must be >= 0)
 * - center: A b2Vec2 representing the local center of mass
 * @returns {void}
 * @throws {Error} Throws assertion error if mass or rotationalInertia are invalid or negative,
 * or if the center vector is invalid
 */
export function b2Body_SetMassData(bodyId: b2BodyId, massData: b2MassData): void;
/**
 * @function b2Body_GetMassData
 * @param {b2BodyId} bodyId - The identifier for the body whose mass data is being retrieved
 * @returns {b2MassData} An object containing mass properties:
 * - mass: The total mass of the body
 * - center: A b2Vec2 representing the local center of mass
 * - rotationalInertia: The rotational inertia about the local center of mass
 * @description
 * Retrieves the mass properties of a body, including its total mass,
 * center of mass position, and rotational inertia.
 */
export function b2Body_GetMassData(bodyId: b2BodyId): b2MassData;
/**
 * @function b2Body_ApplyMassFromShapes
 * @summary Updates a body's mass properties based on its attached shapes.
 * @param {b2BodyId} bodyId - The identifier for the body whose mass properties need to be updated.
 * @returns {void}
 * @description
 * This function retrieves the body from the world using its ID and updates its mass data
 * properties (mass, center of mass, and rotational inertia) based on the shapes attached to it.
 * If the world cannot be accessed, the function returns without performing any operations.
 */
export function b2Body_ApplyMassFromShapes(bodyId: b2BodyId): void;
/**
 * Sets the linear damping value for a body.
 * @function b2Body_SetLinearDamping
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} linearDamping - The new linear damping value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets the linear damping coefficient for a body, which reduces its linear velocity over time.
 * Linear damping is used to simulate air resistance or fluid friction.
 * @throws {Error} Throws an assertion error if linearDamping is invalid or negative.
 */
export function b2Body_SetLinearDamping(bodyId: b2BodyId, linearDamping: number): void;
/**
 * Gets the linear damping coefficient of a body.
 * @function b2Body_GetLinearDamping
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The linear damping coefficient of the body.
 * @description
 * Returns the linear damping coefficient that reduces the body's linear velocity.
 * Linear damping is used to reduce the linear velocity of the body in the absence
 * of forces. The damping parameter can be used to simulate fluid/air resistance.
 */
export function b2Body_GetLinearDamping(bodyId: b2BodyId): number;
/**
 * @summary Sets the angular damping value for a body.
 * @function b2Body_SetAngularDamping
 * @param {b2BodyId} bodyId - The identifier for the target body.
 * @param {number} angularDamping - The new angular damping value. Must be non-negative.
 * @returns {void}
 * @description
 * Sets the angular damping coefficient for a body, which reduces its angular velocity over time.
 * Angular damping is a value between 0 and infinity that reduces the body's angular velocity.
 * @throws {Error} Throws an assertion error if angularDamping is invalid or negative.
 */
export function b2Body_SetAngularDamping(bodyId: b2BodyId, angularDamping: number): void;
/**
 * Gets the angular damping coefficient of a body.
 * @function b2Body_GetAngularDamping
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The angular damping coefficient of the body.
 * @description
 * Returns the angular damping coefficient that reduces the body's angular velocity
 * over time. Angular damping is specified in the range [0,1].
 */
export function b2Body_GetAngularDamping(bodyId: b2BodyId): number;
/**
 * @function b2Body_SetGravityScale
 * @summary Sets the gravity scale factor for a body.
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} gravityScale - The scaling factor to apply to gravity for this body.
 * @returns {void}
 * @throws {Error} Throws an assertion error if bodyId is invalid or if gravityScale is not a valid number.
 * @description
 * Sets a scale factor that modifies the effect of gravity on a specific body.
 * A value of 1.0 indicates normal gravity, 0.0 indicates no gravity, and negative
 * values reverse the effect of gravity on the body.
 */
export function b2Body_SetGravityScale(bodyId: b2BodyId, gravityScale: number): void;
/**
 * Gets the gravity scale of a body.
 * @function b2Body_GetGravityScale
 * @param {b2BodyId} bodyId - The identifier of the body to query.
 * @returns {number} The gravity scale factor of the body.
 * @throws {Error} Throws an assertion error if the bodyId is invalid.
 */
export function b2Body_GetGravityScale(bodyId: b2BodyId): number;
/**
 * @summary Checks if a body is in the awake set.
 * @function b2Body_IsAwake
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is in the awake set, false otherwise.
 * @description
 * Determines if a body is currently in the awake set by checking its set index
 * against the b2_awakeSet type. Bodies in the awake set are actively participating
 * in the simulation.
 */
export function b2Body_IsAwake(bodyId: b2BodyId): boolean;
/**
 * @summary Sets the awake state of a physics body
 * @function b2Body_SetAwake
 * @param {b2BodyId} bodyId - The ID of the body to modify
 * @param {boolean} awake - True to wake the body, false to put it to sleep
 * @returns {void}
 * @description
 * Controls whether a physics body is awake (active) or asleep (inactive).
 * When setting a body to sleep, it will split islands if there are pending constraint removals.
 * When waking a body, it will be moved from the sleeping set to the awake set.
 */
export function b2Body_SetAwake(bodyId: b2BodyId, awake: boolean): void;
/**
 * @summary Checks if a body is enabled in the physics simulation.
 * @function b2Body_IsEnabled
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is enabled, false if disabled.
 * @description
 * Determines if a physics body is enabled by checking if it belongs to the
 * disabled set. A disabled body does not participate in collision detection
 * or dynamics simulation.
 */
export function b2Body_IsEnabled(bodyId: b2BodyId): boolean;
/**
 * @summary Checks if sleep is enabled for a body.
 * @function b2Body_IsSleepEnabled
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if sleep is enabled for the body, false otherwise.
 * @description
 * Returns whether the specified body has sleep enabled. When sleep is enabled,
 * the body can automatically enter a sleep state when it becomes inactive.
 */
export function b2Body_IsSleepEnabled(bodyId: b2BodyId): boolean;
/**
 * Sets the sleep threshold velocity for a body.
 * @function b2Body_SetSleepThreshold
 * @param {b2BodyId} bodyId - The identifier for the body to modify.
 * @param {number} sleepThreshold - The velocity threshold below which the body can sleep.
 * @returns {void}
 * @description
 * Sets the minimum velocity threshold that determines when a body can transition to a sleeping state.
 * When a body's velocity falls below this threshold, it becomes eligible for sleeping.
 */
export function b2Body_SetSleepThreshold(bodyId: b2BodyId, sleepThreshold: number): void;
/**
 * Gets the sleep threshold value for a body.
 * @function b2Body_GetSleepThreshold
 * @param {b2BodyId} bodyId - The identifier for the body.
 * @returns {number} The sleep threshold value for the body.
 * @description
 * Returns the minimum speed threshold below which a body can be put to sleep
 * to optimize simulation performance.
 */
export function b2Body_GetSleepThreshold(bodyId: b2BodyId): number;
/**
 * @function b2Body_EnableSleep
 * @description
 * Enables or disables sleep capability for a specific body. When sleep is disabled,
 * the body will be woken if it was sleeping.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {boolean} enableSleep - True to enable sleep capability, false to disable it
 * @returns {void}
 * @throws {Error} If the world associated with the bodyId is not found
 */
export function b2Body_EnableSleep(bodyId: b2BodyId, enableSleep: boolean): void;
/**
 * @function b2Body_Disable
 * @param {b2BodyId} bodyId - The identifier of the body to disable
 * @returns {void}
 * @description
 * Disables a body in the physics simulation by removing it from its current solver set
 * and moving it to the disabled set. The function removes all contacts associated with
 * the body, removes it from any island it belongs to, destroys shape proxies in the
 * broad phase, and transfers associated joints to the disabled set.
 * @throws {Error} Throws if the world is locked or invalid
 */
export function b2Body_Disable(bodyId: b2BodyId): void;
/**
 * @function b2Body_Enable
 * @description
 * Enables a previously disabled body in the physics world. When enabled, the body's
 * shapes are added to the broad-phase collision system, and its joints are
 * reconnected to the simulation. The body is moved from the disabled set to either
 * the static set or awake set based on its type.
 * @param {b2BodyId} bodyId - The identifier of the body to enable
 * @returns {void}
 * @throws {Error} Throws an assertion error if joint connectivity validation fails
 */
export function b2Body_Enable(bodyId: b2BodyId): void;
/**
 * @function b2Body_SetFixedRotation
 * @summary Sets whether a body should have fixed rotation.
 * @param {b2BodyId} bodyId - The identifier for the body to modify
 * @param {boolean} flag - True to fix the rotation, false to allow rotation
 * @returns {void}
 * @description
 * Sets the fixed rotation state of a body. When enabled, the body will not rotate
 * and any existing angular velocity is cleared. The body's mass data is updated
 * to reflect the change in rotational constraints.
 */
export function b2Body_SetFixedRotation(bodyId: b2BodyId, flag: boolean): void;
/**
 * @function b2Body_IsFixedRotation
 * @param {b2BodyId} bodyId - The identifier for the body to check
 * @returns {boolean} True if the body has fixed rotation enabled, false otherwise
 * @description
 * Checks whether a body has fixed rotation enabled. When fixed rotation is enabled,
 * the body will not rotate in response to torques or collisions.
 */
export function b2Body_IsFixedRotation(bodyId: b2BodyId): boolean;
/**
 * @function b2Body_SetBullet
 * @summary Sets the bullet flag on a physics body.
 * @param {b2BodyId} bodyId - The identifier for the physics body.
 * @param {boolean} flag - True to enable bullet mode, false to disable it.
 * @returns {void}
 * @description
 * Sets whether a body should be treated as a bullet for continuous collision detection.
 * Bullet bodies are designed for fast moving objects that require more precise
 * collision detection.
 */
export function b2Body_SetBullet(bodyId: b2BodyId, flag: boolean): void;
/**
 * @function b2Body_IsBullet
 * @summary Checks if a body has bullet status.
 * @param {b2BodyId} bodyId - The identifier for the body to check.
 * @returns {boolean} True if the body is a bullet, false otherwise.
 * @description
 * Retrieves the bullet status of a body from the physics simulation.
 * Bullet bodies undergo continuous collision detection for improved
 * accuracy with fast-moving objects.
 */
export function b2Body_IsBullet(bodyId: b2BodyId): boolean;
/**
 * @function b2Body_EnableHitEvents
 * @description
 * Enables or disables hit event detection for all shapes attached to a body.
 * @param {b2BodyId} bodyId - The identifier of the body to modify
 * @param {boolean} enableHitEvents - Whether to enable or disable hit events
 * @returns {void}
 */
export function b2Body_EnableHitEvents(bodyId: b2BodyId, enableHitEvents: boolean): void;
/**
 * @summary Gets the number of shapes attached to a body.
 * @function b2Body_GetShapeCount
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {number} The number of shapes attached to the body.
 * @description
 * Returns the total count of shapes currently attached to the specified body
 * in the physics world.
 */
export function b2Body_GetShapeCount(bodyId: b2BodyId): number;
/**
 * @function b2Body_GetShapes
 * @summary Gets all shapes attached to a body and returns the count.
 * @param {b2BodyId} bodyId - The identifier of the body to get shapes from.
 * @param {b2ShapeId[]} shapeArray - An array to store the retrieved shape IDs.
 * @returns {number} The number of shapes found on the body.
 * @description
 * Retrieves all shapes attached to the specified body by traversing the linked list
 * of shapes starting from the body's headShapeId. Each shape ID is stored in the
 * provided shapeArray and the total count is returned.
 * If shapeArray is already large enough we can avoid the overhead of growing the array.
 */
export function b2Body_GetShapes(bodyId: b2BodyId, shapeArray: b2ShapeId[]): number;
/**
 * @summary Gets the number of joints connected to a body.
 * @function b2Body_GetJointCount
 * @param {b2BodyId} bodyId - The identifier for the body to query.
 * @returns {number} The number of joints connected to the body.
 * @description
 * Returns the total count of joints that are connected to the specified body.
 */
export function b2Body_GetJointCount(bodyId: b2BodyId): number;
/**
 * @function b2Body_GetJoints
 * @summary Gets all joints connected to a body.
 * @param {b2BodyId} bodyId - The ID of the body to get joints for
 * @param {b2JointId[]} jointArray - Array to store the joint IDs
 * @param {number} capacity - Maximum number of joints to retrieve
 * @returns {number} The number of joints found and stored in jointArray
 * @description
 * Retrieves the IDs of all joints connected to the specified body, up to the given capacity.
 * The joint IDs are stored in the provided jointArray. The function traverses the body's
 * joint list and copies each joint's ID information including the index, world ID and revision.
 */
export function b2Body_GetJoints(bodyId: b2BodyId, jointArray: b2JointId[], capacity: number): number;
export function b2ShouldBodiesCollide(world: any, bodyA: any, bodyB: any): boolean;
export function resetProperties(obj: any): void;
import { b2BodyId } from './include/id_h.js';
import { b2AABB } from './include/math_functions_h.js';
import { b2Vec2 } from './include/math_functions_h.js';
import { b2Rot } from './include/math_functions_h.js';
import { b2MassData } from './include/collision_h.js';
import { b2ShapeId } from './include/id_h.js';
import { b2JointId } from './include/id_h.js';
