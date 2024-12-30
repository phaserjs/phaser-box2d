/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2BodyDef, b2BodyType, b2ChainDef, b2Filter, b2QueryFilter, b2ShapeDef, b2WorldDef } from './include/types_h.js';
import { b2Rot, b2Vec2 } from './include/math_functions_h.js';

import { b2_lengthUnitsPerMeter } from './include/core_h.js';

/**
 * @namespace Types
 */

export const b2Validation = false;

export const b2Assert = function(condition, message, forceCheck = false)
{
    if (b2Validation || forceCheck)
    {
        if (!condition)
        {
            const error = new Error(message);
            error.stack = error.stack.split('\n').slice(1)[0];
            console.assert(false, error);
        }
    }
};

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
export function b2DefaultWorldDef()
{
    const def = new b2WorldDef();
    def.gravity = new b2Vec2(0.0, -10.0);
    def.hitEventThreshold = 1.0 * b2_lengthUnitsPerMeter;
    def.restitutionThreshold = 10.0 * b2_lengthUnitsPerMeter;
    def.contactPushoutVelocity = 5.0 * b2_lengthUnitsPerMeter;
    def.contactHertz = 30.0;
    def.contactDampingRatio = 10.0;
    def.jointHertz = 60.0;
    def.jointDampingRatio = 5.0;
    def.maximumLinearVelocity = 400.0 * b2_lengthUnitsPerMeter;
    def.enableSleep = true;
    def.enableContinuous = true;

    return def;
}

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
export function b2DefaultBodyDef()
{
    const def = new b2BodyDef();
    def.type = b2BodyType.b2_staticBody;
    def.position = new b2Vec2(0, 0);
    def.rotation = new b2Rot(1, 0);
    def.linearVelocity = new b2Vec2(0, 0);
    def.angularVelocity = 0;
    def.linearDamping = 0;
    def.angularDamping = 0;
    def.gravityScale = 1.0;
    def.sleepThreshold = 0.05 * b2_lengthUnitsPerMeter;
    def.userData = null;
    def.enableSleep = true;
    def.isAwake = true;
    def.fixedRotation = false;
    def.isBullet = false;
    def.isEnabled = true;
    def.updateBodyMass = true;
    def.allowFastRotation = false;

    return def;
}

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
export function b2DefaultFilter()
{
    const filter = new b2Filter();
    filter.categoryBits = 0x00000001;
    filter.maskBits = 0xffffffff;
    filter.groupIndex = 0;

    return filter;
}

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
export function b2DefaultQueryFilter()
{
    const filter = new b2QueryFilter();
    filter.categoryBits = 0x00000001;
    filter.maskBits = 0xffffffff;

    return filter;
}

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
export function b2DefaultShapeDef()
{
    const def = new b2ShapeDef();
    def.friction = 0.6;
    def.density = 1.0;
    def.restitution = 0.1;
    def.filter = b2DefaultFilter();
    def.enableSensorEvents = true;
    def.enableContactEvents = true;

    return def;
}

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
export function b2DefaultChainDef()
{
    const def = new b2ChainDef();
    def.friction = 0.6;
    def.filter = b2DefaultFilter();

    return def;
}
