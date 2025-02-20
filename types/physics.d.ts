/**
 * Set the scale of the Box2D World when converting from pixels to meters.
 *
 * @export
 * @param {number} scale
 */
export function SetWorldScale(scale: number): void;
/**
 * Get the current scale of the Box2D World, as used when converting from pixels to meters.
 *
 * @export
 * @returns {number}
 */
export function GetWorldScale(): number;
/**
 * Converts a single numerical value from meters to pixels.
 *
 * @export
 * @param {number} meters
 * @returns {number}
 */
export function mpx(meters: number): number;
/**
 * Converts a single numerical value from pixels to meters.
 *
 * @export
 * @param {number} pixels
 * @returns {number}
 */
export function pxm(pixels: number): number;
/**
 * Converts the given x and y values from pixels to meters, stored in a new b2Vec2.
 *
 * @export
 * @param {number} x
 * @param {number} y
 * @returns {b2Vec2}
 */
export function pxmVec2(x: number, y: number): b2Vec2;
/**
 * Convets the given value in radians to a b2Rot object, used for Box2D rotations.
 *
 * @export
 * @param {number} radians
 * @returns {b2Rot}
 */
export function RotFromRad(radians: number): b2Rot;
/**
 * Adds a Sprite Game Object to the given World, attaching it to the given Body.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @param {b2Body} body
 */
export function AddSpriteToWorld(worldId: number, sprite: Sprite, body: b2Body): void;
/**
 * Removes a Sprite Game Object from the given World, optionally destroying the Body it was attached to.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @param {boolean} [destroyBody=false]
 */
export function RemoveSpriteFromWorld(worldId: number, sprite: Sprite, destroyBody?: boolean): void;
/**
 * Clears all Sprite to Body pairs.
 * Neither the Sprites nor the Bodies are destroyed.
 * The bodies remain in the world.
 *
 * @export
 * @param {number} worldId
 */
export function ClearWorldSprites(worldId: number): void;
/**
 * Returns the Body attached to the given Sprite in the given World.
 * Or `null` if no such pair exists.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @returns {Sprite|null} Either the sprite, or `null`.
 */
export function GetBodyFromSprite(worldId: number, sprite: Sprite): Sprite | null;
/**
 * Runs through all World-Sprite pairs and updates the Sprite positions and rotations to match the Body.
 *
 * @param {number} worldId
 */
export function UpdateWorldSprites(worldId: number): void;
/**
 * Converts a Box2D Body's position and rotation to a Sprite's position and rotation.
 *
 * This is called automatically by `UpdateWorldSprites`.
 * @export
 * @param {{ bodyId: { world0: number; }; }} body
 * @param {Sprite} sprite
 */
export function BodyToSprite(body: {
    bodyId: {
        world0: number;
    };
}, sprite: Sprite): void;
/**
 * @typedef {Object} Sprite
 * @property {number} x - The x position of the sprite.
 * @property {number} y - The y position of the sprite.
 * @property {number} width - The width of the sprite.
 * @property {number} height - The height of the sprite.
 * @property {number} rotation - The rotation of the sprite in radians.
 * @property {number} [scaleX] - Optional horizontal scale of the sprite.
 * @property {number} [scaleY] - Optional vertical scale of the sprite.
 * @property {b2Vec2} [scale] - Optional scale vector of the sprite.
 */
/**
 * Creates a box-shaped polygon and attaches it to a body based on the dimensions, position
 * and rotation of the given Sprite.
 *
 * @param {number} worldId - The World ID.
 * @param {Sprite} sprite - The Sprite object to read the data from.
 * @param {BoxPolygonConfig} data - Additional configuration for the box polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created box's body ID, shape ID, and object.
 * @memberof Physics
 */
export function SpriteToBox(worldId: number, sprite: Sprite, data: BoxPolygonConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * Creates a circle-shaped polygon and attaches it to a body based on the dimensions, position
 * and rotation of the given Sprite.
 *
 * @param {number} worldId - The World ID.
 * @param {Sprite} sprite - The Sprite object to read the data from.
 * @param {CircleConfig} data - Additional configuration for the circle.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Circle}} The created box's body ID, shape ID, and object.
 * @memberof Physics
 */
export function SpriteToCircle(worldId: number, sprite: Sprite, data: CircleConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Circle;
};
/**
 * @typedef {Object} WorldConfig
 * @property {b2WorldDef} [worldDef] - World definition
 */
/**
 * Creates a world and returns the ID.
 * @param {WorldConfig} data - Configuration for the world.
 * @returns {{worldId: b2WorldId}} The created world's ID.
 * @memberof Physics
 */
export function CreateWorld(data: WorldConfig): {
    worldId: b2WorldId;
};
/**
 * Steps a physics world to match fixedTimeStep.
 * Returns the average time spent in the step function.
 *
 * @param {WorldStepConfig} data - Configuration for the world.
 * @returns {number} totalTime - Time spent processing the step function, in seconds.
 */
