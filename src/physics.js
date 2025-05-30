/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { B2_MAX_POLYGON_VERTICES, b2Capsule, b2Circle } from './include/collision_h.js';
import { b2Add, b2Distance, b2RelativeAngle, b2Rot, b2MakeRot, b2Transform, b2Vec2 } from './include/math_functions_h.js';
import
{
    b2BodyType,
    b2DefaultBodyDef,
    b2DefaultShapeDef,
    b2DefaultWorldDef,
    b2DistanceJointDef,
    b2HexColor,
    b2MotorJointDef,
    b2MouseJointDef,
    b2PrismaticJointDef,
    b2RevoluteJointDef,
    b2WeldJointDef,
    b2WheelJointDef
} from './include/types_h.js';
import { b2Body_GetRotation, b2Body_GetTransform, b2Body_SetTransform, b2Body_SetUserData, b2CreateBody, b2DestroyBody, b2GetBodyTransform } from './include/body_h.js';
import { b2CreateCapsuleShape, b2CreateCircleShape, b2CreatePolygonShape } from './include/shape_h.js';
import { b2CreateDistanceJoint, b2CreateMotorJoint, b2CreateMouseJoint, b2CreatePrismaticJoint, b2CreateRevoluteJoint, b2CreateWeldJoint, b2CreateWheelJoint } from './include/joint_h.js';
import { b2CreateWorld, b2CreateWorldArray, b2World_Step } from './include/world_h.js';
import { b2MakeBox, b2MakeOffsetBox, b2MakeOffsetPolygon, b2MakePolygon } from './include/geometry_h.js';

import { DYNAMIC } from './main.js';
import { b2ComputeHull } from './include/hull_h.js';

/**
 * @namespace Physics
 */

// local 

function setIfDef (obj, prop, value)
{
    if (value !== undefined)
    {
        obj[ prop ] = value;

        return true;
    }

    return false;
}

export const WorldSprites = new Map();

let SCALE = 30.0;

/**
 * Set the scale of the Box2D World when converting from pixels to meters.
 *
 * @export
 * @param {number} scale
 */
export function SetWorldScale (scale)
{
    SCALE = scale;
}

/**
 * Get the current scale of the Box2D World, as used when converting from pixels to meters.
 *
 * @export
 * @returns {number}
 */
export function GetWorldScale ()
{
    return SCALE;
}

/**
 * Converts a single numerical value from meters to pixels.
 *
 * @export
 * @param {number} meters
 * @returns {number}
 */
export function mpx (meters)
{
    return meters * SCALE;
}

/**
 * Converts a single numerical value from pixels to meters.
 *
 * @export
 * @param {number} pixels
 * @returns {number}
 */
export function pxm (pixels)
{
    return pixels / SCALE;
}

/**
 * Converts the given x and y values from pixels to meters, stored in a new b2Vec2.
 *
 * @export
 * @param {number} x
 * @param {number} y
 * @returns {b2Vec2}
 */
export function pxmVec2 (x, y)
{
    return new b2Vec2(x / SCALE, y / SCALE);
}

/**
 * Convets the given value in radians to a b2Rot object, used for Box2D rotations.
 *
 * @export
 * @param {number} radians
 * @returns {b2Rot}
 */
export function RotFromRad (radians)
{
    return new b2Rot(Math.cos(-radians), Math.sin(-radians));
}

/**
 * Adds a Sprite Game Object to the given World, attaching it to the given Body.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @param {b2Body} body
 */
export function AddSpriteToWorld (worldId, sprite, body)
{
    if (!WorldSprites.has(worldId))
    {
        WorldSprites.set(worldId, new Map());
    }

    WorldSprites.get(worldId).set(sprite, body);
}

/**
 * Removes a Sprite Game Object from the given World, optionally destroying the Body it was attached to.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @param {boolean} [destroyBody=false]
 */
export function RemoveSpriteFromWorld (worldId, sprite, destroyBody = false)
{
    if (WorldSprites.has(worldId))
    {
        const worldMap = WorldSprites.get(worldId);
        const body = worldMap.get(sprite);

        if (body && destroyBody)
        {
            const bodyId = body.bodyId;
            b2DestroyBody(bodyId);
        }

        worldMap.delete(sprite);
    }
}

