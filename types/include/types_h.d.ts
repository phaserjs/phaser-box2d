export namespace b2BodyType {
    let b2_staticBody: number;
    let b2_kinematicBody: number;
    let b2_dynamicBody: number;
    let b2_bodyTypeCount: number;
}
export namespace b2ShapeType {
    let b2_circleShape: number;
    let b2_capsuleShape: number;
    let b2_segmentShape: number;
    let b2_polygonShape: number;
    let b2_chainSegmentShape: number;
    let b2_shapeTypeCount: number;
}
export namespace b2JointType {
    let b2_distanceJoint: number;
    let b2_motorJoint: number;
    let b2_mouseJoint: number;
    let b2_prismaticJoint: number;
    let b2_revoluteJoint: number;
    let b2_weldJoint: number;
    let b2_wheelJoint: number;
    let b2_unknown: number;
}
/**
 * Result from b2World_RayCastClosest
 * @class b2RayResult
 * @property {b2ShapeId} shapeId - The shape that was hit
 * @property {b2Vec2} point - The hit point
 * @property {b2Vec2} normal - The hit normal
 * @property {number} fraction - The hit fraction along the ray
 * @property {number} nodeVisits - Number of tree nodes visited
 * @property {number} leafVisits - Number of tree leaves visited
 * @property {boolean} hit - Whether the ray hit anything
 */
export class b2RayResult {
    shapeId: any;
    point: b2Vec2;
    normal: b2Vec2;
    fraction: number;
    hit: boolean;
}
/**
 * @class b2WorldDef
 * @summary World definition used to create a simulation world. Must be initialized using b2DefaultWorldDef().
 * @property {b2Vec2} gravity - Gravity vector. Box2D has no up-vector defined.
 * @property {number} restitutionThreshold - Restitution velocity threshold, usually in m/s. Collisions above this speed have restitution applied (will bounce).
 * @property {number} contactPushoutVelocity - This parameter controls how fast overlap is resolved and has units of meters per second
 * @property {number} hitEventThreshold - Threshold velocity for hit events. Usually meters per second.
 * @property {number} contactHertz - Contact stiffness. Cycles per second.
 * @property {number} contactDampingRatio - Contact bounciness. Non-dimensional.
 * @property {number} jointHertz - Joint stiffness. Cycles per second.
 * @property {number} jointDampingRatio - Joint bounciness. Non-dimensional.
 * @property {number} maximumLinearVelocity - Maximum linear velocity. Usually meters per second.
 * @property {b2MixingRule} frictionMixingRule - Mixing rule for friction. Default is b2_mixGeometricMean.
 * @property {b2MixingRule} restitutionMixingRule - Mixing rule for restitution. Default is b2_mixMaximum.
 * @property {boolean} enableSleep - Can bodies go to sleep to improve performance
 * @property {boolean} enableContinuous - Enable continuous collision
 * @property {number} workerCount - Number of workers to use with the provided task system.
 * @property {Function} enqueueTask - Function to spawn tasks
 * @property {Function} finishTask - Function to finish a task
 * @property {*} userTaskContext - User context that is provided to enqueueTask and finishTask
 * @property {*} userData - User data
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2WorldDef {
    gravity: b2Vec2;
    restitutionThreshold: number;
    contactPushoutVelocity: number;
    hitEventThreshold: number;
    contactHertz: number;
    contactDampingRatio: number;
    jointHertz: number;
    jointDampingRatio: number;
    maximumLinearVelocity: number;
    enableSleep: boolean;
    enableContinuous: boolean;
    workerCount: number;
}
/**
 * @class b2BodyDef
 * @summary Definition used to construct a rigid body
 * @property {b2BodyType} type - The body type: static, kinematic, or dynamic
 * @property {b2Vec2} position - The initial world position of the body
 * @property {b2Rot} rotation - The initial world rotation of the body
 * @property {b2Vec2} linearVelocity - The initial linear velocity in meters per second
 * @property {number} angularVelocity - The initial angular velocity in radians per second
 * @property {number} linearDamping - Linear damping to reduce linear velocity
 * @property {number} angularDamping - Angular damping to reduce angular velocity
 * @property {number} gravityScale - Scale factor applied to gravity for this body
 * @property {number} sleepThreshold - Sleep velocity threshold, default 0.05 m/s
 * @property {*} userData - Application specific body data
 * @property {boolean} enableSleep - Whether this body can fall asleep
 * @property {boolean} isAwake - Whether body starts awake or sleeping
 * @property {boolean} fixedRotation - Whether to prevent rotation
 * @property {boolean} isBullet - Whether to use continuous collision detection
 * @property {boolean} isEnabled - Whether body can move and collide
 * @property {boolean} allowFastRotation - Whether to bypass rotation speed limits
 * @property {number} internalValue - Internal validation flag
 */