export function WorldStep(data: WorldStepConfig): number;
/**
 * @typedef {Object} ChainConfig
 * @property {b2WorldId} worldId - ID for the world.
 * @property {b2BodyId} groundId - ID for the static ground to attach the chain ends to.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} firstLinkPosition - Position of the first link.
 * @property {b2Vec2} lastLinkPosition - Position of the last link.
 * @property {number} chainLinks - Number of links in the chain.
 * @property {number} linkLength - Length of each link
 * @property {number} [density] - Density of the links.
 * @property {number} [friction] - Friction of the links.
 * @property {any} [color] - Custom color for the links.
 * @property {number} [radius] - Radius for the circle 'caps' on each capsule link.
 * @property {boolean} fixEnds - Should the ends of the chain be fixed to the groundId object?
 */
/**
 * @typedef {Object} BodyCapsule
 * @property {b2BodyId} bodyId - ID for the body to attach the capsule to.
 * @property {b2ShapeId} shapeId - ID for the shape to attach the capsule to.
 * @property {b2Capsule} object - The capsule object to attach.
 */
/**
 * Creates a chain of capsules with each one linked to the previous and next one.
 * @param {ChainConfig} data - Configuration for the chain.
 * @returns {BodyCapsule[]} A list of each link's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateChain(data: ChainConfig): BodyCapsule[];
/**
 * @typedef {Object} CircleConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the circle.
 * @property {b2BodyDef} [bodyDef] - Body definition for the circle.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the circle's center.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the circle.
 * @property {number} [groupIndex] - Collision filtering, group index for the circle.
 * @property {number} [categoryBits] - Collision filtering, what 'category' is this cirle in?
 * @property {number} [maskBits] - Collision filtering, what 'categories' will this circle collide with?
 * @property {number} [density] - Density of the circle.
 * @property {number} [friction] - Friction of the circle.
 * @property {number} [restitution=0.1] - Restitution of the circle.
 * @property {any} [color] - Custom color for the circle.
 * @property {number} [radius] - Radius of the circle.
 * @property {boolean} [preSolve] - Enable presolve callback for the circle.
 * @property {boolean} [isSensor] - A sensor shape generates overlap events but never generates a collision response
 * @property {b2Vec2} [offset] - Offset of the circle's center when adding as a fixture.
 */
/**
 * Creates a circle shape and attaches it to a body.
 * @param {CircleConfig} data - Configuration for the circle.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Circle}} The created circle's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateCircle(data: CircleConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Circle;
};
/**
 * @typedef {Object} CapsuleConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the capsule.
 * @property {b2BodyDef} [bodyDef] - Body definition for the capsule.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the capsule's center.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the capsule.
 * @property {number} [density] - Density of the capsule.
 * @property {number} [friction] - Friction of the capsule.
 * @property {number} [groupIndex] - Collision group index for the capsule.
 * @property {number} [categoryBits] - Collision filtering, what 'category' is this in?
 * @property {number} [maskBits] - Collision filtering, what 'categories' will this collide with?
 * @property {any} [color] - Custom color for the capsule.
 * @property {b2Vec2} [center1] - Center of the first circle of the capsule. Optional if 'height' is set.
 * @property {b2Vec2} [center2] - Center of the second circle of the capsule. Optional if 'height' is set.
 * @property {number} [radius] - Radius of the capsule's circles. Optional if 'width' is set.
 * @property {boolean} [fixedRotation] - Prevent rotation if set to true.
 * @property {number} [linearDamping] - Linear damping of velocity.
 * @property {number} [width] - The overall width of the capsule. If set replaces radius.
 * @property {number} [height] - The overall height of the capsule, including the start and end caps. If set replaces center1 and center2.
 */
/**
 * Creates a capsule shape and attaches it to a body.
 * @param {CapsuleConfig} data - Configuration for the capsule.
 * @returns {BodyCapsule} The created capsule's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateCapsule(data: CapsuleConfig): BodyCapsule;
/**
 * @typedef {Object} BoxPolygonConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the box.
 * @property {b2BodyDef} [bodyDef] - Body definition for the box.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the box's center.
 * @property {boolean} [fixedRotation] - Prevent box from rotating?
 * @property {number} [linearDamping] - Damping for linear velocity.
 * @property {number} [angularDamping] - Damping for angular velocity.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the box.
 * @property {any} [userData] - The user data to associate with the body.
 * @property {number} [groupIndex] - Collision group index for the box.
 * @property {number} [categoryBits] - Collision filtering, what 'category' is this in?
 * @property {number} [maskBits] - Collision filtering, what 'categories' will this collide with?
 * @property {number} [density=1.0] - Density of the box.
 * @property {number} [friction=0.6] - Friction of the box.
 * @property {number} [restitution=0.1] - Restitution of the box.
 * @property {any} [color] - Custom color for the box.
 * @property {boolean} [preSolve] - Enable presolve callback for the circle.
 * @property {b2Vec2|number} size - Size of the box (either a b2Vec2 or a single number for square).
 */