/**
 * Clears all Sprite to Body pairs.
 * Neither the Sprites nor the Bodies are destroyed.
 * The bodies remain in the world.
 *
 * @export
 * @param {number} worldId
 */
export function ClearWorldSprites (worldId)
{
    if (WorldSprites.has(worldId))
    {
        WorldSprites.get(worldId).clear();
    }
}

/**
 * Returns the Body attached to the given Sprite in the given World.
 * Or `null` if no such pair exists.
 *
 * @export
 * @param {number} worldId
 * @param {Sprite} sprite
 * @returns {Sprite|null} Either the sprite, or `null`.
 */
export function GetBodyFromSprite (worldId, sprite)
{
    if (WorldSprites.has(worldId))
    {
        return WorldSprites.get(worldId).get(sprite);
    }

    return null;
}

/**
 * Runs through all World-Sprite pairs and updates the Sprite positions and rotations to match the Body.
 * 
 * @param {number} worldId 
 */
export function UpdateWorldSprites (worldId)
{
    if (WorldSprites.has(worldId))
    {
        WorldSprites.get(worldId).forEach((body, sprite) =>
        {
            BodyToSprite(body, sprite);
        });
    }
}

/**
 * Converts a Box2D Body's position and rotation to a Sprite's position and rotation.
 * 
 * This is called automatically by `UpdateWorldSprites`.
 *
 * @export
 * @param {b2Body} body
 * @param {Sprite} sprite
 */
export function BodyToSprite (body, sprite)
{
    const t = b2Body_GetTransform(body.bodyId);

    sprite.x = t.p.x * SCALE;
    sprite.y = -(t.p.y * SCALE);
    sprite.rotation = -Math.atan2(t.q.s, t.q.c);
}

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
export function SpriteToBox (worldId, sprite, data)
{
    const scaleX = sprite?.scaleX || sprite?.scale?.x || 1;
    const scaleY = sprite?.scaleY || sprite?.scale?.y || 1;

    const props = {
        worldId,
        type: DYNAMIC,
        size: pxmVec2((sprite.width * scaleX) / 2, (sprite.height * scaleY) / 2)
    };

    const body = CreateBoxPolygon({ ...props, ...data });

    b2Body_SetTransform(
        body.bodyId,
        pxmVec2(sprite.x, -sprite.y),
        RotFromRad(sprite.rotation)
    );

    return body;
}

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
export function SpriteToCircle (worldId, sprite, data)
{
    const scaleX = sprite?.scaleX || sprite?.scale?.x || 1;
    const scaleY = sprite?.scaleY || sprite?.scale?.y || 1;

    const props = {
        worldId,
        type: DYNAMIC,
        size: pxmVec2((sprite.width * scaleX) / 2, (sprite.height * scaleY) / 2)
    };

    const body = CreateCircle({ ...props, ...data });

    b2Body_SetTransform(
        body.bodyId,
        pxmVec2(sprite.x, -sprite.y),
        RotFromRad(sprite.rotation)
    );

    return body;
}

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
export function CreateWorld (data)
{
    let worldDef = data.worldDef;

    if (!worldDef)
    {
        worldDef = b2DefaultWorldDef();
    }

    // make sure the world array has been created
    b2CreateWorldArray();
    const worldId = b2CreateWorld(worldDef);

    return { worldId: worldId };
}

/**
 * @typedef {Object} WorldStepConfig
 * @property {b2WorldId} worldId - The world ID value
 * @property {number} deltaTime - How long has it been since the last call (e.g. the value passed to a RAF update)
 * @property {number} [fixedTimeStep = 1/60] - Duration of the fixed timestep for the Physics simulation
 * @property {number} [subStepCount = 4] - Number of sub-steps performed per world step
 */

let _accumulator = 0;

/**
 * Steps a physics world to match fixedTimeStep.
 * Returns the average time spent in the step function.
 * 
 * @param {WorldConfig} data - Configuration for the world.
 * @returns {number} totalTime - Time spent processing the step function, in seconds.
 */