export class b2BodyDef {
    type: number;
    position: b2Vec2;
    rotation: b2Rot;
    linearVelocity: b2Vec2;
    angularVelocity: number;
    linearDamping: number;
    angularDamping: number;
    gravityScale: number;
    sleepThreshold: number;
    userData: any;
    enableSleep: boolean;
    isAwake: boolean;
    fixedRotation: boolean;
    isBullet: boolean;
    isEnabled: boolean;
    updateBodyMass: boolean;
    allowFastRotation: boolean;
}
/**
 * @class b2ShapeDef
 * @summary Used to create a shape. This is a temporary object used to bundle shape creation parameters.
 * You may use the same shape definition to create multiple shapes.
 * Must be initialized using b2DefaultShapeDef().
 * @property {*} userData - Use this to store application specific shape data
 * @property {number} friction - The Coulomb (dry) friction coefficient, usually in the range [0,1]
 * @property {number} restitution - The restitution (bounce) usually in the range [0,1]
 * @property {number} density - The density, usually in kg/m^2
 * @property {b2Filter} filter - Collision filtering data
 * @property {number} customColor - Custom debug draw color
 * @property {boolean} isSensor - A sensor shape generates overlap events but never generates a collision response
 * @property {boolean} enableSensorEvents - Enable sensor events for this shape. Only applies to kinematic and dynamic bodies
 * @property {boolean} enableContactEvents - Enable contact events for this shape. Only applies to kinematic and dynamic bodies
 * @property {boolean} enableHitEvents - Enable hit events for this shape. Only applies to kinematic and dynamic bodies
 * @property {boolean} enablePreSolveEvents - Enable pre-solve contact events for this shape. Only applies to dynamic bodies
 * @property {boolean} invokeContactCreation - Override static body behavior to force contact creation
 * @property {boolean} updateBodyMass - Should the body update mass properties when shape is created
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET
 */
export class b2ShapeDef {
    userData: any;
    friction: number;
    restitution: number;
    density: number;
    filter: b2Filter;
    customColor: number;
    isSensor: boolean;
    enableSensorEvents: boolean;
    enableContactEvents: boolean;
    enableHitEvents: boolean;
    enablePreSolveEvents: boolean;
    forceContactCreation: boolean;
}
/**
 * @class b2ChainDef
 * @summary Definition for creating a chain of line segments. Designed for static bodies with one-sided collision detection.
 * @property {void} userData - Use this to store application specific shape data
 * @property {b2Vec2[]} points - Array of at least 4 points defining the chain segments
 * @property {number} count - The point count, must be 4 or more
 * @property {number} friction - The friction coefficient, usually in the range [0,1]
 * @property {number} restitution - The restitution (elasticity) usually in the range [0,1]
 * @property {b2Filter} filter - Contact filtering data
 * @property {number} customColor - Custom debug draw color
 * @property {boolean} isLoop - Indicates a closed chain formed by connecting first and last points
 * @property {number} internalValue - Used internally to detect valid definition. DO NOT SET
 */