/**
 * Creates a box-shaped polygon and attaches it to a body.
 * @param {BoxPolygonConfig} data - Configuration for the box polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created box's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateBoxPolygon(data: BoxPolygonConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * @typedef {Object} NGonPolygonConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the n-gon.
 * @property {b2BodyDef} [bodyDef] - Body definition for the n-gon.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the n-gon's center.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the n-gon.
 * @property {number} [groupIndex] - Collision group index for the n-gon.
 * @property {number} [density] - Density of the n-gon.
 * @property {number} [friction] - Friction of the n-gon.
 * @property {any} [color] - Custom color for the n-gon.
 * @property {number} radius - Radius of the n-gon.
 * @property {number} sides - Number of sides for the n-gon.
 */
/**
 * Creates a regular n-gon polygon and attaches it to a body.
 * @param {NGonPolygonConfig} data - Configuration for the n-gon polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created n-gon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateNGonPolygon(data: NGonPolygonConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * @typedef {Object} PolygonConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the polygon.
 * @property {b2BodyDef} [bodyDef] - Body definition for the polygon.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the polygon's center.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the polygon.
 * @property {number} [groupIndex] - Collision group index for the polygon.
 * @property {number} [density] - Density of the polygon.
 * @property {number} [friction] - Friction of the polygon.
 * @property {any} [color] - Custom color for the polygon.
 * @property {b2Vec2[]} vertices - List of vertices for the polygon.
 */
/**
 * Creates a polygon and attaches it to a body.
 * @param {PolygonConfig} data - Configuration for the polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePolygon(data: PolygonConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * @typedef {Object} PolygonVertexConfig
 * @property {b2WorldId} worldId - ID for the world in which to create the polygon.
 * @property {b2BodyDef} [bodyDef] - Body definition for the polygon.
 * @property {number} [type] - Type of the body (static, dynamic, kinematic).
 * @property {b2Vec2} [position] - Position of the polygon's center.
 * @property {b2BodyId} [bodyId] - Existing body ID if adding as a fixture.
 * @property {b2ShapeDef} [shapeDef] - Shape definition for the polygon.
 * @property {number} [groupIndex] - Collision group index for the polygon.
 * @property {number} [density] - Density of the polygon.
 * @property {number} [friction] - Friction of the polygon.
 * @property {number} [restitution=0.1] - Restitution of the polygon.
 * @property {any} [color] - Custom color for the polygon.
 * @property {number[][]} indices - List of indices to the vertices for the polygon.
 * @property {number[]} vertices - List of vertices for the polygon in number pairs [x0,y0, x1,y1, ... xN,yN].
 * @property {b2Vec2} vertexOffset - Offset to recenter the vertices if they are not zero based.
 * @property {b2Vec2} vertexScale - Scale for the vertices, defaults to 1, 1.
 * @property {string} [url] - URL location of the XML data file, if we're using one.
 * @property {string} [key] - Name 'key' to find the correct data in the XML.
 */
/**
 * Creates a polygon from Earcut CDT data and attaches it to a body.
 * @param {PolygonVertexConfig} data - Configuration for the polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePolygonFromEarcut(data: PolygonVertexConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * Creates a polygon from Vertex and Index data and attaches it to a body.
 * @param {PolygonVertexConfig} data - Configuration for the polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePolygonFromVertices(data: PolygonVertexConfig): {
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
};
/**
 * Creates a polygon from PhysicsEditor XML data and attaches it to a body.
 * It is recommended to prepare data with this _before_ the game loop starts; It is async and quite slow.
 * @param {PolygonVertexConfig} data - Configuration for the polygon.
 * @returns {Promise<{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}>} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePhysicsEditorShape(data: PolygonVertexConfig): Promise<{
    bodyId: b2BodyId;
    shapeId: b2ShapeId;
    object: b2Polygon;
}>;
/**
 * @typedef {Object} RevoluteJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2RevoluteJointDef} [jointDef] - A pre-existing b2RevoluteJointDef.
 * @property {b2BodyId} bodyIdA - The first body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second body to connect with this joint.
 * @property {b2Vec2} [anchorA] - Local position of the anchor point on the first body.
 * @property {b2Vec2} [anchorB] - Local position of the anchor point on the second body.
 * @property {number} [lowerAngle] - Lower limit of the joint's angle.
 * @property {number} [upperAngle] - Upper limit of the joint's angle.
 * @property {boolean} [enableLimit] - Whether to enable angle limits.
 * @property {boolean} [enableMotor] - Whether to enable the joint's motor.
 * @property {number} [motorSpeed] - The desired motor speed.
 * @property {number} [maxMotorTorque] - The maximum torque the motor can apply.
 * @property {boolean} [enableSpring] - Whether to enable the joint's spring.
 * @property {number} [hertz] - The frequency of the joint's spring.
 * @property {number} [dampingRatio] - The damping ratio of the joint's spring.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 * @property {number} [drawSize] - The size to use when drawing the joint.
 */
