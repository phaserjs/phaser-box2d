/**
 * Creates a default world definition with pre-configured physics simulation parameters.
 * @function b2DefaultWorldDef
 * @returns {b2WorldDef} A world definition object with the following properties:
 * - gravity: {b2Vec2} Set to (0, -10)
 * - hitEventThreshold: {number} Set to 1 meter
 * - restitutionThreshold: {number} Set to 10 meters
 * - contactPushoutVelocity: {number} Set to 5 meters
 * - contactHertz: {number} Set to 30
 * - contactDampingRatio: {number} Set to 10
 * - jointHertz: {number} Set to 60
 * - jointDampingRatio: {number} Set to 5
 * - maximumLinearVelocity: {number} Set to 400 meters
 * - enableSleep: {boolean} Set to true
 * - enableContinuous: {boolean} Set to true
 * @description
 * Initializes a new b2WorldDef with default values suitable for standard physics simulations.
 * All distance-based values are scaled by b2_lengthUnitsPerMeter2.
 */
export function b2DefaultWorldDef(): b2WorldDef;
/**
 * Creates a new b2BodyDef with default values.
 * @function b2DefaultBodyDef
 * @returns {b2BodyDef} A body definition object with the following default properties:
 * - type: b2_staticBody
 * - position: (0,0)
 * - rotation: (cos=1, sin=0)
 * - linearVelocity: (0,0)
 * - angularVelocity: 0
 * - linearDamping: 0
 * - angularDamping: 0
 * - gravityScale: 1
 * - sleepThreshold: 0.05 * b2_lengthUnitsPerMeter2
 * - userData: null
 * - enableSleep: true
 * - isAwake: true
 * - fixedRotation: false
 * - isBullet: false
 * - isEnabled: true
 * - updateBodyMass: true
 * - allowFastRotation: false
 */
export function b2DefaultBodyDef(): b2BodyDef;
/**
 * @summary Creates a default collision filter with standard values.
 * @function b2DefaultFilter
 * @returns {b2Filter} A filter object with categoryBits=1, maskBits=4294967295 (0xFFFFFFFF), and groupIndex=0
 * @description
 * Creates and returns a new b2Filter object initialized with default values for collision filtering.
 * The categoryBits determine what collision category this object belongs to,
 * the maskBits determine what categories this object can collide with,
 * and the groupIndex determines collision groups (negative values mean never collide,
 * positive values mean always collide with same group).
 */
export function b2DefaultFilter(): b2Filter;
/**
 * Creates a default query filter with standard settings.
 * @function b2DefaultQueryFilter
 * @returns {b2QueryFilter} A query filter object with categoryBits set to 1 and
 * maskBits set to 4294967295 (0xFFFFFFFF).
 * @description
 * This function instantiates a new b2QueryFilter with default collision filtering
 * settings. The categoryBits value of 1 represents the default category, while
 * the maskBits value of 4294967295 allows collision with all categories.
 */
export function b2DefaultQueryFilter(): b2QueryFilter;
/**
 * Creates a default shape definition with standard physics properties.
 * @function b2DefaultShapeDef
 * @returns {b2ShapeDef} A shape definition object with the following default values:
 * - friction: 0.6
 * - density: 1
 * - restitution: 0.1
 * - filter: default collision filter
 * - enableSensorEvents: true
 * - enableContactEvents: true
 * @description
 * This function initializes a new b2ShapeDef object with commonly used physics
 * properties. The shape definition can be used to create various types of
 * physics shapes in Box2D.
 */
export function b2DefaultShapeDef(): b2ShapeDef;
/**
 * Creates a new b2ChainDef with default values.
 * @function b2DefaultChainDef
 * @returns {b2ChainDef} A chain definition object with:
 * - friction set to 0.6
 * - default filter settings
 * - all other properties at their default values
 * @description
 * Initializes a new chain definition with common default values.
 * The chain shape represents a series of connected line segments.
 */
export function b2DefaultChainDef(): b2ChainDef;
/**
 * @namespace Types
 */
export const b2Validation: false;
export function b2Assert(condition: any, message: any, forceCheck?: boolean): void;
import { b2WorldDef } from './include/types_h.js';
import { b2BodyDef } from './include/types_h.js';
import { b2Filter } from './include/types_h.js';
import { b2QueryFilter } from './include/types_h.js';
import { b2ShapeDef } from './include/types_h.js';
import { b2ChainDef } from './include/types_h.js';