export class b2ChainDef {
    userData: any;
    points: any;
    count: number;
    friction: number;
    restitution: number;
    filter: b2Filter;
    isLoop: boolean;
}
/**
 * @class b2DistanceJointDef
 * @summary Distance joint definition that connects two bodies with a specified distance between anchor points
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} localAnchorA - The local anchor point relative to bodyA's origin
 * @property {b2Vec2} localAnchorB - The local anchor point relative to bodyB's origin
 * @property {number} length - The rest length of this joint. Clamped to a stable minimum value.
 * @property {boolean} enableSpring - Enable the distance constraint to behave like a spring. If false then the distance joint will be rigid, overriding the limit and motor.
 * @property {number} hertz - The spring linear stiffness Hertz, cycles per second
 * @property {number} dampingRatio - The spring linear damping ratio, non-dimensional
 * @property {boolean} enableLimit - Enable/disable the joint limit
 * @property {number} minLength - Minimum length. Clamped to a stable minimum value.
 * @property {number} maxLength - Maximum length. Must be greater than or equal to the minimum length.
 * @property {boolean} enableMotor - Enable/disable the joint motor
 * @property {number} maxMotorForce - The maximum motor force, usually in newtons
 * @property {number} motorSpeed - The desired motor speed, usually in meters per second
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 * @description This requires defining an anchor point on both bodies and the non-zero distance of the distance joint. The definition uses local anchor points so that the initial configuration can violate the constraint slightly. This helps when saving and loading a game.
 */