/**
 * Creates a revolute joint between two bodies.
 * @param {RevoluteJointConfig} data - Configuration for the revolute joint.
 * @returns {{jointId: b2JointId}} The ID of the created revolute joint.
 * @memberof Physics
 */
export function CreateRevoluteJoint(data: RevoluteJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} WeldJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2WeldJointDef} [jointDef] - A pre-existing b2WeldJointDef.
 * @property {b2BodyId} bodyIdA - The first body to weld with this joint.
 * @property {b2BodyId} bodyIdB - The second body to weld with this joint.
 * @property {b2Vec2} [anchorA] - Local position of the anchor point on the first body.
 * @property {b2Vec2} [anchorB] - Local position of the anchor point on the second body.
 * @property {number} [hertz] - The frequency at which the weld joint is enforced.
 * @property {number} [dampingRatio] - The angular damping ratio when the weld joint is springing back into alignment.
 * @property {number} [referenceAngle] - Reference angle for the weld joint at rest.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 */
/**
 * Creates a weld joint between two bodies.
 * @param {WeldJointConfig} data - Configuration for the weld joint.
 * @returns {{jointId: b2JointId}} The ID of the created weld joint.
 * @memberof Physics
 */
export function CreateWeldJoint(data: WeldJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} DistanceJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2DistanceJointDef} [jointDef] - A pre-existing b2DistanceJointDef.
 * @property {b2BodyId} bodyIdA - The first body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second body to connect with this joint.
 * @property {b2Vec2} [anchorA] - Local position of the anchor point on the first body.
 * @property {b2Vec2} [anchorB] - Local position of the anchor point on the second body.
 * @property {number} [length] - The natural length of the joint.
 * @property {number} [minLength] - The minimum allowed length of the joint.
 * @property {number} [maxLength] - The maximum allowed length of the joint.
 * @property {boolean} [enableSpring] - Whether to enable the joint's spring.
 * @property {number} [hertz] - The frequency of the joint's spring.
 * @property {number} [dampingRatio] - The damping ratio of the joint's spring.
 * @property {boolean} [enableLimit] - Whether to enable length limits.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 */
/**
 * Creates a distance joint between two bodies.
 * @param {DistanceJointConfig} data - Configuration for the distance joint.
 * @returns {{jointId: b2JointId}} The ID of the created distance joint.
 * @memberof Physics
 */
export function CreateDistanceJoint(data: DistanceJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} WheelJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2WheelJointDef} [jointDef] - A pre-existing b2WheelJointDef.
 * @property {b2BodyId} bodyIdA - The first body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second body to connect with this joint.
 * @property {b2Vec2} [anchorA] - Local position of the anchor point on the first body.
 * @property {b2Vec2} [anchorB] - Local position of the anchor point on the second body.
 * @property {boolean} [enableSpring] - Whether to enable the joint's spring.
 * @property {b2Vec2} [axis] - The local axis for the joint movement on body A.
 * @property {number} [hertz] - The frequency of the joint's spring.
 * @property {number} [dampingRatio] - The damping ratio of the joint's spring.
 * @property {boolean} [enableLimit] - Whether to enable translation limits.
 * @property {number} [lowerTranslation] - The lower translation limit.
 * @property {number} [upperTranslation] - The upper translation limit.
 * @property {boolean} [enableMotor] - Whether to enable the joint's motor.
 * @property {number} [maxMotorTorque] - The maximum torque the motor can apply.
 * @property {number} [motorSpeed] - The desired motor speed.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 */
/**
 * Creates a wheel joint between two bodies.
 * @param {WheelJointConfig} data - Configuration for the wheel joint.
 * @returns {{jointId: b2JointId}} The ID of the created wheel joint.
 * @memberof Physics
 */
export function CreateWheelJoint(data: WheelJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} PrismaticJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2PrismaticJointDef} [jointDef] - A pre-existing b2PrismaticJointDef.
 * @property {b2BodyId} bodyIdA - The first body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second body to connect with this joint.
 * @property {b2Vec2} [anchorA] - Local position of the anchor point on the first body.
 * @property {b2Vec2} [anchorB] - Local position of the anchor point on the second body.
 * @property {b2Vec2} [axis] - The local axis for the joint movement on body A.
 * @property {number} [referenceAngle] - The reference angle between the bodies.
 * @property {boolean} [enableSpring] - Whether to enable the joint's spring.
 * @property {number} [hertz] - The frequency of the joint's spring.
 * @property {number} [dampingRatio] - The damping ratio of the joint's spring.
 * @property {boolean} [enableLimit] - Whether to enable translation limits.
 * @property {number} [lowerTranslation] - The lower translation limit.
 * @property {number} [upperTranslation] - The upper translation limit.
 * @property {boolean} [enableMotor] - Whether to enable the joint's motor.
 * @property {number} [maxMotorForce] - The maximum force the motor can apply.
 * @property {number} [motorSpeed] - The desired motor speed.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 */
