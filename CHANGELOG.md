# Phaser Box2D Change Log

## Next - Unreleased

* `b2Body_GetInertiaTensor` -> `b2Body_GetRotationalInertia`
* `b2DistanceJoint_GetHertz` -> `b2DistanceJoint_GetSpringHertz`
* `b2DistanceJoint_GetDampingRatio` -> `b2DistanceJoint_GetSpringDampingRatio
* `b2MakeOffsetBox`: make last argument required and a `b2Rot` rather than an `angle`
* update box2d version returned by `b2GetVersion`: `3.0.0` -> `3.1.0`
* Sensor shapes now always generate events when created.
* Thanks to @mikuso for creating the first pass at TypeScript definitions.


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

## Box2D Upstream Checklist

✔️ = The upstream commit is 100% integrated  
🔎 = The upstream commit hasn't yet been looked at  
💻 = The upstream commit has been partially integrated  

When converting a commit it's at your discretion if you want to include the asserts and/or comments from upstream. In some cases, they can be useful (which is why they're in some areas of the current code), but they're computationally expensive for testing. The production build strips them out, the dev build does not.

We're happy to consider a commit as fully completed even if it has asserts or comments not moved over. Matching the API 1:1 is more important.

| Status | Commit | Description | Details |
| ------ | ------ | ----------- | ------- |
| ✔️ | [ec0e21c](https://github.com/erincatto/box2d/commit/ec0e21c8a3810228854230984aa0cbf73790e203) | Update to Version 3 (#769) | The base library is built from this release |
| ✔️ | [8e7a17c](https://github.com/erincatto/box2d/commit/8e7a17c5c942dbf2fdea8b9d09983410dcc0429d) | Update README.md | Done |
| ✔️ | [2b880d1](https://github.com/erincatto/box2d/commit/2b880d1264f1493f50bee3906b7d48ecdae4fc6e) | Fix null being passed to memcpy (#770) | Done |
| ✔️ | [0e333ff](https://github.com/erincatto/box2d/commit/0e333fff0669afac5d9416e21f22adccada11755) | Custom SSE2 and Neon (#772) | Done |
| 🔎 | [9314f30](https://github.com/erincatto/box2d/commit/9314f303a7cdd6171f7ae06cd1bbf110efffe3cc) | Cross platform determinism (#773) | Pending |
| ✔️ | [5fdbbc8](https://github.com/erincatto/box2d/commit/5fdbbc815684421513faebee10e20aad6e8b6365) | Misc Issues (#783) | Done |
| ✔️ | [e6cbbfc](https://github.com/erincatto/box2d/commit/e6cbbfc85eb781f36dbcea316c355fb4748dabff) | Linux gcc fixes (#784) | Done |
| 🔎 | [d323a0e](https://github.com/erincatto/box2d/commit/d323a0e7cebb8bdcd63ebc600107b577225c521f) | Cross platform random numbers for samples (#785) | TODO: b2Shape_RayCast now uses b2RayCastInput |
| 🔎 | [c69eee4](https://github.com/erincatto/box2d/commit/c69eee4b2f76a19d8b556c92fcd64c742879fc52) | Update AMD benchmarks (#787) | TODO: IsSleepingEnabled |
| 🔎 | [c56a76d](https://github.com/erincatto/box2d/commit/c56a76daa50726d2e47aad6bb648473ee14d822e) | Array refactor (#796) | Pending |
| 🔎 | [df7373c](https://github.com/erincatto/box2d/commit/df7373c08a41b7a4ba6edd5d4be200675a948176) | New capsule collider (#804) | Pending |
| 🔎 | [67b9835](https://github.com/erincatto/box2d/commit/67b98356074805ffdf43160a18390dd76b6bf550) | Fix missing hit events (#808) | Pending |
| 🔎 | [e7cb9f0](https://github.com/erincatto/box2d/commit/e7cb9f0b80420a865f11c0bbf37c3ebbe31629d2) | Explosion features (#810) | Pending |
| 🔎 | [b864f53](https://github.com/erincatto/box2d/commit/b864f533c3d851d5c7b55fd6fb4bac00466ff854) | Friction and restitution mixing rules (#811) | Pending |
| 🔎 | [a7123be](https://github.com/erincatto/box2d/commit/a7123be5f7ef623700c5a1b790a11c1e3ae01462) | Cast benchmark (#817) | Pending |
| ✔️ | [2dbb681](https://github.com/erincatto/box2d/commit/2dbb6818cb5e69bd3dcd20b7190cdba3844dd4e8) | Removed unused automatic mass (#819) | Done |
| 💻 | [aee18c7](https://github.com/erincatto/box2d/commit/aee18c76a3c4442b18730097b9660f0fe866e6b1) | fix atan2 and add more unit tests (#821) | TODO: b2World_OverlapPoint |
| 🔎 | [87e13e4](https://github.com/erincatto/box2d/commit/87e13e44378afc42598a4f7e8b2d5289982cdda7) | Fixed bug with static shape recreation (#822) | Pending |
| 🔎 | [0f192cd](https://github.com/erincatto/box2d/commit/0f192cdde7b554317d0445f38e2d35b3b7505b09) | Bounding box performance experiments (#829) | Pending |
| 🔎 | [90c2781](https://github.com/erincatto/box2d/commit/90c2781f64775085035655661d5fe6542bf0fbd5) | Event bookend (#837) | Pending |
| 💻 | [a9f2c92](https://github.com/erincatto/box2d/commit/a9f2c92f7af8f5a8e2c9b371044e15c1f8959c45) | Ragdoll benchmark (#838) | TODO: b2Chain_GetFriction |
| 🔎 | [41e067c](https://github.com/erincatto/box2d/commit/41e067c6d11f214a6ef1700361c5f27657575c73) | Fix sensor event order (#840) | Pending |
| 🔎 | [2c939c2](https://github.com/erincatto/box2d/commit/2c939c287bfcffcd9ae12ce34db486f6e0bd17e2) | Faster continuous (#847) | Pending |
| ✔️ | [bcc834b](https://github.com/erincatto/box2d/commit/bcc834bc1dd07b2387aca5fa4cbbb34f612a2e72) | fix for skipped shape in ray cast callback (returning -1) | Pending |
| 🔎 | [d1581fb](https://github.com/erincatto/box2d/commit/d1581fb7219616ae48850d3833c8915754e03e9a) | Minor fixes (#852) | Pending |
| 💻 | [f0763ac](https://github.com/erincatto/box2d/commit/f0763aca7d4dfa8f1c19c2c4a9e66fa6e93ea32e) | Timer update (#856) | TODO: b2DynamicTree_RayCast |
| 🔎 | [92dc214](https://github.com/erincatto/box2d/commit/92dc2143211aeb2021842cdb177af78d68b883ac) | Sensor Overlaps (#858) | Pending |
| 🔎 | [f377034](https://github.com/erincatto/box2d/commit/f377034920c42a26cd498c0a0b1b2e9f2b064989) | World API coverage (#859) | Pending |
