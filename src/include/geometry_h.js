/**
 * This file includes code that is:
 * 
 * - Copyright 2023 Erin Catto, released under the MIT license.
 * - Copyright 2024 Phaser Studio Inc, released under the MIT license.
 */

export {
    b2MakeBox, b2MakeSquare, b2MakeOffsetBox,
    b2MakePolygon, b2MakeOffsetPolygon, b2TransformPolygon,
    b2PointInPolygon,
    b2ComputePolygonAABB, b2ComputePolygonMass,
    b2ComputeCapsuleAABB, b2ComputeCapsuleMass,
    b2ComputeCircleAABB, b2ComputeCircleMass,
    b2ComputeSegmentAABB,
    b2IsValidRay,
    b2MakeRoundedBox,
    b2PointInCircle, b2PointInCapsule,
    b2RayCastCircle, b2RayCastCapsule, b2RayCastSegment, b2RayCastPolygon,
    b2ShapeCastCircle, b2ShapeCastCapsule, b2ShapeCastSegment, b2ShapeCastPolygon
} from '../geometry_c.js';