/**
 * Creates a prismatic joint between two bodies.
 * @param {PrismaticJointConfig} data - Configuration for the prismatic joint.
 * @returns {{jointId: b2JointId}} The ID of the created prismatic joint.
 * @memberof Physics
 */
export function CreatePrismaticJoint(data: PrismaticJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} MotorJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2MotorJointDef} [jointDef] - A pre-existing b2MotorJointDef.
 * @property {b2BodyId} bodyIdA - The first body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second body to connect with this joint.
 * @property {b2Vec2} [linearOffset] - The desired linear offset in frame A.
 * @property {number} [maxForce] - The maximum force that can be applied to reach the target offsets.
 * @property {number} [angularOffset] - The desired angular offset.
 * @property {number} [maxTorque] - The maximum torque that can be applied to reach the target angular offset.
 * @property {number} [correctionFactor] - Position correction factor in the range [0,1].
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 */
/**
 * Creates a motor joint between two bodies.
 * @param {MotorJointConfig} data - Configuration for the motor joint.
 * @returns {{jointId: b2JointId}} The ID of the created motor joint.
 * @memberof Physics
 */
export function CreateMotorJoint(data: MotorJointConfig): {
    jointId: b2JointId;
};
/**
 * @typedef {Object} MouseJointConfig
 * @property {b2WorldId} worldId - ID for the world in which the bodies and joint exist.
 * @property {b2MouseJointDef} [jointDef] - A pre-existing b2MouseJointDef.
 * @property {b2BodyId} bodyIdA - The first (usually static) body to connect with this joint.
 * @property {b2BodyId} bodyIdB - The second (usually dynamic) body to connect with this joint.
 * @property {b2Vec2} [target] - The initial world target point.
 * @property {number} [hertz] - The response frequency.
 * @property {number} [dampingRatio] - The damping ratio.
 * @property {number} [maxForce] - The maximum force that can be exerted to reach the target point.
 * @property {boolean} [collideConnected] - Whether the connected bodies should collide.
 * e.g. worldId:worldId, bodyIdA:mouseCircle.bodyId, bodyIdB:mouseBox.bodyId, target:new b2Vec2(0, 0), hertz:30.0, dampingRatio:0.999, maxForce:35000
 */
/**
 * Creates a mouse joint between two bodies.
 * @param {MouseJointConfig} data - Configuration for the mouse joint.
 * @returns {{jointId: b2JointId}} The ID of the created mouse joint.
 * @memberof Physics
 */
