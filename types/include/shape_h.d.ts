export class b2Shape {
    id: number;
    bodyId: number;
    prevShapeId: number;
    nextShapeId: number;
    type: any;
    density: number;
    friction: number;
    restitution: number;
    aabb: b2AABB;
    fatAABB: b2AABB;
    localCentroid: b2Vec2;
    proxyKey: number;
    filter: b2Filter;
    userData: any;
    customColor: number;
    capsule: b2Capsule;
    circle: b2Circle;
    polygon: b2Polygon;
    segment: b2Segment;
    chainSegment: b2ChainSegment;
    revision: number;
    isSensor: boolean;
    enableSensorEvents: boolean;
    enableContactEvents: boolean;
    enableHitEvents: boolean;
    enablePreSolveEvents: boolean;
    enlargedAABB: boolean;
    isFast: boolean;
    imageNoDebug: boolean;
    image: any;
    imageScale: any;
    imageOffset: any;
    imageRect: any;
}
export class b2ChainShape {
    id: number;
    bodyId: number;
    nextChainId: number;
    shapeIndices: any[];
    count: number;
    revision: number;
}
export class b2ShapeExtent {
    minExtent: number;
    maxExtent: number;
}
import { b2AABB } from './math_functions_h.js';
import { b2Vec2 } from './math_functions_h.js';
import { b2Filter } from './types_h.js';
import { b2Capsule } from './collision_h.js';
import { b2Circle } from './collision_h.js';
import { b2Polygon } from './collision_h.js';
import { b2Segment } from './collision_h.js';
import { b2ChainSegment } from './collision_h.js';
export { b2CreateCircleShape, b2CreateCapsuleShape, b2CreatePolygonShape, b2CreateSegmentShape, b2CreateChain, b2DestroyShape, b2CreateShapeProxy, b2DestroyShapeProxy, b2ComputeShapeMass, b2ComputeShapeExtent, b2ComputeShapeAABB, b2GetShapeCentroid, b2GetShapePerimeter, b2MakeShapeDistanceProxy, b2RayCastShape, b2ShapeCastShape, b2GetOwnerTransform, b2Shape_AreContactEventsEnabled, b2Shape_AreHitEventsEnabled, b2Shape_ArePreSolveEventsEnabled, b2Shape_AreSensorEventsEnabled, b2Shape_EnableContactEvents, b2Shape_EnableHitEvents, b2Shape_EnablePreSolveEvents, b2Shape_EnableSensorEvents, b2Shape_GetAABB, b2Shape_GetBody, b2Shape_GetWorld, b2Shape_GetCapsule, b2Shape_GetCircle, b2Shape_GetClosestPoint, b2Shape_GetContactCapacity, b2Shape_GetContactData, b2Shape_GetDensity, b2Shape_GetFilter, b2Shape_GetFriction, b2Shape_GetParentChain, b2Shape_GetPolygon, b2Shape_GetRestitution, b2Shape_GetSegment, b2Shape_GetChainSegment, b2Shape_GetType, b2Shape_GetUserData, b2Shape_IsSensor, b2Shape_RayCast, b2Shape_SetCapsule, b2Shape_SetCircle, b2Shape_SetDensity, b2Shape_SetFilter, b2Shape_SetFriction, b2Shape_SetPolygon, b2Shape_SetRestitution, b2Shape_SetSegment, b2Shape_SetUserData, b2Shape_TestPoint, b2Chain_SetFriction, b2Chain_SetRestitution, b2DestroyChain } from "../shape_c.js";