export class b2DistanceJointDef {
    bodyIdA: any;
    bodyIdB: any;
    localAnchorA: b2Vec2;
    localAnchorB: b2Vec2;
    length: number;
    enableSpring: boolean;
    hertz: number;
    dampingRatio: number;
    enableLimit: boolean;
    minLength: number;
    maxLength: number;
    enableMotor: boolean;
    maxMotorForce: number;
    motorSpeed: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2MotorJointDef
 * @summary A motor joint controls relative motion between two bodies, typically used to control a dynamic body relative to ground
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} linearOffset - Position of bodyB minus the position of bodyA, in bodyA's frame
 * @property {number} angularOffset - The bodyB angle minus bodyA angle in radians
 * @property {number} maxForce - The maximum motor force in newtons
 * @property {number} maxTorque - The maximum motor torque in newton-meters
 * @property {number} correctionFactor - Position correction factor in the range [0,1]
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2MotorJointDef {
    bodyIdA: any;
    bodyIdB: any;
    linearOffset: b2Vec2;
    angularOffset: number;
    maxForce: number;
    maxTorque: number;
    correctionFactor: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2MouseJointDef
 * @summary Definition for a mouse joint that makes a point on a body track a world point
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} target - The initial target point in world space
 * @property {number} hertz - Stiffness in hertz
 * @property {number} dampingRatio - Damping ratio, non-dimensional
 * @property {number} maxForce - Maximum force, typically in newtons
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2MouseJointDef {
    bodyIdA: any;
    bodyIdB: any;
    target: b2Vec2;
    hertz: number;
    dampingRatio: number;
    maxForce: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2PrismaticJointDef
 * @summary Prismatic joint definition that constrains motion along a defined axis
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} localAnchorA - The local anchor point relative to bodyA's origin
 * @property {b2Vec2} localAnchorB - The local anchor point relative to bodyB's origin
 * @property {b2Vec2} localAxisA - The local translation unit axis in bodyA
 * @property {number} referenceAngle - The constrained angle between the bodies: bodyB_angle - bodyA_angle
 * @property {boolean} enableSpring - Enable a linear spring along the prismatic joint axis
 * @property {number} hertz - The spring stiffness Hertz, cycles per second
 * @property {number} dampingRatio - The spring damping ratio, non-dimensional
 * @property {boolean} enableLimit - Enable/disable the joint limit
 * @property {number} lowerTranslation - The lower translation limit
 * @property {number} upperTranslation - The upper translation limit
 * @property {boolean} enableMotor - Enable/disable the joint motor
 * @property {number} maxMotorForce - The maximum motor force, typically in newtons
 * @property {number} motorSpeed - The desired motor speed, typically in meters per second
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2PrismaticJointDef {
    bodyIdA: any;
    bodyIdB: any;
    localAnchorA: b2Vec2;
    localAnchorB: b2Vec2;
    localAxisA: b2Vec2;
    referenceAngle: number;
    enableSpring: boolean;
    hertz: number;
    dampingRatio: number;
    enableLimit: boolean;
    lowerTranslation: number;
    upperTranslation: number;
    enableMotor: boolean;
    maxMotorForce: number;
    motorSpeed: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2RevoluteJointDef
 * @summary Revolute joint definition that specifies how two bodies are joined at an anchor point
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} localAnchorA - The local anchor point relative to bodyA's origin
 * @property {b2Vec2} localAnchorB - The local anchor point relative to bodyB's origin
 * @property {number} referenceAngle - The bodyB angle minus bodyA angle in the reference state (radians)
 * @property {boolean} enableSpring - Enable a rotational spring on the revolute hinge axis
 * @property {number} hertz - The spring stiffness Hertz, cycles per second
 * @property {number} dampingRatio - The spring damping ratio, non-dimensional
 * @property {boolean} enableLimit - A flag to enable joint limits
 * @property {number} lowerAngle - The lower angle for the joint limit in radians
 * @property {number} upperAngle - The upper angle for the joint limit in radians
 * @property {boolean} enableMotor - A flag to enable the joint motor
 * @property {number} maxMotorTorque - The maximum motor torque, typically in newton-meters
 * @property {number} motorSpeed - The desired motor speed in radians per second
 * @property {number} drawSize - Scale the debug draw
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2RevoluteJointDef {
    bodyIdA: any;
    bodyIdB: any;
    localAnchorA: b2Vec2;
    localAnchorB: b2Vec2;
    referenceAngle: number;
    enableSpring: boolean;
    hertz: number;
    dampingRatio: number;
    enableLimit: boolean;
    lowerAngle: number;
    upperAngle: number;
    enableMotor: boolean;
    maxMotorTorque: number;
    motorSpeed: number;
    drawSize: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2WeldJointDef
 * @summary Weld joint definition that connects two bodies rigidly with optional spring properties
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} localAnchorA - The local anchor point relative to bodyA's origin
 * @property {b2Vec2} localAnchorB - The local anchor point relative to bodyB's origin
 * @property {number} referenceAngle - The bodyB angle minus bodyA angle in the reference state (radians)
 * @property {number} linearHertz - Linear stiffness expressed as Hertz (cycles per second). Use zero for maximum stiffness.
 * @property {number} angularHertz - Angular stiffness as Hertz (cycles per second). Use zero for maximum stiffness.
 * @property {number} linearDampingRatio - Linear damping ratio, non-dimensional. Use 1 for critical damping.
 * @property {number} angularDampingRatio - Linear damping ratio, non-dimensional. Use 1 for critical damping.
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2WeldJointDef {
    bodyIdA: any;
    bodyIdB: any;
    localAnchorA: b2Vec2;
    localAnchorB: b2Vec2;
    referenceAngle: number;
    linearHertz: number;
    angularHertz: number;
    linearDampingRatio: number;
    angularDampingRatio: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2WheelJointDef
 * @summary Wheel joint definition that defines a line of motion using an axis and anchor points
 * @property {b2BodyId} bodyIdA - The first attached body
 * @property {b2BodyId} bodyIdB - The second attached body
 * @property {b2Vec2} localAnchorA - The local anchor point relative to bodyA's origin
 * @property {b2Vec2} localAnchorB - The local anchor point relative to bodyB's origin
 * @property {b2Vec2} localAxisA - The local translation unit axis in bodyA
 * @property {boolean} enableSpring - Enable a linear spring along the local axis
 * @property {number} hertz - Spring stiffness in Hertz
 * @property {number} dampingRatio - Spring damping ratio, non-dimensional
 * @property {boolean} enableLimit - Enable/disable the joint linear limit
 * @property {number} lowerTranslation - The lower translation limit
 * @property {number} upperTranslation - The upper translation limit
 * @property {boolean} enableMotor - Enable/disable the joint rotational motor
 * @property {number} maxMotorTorque - The maximum motor torque, typically in newton-meters
 * @property {number} motorSpeed - The desired motor speed in radians per second
 * @property {boolean} collideConnected - Set this flag to true if the attached bodies should collide
 * @property {*} userData - User data pointer
 * @property {number} internalValue - Used internally to detect a valid definition. DO NOT SET.
 */
export class b2WheelJointDef {
    bodyIdA: any;
    bodyIdB: any;
    localAnchorA: b2Vec2;
    localAnchorB: b2Vec2;
    localAxisA: b2Vec2;
    enableSpring: boolean;
    hertz: number;
    dampingRatio: number;
    enableLimit: boolean;
    lowerTranslation: number;
    upperTranslation: number;
    enableMotor: boolean;
    maxMotorTorque: number;
    motorSpeed: number;
    collideConnected: boolean;
    userData: any;
}
/**
 * @class b2SensorBeginTouchEvent
 * @summary A begin touch event is generated when a shape starts to overlap a sensor shape.
 * @property {b2ShapeId} sensorShapeId - The id of the sensor shape
 * @property {b2ShapeId} visitorShapeId - The id of the dynamic shape that began touching the sensor shape
 */
export class b2SensorBeginTouchEvent {
    sensorShapeId: any;
    visitorShapeId: any;
}
/**
 * @class b2SensorEndTouchEvent
 * @summary An end touch event is generated when a shape stops overlapping a sensor shape.
 * @property {b2ShapeId} sensorShapeId - The id of the sensor shape
 * @property {b2ShapeId} visitorShapeId - The id of the dynamic shape that stopped touching the sensor shape
 */
export class b2SensorEndTouchEvent {
    sensorShapeId: any;
    visitorShapeId: any;
}
/**
 * @class b2SensorEvents
 * @summary Buffered sensor events from the Box2D world available after time step completion
 * @property {b2SensorBeginTouchEvent[]} beginEvents - Array of sensor begin touch events
 * @property {b2SensorEndTouchEvent[]} endEvents - Array of sensor end touch events
 * @property {number} beginCount - The number of begin touch events
 * @property {number} endCount - The number of end touch events
 */
export class b2SensorEvents {
    beginEvents: any;
    endEvents: any;
    beginCount: number;
    endCount: number;
}
/**
 * @class b2ContactBeginTouchEvent
 * @summary A begin touch event is generated when two shapes begin touching.
 * @property {b2ShapeId} shapeIdA - Id of the first shape
 * @property {b2ShapeId} shapeIdB - Id of the second shape
 * @property {b2Manifold} manifold - The initial contact manifold
 */
export class b2ContactBeginTouchEvent {
    shapeIdA: any;
    shapeIdB: any;
    manifold: any;
}
/**
 * @class b2ContactEndTouchEvent
 * @summary An end touch event is generated when two shapes stop touching.
 * @property {b2ShapeId} shapeIdA - Id of the first shape
 * @property {b2ShapeId} shapeIdB - Id of the second shape
 */
export class b2ContactEndTouchEvent {
    constructor(a?: any, b?: any);
    shapeIdA: any;
    shapeIdB: any;
}
/**
 * @class b2ContactHitEvent
 * @summary A hit touch event is generated when two shapes collide with a speed faster than the hit speed threshold.
 * @property {b2ShapeId} shapeIdA - Id of the first shape
 * @property {b2ShapeId} shapeIdB - Id of the second shape
 * @property {b2Vec2} point - Point where the shapes hit
 * @property {b2Vec2} normal - Normal vector pointing from shape A to shape B
 * @property {number} approachSpeed - The speed the shapes are approaching. Always positive. Typically in meters per second.
 */
export class b2ContactHitEvent {
    shapeIdA: any;
    shapeIdB: any;
    pointX: number;
    pointY: number;
    normalX: number;
    normalY: number;
    approachSpeed: number;
}
/**
 * @class b2ContactEvents
 * @summary Contact events buffered in the Box2D world available after time step completion
 * @property {b2ContactBeginTouchEvent[]} beginEvents - Array of begin touch events
 * @property {b2ContactEndTouchEvent[]} endEvents - Array of end touch events
 * @property {b2ContactHitEvent[]} hitEvents - Array of hit events
 * @property {number} beginCount - Number of begin touch events
 * @property {number} endCount - Number of end touch events
 * @property {number} hitCount - Number of hit events
 */
export class b2ContactEvents {
    beginEvents: any;
    endEvents: any;
    hitEvents: any;
    beginCount: number;
    endCount: number;
    hitCount: number;
}
/**
 * @class b2BodyMoveEvent
 * @summary Body move events triggered during physics simulation. Provides efficient batch updates for moved bodies and sleep state changes.
 * @property {b2Transform} transform - The new transform of the moved body
 * @property {b2BodyId} bodyId - The identifier of the moved body
 * @property {void} userData - User data associated with the body
 * @property {boolean} fellAsleep - Indicates if the body transitioned to sleep state
 */
export class b2BodyMoveEvent {
    transform: any;
    bodyId: any;
    userData: any;
    fellAsleep: boolean;
}
/**
 * @class b2BodyEvents
 * @summary Body events buffered in the Box2D world, available after time step completion
 * @property {b2BodyMoveEvent[]} moveEvents - Array of move events
 * @property {number} moveCount - Number of move events
 */
export class b2BodyEvents {
    moveEvents: any;
    moveCount: number;
}
/**
 * @class b2ContactData
 * @summary The contact data for two shapes. By convention the manifold normal points from shape A to shape B.
 * @see b2Shape_GetContactData()
 * @see b2Body_GetContactData()
 * @property {b2ShapeId} shapeIdA - The identifier for the first shape
 * @property {b2ShapeId} shapeIdB - The identifier for the second shape
 * @property {b2Manifold} manifold - The contact manifold between the shapes
 */
export class b2ContactData {
    shapeIdA: any;
    shapeIdB: any;
    manifold: any;
}
export namespace b2HexColor {
    let b2_colorAliceBlue: number;
    let b2_colorAntiqueWhite: number;
    let b2_colorAqua: number;
    let b2_colorAquamarine: number;
    let b2_colorAzure: number;
    let b2_colorBeige: number;
    let b2_colorBisque: number;
    let b2_colorBlack: number;
    let b2_colorBlanchedAlmond: number;
    let b2_colorBlue: number;
    let b2_colorBlueViolet: number;
    let b2_colorBrown: number;
    let b2_colorBurlywood: number;
    let b2_colorCadetBlue: number;
    let b2_colorChartreuse: number;
    let b2_colorChocolate: number;
    let b2_colorCoral: number;
    let b2_colorCornflowerBlue: number;
    let b2_colorCornsilk: number;
    let b2_colorCrimson: number;
    let b2_colorCyan: number;
    let b2_colorDarkBlue: number;
    let b2_colorDarkCyan: number;
    let b2_colorDarkGoldenrod: number;
    let b2_colorDarkGray: number;
    let b2_colorDarkGreen: number;
    let b2_colorDarkKhaki: number;
    let b2_colorDarkMagenta: number;
    let b2_colorDarkOliveGreen: number;
    let b2_colorDarkOrange: number;
    let b2_colorDarkOrchid: number;
    let b2_colorDarkRed: number;
    let b2_colorDarkSalmon: number;
    let b2_colorDarkSeaGreen: number;
    let b2_colorDarkSlateBlue: number;
    let b2_colorDarkSlateGray: number;
    let b2_colorDarkTurquoise: number;
    let b2_colorDarkViolet: number;
    let b2_colorDeepPink: number;
    let b2_colorDeepSkyBlue: number;
    let b2_colorDimGray: number;
    let b2_colorDodgerBlue: number;
    let b2_colorFirebrick: number;
    let b2_colorFloralWhite: number;
    let b2_colorForestGreen: number;
    let b2_colorFuchsia: number;
    let b2_colorGainsboro: number;
    let b2_colorGhostWhite: number;
    let b2_colorGold: number;
    let b2_colorGoldenrod: number;
    let b2_colorGray: number;
    let b2_colorGray1: number;
    let b2_colorGray2: number;
    let b2_colorGray3: number;
    let b2_colorGray4: number;
    let b2_colorGray5: number;
    let b2_colorGray6: number;
    let b2_colorGray7: number;
    let b2_colorGray8: number;
    let b2_colorGray9: number;
    let b2_colorGreen: number;
    let b2_colorGreenYellow: number;
    let b2_colorHoneydew: number;
    let b2_colorHotPink: number;
    let b2_colorIndianRed: number;
    let b2_colorIndigo: number;
    let b2_colorIvory: number;
    let b2_colorKhaki: number;
    let b2_colorLavender: number;
    let b2_colorLavenderBlush: number;
    let b2_colorLawnGreen: number;
    let b2_colorLemonChiffon: number;
    let b2_colorLightBlue: number;
    let b2_colorLightCoral: number;
    let b2_colorLightCyan: number;
    let b2_colorLightGoldenrod: number;
    let b2_colorLightGoldenrodYellow: number;
    let b2_colorLightGray: number;
    let b2_colorLightGreen: number;
    let b2_colorLightPink: number;
    let b2_colorLightSalmon: number;
    let b2_colorLightSeaGreen: number;
    let b2_colorLightSkyBlue: number;
    let b2_colorLightSlateBlue: number;
    let b2_colorLightSlateGray: number;
    let b2_colorLightSteelBlue: number;
    let b2_colorLightYellow: number;
    let b2_colorLime: number;
    let b2_colorLimeGreen: number;
    let b2_colorLinen: number;
    let b2_colorMagenta: number;
    let b2_colorMaroon: number;
    let b2_colorMediumAquamarine: number;
    let b2_colorMediumBlue: number;
    let b2_colorMediumOrchid: number;
    let b2_colorMediumPurple: number;
    let b2_colorMediumSeaGreen: number;
    let b2_colorMediumSlateBlue: number;
    let b2_colorMediumSpringGreen: number;
    let b2_colorMediumTurquoise: number;
    let b2_colorMediumVioletRed: number;
    let b2_colorMidnightBlue: number;
    let b2_colorMintCream: number;
    let b2_colorMistyRose: number;
    let b2_colorMoccasin: number;
    let b2_colorNavajoWhite: number;
    let b2_colorNavy: number;
    let b2_colorNavyBlue: number;
    let b2_colorOldLace: number;
    let b2_colorOlive: number;
    let b2_colorOliveDrab: number;
    let b2_colorOrange: number;
    let b2_colorOrangeRed: number;
    let b2_colorOrchid: number;
    let b2_colorPaleGoldenrod: number;
    let b2_colorPaleGreen: number;
    let b2_colorPaleTurquoise: number;
    let b2_colorPaleVioletRed: number;
    let b2_colorPapayaWhip: number;
    let b2_colorPeachPuff: number;
    let b2_colorPeru: number;
    let b2_colorPink: number;
    let b2_colorPlum: number;
    let b2_colorPowderBlue: number;
    let b2_colorPurple: number;
    let b2_colorRebeccaPurple: number;
    let b2_colorRed: number;
    let b2_colorRosyBrown: number;
    let b2_colorRoyalBlue: number;
    let b2_colorSaddleBrown: number;
    let b2_colorSalmon: number;
    let b2_colorSandyBrown: number;
    let b2_colorSeaGreen: number;
    let b2_colorSeashell: number;
    let b2_colorSienna: number;
    let b2_colorSilver: number;
    let b2_colorSkyBlue: number;
    let b2_colorSlateBlue: number;
    let b2_colorSlateGray: number;
    let b2_colorSnow: number;
    let b2_colorSpringGreen: number;
    let b2_colorSteelBlue: number;
    let b2_colorTan: number;
    let b2_colorTeal: number;
    let b2_colorThistle: number;
    let b2_colorTomato: number;
    let b2_colorTurquoise: number;
    let b2_colorViolet: number;
    let b2_colorVioletRed: number;
    let b2_colorWheat: number;
    let b2_colorWhite: number;
    let b2_colorWhiteSmoke: number;
    let b2_colorYellow: number;
    let b2_colorYellowGreen: number;
    let b2_colorBox2DRed: number;
    let b2_colorBox2DBlue: number;
    let b2_colorBox2DGreen: number;
    let b2_colorBox2DYellow: number;
}
/**
 * @class b2DebugDraw
 * @summary Callbacks and options for debug rendering of a Box2D world
 * @property {function(b2Vec2, string, *): void} DrawString - Draw a string
 * @property {b2AABB} drawingBounds - Bounds to use if restricting drawing to a rectangular region
 * @property {boolean} useDrawingBounds - Option to restrict drawing to a rectangular region. May suffer from unstable depth sorting
 * @property {boolean} drawShapes - Option to draw shapes
 * @property {boolean} drawJoints - Option to draw joints
 * @property {boolean} drawJointExtras - Option to draw additional information for joints
 * @property {boolean} drawAABBs - Option to draw the bounding boxes for shapes
 * @property {boolean} drawMass - Option to draw the mass and center of mass of dynamic bodies
 * @property {boolean} drawContacts - Option to draw contact points
 * @property {boolean} drawGraphColors - Option to visualize the graph coloring used for contacts and joints
 * @property {boolean} drawContactNormals - Option to draw contact normals
 * @property {boolean} drawContactImpulses - Option to draw contact normal impulses
 * @property {boolean} drawFrictionImpulses - Option to draw contact friction impulses
 * @property {*} context - User context that is passed as an argument to drawing callback functions
 */
export class b2DebugDraw {
    DrawPolygon: any;
    DrawImagePolygon: any;
    DrawSolidPolygon: any;
    DrawCircle: any;
    DrawImageCircle: any;
    DrawSolidCircle: any;
    DrawCapsule: any;
    DrawImageCapsule: any;
    DrawSolidCapsule: any;
    DrawSegment: any;
    DrawTransform: any;
    DrawPoint: any;
    DrawString: any;
    SetPosition: any;
    drawingBounds: b2AABB;
    useDrawingBounds: boolean;
    positionOffset: b2Vec2;
    drawShapes: boolean;
    drawJoints: boolean;
    drawAABBs: boolean;
    drawMass: boolean;
    drawContacts: boolean;
    drawGraphColors: boolean;
    drawContactNormals: boolean;
    drawContactImpulses: boolean;
    drawFrictionImpulses: boolean;
    context: any;
}
/**
 * @class b2Filter
 * @summary Used to filter collision on shapes. Affects shape-vs-shape collision and shape-versus-query collision.
 * @property {number} categoryBits - The collision category bits. Normally you would just set one bit.
 * The category bits should represent your application object types.
 * @property {number} maskBits - The collision mask bits. States the categories that this shape would
 * accept for collision.
 * @property {number} groupIndex - Collision groups allow a certain group of objects to never collide
 * (negative) or always collide (positive). Zero has no effect. Non-zero group filtering always wins
 * against the mask bits.
 */
export class b2Filter {
    categoryBits: number;
    maskBits: number;
    groupIndex: number;
}
/**
 * @class b2QueryFilter
 * @summary Filter used to control collision detection between queries and shapes
 * @property {number} categoryBits - The collision category bits of this query. Normally you would just set one bit.
 * @property {number} maskBits - The collision mask bits. This states the shape categories that this query would accept for collision.
 */
export class b2QueryFilter {
    categoryBits: number;
    maskBits: number;
}
/**
 * Prototype for a contact filter callback.
 * This is called when a contact pair is considered for collision. This allows you to
 * perform custom logic to prevent collision between shapes. This is only called if
 * one of the two shapes has custom filtering enabled.
 *
 * **Notes:**
 * - This function must be thread-safe.
 * - This is only called if one of the two shapes has enabled custom filtering.
 * - This is called only for awake dynamic bodies.
 */
export type b2CustomFilterFcn = (shapeIdA: b2ShapeId, shapeIdB: b2ShapeId, context: any) => boolean;
/**
 * Prototype for a pre-solve callback.
 * This is called after a contact is updated. This allows you to inspect a
 * contact before it goes to the solver. If you are careful, you can modify the
 * contact manifold (e.g., modify the normal).
 *
 * **Notes:**
 * - This function must be thread-safe.
 * - This is only called if the shape has enabled pre-solve events.
 * - This is called only for awake dynamic bodies.
 * - This is not called for sensors.
 * - The supplied manifold has impulse values from the previous step.
 */
export type b2PreSolveFcn = (shapeIdA: b2ShapeId, shapeIdB: b2ShapeId, manifold: b2Manifold, context: any) => boolean;
/**
 * Prototype callback for overlap queries.
 * Called for each shape found in the query.
 */
export type b2OverlapResultFcn = (shapeId: b2ShapeId, context: any) => boolean;
/**
 * Prototype callback for ray casts.
 * Called for each shape found in the query. You control how the ray cast proceeds by returning a float:
 *
 * - `-1`: Ignore this shape and continue.
 * - `0`: Terminate the ray cast.
 * - `fraction`: Clip the ray to this point.
 * - `1`: Don't clip the ray and continue.
 */
export type b2CastResultFcn = (shapeId: b2ShapeId, point: b2Vec2, normal: b2Vec2, fraction: number, context: any) => number;
import { b2Vec2 } from './math_functions_h.js';
import { b2Rot } from './math_functions_h.js';
import { b2AABB } from './math_functions_h.js';
export { b2Validation, b2DefaultWorldDef, b2DefaultBodyDef, b2DefaultFilter, b2DefaultQueryFilter, b2DefaultShapeDef, b2DefaultChainDef } from "../types_c.js";
