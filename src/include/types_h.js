/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2AABB, b2Rot, b2Vec2 } from './math_functions_h.js';

export {

    // debugging
    b2Validation,

    b2DefaultWorldDef, b2DefaultBodyDef, b2DefaultFilter, b2DefaultQueryFilter, b2DefaultShapeDef, b2DefaultChainDef,
} from '../types_c.js';

export const b2BodyType = {
    b2_staticBody: 0,
    b2_kinematicBody: 1,
    b2_dynamicBody: 2,
    b2_bodyTypeCount: 3
};

export const b2ShapeType = {
    b2_circleShape: 0,
    b2_capsuleShape: 1,
    b2_segmentShape: 2,
    b2_polygonShape: 3,
    b2_chainSegmentShape: 4,
    b2_shapeTypeCount: 5
};

export const b2JointType = {
    b2_distanceJoint: 0,
    b2_motorJoint: 1,
    b2_mouseJoint: 2,
    b2_prismaticJoint: 3,
    b2_revoluteJoint: 4,
    b2_weldJoint: 5,
    b2_wheelJoint: 6,
    b2_unknown: -1
};

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
export class b2RayResult
{
    constructor()
    {
        this.shapeId = null;
        this.point = new b2Vec2(0, 0);
        this.normal = new b2Vec2(0, 0);
        this.fraction = 0;
        this.hit = false;
    }
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
export class b2WorldDef
{
    constructor()
    {
        this.gravity = new b2Vec2(0, 0);
        this.restitutionThreshold = 0;
        this.contactPushoutVelocity = 0;
        this.hitEventThreshold = 0;
        this.contactHertz = 0;
        this.contactDampingRatio = 0;
        this.jointHertz = 0;
        this.jointDampingRatio = 0;
        this.maximumLinearVelocity = 0;
        this.enableSleep = false;
        this.enableContinuous = true;
        this.workerCount = 0;

        // this.userTaskContext = null;
    }
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
export class b2BodyDef
{
    constructor()
    {
        this.type = b2BodyType.b2_staticBody;
        this.position = new b2Vec2(0, 0);
        this.rotation = new b2Rot(1, 0);
        this.linearVelocity = new b2Vec2(0, 0);
        this.angularVelocity = 0;
        this.linearDamping = 0;
        this.angularDamping = 0;
        this.gravityScale = 0;
        this.sleepThreshold = 0;
        this.userData = null;
        this.enableSleep = false;
        this.isAwake = false;
        this.fixedRotation = false;
        this.isBullet = false;
        this.isEnabled = false;
        this.updateBodyMass = false;
        this.allowFastRotation = false;
    }
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
export class b2ShapeDef
{
    constructor()
    {
        this.userData = null;
        this.friction = 0;
        this.restitution = 0;
        this.density = 0;
        this.filter = new b2Filter();
        this.customColor = b2HexColor.b2_colorAqua; // .b2_colorAliceBlue;

        // / Sensors do not collide with other sensors and do not have continuous collision.
        // / Instead use a ray or shape cast for those scenarios.
        this.isSensor = false;

        // / Enable sensor events for this shape. Only applies to kinematic and dynamic bodies. Ignored for sensors.
        this.enableSensorEvents = false;

        // / Enable contact events for this shape. Only applies to kinematic and dynamic bodies. Ignored for sensors.
        this.enableContactEvents = false;

        // / Enable hit events for this shape. Only applies to kinematic and dynamic bodies. Ignored for sensors.
        this.enableHitEvents = false;

        // / Enable pre-solve contact events for this shape. Only applies to dynamic bodies. These are expensive
        // /	and must be carefully handled due to threading. Ignored for sensors.
        // / PJB NOTE: threading concerns do not apply to the JS translation.
        this.enablePreSolveEvents = false;

        // / Normally shapes on static bodies don't invoke contact creation when they are added to the world. This overrides
        // /	that behavior and causes contact creation. This significantly slows down static body creation which can be important
        // /	when there are many static shapes.
        // / This is implicitly always true for sensors.
        this.forceContactCreation = false;
    }
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
export class b2ChainDef
{
    constructor()
    {
        this.userData = null;
        this.points = null;
        this.count = 0;
        this.friction = 0;
        this.restitution = 0;
        this.filter = new b2Filter();
        this.isLoop = false;
    }
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
export class b2DistanceJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.localAnchorA = new b2Vec2(0, 0);
        this.localAnchorB = new b2Vec2(0, 0);
        this.length = 0;
        this.enableSpring = false;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.enableLimit = false;
        this.minLength = 0;
        this.maxLength = 0;
        this.enableMotor = false;
        this.maxMotorForce = 0;
        this.motorSpeed = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2MotorJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.linearOffset = new b2Vec2(0, 0);
        this.angularOffset = 0;
        this.maxForce = 0;
        this.maxTorque = 0;
        this.correctionFactor = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2MouseJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.target = new b2Vec2(0, 0);
        this.hertz = 0;
        this.dampingRatio = 0;
        this.maxForce = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2PrismaticJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.localAnchorA = new b2Vec2(0, 0);
        this.localAnchorB = new b2Vec2(0, 0);
        this.localAxisA = new b2Vec2(0, 0);
        this.referenceAngle = 0;
        this.enableSpring = false;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.enableLimit = false;
        this.lowerTranslation = 0;
        this.upperTranslation = 0;
        this.enableMotor = false;
        this.maxMotorForce = 0;
        this.motorSpeed = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2RevoluteJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.localAnchorA = new b2Vec2(0, 0);
        this.localAnchorB = new b2Vec2(0, 0);
        this.referenceAngle = 0;
        this.enableSpring = false;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.enableLimit = false;
        this.lowerAngle = 0;
        this.upperAngle = 0;
        this.enableMotor = false;
        this.maxMotorTorque = 0;
        this.motorSpeed = 0;
        this.drawSize = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2WeldJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.localAnchorA = new b2Vec2(0, 0);
        this.localAnchorB = new b2Vec2(0, 0);
        this.referenceAngle = 0;
        this.linearHertz = 0;
        this.angularHertz = 0;
        this.linearDampingRatio = 0;
        this.angularDampingRatio = 0;
        this.collideConnected = false;
        this.userData = null;
    }
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
export class b2WheelJointDef
{
    constructor()
    {
        this.bodyIdA = null;
        this.bodyIdB = null;
        this.localAnchorA = new b2Vec2(0, 0);
        this.localAnchorB = new b2Vec2(0, 0);
        this.localAxisA = new b2Vec2(0, 0);
        this.enableSpring = false;
        this.hertz = 0;
        this.dampingRatio = 0;
        this.enableLimit = false;
        this.lowerTranslation = 0;
        this.upperTranslation = 0;
        this.enableMotor = false;
        this.maxMotorTorque = 0;
        this.motorSpeed = 0;
        this.collideConnected = false;
        this.userData = null;
    }
}

/**
 * @class b2SensorBeginTouchEvent
 * @summary A begin touch event is generated when a shape starts to overlap a sensor shape.
 * @property {b2ShapeId} sensorShapeId - The id of the sensor shape
 * @property {b2ShapeId} visitorShapeId - The id of the dynamic shape that began touching the sensor shape
 */
export class b2SensorBeginTouchEvent
{
    constructor()
    {
        this.sensorShapeId = null;
        this.visitorShapeId = null;
    }
}

/**
 * @class b2SensorEndTouchEvent
 * @summary An end touch event is generated when a shape stops overlapping a sensor shape.
 * @property {b2ShapeId} sensorShapeId - The id of the sensor shape
 * @property {b2ShapeId} visitorShapeId - The id of the dynamic shape that stopped touching the sensor shape
 */
export class b2SensorEndTouchEvent
{
    constructor()
    {
        this.sensorShapeId = null;
        this.visitorShapeId = null;
    }
}

/**
 * @class b2SensorEvents
 * @summary Buffered sensor events from the Box2D world available after time step completion
 * @property {b2SensorBeginTouchEvent[]} beginEvents - Array of sensor begin touch events
 * @property {b2SensorEndTouchEvent[]} endEvents - Array of sensor end touch events
 * @property {number} beginCount - The number of begin touch events
 * @property {number} endCount - The number of end touch events
 */
export class b2SensorEvents
{
    constructor()
    {
        this.beginEvents = null;
        this.endEvents = null;
        this.beginCount = 0;
        this.endCount = 0;
    }
}

/**
 * @class b2ContactBeginTouchEvent
 * @summary A begin touch event is generated when two shapes begin touching.
 * @property {b2ShapeId} shapeIdA - Id of the first shape
 * @property {b2ShapeId} shapeIdB - Id of the second shape
 * @property {b2Manifold} manifold - The initial contact manifold
 */
export class b2ContactBeginTouchEvent
{
    constructor()
    {
        this.shapeIdA = null;
        this.shapeIdB = null;
        this.manifold = null;
    }
}

/**
 * @class b2ContactEndTouchEvent
 * @summary An end touch event is generated when two shapes stop touching.
 * @property {b2ShapeId} shapeIdA - Id of the first shape
 * @property {b2ShapeId} shapeIdB - Id of the second shape
 */
export class b2ContactEndTouchEvent
{
    constructor(a = null, b = null)
    {
        this.shapeIdA = a;
        this.shapeIdB = b;
    }
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
export class b2ContactHitEvent
{
    constructor()
    {
        this.shapeIdA = null;
        this.shapeIdB = null;
        this.pointX = 0;
        this.pointY = 0;
        this.normalX = 0;
        this.normalY = 0;
        this.approachSpeed = 0;
    }
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
export class b2ContactEvents
{
    constructor()
    {
        this.beginEvents = null;
        this.endEvents = null;
        this.hitEvents = null;
        this.beginCount = 0;
        this.endCount = 0;
        this.hitCount = 0;
    }
}

/**
 * @class b2BodyMoveEvent
 * @summary Body move events triggered during physics simulation. Provides efficient batch updates for moved bodies and sleep state changes.
 * @property {b2Transform} transform - The new transform of the moved body
 * @property {b2BodyId} bodyId - The identifier of the moved body
 * @property {void} userData - User data associated with the body
 * @property {boolean} fellAsleep - Indicates if the body transitioned to sleep state
 */
export class b2BodyMoveEvent
{
    constructor()
    {
        this.transform = null;
        this.bodyId = null;
        this.userData = null;
        this.fellAsleep = false;
    }
}

/**
 * @class b2BodyEvents
 * @summary Body events buffered in the Box2D world, available after time step completion
 * @property {b2BodyMoveEvent[]} moveEvents - Array of move events
 * @property {number} moveCount - Number of move events
 */
export class b2BodyEvents
{
    constructor()
    {
        this.moveEvents = null;
        this.moveCount = 0;
    }
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
export class b2ContactData
{
    constructor()
    {
        this.shapeIdA = null;
        this.shapeIdB = null;
        this.manifold = null;
    }
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
 *
 * @warning Do not attempt to modify the world inside this callback.
 * @see b2ShapeDef
 * @ingroup world
 * @callback b2CustomFilterFcn
 * @param {b2ShapeId} shapeIdA - The first shape ID.
 * @param {b2ShapeId} shapeIdB - The second shape ID.
 * @param {any} context - User-defined context.
 * @returns {boolean} False to disable the collision.
 */

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
 *
 * @warning Do not attempt to modify the world inside this callback.
 * @ingroup world
 * @callback b2PreSolveFcn
 * @param {b2ShapeId} shapeIdA - The first shape ID.
 * @param {b2ShapeId} shapeIdB - The second shape ID.
 * @param {b2Manifold} manifold - The contact manifold.
 * @param {any} context - User-defined context.
 * @returns {boolean} False to disable the contact this step.
 */

/**
 * Prototype callback for overlap queries.
 * Called for each shape found in the query.
 *
 * @see b2World_OverlapABB
 * @ingroup world
 * @callback b2OverlapResultFcn
 * @param {b2ShapeId} shapeId - The shape ID found in the query.
 * @param {any} context - User-defined context.
 * @returns {boolean} False to terminate the query.
 */

/**
 * Prototype callback for ray casts.
 * Called for each shape found in the query. You control how the ray cast proceeds by returning a float:
 *
 * - `-1`: Ignore this shape and continue.
 * - `0`: Terminate the ray cast.
 * - `fraction`: Clip the ray to this point.
 * - `1`: Don't clip the ray and continue.
 *
 * @see b2World_CastRay
 * @ingroup world
 * @callback b2CastResultFcn
 * @param {b2ShapeId} shapeId - The shape hit by the ray.
 * @param {b2Vec2} point - The point of initial intersection.
 * @param {b2Vec2} normal - The normal vector at the point of intersection.
 * @param {number} fraction - The fraction along the ray at the point of intersection.
 * @param {any} context - User-defined context.
 * @returns {number} - `-1` to filter, `0` to terminate, `fraction` to clip the ray for closest hit, `1` to continue.
 */


/// These colors are used for debug draw and mostly match the named SVG colors.
/// See https://www.rapidtables.com/web/color/index.html
/// https://johndecember.com/html/spec/colorsvg.html
/// https://upload.wikimedia.org/wikipedia/commons/2/2b/SVG_Recognized_color_keyword_names.svg
export const b2HexColor = {
    b2_colorAliceBlue: 0xf0f8ff,
    b2_colorAntiqueWhite: 0xfaebd7,
    b2_colorAqua: 0x00ffff,
    b2_colorAquamarine: 0x7fffd4,
    b2_colorAzure: 0xf0ffff,
    b2_colorBeige: 0xf5f5dc,
    b2_colorBisque: 0xffe4c4,
    b2_colorBlack: 0x000001,                // non-zero!
    b2_colorBlanchedAlmond: 0xffebcd,
    b2_colorBlue: 0x0000ff,
    b2_colorBlueViolet: 0x8a2be2,
    b2_colorBrown: 0xa52a2a,
    b2_colorBurlywood: 0xdeb887,
    b2_colorCadetBlue: 0x5f9ea0,
    b2_colorChartreuse: 0x7fff00,
    b2_colorChocolate: 0xd2691e,
    b2_colorCoral: 0xff7f50,
    b2_colorCornflowerBlue: 0x6495ed,
    b2_colorCornsilk: 0xfff8dc,
    b2_colorCrimson: 0xdc143c,
    b2_colorCyan: 0x00ffff,
    b2_colorDarkBlue: 0x00008b,
    b2_colorDarkCyan: 0x008b8b,
    b2_colorDarkGoldenrod: 0xb8860b,
    b2_colorDarkGray: 0xa9a9a9,
    b2_colorDarkGreen: 0x006400,
    b2_colorDarkKhaki: 0xbdb76b,
    b2_colorDarkMagenta: 0x8b008b,
    b2_colorDarkOliveGreen: 0x556b2f,
    b2_colorDarkOrange: 0xff8c00,
    b2_colorDarkOrchid: 0x9932cc,
    b2_colorDarkRed: 0x8b0000,
    b2_colorDarkSalmon: 0xe9967a,
    b2_colorDarkSeaGreen: 0x8fbc8f,
    b2_colorDarkSlateBlue: 0x483d8b,
    b2_colorDarkSlateGray: 0x2f4f4f,
    b2_colorDarkTurquoise: 0x00ced1,
    b2_colorDarkViolet: 0x9400d3,
    b2_colorDeepPink: 0xff1493,
    b2_colorDeepSkyBlue: 0x00bfff,
    b2_colorDimGray: 0x696969,
    b2_colorDodgerBlue: 0x1e90ff,
    b2_colorFirebrick: 0xb22222,
    b2_colorFloralWhite: 0xfffaf0,
    b2_colorForestGreen: 0x228b22,
    b2_colorFuchsia: 0xff00ff,
    b2_colorGainsboro: 0xdcdcdc,
    b2_colorGhostWhite: 0xf8f8ff,
    b2_colorGold: 0xffd700,
    b2_colorGoldenrod: 0xdaa520,
    b2_colorGray: 0xbebebe,
    b2_colorGray1: 0x1a1a1a,
    b2_colorGray2: 0x333333,
    b2_colorGray3: 0x4d4d4d,
    b2_colorGray4: 0x666666,
    b2_colorGray5: 0x7f7f7f,
    b2_colorGray6: 0x999999,
    b2_colorGray7: 0xb3b3b3,
    b2_colorGray8: 0xcccccc,
    b2_colorGray9: 0xe5e5e5,
    b2_colorGreen: 0x00ff00,
    b2_colorGreenYellow: 0xadff2f,
    b2_colorHoneydew: 0xf0fff0,
    b2_colorHotPink: 0xff69b4,
    b2_colorIndianRed: 0xcd5c5c,
    b2_colorIndigo: 0x4b0082,
    b2_colorIvory: 0xfffff0,
    b2_colorKhaki: 0xf0e68c,
    b2_colorLavender: 0xe6e6fa,
    b2_colorLavenderBlush: 0xfff0f5,
    b2_colorLawnGreen: 0x7cfc00,
    b2_colorLemonChiffon: 0xfffacd,
    b2_colorLightBlue: 0xadd8e6,
    b2_colorLightCoral: 0xf08080,
    b2_colorLightCyan: 0xe0ffff,
    b2_colorLightGoldenrod: 0xeedd82,
    b2_colorLightGoldenrodYellow: 0xfafad2,
    b2_colorLightGray: 0xd3d3d3,
    b2_colorLightGreen: 0x90ee90,
    b2_colorLightPink: 0xffb6c1,
    b2_colorLightSalmon: 0xffa07a,
    b2_colorLightSeaGreen: 0x20b2aa,
    b2_colorLightSkyBlue: 0x87cefa,
    b2_colorLightSlateBlue: 0x8470ff,
    b2_colorLightSlateGray: 0x778899,
    b2_colorLightSteelBlue: 0xb0c4de,
    b2_colorLightYellow: 0xffffe0,
    b2_colorLime: 0x00ff00,
    b2_colorLimeGreen: 0x32cd32,
    b2_colorLinen: 0xfaf0e6,
    b2_colorMagenta: 0xff00ff,
    b2_colorMaroon: 0xb03060,
    b2_colorMediumAquamarine: 0x66cdaa,
    b2_colorMediumBlue: 0x0000cd,
    b2_colorMediumOrchid: 0xba55d3,
    b2_colorMediumPurple: 0x9370db,
    b2_colorMediumSeaGreen: 0x3cb371,
    b2_colorMediumSlateBlue: 0x7b68ee,
    b2_colorMediumSpringGreen: 0x00fa9a,
    b2_colorMediumTurquoise: 0x48d1cc,
    b2_colorMediumVioletRed: 0xc71585,
    b2_colorMidnightBlue: 0x191970,
    b2_colorMintCream: 0xf5fffa,
    b2_colorMistyRose: 0xffe4e1,
    b2_colorMoccasin: 0xffe4b5,
    b2_colorNavajoWhite: 0xffdead,
    b2_colorNavy: 0x000080,
    b2_colorNavyBlue: 0x000080,
    b2_colorOldLace: 0xfdf5e6,
    b2_colorOlive: 0x808000,
    b2_colorOliveDrab: 0x6b8e23,
    b2_colorOrange: 0xffa500,
    b2_colorOrangeRed: 0xff4500,
    b2_colorOrchid: 0xda70d6,
    b2_colorPaleGoldenrod: 0xeee8aa,
    b2_colorPaleGreen: 0x98fb98,
    b2_colorPaleTurquoise: 0xafeeee,
    b2_colorPaleVioletRed: 0xdb7093,
    b2_colorPapayaWhip: 0xffefd5,
    b2_colorPeachPuff: 0xffdab9,
    b2_colorPeru: 0xcd853f,
    b2_colorPink: 0xffc0cb,
    b2_colorPlum: 0xdda0dd,
    b2_colorPowderBlue: 0xb0e0e6,
    b2_colorPurple: 0xa020f0,
    b2_colorRebeccaPurple: 0x663399,
    b2_colorRed: 0xff0000,
    b2_colorRosyBrown: 0xbc8f8f,
    b2_colorRoyalBlue: 0x4169e1,
    b2_colorSaddleBrown: 0x8b4513,
    b2_colorSalmon: 0xfa8072,
    b2_colorSandyBrown: 0xf4a460,
    b2_colorSeaGreen: 0x2e8b57,
    b2_colorSeashell: 0xfff5ee,
    b2_colorSienna: 0xa0522d,
    b2_colorSilver: 0xc0c0c0,
    b2_colorSkyBlue: 0x87ceeb,
    b2_colorSlateBlue: 0x6a5acd,
    b2_colorSlateGray: 0x708090,
    b2_colorSnow: 0xfffafa,
    b2_colorSpringGreen: 0x00ff7f,
    b2_colorSteelBlue: 0x4682b4,
    b2_colorTan: 0xd2b48c,
    b2_colorTeal: 0x008080,
    b2_colorThistle: 0xd8bfd8,
    b2_colorTomato: 0xff6347,
    b2_colorTurquoise: 0x40e0d0,
    b2_colorViolet: 0xee82ee,
    b2_colorVioletRed: 0xd02090,
    b2_colorWheat: 0xf5deb3,
    b2_colorWhite: 0xffffff,
    b2_colorWhiteSmoke: 0xf5f5f5,
    b2_colorYellow: 0xffff00,
    b2_colorYellowGreen: 0x9acd32,
    b2_colorBox2DRed: 0xdc3132,
    b2_colorBox2DBlue: 0x30aebf,
    b2_colorBox2DGreen: 0x8cc924,
    b2_colorBox2DYellow: 0xffee8c
};

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
export class b2DebugDraw
{
    constructor()
    {
        this.DrawPolygon = null;
        this.DrawImagePolygon = null;
        this.DrawSolidPolygon = null;
        this.DrawCircle = null;
        this.DrawImageCircle = null;
        this.DrawSolidCircle = null;
        this.DrawCapsule = null;
        this.DrawImageCapsule = null;
        this.DrawSolidCapsule = null;
        this.DrawSegment = null;
        this.DrawTransform = null;
        this.DrawPoint = null;
        this.DrawString = null;
        this.SetPosition = null;
        this.drawingBounds = new b2AABB();
        this.useDrawingBounds = false;          // PJB: not fully implemented in debug_draw.js
        this.positionOffset = new b2Vec2();
        this.drawShapes = true;
        this.drawJoints = false;
        this.drawAABBs = false;
        this.drawMass = false;
        this.drawContacts = false;
        this.drawGraphColors = false;
        this.drawContactNormals = false;
        this.drawContactImpulses = false;
        this.drawFrictionImpulses = false;
        this.context = null;
    }
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
export class b2Filter
{
    constructor()
    {
        this.categoryBits = 0x0001;
        this.maskBits = 0xFFFF;
        this.groupIndex = 0;
    }
}

/**
 * @class b2QueryFilter
 * @summary Filter used to control collision detection between queries and shapes
 * @property {number} categoryBits - The collision category bits of this query. Normally you would just set one bit.
 * @property {number} maskBits - The collision mask bits. This states the shape categories that this query would accept for collision.
 */
export class b2QueryFilter
{
    constructor()
    {
        this.categoryBits = 0xFFFF;
        this.maskBits = 0xFFFF;
    }
}
