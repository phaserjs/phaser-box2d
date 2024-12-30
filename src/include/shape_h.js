/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

import { b2AABB, b2Vec2 } from './math_functions_h.js';
import { b2Capsule, b2ChainSegment, b2Circle, b2Polygon, b2Segment } from './collision_h.js';
import { b2Filter, b2ShapeType } from './types_h.js';

export class b2Shape
{
    constructor()
    {
        this.id = 0;
        this.bodyId = 0;
        this.prevShapeId = 0;
        this.nextShapeId = 0;
        this.type = b2ShapeType.e_unknown;
        this.density = 0;
        this.friction = 0;
        this.restitution = 0;

        this.aabb = new b2AABB();
        this.fatAABB = new b2AABB();
        this.localCentroid = new b2Vec2();
        this.proxyKey = 0;

        this.filter = new b2Filter();
        this.userData = null;
        this.customColor = 0;

        this.capsule = new b2Capsule();
        this.circle = new b2Circle();
        this.polygon = new b2Polygon();
        this.segment = new b2Segment();
        this.chainSegment = new b2ChainSegment();

        this.revision = 0;
        this.isSensor = false;
        this.enableSensorEvents = false;
        this.enableContactEvents = false;
        this.enableHitEvents = false;
        this.enablePreSolveEvents = false;
        this.enlargedAABB = false;
        this.isFast = false;

        this.imageNoDebug = false;      // suppress debug drawing except when there's an image attached
        this.image = null;
        this.imageScale = null;
        this.imageOffset = null;
        this.imageRect = null;          // use a b2AABB with width and height in upperBoundX and upperBoundY
    }
}

export class b2ChainShape
{
    constructor()
    {
        this.id = 0;
        this.bodyId = 0;
        this.nextChainId = 0;
        this.shapeIndices = [];
        this.count = 0;
        this.revision = 0;
    }
}

export class b2ShapeExtent
{
    constructor()
    {
        this.minExtent = 0;
        this.maxExtent = 0;
    }
}

export {
    b2CreateCircleShape,
    b2CreateCapsuleShape,
    b2CreatePolygonShape,
    b2CreateSegmentShape,
    b2CreateChain,
    b2DestroyShape,
    b2CreateShapeProxy,
    b2DestroyShapeProxy,
    b2ComputeShapeMass,
    b2ComputeShapeExtent,
    b2ComputeShapeAABB,
    b2GetShapeCentroid,
    b2GetShapePerimeter,
    b2MakeShapeDistanceProxy,
    b2RayCastShape,
    b2ShapeCastShape,
    b2GetOwnerTransform,
    b2Shape_AreContactEventsEnabled,
    b2Shape_AreHitEventsEnabled,
    b2Shape_ArePreSolveEventsEnabled,
    b2Shape_AreSensorEventsEnabled,
    b2Shape_EnableContactEvents,
    b2Shape_EnableHitEvents,
    b2Shape_EnablePreSolveEvents,
    b2Shape_EnableSensorEvents,
    b2Shape_GetAABB,
    b2Shape_GetBody,
    b2Shape_GetWorld,
    b2Shape_GetCapsule,
    b2Shape_GetCircle,
    b2Shape_GetClosestPoint,
    b2Shape_GetContactCapacity,
    b2Shape_GetContactData,
    b2Shape_GetDensity,
    b2Shape_GetFilter,
    b2Shape_GetFriction,
    b2Shape_GetParentChain,
    b2Shape_GetPolygon,
    b2Shape_GetRestitution,
    b2Shape_GetSegment,
    b2Shape_GetChainSegment,
    b2Shape_GetType,
    b2Shape_GetUserData,
    b2Shape_IsSensor,
    b2Shape_RayCast,
    b2Shape_SetCapsule,
    b2Shape_SetCircle,
    b2Shape_SetDensity,
    b2Shape_SetFilter,
    b2Shape_SetFriction,
    b2Shape_SetPolygon,
    b2Shape_SetRestitution,
    b2Shape_SetSegment,
    b2Shape_SetUserData,
    b2Shape_TestPoint,
    b2Chain_SetFriction,
    b2Chain_SetRestitution,
    b2DestroyChain,
} from '../shape_c.js';
