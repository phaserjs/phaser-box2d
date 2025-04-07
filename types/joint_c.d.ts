/**
 * @namespace Joint
 */
/**
 * @import {b2WorldId, b2BodyId} from './include/id_h.js'
 */
/**
 * Creates a default distance joint definition with preset values.
 * @function b2DefaultDistanceJointDef
 * @returns {b2DistanceJointDef} A distance joint definition with:
 * - length set to 1
 * - maxLength set to B2_HUGE
 * - all other properties at their default values
 * @description
 * Creates and returns a new b2DistanceJointDef object initialized with specific default values.
 * The length is set to 1 unit and the maxLength is set to B2_HUGE. All other properties
 * of the joint definition retain their default values from the b2DistanceJointDef constructor.
 */
export function b2DefaultDistanceJointDef(): b2DistanceJointDef;
/**
 * Creates a b2MotorJointDef with default values.
 * @function b2DefaultMotorJointDef
 * @returns {b2MotorJointDef} A motor joint definition with:
 * - maxForce: 1
 * - maxTorque: 1
 * - correctionFactor: 0.3
 * - linearOffset: (0,0)
 * - angularOffset: 0
 * @description
 * Initializes a new b2MotorJointDef with common default values.
 * The joint definition includes preset values for maximum force,
 * maximum torque, and correction factor while using default
 * values for linear and angular offsets.
 */
export function b2DefaultMotorJointDef(): b2MotorJointDef;
/**
 * Creates a b2MouseJointDef with default settings.
 * @function b2DefaultMouseJointDef
 * @returns {b2MouseJointDef} A mouse joint definition with:
 * - hertz = 4
 * - dampingRatio = 1
 * - maxForce = 1
 * @description
 * Creates and returns a new b2MouseJointDef object initialized with default values
 * for frequency (hertz), damping ratio, and maximum force parameters.
 */
export function b2DefaultMouseJointDef(): b2MouseJointDef;
/**
 * Creates a default prismatic joint definition with preset values.
 * @function b2DefaultPrismaticJointDef
 * @returns {b2PrismaticJointDef} A prismatic joint definition with localAxisA set to (1,0)
 * @description
 * Creates and returns a new b2PrismaticJointDef instance with localAxisA initialized
 * to a unit vector pointing along the x-axis (1,0). All other properties retain their
 * default values from the b2PrismaticJointDef constructor.
 */
export function b2DefaultPrismaticJointDef(): b2PrismaticJointDef;
/**
 * Creates a default b2RevoluteJointDef with preset values.
 * @function b2DefaultRevoluteJointDef
 * @returns {b2RevoluteJointDef} A new revolution joint definition with drawSize set to 0.25
 * @description
 * Creates and initializes a new b2RevoluteJointDef with default values.
 * Sets the drawSize property to 0.25 for visualization purposes.
 */
export function b2DefaultRevoluteJointDef(): b2RevoluteJointDef;
/**
 * @summary Creates a new weld joint definition with default values.
 * @function b2DefaultWeldJointDef
 * @returns {b2WeldJointDef} A new weld joint definition with default configuration:
 * - localAnchorA: b2Vec2(0,0)
 * - localAnchorB: b2Vec2(0,0)
 * - referenceAngle: 0
 * - stiffness: 0
 * - damping: 0
 * @description
 * Creates and returns a new b2WeldJointDef object initialized with default values.
 * A weld joint essentially glues two bodies together at a reference point.
 */
export function b2DefaultWeldJointDef(): b2WeldJointDef;
/**
 * Creates a default wheel joint definition with preset values.
 * @function b2DefaultWheelJointDef
 * @returns {b2WheelJointDef} A wheel joint definition with:
 * - localAxisA set to (0,1)
 * - enableSpring set to true
 * - hertz set to 1
 * - dampingRatio set to 0.7
 * @description
 * Creates and returns a new b2WheelJointDef with common default values.
 * The joint's local axis is set to point upward, and spring behavior
 * is enabled with standard frequency and damping values.
 */
export function b2DefaultWheelJointDef(): b2WheelJointDef;
export function b2GetJoint(world: any, jointId: any): any;
export function b2GetJointSim(world: any, joint: any): any;
export function b2GetJointSimCheckType(jointId: any, type: any): any;
export function b2CreateJoint(world: any, bodyA: any, bodyB: any, userData: any, drawSize: any, type: any, collideConnected: any): b2JointPair;
export function b2DestroyContactsBetweenBodies(world: any, bodyA: any, bodyB: any): void;
/**
 * @function b2CreateDistanceJoint
 * @summary Creates a distance joint between two bodies in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2DistanceJointDef} def - The joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - length: Desired distance between anchor points
 * - minLength: Minimum allowed distance
 * - maxLength: Maximum allowed distance
 * - hertz: Spring frequency in Hz
 * - dampingRatio: Spring damping ratio
 * - maxMotorForce: Maximum motor force
 * - motorSpeed: Motor speed
 * - enableSpring: Enable/disable spring
 * - enableLimit: Enable/disable length limits
 * - enableMotor: Enable/disable motor
 * - collideConnected: Allow collision between connected bodies
 * - userData: User data
 * @returns {b2JointId} The ID of the created distance joint
 * @throws {Error} Throws assertion error if world is locked, bodies are invalid, or length <= 0
 */