export function WorldStep (data)
{
    let fixedTimeStep = data.fixedTimeStep;

    if (!fixedTimeStep)
    { fixedTimeStep = 1 / 60; }
    let subStepCount = data.subStepCount;

    if (!subStepCount)
    { subStepCount = 4; }

    const borrowedTime = fixedTimeStep * 2.0;
    _accumulator = Math.min(_accumulator + data.deltaTime, fixedTimeStep + borrowedTime);

    // try to catch-up if we've skipped some frames
    const catchUpMax = 2;
    let c = catchUpMax;

    // if we've been running below the fixedTimeStep, don't attempt to catch-up
    if (data.deltaTime > fixedTimeStep)
    {
        c = 0;
    }

    let totalTime = 0;

    // while we owe time, have some catch-up count remaining, and haven't used the entire fixedTimeStep yet...
    while (_accumulator >= fixedTimeStep && c-- >= 0 && totalTime < fixedTimeStep)
    {
        const start = performance.now();
        b2World_Step(data.worldId, fixedTimeStep, subStepCount);
        const end = performance.now();
        totalTime = (end - start) / 1000;
        _accumulator -= fixedTimeStep;
    }

    return totalTime;
}

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
 * @propery {b2Capsule} object - The capsule object to attach.
 */

/**
 * Creates a chain of capsules with each one linked to the previous and next one.
 * @param {ChainConfig} data - Configuration for the chain.
 * @returns {BodyCapsule[]} A list of each link's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreateChain (data)
{
    const chainSpacing = b2Distance(data.firstLinkPosition, data.lastLinkPosition) / data.chainLinks;
    const type = data.type !== undefined ? data.type : b2BodyType.b2_dynamicBody;
    const density = data.density !== undefined ? data.density : 1.0;
    const friction = data.friction !== undefined ? data.friction : 0.5;
    const color = data.color !== undefined ? data.color : b2HexColor.b2_colorGold;
    const radius = data.radius !== undefined ? data.radius : 0.5;

    var lastLink = null;
    var position = b2Add(data.firstLinkPosition, new b2Vec2(data.linkLength, 0));

    const listLinks = [];

    for (let i = 0; i < data.chainLinks; i++)
    {
        // const link = CreateBoxPolygon({ worldId:world.worldId, type:b2BodyType.b2_dynamicBody, position:position, size:new b2Vec2(linkLength / 2,0.5), density:1.0, friction:0.2, groupIndex:-1, color:b2HexColor.b2_colorGold });
        const link = CreateCapsule({ worldId: data.worldId, type: type, position: position, center1: new b2Vec2(-data.linkLength / 2 + data.radius, 0), center2: new b2Vec2(data.linkLength / 2 - data.radius, 0), radius: radius, density: density, friction: friction, groupIndex: -1, color: color });
        listLinks.push(link);

        if (i == 0) // connect first link to solid
        {
            if (data.fixEnds)
            {
                CreateRevoluteJoint({
                    worldId: data.worldId,
                    bodyIdA: data.groundId,
                    bodyIdB: link.bodyId,
                    anchorA: data.firstLinkPosition,
                    anchorB: new b2Vec2(-data.linkLength / 2, 0),
                });
            }
        }
        else    // connect each link to the last one
        {
            CreateRevoluteJoint({
                worldId: data.worldId,
                bodyIdA: lastLink.bodyId,
                bodyIdB: link.bodyId,
                anchorA: new b2Vec2(data.linkLength / 2, 0),
                anchorB: new b2Vec2(-data.linkLength / 2, 0),
            });
        }
        lastLink = link;

        // Lay out all the pieces in a straight line overlapping each other if necessary
        position = b2Add(position, new b2Vec2(chainSpacing, 0));
    }

    if (data.fixEnds)
    {
        // connect the last link to solid
        CreateRevoluteJoint({
            worldId: data.worldId,
            bodyIdA: data.groundId,
            bodyIdB: lastLink.bodyId,
            anchorA: data.lastLinkPosition,
            anchorB: new b2Vec2(data.linkLength / 2, 0),
        });
    }

    return listLinks;
}

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
export function CreateCircle (data)
{
    let bodyDef = data.bodyDef;

    if (!bodyDef)
    {
        bodyDef = b2DefaultBodyDef();
    }
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);

    // if bodyId is in the data, this box is a fixture for the body specified
    let bodyId = data.bodyId;

    if (!bodyId)
    {
        bodyId = b2CreateBody(data.worldId, bodyDef);
    }

    let shapeDef = data.shapeDef;

    if (!shapeDef)
    {
        shapeDef = b2DefaultShapeDef();
    }
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef.filter, "categoryBits", data.categoryBits);
    setIfDef(shapeDef.filter, "maskBits", data.maskBits);
    setIfDef(shapeDef, "customColor", data.color);
    setIfDef(shapeDef, "enablePreSolveEvents", data.preSolve);
    setIfDef(shapeDef, "isSensor", data.isSensor);
    setIfDef(shapeDef, "restitution", data.restitution);

    const ball = new b2Circle();
    setIfDef(ball, "radius", data.radius);

    if (data.bodyId)
    {
        setIfDef(ball, "center", data.offset);
    }

    const shapeId = b2CreateCircleShape(bodyId, shapeDef, ball);

    return { bodyId: bodyId, shapeId: shapeId, object: ball };
}

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
export function CreateCapsule (data)
{
    let bodyDef = data.bodyDef;

    if (!bodyDef)
    {
        bodyDef = b2DefaultBodyDef();
    }
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);
    setIfDef(bodyDef, "fixedRotation", data.fixedRotation);
    setIfDef(bodyDef, "linearDamping", data.linearDamping);

    // if bodyId is in the data, this box is a fixture for the body specified
    let bodyId = data.bodyId;

    if (!bodyId)
    {
        bodyId = b2CreateBody(data.worldId, bodyDef);
    }

    let shapeDef = data.shapeDef;

    if (!shapeDef)
    {
        shapeDef = b2DefaultShapeDef();
    }
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef.filter, "categoryBits", data.categoryBits);
    setIfDef(shapeDef.filter, "maskBits", data.maskBits);
    setIfDef(shapeDef, "customColor", data.color);

    const capsule = new b2Capsule();

    if (data.width)
    {
        data.radius = data.width / 2;
    }

    if (data.height)
    {
        data.radius = Math.min(data.radius, data.height / 2);
        data.center1 = new b2Vec2(0, -(data.height / 2));
        data.center2 = new b2Vec2(0, data.height / 2);
    }

    setIfDef(capsule, "center1", data.center1);
    setIfDef(capsule, "center2", data.center2);
    setIfDef(capsule, "radius", data.radius);
    const shapeId = b2CreateCapsuleShape(bodyId, shapeDef, capsule);

    return { bodyId: bodyId, shapeId: shapeId, object: capsule };
}

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
export function CreateBoxPolygon (data)
{
    let bodyDef = data.bodyDef;

    if (!bodyDef)
    {
        bodyDef = b2DefaultBodyDef();
    }
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);
    setIfDef(bodyDef, "fixedRotation", data.fixedRotation);
    setIfDef(bodyDef, "linearDamping", data.linearDamping);
    setIfDef(bodyDef, "angularDamping", data.angularDamping);

    // if bodyId is in the data, this box is a fixture for the body specified
    let bodyId = data.bodyId;

    if (!bodyId)
    {
        bodyId = b2CreateBody(data.worldId, bodyDef);
    }

    let shapeDef = data.shapeDef;

    if (!shapeDef)
    {
        shapeDef = b2DefaultShapeDef();
    }

    const userData = data.userData;

    if (userData)
    {
        b2Body_SetUserData(bodyId, data.userData);
    }

    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef, "restitution", data.restitution);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef.filter, "categoryBits", data.categoryBits);
    setIfDef(shapeDef.filter, "maskBits", data.maskBits);
    setIfDef(shapeDef, "customColor", data.color);
    setIfDef(shapeDef, "enablePreSolveEvents", data.preSolve);

    // data.size can be a b2Vec2 or a number
    let box;

    if (data.size instanceof b2Vec2)
    {
        if (data.bodyId)
        {
            box = b2MakeOffsetBox(data.size.x, data.size.y, data.position, b2MakeRot(0));
        }
        else
        {
            box = b2MakeBox(data.size.x, data.size.y);
        }
    }
    else
    {
        box = b2MakeBox(data.size, data.size);
    }

    const shapeId = b2CreatePolygonShape(bodyId, shapeDef, box);

    return { bodyId: bodyId, shapeId: shapeId, object: box };
}

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
export function CreateNGonPolygon (data)
{
    if (data.sides < 3 || data.sides > B2_MAX_POLYGON_VERTICES)
    {
        console.warn(`WARNING: invalid number of sides for a polygon (${data.sides}).`);

        return null;
    }

    const bodyDef = data.bodyDef || b2DefaultBodyDef();
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);

    let bodyId = data.bodyId;

    if (!bodyId)
    {
        bodyId = b2CreateBody(data.worldId, bodyDef);
    }

    const shapeDef = data.shapeDef || b2DefaultShapeDef();
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef, "customColor", data.color);

    const vertices = [];
    const angleStep = (2 * Math.PI) / data.sides;

    for (let i = 0; i < data.sides; i++)
    {
        const angle = i * angleStep;
        const x = data.radius * Math.cos(angle);
        const y = data.radius * Math.sin(angle);
        vertices.push(new b2Vec2(x, y));
    }

    let nGon;
    const hull = b2ComputeHull(vertices, data.sides);

    if (data.bodyId != null)
    {
        const oldxf = b2GetBodyTransform(data.worldId, data.bodyId);
        const xf = new b2Transform(data.position, oldxf.q);
        nGon = b2MakeOffsetPolygon(hull, 0, xf);
    }
    else
    {
        nGon = b2MakePolygon(hull, 0);
    }

    const shapeId = b2CreatePolygonShape(bodyId, shapeDef, nGon);

    return { bodyId: bodyId, shapeId: shapeId, object: nGon };
}


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
export function CreatePolygon (data)
{
    if (data.vertices.length < 3 || data.vertices.length > B2_MAX_POLYGON_VERTICES)
    {
        console.warn(`WARNING: invalid number of sides for a polygon (${data.vertices.length}).`);

        return null;
    }

    const bodyDef = data.bodyDef || b2DefaultBodyDef();
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);

    let bodyId = data.bodyId;

    if (!bodyId)
    {
        bodyId = b2CreateBody(data.worldId, bodyDef);
    }

    const shapeDef = data.shapeDef || b2DefaultShapeDef();
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef, "customColor", data.color);

    let nGon;
    const hull = b2ComputeHull(data.vertices, data.vertices.length);

    if (data.bodyId != null)
    {
        const oldxf = b2GetBodyTransform(data.worldId, data.bodyId);
        const xf = new b2Transform(data.position, oldxf.q);
        nGon = b2MakeOffsetPolygon(hull, 0, xf);
    }
    else
    {
        nGon = b2MakePolygon(hull, 0);
    }

    const shapeId = b2CreatePolygonShape(bodyId, shapeDef, nGon);

    return { bodyId: bodyId, shapeId: shapeId, object: nGon };
}


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
 * @property {number[]} indices - List of indices to the vertices for the polygon.
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
export function CreatePolygonFromEarcut (data)
{
    if (data.vertices.length < 3)
    {
        console.warn(`WARNING: invalid number of sides for a polygon (${data.vertices.length}).`);

        return null;
    }

    const bodyDef = data.bodyDef || b2DefaultBodyDef();
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);

    const shapeDef = data.shapeDef || b2DefaultShapeDef();
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef, "restitution", data.restitution);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef, "customColor", data.color);

    const parts = [];

    let scale = data.vertexScale;

    if (!scale) { scale = new b2Vec2(1, 1); }
    let offset = data.vertexOffset;

    if (!offset) { offset = new b2Vec2(0, 0); }

    // convert earcut triangle data into point lists suitable for box2D
    for (let i = 0, l = data.indices[ 0 ].length; i < l; i += 3)
    {
        const part = [];

        for (let j = 0; j < 3; j++)
        {
            const index = data.indices[ 0 ][ i + j ] * 2;
            part.push(new b2Vec2((data.vertices[ index ] + offset.x) * scale.x, (data.vertices[ index + 1 ] + offset.y) * scale.y));
        }
        parts.push(part);
    }

    // create a Shape for each point list
    let body = null;
    parts.forEach(part =>
    {
        if (!body)
        {
            // create a Body for the entire object using the first point list
            body = CreatePolygon({
                worldId: data.worldId,
                type: b2BodyType.b2_dynamicBody,
                bodyDef: bodyDef,

                // position: position,
                vertices: part,
                density: 1.0,
                friction: 0.3,
                color: b2HexColor.b2_colorSkyBlue
            });
        }
        else
        {
            // create a Shape attached to that body for all remaining point lists
            const hull = b2ComputeHull(part, part.length);
            const nGon = b2MakePolygon(hull, 0);
            b2CreatePolygonShape(body.bodyId, shapeDef, nGon);
        }
    });
}

/**
 * Creates a polygon from Vertex and Index data and attaches it to a body.
 * @param {PolygonVertexConfig} data - Configuration for the polygon.
 * @returns {{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePolygonFromVertices (data)
{
    if (data.vertices.length < 3)
    {
        console.warn(`WARNING: invalid number of sides for a polygon (${data.vertices.length}).`);

        return null;
    }

    const bodyDef = data.bodyDef || b2DefaultBodyDef();
    setIfDef(bodyDef, "type", data.type);
    setIfDef(bodyDef, "position", data.position);

    const shapeDef = data.shapeDef || b2DefaultShapeDef();
    setIfDef(shapeDef, "density", data.density);
    setIfDef(shapeDef, "friction", data.friction);
    setIfDef(shapeDef, "restitution", data.restitution);
    setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
    setIfDef(shapeDef, "customColor", data.color);

    let scale = data.vertexScale;

    if (!scale) { scale = new b2Vec2(1, 1); }
    let offset = data.vertexOffset;

    if (!offset) { offset = new b2Vec2(0, 0); }

    // convert indexed vertex data into point lists suitable for box2D
    const parts = [];

    for (let i = 0, l = data.indices.length; i < l; i++)
    {
        const part = [];
        const indices = data.indices[ i ];

        for (let p = 0, pl = indices.length; p < pl; p++)
        {
            const index = indices[ p ] * 2;
            part.push(new b2Vec2((data.vertices[ index ] + offset.x) * scale.x, (data.vertices[ index + 1 ] + offset.y) * scale.y));
        }
        parts.push(part);
    }

    // create a Shape for each point list
    let body = null;
    parts.forEach(part =>
    {
        if (!body)
        {
            // create a Body for the entire object using the first point list
            body = CreatePolygon({
                worldId: data.worldId,
                type: b2BodyType.b2_dynamicBody,
                bodyDef: bodyDef,

                // position: position,
                vertices: part,
                density: 1.0,
                friction: 0.3,
                color: b2HexColor.b2_colorSkyBlue
            });
        }
        else
        {
            // create a Shape attached to that body for all remaining point lists
            const hull = b2ComputeHull(part, part.length);
            const nGon = b2MakePolygon(hull, 0);
            b2CreatePolygonShape(body.bodyId, shapeDef, nGon);
        }
    });
    return body;
}

/**
 * Creates a polygon from PhysicsEditor XML data and attaches it to a body.
 * It is recommended to prepare data with this _before_ the game loop starts; It is async and quite slow.
 * @param {PolygonVertexConfig} data - Configuration for the polygon.
 * @returns {Promise<{bodyId: b2BodyId, shapeId: b2ShapeId, object: b2Polygon}>} The created polygon's body ID, shape ID, and object.
 * @memberof Physics
 */