export function CreateMouseJoint(data: MouseJointConfig): {
    jointId: b2JointId;
};
export const WorldSprites: any;
export type Sprite = {
    /**
     * - The x position of the sprite.
     */
    x: number;
    /**
     * - The y position of the sprite.
     */
    y: number;
    /**
     * - The width of the sprite.
     */
    width: number;
    /**
     * - The height of the sprite.
     */
    height: number;
    /**
     * - The rotation of the sprite in radians.
     */
    rotation: number;
    /**
     * - Optional horizontal scale of the sprite.
     */
    scaleX?: number;
    /**
     * - Optional vertical scale of the sprite.
     */
    scaleY?: number;
    /**
     * - Optional scale vector of the sprite.
     */
    scale?: b2Vec2;
};
export type WorldConfig = {
    /**
     * - World definition
     */
    worldDef?: b2WorldDef;
};
export type ChainConfig = {
    /**
     * - ID for the world.
     */
    worldId: b2WorldId;
    /**
     * - ID for the static ground to attach the chain ends to.
     */
    groundId: b2BodyId;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the first link.
     */
    firstLinkPosition: b2Vec2;
    /**
     * - Position of the last link.
     */
    lastLinkPosition: b2Vec2;
    /**
     * - Number of links in the chain.
     */
    chainLinks: number;
    /**
     * - Length of each link
     */
    linkLength: number;
    /**
     * - Density of the links.
     */
    density?: number;
    /**
     * - Friction of the links.
     */
    friction?: number;
    /**
     * - Custom color for the links.
     */
    color?: any;
    /**
     * - Radius for the circle 'caps' on each capsule link.
     */
    radius?: number;
    /**
     * - Should the ends of the chain be fixed to the groundId object?
     */
    fixEnds: boolean;
};
export type BodyCapsule = {
    /**
     * - ID for the body to attach the capsule to.
     */
    bodyId: b2BodyId;
    /**
     * - ID for the shape to attach the capsule to.
     */
    shapeId: b2ShapeId;
    /**
     * - The capsule object to attach.
     */
    object: b2Capsule;
};
export type CircleConfig = {
    /**
     * - ID for the world in which to create the circle.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the circle.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the circle's center.
     */
    position?: b2Vec2;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the circle.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - Collision filtering, group index for the circle.
     */
    groupIndex?: number;
    /**
     * - Collision filtering, what 'category' is this cirle in?
     */
    categoryBits?: number;
    /**
     * - Collision filtering, what 'categories' will this circle collide with?
     */
    maskBits?: number;
    /**
     * - Density of the circle.
     */
    density?: number;
    /**
     * - Friction of the circle.
     */
    friction?: number;
    /**
     * - Restitution of the circle.
     */
    restitution?: number;
    /**
     * - Custom color for the circle.
     */
    color?: any;
    /**
     * - Radius of the circle.
     */
    radius?: number;
    /**
     * - Enable presolve callback for the circle.
     */
    preSolve?: boolean;
    /**
     * - A sensor shape generates overlap events but never generates a collision response
     */
    isSensor?: boolean;
    /**
     * - Offset of the circle's center when adding as a fixture.
     */
    offset?: b2Vec2;
};
export type CapsuleConfig = {
    /**
     * - ID for the world in which to create the capsule.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the capsule.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the capsule's center.
     */
    position?: b2Vec2;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the capsule.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - Density of the capsule.
     */
    density?: number;
    /**
     * - Friction of the capsule.
     */
    friction?: number;
    /**
     * - Collision group index for the capsule.
     */
    groupIndex?: number;
    /**
     * - Collision filtering, what 'category' is this in?
     */
    categoryBits?: number;
    /**
     * - Collision filtering, what 'categories' will this collide with?
     */
    maskBits?: number;
    /**
     * - Custom color for the capsule.
     */
    color?: any;
    /**
     * - Center of the first circle of the capsule. Optional if 'height' is set.
     */
    center1?: b2Vec2;
    /**
     * - Center of the second circle of the capsule. Optional if 'height' is set.
     */
    center2?: b2Vec2;
    /**
     * - Radius of the capsule's circles. Optional if 'width' is set.
     */
    radius?: number;
    /**
     * - Prevent rotation if set to true.
     */
    fixedRotation?: boolean;
    /**
     * - Linear damping of velocity.
     */
    linearDamping?: number;
    /**
     * - The overall width of the capsule. If set replaces radius.
     */
    width?: number;
    /**
     * - The overall height of the capsule, including the start and end caps. If set replaces center1 and center2.
     */
    height?: number;
};
export type BoxPolygonConfig = {
    /**
     * - ID for the world in which to create the box.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the box.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the box's center.
     */
    position?: b2Vec2;
    /**
     * - Prevent box from rotating?
     */
    fixedRotation?: boolean;
    /**
     * - Damping for linear velocity.
     */
    linearDamping?: number;
    /**
     * - Damping for angular velocity.
     */
    angularDamping?: number;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the box.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - The user data to associate with the body.
     */
    userData?: any;
    /**
     * - Collision group index for the box.
     */
    groupIndex?: number;
    /**
     * - Collision filtering, what 'category' is this in?
     */
    categoryBits?: number;
    /**
     * - Collision filtering, what 'categories' will this collide with?
     */
    maskBits?: number;
    /**
     * - Density of the box.
     */
    density?: number;
    /**
     * - Friction of the box.
     */
    friction?: number;
    /**
     * - Restitution of the box.
     */
    restitution?: number;
    /**
     * - Custom color for the box.
     */
    color?: any;
    /**
     * - Enable presolve callback for the circle.
     */
    preSolve?: boolean;
    /**
     * - Size of the box (either a b2Vec2 or a single number for square).
     */
    size: b2Vec2 | number;
};
export type NGonPolygonConfig = {
    /**
     * - ID for the world in which to create the n-gon.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the n-gon.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the n-gon's center.
     */
    position?: b2Vec2;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the n-gon.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - Collision group index for the n-gon.
     */
    groupIndex?: number;
    /**
     * - Density of the n-gon.
     */
    density?: number;
    /**
     * - Friction of the n-gon.
     */
    friction?: number;
    /**
     * - Custom color for the n-gon.
     */
    color?: any;
    /**
     * - Radius of the n-gon.
     */
    radius: number;
    /**
     * - Number of sides for the n-gon.
     */
    sides: number;
};
export type PolygonConfig = {
    /**
     * - ID for the world in which to create the polygon.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the polygon.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the polygon's center.
     */
    position?: b2Vec2;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the polygon.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - Collision group index for the polygon.
     */
    groupIndex?: number;
    /**
     * - Density of the polygon.
     */
    density?: number;
    /**
     * - Friction of the polygon.
     */
    friction?: number;
    /**
     * - Custom color for the polygon.
     */
    color?: any;
    /**
     * - List of vertices for the polygon.
     */
    vertices: b2Vec2[];
};
export type PolygonVertexConfig = {
    /**
     * - ID for the world in which to create the polygon.
     */
    worldId: b2WorldId;
    /**
     * - Body definition for the polygon.
     */
    bodyDef?: b2BodyDef;
    /**
     * - Type of the body (static, dynamic, kinematic).
     */
    type?: number;
    /**
     * - Position of the polygon's center.
     */
    position?: b2Vec2;
    /**
     * - Existing body ID if adding as a fixture.
     */
    bodyId?: b2BodyId;
    /**
     * - Shape definition for the polygon.
     */
    shapeDef?: b2ShapeDef;
    /**
     * - Collision group index for the polygon.
     */
    groupIndex?: number;
    /**
     * - Density of the polygon.
     */
    density?: number;
    /**
     * - Friction of the polygon.
     */
    friction?: number;
    /**
     * - Restitution of the polygon.
     */
    restitution?: number;
    /**
     * - Custom color for the polygon.
     */
    color?: any;
    /**
     * - List of indices to the vertices for the polygon.
     */
    indices: number[][];
    /**
     * - List of vertices for the polygon in number pairs [x0,y0, x1,y1, ... xN,yN].
     */
    vertices: number[];
    /**
     * - Offset to recenter the vertices if they are not zero based.
     */
    vertexOffset: b2Vec2;
    /**
     * - Scale for the vertices, defaults to 1, 1.
     */
    vertexScale: b2Vec2;
    /**
     * - URL location of the XML data file, if we're using one.
     */
    url?: string;
    /**
     * - Name 'key' to find the correct data in the XML.
     */
    key?: string;
};
export type RevoluteJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2RevoluteJointDef.
     */
    jointDef?: b2RevoluteJointDef;
    /**
     * - The first body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - Local position of the anchor point on the first body.
     */
    anchorA?: b2Vec2;
    /**
     * - Local position of the anchor point on the second body.
     */
    anchorB?: b2Vec2;
    /**
     * - Lower limit of the joint's angle.
     */
    lowerAngle?: number;
    /**
     * - Upper limit of the joint's angle.
     */
    upperAngle?: number;
    /**
     * - Whether to enable angle limits.
     */
    enableLimit?: boolean;
    /**
     * - Whether to enable the joint's motor.
     */
    enableMotor?: boolean;
    /**
     * - The desired motor speed.
     */
    motorSpeed?: number;
    /**
     * - The maximum torque the motor can apply.
     */
    maxMotorTorque?: number;
    /**
     * - Whether to enable the joint's spring.
     */
    enableSpring?: boolean;
    /**
     * - The frequency of the joint's spring.
     */
    hertz?: number;
    /**
     * - The damping ratio of the joint's spring.
     */
    dampingRatio?: number;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
    /**
     * - The size to use when drawing the joint.
     */
    drawSize?: number;
};
export type WeldJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2WeldJointDef.
     */
    jointDef?: b2WeldJointDef;
    /**
     * - The first body to weld with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to weld with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - Local position of the anchor point on the first body.
     */
    anchorA?: b2Vec2;
    /**
     * - Local position of the anchor point on the second body.
     */
    anchorB?: b2Vec2;
    /**
     * - The frequency at which the weld joint is enforced.
     */
    hertz?: number;
    /**
     * - The angular damping ratio when the weld joint is springing back into alignment.
     */
    dampingRatio?: number;
    /**
     * - Reference angle for the weld joint at rest.
     */
    referenceAngle?: number;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
};
export type DistanceJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2DistanceJointDef.
     */
    jointDef?: b2DistanceJointDef;
    /**
     * - The first body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - Local position of the anchor point on the first body.
     */
    anchorA?: b2Vec2;
    /**
     * - Local position of the anchor point on the second body.
     */
    anchorB?: b2Vec2;
    /**
     * - The natural length of the joint.
     */
    length?: number;
    /**
     * - The minimum allowed length of the joint.
     */
    minLength?: number;
    /**
     * - The maximum allowed length of the joint.
     */
    maxLength?: number;
    /**
     * - Whether to enable the joint's spring.
     */
    enableSpring?: boolean;
    /**
     * - The frequency of the joint's spring.
     */
    hertz?: number;
    /**
     * - The damping ratio of the joint's spring.
     */
    dampingRatio?: number;
    /**
     * - Whether to enable length limits.
     */
    enableLimit?: boolean;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
};
export type WheelJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2WheelJointDef.
     */
    jointDef?: b2WheelJointDef;
    /**
     * - The first body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - Local position of the anchor point on the first body.
     */
    anchorA?: b2Vec2;
    /**
     * - Local position of the anchor point on the second body.
     */
    anchorB?: b2Vec2;
    /**
     * - Whether to enable the joint's spring.
     */
    enableSpring?: boolean;
    /**
     * - The local axis for the joint movement on body A.
     */
    axis?: b2Vec2;
    /**
     * - The frequency of the joint's spring.
     */
    hertz?: number;
    /**
     * - The damping ratio of the joint's spring.
     */
    dampingRatio?: number;
    /**
     * - Whether to enable translation limits.
     */
    enableLimit?: boolean;
    /**
     * - The lower translation limit.
     */
    lowerTranslation?: number;
    /**
     * - The upper translation limit.
     */
    upperTranslation?: number;
    /**
     * - Whether to enable the joint's motor.
     */
    enableMotor?: boolean;
    /**
     * - The maximum torque the motor can apply.
     */
    maxMotorTorque?: number;
    /**
     * - The desired motor speed.
     */
    motorSpeed?: number;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
};
export type PrismaticJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2PrismaticJointDef.
     */
    jointDef?: b2PrismaticJointDef;
    /**
     * - The first body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - Local position of the anchor point on the first body.
     */
    anchorA?: b2Vec2;
    /**
     * - Local position of the anchor point on the second body.
     */
    anchorB?: b2Vec2;
    /**
     * - The local axis for the joint movement on body A.
     */
    axis?: b2Vec2;
    /**
     * - The reference angle between the bodies.
     */
    referenceAngle?: number;
    /**
     * - Whether to enable the joint's spring.
     */
    enableSpring?: boolean;
    /**
     * - The frequency of the joint's spring.
     */
    hertz?: number;
    /**
     * - The damping ratio of the joint's spring.
     */
    dampingRatio?: number;
    /**
     * - Whether to enable translation limits.
     */
    enableLimit?: boolean;
    /**
     * - The lower translation limit.
     */
    lowerTranslation?: number;
    /**
     * - The upper translation limit.
     */
    upperTranslation?: number;
    /**
     * - Whether to enable the joint's motor.
     */
    enableMotor?: boolean;
    /**
     * - The maximum force the motor can apply.
     */
    maxMotorForce?: number;
    /**
     * - The desired motor speed.
     */
    motorSpeed?: number;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
};
export type MotorJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2MotorJointDef.
     */
    jointDef?: b2MotorJointDef;
    /**
     * - The first body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - The desired linear offset in frame A.
     */
    linearOffset?: b2Vec2;
    /**
     * - The maximum force that can be applied to reach the target offsets.
     */
    maxForce?: number;
    /**
     * - The desired angular offset.
     */
    angularOffset?: number;
    /**
     * - The maximum torque that can be applied to reach the target angular offset.
     */
    maxTorque?: number;
    /**
     * - Position correction factor in the range [0,1].
     */
    correctionFactor?: number;
    /**
     * - Whether the connected bodies should collide.
     */
    collideConnected?: boolean;
};
export type MouseJointConfig = {
    /**
     * - ID for the world in which the bodies and joint exist.
     */
    worldId: b2WorldId;
    /**
     * - A pre-existing b2MouseJointDef.
     */
    jointDef?: b2MouseJointDef;
    /**
     * - The first (usually static) body to connect with this joint.
     */
    bodyIdA: b2BodyId;
    /**
     * - The second (usually dynamic) body to connect with this joint.
     */
    bodyIdB: b2BodyId;
    /**
     * - The initial world target point.
     */
    target?: b2Vec2;
    /**
     * - The response frequency.
     */
    hertz?: number;
    /**
     * - The damping ratio.
     */
    dampingRatio?: number;
    /**
     * - The maximum force that can be exerted to reach the target point.
     */
    maxForce?: number;
    /**
     * - Whether the connected bodies should collide.
     * e.g. worldId:worldId, bodyIdA:mouseCircle.bodyId, bodyIdB:mouseBox.bodyId, target:new b2Vec2(0, 0), hertz:30.0, dampingRatio:0.999, maxForce:35000
     */
    collideConnected?: boolean;
};
export type WorldStepConfig = {
    /**
     * - The world ID value
     */
    worldId: b2WorldId;
    /**
     * - How long has it been since the last call (e.g. the value passed to a RAF update)
     */
    deltaTime: number;
    /**
     * - Duration of the fixed timestep for the Physics simulation
     */
    fixedTimeStep?: number;
    /**
     * - Number of sub-steps performed per world step
     */
    subStepCount?: number;
};
import { b2Vec2 } from './include/math_functions_h.js';
import { b2Rot } from './include/math_functions_h.js';
import type { b2Body } from './include/body_h.js';
import type { b2BodyId } from './include/id_h.js';
import type { b2ShapeId } from './include/id_h.js';
import type { b2Polygon } from './include/collision_h.js';
import { b2Circle } from './include/collision_h.js';
import type { b2WorldId } from './include/id_h.js';
import type { b2JointId } from './include/id_h.js';
import type { b2WorldDef } from './include/types_h.js';
import { b2Capsule } from './include/collision_h.js';
import type { b2BodyDef } from './include/types_h.js';
import type { b2ShapeDef } from './include/types_h.js';
import { b2RevoluteJointDef } from './include/types_h.js';
import { b2WeldJointDef } from './include/types_h.js';
import { b2DistanceJointDef } from './include/types_h.js';
import { b2WheelJointDef } from './include/types_h.js';
import { b2PrismaticJointDef } from './include/types_h.js';
import { b2MotorJointDef } from './include/types_h.js';
import { b2MouseJointDef } from './include/types_h.js';