export function b2CreateDistanceJoint(worldId: b2WorldId, def: b2DistanceJointDef): b2JointId;
/**
 * @function b2CreateMotorJoint
 * @summary Creates a motor joint between two bodies in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2MotorJointDef} def - The joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - linearOffset: The target linear offset between bodies
 * - angularOffset: The target angular offset between bodies
 * - maxForce: Maximum force that can be applied
 * - maxTorque: Maximum torque that can be applied
 * - correctionFactor: Position correction factor in [0,1]
 * - collideConnected: Whether bodies can collide
 * - userData: User data
 * @returns {b2JointId} The ID of the created motor joint
 * @throws {Error} If the world is locked when attempting to create the joint
 */
export function b2CreateMotorJoint(worldId: b2WorldId, def: b2MotorJointDef): b2JointId;
/**
 * @function b2CreateMouseJoint
 * @summary Creates a mouse joint in a Box2D world.
 * @param {b2WorldId} worldId - The ID of the Box2D world where the joint will be created
 * @param {b2MouseJointDef} def - The mouse joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - target: Target point in world coordinates
 * - hertz: Frequency in Hertz
 * - dampingRatio: Damping ratio
 * - maxForce: Maximum force
 * - userData: User data
 * - collideConnected: Whether connected bodies can collide
 * @returns {b2JointId} The ID of the created mouse joint
 * @throws {Error} Throws an assertion error if the world is locked
 * @description
 * Creates a mouse joint between two bodies at a specified target point. The joint
 * transforms the target point into local coordinates for both bodies and initializes
 * the joint properties including frequency, damping ratio, and maximum force.
 */
export function b2CreateMouseJoint(worldId: b2WorldId, def: b2MouseJointDef): b2JointId;
/**
 * @summary Creates a revolute joint between two bodies in a Box2D world
 * @function b2CreateRevoluteJoint
 * @param {b2WorldId} worldId - The ID of the Box2D world
 * @param {b2RevoluteJointDef} def - The joint definition containing properties like:
 * - bodyIdA: ID of first body
 * - bodyIdB: ID of second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - referenceAngle: Initial angle between bodies (clamped to [-π,π])
 * - hertz: Spring frequency
 * - dampingRatio: Spring damping ratio
 * - lowerAngle: Lower angle limit (clamped to [-π,π])
 * - upperAngle: Upper angle limit (clamped to [-π,π])
 * - maxMotorTorque: Maximum motor torque
 * - motorSpeed: Motor speed
 * - enableSpring: Enable spring behavior
 * - enableLimit: Enable angle limits
 * - enableMotor: Enable motor
 * - collideConnected: Allow collision between connected bodies
 * - userData: User data
 * - drawSize: Drawing size
 * @returns {b2JointId} ID of the created revolute joint
 * @throws {Error} If the world is locked
 */
export function b2CreateRevoluteJoint(worldId: b2WorldId, def: b2RevoluteJointDef): b2JointId;
/**
 * @function b2CreatePrismaticJoint
 * @description
 * Creates a prismatic joint between two bodies in a Box2D world. A prismatic joint
 * constrains two bodies to move relative to each other along a specified axis.
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2PrismaticJointDef} def - The joint definition containing:
 * - bodyIdA: First body ID
 * - bodyIdB: Second body ID
 * - localAnchorA: Anchor point on body A in local coordinates
 * - localAnchorB: Anchor point on body B in local coordinates
 * - localAxisA: The axis of translation in body A's local coordinates
 * - referenceAngle: The initial angle between the bodies
 * - enableLimit: Whether translation limits are enabled
 * - lowerTranslation: Lower translation limit
 * - upperTranslation: Upper translation limit
 * - enableMotor: Whether the motor is enabled
 * - motorSpeed: Motor speed
 * - maxMotorForce: Maximum motor force
 * - enableSpring: Whether spring is enabled
 * - hertz: Spring frequency in Hz
 * - dampingRatio: Spring damping ratio
 * - collideConnected: Whether connected bodies can collide
 * - userData: User data
 * @returns {b2JointId} The identifier for the created prismatic joint
 */