export function CreatePhysicsEditorShape (data)
{
    const key = data.key;
    const url = data.url;

    async function loadXMLFromFile (url)
    {
        try
        {
            const response = await fetch(url);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            return xmlDoc;
        }
        catch (error)
        {
            console.error("Error loading XML:", error);

            throw error;
        }
    }

    function extractPolygons (key, xmlDoc)
    {
        const polygonElements = xmlDoc.querySelectorAll(`body[name=${key}] fixtures polygon`);

        const uniqueVertices = [];
        const polygonIndices = [];

        // find or add vertex
        function getVertexIndex (x, y)
        {
            // exists? (with tiny epsilon)
            const epsilon = 0.000001;
            const last = uniqueVertices.length;

            for (let i = 0; i < last; i += 2)
            {
                if (Math.abs(uniqueVertices[ i ] - x) < epsilon &&
                    Math.abs(uniqueVertices[ i + 1 ] - y) < epsilon)
                {
                    return i / 2;
                }
            }

            // add new vertex if not
            uniqueVertices.push(x, y);

            return last / 2;
        }

        // for each polygon from the XML
        Array.from(polygonElements).forEach(polygon =>
        {
            const numbers = polygon.textContent
                .trim()
                .split(/[,\s]+/)    // commas or whitespace
                .map(Number);

            // create indices
            const polygonIndexList = [];

            for (let i = 0; i < numbers.length; i += 2)
            {
                const vertexIndex = getVertexIndex(numbers[ i ], numbers[ i + 1 ]);
                polygonIndexList.push(vertexIndex);
            }
            polygonIndices.push(polygonIndexList);
        });

        return {
            vertices: uniqueVertices,  // a flat array of x,y coordinates
            indices: polygonIndices    // an array of index arrays, one per polygon
        };
    }

    function createPolygons (polygons)
    {
        // create a polygon body from the vertex list and index list-of-lists
        // merge the provided data object defining the body with the data we've extracted from XML
        return CreatePolygonFromVertices({
            ...data,
            indices: polygons.indices,
            vertices: polygons.vertices
        });
    }

    return new Promise(async (resolve, reject) =>
    {
        try
        {
            const xmlDoc = await loadXMLFromFile(url);
            const polygons = extractPolygons(key, xmlDoc);
            const result = createPolygons(polygons);
            resolve(result);
        }
        catch (error)
        {
            console.error("Error:", error);
            reject(error);
        }
    });
}

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
export function CreateRevoluteJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2RevoluteJointDef();
    }
    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;
    setIfDef(jointDef, "localAnchorA", data.anchorA);
    setIfDef(jointDef, "localAnchorB", data.anchorB);

    setIfDef(jointDef, "lowerAngle", data.lowerAngle);
    setIfDef(jointDef, "upperAngle", data.upperAngle);
    setIfDef(jointDef, "enableLimit", data.enableLimit);

    setIfDef(jointDef, "enableMotor", data.enableMotor);
    setIfDef(jointDef, "motorSpeed", data.motorSpeed);
    setIfDef(jointDef, "maxMotorTorque", data.maxMotorTorque);

    setIfDef(jointDef, "enableSpring", data.enableSpring);
    setIfDef(jointDef, "hertz", data.hertz);
    setIfDef(jointDef, "dampingRatio", data.dampingRatio);

    setIfDef(jointDef, "collideConnected", data.collideConnected);
    setIfDef(jointDef, "drawSize", data.drawSize);

    const jointId = b2CreateRevoluteJoint(data.worldId, jointDef);

    return { jointId: jointId };
}

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
export function CreateWeldJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2WeldJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;
    setIfDef(jointDef, "localAnchorA", data.anchorA);
    setIfDef(jointDef, "localAnchorB", data.anchorB);

    const rotA = b2Body_GetRotation(data.bodyIdA);
    const rotB = b2Body_GetRotation(data.bodyIdB);
    jointDef.referenceAngle = b2RelativeAngle(rotB, rotA);
    setIfDef(jointDef, "referenceAngle", data.referenceAngle);

    setIfDef(jointDef, "angularHertz", data.hertz);
    setIfDef(jointDef, "angularDampingRatio", data.dampingRatio);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreateWeldJoint(data.worldId, jointDef);

    return { jointId: jointId };
}

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
export function CreateDistanceJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2DistanceJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;
    setIfDef(jointDef, "localAnchorA", data.anchorA);
    setIfDef(jointDef, "localAnchorB", data.anchorB);

    setIfDef(jointDef, "length", data.length);
    setIfDef(jointDef, "minLength", data.minLength);
    setIfDef(jointDef, "maxLength", data.maxLength);

    setIfDef(jointDef, "enableSpring", data.enableSpring);
    setIfDef(jointDef, "hertz", data.hertz);
    setIfDef(jointDef, "dampingRatio", data.dampingRatio);
    setIfDef(jointDef, "enableLimit", data.enableLimit);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreateDistanceJoint(data.worldId, jointDef);

    return { jointId: jointId };
}

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
export function CreateWheelJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2WheelJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;
    setIfDef(jointDef, "localAnchorA", data.anchorA);
    setIfDef(jointDef, "localAnchorB", data.anchorB);

    setIfDef(jointDef, "enableSpring", data.enableSpring);
    setIfDef(jointDef, "localAxisA", data.axis);
    setIfDef(jointDef, "hertz", data.hertz);
    setIfDef(jointDef, "dampingRatio", data.dampingRatio);

    setIfDef(jointDef, "enableLimit", data.enableLimit);
    setIfDef(jointDef, "lowerTranslation", data.lowerTranslation);
    setIfDef(jointDef, "upperTranslation", data.upperTranslation);

    setIfDef(jointDef, "enableMotor", data.enableMotor);
    setIfDef(jointDef, "maxMotorTorque", data.maxMotorTorque);
    setIfDef(jointDef, "motorSpeed", data.motorSpeed);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreateWheelJoint(data.worldId, jointDef);

    return { jointId: jointId };
}

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
export function CreatePrismaticJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2PrismaticJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;
    setIfDef(jointDef, "localAnchorA", data.anchorA);
    setIfDef(jointDef, "localAnchorB", data.anchorB);
    setIfDef(jointDef, "localAxisA", data.axis);

    setIfDef(jointDef, "referenceAngle", data.referenceAngle);

    setIfDef(jointDef, "enableSpring", data.enableSpring);
    setIfDef(jointDef, "hertz", data.hertz);
    setIfDef(jointDef, "dampingRatio", data.dampingRatio);

    setIfDef(jointDef, "enableLimit", data.enableLimit);
    setIfDef(jointDef, "lowerTranslation", data.lowerTranslation);
    setIfDef(jointDef, "upperTranslation", data.upperTranslation);

    setIfDef(jointDef, "enableMotor", data.enableMotor);
    setIfDef(jointDef, "maxMotorForce", data.maxMotorForce);
    setIfDef(jointDef, "motorSpeed", data.motorSpeed);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreatePrismaticJoint(data.worldId, jointDef);

    return { jointId: jointId };
}


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

