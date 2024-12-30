# Phaser Box2D Change Log

## Version 1.1.0 - December 30th 2024

* The `b2CastOutput` function now takes two `b2Vec` instances, `rayPoint` and `rayNormal`. These are now passed in from locally cached values where-ever `b2ShapeCast` is called. This prevents a crash when `b2TransformPoint` is called on the `output.point` which was previously null.
* Renamed smooth segment to chain segment as per #783 (https://github.com/erincatto/box2d/pull/783)
    * `b2CollideSmoothSegmentAndPolygon` -> `b2CollideChainSegmentAndPolygon`
    * `b2CollideSmoothSegmentAndCapsule` -> `b2CollideChainSegmentAndCapsule`
    * `b2CollideSmoothSegmentAndCircle` -> `b2CollideChainSegmentAndCircle`
    * `b2SmoothSegment` -> `b2ChainSegment`
    * `b2Shape.smoothSegment` -> `b2Shape.chainSegment` and the type has changed from `b2SmoothSegment` to `b2ChainSegment`
    * `b2_smoothSegmentShape` -> `b2_chainSegmentShape`
    ` `b2Shape_GetSmoothSegment` -> `b2Shape_GetChainSegment`
* Fix for skipped shape in ray cast callback (returning -1) (https://github.com/erincatto/box2d/commit/bcc834bc1dd07b2387aca5fa4cbbb34f612a2e72)
* Removed unused automatic mass functions:
    * `b2Body_SetAutomaticMass` function removed
    * `b2Body_GetAutomaticMass` function removed
    * `b2Body.automaticMass` property renamed to `b2Body.updateBodyMass`
* `b2_huge` renamed to `B2_HUGE`
* `b2_maxWorlds` renamed to `B2_MAX_WORLDS`
* `b2_maxRotation` renamed to `B2_MAX_ROTATION`
* `b2_pi` renamed to `B2_PI`
* `b2_defaultMaskBits` renamed to `B2_DEFAULT_MASK_BITS`
* `b2_maxPolygonVertices` renamed to `B2_MAX_POLYGON_VERTICES`
* `b2_defaultCategoryBits` renamed to `B2_DEFAULT_CATEGORY_BITS`
* `b2_treeStackSize` renamed to `B2_TREE_STACK_SIZE`




## Box2D Upstream checklist

* World API coverage (#859)
* Sensor Overlaps (#858)
* ✔️ Timer update (#856) = TODO: b2DynamicTree_RayCast
* Minor fixes (#852)
* ✔️ fix for skipped shape in ray cast callback (returning -1)
* Faster continuous (#847)
* Fix sensor event order (#840)
* ✔️ Ragdoll benchmark (#838) = TODO: Maybe b2Chain_GetFriction
* Event bookend (#837)
* Bounding box performance experiments (#829)
* Fixed bug with static shape recreation (#822)
* fix atan2 and add more unit tests (#821) = TODO: b2World_OverlapPoint
* ✔️ Removed unused automatic mass (#819)
* Cast benchmark (#817)
* Friction and restitution mixing rules (#811)
* Explosion features (#810)
* Fix missing hit events (#808)
* New capsule collider (#804)
* Array refactor (#796)
* Update AMD benchmarks (#787) = TODO: IsSleepingEnabled
* Cross platform random numbers for samples (#785) = TODO: b2Shape_RayCast now uses b2RayCastInput.
* ✔️ Linux gcc fixes (#784)
* ✔️ Misc Issues (#783)