export function b2CreatePrismaticJoint(worldId: b2WorldId, def: b2PrismaticJointDef): b2JointId;
/**
 * Creates a weld joint between two bodies in a Box2D world.
 * @function b2CreateWeldJoint
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2WeldJointDef} def - The weld joint definition containing:
 * - bodyIdA: ID of the first body
 * - bodyIdB: ID of the second body
 * - localAnchorA: Local anchor point on body A
 * - localAnchorB: Local anchor point on body B
 * - referenceAngle: Reference angle between the bodies
 * - linearHertz: Frequency for the linear constraint
 * - linearDampingRatio: Damping ratio for the linear constraint
 * - angularHertz: Frequency for the angular constraint
 * - angularDampingRatio: Damping ratio for the angular constraint
 * - collideConnected: Whether the connected bodies can collide
 * - userData: User data associated with the joint
 * @returns {b2JointId} The identifier of the created weld joint
 * @throws {Error} Throws an assertion error if the world is locked
 */
export function b2CreateWeldJoint(worldId: b2WorldId, def: b2WeldJointDef): b2JointId;
/**
 * @function b2CreateWheelJoint
 * @param {b2WorldId} worldId - The identifier of the Box2D world
 * @param {b2WheelJointDef} def - The wheel joint definition containing configuration parameters
 * @returns {b2JointId} The identifier of the created wheel joint
 * @description
 * Creates a wheel joint between two bodies in a Box2D world. A wheel joint provides two degrees of
 * freedom: translation along a specified axis and rotation about an orthogonal axis. The joint can
 * be configured with a spring and damper mechanism, translation limits, and a motor.
 * @throws {Error} Throws an assertion error if the world is locked
 * @note If collideConnected is false, any contacts between the connected bodies are destroyed
 */
export function b2CreateWheelJoint(worldId: b2WorldId, def: b2WheelJointDef): b2JointId;
export function b2DestroyJointInternal(world: any, joint: any, wakeBodies: any): void;
/**
 * @function b2DestroyJoint
 * @param {b2JointId} jointId - The identifier of the joint to be destroyed
 * @returns {void}
 * @description
 * Destroys a joint in the physics world. If the world is locked (e.g. during collision detection
 * or integration), the function will return without destroying the joint. The function internally
 * calls b2DestroyJointInternal to handle the actual joint destruction.
 * @throws {Error} Throws an assertion error if attempting to destroy a joint in a locked world
 */
export function b2DestroyJoint(jointId: b2JointId): void;
/**
 * Gets the type of a joint from its ID.
 * @function b2Joint_GetType
 * @param {b2JointId} jointId - The ID of the joint to query.
 * @returns {b2JointType} The type of the specified joint.
 * @description
 * Retrieves the joint type from the world using the provided joint ID.
 * The function first gets the world reference from the joint ID,
 * then retrieves the full joint object to access its type property.
 */
export function b2Joint_GetType(jointId: b2JointId): {
    b2_distanceJoint: number;
    b2_motorJoint: number;
    b2_mouseJoint: number;
    b2_prismaticJoint: number;
    b2_revoluteJoint: number;
    b2_weldJoint: number;
    b2_wheelJoint: number;
    b2_unknown: number;
};
/**
 * @summary Gets the first body connected to a joint.
 * @function b2Joint_GetBodyA
 * @param {b2JointId} jointId - The identifier of the joint.
 * @returns {b2BodyId} The identifier of the first body connected to the joint.
 * @description
 * This function retrieves the identifier of the first body (body A) that is
 * connected to the specified joint. The joint must exist in the world referenced
 * by the jointId.
 */
export function b2Joint_GetBodyA(jointId: b2JointId): b2BodyId;
/**
 * @summary Gets the second body (body B) connected to a joint.
 * @function b2Joint_GetBodyB
 * @param {b2JointId} jointId - The identifier of the joint.
 * @returns {b2BodyId} The identifier of body B connected to the joint.
 * @description
 * This function retrieves the identifier of the second body (body B) that is
 * connected to the specified joint. The joint must exist in the world referenced
 * by the jointId.
 */
export function b2Joint_GetBodyB(jointId: b2JointId): b2BodyId;
/**
 * @function b2Joint_GetLocalAnchorA
 * @summary Gets the local anchor point A of a joint.
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The local anchor point A in the body A frame.
 * @description
 * Retrieves the local anchor point A from a joint's simulation data. The anchor point
 * is expressed in the local coordinate system of body A.
 */
export function b2Joint_GetLocalAnchorA(jointId: b2JointId): b2Vec2;
/**
 * @function b2Joint_GetLocalAnchorB
 * @summary Gets the local anchor point B of a joint.
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The local anchor point B in the body's local coordinates.
 * @description
 * Retrieves the local anchor point B of a joint, which represents the connection
 * point on the second body (body B) in that body's local coordinate system.
 */