// NOTES about Motor Joints
// when 'correctionFactor' == 0.0 the body will not move
// if linking to the ground, 'bodyA' should be the ground body or the motion will be wrong
// 'linearOffset' is the world destination, not an offset from the starting position

/**
 * Creates a motor joint between two bodies.
 * @param {MotorJointConfig} data - Configuration for the motor joint.
 * @returns {{jointId: b2JointId}} The ID of the created motor joint.
 * @memberof Physics
 */
export function CreateMotorJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2MotorJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;

    setIfDef(jointDef, "linearOffset", data.linearOffset);
    setIfDef(jointDef, "maxForce", data.maxForce);
    setIfDef(jointDef, "angularOffset", data.angularOffset);
    setIfDef(jointDef, "maxTorque", data.maxTorque);
    setIfDef(jointDef, "correctionFactor", data.correctionFactor);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreateMotorJoint(data.worldId, jointDef);

    return { jointId: jointId };
}

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
export function CreateMouseJoint (data)
{
    console.assert(data.worldId != undefined);
    console.assert(data.bodyIdA != undefined && data.bodyIdB != undefined);

    let jointDef = data.jointDef;

    if (!jointDef)
    {
        jointDef = new b2MouseJointDef();
    }

    jointDef.bodyIdA = data.bodyIdA;
    jointDef.bodyIdB = data.bodyIdB;

    setIfDef(jointDef, "target", data.target);      // transferred to b2MouseJoint.targetA
    setIfDef(jointDef, "hertz", data.hertz);
    setIfDef(jointDef, "dampingRatio", data.dampingRatio);
    setIfDef(jointDef, "maxForce", data.maxForce);

    setIfDef(jointDef, "collideConnected", data.collideConnected);

    const jointId = b2CreateMouseJoint(data.worldId, jointDef);

    return { jointId: jointId };
}