export function b2Joint_GetLocalAnchorB(jointId: b2JointId): b2Vec2;
/**
 * Sets whether two bodies connected by a joint should collide with each other.
 * @function b2Joint_SetCollideConnected
 * @param {b2JointId} jointId - The identifier for the joint to modify.
 * @param {boolean} shouldCollide - True to enable collision between connected bodies, false to disable.
 * @returns {void}
 * @description
 * When enabled, the bodies connected by the joint can collide with each other.
 * When disabled, collisions between the connected bodies are filtered out.
 * The function updates the broadphase when enabling collisions and destroys
 * existing contacts between the bodies when disabling collisions.
 */
export function b2Joint_SetCollideConnected(jointId: b2JointId, shouldCollide: boolean): void;
/**
 * @function b2Joint_GetCollideConnected
 * @param {b2JointId} jointId - The ID of the joint to query
 * @returns {boolean} Whether the connected bodies can collide with each other
 * @description
 * Gets the collideConnected flag for the specified joint. This flag determines if
 * the two bodies connected by this joint are allowed to collide with each other.
 */
export function b2Joint_GetCollideConnected(jointId: b2JointId): boolean;
/**
 * @summary Sets the user data for a joint.
 * @function b2Joint_SetUserData
 * @param {b2JointId} jointId - The identifier for the joint to modify.
 * @param {*} userData - The user data to associate with the joint.
 * @returns {void}
 * @description
 * Associates arbitrary user data with a specified joint in the physics world.
 * The joint is located using its world and joint identifiers, and its user data
 * property is updated with the provided value.
 */
export function b2Joint_SetUserData(jointId: b2JointId, userData: any): void;
/**
 * @summary Gets the user data associated with a joint.
 * @function b2Joint_GetUserData
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {void} The user data associated with the joint.
 * @description
 * Retrieves the user data that was previously attached to the specified joint.
 * The function first gets the world object from the joint ID, then retrieves
 * the joint using the full joint ID, and finally returns the userData property
 * of that joint.
 */
export function b2Joint_GetUserData(jointId: b2JointId): void;
/**
 * @function b2Joint_WakeBodies
 * @description
 * Wakes up both bodies connected by a joint in the physics simulation.
 * @param {b2JointId} jointId - The identifier for the joint whose connected bodies should be awakened.
 * @returns {void}
 * @throws {Error} If the world reference in the jointId is invalid or cannot be accessed.
 */
export function b2Joint_WakeBodies(jointId: b2JointId): void;
/**
 * Gets the constraint force for a joint.
 * @function b2Joint_GetConstraintForce
 * @param {b2JointId} jointId - The identifier for the joint.
 * @returns {b2Vec2} The constraint force vector. Returns (0,0) for unknown joint types.
 * @description
 * Returns the constraint force for different joint types including distance, motor,
 * mouse, prismatic, revolute, weld, and wheel joints. The force is retrieved from
 * the corresponding joint-specific force getter function.
 * @throws {Error} Throws an assertion error for unknown joint types.
 */
export function b2Joint_GetConstraintForce(jointId: b2JointId): b2Vec2;
/**
 * @function b2Joint_GetConstraintTorque
 * @summary Gets the constraint torque for a joint.
 * @param {b2JointId} jointId - The ID of the joint to get the constraint torque from.
 * @returns {number} The constraint torque value. Returns 0 for distance joints or if joint type is invalid.
 * @description
 * Returns the constraint torque for different joint types including motor, mouse, prismatic,
 * revolute, weld and wheel joints. For distance joints, it always returns 0.
 * @throws {Error} Throws an assertion error if an unsupported joint type is provided.
 */
export function b2Joint_GetConstraintTorque(jointId: b2JointId): number;
export function b2PrepareJoint(joint: any, context: any): void;
export function b2WarmStartJoint(joint: any, context: any): void;
export function b2SolveJoint(joint: any, context: any, useBias: any): void;
export function b2PrepareOverflowJoints(context: any): void;
export function b2WarmStartOverflowJoints(context: any): void;
export function b2SolveOverflowJoints(context: any, useBias: any): void;
export function b2DrawJoint(draw: any, world: any, joint: any): void;
import { b2DistanceJointDef } from "./include/types_h.js";
import { b2MotorJointDef } from "./include/types_h.js";
import { b2MouseJointDef } from "./include/types_h.js";
import { b2PrismaticJointDef } from "./include/types_h.js";
import { b2RevoluteJointDef } from "./include/types_h.js";
import { b2WeldJointDef } from "./include/types_h.js";
import { b2WheelJointDef } from "./include/types_h.js";
declare class b2JointPair {
    constructor(joint?: any, jointSim?: any);
    joint: any;
    jointSim: any;
}
import type { b2WorldId } from './include/id_h.js';
import { b2JointId } from "./include/id_h.js";
import type { b2BodyId } from './include/id_h.js';
import { b2Vec2 } from "./include/math_functions_h.js";
export {};
