/**
 * @license
 * Phaser Box2D v1.1.0
 * Wednesday 1 January 2025 at 15:57
 * 
 * This library includes code that is ported from the original C version. The original C code is Copyright 2023 Erin Catto
 * and was released under the MIT license. The JavaScript port of the C code along with all additional code is
 * Copyright 2025 Phaser Studio Inc and is released under the MIT license.
 */

// src/math_functions_c.js
function b2GetLengthAndNormalize(v) {
  const length = b2Length(v);
  if (length < eps) {
    return { length: 0, normal: new b2Vec2(0, 0) };
  }
  const invLength = 1 / length;
  return { length, normal: new b2Vec2(invLength * v.x, invLength * v.y) };
}

// src/include/math_functions_h.js
var B2_PI = 3.14159265359;
var eps = 1e-10;
var epsSqr = eps * eps;
var GlobalDebug = {
  b2Vec2Count: 0,
  b2Rot2Count: 0,
  b2ManifoldCount: 0,
  b2ManifoldPointCount: 0,
  b2FrameCount: 0,
  b2PolyCollideCount: 0,
  b2ContactSimCount: 0,
  b2TOIInputCount: 0,
  b2ShapeCastPairInputCount: 0,
  b2SweepCount: 0
};
var b2Vec2Where = {
  calls: {}
};
var b2Rot2Where = {
  calls: {}
};
var b2ManifoldPointWhere = {
  calls: {}
};
var b2Vec2 = class _b2Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  clone() {
    return new _b2Vec2(this.x, this.y);
  }
};
var b2Rot = class _b2Rot {
  constructor(c2 = 1, s = 0) {
    this.c = c2;
    this.s = s;
  }
  copy(r) {
    this.c = r.c;
    this.s = r.s;
    return this;
  }
  clone() {
    return new _b2Rot(this.c, this.s);
  }
};
var b2Transform = class _b2Transform {
  constructor(p4 = null, q3 = null) {
    this.p = p4;
    this.q = q3;
  }
  static identity() {
    return new _b2Transform(new b2Vec2(), new b2Rot());
  }
  clone() {
    const xf2 = new _b2Transform(this.p, this.q);
    return xf2;
  }
  deepClone() {
    const xf2 = new _b2Transform(this.p.clone(), this.q.clone());
    return xf2;
  }
};
var b2Mat22 = class _b2Mat22 {
  constructor(cx = new b2Vec2(), cy = new b2Vec2()) {
    this.cx = cx;
    this.cy = cy;
  }
  clone() {
    return new _b2Mat22(this.cx.clone(), this.cy.clone());
  }
};
var b2AABB = class {
  constructor(lowerx = 0, lowery = 0, upperx = 0, uppery = 0) {
    this.lowerBoundX = lowerx;
    this.lowerBoundY = lowery;
    this.upperBoundX = upperx;
    this.upperBoundY = uppery;
  }
};
function b2MinFloat(a, b) {
  return a < b ? a : b;
}
function b2MaxFloat(a, b) {
  return a > b ? a : b;
}
function b2AbsFloat(a) {
  return a < 0 ? -a : a;
}
function b2ClampFloat(a, lower, upper) {
  return a < lower ? lower : a > upper ? upper : a;
}
function b2MinInt(a, b) {
  return a < b ? a : b;
}
function b2MaxInt(a, b) {
  return a > b ? a : b;
}
function b2AbsInt(a) {
  return a < 0 ? -a : a;
}
function b2ClampInt(a, lower, upper) {
  return a < lower ? lower : a > upper ? upper : a;
}
function b2Dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
function b2Cross(a, b) {
  return a.x * b.y - a.y * b.x;
}
function b2CrossVS(v, s) {
  return new b2Vec2(s * v.y, -s * v.x);
}
function b2CrossSV(s, v) {
  return new b2Vec2(-s * v.y, s * v.x);
}
function b2LeftPerp(v) {
  return new b2Vec2(-v.y, v.x);
}
function b2RightPerp(v) {
  return new b2Vec2(v.y, -v.x);
}
function b2Add(a, b) {
  return new b2Vec2(a.x + b.x, a.y + b.y);
}
function b2Sub(a, b) {
  return new b2Vec2(a.x - b.x, a.y - b.y);
}
function b2Neg(a) {
  return new b2Vec2(-a.x, -a.y);
}
function b2Lerp(a, b, t) {
  return new b2Vec2((1 - t) * a.x + t * b.x, (1 - t) * a.y + t * b.y);
}
function b2Mul(a, b) {
  return new b2Vec2(a.x * b.x, a.y * b.y);
}
function b2MulSV(s, v) {
  return new b2Vec2(s * v.x, s * v.y);
}
function b2MulAdd(a, s, b) {
  return new b2Vec2(a.x + s * b.x, a.y + s * b.y);
}
function b2MulAddOut(a, s, b, out) {
  out.x = a.x + s * b.x;
  out.y = a.y + s * b.y;
}
function b2MulSub(a, s, b) {
  return new b2Vec2(a.x - s * b.x, a.y - s * b.y);
}
function b2DotSub(sub1, sub2, dot) {
  const subX = sub1.x - sub2.x;
  const subY = sub1.y - sub2.y;
  return subX * dot.x + subY * dot.y;
}
function b2Abs(a) {
  return new b2Vec2(Math.abs(a.x), Math.abs(a.y));
}
function b2Min(a, b) {
  return new b2Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
}
function b2Max(a, b) {
  return new b2Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
}
function b2Clamp(v, a, b) {
  return new b2Vec2(
    b2ClampFloat(v.x, a.x, b.x),
    b2ClampFloat(v.y, a.y, b.y)
  );
}
function b2Length(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
function b2LengthXY(x, y) {
  return Math.sqrt(x * x + y * y);
}
function b2LengthSquared(v) {
  return v.x * v.x + v.y * v.y;
}
function b2Distance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function b2DistanceSquared(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx * dx + dy * dy;
}
function b2MakeRot(angle) {
  return new b2Rot(Math.cos(angle), Math.sin(angle));
}
function b2NormalizeRot(q3) {
  const mag = Math.sqrt(q3.s * q3.s + q3.c * q3.c);
  const invMag = mag > 0 ? 1 / mag : 0;
  return new b2Rot(q3.c * invMag, q3.s * invMag);
}
function b2InvMagRot(c2, s) {
  const mag = Math.sqrt(s * s + c2 * c2);
  const invMag = mag > 0 ? 1 / mag : 0;
  return invMag;
}
function b2IsNormalized(q3) {
  const qq = q3.s * q3.s + q3.c * q3.c;
  return 1 - 6e-4 < qq && qq < 1 + 6e-4;
}
function b2NLerp(q12, q22, t) {
  const omt = 1 - t;
  const q3 = new b2Rot(
    omt * q12.c + t * q22.c,
    omt * q12.s + t * q22.s
  );
  return b2NormalizeRot(q3);
}
function b2IntegrateRotation(q12, deltaAngle) {
  const q2C = q12.c - deltaAngle * q12.s;
  const q2S = q12.s + deltaAngle * q12.c;
  const mag = Math.sqrt(q2S * q2S + q2C * q2C);
  const invMag = mag > 0 ? 1 / mag : 0;
  return new b2Rot(q2C * invMag, q2S * invMag);
}
function b2IntegrateRotationOut(q12, deltaAngle, out) {
  const q2C = q12.c - deltaAngle * q12.s;
  const q2S = q12.s + deltaAngle * q12.c;
  const mag = Math.sqrt(q2S * q2S + q2C * q2C);
  const invMag = mag > 0 ? 1 / mag : 0;
  out.c = q2C * invMag;
  out.s = q2S * invMag;
}
function b2ComputeAngularVelocity(q12, q22, inv_h) {
  return inv_h * (q22.s * q12.c - q22.c * q12.s);
}
function b2Rot_GetAngle(q3) {
  return Math.atan2(q3.s, q3.c);
}
function b2Rot_GetXAxis(q3) {
  return new b2Vec2(q3.c, q3.s);
}
function b2Rot_GetYAxis(q3) {
  return new b2Vec2(-q3.s, q3.c);
}
function b2MulRot(q3, r) {
  return new b2Rot(
    q3.c * r.c - q3.s * r.s,
    q3.s * r.c + q3.c * r.s
  );
}
function b2MulRotC(q3, r) {
  return q3.c * r.c - q3.s * r.s;
}
function b2MulRotS(q3, r) {
  return q3.s * r.c + q3.c * r.s;
}
function b2InvMulRot(q3, r) {
  return new b2Rot(
    q3.c * r.c + q3.s * r.s,
    q3.c * r.s - q3.s * r.c
  );
}
function b2RelativeAngle(b, a) {
  const s = b.s * a.c - b.c * a.s;
  const c2 = b.c * a.c + b.s * a.s;
  return Math.atan2(s, c2);
}
function b2UnwindAngle(angle) {
  if (angle < -B2_PI) {
    return angle + 2 * B2_PI;
  } else if (angle > B2_PI) {
    return angle - 2 * B2_PI;
  }
  return angle;
}
function b2RotateVector(q3, v) {
  return new b2Vec2(q3.c * v.x - q3.s * v.y, q3.s * v.x + q3.c * v.y);
}
function b2InvRotateVector(q3, v) {
  return new b2Vec2(q3.c * v.x + q3.s * v.y, -q3.s * v.x + q3.c * v.y);
}
function b2TransformPoint(t, p4) {
  const x = t.q.c * p4.x - t.q.s * p4.y + t.p.x;
  const y = t.q.s * p4.x + t.q.c * p4.y + t.p.y;
  return new b2Vec2(x, y);
}
function b2TransformPointOut(t, p4, out) {
  const x = t.q.c * p4.x - t.q.s * p4.y + t.p.x;
  const y = t.q.s * p4.x + t.q.c * p4.y + t.p.y;
  out.x = x;
  out.y = y;
}
function b2TransformPointOutXf(t, p4, out) {
  out.p.x = t.q.c * p4.x - t.q.s * p4.y + t.p.x;
  out.p.y = t.q.s * p4.x + t.q.c * p4.y + t.p.y;
  out.q.c = t.q.c;
  out.q.s = t.q.s;
}
function b2InvTransformPoint(t, p4) {
  const vx = p4.x - t.p.x;
  const vy = p4.y - t.p.y;
  return new b2Vec2(t.q.c * vx + t.q.s * vy, -t.q.s * vx + t.q.c * vy);
}
function b2MulTransforms(A, B) {
  const C = new b2Transform();
  C.q = b2MulRot(A.q, B.q);
  C.p = b2Add(b2RotateVector(A.q, B.p), A.p);
  return C;
}
function b2InvMulTransforms(A, B) {
  const C = new b2Transform(new b2Vec2(), new b2Rot());
  C.q.c = A.q.c * B.q.c + A.q.s * B.q.s;
  C.q.s = A.q.c * B.q.s - A.q.s * B.q.c;
  const subX = B.p.x - A.p.x;
  const subY = B.p.y - A.p.y;
  C.p.x = A.q.c * subX + A.q.s * subY;
  C.p.y = -A.q.s * subX + A.q.c * subY;
  return C;
}
function b2InvMulTransformsOut(A, B, out) {
  const C = out;
  C.q.c = A.q.c * B.q.c + A.q.s * B.q.s;
  C.q.s = A.q.c * B.q.s - A.q.s * B.q.c;
  const subX = B.p.x - A.p.x;
  const subY = B.p.y - A.p.y;
  C.p.x = A.q.c * subX + A.q.s * subY;
  C.p.y = -A.q.s * subX + A.q.c * subY;
}
function b2MulMV(A, v) {
  return new b2Vec2(
    A.cx.x * v.x + A.cy.x * v.y,
    A.cx.y * v.x + A.cy.y * v.y
  );
}
function b2GetInverse22(A) {
  const a = A.cx.x, b = A.cy.x, c2 = A.cx.y, d = A.cy.y;
  let det = a * d - b * c2;
  if (det !== 0) {
    det = 1 / det;
  }
  return new b2Mat22(
    new b2Vec2(det * d, -det * c2),
    new b2Vec2(-det * b, det * a)
  );
}
function b2Solve22(A, b) {
  const a11 = A.cx.x, a12 = A.cy.x, a21 = A.cx.y, a22 = A.cy.y;
  let det = a11 * a22 - a12 * a21;
  if (det !== 0) {
    det = 1 / det;
  }
  return new b2Vec2(
    det * (a22 * b.x - a12 * b.y),
    det * (a11 * b.y - a21 * b.x)
  );
}
function b2AABB_Contains(a, b) {
  return a.lowerBoundX <= b.lowerBoundX && a.lowerBoundY <= b.lowerBoundY && b.upperBoundX <= a.upperBoundX && b.upperBoundY <= a.upperBoundY;
}
function b2AABB_Center(a) {
  return new b2Vec2(
    0.5 * (a.lowerBoundX + a.upperBoundX),
    0.5 * (a.lowerBoundY + a.upperBoundY)
  );
}
function b2AABB_Extents(a) {
  return new b2Vec2(
    0.5 * (a.upperBoundX - a.lowerBoundX),
    0.5 * (a.upperBoundY - a.lowerBoundY)
  );
}
function b2AABB_Union(a, b) {
  const c2 = new b2AABB();
  c2.lowerBoundX = Math.min(a.lowerBoundX, b.lowerBoundX);
  c2.lowerBoundY = Math.min(a.lowerBoundY, b.lowerBoundY);
  c2.upperBoundX = Math.max(a.upperBoundX, b.upperBoundX);
  c2.upperBoundY = Math.max(a.upperBoundY, b.upperBoundY);
  return c2;
}
function b2IsValid(a) {
  return isFinite(a) && !isNaN(a);
}
function b2Vec2_IsValid(v) {
  return v && b2IsValid(v.x) && b2IsValid(v.y);
}
function b2Rot_IsValid(q3) {
  return q3 && b2IsValid(q3.s) && b2IsValid(q3.c) && b2IsNormalized(q3);
}
function b2AABB_IsValid(aabb) {
  if (!aabb) {
    return false;
  }
  const dx = aabb.upperBoundX - aabb.lowerBoundX;
  const dy = aabb.upperBoundY - aabb.lowerBoundY;
  const valid = dx >= 0 && dy >= 0;
  return valid && b2IsValid(aabb.lowerBoundX) && b2IsValid(aabb.lowerBoundY) && b2IsValid(aabb.upperBoundX) && b2IsValid(aabb.upperBoundY);
}
function b2Normalize(v) {
  if (!v) {
  }
  const length = b2Length(v);
  if (length > eps) {
    const invLength = 1 / length;
    return new b2Vec2(v.x * invLength, v.y * invLength);
  }
  return new b2Vec2(0, 0);
}
function b2NormalizeChecked(v) {
  const length = b2Length(v);
  const invLength = 1 / length;
  return new b2Vec2(v.x * invLength, v.y * invLength);
}

// src/include/base_h.js
var b2Version = class {
  constructor(major = 0, minor = 0, revision = 0) {
    this.major = major;
    this.minor = minor;
    this.revision = revision;
  }
};

// src/core_c.js
var b2_lengthUnitsPerMeter = 1;
var B2_NULL_INDEX = -1;
function b2SetLengthUnitsPerMeter(lengthUnits) {
  b2_lengthUnitsPerMeter = lengthUnits;
}
function b2GetLengthUnitsPerMeter() {
  return b2_lengthUnitsPerMeter;
}
function b2SetAssertFcn(assertFcn) {
}
function b2GetVersion() {
  return new b2Version(3, 0, 0);
}

// src/include/core_h.js
var b2_lengthUnitsPerMeter2 = 1;
var B2_HUGE = 1e5 * b2_lengthUnitsPerMeter2;
var b2_graphColorCount = 2;
var b2_linearSlop = 5e-3 * b2_lengthUnitsPerMeter2;
var B2_MAX_ROTATION = 0.25 * Math.PI;
var b2_speculativeDistance = 4 * b2_linearSlop;
var b2_aabbMargin = 0.1 * b2_lengthUnitsPerMeter2;
var b2_timeToSleep = 0.5;
function b2SetAllocator() {
}
function b2GetByteCount() {
}
function b2CreateTimer() {
}
function b2GetTicks() {
}
function b2GetMilliseconds() {
}
function b2GetMillisecondsAndReset(timer) {
}
function b2SleepMilliseconds(ms) {
}
function b2Yield() {
}

// src/include/id_h.js
var b2WorldId = class {
  constructor(index = 0, revision = 0) {
    this.index1 = index;
    this.revision = revision;
  }
};
var b2BodyId = class {
  constructor(index = 0, world = 0, revision = 0) {
    this.index1 = index;
    this.world0 = world;
    this.revision = revision;
  }
};
var b2ShapeId = class {
  constructor(index = 0, world = 0, revision = 0) {
    this.index1 = index;
    this.world0 = world;
    this.revision = revision;
  }
};
var b2JointId = class {
  constructor(index = 0, world = 0, revision = 0) {
    this.index1 = index;
    this.world0 = world;
    this.revision = revision;
  }
};
var b2ChainId = class {
  constructor(index = 0, world = 0, revision = 0) {
    this.index1 = index;
    this.world0 = world;
    this.revision = revision;
  }
};
function B2_IS_NULL(id) {
  return id.index1 === 0;
}
function B2_IS_NON_NULL(id) {
  return id.index1 !== 0;
}
function B2_ID_EQUALS(id1, id2) {
  return id1.index1 === id2.index1 && id1.world0 === id2.world0 && id1.revision === id2.revision;
}

// src/include/collision_h.js
var B2_MAX_POLYGON_VERTICES = 8;
var B2_DEFAULT_MASK_BITS = 4294967295;
var b2RayCastInput = class {
  constructor() {
    this.origin = null;
    this.translation = null;
    this.maxFraction = 0;
  }
};
var b2ShapeCastInput = class {
  constructor() {
    this.points = [];
    this.count = 0;
    this.radius = 0;
    this.translation = null;
    this.maxFraction = 0;
  }
};
var b2CastOutput = class {
  constructor(normal = null, point = null) {
    this.normal = normal;
    this.point = point;
    this.fraction = 0;
    this.iterations = 0;
    this.hit = false;
  }
};
var b2MassData = class {
  constructor() {
    this.mass = 0;
    this.center = null;
    this.rotationalInertia = 0;
  }
};
var b2Circle = class {
  constructor(center = null, radius = 0) {
    this.center = center;
    if (!this.center) {
      this.center = new b2Vec2(0, 0);
    }
    this.radius = radius;
  }
};
var b2Capsule = class {
  constructor() {
    this.center1 = null;
    this.center2 = null;
    this.radius = 0;
  }
};
var b2Polygon = class {
  constructor(vertices) {
    if (vertices > 0) {
      this.vertices = new Array(vertices).fill().map(() => new b2Vec2(0, 0));
      this.normals = new Array(vertices).fill().map(() => new b2Vec2(0, 0));
    } else {
      this.vertices = [];
      this.normals = [];
    }
    this.centroid = null;
    this.radius = 0;
    this.count = 0;
  }
};
var b2Segment = class {
  constructor(point1 = null, point2 = null) {
    this.point1 = point1;
    this.point2 = point2;
  }
};
var b2ChainSegment = class {
  constructor() {
    this.ghost1 = null;
    this.segment = null;
    this.ghost2 = null;
    this.chainId = 0;
  }
};
var b2Hull = class {
  constructor() {
    this.points = [];
    this.count = 0;
  }
};
var b2SegmentDistanceResult = class {
  constructor() {
    this.closest1 = null;
    this.closest2 = null;
    this.fraction1 = 0;
    this.fraction2 = 0;
    this.distanceSquared = 0;
  }
};
var b2DistanceProxy = class _b2DistanceProxy {
  constructor(points = [], count = null, radius = 0) {
    this.points = points;
    this.count = count;
    this.radius = radius;
  }
  clone() {
    const points = [];
    for (let i = 0, l = this.points.length; i < l; i++) {
      points.push(this.points[i]);
    }
    return new _b2DistanceProxy(points, this.count, this.radius);
  }
};
var b2DistanceCache = class _b2DistanceCache {
  constructor() {
    this.count = 0;
    this.indexA = [0, 0, 0];
    this.indexB = [0, 0, 0];
  }
  clone() {
    const cache = new _b2DistanceCache();
    cache.count = this.count;
    cache.indexA = [...this.indexA];
    cache.indexB = [...this.indexB];
    return cache;
  }
};
var b2DistanceInput = class {
  constructor() {
    this.proxyA = new b2DistanceProxy();
    this.proxyB = new b2DistanceProxy();
    this.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(0, 0));
    this.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(0, 0));
    this.useRadii = false;
  }
};
var b2DistanceOutput = class {
  constructor() {
    this.pointA = new b2Vec2(0, 0);
    this.pointB = new b2Vec2(0, 0);
    this.distance = 0;
    this.iterations = 0;
    this.simplexCount = 0;
  }
};
var b2SimplexVertex = class _b2SimplexVertex {
  constructor() {
    this.wA = null;
    this.wB = null;
    this.w = null;
    this.a = 0;
    this.indexA = 0;
    this.indexB = 0;
  }
  clone() {
    const sv = new _b2SimplexVertex();
    sv.wA = this.wA.clone();
    sv.wB = this.wB.clone();
    sv.w = this.w.clone();
    sv.a = this.a;
    sv.indexA = this.indexA;
    sv.indexB = this.indexB;
    return sv;
  }
};
var b2Simplex = class {
  constructor() {
    this.v1 = new b2SimplexVertex();
    this.v2 = new b2SimplexVertex();
    this.v3 = new b2SimplexVertex();
    this.count = 0;
  }
};
var b2ShapeCastPairInput = class {
  constructor() {
    this.proxyA = new b2DistanceProxy();
    this.proxyB = new b2DistanceProxy();
    this.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(0, 0));
    this.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(0, 0));
    this.translationB = new b2Vec2(0, 0);
    this.maxFraction = 0;
  }
};
var b2Sweep = class _b2Sweep {
  constructor(c2 = null, v1 = null, v2 = null, r1 = null, r2 = null) {
    this.localCenter = c2;
    this.c1 = v1;
    this.c2 = v2;
    this.q1 = r1;
    this.q2 = r2;
  }
  clone() {
    return new _b2Sweep(this.localCenter.clone(), this.c1.clone(), this.c2.clone(), this.q1.clone(), this.q2.clone());
  }
};
var b2TOIInput = class _b2TOIInput {
  constructor(proxyA = null, proxyB = null, sweepA = null, sweepB = null, tMax = 0) {
    this.proxyA = proxyA;
    this.proxyB = proxyB;
    this.sweepA = sweepA;
    this.sweepB = sweepB;
    this.tMax = tMax;
  }
  clone() {
    return new _b2TOIInput(this.proxyA.clone(), this.proxyB.clone(), this.sweepA.clone(), this.sweepB.clone(), this.tMax);
  }
};
var b2TOIState = {
  b2_toiStateUnknown: 0,
  b2_toiStateFailed: 1,
  b2_toiStateOverlapped: 2,
  b2_toiStateHit: 3,
  b2_toiStateSeparated: 4
};
var b2TOIOutput = class {
  constructor() {
    this.state = b2TOIState.b2_toiStateUnknown;
    this.t = 0;
  }
};
var b2ManifoldPoint = class _b2ManifoldPoint {
  constructor() {
    this.pointX = 0;
    this.pointY = 0;
    this.anchorAX = 0;
    this.anchorAY = 0;
    this.anchorBX = 0;
    this.anchorBY = 0;
    this.separation = 0;
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
    this.maxNormalImpulse = 0;
    this.normalVelocity = 0;
    this.id = 0;
    this.persisted = false;
  }
  clone() {
    const clone = new _b2ManifoldPoint();
    clone.pointX = this.pointX;
    clone.pointY = this.pointY;
    clone.anchorAX = this.anchorAX;
    clone.anchorAY = this.anchorAY;
    clone.anchorBX = this.anchorBX;
    clone.anchorBY = this.anchorBY;
    clone.separation = this.separation;
    clone.normalImpulse = this.normalImpulse;
    clone.tangentImpulse = this.tangentImpulse;
    clone.maxNormalImpulse = this.maxNormalImpulse;
    clone.normalVelocity = this.normalVelocity;
    clone.id = this.id;
    clone.persisted = this.persisted;
    return clone;
  }
  clear() {
    this.pointX = 0;
    this.pointY = 0;
    this.anchorAX = 0;
    this.anchorAY = 0;
    this.anchorBX = 0;
    this.anchorBY = 0;
    this.separation = 0;
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
    this.maxNormalImpulse = 0;
    this.normalVelocity = 0;
    this.id = 0;
    this.persisted = false;
    return this;
  }
  copyTo(mp) {
    mp.pointX = this.pointX;
    mp.pointY = this.pointY;
    mp.anchorAX = this.anchorAX;
    mp.anchorAY = this.anchorAY;
    mp.anchorBX = this.anchorBX;
    mp.anchorBY = this.anchorBY;
    mp.separation = this.separation;
    mp.normalImpulse = this.normalImpulse;
    mp.tangentImpulse = this.tangentImpulse;
    mp.maxNormalImpulse = this.maxNormalImpulse;
    mp.normalVelocity = this.normalVelocity;
    mp.id = this.id;
    mp.persisted = this.persisted;
  }
};
var b2Manifold = class _b2Manifold {
  constructor(p14 = new b2ManifoldPoint(), p23 = new b2ManifoldPoint()) {
    this.points = [p14, p23];
    this.normalX = this.normalY = 0;
    this.pointCount = 0;
  }
  clone() {
    const clone = new _b2Manifold();
    this.copyTo(clone);
    return clone;
  }
  clear() {
    if (this.points[0]) {
      this.points[0].clear();
    }
    if (this.points[1]) {
      this.points[1].clear();
    }
    this.normalX = this.normalY = 0;
    this.pointCount = 0;
    return this;
  }
  copyTo(manifold) {
    this.points[0].copyTo(manifold.points[0]);
    this.points[1].copyTo(manifold.points[1]);
    manifold.normalX = this.normalX;
    manifold.normalY = this.normalY;
    manifold.pointCount = this.pointCount;
  }
};
var b2TreeNode = class {
  constructor() {
    this.aabb = null;
    this.categoryBits = 0;
    this.parent_next = B2_NULL_INDEX;
    this.child1 = B2_NULL_INDEX;
    this.child2 = B2_NULL_INDEX;
    this.userData = 0;
    this.height = -1;
    this.enlarged = false;
  }
};

// src/table_c.js
function b2CreateSet() {
  return /* @__PURE__ */ new Map();
}
function b2DestroySet(set) {
  set.clear();
}
function b2ClearSet(set) {
  set.clear();
}
function b2ContainsKey(set, key) {
  return set.has(key);
}
function b2AddKey(set, key) {
  if (set.has(key)) {
    return true;
  }
  set.set(key, 1);
  return false;
}
function b2RemoveKey(set, key) {
  return set.delete(key);
}

// src/include/table_h.js
var B2_SHAPE_PAIR_KEY = (K1, K2) => K1 < K2 ? BigInt(K1) << 32n | BigInt(K2) : BigInt(K2) << 32n | BigInt(K1);

// src/stack_allocator_c.js
var b2StackAllocator = class {
  constructor() {
    this.data = null;
    this.entries = null;
  }
};
var b2StackEntry = class {
  constructor() {
    this.data = null;
    this.name = null;
    this.size = 0;
  }
};
function b2CreateStackAllocator(capacity) {
  const allocator = new b2StackAllocator();
  allocator.data = [];
  allocator.entries = [];
  return allocator;
}
function b2DestroyStackAllocator(allocator) {
  allocator.data = null;
  allocator.entries = null;
}
function b2AllocateStackItem(alloc, size, name, ctor = null) {
  const entry = new b2StackEntry();
  entry.size = size;
  entry.name = name;
  entry.data = [];
  for (let i = 0; i < size; i++) {
    if (ctor) {
      entry.data.push(ctor());
    } else {
      entry.data.push(null);
    }
  }
  alloc.entries.push(entry);
  return entry.data;
}
function b2FreeStackItem(alloc, mem) {
  const entryCount = alloc.entries.length;
  const entry = alloc.entries[entryCount - 1];
  alloc.entries.pop();
}

// src/allocate_c.js
function b2Alloc(size, initCallback = null) {
  const ptr = [];
  if (initCallback) {
    for (let i = 0; i < size; i++) {
      ptr[i] = initCallback();
    }
  }
  return ptr;
}
function b2Grow(mem, newSize, initCallback = null) {
  const oldSize = mem.length;
  if (initCallback) {
    for (let i = oldSize; i < newSize; i++) {
      mem[i] = initCallback();
    }
  }
  return mem;
}

// src/types_c.js
var b2Validation = false;
function b2DefaultWorldDef() {
  const def = new b2WorldDef();
  def.gravity = new b2Vec2(0, -10);
  def.hitEventThreshold = 1 * b2_lengthUnitsPerMeter2;
  def.restitutionThreshold = 10 * b2_lengthUnitsPerMeter2;
  def.contactPushoutVelocity = 5 * b2_lengthUnitsPerMeter2;
  def.contactHertz = 30;
  def.contactDampingRatio = 10;
  def.jointHertz = 60;
  def.jointDampingRatio = 5;
  def.maximumLinearVelocity = 400 * b2_lengthUnitsPerMeter2;
  def.enableSleep = true;
  def.enableContinuous = true;
  return def;
}
function b2DefaultBodyDef() {
  const def = new b2BodyDef();
  def.type = b2BodyType.b2_staticBody;
  def.position = new b2Vec2(0, 0);
  def.rotation = new b2Rot(1, 0);
  def.linearVelocity = new b2Vec2(0, 0);
  def.angularVelocity = 0;
  def.linearDamping = 0;
  def.angularDamping = 0;
  def.gravityScale = 1;
  def.sleepThreshold = 0.05 * b2_lengthUnitsPerMeter2;
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
function b2DefaultFilter() {
  const filter = new b2Filter();
  filter.categoryBits = 1;
  filter.maskBits = 4294967295;
  filter.groupIndex = 0;
  return filter;
}
function b2DefaultQueryFilter() {
  const filter = new b2QueryFilter();
  filter.categoryBits = 1;
  filter.maskBits = 4294967295;
  return filter;
}
function b2DefaultShapeDef() {
  const def = new b2ShapeDef();
  def.friction = 0.6;
  def.density = 1;
  def.restitution = 0.1;
  def.filter = b2DefaultFilter();
  def.enableSensorEvents = true;
  def.enableContactEvents = true;
  return def;
}
function b2DefaultChainDef() {
  const def = new b2ChainDef();
  def.friction = 0.6;
  def.filter = b2DefaultFilter();
  return def;
}

// src/include/types_h.js
var b2BodyType = {
  b2_staticBody: 0,
  b2_kinematicBody: 1,
  b2_dynamicBody: 2,
  b2_bodyTypeCount: 3
};
var b2ShapeType = {
  b2_circleShape: 0,
  b2_capsuleShape: 1,
  b2_segmentShape: 2,
  b2_polygonShape: 3,
  b2_chainSegmentShape: 4,
  b2_shapeTypeCount: 5
};
var b2JointType = {
  b2_distanceJoint: 0,
  b2_motorJoint: 1,
  b2_mouseJoint: 2,
  b2_prismaticJoint: 3,
  b2_revoluteJoint: 4,
  b2_weldJoint: 5,
  b2_wheelJoint: 6,
  b2_unknown: -1
};
var b2RayResult = class {
  constructor() {
    this.shapeId = null;
    this.point = new b2Vec2(0, 0);
    this.normal = new b2Vec2(0, 0);
    this.fraction = 0;
    this.hit = false;
  }
};
var b2WorldDef = class {
  constructor() {
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
  }
};
var b2BodyDef = class {
  constructor() {
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
};
var b2ShapeDef = class {
  constructor() {
    this.userData = null;
    this.friction = 0;
    this.restitution = 0;
    this.density = 0;
    this.filter = new b2Filter();
    this.customColor = b2HexColor.b2_colorAqua;
    this.isSensor = false;
    this.enableSensorEvents = false;
    this.enableContactEvents = false;
    this.enableHitEvents = false;
    this.enablePreSolveEvents = false;
    this.forceContactCreation = false;
  }
};
var b2ChainDef = class {
  constructor() {
    this.userData = null;
    this.points = null;
    this.count = 0;
    this.friction = 0;
    this.restitution = 0;
    this.filter = new b2Filter();
    this.isLoop = false;
  }
};
var b2DistanceJointDef = class {
  constructor() {
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
};
var b2MotorJointDef = class {
  constructor() {
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
};
var b2MouseJointDef = class {
  constructor() {
    this.bodyIdA = null;
    this.bodyIdB = null;
    this.target = new b2Vec2(0, 0);
    this.hertz = 0;
    this.dampingRatio = 0;
    this.maxForce = 0;
    this.collideConnected = false;
    this.userData = null;
  }
};
var b2PrismaticJointDef = class {
  constructor() {
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
};
var b2RevoluteJointDef = class {
  constructor() {
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
};
var b2WeldJointDef = class {
  constructor() {
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
};
var b2WheelJointDef = class {
  constructor() {
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
};
var b2SensorBeginTouchEvent = class {
  constructor() {
    this.sensorShapeId = null;
    this.visitorShapeId = null;
  }
};
var b2SensorEndTouchEvent = class {
  constructor() {
    this.sensorShapeId = null;
    this.visitorShapeId = null;
  }
};
var b2SensorEvents = class {
  constructor() {
    this.beginEvents = null;
    this.endEvents = null;
    this.beginCount = 0;
    this.endCount = 0;
  }
};
var b2ContactBeginTouchEvent = class {
  constructor() {
    this.shapeIdA = null;
    this.shapeIdB = null;
    this.manifold = null;
  }
};
var b2ContactEndTouchEvent = class {
  constructor(a = null, b = null) {
    this.shapeIdA = a;
    this.shapeIdB = b;
  }
};
var b2ContactHitEvent = class {
  constructor() {
    this.shapeIdA = null;
    this.shapeIdB = null;
    this.pointX = 0;
    this.pointY = 0;
    this.normalX = 0;
    this.normalY = 0;
    this.approachSpeed = 0;
  }
};
var b2ContactEvents = class {
  constructor() {
    this.beginEvents = null;
    this.endEvents = null;
    this.hitEvents = null;
    this.beginCount = 0;
    this.endCount = 0;
    this.hitCount = 0;
  }
};
var b2BodyMoveEvent = class {
  constructor() {
    this.transform = null;
    this.bodyId = null;
    this.userData = null;
    this.fellAsleep = false;
  }
};
var b2BodyEvents = class {
  constructor() {
    this.moveEvents = null;
    this.moveCount = 0;
  }
};
var b2ContactData = class {
  constructor() {
    this.shapeIdA = null;
    this.shapeIdB = null;
    this.manifold = null;
  }
};
var b2HexColor = {
  b2_colorAliceBlue: 15792383,
  b2_colorAntiqueWhite: 16444375,
  b2_colorAqua: 65535,
  b2_colorAquamarine: 8388564,
  b2_colorAzure: 15794175,
  b2_colorBeige: 16119260,
  b2_colorBisque: 16770244,
  b2_colorBlack: 1,
  // non-zero!
  b2_colorBlanchedAlmond: 16772045,
  b2_colorBlue: 255,
  b2_colorBlueViolet: 9055202,
  b2_colorBrown: 10824234,
  b2_colorBurlywood: 14596231,
  b2_colorCadetBlue: 6266528,
  b2_colorChartreuse: 8388352,
  b2_colorChocolate: 13789470,
  b2_colorCoral: 16744272,
  b2_colorCornflowerBlue: 6591981,
  b2_colorCornsilk: 16775388,
  b2_colorCrimson: 14423100,
  b2_colorCyan: 65535,
  b2_colorDarkBlue: 139,
  b2_colorDarkCyan: 35723,
  b2_colorDarkGoldenrod: 12092939,
  b2_colorDarkGray: 11119017,
  b2_colorDarkGreen: 25600,
  b2_colorDarkKhaki: 12433259,
  b2_colorDarkMagenta: 9109643,
  b2_colorDarkOliveGreen: 5597999,
  b2_colorDarkOrange: 16747520,
  b2_colorDarkOrchid: 10040012,
  b2_colorDarkRed: 9109504,
  b2_colorDarkSalmon: 15308410,
  b2_colorDarkSeaGreen: 9419919,
  b2_colorDarkSlateBlue: 4734347,
  b2_colorDarkSlateGray: 3100495,
  b2_colorDarkTurquoise: 52945,
  b2_colorDarkViolet: 9699539,
  b2_colorDeepPink: 16716947,
  b2_colorDeepSkyBlue: 49151,
  b2_colorDimGray: 6908265,
  b2_colorDodgerBlue: 2003199,
  b2_colorFirebrick: 11674146,
  b2_colorFloralWhite: 16775920,
  b2_colorForestGreen: 2263842,
  b2_colorFuchsia: 16711935,
  b2_colorGainsboro: 14474460,
  b2_colorGhostWhite: 16316671,
  b2_colorGold: 16766720,
  b2_colorGoldenrod: 14329120,
  b2_colorGray: 12500670,
  b2_colorGray1: 1710618,
  b2_colorGray2: 3355443,
  b2_colorGray3: 5066061,
  b2_colorGray4: 6710886,
  b2_colorGray5: 8355711,
  b2_colorGray6: 10066329,
  b2_colorGray7: 11776947,
  b2_colorGray8: 13421772,
  b2_colorGray9: 15066597,
  b2_colorGreen: 65280,
  b2_colorGreenYellow: 11403055,
  b2_colorHoneydew: 15794160,
  b2_colorHotPink: 16738740,
  b2_colorIndianRed: 13458524,
  b2_colorIndigo: 4915330,
  b2_colorIvory: 16777200,
  b2_colorKhaki: 15787660,
  b2_colorLavender: 15132410,
  b2_colorLavenderBlush: 16773365,
  b2_colorLawnGreen: 8190976,
  b2_colorLemonChiffon: 16775885,
  b2_colorLightBlue: 11393254,
  b2_colorLightCoral: 15761536,
  b2_colorLightCyan: 14745599,
  b2_colorLightGoldenrod: 15654274,
  b2_colorLightGoldenrodYellow: 16448210,
  b2_colorLightGray: 13882323,
  b2_colorLightGreen: 9498256,
  b2_colorLightPink: 16758465,
  b2_colorLightSalmon: 16752762,
  b2_colorLightSeaGreen: 2142890,
  b2_colorLightSkyBlue: 8900346,
  b2_colorLightSlateBlue: 8679679,
  b2_colorLightSlateGray: 7833753,
  b2_colorLightSteelBlue: 11584734,
  b2_colorLightYellow: 16777184,
  b2_colorLime: 65280,
  b2_colorLimeGreen: 3329330,
  b2_colorLinen: 16445670,
  b2_colorMagenta: 16711935,
  b2_colorMaroon: 11546720,
  b2_colorMediumAquamarine: 6737322,
  b2_colorMediumBlue: 205,
  b2_colorMediumOrchid: 12211667,
  b2_colorMediumPurple: 9662683,
  b2_colorMediumSeaGreen: 3978097,
  b2_colorMediumSlateBlue: 8087790,
  b2_colorMediumSpringGreen: 64154,
  b2_colorMediumTurquoise: 4772300,
  b2_colorMediumVioletRed: 13047173,
  b2_colorMidnightBlue: 1644912,
  b2_colorMintCream: 16121850,
  b2_colorMistyRose: 16770273,
  b2_colorMoccasin: 16770229,
  b2_colorNavajoWhite: 16768685,
  b2_colorNavy: 128,
  b2_colorNavyBlue: 128,
  b2_colorOldLace: 16643558,
  b2_colorOlive: 8421376,
  b2_colorOliveDrab: 7048739,
  b2_colorOrange: 16753920,
  b2_colorOrangeRed: 16729344,
  b2_colorOrchid: 14315734,
  b2_colorPaleGoldenrod: 15657130,
  b2_colorPaleGreen: 10025880,
  b2_colorPaleTurquoise: 11529966,
  b2_colorPaleVioletRed: 14381203,
  b2_colorPapayaWhip: 16773077,
  b2_colorPeachPuff: 16767673,
  b2_colorPeru: 13468991,
  b2_colorPink: 16761035,
  b2_colorPlum: 14524637,
  b2_colorPowderBlue: 11591910,
  b2_colorPurple: 10494192,
  b2_colorRebeccaPurple: 6697881,
  b2_colorRed: 16711680,
  b2_colorRosyBrown: 12357519,
  b2_colorRoyalBlue: 4286945,
  b2_colorSaddleBrown: 9127187,
  b2_colorSalmon: 16416882,
  b2_colorSandyBrown: 16032864,
  b2_colorSeaGreen: 3050327,
  b2_colorSeashell: 16774638,
  b2_colorSienna: 10506797,
  b2_colorSilver: 12632256,
  b2_colorSkyBlue: 8900331,
  b2_colorSlateBlue: 6970061,
  b2_colorSlateGray: 7372944,
  b2_colorSnow: 16775930,
  b2_colorSpringGreen: 65407,
  b2_colorSteelBlue: 4620980,
  b2_colorTan: 13808780,
  b2_colorTeal: 32896,
  b2_colorThistle: 14204888,
  b2_colorTomato: 16737095,
  b2_colorTurquoise: 4251856,
  b2_colorViolet: 15631086,
  b2_colorVioletRed: 13639824,
  b2_colorWheat: 16113331,
  b2_colorWhite: 16777215,
  b2_colorWhiteSmoke: 16119285,
  b2_colorYellow: 16776960,
  b2_colorYellowGreen: 10145074,
  b2_colorBox2DRed: 14430514,
  b2_colorBox2DBlue: 3190463,
  b2_colorBox2DGreen: 9226532,
  b2_colorBox2DYellow: 16772748
};
var b2DebugDraw = class {
  constructor() {
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
    this.useDrawingBounds = false;
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
};
var b2Filter = class {
  constructor() {
    this.categoryBits = 1;
    this.maskBits = 65535;
    this.groupIndex = 0;
  }
};
var b2QueryFilter = class {
  constructor() {
    this.categoryBits = 65535;
    this.maskBits = 65535;
  }
};

// src/id_pool_c.js
var b2IdPool = class {
  constructor(name) {
    this.name = name;
    this.freeArray = [];
    this.nextIndex = 0;
  }
};
function b2GetIdCapacity(pool) {
  return pool.nextIndex;
}
function b2CreateIdPool(name = "pool") {
  return new b2IdPool(name);
}
function b2DestroyIdPool(pool) {
  pool.freeArray = null;
  pool.nextIndex = 0;
}
function b2AllocId(pool) {
  if (pool.freeArray.length > 0) {
    return pool.freeArray.pop();
  }
  const id = pool.nextIndex;
  pool.nextIndex++;
  return id;
}
function b2FreeId(pool, id) {
  if (id === pool.nextIndex - 1) {
    pool.nextIndex--;
    return;
  }
  pool.freeArray.push(id);
}
function b2GetIdCount(pool) {
  return pool.nextIndex - pool.freeArray.length;
}

// src/distance_c.js
function b2GetSweepTransform(sweep, time) {
  const xf2 = new b2Transform();
  xf2.p = b2Add(b2MulSV(1 - time, sweep.c1), b2MulSV(time, sweep.c2));
  const q3 = new b2Rot(
    (1 - time) * sweep.q1.c + time * sweep.q2.c,
    (1 - time) * sweep.q1.s + time * sweep.q2.s
  );
  xf2.q = b2NormalizeRot(q3);
  xf2.p = b2Sub(xf2.p, b2RotateVector(xf2.q, sweep.localCenter));
  return xf2;
}
var sdResult = new b2SegmentDistanceResult();
function b2SegmentDistance(p1X, p1Y, q1X, q1Y, p2X, p2Y, q2X, q2Y) {
  let fraction1 = 0;
  let fraction2 = 0;
  const d1X = q1X - p1X;
  const d1Y = q1Y - p1Y;
  const d2X = q2X - p2X;
  const d2Y = q2Y - p2Y;
  const rX = p1X - p2X;
  const rY = p1Y - p2Y;
  const dd1 = d1X * d1X + d1Y * d1Y;
  const dd2 = d2X * d2X + d2Y * d2Y;
  const rd2 = rX * d2X + rY * d2Y;
  const rd1 = rX * d1X + rY * d1Y;
  if (dd1 < epsSqr || dd2 < epsSqr) {
    if (dd1 >= epsSqr) {
      fraction1 = b2ClampFloat(-rd1 / dd1, 0, 1);
      fraction2 = 0;
    } else if (dd2 >= epsSqr) {
      fraction1 = 0;
      fraction2 = b2ClampFloat(rd2 / dd2, 0, 1);
    }
  } else {
    const d12 = d1X * d2X + d1Y * d2Y;
    const denom = dd1 * dd2 - d12 * d12;
    let f1 = 0;
    if (denom !== 0) {
      f1 = b2ClampFloat((d12 * rd2 - rd1 * dd2) / denom, 0, 1);
    }
    let f2 = (d12 * f1 + rd2) / dd2;
    if (f2 < 0) {
      f2 = 0;
      f1 = b2ClampFloat(-rd1 / dd1, 0, 1);
    } else if (f2 > 1) {
      f2 = 1;
      f1 = b2ClampFloat((d12 - rd1) / dd1, 0, 1);
    }
    fraction1 = f1;
    fraction2 = f2;
  }
  const closest1X = p1X + fraction1 * d1X;
  const closest1Y = p1Y + fraction1 * d1Y;
  const closest2X = p2X + fraction2 * d2X;
  const closest2Y = p2Y + fraction2 * d2Y;
  const dX = closest1X - closest2X;
  const dY = closest1Y - closest2Y;
  const distanceSquared = dX * dX + dY * dY;
  sdResult.closest1 = sdResult.closest2 = null;
  sdResult.fraction1 = fraction1;
  sdResult.fraction2 = fraction2;
  sdResult.distanceSquared = distanceSquared;
  return sdResult;
}
function b2MakeProxy(vertices, count, radius) {
  count = Math.min(count, B2_MAX_POLYGON_VERTICES);
  const proxy = new b2DistanceProxy();
  proxy.points = [];
  proxy.count = count;
  proxy.radius = radius;
  for (let i = 0; i < count; ++i) {
    proxy.points[i] = vertices[i].clone();
  }
  return proxy;
}
function b2Weight2(a1, w1, a2, w2) {
  return new b2Vec2(a1 * w1.x + a2 * w2.x, a1 * w1.y + a2 * w2.y);
}
function b2Weight3(a1, w1, a2, w2, a3, w3) {
  return new b2Vec2(a1 * w1.x + a2 * w2.x + a3 * w3.x, a1 * w1.y + a2 * w2.y + a3 * w3.y);
}
function b2FindSupport(proxy, direction) {
  let bestIndex = 0;
  let bestValue = b2Dot(proxy.points[0], direction);
  for (let i = 1; i < proxy.count; ++i) {
    const value = b2Dot(proxy.points[i], direction);
    if (value > bestValue) {
      bestIndex = i;
      bestValue = value;
    }
  }
  return bestIndex;
}
function b2MakeSimplexFromCache(cache, proxyA, transformA, proxyB, transformB) {
  const s = new b2Simplex();
  s.count = cache.count;
  const vertices = [s.v1, s.v2, s.v3];
  for (let i = 0; i < s.count; ++i) {
    const v = vertices[i];
    v.indexA = cache.indexA[i];
    v.indexB = cache.indexB[i];
    const wALocal = proxyA.points[v.indexA];
    const wBLocal = proxyB.points[v.indexB];
    v.wA = b2TransformPoint(transformA, wALocal);
    v.wB = b2TransformPoint(transformB, wBLocal);
    v.w = b2Sub(v.wB, v.wA);
    v.a = -1;
  }
  if (s.count === 0) {
    const v = vertices[0];
    v.indexA = 0;
    v.indexB = 0;
    const wALocal = proxyA.points[0];
    const wBLocal = proxyB.points[0];
    v.wA = b2TransformPoint(transformA, wALocal);
    v.wB = b2TransformPoint(transformB, wBLocal);
    v.w = b2Sub(v.wB, v.wA);
    v.a = 1;
    s.count = 1;
  }
  return s;
}
function b2MakeSimplexCache(cache, simplex) {
  cache.count = simplex.count;
  const vertices = [simplex.v1, simplex.v2, simplex.v3];
  for (let i = 0; i < simplex.count; ++i) {
    cache.indexA[i] = vertices[i].indexA;
    cache.indexB[i] = vertices[i].indexB;
  }
}
function b2ComputeSimplexSearchDirection(simplex) {
  switch (simplex.count) {
    case 1:
      return b2Neg(simplex.v1.w);
    case 2:
      const e12 = b2Sub(simplex.v2.w, simplex.v1.w);
      const sgn = b2Cross(e12, b2Neg(simplex.v1.w));
      if (sgn > 0) {
        return b2LeftPerp(e12);
      } else {
        return b2RightPerp(e12);
      }
    default:
      return new b2Vec2(0, 0);
  }
}
function b2ComputeSimplexClosestPoint(s) {
  switch (s.count) {
    case 0:
      return new b2Vec2(0, 0);
    case 1:
      return s.v1.w;
    case 2:
      return b2Weight2(s.v1.a, s.v1.w, s.v2.a, s.v2.w);
    case 3:
      return new b2Vec2(0, 0);
    default:
      return new b2Vec2(0, 0);
  }
}
function b2ComputeSimplexWitnessPoints(a, b, s) {
  switch (s.count) {
    case 0:
      break;
    case 1:
      a.x = s.v1.wA.x;
      a.y = s.v1.wA.y;
      b.x = s.v1.wB.x;
      b.y = s.v1.wB.y;
      break;
    case 2:
      a.x = b2Weight2(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA).x;
      a.y = b2Weight2(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA).y;
      b.x = b2Weight2(s.v1.a, s.v1.wB, s.v2.a, s.v2.wB).x;
      b.y = b2Weight2(s.v1.a, s.v1.wB, s.v2.a, s.v2.wB).y;
      break;
    case 3:
      a.x = b2Weight3(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA, s.v3.a, s.v3.wA).x;
      a.y = b2Weight3(s.v1.a, s.v1.wA, s.v2.a, s.v2.wA, s.v3.a, s.v3.wA).y;
      b.x = a.x;
      b.y = a.y;
      break;
    default:
      break;
  }
}
function b2SolveSimplex2(s) {
  const w1 = s.v1.w;
  const w2 = s.v2.w;
  const e12 = b2Sub(w2, w1);
  const d12_2 = -b2Dot(w1, e12);
  if (d12_2 <= 0) {
    s.v1.a = 1;
    s.count = 1;
    return;
  }
  const d12_1 = b2Dot(w2, e12);
  if (d12_1 <= 0) {
    s.v2.a = 1;
    s.count = 1;
    s.v1 = s.v2;
    return;
  }
  const inv_d12 = 1 / (d12_1 + d12_2);
  s.v1.a = d12_1 * inv_d12;
  s.v2.a = d12_2 * inv_d12;
  s.count = 2;
}
function b2SolveSimplex3(s) {
  const w1 = s.v1.w;
  const w2 = s.v2.w;
  const w3 = s.v3.w;
  const e12 = b2Sub(w2, w1);
  const w1e12 = b2Dot(w1, e12);
  const w2e12 = b2Dot(w2, e12);
  const d12_1 = w2e12;
  const d12_2 = -w1e12;
  const e13 = b2Sub(w3, w1);
  const w1e13 = b2Dot(w1, e13);
  const w3e13 = b2Dot(w3, e13);
  const d13_1 = w3e13;
  const d13_2 = -w1e13;
  const e23 = b2Sub(w3, w2);
  const w2e23 = b2Dot(w2, e23);
  const w3e23 = b2Dot(w3, e23);
  const d23_1 = w3e23;
  const d23_2 = -w2e23;
  const n123 = b2Cross(e12, e13);
  const d123_1 = n123 * b2Cross(w2, w3);
  const d123_2 = n123 * b2Cross(w3, w1);
  const d123_3 = n123 * b2Cross(w1, w2);
  if (d12_2 <= 0 && d13_2 <= 0) {
    s.v1.a = 1;
    s.count = 1;
    return;
  }
  if (d12_1 > 0 && d12_2 > 0 && d123_3 <= 0) {
    const inv_d12 = 1 / (d12_1 + d12_2);
    s.v1.a = d12_1 * inv_d12;
    s.v2.a = d12_2 * inv_d12;
    s.count = 2;
    return;
  }
  if (d13_1 > 0 && d13_2 > 0 && d123_2 <= 0) {
    const inv_d13 = 1 / (d13_1 + d13_2);
    s.v1.a = d13_1 * inv_d13;
    s.v3.a = d13_2 * inv_d13;
    s.count = 2;
    s.v2 = s.v3.clone();
    return;
  }
  if (d12_1 <= 0 && d23_2 <= 0) {
    s.v2.a = 1;
    s.count = 1;
    s.v1 = s.v2.clone();
    return;
  }
  if (d13_1 <= 0 && d23_1 <= 0) {
    s.v3.a = 1;
    s.count = 1;
    s.v1 = s.v3.clone();
    return;
  }
  if (d23_1 > 0 && d23_2 > 0 && d123_1 <= 0) {
    const inv_d23 = 1 / (d23_1 + d23_2);
    s.v2.a = d23_1 * inv_d23;
    s.v3.a = d23_2 * inv_d23;
    s.count = 2;
    s.v1 = s.v3.clone();
    return;
  }
  const inv_d123 = 1 / (d123_1 + d123_2 + d123_3);
  s.v1.a = d123_1 * inv_d123;
  s.v2.a = d123_2 * inv_d123;
  s.v3.a = d123_3 * inv_d123;
  s.count = 3;
}
var p0 = new b2Vec2();
function b2ShapeDistance(cache, input, simplexes, simplexCapacity) {
  const output = new b2DistanceOutput();
  const proxyA = input.proxyA;
  const proxyB = input.proxyB;
  const transformA = input.transformA;
  const transformB = input.transformB;
  const simplex = b2MakeSimplexFromCache(cache, proxyA, transformA, proxyB, transformB);
  let simplexIndex = 0;
  if (simplexes !== null && simplexIndex < simplexCapacity) {
    simplexes[simplexIndex] = simplex;
    simplexIndex += 1;
  }
  const vertices = [simplex.v1, simplex.v2, simplex.v3];
  const k_maxIters = 20;
  const saveA = [0, 0, 0];
  const saveB = [0, 0, 0];
  let iter = 0;
  while (iter < k_maxIters) {
    const saveCount = simplex.count;
    for (let i = 0; i < saveCount; ++i) {
      saveA[i] = vertices[i].indexA;
      saveB[i] = vertices[i].indexB;
    }
    switch (simplex.count) {
      case 1:
        break;
      case 2:
        b2SolveSimplex2(simplex);
        break;
      case 3:
        b2SolveSimplex3(simplex);
        break;
      default:
        break;
    }
    if (simplex.count === 3) {
      break;
    }
    if (simplexes !== null && simplexIndex < simplexCapacity) {
      simplexes[simplexIndex] = simplex;
      simplexIndex += 1;
    }
    const d = b2ComputeSimplexSearchDirection(simplex);
    if (b2Dot(d, d) < eps * eps) {
      break;
    }
    const vertex = vertices[simplex.count];
    vertex.indexA = b2FindSupport(proxyA, b2InvRotateVector(transformA.q, b2Neg(d)));
    vertex.wA = b2TransformPoint(transformA, proxyA.points[vertex.indexA]);
    vertex.indexB = b2FindSupport(proxyB, b2InvRotateVector(transformB.q, d));
    vertex.wB = b2TransformPoint(transformB, proxyB.points[vertex.indexB]);
    vertex.w = b2Sub(vertex.wB, vertex.wA);
    ++iter;
    let duplicate = false;
    for (let i = 0; i < saveCount; ++i) {
      if (vertex.indexA === saveA[i] && vertex.indexB === saveB[i]) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) {
      break;
    }
    ++simplex.count;
  }
  if (simplexes !== null && simplexIndex < simplexCapacity) {
    simplexes[simplexIndex] = simplex;
    simplexIndex += 1;
  }
  b2ComputeSimplexWitnessPoints(output.pointA, output.pointB, simplex);
  output.distance = b2Distance(output.pointA, output.pointB);
  output.iterations = iter;
  output.simplexCount = simplexIndex;
  b2MakeSimplexCache(cache, simplex);
  if (input.useRadii) {
    if (output.distance < eps) {
      p0.x = 0.5 * (output.pointA.x + output.pointB.x);
      p0.y = 0.5 * (output.pointA.y + output.pointB.y);
      output.pointA.x = p0.x;
      output.pointA.y = p0.y;
      output.pointB.x = p0.x;
      output.pointB.y = p0.y;
      output.distance = 0;
    } else {
      const rA = proxyA.radius;
      const rB = proxyB.radius;
      output.distance = Math.max(0, output.distance - rA - rB);
      const normal = b2Normalize(b2Sub(output.pointB, output.pointA));
      const offsetAX = rA * normal.x;
      const offsetAY = rA * normal.y;
      const offsetBX = rB * normal.x;
      const offsetBY = rB * normal.y;
      output.pointA.x += offsetAX;
      output.pointA.y += offsetAY;
      output.pointB.x -= offsetBX;
      output.pointB.y -= offsetBY;
    }
  }
  return output;
}
var rayPoint = new b2Vec2(0, 0);
var rayNormal = new b2Vec2(0, 1);
function b2ShapeCast(input) {
  const output = new b2CastOutput(rayNormal, rayPoint);
  output.fraction = input.maxFraction;
  const proxyA = input.proxyA;
  const xfA = input.transformA;
  const xfB = input.transformB;
  const xf2 = b2InvMulTransforms(xfA, xfB);
  const proxyB = new b2DistanceProxy();
  proxyB.count = input.proxyB.count;
  proxyB.radius = input.proxyB.radius;
  proxyB.points = [];
  for (let i = 0; i < proxyB.count; ++i) {
    proxyB.points[i] = b2TransformPoint(xf2, input.proxyB.points[i]);
  }
  const radius = proxyA.radius + proxyB.radius;
  const r = b2RotateVector(xf2.q, input.translationB);
  let lambda = 0;
  const maxFraction = input.maxFraction;
  const simplex = new b2Simplex();
  simplex.count = 0;
  simplex.v1 = new b2SimplexVertex();
  simplex.v2 = new b2SimplexVertex();
  simplex.v3 = new b2SimplexVertex();
  const vertices = [simplex.v1, simplex.v2, simplex.v3];
  let indexA = b2FindSupport(proxyA, b2Neg(r));
  let wA = proxyA.points[indexA];
  let indexB = b2FindSupport(proxyB, r);
  let wB = proxyB.points[indexB];
  let v = b2Sub(wA, wB);
  const linearSlop = 5e-3;
  const sigma = Math.max(linearSlop, radius - linearSlop);
  const k_maxIters = 20;
  let iter = 0;
  while (iter < k_maxIters && b2Length(v) > sigma + 0.5 * linearSlop) {
    output.iterations += 1;
    indexA = b2FindSupport(proxyA, b2Neg(v));
    wA = proxyA.points[indexA];
    indexB = b2FindSupport(proxyB, v);
    wB = proxyB.points[indexB];
    const p4 = b2Sub(wA, wB);
    v = b2Normalize(v);
    const vp = b2Dot(v, p4);
    const vr = b2Dot(v, r);
    if (vp - sigma > lambda * vr) {
      if (vr <= 0) {
        return output;
      }
      lambda = (vp - sigma) / vr;
      if (lambda > maxFraction) {
        return output;
      }
      simplex.count = 0;
    }
    const vertex = vertices[simplex.count];
    vertex.indexA = indexB;
    vertex.wA = new b2Vec2(wB.x + lambda * r.x, wB.y + lambda * r.y);
    vertex.indexB = indexA;
    vertex.wB = wA.clone();
    vertex.w = b2Sub(vertex.wB, vertex.wA);
    vertex.a = 1;
    simplex.count += 1;
    switch (simplex.count) {
      case 1:
        break;
      case 2:
        b2SolveSimplex2(simplex);
        break;
      case 3:
        b2SolveSimplex3(simplex);
        break;
      default:
    }
    if (simplex.count === 3) {
      return output;
    }
    v = b2ComputeSimplexClosestPoint(simplex);
    ++iter;
  }
  if (iter === 0 || lambda === 0) {
    return output;
  }
  const pointA = new b2Vec2();
  const pointB = new b2Vec2();
  b2ComputeSimplexWitnessPoints(pointB, pointA, simplex);
  const n = b2Normalize(b2Neg(v));
  const point = new b2Vec2(pointA.x + proxyA.radius * n.x, pointA.y + proxyA.radius * n.y);
  output.point = b2TransformPoint(xfA, point);
  output.normal = b2RotateVector(xfA.q, n);
  output.fraction = lambda;
  output.iterations = iter;
  output.hit = true;
  return output;
}
var b2SeparationType = {
  b2_pointsType: 0,
  b2_faceAType: 1,
  b2_faceBType: 2
};
var b2SeparationFunction = class {
  constructor() {
    this.proxyA = null;
    this.proxyB = null;
    this.sweepA = null;
    this.sweepB = null;
    this.localPoint = new b2Vec2();
    this.axis = new b2Vec2();
    this.type = 0;
  }
};
function b2MakeSeparationFunction(cache, proxyA, sweepA, proxyB, sweepB, t1) {
  const f = new b2SeparationFunction();
  f.proxyA = proxyA;
  f.proxyB = proxyB;
  const count = cache.count;
  f.sweepA = new b2Sweep();
  Object.assign(f.sweepA, sweepA);
  f.sweepB = new b2Sweep();
  Object.assign(f.sweepB, sweepB);
  f.localPoint = new b2Vec2();
  f.axis = new b2Vec2();
  f.type = 0;
  const xfA = b2GetSweepTransform(sweepA, t1);
  const xfB = b2GetSweepTransform(sweepB, t1);
  if (count === 1) {
    f.type = b2SeparationType.b2_pointsType;
    const localPointA = proxyA.points[cache.indexA[0]];
    const localPointB2 = proxyB.points[cache.indexB[0]];
    const pointA2 = b2TransformPoint(xfA, localPointA);
    const pointB2 = b2TransformPoint(xfB, localPointB2);
    f.axis = b2Normalize(b2Sub(pointB2, pointA2));
    f.localPoint = new b2Vec2();
    return f;
  }
  if (cache.indexA[0] === cache.indexA[1]) {
    f.type = b2SeparationType.b2_faceBType;
    const localPointB1 = proxyB.points[cache.indexB[0]];
    const localPointB2 = proxyB.points[cache.indexB[1]];
    f.axis = b2CrossVS(b2Sub(localPointB2, localPointB1), 1);
    f.axis = b2Normalize(f.axis);
    const normal2 = b2RotateVector(xfB.q, f.axis);
    f.localPoint = new b2Vec2(0.5 * (localPointB1.x + localPointB2.x), 0.5 * (localPointB1.y + localPointB2.y));
    const pointB2 = b2TransformPoint(xfB, f.localPoint);
    const localPointA = proxyA.points[cache.indexA[0]];
    const pointA2 = b2TransformPoint(xfA, localPointA);
    const s2 = b2Dot(b2Sub(pointA2, pointB2), normal2);
    if (s2 < 0) {
      f.axis = b2Neg(f.axis);
    }
    return f;
  }
  f.type = b2SeparationType.b2_faceAType;
  const localPointA1 = proxyA.points[cache.indexA[0]];
  const localPointA2 = proxyA.points[cache.indexA[1]];
  f.axis = b2CrossVS(b2Sub(localPointA2, localPointA1), 1);
  f.axis = b2Normalize(f.axis);
  const normal = b2RotateVector(xfA.q, f.axis);
  f.localPoint = new b2Vec2(0.5 * (localPointA1.x + localPointA2.x), 0.5 * (localPointA1.y + localPointA2.y));
  const pointA = b2TransformPoint(xfA, f.localPoint);
  const localPointB = proxyB.points[cache.indexB[0]];
  const pointB = b2TransformPoint(xfB, localPointB);
  const s = b2Dot(b2Sub(pointB, pointA), normal);
  if (s < 0) {
    f.axis = b2Neg(f.axis);
  }
  return f;
}
var MinSeparationReturn = class {
  constructor(indexA, indexB, separation) {
    this.indexA = indexA;
    this.indexB = indexB;
    this.separation = separation;
  }
};
function b2FindMinSeparation(f, t) {
  const xfA = b2GetSweepTransform(f.sweepA, t);
  const xfB = b2GetSweepTransform(f.sweepB, t);
  switch (f.type) {
    case b2SeparationType.b2_pointsType: {
      const axisA = b2InvRotateVector(xfA.q, f.axis);
      const axisB = b2InvRotateVector(xfB.q, b2Neg(f.axis));
      const indexA = b2FindSupport(f.proxyA, axisA);
      const indexB = b2FindSupport(f.proxyB, axisB);
      const localPointA = f.proxyA.points[indexA];
      const localPointB = f.proxyB.points[indexB];
      const pointA = b2TransformPoint(xfA, localPointA);
      const pointB = b2TransformPoint(xfB, localPointB);
      const separation = b2Dot(b2Sub(pointB, pointA), f.axis);
      return new MinSeparationReturn(indexA, indexB, separation);
    }
    case b2SeparationType.b2_faceAType: {
      const normal = b2RotateVector(xfA.q, f.axis);
      const pointA = b2TransformPoint(xfA, f.localPoint);
      const axisB = b2InvRotateVector(xfB.q, b2Neg(normal));
      const indexA = -1;
      const indexB = b2FindSupport(f.proxyB, axisB);
      const localPointB = f.proxyB.points[indexB];
      const pointB = b2TransformPoint(xfB, localPointB);
      const separation = b2Dot(b2Sub(pointB, pointA), normal);
      return new MinSeparationReturn(indexA, indexB, separation);
    }
    case b2SeparationType.b2_faceBType: {
      const normal = b2RotateVector(xfB.q, f.axis);
      const pointB = b2TransformPoint(xfB, f.localPoint);
      const axisA = b2InvRotateVector(xfA.q, b2Neg(normal));
      const indexB = -1;
      const indexA = b2FindSupport(f.proxyA, axisA);
      const localPointA = f.proxyA.points[indexA];
      const pointA = b2TransformPoint(xfA, localPointA);
      const separation = b2Dot(b2Sub(pointA, pointB), normal);
      return new MinSeparationReturn(indexA, indexB, separation);
    }
    default:
      return new MinSeparationReturn(-1, -1, 0);
  }
}
function b2EvaluateSeparation(f, indexA, indexB, t) {
  const xfA = b2GetSweepTransform(f.sweepA, t);
  const xfB = b2GetSweepTransform(f.sweepB, t);
  switch (f.type) {
    case b2SeparationType.b2_pointsType: {
      const localPointA = f.proxyA.points[indexA];
      const localPointB = f.proxyB.points[indexB];
      const pointA = b2TransformPoint(xfA, localPointA);
      const pointB = b2TransformPoint(xfB, localPointB);
      const separation = b2Dot(b2Sub(pointB, pointA), f.axis);
      return separation;
    }
    case b2SeparationType.b2_faceAType: {
      const normal = b2RotateVector(xfA.q, f.axis);
      const pointA = b2TransformPoint(xfA, f.localPoint);
      const localPointB = f.proxyB.points[indexB];
      const pointB = b2TransformPoint(xfB, localPointB);
      const separation = b2Dot(b2Sub(pointB, pointA), normal);
      return separation;
    }
    case b2SeparationType.b2_faceBType: {
      const normal = b2RotateVector(xfB.q, f.axis);
      const pointB = b2TransformPoint(xfB, f.localPoint);
      const localPointA = f.proxyA.points[indexA];
      const pointA = b2TransformPoint(xfA, localPointA);
      const separation = b2Dot(b2Sub(pointA, pointB), normal);
      return separation;
    }
    default:
      return 0;
  }
}
function b2TimeOfImpact(input) {
  const output = new b2TOIOutput();
  output.state = b2TOIState.b2_toiStateUnknown;
  output.t = input.tMax;
  const proxyA = input.proxyA;
  const proxyB = input.proxyB;
  const sweepA = input.sweepA;
  const sweepB = input.sweepB;
  const tMax = input.tMax;
  const totalRadius = proxyA.radius + proxyB.radius;
  const target = Math.max(b2_linearSlop, totalRadius - b2_linearSlop);
  const tolerance = 0.25 * b2_linearSlop;
  let t1 = 0;
  const k_maxIterations = 20;
  let iter = 0;
  const cache = new b2DistanceCache();
  const distanceInput = new b2DistanceInput();
  distanceInput.proxyA = input.proxyA;
  distanceInput.proxyB = input.proxyB;
  distanceInput.useRadii = false;
  for (; ; ) {
    const xfA = b2GetSweepTransform(sweepA, t1);
    const xfB = b2GetSweepTransform(sweepB, t1);
    distanceInput.transformA = xfA;
    distanceInput.transformB = xfB;
    const distanceOutput = b2ShapeDistance(cache, distanceInput, null, 0);
    if (distanceOutput.distance <= 0) {
      output.state = b2TOIState.b2_toiStateOverlapped;
      output.t = 0;
      break;
    }
    if (distanceOutput.distance < target + tolerance) {
      output.state = b2TOIState.b2_toiStateHit;
      output.t = t1;
      break;
    }
    const fcn = b2MakeSeparationFunction(cache, proxyA, sweepA, proxyB, sweepB, t1);
    let done = false;
    let t2 = tMax;
    let pushBackIter = 0;
    for (; ; ) {
      const ret = b2FindMinSeparation(fcn, t2);
      let s2 = ret.separation;
      const indexA = ret.indexA;
      const indexB = ret.indexB;
      if (s2 > target + tolerance) {
        output.state = b2TOIState.b2_toiStateSeparated;
        output.t = tMax;
        done = true;
        break;
      }
      if (s2 > target - tolerance) {
        t1 = t2;
        break;
      }
      let s1 = b2EvaluateSeparation(fcn, indexA, indexB, t1);
      if (s1 < target - tolerance) {
        output.state = b2TOIState.b2_toiStateFailed;
        output.t = t1;
        done = true;
        break;
      }
      if (s1 <= target + tolerance) {
        output.state = b2TOIState.b2_toiStateHit;
        output.t = t1;
        done = true;
        break;
      }
      let rootIterCount = 0;
      let a1 = t1, a2 = t2;
      for (; ; ) {
        let t;
        if (rootIterCount & 1) {
          t = a1 + (target - s1) * (a2 - a1) / (s2 - s1);
        } else {
          t = 0.5 * (a1 + a2);
        }
        ++rootIterCount;
        const s = b2EvaluateSeparation(fcn, indexA, indexB, t);
        if (Math.abs(s - target) < tolerance) {
          t2 = t;
          break;
        }
        if (s > target) {
          a1 = t;
          s1 = s;
        } else {
          a2 = t;
          s2 = s;
        }
        if (rootIterCount == 50) {
          break;
        }
      }
      ++pushBackIter;
      if (pushBackIter == B2_MAX_POLYGON_VERTICES) {
        break;
      }
    }
    ++iter;
    if (done) {
      break;
    }
    if (iter == k_maxIterations) {
      output.state = b2TOIState.b2_toiStateFailed;
      output.t = t1;
      break;
    }
  }
  return output;
}

// src/hull_c.js
function b2RecurseHull(p14, p23, ps, count) {
  const hull = new b2Hull();
  if (count === 0) {
    return hull;
  }
  const e = b2Normalize(b2Sub(p23, p14));
  const rightPoints = [];
  let rightCount = 0;
  let bestIndex = 0;
  let bestDistance = b2Cross(b2Sub(ps[bestIndex], p14), e);
  if (bestDistance > 0) {
    rightPoints[rightCount++] = ps[bestIndex];
  }
  for (let i = 1; i < count; ++i) {
    const distance = b2Cross(b2Sub(ps[i], p14), e);
    if (distance > bestDistance) {
      bestIndex = i;
      bestDistance = distance;
    }
    if (distance > 0) {
      rightPoints[rightCount++] = ps[i];
    }
  }
  if (bestDistance < 2 * b2_linearSlop) {
    return hull;
  }
  const bestPoint = ps[bestIndex];
  const hull1 = b2RecurseHull(p14, bestPoint, rightPoints, rightCount);
  const hull2 = b2RecurseHull(bestPoint, p23, rightPoints, rightCount);
  for (let i = 0; i < hull1.count; ++i) {
    hull.points[hull.count++] = hull1.points[i];
  }
  hull.points[hull.count++] = bestPoint;
  for (let i = 0; i < hull2.count; ++i) {
    hull.points[hull.count++] = hull2.points[i];
  }
  return hull;
}
function b2IsPolygonCCW(points, count) {
  let area = 0;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    area += (points[j].x - points[i].x) * (points[j].y + points[i].y);
  }
  return area < 0;
}
function b2ComputeHull(points, count) {
  const hull = new b2Hull();
  if (count < 3 || count > B2_MAX_POLYGON_VERTICES) {
    return hull;
  }
  const aabb = new b2AABB(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
  const ps = [];
  let n = 0;
  const tolSqr = 16 * b2_linearSlop * b2_linearSlop;
  for (let i = 0; i < count; ++i) {
    aabb.lowerBoundX = Math.min(aabb.lowerBoundX, points[i].x);
    aabb.lowerBoundY = Math.min(aabb.lowerBoundY, points[i].y);
    aabb.upperBoundX = Math.max(aabb.upperBoundX, points[i].x);
    aabb.upperBoundY = Math.max(aabb.upperBoundY, points[i].y);
    const vi = points[i];
    let unique = true;
    for (let j = 0; j < i; ++j) {
      const vj = points[j];
      const distSqr = b2DistanceSquared(vi, vj);
      if (distSqr < tolSqr) {
        unique = false;
        break;
      }
    }
    if (unique) {
      ps[n++] = vi;
    }
  }
  if (n < 3) {
    return hull;
  }
  const c2 = b2AABB_Center(aabb);
  let f1 = 0;
  let dsq1 = b2DistanceSquared(c2, ps[f1]);
  for (let i = 1; i < n; ++i) {
    const dsq = b2DistanceSquared(c2, ps[i]);
    if (dsq > dsq1) {
      f1 = i;
      dsq1 = dsq;
    }
  }
  const p14 = ps[f1];
  ps[f1] = ps[n - 1];
  n = n - 1;
  let f2 = 0;
  let dsq2 = b2DistanceSquared(p14, ps[f2]);
  for (let i = 1; i < n; ++i) {
    const dsq = b2DistanceSquared(p14, ps[i]);
    if (dsq > dsq2) {
      f2 = i;
      dsq2 = dsq;
    }
  }
  const p23 = ps[f2];
  ps[f2] = ps[n - 1];
  n = n - 1;
  const rightPoints = [];
  let rightCount = 0;
  const leftPoints = [];
  let leftCount = 0;
  const e = b2Normalize(b2Sub(p23, p14));
  for (let i = 0; i < n; ++i) {
    const d = b2Cross(b2Sub(ps[i], p14), e);
    if (d >= 2 * b2_linearSlop) {
      rightPoints[rightCount++] = ps[i];
    } else if (d <= -2 * b2_linearSlop) {
      leftPoints[leftCount++] = ps[i];
    }
  }
  const hull1 = b2RecurseHull(p14, p23, rightPoints, rightCount);
  const hull2 = b2RecurseHull(p23, p14, leftPoints, leftCount);
  if (hull1.count === 0 && hull2.count === 0) {
    return hull;
  }
  hull.points[hull.count++] = p14;
  for (let i = 0; i < hull1.count; ++i) {
    hull.points[hull.count++] = hull1.points[i];
  }
  hull.points[hull.count++] = p23;
  for (let i = 0; i < hull2.count; ++i) {
    hull.points[hull.count++] = hull2.points[i];
  }
  let searching = true;
  while (searching && hull.count > 2) {
    searching = false;
    for (let i = 0; i < hull.count; ++i) {
      const i1 = i;
      const i2 = (i + 1) % hull.count;
      const i3 = (i + 2) % hull.count;
      const s1 = hull.points[i1];
      const s2 = hull.points[i2];
      const s3 = hull.points[i3];
      const r = b2Normalize(b2Sub(s3, s1));
      const distance = b2Cross(b2Sub(s2, s1), r);
      if (distance <= 2 * b2_linearSlop) {
        for (let j = i2; j < hull.count - 1; ++j) {
          hull.points[j] = hull.points[j + 1];
        }
        hull.count -= 1;
        searching = true;
        break;
      }
    }
  }
  if (hull.count < 3) {
    hull.count = 0;
  }
  return hull;
}
function b2ValidateHull(hull) {
  if (!b2Validation) {
    return true;
  }
  if (hull.count < 3 || B2_MAX_POLYGON_VERTICES < hull.count) {
    return false;
  }
  if (!b2IsPolygonCCW(hull.points, hull.count)) {
    return false;
  }
  for (let i = 0; i < hull.count; ++i) {
    const i1 = i;
    const i2 = i < hull.count - 1 ? i1 + 1 : 0;
    const p4 = hull.points[i1];
    const e = b2Normalize(b2Sub(hull.points[i2], p4));
    for (let j = 0; j < hull.count; ++j) {
      if (j === i1 || j === i2) {
        continue;
      }
      const distance = b2Cross(b2Sub(hull.points[j], p4), e);
      if (distance >= 0) {
        return false;
      }
    }
  }
  for (let i = 0; i < hull.count; ++i) {
    const i1 = i;
    const i2 = (i + 1) % hull.count;
    const i3 = (i + 2) % hull.count;
    const p14 = hull.points[i1];
    const p23 = hull.points[i2];
    const p32 = hull.points[i3];
    const e = b2Normalize(b2Sub(p32, p14));
    const distance = b2Cross(b2Sub(p23, p14), e);
    if (distance <= b2_linearSlop) {
      return false;
    }
  }
  return true;
}

// src/geometry_c.js
function b2IsValidRay(input) {
  const isValid = b2Vec2_IsValid(input.origin) && b2Vec2_IsValid(input.translation) && b2IsValid(input.maxFraction) && 0 <= input.maxFraction && input.maxFraction < B2_HUGE;
  return isValid;
}
function b2ComputePolygonCentroid(vertices, count) {
  let center = new b2Vec2(0, 0);
  let area = 0;
  const origin = vertices[0];
  const inv3 = 1 / 3;
  for (let i = 1; i < count - 1; ++i) {
    const e1 = b2Sub(vertices[i], origin);
    const e2 = b2Sub(vertices[i + 1], origin);
    const a = 0.5 * b2Cross(e1, e2);
    center = b2MulAdd(center, a * inv3, b2Add(e1, e2));
    area += a;
  }
  const invArea = 1 / area;
  center.x *= invArea;
  center.y *= invArea;
  center = b2Add(origin, center);
  return center;
}
function b2MakePolygon(hull, radius, forceCheck = true) {
  if (forceCheck && !b2ValidateHull(hull)) {
    return null;
  }
  if (hull.count < 3) {
    return b2MakeSquare(0.5);
  }
  const shape = new b2Polygon();
  shape.count = hull.count;
  shape.radius = radius;
  for (let i = 0; i < shape.count; ++i) {
    shape.vertices[i] = hull.points[i];
  }
  for (let i = 0; i < shape.count; ++i) {
    const i1 = i;
    const i2 = i + 1 < shape.count ? i + 1 : 0;
    const edge = b2Sub(shape.vertices[i2], shape.vertices[i1]);
    shape.normals[i] = b2Normalize(b2CrossVS(edge, 1));
  }
  shape.centroid = b2ComputePolygonCentroid(shape.vertices, shape.count);
  return shape;
}
function b2MakeOffsetPolygon(hull, radius, transform, forceCheck = true) {
  if (hull.count < 3) {
    return b2MakeSquare(0.5);
  }
  const shape = new b2Polygon();
  shape.count = hull.count;
  shape.radius = radius;
  for (let i = 0; i < shape.count; ++i) {
    shape.vertices[i] = b2TransformPoint(transform, hull.points[i]);
  }
  for (let i = 0; i < shape.count; ++i) {
    const i1 = i;
    const i2 = i + 1 < shape.count ? i + 1 : 0;
    const edge = b2Sub(shape.vertices[i2], shape.vertices[i1]);
    shape.normals[i] = b2Normalize(b2CrossVS(edge, 1));
  }
  shape.centroid = b2ComputePolygonCentroid(shape.vertices, shape.count);
  return shape;
}
function b2MakeSquare(h) {
  return b2MakeBox(h, h);
}
function b2MakeBox(hx, hy) {
  const shape = new b2Polygon();
  shape.count = 4;
  shape.vertices[0] = new b2Vec2(-hx, -hy);
  shape.vertices[1] = new b2Vec2(hx, -hy);
  shape.vertices[2] = new b2Vec2(hx, hy);
  shape.vertices[3] = new b2Vec2(-hx, hy);
  shape.normals[0] = new b2Vec2(0, -1);
  shape.normals[1] = new b2Vec2(1, 0);
  shape.normals[2] = new b2Vec2(0, 1);
  shape.normals[3] = new b2Vec2(-1, 0);
  shape.radius = 0;
  shape.centroid = new b2Vec2(0, 0);
  return shape;
}
function b2MakeRoundedBox(hx, hy, radius) {
  const shape = b2MakeBox(hx, hy);
  shape.radius = radius;
  return shape;
}
function b2MakeOffsetBox(hx, hy, center, angle = 0) {
  const xf2 = new b2Transform();
  xf2.p = center;
  xf2.q = b2MakeRot(angle);
  const shape = new b2Polygon();
  shape.count = 4;
  shape.vertices[0] = b2TransformPoint(xf2, new b2Vec2(-hx, -hy));
  shape.vertices[1] = b2TransformPoint(xf2, new b2Vec2(hx, -hy));
  shape.vertices[2] = b2TransformPoint(xf2, new b2Vec2(hx, hy));
  shape.vertices[3] = b2TransformPoint(xf2, new b2Vec2(-hx, hy));
  shape.normals[0] = b2RotateVector(xf2.q, new b2Vec2(0, -1));
  shape.normals[1] = b2RotateVector(xf2.q, new b2Vec2(1, 0));
  shape.normals[2] = b2RotateVector(xf2.q, new b2Vec2(0, 1));
  shape.normals[3] = b2RotateVector(xf2.q, new b2Vec2(-1, 0));
  shape.radius = 0;
  shape.centroid = center;
  return shape;
}
function b2TransformPolygon(transform, polygon) {
  const p4 = polygon;
  for (let i = 0; i < p4.count; ++i) {
    p4.vertices[i] = b2TransformPoint(transform, p4.vertices[i]);
    p4.normals[i] = b2RotateVector(transform.q, p4.normals[i]);
  }
  p4.centroid = b2TransformPoint(transform, p4.centroid);
  return p4;
}
function b2ComputeCircleMass(shape, density) {
  const rr = shape.radius * shape.radius;
  const massData = new b2MassData();
  massData.mass = density * Math.PI * rr;
  massData.center = shape.center.clone();
  massData.rotationalInertia = massData.mass * (0.5 * rr + b2Dot(shape.center, shape.center));
  return massData;
}
function b2ComputeCapsuleMass(shape, density) {
  const radius = shape.radius;
  const rr = radius * radius;
  const p14 = shape.center1;
  const p23 = shape.center2;
  const length = b2Length(b2Sub(p23, p14));
  const ll = length * length;
  const circleMass = density * Math.PI * rr;
  const boxMass = density * (2 * radius * length);
  const massData = new b2MassData();
  massData.mass = circleMass + boxMass;
  massData.center = new b2Vec2(0.5 * (p14.x + p23.x), 0.5 * (p14.y + p23.y));
  const lc = 4 * radius / (3 * Math.PI);
  const h = 0.5 * length;
  const circleInertia = circleMass * (0.5 * rr + h * h + 2 * h * lc);
  const boxInertia = boxMass * (4 * rr + ll) / 12;
  massData.rotationalInertia = circleInertia + boxInertia;
  massData.rotationalInertia += massData.mass * b2Dot(massData.center, massData.center);
  return massData;
}
function b2ComputePolygonMass(shape, density) {
  if (shape.count == 1) {
    const circle = new b2Circle();
    circle.center = shape.vertices[0].clone();
    circle.radius = shape.radius;
    return b2ComputeCircleMass(circle, density);
  }
  if (shape.count == 2) {
    const capsule = new b2Capsule();
    capsule.center1 = shape.vertices[0].clone();
    capsule.center2 = shape.vertices[1].clone();
    capsule.radius = shape.radius;
    return b2ComputeCapsuleMass(capsule, density);
  }
  const vertices = new Array(B2_MAX_POLYGON_VERTICES);
  const count = shape.count;
  const radius = shape.radius;
  if (radius > 0) {
    const sqrt2 = 1.412;
    for (let i = 0; i < count; ++i) {
      const j = i == 0 ? count - 1 : i - 1;
      const n1 = shape.normals[j];
      const n2 = shape.normals[i];
      const mid = b2Normalize(b2Add(n1, n2));
      vertices[i] = b2MulAdd(shape.vertices[i], sqrt2 * radius, mid);
    }
  } else {
    for (let i = 0; i < count; ++i) {
      vertices[i] = shape.vertices[i];
    }
  }
  let center = new b2Vec2(0, 0);
  let area = 0;
  let rotationalInertia = 0;
  const r = vertices[0];
  const inv3 = 1 / 3;
  for (let i = 1; i < count - 1; ++i) {
    const e1 = b2Sub(vertices[i], r);
    const e2 = b2Sub(vertices[i + 1], r);
    const D = b2Cross(e1, e2);
    const triangleArea = 0.5 * D;
    area += triangleArea;
    center = b2MulAdd(center, triangleArea * inv3, b2Add(e1, e2));
    const ex1 = e1.x, ey1 = e1.y;
    const ex2 = e2.x, ey2 = e2.y;
    const intx2 = ex1 * ex1 + ex2 * ex1 + ex2 * ex2;
    const inty2 = ey1 * ey1 + ey2 * ey1 + ey2 * ey2;
    rotationalInertia += 0.25 * inv3 * D * (intx2 + inty2);
  }
  const massData = new b2MassData();
  massData.mass = density * area;
  const invArea = 1 / area;
  center.x *= invArea;
  center.y *= invArea;
  massData.center = b2Add(r, center);
  massData.rotationalInertia = density * rotationalInertia;
  massData.rotationalInertia += massData.mass * (b2Dot(massData.center, massData.center) - b2Dot(center, center));
  return massData;
}
function b2ComputeCircleAABB(shape, xf2) {
  const pX = xf2.q.c * shape.center.x - xf2.q.s * shape.center.y + xf2.p.x;
  const pY = xf2.q.s * shape.center.x + xf2.q.c * shape.center.y + xf2.p.y;
  const r = shape.radius;
  const aabb = new b2AABB(pX - r, pY - r, pX + r, pY + r);
  return aabb;
}
function b2ComputeCapsuleAABB(shape, xf2) {
  const v1 = b2TransformPoint(xf2, shape.center1);
  const v2 = b2TransformPoint(xf2, shape.center2);
  const lowerX = Math.min(v1.x, v2.x) - shape.radius;
  const lowerY = Math.min(v1.y, v2.y) - shape.radius;
  const upperX = Math.max(v1.x, v2.x) + shape.radius;
  const upperY = Math.max(v1.y, v2.y) + shape.radius;
  const aabb = new b2AABB(lowerX, lowerY, upperX, upperY);
  return aabb;
}
function b2ComputePolygonAABB(shape, xf2) {
  const sv = shape.vertices[0];
  let lowerX = xf2.q.c * sv.x - xf2.q.s * sv.y + xf2.p.x;
  let lowerY = xf2.q.s * sv.x + xf2.q.c * sv.y + xf2.p.y;
  let upperX = lowerX, upperY = lowerY;
  for (let i = 1; i < shape.count; ++i) {
    const sv2 = shape.vertices[i];
    const vx = xf2.q.c * sv2.x - xf2.q.s * sv2.y + xf2.p.x;
    const vy = xf2.q.s * sv2.x + xf2.q.c * sv2.y + xf2.p.y;
    lowerX = Math.min(lowerX, vx);
    lowerY = Math.min(lowerY, vy);
    upperX = Math.max(upperX, vx);
    upperY = Math.max(upperY, vy);
  }
  const r = shape.radius;
  lowerX -= r;
  lowerY -= r;
  upperX += r;
  upperY += r;
  const aabb = new b2AABB(lowerX, lowerY, upperX, upperY);
  return aabb;
}
function b2ComputeSegmentAABB(shape, xf2) {
  const v1 = b2TransformPoint(xf2, shape.point1);
  const v2 = b2TransformPoint(xf2, shape.point2);
  const lower = b2Min(v1, v2);
  const upper = b2Max(v1, v2);
  const aabb = new b2AABB(lower.x, lower.y, upper.x, upper.y);
  return aabb;
}
function b2PointInCircle(point, shape) {
  const center = shape.center;
  return b2DistanceSquared(point, center) <= shape.radius * shape.radius;
}
function b2PointInCapsule(point, shape) {
  const rr = shape.radius * shape.radius;
  const p14 = shape.center1;
  const p23 = shape.center2;
  const d = b2Sub(p23, p14);
  const dd = b2Dot(d, d);
  if (dd == 0) {
    return b2DistanceSquared(point, p14) <= rr;
  }
  let t = b2Dot(b2Sub(point, p14), d) / dd;
  t = b2ClampFloat(t, 0, 1);
  const c2 = b2MulAdd(p14, t, d);
  return b2DistanceSquared(point, c2) <= rr;
}
function b2PointInPolygon(point, shape) {
  const input = new b2DistanceInput();
  input.proxyA = b2MakeProxy(shape.vertices, shape.count, 0);
  input.proxyB = b2MakeProxy([point], 1, 0);
  input.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.useRadii = false;
  const cache = new b2DistanceCache();
  const output = b2ShapeDistance(cache, input, null, 0);
  return output.distance <= shape.radius;
}
var rayPoint2 = new b2Vec2(0, 0);
var rayNormal2 = new b2Vec2(0, 1);
function b2RayCastCircle(input, shape) {
  const p4 = shape.center.clone();
  const output = new b2CastOutput(rayNormal2, rayPoint2);
  const s = b2Sub(input.origin, p4);
  const res = b2GetLengthAndNormalize(input.translation);
  const length = res.length;
  if (length == 0) {
    return output;
  }
  const d = res.normal;
  const t = -b2Dot(s, d);
  const c2 = b2MulAdd(s, t, d);
  const cc = b2Dot(c2, c2);
  const r = shape.radius;
  const rr = r * r;
  if (cc > rr) {
    return output;
  }
  const h = Math.sqrt(rr - cc);
  const fraction = t - h;
  if (fraction < 0 || input.maxFraction * length < fraction) {
    return output;
  }
  const hitPoint = b2MulAdd(s, fraction, d);
  output.fraction = fraction / length;
  output.normal = b2Normalize(hitPoint);
  output.point = b2MulAdd(p4, shape.radius, output.normal);
  output.hit = true;
  return output;
}
function b2RayCastCapsule(input, shape) {
  const output = new b2CastOutput(rayNormal2, rayPoint2);
  const v1 = shape.center1;
  const v2 = shape.center2;
  const e = b2Sub(v2, v1);
  const res = b2GetLengthAndNormalize(e);
  const capsuleLength = res.length;
  const a = res.normal;
  if (capsuleLength < eps) {
    const circle = new b2Circle();
    circle.center = v1;
    circle.radius = shape.radius;
    return b2RayCastCircle(input, circle);
  }
  const p14 = input.origin;
  const d = input.translation;
  const q3 = b2Sub(p14, v1);
  const qa = b2Dot(q3, a);
  const qp = b2MulAdd(q3, -qa, a);
  const radius = shape.radius;
  if (b2Dot(qp, qp) < radius * radius) {
    if (qa < 0) {
      const circle = new b2Circle();
      circle.center = v1;
      circle.radius = shape.radius;
      return b2RayCastCircle(input, circle);
    }
    if (qa > 1) {
      const circle = new b2Circle();
      circle.center = v2;
      circle.radius = shape.radius;
      return b2RayCastCircle(input, circle);
    }
    return output;
  }
  let n = new b2Vec2(a.y, -a.x);
  const res0 = b2GetLengthAndNormalize(d);
  const rayLength = res0.length;
  const u = res0.normal;
  const den = -a.x * u.y + u.x * a.y;
  if (-eps < den && den < eps) {
    return output;
  }
  const b1 = b2MulSub(q3, radius, n);
  const b2 = b2MulAdd(q3, radius, n);
  const invDen = 1 / den;
  const s21 = (a.x * b1.y - b1.x * a.y) * invDen;
  const s22 = (a.x * b2.y - b2.x * a.y) * invDen;
  let s2, b;
  if (s21 < s22) {
    s2 = s21;
    b = b1;
  } else {
    s2 = s22;
    b = b2;
    n = b2Neg(n);
  }
  if (s2 < 0 || input.maxFraction * rayLength < s2) {
    return output;
  }
  const s1 = (-b.x * u.y + u.x * b.y) * invDen;
  if (s1 < 0) {
    const circle = new b2Circle();
    circle.center = v1;
    circle.radius = shape.radius;
    return b2RayCastCircle(input, circle);
  } else if (capsuleLength < s1) {
    const circle = new b2Circle();
    circle.center = v2;
    circle.radius = shape.radius;
    return b2RayCastCircle(input, circle);
  } else {
    output.fraction = s2 / rayLength;
    output.point = b2Add(b2Lerp(v1, v2, s1 / capsuleLength), b2MulSV(shape.radius, n));
    output.normal = n;
    output.hit = true;
    return output;
  }
}
function b2RayCastSegment(input, shape, oneSided) {
  if (oneSided) {
    const offset = b2Cross(b2Sub(input.origin, shape.point1), b2Sub(shape.point2, shape.point1));
    if (offset < 0) {
      const output2 = new b2CastOutput(rayNormal2, rayPoint2);
      return output2;
    }
  }
  const p14 = input.origin;
  const d = input.translation;
  const v1 = shape.point1;
  const v2 = shape.point2;
  const e = b2Sub(v2, v1);
  const output = new b2CastOutput(rayNormal2, rayPoint2);
  const res = b2GetLengthAndNormalize(e);
  const length = res.length;
  const eUnit = res.normal;
  if (length == 0) {
    return output;
  }
  let normal = b2RightPerp(eUnit);
  const numerator = b2Dot(normal, b2Sub(v1, p14));
  const denominator = b2Dot(normal, d);
  if (denominator == 0) {
    return output;
  }
  const t = numerator / denominator;
  if (t < 0 || input.maxFraction < t) {
    return output;
  }
  const p4 = b2MulAdd(p14, t, d);
  const s = b2Dot(b2Sub(p4, v1), eUnit);
  if (s < 0 || length < s) {
    return output;
  }
  if (numerator > 0) {
    normal = b2Neg(normal);
  }
  output.fraction = t;
  output.point = b2MulAdd(p14, t, d);
  output.normal = normal;
  output.hit = true;
  return output;
}
function b2RayCastPolygon(input, shape) {
  if (shape.radius === 0) {
    const p14 = input.origin;
    const d = input.translation;
    let lower = 0, upper = input.maxFraction;
    let index = -1;
    const output = new b2CastOutput(rayNormal2, rayPoint2);
    for (let i = 0; i < shape.count; ++i) {
      const numerator = b2Dot(shape.normals[i], b2Sub(shape.vertices[i], p14));
      const denominator = b2Dot(shape.normals[i], d);
      if (denominator === 0) {
        if (numerator < 0) {
          return output;
        }
      } else {
        if (denominator < 0 && numerator < lower * denominator) {
          lower = numerator / denominator;
          index = i;
        } else if (denominator > 0 && numerator < upper * denominator) {
          upper = numerator / denominator;
        }
      }
      if (upper < lower) {
        return output;
      }
    }
    if (index >= 0) {
      output.fraction = lower;
      output.normal = shape.normals[index];
      output.point = b2MulAdd(p14, lower, d);
      output.hit = true;
    }
    return output;
  }
  const castInput = new b2ShapeCastPairInput();
  castInput.proxyA = b2MakeProxy(shape.vertices, shape.count, shape.radius);
  castInput.proxyB = b2MakeProxy([input.origin], 1, 0);
  castInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  castInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  castInput.translationB = input.translation;
  castInput.maxFraction = input.maxFraction;
  return b2ShapeCast(castInput);
}
function b2ShapeCastCircle(input, shape) {
  const pairInput = new b2ShapeCastPairInput();
  pairInput.proxyA = b2MakeProxy([shape.center.clone()], 1, shape.radius);
  pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
  pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.translationB = input.translation;
  pairInput.maxFraction = input.maxFraction;
  const output = b2ShapeCast(pairInput);
  return output;
}
function b2ShapeCastCapsule(input, shape) {
  const pairInput = new b2ShapeCastPairInput();
  pairInput.proxyA = b2MakeProxy([shape.center1, shape.center2], 2, shape.radius);
  pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
  pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.translationB = input.translation;
  pairInput.maxFraction = input.maxFraction;
  const output = b2ShapeCast(pairInput);
  return output;
}
function b2ShapeCastSegment(input, shape) {
  const pairInput = new b2ShapeCastPairInput();
  pairInput.proxyA = b2MakeProxy([shape.point1, shape.point2], 2, 0);
  pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
  pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.translationB = input.translation;
  pairInput.maxFraction = input.maxFraction;
  const output = b2ShapeCast(pairInput);
  return output;
}
function b2ShapeCastPolygon(input, shape) {
  const pairInput = new b2ShapeCastPairInput();
  pairInput.proxyA = b2MakeProxy(shape.vertices, shape.count, shape.radius);
  pairInput.proxyB = b2MakeProxy(input.points, input.count, input.radius);
  pairInput.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  pairInput.translationB = input.translation;
  pairInput.maxFraction = input.maxFraction;
  const output = b2ShapeCast(pairInput);
  return output;
}

// src/shape_c.js
function b2GetShape(world, shapeId) {
  const id = shapeId.index1 - 1;
  const shape = world.shapeArray[id];
  return shape;
}
function b2GetOwnerTransform(world, shape) {
  return b2GetBodyTransform(world, shape.bodyId);
}
function b2GetChainShape(world, chainId) {
  const id = chainId.index1 - 1;
  const chain = world.chainArray[id];
  return chain;
}
function b2UpdateShapeAABBs(shape, transform, proxyType) {
  const speculativeDistance = b2_speculativeDistance;
  const aabbMargin = b2_aabbMargin;
  const aabb = b2ComputeShapeAABB(shape, transform);
  aabb.lowerBoundX -= speculativeDistance;
  aabb.lowerBoundY -= speculativeDistance;
  aabb.upperBoundX += speculativeDistance;
  aabb.upperBoundY += speculativeDistance;
  shape.aabb = aabb;
  const margin = proxyType == b2BodyType.b2_staticBody ? speculativeDistance : aabbMargin;
  const fatAABB = new b2AABB(
    aabb.lowerBoundX - margin,
    aabb.lowerBoundY - margin,
    aabb.upperBoundX + margin,
    aabb.upperBoundY + margin
  );
  shape.fatAABB = fatAABB;
}
function b2CreateShapeInternal(world, body, transform, def, geometry, shapeType) {
  const shapeId = b2AllocId(world.shapeIdPool);
  if (shapeId == world.shapeArray.length) {
    world.shapeArray.push(new b2Shape());
  }
  const shape = world.shapeArray[shapeId];
  switch (shapeType) {
    case b2ShapeType.b2_capsuleShape:
      shape.capsule = geometry;
      break;
    case b2ShapeType.b2_circleShape:
      shape.circle = geometry;
      break;
    case b2ShapeType.b2_polygonShape:
      shape.polygon = geometry;
      break;
    case b2ShapeType.b2_segmentShape:
      shape.segment = geometry;
      break;
    case b2ShapeType.b2_chainSegmentShape:
      shape.chainSegment = geometry;
      break;
    default:
      break;
  }
  shape.id = shapeId;
  shape.bodyId = body.id;
  shape.type = shapeType;
  shape.density = def.density;
  shape.friction = def.friction;
  shape.restitution = def.restitution;
  shape.filter = def.filter;
  shape.userData = def.userData;
  shape.customColor = def.customColor;
  shape.isSensor = def.isSensor;
  shape.enlargedAABB = false;
  shape.enableSensorEvents = def.enableSensorEvents;
  shape.enableContactEvents = def.enableContactEvents;
  shape.enableHitEvents = def.enableHitEvents;
  shape.enablePreSolveEvents = def.enablePreSolveEvents;
  shape.isFast = false;
  shape.proxyKey = B2_NULL_INDEX;
  shape.localCentroid = b2GetShapeCentroid(shape);
  shape.aabb = new b2AABB();
  shape.fatAABB = new b2AABB();
  shape.revision += 1;
  if (body.setIndex != b2SetType.b2_disabledSet) {
    const proxyType = body.type;
    b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, def.forceContactCreation);
  }
  if (body.headShapeId != B2_NULL_INDEX) {
    const headShape = world.shapeArray[body.headShapeId];
    headShape.prevShapeId = shapeId;
  }
  shape.prevShapeId = B2_NULL_INDEX;
  shape.nextShapeId = body.headShapeId;
  body.headShapeId = shapeId;
  body.shapeCount += 1;
  b2ValidateSolverSets(world);
  return shape;
}
function b2CreateShape(bodyId, def, geometry, shapeType) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return new b2ShapeId(0, 0, 0);
  }
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const shape = b2CreateShapeInternal(world, body, transform, def, geometry, shapeType);
  if (body.updateBodyMass === true) {
    b2UpdateBodyMassData(world, body);
  }
  b2ValidateSolverSets(world);
  const id = new b2ShapeId(shape.id + 1, bodyId.world0, shape.revision);
  return id;
}
function b2CreateCircleShape(bodyId, def, circle) {
  return b2CreateShape(bodyId, def, circle, b2ShapeType.b2_circleShape);
}
function b2CreateCapsuleShape(bodyId, def, capsule) {
  const lengthSqr = b2DistanceSquared(capsule.center1, capsule.center2);
  if (lengthSqr <= b2_linearSlop * b2_linearSlop) {
    const circle = new b2Circle();
    circle.center = b2Lerp(capsule.center1, capsule.center2, 0.5);
    circle.radius = capsule.radius;
    return b2CreateShape(bodyId, def, circle, b2ShapeType.b2_circleShape);
  }
  return b2CreateShape(bodyId, def, capsule, b2ShapeType.b2_capsuleShape);
}
function b2CreatePolygonShape(bodyId, def, polygon) {
  return b2CreateShape(bodyId, def, polygon, b2ShapeType.b2_polygonShape);
}
function b2CreateSegmentShape(bodyId, def, segment) {
  const lengthSqr = b2DistanceSquared(segment.point1, segment.point2);
  if (lengthSqr <= b2_linearSlop * b2_linearSlop) {
    return new b2ShapeId();
  }
  return b2CreateShape(bodyId, def, segment, b2ShapeType.b2_segmentShape);
}
function b2DestroyShapeInternal(world, shape, body, wakeBodies) {
  const shapeId = shape.id;
  if (shape.prevShapeId !== B2_NULL_INDEX) {
    world.shapeArray[shape.prevShapeId].nextShapeId = shape.nextShapeId;
  }
  if (shape.nextShapeId !== B2_NULL_INDEX) {
    world.shapeArray[shape.nextShapeId].prevShapeId = shape.prevShapeId;
  }
  if (shapeId === body.headShapeId) {
    body.headShapeId = shape.nextShapeId;
  }
  body.shapeCount -= 1;
  b2DestroyShapeProxy(shape, world.broadPhase);
  let contactKey = body.headContactKey;
  while (contactKey !== B2_NULL_INDEX) {
    const contactId = contactKey >> 1;
    const edgeIndex = contactKey & 1;
    const contact = world.contactArray[contactId];
    contactKey = contact.edges[edgeIndex].nextKey;
    if (contact.shapeIdA === shapeId || contact.shapeIdB === shapeId) {
      b2DestroyContact(world, contact, wakeBodies);
    }
  }
  b2FreeId(world.shapeIdPool, shapeId);
  shape.id = B2_NULL_INDEX;
  b2ValidateSolverSets(world);
}
function b2DestroyShape(shapeId) {
  const world = b2GetWorldLocked(shapeId.world0);
  const id = shapeId.index1 - 1;
  const shape = world.shapeArray[id];
  const wakeBodies = true;
  const body = b2GetBody(world, shape.bodyId);
  b2DestroyShapeInternal(world, shape, body, wakeBodies);
  if (body.updateBodyMass === true) {
    b2UpdateBodyMassData(world, body);
  }
}
function b2CreateChain(bodyId, def) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return new b2ChainId();
  }
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const chainId = b2AllocId(world.chainIdPool);
  if (chainId === world.chainArray.length) {
    world.chainArray.push(new b2ChainShape());
  }
  const chainShape = world.chainArray[chainId];
  chainShape.id = chainId;
  chainShape.bodyId = body.id;
  chainShape.nextChainId = body.headChainId;
  chainShape.revision += 1;
  body.headChainId = chainId;
  const shapeDef = b2DefaultShapeDef();
  shapeDef.userData = def.userData;
  shapeDef.restitution = def.restitution;
  shapeDef.friction = def.friction;
  shapeDef.filter = def.filter;
  shapeDef.enableContactEvents = false;
  shapeDef.enableHitEvents = false;
  shapeDef.enableSensorEvents = false;
  const n = def.count;
  const points = def.points;
  let chainSegment;
  if (def.isLoop) {
    chainShape.count = n;
    chainShape.shapeIndices = new Array(n);
    let prevIndex = n - 1;
    for (let i = 0; i < n - 2; ++i) {
      chainSegment = new b2ChainSegment();
      chainSegment.ghost1 = points[prevIndex].clone();
      chainSegment.segment = new b2Segment();
      chainSegment.segment.point1 = points[i].clone();
      chainSegment.segment.point2 = points[i + 1].clone();
      chainSegment.ghost2 = points[i + 2].clone();
      chainSegment.chainId = chainId;
      prevIndex = i;
      const shape2 = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
      chainShape.shapeIndices[i] = shape2.id;
    }
    chainSegment = new b2ChainSegment();
    chainSegment.ghost1 = points[n - 3].clone();
    chainSegment.segment = new b2Segment();
    chainSegment.segment.point1 = points[n - 2].clone();
    chainSegment.segment.point2 = points[n - 1].clone();
    chainSegment.ghost2 = points[0].clone();
    chainSegment.chainId = chainId;
    let shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
    chainShape.shapeIndices[n - 2] = shape.id;
    chainSegment = new b2ChainSegment();
    chainSegment.ghost1 = points[n - 2].clone();
    chainSegment.segment = new b2Segment();
    chainSegment.segment.point1 = points[n - 1].clone();
    chainSegment.segment.point2 = points[0].clone();
    chainSegment.ghost2 = points[1].clone();
    chainSegment.chainId = chainId;
    shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
    chainShape.shapeIndices[n - 1] = shape.id;
  } else {
    chainShape.count = n - 3;
    chainShape.shapeIndices = new Array(n);
    for (let i = 0; i < n - 3; ++i) {
      chainSegment = new b2ChainSegment();
      chainSegment.ghost1 = points[i].clone();
      chainSegment.segment = new b2Segment();
      chainSegment.segment.point1 = points[i + 1].clone();
      chainSegment.segment.point2 = points[i + 2].clone();
      chainSegment.ghost2 = points[i + 3].clone();
      chainSegment.chainId = chainId;
      const shape = b2CreateShapeInternal(world, body, transform, shapeDef, chainSegment, b2ShapeType.b2_chainSegmentShape);
      chainShape.shapeIndices[i] = shape.id;
    }
  }
  const id = new b2ChainId(chainId + 1, world.worldId, chainShape.revision);
  return id;
}
function b2DestroyChain(chainId) {
  const world = b2GetWorldLocked(chainId.world0);
  const id = chainId.index1 - 1;
  const chain = world.chainArray[id];
  const wakeBodies = true;
  const body = b2GetBody(world, chain.bodyId);
  let chainIdPtr = body.headChainId;
  let found = false;
  while (chainIdPtr !== null) {
    if (chainIdPtr === chain.id) {
      found = true;
      break;
    }
    chainIdPtr = world.chainArray[chainIdPtr].nextChainId;
  }
  if (found === false) {
    return;
  }
  const count = chain.count;
  for (let i = 0; i < count; ++i) {
    const shapeId = chain.shapeIndices[i];
    const shape = world.shapeArray[shapeId];
    b2DestroyShapeInternal(world, shape, body, wakeBodies);
  }
  chain.shapeIndices = null;
  b2FreeId(world.chainIdPool, id);
  chain.id = null;
  b2ValidateSolverSets(world);
}
function b2ComputeShapeAABB(shape, xf2) {
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return b2ComputeCapsuleAABB(shape.capsule, xf2);
    case b2ShapeType.b2_circleShape:
      return b2ComputeCircleAABB(shape.circle, xf2);
    case b2ShapeType.b2_polygonShape:
      return b2ComputePolygonAABB(shape.polygon, xf2);
    case b2ShapeType.b2_segmentShape:
      return b2ComputeSegmentAABB(shape.segment, xf2);
    case b2ShapeType.b2_chainSegmentShape:
      return b2ComputeSegmentAABB(shape.chainSegment.segment, xf2);
    default:
      return new b2AABB(xf2.p.x, xf2.p.y, xf2.p.x, xf2.p.y);
  }
}
function b2GetShapeCentroid(shape) {
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return b2Lerp(shape.capsule.center1, shape.capsule.center2, 0.5);
    case b2ShapeType.b2_circleShape:
      return shape.circle.center.clone();
    case b2ShapeType.b2_polygonShape:
      return shape.polygon.centroid.clone();
    case b2ShapeType.b2_segmentShape:
      return b2Lerp(shape.segment.point1, shape.segment.point2, 0.5);
    case b2ShapeType.b2_chainSegmentShape:
      return b2Lerp(shape.chainSegment.segment.point1, shape.chainSegment.segment.point2, 0.5);
    default:
      return new b2Vec2(0, 0);
  }
}
function b2GetShapePerimeter(shape) {
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return 2 * b2Length(b2Sub(shape.capsule.center1, shape.capsule.center2)) + 2 * Math.PI * shape.capsule.radius;
    case b2ShapeType.b2_circleShape:
      return 2 * Math.PI * shape.circle.radius;
    case b2ShapeType.b2_polygonShape: {
      const points = shape.polygon.vertices;
      const count = shape.polygon.count;
      let perimeter = 2 * Math.PI * shape.polygon.radius;
      let prev = points[count - 1];
      for (let i = 0; i < count; ++i) {
        const next = points[i];
        perimeter += b2Length(b2Sub(next, prev));
        prev = next;
      }
      return perimeter;
    }
    case b2ShapeType.b2_segmentShape:
      return 2 * b2Length(b2Sub(shape.segment.point1, shape.segment.point2));
    case b2ShapeType.b2_chainSegmentShape:
      return 2 * b2Length(b2Sub(shape.chainSegment.segment.point1, shape.chainSegment.segment.point2));
    default:
      return 0;
  }
}
function b2ComputeShapeMass(shape) {
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return b2ComputeCapsuleMass(shape.capsule, shape.density);
    case b2ShapeType.b2_circleShape:
      return b2ComputeCircleMass(shape.circle, shape.density);
    case b2ShapeType.b2_polygonShape:
      return b2ComputePolygonMass(shape.polygon, shape.density);
    default:
      return new b2MassData();
  }
}
function b2ComputeShapeExtent(shape, localCenter) {
  const extent = new b2ShapeExtent();
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      {
        const radius = shape.capsule.radius;
        extent.minExtent = radius;
        const c1 = b2Sub(shape.capsule.center1, localCenter);
        const c2 = b2Sub(shape.capsule.center2, localCenter);
        extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2))) + radius;
      }
      break;
    case b2ShapeType.b2_circleShape:
      {
        const radius = shape.circle.radius;
        extent.minExtent = radius;
        extent.maxExtent = b2Length(b2Sub(shape.circle.center, localCenter)) + radius;
      }
      break;
    case b2ShapeType.b2_polygonShape:
      {
        const poly = shape.polygon;
        let minExtent = Number.MAX_VALUE;
        let maxExtentSqr = 0;
        const count = poly.count;
        for (let i = 0; i < count; ++i) {
          const v = poly.vertices[i];
          const planeOffset = b2Dot(poly.normals[i], b2Sub(v, poly.centroid));
          minExtent = Math.min(minExtent, planeOffset);
          const distanceSqr = b2LengthSquared(b2Sub(v, localCenter));
          maxExtentSqr = Math.max(maxExtentSqr, distanceSqr);
        }
        extent.minExtent = minExtent + poly.radius;
        extent.maxExtent = Math.sqrt(maxExtentSqr) + poly.radius;
      }
      break;
    case b2ShapeType.b2_segmentShape:
      {
        extent.minExtent = 0;
        const c1 = b2Sub(shape.segment.point1, localCenter);
        const c2 = b2Sub(shape.segment.point2, localCenter);
        extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2)));
      }
      break;
    case b2ShapeType.b2_chainSegmentShape:
      {
        extent.minExtent = 0;
        const c1 = b2Sub(shape.chainSegment.segment.point1, localCenter);
        const c2 = b2Sub(shape.chainSegment.segment.point2, localCenter);
        extent.maxExtent = Math.sqrt(Math.max(b2LengthSquared(c1), b2LengthSquared(c2)));
      }
      break;
    default:
      break;
  }
  return extent;
}
var rayPoint3 = new b2Vec2(0, 0);
var rayNormal3 = new b2Vec2(0, 1);
function b2RayCastShape(input, shape, transform) {
  const localInput = input;
  localInput.origin = b2InvTransformPoint(transform, input.origin);
  localInput.translation = b2InvRotateVector(transform.q, input.translation);
  let output = new b2CastOutput();
  output.hit = false;
  output.fraction = 0;
  output.normal = new b2Vec2(0, 0);
  output.point = new b2Vec2(0, 0);
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      output = b2RayCastCapsule(localInput, shape.capsule);
      break;
    case b2ShapeType.b2_circleShape:
      output = b2RayCastCircle(localInput, shape.circle);
      break;
    case b2ShapeType.b2_polygonShape:
      output = b2RayCastPolygon(localInput, shape.polygon);
      break;
    case b2ShapeType.b2_segmentShape:
      output = b2RayCastSegment(localInput, shape.segment, false);
      break;
    case b2ShapeType.b2_chainSegmentShape:
      output = b2RayCastSegment(localInput, shape.chainSegment.segment, true);
      break;
    default:
      return output;
  }
  output.point = b2TransformPoint(transform, output.point);
  output.normal = b2RotateVector(transform.q, output.normal);
  return output;
}
function b2ShapeCastShape(input, shape, transform) {
  const localInput = input;
  for (let i = 0; i < localInput.count; ++i) {
    localInput.points[i] = b2InvTransformPoint(transform, input.points[i]);
  }
  localInput.translation = b2InvRotateVector(transform.q, input.translation);
  let output = new b2CastOutput();
  output.hit = false;
  output.fraction = 0;
  output.normal = new b2Vec2(0, 0);
  output.point = new b2Vec2(0, 0);
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      output = b2ShapeCastCapsule(localInput, shape.capsule);
      break;
    case b2ShapeType.b2_circleShape:
      output = b2ShapeCastCircle(localInput, shape.circle);
      break;
    case b2ShapeType.b2_polygonShape:
      output = b2ShapeCastPolygon(localInput, shape.polygon);
      break;
    case b2ShapeType.b2_segmentShape:
      output = b2ShapeCastSegment(localInput, shape.segment);
      break;
    case b2ShapeType.b2_chainSegmentShape:
      output = b2ShapeCastSegment(localInput, shape.chainSegment.segment);
      break;
    default:
      return output;
  }
  output.point = b2TransformPoint(transform, output.point);
  output.normal = b2RotateVector(transform.q, output.normal);
  return output;
}
function b2CreateShapeProxy(shape, bp, type, transform, forcePairCreation) {
  b2UpdateShapeAABBs(shape, transform, type);
  shape.proxyKey = b2BroadPhase_CreateProxy(bp, type, shape.fatAABB, shape.filter.categoryBits, shape.id, forcePairCreation);
}
function b2DestroyShapeProxy(shape, bp) {
  if (shape.proxyKey != B2_NULL_INDEX) {
    b2BroadPhase_DestroyProxy(bp, shape.proxyKey);
    shape.proxyKey = B2_NULL_INDEX;
  }
}
function b2MakeShapeDistanceProxy(shape) {
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return b2MakeProxy([shape.capsule.center1.clone(), shape.capsule.center2.clone()], 2, shape.capsule.radius);
    case b2ShapeType.b2_circleShape:
      return b2MakeProxy([shape.circle.center.clone()], 1, shape.circle.radius);
    case b2ShapeType.b2_polygonShape:
      return b2MakeProxy(shape.polygon.vertices, shape.polygon.count, shape.polygon.radius);
    case b2ShapeType.b2_segmentShape:
      return b2MakeProxy([shape.segment.point1, shape.segment.point2], 2, 0);
    case b2ShapeType.b2_chainSegmentShape:
      return b2MakeProxy([shape.chainSegment.segment.point1.clone(), shape.chainSegment.segment.point2.clone()], 2, 0);
    default:
      return new b2DistanceProxy();
  }
}
function b2Shape_GetBody(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return b2MakeBodyId(world, shape.bodyId);
}
function b2Shape_SetUserData(shapeId, userData) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  shape.userData = userData;
}
function b2Shape_GetUserData(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.userData;
}
function b2Shape_IsSensor(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.isSensor;
}
function b2Shape_TestPoint(shapeId, point) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  const transform = b2GetOwnerTransform(world, shape);
  const localPoint = b2InvTransformPoint(transform, point);
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      return b2PointInCapsule(localPoint, shape.capsule);
    case b2ShapeType.b2_circleShape:
      return b2PointInCircle(localPoint, shape.circle);
    case b2ShapeType.b2_polygonShape:
      return b2PointInPolygon(localPoint, shape.polygon);
    default:
      return false;
  }
}
function b2Shape_RayCast(shapeId, origin, translation) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  const transform = b2GetOwnerTransform(world, shape);
  const input = new b2RayCastInput();
  input.maxFraction = 1;
  input.origin = b2InvTransformPoint(transform, origin);
  input.translation = b2InvRotateVector(transform.q, translation);
  let output = new b2CastOutput(rayNormal3, rayPoint3);
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      output = b2RayCastCapsule(input, shape.capsule);
      break;
    case b2ShapeType.b2_circleShape:
      output = b2RayCastCircle(input, shape.circle);
      break;
    case b2ShapeType.b2_segmentShape:
      output = b2RayCastSegment(input, shape.segment, false);
      break;
    case b2ShapeType.b2_polygonShape:
      output = b2RayCastPolygon(input, shape.polygon);
      break;
    case b2ShapeType.b2_chainSegmentShape:
      output = b2RayCastSegment(input, shape.chainSegment.segment, true);
      break;
    default:
      return output;
  }
  if (output.hit) {
    output.normal = b2RotateVector(transform.q, output.normal);
    output.point = b2TransformPoint(transform, output.point);
  }
  return output;
}
function b2Shape_SetDensity(shapeId, density) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world == null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  if (density == shape.density) {
    return;
  }
  shape.density = density;
}
function b2Shape_GetDensity(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.density;
}
function b2Shape_SetFriction(shapeId, friction) {
  const world = b2GetWorld(shapeId.world0);
  if (world.locked) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.friction = friction;
}
function b2Shape_GetFriction(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.friction;
}
function b2Shape_SetRestitution(shapeId, restitution) {
  const world = b2GetWorld(shapeId.world0);
  if (world.locked) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.restitution = restitution;
}
function b2Shape_GetRestitution(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.restitution;
}
function b2Shape_GetFilter(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.filter;
}
function b2ResetProxy(world, shape, wakeBodies, destroyProxy) {
  const body = b2GetBody(world, shape.bodyId);
  const shapeId = shape.id;
  let contactKey = body.headContactKey;
  while (contactKey !== B2_NULL_INDEX) {
    const contactId = contactKey >> 1;
    const edgeIndex = contactKey & 1;
    const contact = world.contactArray[contactId];
    contactKey = contact.edges[edgeIndex].nextKey;
    if (contact.shapeIdA === shapeId || contact.shapeIdB === shapeId) {
      b2DestroyContact(world, contact, wakeBodies);
    }
  }
  const transform = b2GetBodyTransformQuick(world, body);
  if (shape.proxyKey !== B2_NULL_INDEX) {
    const proxyType = B2_PROXY_TYPE(shape.proxyKey);
    b2UpdateShapeAABBs(shape, transform, proxyType);
    if (destroyProxy) {
      b2BroadPhase_DestroyProxy(world.broadPhase, shape.proxyKey);
      const forcePairCreation = true;
      shape.proxyKey = b2BroadPhase_CreateProxy(
        world.broadPhase,
        proxyType,
        shape.fatAABB,
        shape.filter.categoryBits,
        shapeId,
        forcePairCreation
      );
    } else {
      b2BroadPhase_MoveProxy(world.broadPhase, shape.proxyKey, shape.fatAABB);
    }
  } else {
    const proxyType = body.type;
    b2UpdateShapeAABBs(shape, transform, proxyType);
  }
  b2ValidateSolverSets(world);
}
function b2Shape_SetFilter(shapeId, filter) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  if (filter.maskBits === shape.filter.maskBits && filter.categoryBits === shape.filter.categoryBits && filter.groupIndex === shape.filter.groupIndex) {
    return;
  }
  const destroyProxy = filter.categoryBits === shape.filter.categoryBits;
  shape.filter = filter;
  const wakeBodies = true;
  b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}
function b2Shape_EnableSensorEvents(shapeId, flag) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.enableSensorEvents = flag;
}
function b2Shape_AreSensorEventsEnabled(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.enableSensorEvents;
}
function b2Shape_EnableContactEvents(shapeId, flag) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.enableContactEvents = flag;
}
function b2Shape_AreContactEventsEnabled(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.enableContactEvents;
}
function b2Shape_EnablePreSolveEvents(shapeId, flag) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.enablePreSolveEvents = flag;
}
function b2Shape_ArePreSolveEventsEnabled(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.enablePreSolveEvents;
}
function b2Shape_EnableHitEvents(shapeId, flag) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.enableHitEvents = flag;
}
function b2Shape_AreHitEventsEnabled(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.enableHitEvents;
}
function b2Shape_GetType(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.type;
}
function b2Shape_GetCircle(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.circle;
}
function b2Shape_GetSegment(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.segment;
}
function b2Shape_GetChainSegment(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.chainSegment;
}
function b2Shape_GetCapsule(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.capsule;
}
function b2Shape_GetPolygon(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  return shape.polygon;
}
function b2Shape_SetCircle(shapeId, circle) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.circle = circle;
  shape.type = b2ShapeType.b2_circleShape;
  const wakeBodies = true;
  const destroyProxy = true;
  b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}
function b2Shape_SetCapsule(shapeId, capsule) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.capsule = capsule;
  shape.type = b2ShapeType.b2_capsuleShape;
  const wakeBodies = true;
  const destroyProxy = true;
  b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}
function b2Shape_SetSegment(shapeId, segment) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.segment = segment;
  shape.type = b2ShapeType.b2_segmentShape;
  const wakeBodies = true;
  const destroyProxy = true;
  b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}
function b2Shape_SetPolygon(shapeId, polygon) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return;
  }
  const shape = b2GetShape(world, shapeId);
  shape.polygon = polygon;
  shape.type = b2ShapeType.b2_polygonShape;
  const wakeBodies = true;
  const destroyProxy = true;
  b2ResetProxy(world, shape, wakeBodies, destroyProxy);
}
function b2Shape_GetParentChain(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  const shape = b2GetShape(world, shapeId);
  if (shape.type === b2ShapeType.b2_chainSegmentShape) {
    const chainId = shape.chainSegment.chainId;
    if (chainId !== B2_NULL_INDEX) {
      const chain = world.chainArray[chainId];
      return new b2ChainId(chainId + 1, shapeId.world0, chain.revision);
    }
  }
  return new b2ChainId();
}
function b2Chain_SetFriction(chainId, friction) {
  const world = b2GetWorldLocked(chainId.world0);
  if (world === null) {
    return;
  }
  const chainShape = b2GetChainShape(world, chainId);
  const count = chainShape.count;
  for (let i = 0; i < count; ++i) {
    const shapeId = chainShape.shapeIndices[i];
    const shape = world.shapeArray[shapeId];
    shape.friction = friction;
  }
}
function b2Chain_SetRestitution(chainId, restitution) {
  const world = b2GetWorldLocked(chainId.world0);
  if (world === null) {
    return;
  }
  const chainShape = b2GetChainShape(world, chainId);
  const count = chainShape.count;
  for (let i = 0; i < count; ++i) {
    const shapeId = chainShape.shapeIndices[i];
    const shape = world.shapeArray[shapeId];
    shape.restitution = restitution;
  }
}
function b2Shape_GetContactCapacity(shapeId) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return 0;
  }
  const shape = b2GetShape(world, shapeId);
  if (shape.isSensor) {
    return 0;
  }
  const body = b2GetBody(world, shape.bodyId);
  return body.contactCount;
}
function b2Shape_GetContactData(shapeId, contactData, capacity) {
  const world = b2GetWorldLocked(shapeId.world0);
  if (world === null) {
    return 0;
  }
  const shape = b2GetShape(world, shapeId);
  if (shape.isSensor) {
    return 0;
  }
  const body = b2GetBody(world, shape.bodyId);
  let contactKey = body.headContactKey;
  let index = 0;
  while (contactKey !== B2_NULL_INDEX && index < capacity) {
    const contactId = contactKey >> 1;
    const edgeIndex = contactKey & 1;
    const contact = world.contactArray[contactId];
    if ((contact.shapeIdA === shapeId.index1 - 1 || contact.shapeIdB === shapeId.index1 - 1) && (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0) {
      const shapeA = world.shapeArray[contact.shapeIdA];
      const shapeB = world.shapeArray[contact.shapeIdB];
      contactData[index].shapeIdA = new b2ShapeId(shapeA.id + 1, shapeId.world0, shapeA.revision);
      contactData[index].shapeIdB = new b2ShapeId(shapeB.id + 1, shapeId.world0, shapeB.revision);
      const contactSim = b2GetContactSim(world, contact);
      contactData[index].manifold = contactSim.manifold;
      index += 1;
    }
    contactKey = contact.edges[edgeIndex].nextKey;
  }
  return index;
}
function b2Shape_GetAABB(shapeId) {
  const world = b2GetWorld(shapeId.world0);
  if (world === null) {
    return new b2AABB();
  }
  const shape = b2GetShape(world, shapeId);
  return shape.aabb;
}
function b2Shape_GetClosestPoint(shapeId, target) {
  const world = b2GetWorld(shapeId.world0);
  if (world === null) {
    return new b2Vec2(0, 0);
  }
  const shape = b2GetShape(world, shapeId);
  const body = b2GetBody(world, shape.bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const input = new b2DistanceInput();
  input.proxyA = b2MakeShapeDistanceProxy(shape);
  input.proxyB = b2MakeProxy([target], 1, 0);
  input.transformA = transform;
  input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.useRadii = true;
  const cache = new b2DistanceCache();
  const output = b2ShapeDistance(cache, input, null, 0);
  return output.pointA;
}

// src/include/shape_h.js
var b2Shape = class {
  constructor() {
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
    this.imageNoDebug = false;
    this.image = null;
    this.imageScale = null;
    this.imageOffset = null;
    this.imageRect = null;
  }
};
var b2ChainShape = class {
  constructor() {
    this.id = 0;
    this.bodyId = 0;
    this.nextChainId = 0;
    this.shapeIndices = [];
    this.count = 0;
    this.revision = 0;
  }
};
var b2ShapeExtent = class {
  constructor() {
    this.minExtent = 0;
    this.maxExtent = 0;
  }
};

// src/bitset_c.js
var b2_64bits = 8;
function b2CreateBitSet(bitCapacity) {
  const bitSet = new b2BitSet();
  const cap = Math.floor((bitCapacity + b2_64bits * 8 - 1) / (b2_64bits * 8));
  bitSet.blockCapacity = cap;
  bitSet.blockCount = 0;
  bitSet.bits = new BigUint64Array(bitSet.blockCapacity);
  bitSet.bits.fill(0n);
  return bitSet;
}
function b2DestroyBitSet(bitSet) {
  bitSet.blockCapacity = 0;
  bitSet.blockCount = 0;
  bitSet.bits = null;
}
function b2SetBitCountAndClear(bitSet, bitCount) {
  const blockCount = Math.floor((bitCount + b2_64bits * 8 - 1) / (b2_64bits * 8));
  if (bitSet.blockCapacity < blockCount) {
    b2DestroyBitSet(bitSet);
    const newBitCapacity = bitCount + (bitCount >> 1);
    bitSet = b2CreateBitSet(newBitCapacity);
  }
  bitSet.blockCount = blockCount;
  bitSet.bits.fill(0n);
  return bitSet;
}
function b2InPlaceUnion(setA, setB) {
  const blockCount = setA.blockCount;
  for (let i = 0; i < blockCount; ++i) {
    setA.bits[i] |= setB.bits[i];
  }
}

// src/include/bitset_h.js
var b2BitSet = class {
  constructor() {
    this.bits = null;
    this.blockCapacity = 0;
    this.blockCount = 0;
  }
};
function b2SetBit(bitSet, bitIndex) {
  const blockIndex = Math.floor(bitIndex / 64);
  bitSet.bits[blockIndex] |= BigInt(1) << BigInt(bitIndex % 64);
}
function b2ClearBit(bitSet, bitIndex) {
  const blockIndex = Math.floor(bitIndex / 64);
  if (blockIndex >= bitSet.blockCount) {
    return;
  }
  bitSet.bits[blockIndex] &= ~(BigInt(1) << BigInt(bitIndex % 64));
}
function b2GetBit(bitSet, bitIndex) {
  const blockIndex = Math.floor(bitIndex / 64);
  if (blockIndex >= bitSet.blockCount) {
    return false;
  }
  return (bitSet.bits[blockIndex] & BigInt(1) << BigInt(bitIndex % 64)) !== BigInt(0);
}

// src/constraint_graph_c.js
var b2_overflowIndex = b2_graphColorCount - 1;
var b2GraphColor = class {
  constructor() {
    this.bodySet = new b2BitSet();
    this.contacts = new b2ContactArray();
    this.joints = new b2JointArray();
    this.overflowConstraints = null;
  }
};
var b2ConstraintGraph = class {
  constructor() {
    this.colors = [];
    for (let i = 0; i < b2_graphColorCount; i++) {
      this.colors.push(new b2GraphColor());
    }
  }
};
function b2CreateGraph(graph, bodyCapacity) {
  graph = new b2ConstraintGraph();
  bodyCapacity = Math.max(bodyCapacity, 8);
  for (let i = 0; i < b2_overflowIndex; i++) {
    const color = graph.colors[i];
    color.bodySet = b2CreateBitSet(bodyCapacity);
    color.bodySet = b2SetBitCountAndClear(color.bodySet, bodyCapacity);
  }
  return graph;
}
function b2DestroyGraph(graph) {
  for (let i = 0; i < b2_graphColorCount; i++) {
    const color = graph.colors[i];
    b2DestroyBitSet(color.bodySet);
    color.bodySet = null;
    color.contacts = null;
    color.joints = null;
  }
}
function b2AddContactToGraph(world, contactSim, contact) {
  if (contactSim.manifold.pointCount <= 0) {
    throw new Error("Assert failed: contactSim.manifold.pointCount > 0");
  }
  if (!(contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag)) {
    throw new Error("Assert failed: contactSim.simFlags & b2_simTouchingFlag");
  }
  if (!(contact.flags & b2ContactFlags.b2_contactTouchingFlag)) {
    throw new Error("Assert failed: contact.flags & b2_contactTouchingFlag");
  }
  const graph = world.constraintGraph;
  const colorIndex = b2_overflowIndex;
  const bodyIdA = contact.edges[0].bodyId;
  const bodyIdB = contact.edges[1].bodyId;
  b2CheckIndex(world.bodyArray, bodyIdA);
  b2CheckIndex(world.bodyArray, bodyIdB);
  const bodyA = world.bodyArray[bodyIdA];
  const bodyB = world.bodyArray[bodyIdB];
  const staticA = bodyA.setIndex == b2SetType.b2_staticSet;
  const staticB = bodyB.setIndex == b2SetType.b2_staticSet;
  if (staticA && staticB) {
    throw new Error("Assert failed: staticA == false || staticB == false");
  }
  const color = graph.colors[colorIndex];
  contact.colorIndex = colorIndex;
  contact.localIndex = color.contacts.count;
  const newContact = b2AddContact(color.contacts);
  newContact.set(contactSim);
  if (staticA) {
    newContact.bodySimIndexA = B2_NULL_INDEX;
    newContact.invMassA = 0;
    newContact.invIA = 0;
  } else {
    if (bodyA.setIndex !== b2SetType.b2_awakeSet) {
      throw new Error("Assert failed: bodyA.setIndex == b2SetType.b2_awakeSet");
    }
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    const localIndex = bodyA.localIndex;
    if (!(0 <= localIndex && localIndex < awakeSet.sims.count)) {
      throw new Error("Assert failed: 0 <= localIndex && localIndex < awakeSet.sims.count");
    }
    newContact.bodySimIndexA = localIndex;
    const bodySimA = awakeSet.sims.data[localIndex];
    newContact.invMassA = bodySimA.invMass;
    newContact.invIA = bodySimA.invInertia;
  }
  if (staticB) {
    newContact.bodySimIndexB = B2_NULL_INDEX;
    newContact.invMassB = 0;
    newContact.invIB = 0;
  } else {
    if (bodyB.setIndex !== b2SetType.b2_awakeSet) {
      throw new Error("Assert failed: bodyB.setIndex == b2SetType.b2_awakeSet");
    }
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    const localIndex = bodyB.localIndex;
    if (!(0 <= localIndex && localIndex < awakeSet.sims.count)) {
      throw new Error("Assert failed: 0 <= localIndex && localIndex < awakeSet.sims.count");
    }
    newContact.bodySimIndexB = localIndex;
    const bodySimB = awakeSet.sims.data[localIndex];
    newContact.invMassB = bodySimB.invMass;
    newContact.invIB = bodySimB.invInertia;
  }
}
function b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex) {
  const graph = world.constraintGraph;
  if (colorIndex !== b2_overflowIndex) {
    throw new Error("Assert failed: colorIndex == b2_overflowIndex");
  }
  const color = graph.colors[colorIndex];
  if (colorIndex != b2_overflowIndex) {
    b2ClearBit(color.bodySet, bodyIdA);
    b2ClearBit(color.bodySet, bodyIdB);
  }
  const movedIndex = b2RemoveContact(color.contacts, localIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedContactSim = color.contacts.data[localIndex];
    const movedId = movedContactSim.contactId;
    const movedContact = world.contactArray[movedId];
    if (movedContact.setIndex !== b2SetType.b2_awakeSet) {
      throw new Error("Assert failed: movedContact.setIndex == b2SetType.b2_awakeSet");
    }
    if (movedContact.colorIndex !== colorIndex) {
      throw new Error("Assert failed: movedContact.colorIndex == colorIndex");
    }
    if (movedContact.localIndex !== movedIndex) {
      throw new Error("Assert failed: movedContact.localIndex == movedIndex");
    }
    movedContact.localIndex = localIndex;
  }
}
function b2AssignJointColor(graph, bodyIdA, bodyIdB, staticA, staticB) {
  return b2_overflowIndex;
}
function b2CreateJointInGraph(world, joint) {
  const graph = world.constraintGraph;
  const bodyIdA = joint.edges[0].bodyId;
  const bodyIdB = joint.edges[1].bodyId;
  const bodyA = world.bodyArray[bodyIdA];
  const bodyB = world.bodyArray[bodyIdB];
  const staticA = bodyA.setIndex === b2SetType.b2_staticSet;
  const staticB = bodyB.setIndex === b2SetType.b2_staticSet;
  if (staticA && staticB) {
    throw new Error("Assert failed: staticA == false || staticB == false");
  }
  const colorIndex = b2AssignJointColor(graph, bodyIdA, bodyIdB, staticA, staticB);
  const jointSim = b2AddJoint(graph.colors[colorIndex].joints);
  joint.colorIndex = colorIndex;
  joint.localIndex = graph.colors[colorIndex].joints.count - 1;
  return jointSim;
}
function b2AddJointToGraph(world, jointSim, joint) {
  const jointDst = b2CreateJointInGraph(world, joint);
  Object.assign(jointDst, jointSim);
}
function b2RemoveJointFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex) {
  const graph = world.constraintGraph;
  const color = graph.colors[colorIndex];
  if (colorIndex != b2_overflowIndex) {
    b2ClearBit(color.bodySet, bodyIdA);
    b2ClearBit(color.bodySet, bodyIdB);
  }
  const movedIndex = b2RemoveJoint(color.joints, localIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedJointSim = color.joints.data[localIndex];
    const movedId = movedJointSim.jointId;
    if (movedId != world.jointArray[movedId].jointId) {
      throw new Error("Assert failed: movedId != jointId");
    }
    const movedJoint = world.jointArray[movedId];
    if (movedJoint.setIndex !== b2SetType.b2_awakeSet) {
      throw new Error("Assert failed: movedJoint.setIndex == b2SetType.b2_awakeSet");
    }
    if (movedJoint.colorIndex !== colorIndex) {
      throw new Error("Assert failed: movedJoint.colorIndex == colorIndex");
    }
    if (movedJoint.localIndex !== movedIndex) {
      throw new Error("Assert failed: movedJoint.localIndex == movedIndex");
    }
    movedJoint.localIndex = localIndex;
  }
}

// src/contact_solver_c.js
var b2ContactConstraint = class {
  constructor() {
    this.indexA = 0;
    this.indexB = 0;
    this.normalX = 0;
    this.normalY = 0;
    this.friction = 0;
    this.restitution = 0;
    this.pointCount = 0;
    this.softness = new b2Softness();
    this.invMassA = 0;
    this.invIA = 0;
    this.invMassB = 0;
    this.invIB = 0;
    this.points = [];
  }
};
var b2ContactConstraintPoint = class {
  constructor() {
    this.normalImpulse = 0;
    this.tangentImpulse = 0;
    this.maxNormalImpulse = 0;
    this.anchorAX = 0;
    this.anchorAY = 0;
    this.anchorBX = 0;
    this.anchorBY = 0;
    this.baseSeparation = 0;
    this.normalMass = 0;
    this.tangentMass = 0;
    this.relativeVelocity = 0;
  }
};
function b2PrepareOverflowContacts(context) {
  const world = context.world;
  const graph = context.graph;
  const color = graph.colors[b2_overflowIndex];
  const constraints = color.overflowConstraints;
  const contactCount = color.contacts.count;
  const contacts = color.contacts.data;
  const awakeStates = context.states;
  const contactSoftness = context.contactSoftness;
  const staticSoftness = context.staticSoftness;
  const warmStartScale = world.enableWarmStarting ? 1 : 0;
  for (let i = 0; i < contactCount; ++i) {
    const contactSim = contacts[i];
    const manifold = contactSim.manifold;
    const pointCount = manifold.pointCount;
    const indexA = contactSim.bodySimIndexA;
    const indexB = contactSim.bodySimIndexB;
    const constraint = constraints[i];
    constraint.indexA = indexA;
    constraint.indexB = indexB;
    constraint.normalX = manifold.normalX;
    constraint.normalY = manifold.normalY;
    constraint.friction = contactSim.friction;
    constraint.restitution = contactSim.restitution;
    constraint.pointCount = pointCount;
    let vAX = 0;
    let vAY = 0;
    let wA = 0;
    const mA = contactSim.invMassA;
    const iA = contactSim.invIA;
    if (indexA !== B2_NULL_INDEX) {
      const stateA = awakeStates[indexA];
      vAX = stateA.linearVelocity.x;
      vAY = stateA.linearVelocity.y;
      wA = stateA.angularVelocity;
    }
    let vBX = 0;
    let vBY = 0;
    let wB = 0;
    const mB = contactSim.invMassB;
    const iB = contactSim.invIB;
    if (indexB !== B2_NULL_INDEX) {
      const stateB = awakeStates[indexB];
      vBX = stateB.linearVelocity.x;
      vBY = stateB.linearVelocity.y;
      wB = stateB.angularVelocity;
    }
    constraint.softness = indexA === B2_NULL_INDEX || indexB === B2_NULL_INDEX ? staticSoftness : contactSoftness;
    constraint.invMassA = mA;
    constraint.invIA = iA;
    constraint.invMassB = mB;
    constraint.invIB = iB;
    const normalX = constraint.normalX;
    const normalY = constraint.normalY;
    const tangentX = constraint.normalY;
    const tangentY = -constraint.normalX;
    for (let j = 0; j < pointCount; ++j) {
      const mp = manifold.points[j];
      const cp = constraint.points[j] = new b2ContactConstraintPoint();
      cp.normalImpulse = warmStartScale * mp.normalImpulse;
      cp.tangentImpulse = warmStartScale * mp.tangentImpulse;
      cp.maxNormalImpulse = 0;
      const rAX = mp.anchorAX;
      const rAY = mp.anchorAY;
      const rBX = mp.anchorBX;
      const rBY = mp.anchorBY;
      cp.anchorAX = rAX;
      cp.anchorAY = rAY;
      cp.anchorBX = rBX;
      cp.anchorBY = rBY;
      const subX = rBX - rAX;
      const subY = rBY - rAY;
      cp.baseSeparation = mp.separation - (subX * normalX + subY * normalY);
      const rnA = rAX * normalY - rAY * normalX;
      const rnB = rBX * normalY - rBY * normalX;
      const kNormal = mA + mB + iA * rnA * rnA + iB * rnB * rnB;
      cp.normalMass = kNormal > 0 ? 1 / kNormal : 0;
      const rtA = rAX * tangentY - rAY * tangentX;
      const rtB = rBX * tangentY - rBY * tangentX;
      const kTangent = mA + mB + iA * rtA * rtA + iB * rtB * rtB;
      cp.tangentMass = kTangent > 0 ? 1 / kTangent : 0;
      const vrAX = vAX + -wA * rAY;
      const vrAY = vAY + wA * rAX;
      const vrBX = vBX + -wB * rBY;
      const vrBY = vBY + wB * rBX;
      cp.relativeVelocity = normalX * (vrBX - vrAX) + normalY * (vrBY - vrAY);
    }
  }
}
function b2WarmStartOverflowContacts(context) {
  const graph = context.graph;
  const color = graph.colors[b2_overflowIndex];
  const constraints = color.overflowConstraints;
  const contactCount = color.contacts.count;
  const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
  const states = awakeSet.states.data;
  const dummyState = new b2BodyState();
  for (let i = 0; i < contactCount; ++i) {
    const constraint = constraints[i];
    const indexA = constraint.indexA;
    const indexB = constraint.indexB;
    const stateA = indexA === B2_NULL_INDEX ? dummyState : states[indexA];
    const stateB = indexB === B2_NULL_INDEX ? dummyState : states[indexB];
    const vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    const vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;
    const mA = constraint.invMassA;
    const iA = constraint.invIA;
    const mB = constraint.invMassB;
    const iB = constraint.invIB;
    const normalX = constraint.normalX;
    const normalY = constraint.normalY;
    const tangentx = constraint.normalY;
    const tangenty = -constraint.normalX;
    const pointCount = constraint.pointCount;
    for (let j = 0; j < pointCount; ++j) {
      const cp = constraint.points[j];
      const rAX = cp.anchorAX;
      const rAY = cp.anchorAY;
      const rBX = cp.anchorBX;
      const rBY = cp.anchorBY;
      const Px = cp.normalImpulse * normalX + cp.tangentImpulse * tangentx;
      const Py = cp.normalImpulse * normalY + cp.tangentImpulse * tangenty;
      wA -= iA * (rAX * Py - rAY * Px);
      vA.x -= mA * Px;
      vA.y -= mA * Py;
      wB += iB * (rBX * Py - rBY * Px);
      vB.x += mB * Px;
      vB.y += mB * Py;
    }
    stateA.linearVelocity = vA;
    stateA.angularVelocity = wA;
    stateB.linearVelocity = vB;
    stateB.angularVelocity = wB;
  }
}
function b2SolveOverflowContacts(context, useBias) {
  const graph = context.graph;
  const color = graph.colors[b2_overflowIndex];
  const constraints = color.overflowConstraints;
  const contactCount = color.contacts.count;
  const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
  const states = awakeSet.states;
  const inv_h = context.inv_h;
  const pushout = context.world.contactPushoutVelocity;
  const dummyState = new b2BodyState();
  for (let i = 0; i < contactCount; ++i) {
    const constraint = constraints[i];
    const mA = constraint.invMassA;
    const iA = constraint.invIA;
    const mB = constraint.invMassB;
    const iB = constraint.invIB;
    const stateA = constraint.indexA === B2_NULL_INDEX ? dummyState : states.data[constraint.indexA];
    let vAX = stateA.linearVelocity.x;
    let vAY = stateA.linearVelocity.y;
    let wA = stateA.angularVelocity;
    const dqA = stateA.deltaRotation;
    const stateB = constraint.indexB === B2_NULL_INDEX ? dummyState : states.data[constraint.indexB];
    let vBX = stateB.linearVelocity.x;
    let vBY = stateB.linearVelocity.y;
    let wB = stateB.angularVelocity;
    const dqB = stateB.deltaRotation;
    const dpx = stateB.deltaPosition.x - stateA.deltaPosition.x;
    const dpy = stateB.deltaPosition.y - stateA.deltaPosition.y;
    const normalX = constraint.normalX;
    const normalY = constraint.normalY;
    const tangentx = normalY;
    const tangenty = -normalX;
    const friction = constraint.friction;
    const softness = constraint.softness;
    const pointCount = constraint.pointCount;
    for (let j = 0; j < pointCount; ++j) {
      const cp = constraint.points[j];
      const rx = dqB.c * cp.anchorBX - dqB.s * cp.anchorBY - (dqA.c * cp.anchorAX - dqA.s * cp.anchorAY);
      const ry = dqB.s * cp.anchorBX + dqB.c * cp.anchorBY - (dqA.s * cp.anchorAX + dqA.c * cp.anchorAY);
      const s = (dpx + rx) * normalX + (dpy + ry) * normalY + cp.baseSeparation;
      let velocityBias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (s > 0) {
        velocityBias = s * inv_h;
      } else if (useBias) {
        velocityBias = Math.max(softness.biasRate * s, -pushout);
        massScale = softness.massScale;
        impulseScale = softness.impulseScale;
      }
      const rAX = cp.anchorAX;
      const rAY = cp.anchorAY;
      const rBX = cp.anchorBX;
      const rBY = cp.anchorBY;
      const vn = (vBX - vAX + wB * -rBY - wA * -rAY) * normalX + (vBY - vAY + wB * rBX - wA * rAX) * normalY;
      let impulse = -cp.normalMass * massScale * (vn + velocityBias) - impulseScale * cp.normalImpulse;
      const newImpulse = Math.max(cp.normalImpulse + impulse, 0);
      impulse = newImpulse - cp.normalImpulse;
      cp.normalImpulse = newImpulse;
      cp.maxNormalImpulse = Math.max(cp.maxNormalImpulse, impulse);
      const Px = impulse * normalX;
      const Py = impulse * normalY;
      vAX -= mA * Px;
      vAY -= mA * Py;
      wA -= iA * (rAX * Py - rAY * Px);
      vBX += mB * Px;
      vBY += mB * Py;
      wB += iB * (rBX * Py - rBY * Px);
    }
    for (let j = 0; j < pointCount; ++j) {
      const cp = constraint.points[j];
      const rAX = cp.anchorAX;
      const rAY = cp.anchorAY;
      const rBX = cp.anchorBX;
      const rBY = cp.anchorBY;
      const vtx = vBX - wB * rBY - (vAX - wA * rAY);
      const vty = vBY + wB * rBX - (vAY + wA * rAX);
      const vt = vtx * tangentx + vty * tangenty;
      let impulse = cp.tangentMass * -vt;
      const maxFriction = friction * cp.normalImpulse;
      const oldTangentImpulse = cp.tangentImpulse;
      cp.tangentImpulse = oldTangentImpulse + impulse;
      cp.tangentImpulse = cp.tangentImpulse < -maxFriction ? -maxFriction : cp.tangentImpulse > maxFriction ? maxFriction : cp.tangentImpulse;
      impulse = cp.tangentImpulse - oldTangentImpulse;
      const Px = impulse * tangentx;
      const Py = impulse * tangenty;
      vAX -= mA * Px;
      vAY -= mA * Py;
      wA -= iA * (rAX * Py - rAY * Px);
      vBX += mB * Px;
      vBY += mB * Py;
      wB += iB * (rBX * Py - rBY * Px);
    }
    stateA.linearVelocity.x = vAX;
    stateA.linearVelocity.y = vAY;
    stateA.angularVelocity = wA;
    stateB.linearVelocity.x = vBX;
    stateB.linearVelocity.y = vBY;
    stateB.angularVelocity = wB;
  }
}
function b2ApplyOverflowRestitution(context) {
  const graph = context.graph;
  const color = graph.colors[b2_overflowIndex];
  const constraints = color.overflowConstraints;
  const contactCount = color.contacts.count;
  const awakeSet = context.world.solverSetArray[b2SetType.b2_awakeSet];
  const states = awakeSet.states;
  const threshold = context.world.restitutionThreshold;
  const dummyState = new b2BodyState();
  for (let i = 0; i < contactCount; ++i) {
    const constraint = constraints[i];
    const restitution = constraint.restitution;
    if (restitution === 0) {
      continue;
    }
    const mA = constraint.invMassA;
    const iA = constraint.invIA;
    const mB = constraint.invMassB;
    const iB = constraint.invIB;
    const stateA = constraint.indexA === B2_NULL_INDEX ? dummyState : states.data[constraint.indexA];
    const vA = stateA.linearVelocity;
    let wA = stateA.angularVelocity;
    const stateB = constraint.indexB === B2_NULL_INDEX ? dummyState : states.data[constraint.indexB];
    const vB = stateB.linearVelocity;
    let wB = stateB.angularVelocity;
    const normalX = constraint.normalX;
    const normalY = constraint.normalY;
    const pointCount = constraint.pointCount;
    for (let j = 0; j < pointCount; ++j) {
      const cp = constraint.points[j];
      if (cp.relativeVelocity > -threshold || cp.maxNormalImpulse === 0) {
        continue;
      }
      const rAX = cp.anchorAX;
      const rAY = cp.anchorAY;
      const rBX = cp.anchorBX;
      const rBY = cp.anchorBY;
      const vrBX = vB.x + -wB * rBY;
      const vrBY = vB.y + wB * rBX;
      const vrAX = vA.x + -wA * rAY;
      const vrAY = vA.y + wA * rAX;
      const subX = vrBX - vrAX;
      const subY = vrBY - vrAY;
      const vn = subX * normalX + subY * normalY;
      let impulse = -cp.normalMass * (vn + restitution * cp.relativeVelocity);
      const newImpulse = Math.max(cp.normalImpulse + impulse, 0);
      impulse = newImpulse - cp.normalImpulse;
      cp.normalImpulse = newImpulse;
      cp.maxNormalImpulse = Math.max(cp.maxNormalImpulse, impulse);
      const PX = impulse * normalX;
      const PY = impulse * normalY;
      vA.x -= mA * PX;
      vA.y -= mA * PY;
      wA -= iA * (rAX * PY - rAY * PX);
      vB.x += mB * PX;
      vB.y += mB * PY;
      wB += iB * (rBX * PY - rBY * PX);
    }
    stateA.angularVelocity = wA;
    stateB.angularVelocity = wB;
  }
}
function b2StoreOverflowImpulses(context) {
  const graph = context.graph;
  const color = graph.colors[b2_overflowIndex];
  const constraints = color.overflowConstraints;
  const contacts = color.contacts;
  const contactCount = color.contacts.count;
  for (let i = 0; i < contactCount; ++i) {
    const constraint = constraints[i];
    const contact = contacts.data[i];
    const manifold = contact.manifold;
    const pointCount = manifold.pointCount;
    for (let j = 0; j < pointCount; ++j) {
      manifold.points[j].normalImpulse = constraint.points[j].normalImpulse;
      manifold.points[j].tangentImpulse = constraint.points[j].tangentImpulse;
      manifold.points[j].maxNormalImpulse = constraint.points[j].maxNormalImpulse;
      manifold.points[j].normalVelocity = constraint.points[j].relativeVelocity;
    }
  }
}

// src/aabb_c.js
function b2Perimeter(a) {
  const wx = a.upperBoundX - a.lowerBoundX;
  const wy = a.upperBoundY - a.lowerBoundY;
  return 2 * (wx + wy);
}
function b2EnlargeAABB(a, b) {
  let changed = false;
  if (b.lowerBoundX < a.lowerBoundX) {
    a.lowerBoundX = b.lowerBoundX;
    changed = true;
  }
  if (b.lowerBoundY < a.lowerBoundY) {
    a.lowerBoundY = b.lowerBoundY;
    changed = true;
  }
  if (a.upperBoundX < b.upperBoundX) {
    a.upperBoundX = b.upperBoundX;
    changed = true;
  }
  if (a.upperBoundY < b.upperBoundY) {
    a.upperBoundY = b.upperBoundY;
    changed = true;
  }
  return changed;
}
function b2AABB_Overlaps(a, b) {
  return !(a.lowerBoundX >= b.upperBoundX || a.upperBoundX <= b.lowerBoundX || a.lowerBoundY >= b.upperBoundY || a.upperBoundY <= b.lowerBoundY);
}

// src/dynamic_tree_c.js
var B2_TREE_STACK_SIZE = 1024;
function b2IsLeaf(node) {
  return node.height === 0;
}
function b2DynamicTree_Create() {
  const tree = new b2DynamicTree();
  tree.root = B2_NULL_INDEX;
  tree.nodeCapacity = 16;
  tree.nodeCount = 0;
  tree.nodes = Array.from({ length: tree.nodeCapacity }, () => new b2TreeNode());
  for (let i = 0; i < tree.nodeCapacity - 1; ++i) {
    tree.nodes[i].parent_next = i + 1;
    tree.nodes[i].height = -1;
  }
  tree.nodes[tree.nodeCapacity - 1].parent_next = B2_NULL_INDEX;
  tree.nodes[tree.nodeCapacity - 1].height = -1;
  tree.freeList = 0;
  tree.proxyCount = 0;
  tree.leafIndices = null;
  tree.leafCenters = null;
  tree.rebuildCapacity = 0;
  return tree;
}
function b2DynamicTree_Destroy(tree) {
  tree.nodes = null;
  tree.leafIndices = null;
  tree.leafCenters = null;
}
function b2AllocateNode(tree) {
  if (tree.freeList === B2_NULL_INDEX) {
    const oldNodes = tree.nodes;
    tree.nodeCapacity += tree.nodeCapacity >> 1;
    tree.nodes = Array.from({ length: tree.nodeCapacity }, () => new b2TreeNode());
    tree.nodes = Array.from({ length: tree.nodeCapacity }, (_, i) => {
      if (i < oldNodes.length) {
        return oldNodes[i];
      } else {
        return new b2TreeNode();
      }
    });
    for (let i = tree.nodeCount; i < tree.nodeCapacity - 1; ++i) {
      tree.nodes[i].parent_next = i + 1;
      tree.nodes[i].height = -1;
    }
    tree.nodes[tree.nodeCapacity - 1].parent_next = B2_NULL_INDEX;
    tree.nodes[tree.nodeCapacity - 1].height = -1;
    tree.freeList = tree.nodeCount;
  }
  const nodeIndex = tree.freeList;
  const node = tree.nodes[nodeIndex];
  tree.freeList = node.parent_next;
  tree.nodes[nodeIndex] = new b2TreeNode();
  ++tree.nodeCount;
  return nodeIndex;
}
function b2FreeNode(tree, nodeId) {
  tree.nodes[nodeId].parent_next = tree.freeList;
  tree.nodes[nodeId].height = -1;
  tree.freeList = nodeId;
  --tree.nodeCount;
}
function b2FindBestSibling(tree, boxD) {
  const centerD = b2AABB_Center(boxD);
  const areaD = b2Perimeter(boxD);
  const nodes = tree.nodes;
  const rootIndex = tree.root;
  const rootBox = nodes[rootIndex].aabb;
  let areaBase = b2Perimeter(rootBox);
  let directCost = b2Perimeter(b2AABB_Union(rootBox, boxD));
  let inheritedCost = 0;
  let bestSibling = rootIndex;
  let bestCost = directCost;
  let index = rootIndex;
  while (nodes[index].height > 0) {
    const child1 = nodes[index].child1;
    const child2 = nodes[index].child2;
    const cost = directCost + inheritedCost;
    if (cost < bestCost) {
      bestSibling = index;
      bestCost = cost;
    }
    inheritedCost += directCost - areaBase;
    const leaf1 = nodes[child1].height === 0;
    const leaf2 = nodes[child2].height === 0;
    let lowerCost1 = Number.MAX_VALUE;
    const box1 = nodes[child1].aabb;
    const directCost1 = b2Perimeter(b2AABB_Union(box1, boxD));
    let area1 = 0;
    if (leaf1) {
      const cost1 = directCost1 + inheritedCost;
      if (cost1 < bestCost) {
        bestSibling = child1;
        bestCost = cost1;
      }
    } else {
      area1 = b2Perimeter(box1);
      lowerCost1 = inheritedCost + directCost1 + Math.min(areaD - area1, 0);
    }
    let lowerCost2 = Number.MAX_VALUE;
    const box2 = nodes[child2].aabb;
    const directCost2 = b2Perimeter(b2AABB_Union(box2, boxD));
    let area2 = 0;
    if (leaf2) {
      const cost2 = directCost2 + inheritedCost;
      if (cost2 < bestCost) {
        bestSibling = child2;
        bestCost = cost2;
      }
    } else {
      area2 = b2Perimeter(box2);
      lowerCost2 = inheritedCost + directCost2 + Math.min(areaD - area2, 0);
    }
    if (leaf1 && leaf2) {
      break;
    }
    if (bestCost <= lowerCost1 && bestCost <= lowerCost2) {
      break;
    }
    if (lowerCost1 === lowerCost2 && !leaf1) {
      const d1 = b2Sub(b2AABB_Center(box1), centerD);
      const d2 = b2Sub(b2AABB_Center(box2), centerD);
      lowerCost1 = b2LengthSquared(d1);
      lowerCost2 = b2LengthSquared(d2);
    }
    if (lowerCost1 < lowerCost2 && !leaf1) {
      index = child1;
      areaBase = area1;
      directCost = directCost1;
    } else {
      index = child2;
      areaBase = area2;
      directCost = directCost2;
    }
  }
  return bestSibling;
}
var b2RotateType = {
  b2_rotateNone: 0,
  b2_rotateBF: 1,
  b2_rotateBG: 2,
  b2_rotateCD: 3,
  b2_rotateCE: 4
};
function b2RotateNodes(tree, iA) {
  const nodes = tree.nodes;
  const A = nodes[iA];
  if (A.height < 2) {
    return;
  }
  const iB = A.child1;
  const iC = A.child2;
  const B = nodes[iB];
  const C = nodes[iC];
  if (B.height === 0) {
    const iF = C.child1;
    const iG = C.child2;
    const F = nodes[iF];
    const G = nodes[iG];
    const costBase = b2Perimeter(C.aabb);
    const aabbBG = b2AABB_Union(B.aabb, G.aabb);
    const costBF = b2Perimeter(aabbBG);
    const aabbBF = b2AABB_Union(B.aabb, F.aabb);
    const costBG = b2Perimeter(aabbBF);
    if (costBase < costBF && costBase < costBG) {
      return;
    }
    if (costBF < costBG) {
      A.child1 = iF;
      C.child1 = iB;
      B.parent_next = iC;
      F.parent_next = iA;
      C.aabb = aabbBG;
      C.height = 1 + Math.max(B.height, G.height);
      A.height = 1 + Math.max(C.height, F.height);
      C.categoryBits = B.categoryBits | G.categoryBits;
      A.categoryBits = C.categoryBits | F.categoryBits;
      C.enlarged = B.enlarged || G.enlarged;
      A.enlarged = C.enlarged || F.enlarged;
    } else {
      A.child1 = iG;
      C.child2 = iB;
      B.parent_next = iC;
      G.parent_next = iA;
      C.aabb = aabbBF;
      C.height = 1 + Math.max(B.height, F.height);
      A.height = 1 + Math.max(C.height, G.height);
      C.categoryBits = B.categoryBits | F.categoryBits;
      A.categoryBits = C.categoryBits | G.categoryBits;
      C.enlarged = B.enlarged || F.enlarged;
      A.enlarged = C.enlarged || G.enlarged;
    }
  } else if (C.height === 0) {
    const iD = B.child1;
    const iE = B.child2;
    const D = nodes[iD];
    const E = nodes[iE];
    const costBase = b2Perimeter(B.aabb);
    const aabbCE = b2AABB_Union(C.aabb, E.aabb);
    const costCD = b2Perimeter(aabbCE);
    const aabbCD = b2AABB_Union(C.aabb, D.aabb);
    const costCE = b2Perimeter(aabbCD);
    if (costBase < costCD && costBase < costCE) {
      return;
    }
    if (costCD < costCE) {
      A.child2 = iD;
      B.child1 = iC;
      C.parent_next = iB;
      D.parent_next = iA;
      B.aabb = aabbCE;
      B.height = 1 + Math.max(C.height, E.height);
      A.height = 1 + Math.max(B.height, D.height);
      B.categoryBits = C.categoryBits | E.categoryBits;
      A.categoryBits = B.categoryBits | D.categoryBits;
      B.enlarged = C.enlarged || E.enlarged;
      A.enlarged = B.enlarged || D.enlarged;
    } else {
      A.child2 = iE;
      B.child2 = iC;
      C.parent_next = iB;
      E.parent_next = iA;
      B.aabb = aabbCD;
      B.height = 1 + Math.max(C.height, D.height);
      A.height = 1 + Math.max(B.height, E.height);
      B.categoryBits = C.categoryBits | D.categoryBits;
      A.categoryBits = B.categoryBits | E.categoryBits;
      B.enlarged = C.enlarged || D.enlarged;
      A.enlarged = B.enlarged || E.enlarged;
    }
  } else {
    const iD = B.child1;
    const iE = B.child2;
    const iF = C.child1;
    const iG = C.child2;
    const D = nodes[iD];
    const E = nodes[iE];
    const F = nodes[iF];
    const G = nodes[iG];
    const areaB = b2Perimeter(B.aabb);
    const areaC = b2Perimeter(C.aabb);
    const costBase = areaB + areaC;
    let bestRotation = b2RotateType.b2_rotateNone;
    let bestCost = costBase;
    const aabbBG = b2AABB_Union(B.aabb, G.aabb);
    const costBF = areaB + b2Perimeter(aabbBG);
    if (costBF < bestCost) {
      bestRotation = b2RotateType.b2_rotateBF;
      bestCost = costBF;
    }
    const aabbBF = b2AABB_Union(B.aabb, F.aabb);
    const costBG = areaB + b2Perimeter(aabbBF);
    if (costBG < bestCost) {
      bestRotation = b2RotateType.b2_rotateBG;
      bestCost = costBG;
    }
    const aabbCE = b2AABB_Union(C.aabb, E.aabb);
    const costCD = areaC + b2Perimeter(aabbCE);
    if (costCD < bestCost) {
      bestRotation = b2RotateType.b2_rotateCD;
      bestCost = costCD;
    }
    const aabbCD = b2AABB_Union(C.aabb, D.aabb);
    const costCE = areaC + b2Perimeter(aabbCD);
    if (costCE < bestCost) {
      bestRotation = b2RotateType.b2_rotateCE;
    }
    switch (bestRotation) {
      case b2RotateType.b2_rotateNone:
        break;
      case b2RotateType.b2_rotateBF:
        A.child1 = iF;
        C.child1 = iB;
        B.parent_next = iC;
        F.parent_next = iA;
        C.aabb = aabbBG;
        C.height = 1 + Math.max(B.height, G.height);
        A.height = 1 + Math.max(C.height, F.height);
        C.categoryBits = B.categoryBits | G.categoryBits;
        A.categoryBits = C.categoryBits | F.categoryBits;
        C.enlarged = B.enlarged || G.enlarged;
        A.enlarged = C.enlarged || F.enlarged;
        break;
      case b2RotateType.b2_rotateBG:
        A.child1 = iG;
        C.child2 = iB;
        B.parent_next = iC;
        G.parent_next = iA;
        C.aabb = aabbBF;
        C.height = 1 + Math.max(B.height, F.height);
        A.height = 1 + Math.max(C.height, G.height);
        C.categoryBits = B.categoryBits | F.categoryBits;
        A.categoryBits = C.categoryBits | G.categoryBits;
        C.enlarged = B.enlarged || F.enlarged;
        A.enlarged = C.enlarged || G.enlarged;
        break;
      case b2RotateType.b2_rotateCD:
        A.child2 = iD;
        B.child1 = iC;
        C.parent_next = iB;
        D.parent_next = iA;
        B.aabb = aabbCE;
        B.height = 1 + Math.max(C.height, E.height);
        A.height = 1 + Math.max(B.height, D.height);
        B.categoryBits = C.categoryBits | E.categoryBits;
        A.categoryBits = B.categoryBits | D.categoryBits;
        B.enlarged = C.enlarged || E.enlarged;
        A.enlarged = B.enlarged || D.enlarged;
        break;
      case b2RotateType.b2_rotateCE:
        A.child2 = iE;
        B.child2 = iC;
        C.parent_next = iB;
        E.parent_next = iA;
        B.aabb = aabbCD;
        B.height = 1 + Math.max(C.height, D.height);
        A.height = 1 + Math.max(B.height, E.height);
        B.categoryBits = C.categoryBits | D.categoryBits;
        A.categoryBits = B.categoryBits | E.categoryBits;
        B.enlarged = C.enlarged || D.enlarged;
        A.enlarged = B.enlarged || E.enlarged;
        break;
      default:
        break;
    }
  }
}
function b2InsertLeaf(tree, leaf, shouldRotate) {
  if (tree.root === B2_NULL_INDEX) {
    tree.root = leaf;
    tree.nodes[tree.root].parent_next = B2_NULL_INDEX;
    return;
  }
  const leafAABB = tree.nodes[leaf].aabb;
  const sibling = b2FindBestSibling(tree, leafAABB);
  const oldParent = tree.nodes[sibling].parent_next;
  const newParent = b2AllocateNode(tree);
  const nodes = tree.nodes;
  nodes[newParent].parent_next = oldParent;
  nodes[newParent].userData = -1;
  nodes[newParent].aabb = b2AABB_Union(leafAABB, nodes[sibling].aabb);
  nodes[newParent].categoryBits = nodes[leaf].categoryBits | nodes[sibling].categoryBits;
  nodes[newParent].height = nodes[sibling].height + 1;
  if (oldParent !== B2_NULL_INDEX) {
    if (nodes[oldParent].child1 === sibling) {
      nodes[oldParent].child1 = newParent;
    } else {
      nodes[oldParent].child2 = newParent;
    }
    nodes[newParent].child1 = sibling;
    nodes[newParent].child2 = leaf;
    nodes[sibling].parent_next = newParent;
    nodes[leaf].parent_next = newParent;
  } else {
    nodes[newParent].child1 = sibling;
    nodes[newParent].child2 = leaf;
    nodes[sibling].parent_next = newParent;
    nodes[leaf].parent_next = newParent;
    tree.root = newParent;
  }
  let index = nodes[leaf].parent_next;
  while (index !== B2_NULL_INDEX) {
    const child1 = nodes[index].child1;
    const child2 = nodes[index].child2;
    nodes[index].aabb = b2AABB_Union(nodes[child1].aabb, nodes[child2].aabb);
    nodes[index].categoryBits = nodes[child1].categoryBits | nodes[child2].categoryBits;
    nodes[index].height = 1 + Math.max(nodes[child1].height, nodes[child2].height);
    nodes[index].enlarged = nodes[child1].enlarged || nodes[child2].enlarged;
    if (shouldRotate) {
      b2RotateNodes(tree, index);
    }
    index = nodes[index].parent_next;
  }
}
function b2RemoveLeaf(tree, leaf) {
  if (leaf === tree.root) {
    tree.root = B2_NULL_INDEX;
    return;
  }
  const nodes = tree.nodes;
  const parent = nodes[leaf].parent_next;
  const grandParent = nodes[parent].parent_next;
  let sibling;
  if (nodes[parent].child1 === leaf) {
    sibling = nodes[parent].child2;
  } else {
    sibling = nodes[parent].child1;
  }
  if (grandParent !== B2_NULL_INDEX) {
    if (nodes[grandParent].child1 === parent) {
      nodes[grandParent].child1 = sibling;
    } else {
      nodes[grandParent].child2 = sibling;
    }
    nodes[sibling].parent_next = grandParent;
    b2FreeNode(tree, parent);
    let index = grandParent;
    while (index !== B2_NULL_INDEX) {
      const node = nodes[index];
      const child1 = nodes[node.child1];
      const child2 = nodes[node.child2];
      node.aabb = b2AABB_Union(child1.aabb, child2.aabb);
      node.categoryBits = child1.categoryBits | child2.categoryBits;
      node.height = 1 + Math.max(child1.height, child2.height);
      index = node.parent_next;
    }
  } else {
    tree.root = sibling;
    tree.nodes[sibling].parent_next = B2_NULL_INDEX;
    b2FreeNode(tree, parent);
  }
}
function b2DynamicTree_CreateProxy(tree, aabb, categoryBits, userData) {
  const proxyId = b2AllocateNode(tree);
  const node = tree.nodes[proxyId];
  node.aabb = aabb;
  node.userData = userData;
  node.categoryBits = categoryBits;
  node.height = 0;
  const shouldRotate = true;
  b2InsertLeaf(tree, proxyId, shouldRotate);
  tree.proxyCount += 1;
  return proxyId;
}
function b2DynamicTree_DestroyProxy(tree, proxyId) {
  b2RemoveLeaf(tree, proxyId);
  b2FreeNode(tree, proxyId);
  tree.proxyCount -= 1;
}
function b2DynamicTree_GetProxyCount(tree) {
  return tree.proxyCount;
}
function b2DynamicTree_MoveProxy(tree, proxyId, aabb) {
  b2RemoveLeaf(tree, proxyId);
  tree.nodes[proxyId].aabb = aabb;
  const shouldRotate = false;
  b2InsertLeaf(tree, proxyId, shouldRotate);
}
function b2DynamicTree_EnlargeProxy(tree, proxyId, aabb) {
  const nodes = tree.nodes;
  nodes[proxyId].aabb = aabb;
  let parentIndex = nodes[proxyId].parent_next;
  while (parentIndex !== B2_NULL_INDEX) {
    const changed = b2EnlargeAABB(nodes[parentIndex].aabb, aabb);
    nodes[parentIndex].enlarged = true;
    parentIndex = nodes[parentIndex].parent_next;
    if (!changed) {
      break;
    }
  }
  while (parentIndex !== B2_NULL_INDEX) {
    if (nodes[parentIndex].enlarged === true) {
      break;
    }
    nodes[parentIndex].enlarged = true;
    parentIndex = nodes[parentIndex].parent_next;
  }
}
function b2DynamicTree_GetHeight(tree) {
  if (tree.root === B2_NULL_INDEX) {
    return 0;
  }
  return tree.nodes[tree.root].height;
}
function b2DynamicTree_GetAreaRatio(tree) {
  if (tree.root === B2_NULL_INDEX) {
    return 0;
  }
  const root = tree.nodes[tree.root];
  const rootArea = b2Perimeter(root.aabb);
  let totalArea = 0;
  for (let i = 0; i < tree.nodeCapacity; ++i) {
    const node = tree.nodes[i];
    if (node.height < 0 || b2IsLeaf(node) || i === tree.root) {
      continue;
    }
    totalArea += b2Perimeter(node.aabb);
  }
  return totalArea / rootArea;
}
function b2DynamicTree_Validate(tree) {
}
function b2DynamicTree_GetMaxBalance(tree) {
  let maxBalance = 0;
  for (let i = 0; i < tree.nodeCapacity; ++i) {
    const node = tree.nodes[i];
    if (node.height <= 1) {
      continue;
    }
    const child1 = node.child1;
    const child2 = node.child2;
    const balance = Math.abs(tree.nodes[child2].height - tree.nodes[child1].height);
    maxBalance = Math.max(maxBalance, balance);
  }
  return maxBalance;
}
function b2DynamicTree_RebuildBottomUp(tree) {
  const nodes = new Array(tree.nodeCount);
  let count = 0;
  for (let i = 0; i < tree.nodeCapacity; ++i) {
    if (tree.nodes[i].height < 0) {
      continue;
    }
    if (b2IsLeaf(tree.nodes[i])) {
      tree.nodes[i].parent_next = B2_NULL_INDEX;
      nodes[count] = i;
      ++count;
    } else {
      b2FreeNode(tree, i);
    }
  }
  while (count > 1) {
    let minCost = Number.MAX_VALUE;
    let iMin = -1, jMin = -1;
    for (let i = 0; i < count; ++i) {
      const aabbi = tree.nodes[nodes[i]].aabb;
      for (let j = i + 1; j < count; ++j) {
        const aabbj = tree.nodes[nodes[j]].aabb;
        const b = b2AABB_Union(aabbi, aabbj);
        const cost = b2Perimeter(b);
        if (cost < minCost) {
          iMin = i;
          jMin = j;
          minCost = cost;
        }
      }
    }
    const index_i = nodes[iMin];
    const index_j = nodes[jMin];
    const child1 = tree.nodes[index_i];
    const child2 = tree.nodes[index_j];
    const parentIndex = b2AllocateNode(tree);
    const parent = tree.nodes[parentIndex];
    parent.child1 = index_i;
    parent.child2 = index_j;
    parent.aabb = b2AABB_Union(child1.aabb, child2.aabb);
    parent.categoryBits = child1.categoryBits | child2.categoryBits;
    parent.height = 1 + Math.max(child1.height, child2.height);
    parent.parent_next = B2_NULL_INDEX;
    child1.parent_next = parentIndex;
    child2.parent_next = parentIndex;
    nodes[jMin] = nodes[count - 1];
    nodes[iMin] = parentIndex;
    --count;
  }
  tree.root = nodes[0];
  b2DynamicTree_Validate(tree);
}
function b2DynamicTree_ShiftOrigin(tree, newOrigin) {
  for (let i = 0; i < tree.nodeCapacity; ++i) {
    const n = tree.nodes[i];
    n.aabb.lowerBoundX -= newOrigin.x;
    n.aabb.lowerBoundY -= newOrigin.y;
    n.aabb.upperBoundX -= newOrigin.x;
    n.aabb.upperBoundY -= newOrigin.y;
  }
}
function b2DynamicTree_GetByteCount(tree) {
  const size = Object.keys(tree).length * 8 + // Rough estimate for object properties
  tree.nodeCapacity * Object.keys(tree.nodes[0]).length * 8 + // Estimate for nodes
  tree.rebuildCapacity * (4 + 16 + 8 + 4);
  return size;
}
function b2DynamicTree_Query(tree, aabb, maskBits, callback, context) {
  if (tree.root == B2_NULL_INDEX) {
    return;
  }
  const stack2 = [];
  stack2.push(tree.root);
  while (stack2.length > 0) {
    const nodeId = stack2.pop();
    if (nodeId == B2_NULL_INDEX) {
      continue;
    }
    const node = tree.nodes[nodeId];
    if ((node.categoryBits & maskBits) !== 0 && b2AABB_Overlaps(node.aabb, aabb)) {
      if (node.height == 0) {
        const proceed = callback(nodeId, node.userData, context);
        if (proceed === false) {
          return;
        }
      } else {
        stack2.push(node.child1);
        stack2.push(node.child2);
      }
    }
  }
}
var stack = Array(64);
function b2DynamicTree_QueryAll(tree, aabb, context) {
  if (tree.root == B2_NULL_INDEX) {
    return;
  }
  const lx = aabb.lowerBoundX, ux = aabb.upperBoundX;
  const ly = aabb.lowerBoundY, uy = aabb.upperBoundY;
  const nodes = tree.nodes;
  let stackCount = 0;
  stack[stackCount++] = tree.root;
  let nodeId, node, a;
  while (stackCount > 0) {
    nodeId = stack[--stackCount];
    node = nodes[nodeId];
    if (node.height == 0) {
      a = node.aabb;
      if (a.lowerBoundX < ux && a.upperBoundX > lx && a.lowerBoundY < uy && a.upperBoundY > ly) {
        b2PairQueryCallback(nodeId, node.userData, context);
      }
    } else {
      a = node.aabb;
      if (a.lowerBoundX < ux && a.upperBoundX > lx && a.lowerBoundY < uy && a.upperBoundY > ly) {
        stack[stackCount++] = node.child1;
        stack[stackCount++] = node.child2;
      }
    }
  }
}
function b2DynamicTree_RayCast(tree, input, maskBits, callback, context) {
  const p14 = input.origin;
  const d = input.translation;
  const r = b2Normalize(d);
  const v = b2CrossSV(1, r);
  const abs_v = b2Abs(v);
  let maxFraction = input.maxFraction;
  let p23 = b2MulAdd(p14, maxFraction, d);
  const segmentAABB = new b2AABB(Math.min(p14.x, p23.x), Math.min(p14.y, p23.y), Math.max(p14.x, p23.x), Math.max(p14.y, p23.y));
  const stack2 = [];
  stack2.push(tree.root);
  const subInput = input;
  while (stack2.length > 0) {
    const nodeId = stack2.pop();
    if (nodeId == B2_NULL_INDEX) {
      continue;
    }
    const node = tree.nodes[nodeId];
    if (b2AABB_Overlaps(node.aabb, segmentAABB) == false || (node.categoryBits & maskBits) == 0) {
      continue;
    }
    const c2 = b2AABB_Center(node.aabb);
    const h = b2AABB_Extents(node.aabb);
    const term1 = Math.abs(b2Dot(v, b2Sub(p14, c2)));
    const term2 = b2Dot(abs_v, h);
    if (term2 < term1) {
      continue;
    }
    if (node.height == 0) {
      subInput.maxFraction = maxFraction;
      const value = callback(subInput, nodeId, node.userData, context);
      if (value == 0) {
        return;
      }
      if (0 < value && value <= maxFraction) {
        maxFraction = value;
        p23 = b2MulAdd(p14, maxFraction, d);
        segmentAABB.lowerBoundX = Math.min(p14.x, p23.x);
        segmentAABB.lowerBoundY = Math.min(p14.y, p23.y);
        segmentAABB.upperBoundX = Math.max(p14.x, p23.x);
        segmentAABB.upperBoundY = Math.max(p14.y, p23.y);
      }
    } else {
      stack2.push(node.child1);
      stack2.push(node.child2);
    }
  }
}
function b2DynamicTree_ShapeCast(tree, input, maskBits, callback, context) {
  if (input.count == 0) {
    return;
  }
  const originAABB = new b2AABB(input.points[0], input.points[0]);
  for (let i = 1; i < input.count; ++i) {
    originAABB.lowerBoundX = Math.min(originAABB.lowerBoundX, input.points[i].x);
    originAABB.lowerBoundY = Math.min(originAABB.lowerBoundY, input.points[i].y);
    originAABB.upperBoundX = Math.max(originAABB.upperBoundX, input.points[i].x);
    originAABB.upperBoundY = Math.max(originAABB.upperBoundY, input.points[i].y);
  }
  originAABB.lowerBoundX = originAABB.lowerBoundX - input.radius;
  originAABB.lowerBoundY = originAABB.lowerBoundY - input.radius;
  originAABB.upperBoundX = originAABB.upperBoundX + input.radius;
  originAABB.upperBoundY = originAABB.upperBoundY + input.radius;
  const p14 = b2AABB_Center(originAABB);
  const extension = b2AABB_Extents(originAABB);
  const r = input.translation;
  const v = b2CrossSV(1, r);
  const abs_v = b2Abs(v);
  let maxFraction = input.maxFraction;
  let t = b2MulSV(maxFraction, input.translation);
  const totalAABB = new b2AABB(
    Math.min(originAABB.lowerBoundX, originAABB.lowerBoundX + t.x),
    Math.min(originAABB.lowerBoundY, originAABB.lowerBoundY + t.y),
    Math.max(originAABB.upperBoundX, originAABB.upperBoundX + t.x),
    Math.max(originAABB.upperBoundY, originAABB.upperBoundY + t.y)
  );
  const subInput = input;
  const stack2 = [];
  stack2.push(tree.root);
  while (stack2.length > 0) {
    const nodeId = stack2.pop();
    if (nodeId == B2_NULL_INDEX) {
      continue;
    }
    const node = tree.nodes[nodeId];
    if (b2AABB_Overlaps(node.aabb, totalAABB) == false || (node.categoryBits & maskBits) == 0) {
      continue;
    }
    const c2 = b2AABB_Center(node.aabb);
    const h = b2Add(b2AABB_Extents(node.aabb), extension);
    const term1 = Math.abs(b2Dot(v, b2Sub(p14, c2)));
    const term2 = b2Dot(abs_v, h);
    if (term2 < term1) {
      continue;
    }
    if (node.height == 0) {
      subInput.maxFraction = maxFraction;
      const value = callback(subInput, nodeId, node.userData, context);
      if (value == 0) {
        return;
      }
      if (0 < value && value < maxFraction) {
        maxFraction = value;
        t = b2MulSV(maxFraction, input.translation);
        totalAABB.lowerBoundX = Math.min(originAABB.lowerBoundX, originAABB.lowerBoundX + t.x);
        totalAABB.lowerBoundY = Math.min(originAABB.lowerBoundY, originAABB.lowerBoundY + t.y);
        totalAABB.upperBoundX = Math.max(originAABB.upperBoundX, originAABB.upperBoundX + t.x);
        totalAABB.upperBoundY = Math.max(originAABB.upperBoundY, originAABB.upperBoundY + t.y);
      }
    } else {
      stack2.push(node.child1);
      stack2.push(node.child2);
    }
  }
}
function b2PartitionMid(indices, centers, startIndex, endIndex, count) {
  if (count <= 2) {
    return startIndex + (count >> 1);
  }
  let lowerBoundX = centers[startIndex].x;
  let upperBoundX = centers[startIndex].x;
  let lowerBoundY = centers[startIndex].y;
  let upperBoundY = centers[startIndex].y;
  for (let i = startIndex + 1; i < endIndex; ++i) {
    const x = centers[i].x;
    const y = centers[i].y;
    if (x < lowerBoundX) {
      lowerBoundX = x;
    } else if (x > upperBoundX) {
      upperBoundX = x;
    }
    if (y < lowerBoundY) {
      lowerBoundY = y;
    } else if (y > upperBoundY) {
      upperBoundY = y;
    }
  }
  const dX = upperBoundX - lowerBoundX;
  const dY = upperBoundY - lowerBoundY;
  const dirX = dX > dY;
  let left = startIndex;
  let right = endIndex - 1;
  if (dirX) {
    const pivot = 0.5 * (lowerBoundX + upperBoundX);
    while (true) {
      while (left <= right && centers[left].x < pivot) {
        left++;
      }
      while (left <= right && centers[right].x > pivot) {
        right--;
      }
      if (left >= right) {
        break;
      }
      let temp = indices[left];
      indices[left] = indices[right];
      indices[right] = temp;
      temp = centers[left];
      centers[left] = centers[right];
      centers[right] = temp;
      left++;
      right--;
    }
  } else {
    const pivot = 0.5 * (lowerBoundY + upperBoundY);
    while (true) {
      while (left <= right && centers[left].y < pivot) {
        left++;
      }
      while (left <= right && centers[right].y > pivot) {
        right--;
      }
      if (left >= right) {
        break;
      }
      let temp = indices[left];
      indices[left] = indices[right];
      indices[right] = temp;
      temp = centers[left];
      centers[left] = centers[right];
      centers[right] = temp;
      left++;
      right--;
    }
  }
  return left > startIndex && left < endIndex ? left : startIndex + (count >> 1);
}
function b2BuildTree(tree, leafCount) {
  const { nodes, leafIndices, leafCenters } = tree;
  if (leafCount === 1) {
    nodes[leafIndices[0]].parent_next = B2_NULL_INDEX;
    return leafIndices[0];
  }
  const stack2 = new Array(B2_TREE_STACK_SIZE);
  let top = 0;
  stack2[0] = {
    nodeIndex: b2AllocateNode(tree),
    childCount: -1,
    startIndex: 0,
    endIndex: leafCount,
    splitIndex: b2PartitionMid(leafIndices, leafCenters, 0, leafCount, leafCount)
  };
  while (true) {
    const item = stack2[top];
    item.childCount++;
    if (item.childCount === 2) {
      if (top === 0) {
        break;
      }
      const parentItem = stack2[top - 1];
      const parentNode = nodes[parentItem.nodeIndex];
      const childIndex = item.nodeIndex;
      if (parentItem.childCount === 0) {
        parentNode.child1 = childIndex;
      } else {
        parentNode.child2 = childIndex;
      }
      const node = nodes[childIndex];
      node.parent_next = parentItem.nodeIndex;
      const child12 = nodes[node.child1];
      const child22 = nodes[node.child2];
      node.aabb = b2AABB_Union(child12.aabb, child22.aabb);
      node.height = 1 + Math.max(child12.height, child22.height);
      node.categoryBits = child12.categoryBits | child22.categoryBits;
      top--;
    } else {
      const [startIndex, endIndex] = item.childCount === 0 ? [item.startIndex, item.splitIndex] : [item.splitIndex, item.endIndex];
      const count = endIndex - startIndex;
      if (count === 1) {
        const childIndex = leafIndices[startIndex];
        const node = nodes[item.nodeIndex];
        node[item.childCount === 0 ? "child1" : "child2"] = childIndex;
        nodes[childIndex].parent_next = item.nodeIndex;
      } else {
        stack2[++top] = {
          nodeIndex: b2AllocateNode(tree),
          childCount: -1,
          startIndex,
          endIndex,
          splitIndex: b2PartitionMid(
            leafIndices,
            leafCenters,
            startIndex,
            endIndex,
            count
          )
        };
      }
    }
  }
  const rootNode = nodes[stack2[0].nodeIndex];
  const child1 = nodes[rootNode.child1];
  const child2 = nodes[rootNode.child2];
  rootNode.aabb = b2AABB_Union(child1.aabb, child2.aabb);
  rootNode.height = 1 + Math.max(child1.height, child2.height);
  rootNode.categoryBits = child1.categoryBits | child2.categoryBits;
  return stack2[0].nodeIndex;
}
function b2DynamicTree_Rebuild(tree) {
  const proxyCount = tree.proxyCount;
  if (proxyCount === 0) {
    return 0;
  }
  if (proxyCount > tree.rebuildCapacity) {
    const newCapacity = proxyCount + Math.floor(proxyCount / 2);
    tree.leafIndices = Array(newCapacity);
    tree.leafCenters = Array(newCapacity);
    tree.rebuildCapacity = newCapacity;
  }
  let leafCount = 0;
  const stack2 = [];
  let nodeIndex = tree.root;
  const nodes = tree.nodes;
  let node = nodes[nodeIndex];
  const leafIndices = tree.leafIndices;
  const leafCenters = tree.leafCenters;
  while (true) {
    if (node.height === 0 || node.enlarged === false) {
      leafIndices[leafCount] = nodeIndex;
      leafCenters[leafCount] = b2AABB_Center(node.aabb);
      leafCount++;
      node.parent_next = B2_NULL_INDEX;
    } else {
      const doomedNodeIndex = nodeIndex;
      stack2.push(node.child2);
      nodeIndex = node.child1;
      node = nodes[nodeIndex];
      b2FreeNode(tree, doomedNodeIndex);
      continue;
    }
    if (stack2.length === 0) {
      break;
    }
    nodeIndex = stack2.pop();
    node = nodes[nodeIndex];
  }
  tree.root = b2BuildTree(tree, leafCount);
  return leafCount;
}

// src/include/dynamic_tree_h.js
function b2DynamicTree_GetUserData(tree, proxyId) {
  const node = tree.nodes[proxyId];
  return node ? node.userData : 0;
}
var b2DynamicTree = class {
  constructor() {
    this.nodes = [];
    this.root = 0;
    this.nodeCount = 0;
    this.nodeCapacity = 0;
    this.freeList = B2_NULL_INDEX;
    this.proxyCount = 0;
    this.leafIndices = [];
    this.leafCenters = [];
    this.rebuildCapacity = 0;
  }
};

// src/include/ctz_h.js
function b2CTZ64(block) {
  if (block === 0n) {
    return 0;
  }
  const low32 = Number(block & 0xFFFFFFFFn);
  if (low32 !== 0) {
    return Math.clz32(low32 & -low32) ^ 31;
  } else {
    const high32 = Number(block >> 32n);
    return Math.clz32(high32 & -high32) ^ 31 | 32;
  }
}

// src/solver_set_c.js
var b2SolverSet = class {
  constructor() {
    this.sims = new b2BodySimArray();
    this.states = new b2BodyStateArray();
    this.joints = new b2JointArray();
    this.contacts = new b2ContactArray();
    this.islands = new b2IslandArray();
    this.setIndex = 0;
  }
};
function b2DestroySolverSet(world, setIndex) {
  let set = world.solverSetArray[setIndex];
  set.sims = null;
  set.states = null;
  set.contacts = null;
  set.joints = null;
  set.islands = null;
  b2FreeId(world.solverSetIdPool, setIndex);
  set = new b2SolverSet();
  set.setIndex = B2_NULL_INDEX;
  world.solverSetArray[setIndex] = set;
}
function b2WakeSolverSet(world, setIndex) {
  const set = world.solverSetArray[setIndex];
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
  const bodies = world.bodyArray;
  const contacts = world.contactArray;
  const bodyCount = set.sims.count;
  for (let i = 0; i < bodyCount; ++i) {
    const simSrc = set.sims.data[i];
    const body = bodies[simSrc.bodyId];
    body.setIndex = b2SetType.b2_awakeSet;
    body.localIndex = awakeSet.sims.count;
    body.sleepTime = 0;
    const simDst = b2AddBodySim(awakeSet.sims);
    Object.assign(simDst, simSrc);
    const state = b2AddBodyState(awakeSet.states);
    Object.assign(state, new b2BodyState());
    let contactKey = body.headContactKey;
    while (contactKey !== B2_NULL_INDEX) {
      const edgeIndex = contactKey & 1;
      const contactId = contactKey >> 1;
      const contact = contacts[contactId];
      contactKey = contact.edges[edgeIndex].nextKey;
      if (contact.setIndex !== b2SetType.b2_disabledSet) {
        continue;
      }
      const localIndex = contact.localIndex;
      const contactSim = disabledSet.contacts.data[localIndex];
      contact.setIndex = b2SetType.b2_awakeSet;
      contact.localIndex = awakeSet.contacts.count;
      const awakeContactSim = b2AddContact(awakeSet.contacts);
      awakeContactSim.set(contactSim);
      const movedLocalIndex = b2RemoveContact(disabledSet.contacts, localIndex);
      if (movedLocalIndex !== B2_NULL_INDEX) {
        const movedContact = disabledSet.contacts.data[localIndex];
        const movedId = movedContact.contactId;
        contacts[movedId].localIndex = localIndex;
      }
    }
  }
  const contactCount = set.contacts.count;
  for (let i = 0; i < contactCount; ++i) {
    const contactSim = set.contacts.data[i];
    const contact = contacts[contactSim.contactId];
    b2AddContactToGraph(world, contactSim, contact);
    contact.setIndex = b2SetType.b2_awakeSet;
  }
  const joints = world.jointArray;
  const jointCount = set.joints.count;
  for (let i = 0; i < jointCount; ++i) {
    const jointSim = set.joints.data[i];
    const joint = joints[jointSim.jointId];
    b2AddJointToGraph(world, jointSim, joint);
    joint.setIndex = b2SetType.b2_awakeSet;
  }
  const islands = world.islandArray;
  const islandCount = set.islands.count;
  for (let i = 0; i < islandCount; ++i) {
    const islandSrc = set.islands.data[i];
    const island = islands[islandSrc.islandId];
    island.setIndex = b2SetType.b2_awakeSet;
    island.localIndex = awakeSet.islands.count;
    const islandDst = b2AddIsland(awakeSet.islands);
    Object.assign(islandDst, islandSrc);
  }
  b2DestroySolverSet(world, setIndex);
  b2ValidateSolverSets(world);
}
function b2TrySleepIsland(world, islandId) {
  const island = world.islandArray[islandId];
  if (island.constraintRemoveCount > 0) {
    return;
  }
  const moveEvents = world.bodyMoveEventArray;
  const sleepSetId = b2AllocId(world.solverSetIdPool);
  if (sleepSetId === world.solverSetArray.length) {
    const set = new b2SolverSet();
    set.setIndex = B2_NULL_INDEX;
    world.solverSetArray.push(set);
  }
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const sleepSet = world.solverSetArray[sleepSetId];
  sleepSet.setIndex = sleepSetId;
  sleepSet.sims = b2CreateBodySimArray(island.bodyCount);
  sleepSet.contacts = b2CreateContactArray(island.contactCount);
  sleepSet.joints = b2CreateJointArray(island.jointCount);
  const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
  const bodies = world.bodyArray;
  const contacts = world.contactArray;
  let bodyId = island.headBody;
  while (bodyId !== B2_NULL_INDEX) {
    const body = bodies[bodyId];
    if (body.bodyMoveIndex !== B2_NULL_INDEX) {
      moveEvents[body.bodyMoveIndex].fellAsleep = true;
      body.bodyMoveIndex = B2_NULL_INDEX;
    }
    const awakeBodyIndex = body.localIndex;
    const awakeSim = awakeSet.sims.data[awakeBodyIndex];
    const sleepBodyIndex = sleepSet.sims.count;
    const sleepBodySim = b2AddBodySim(sleepSet.sims);
    awakeSim.copyTo(sleepBodySim);
    const movedIndex = b2RemoveBodySim(awakeSet.sims, awakeBodyIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedSim = awakeSet.sims.data[awakeBodyIndex];
      const movedId = movedSim.bodyId;
      const movedBody = bodies[movedId];
      movedBody.localIndex = awakeBodyIndex;
    }
    b2RemoveBodyState(awakeSet.states, awakeBodyIndex);
    body.setIndex = sleepSetId;
    body.localIndex = sleepBodyIndex;
    let contactKey = body.headContactKey;
    while (contactKey !== B2_NULL_INDEX) {
      const contactId2 = contactKey >> 1;
      const edgeIndex = contactKey & 1;
      const contact = contacts[contactId2];
      contactKey = contact.edges[edgeIndex].nextKey;
      if (contact.setIndex === b2SetType.b2_disabledSet) {
        continue;
      }
      if (contact.colorIndex !== B2_NULL_INDEX) {
        continue;
      }
      const otherEdgeIndex = edgeIndex ^ 1;
      const otherBodyId = contact.edges[otherEdgeIndex].bodyId;
      const otherBody = bodies[otherBodyId];
      if (otherBody.setIndex === b2SetType.b2_awakeSet) {
        continue;
      }
      const localIndex = contact.localIndex;
      const contactSim = awakeSet.contacts.data[localIndex];
      contact.setIndex = b2SetType.b2_disabledSet;
      contact.localIndex = disabledSet.contacts.count;
      const disabledContactSim = b2AddContact(disabledSet.contacts);
      disabledContactSim.set(contactSim);
      const movedContactIndex = b2RemoveContact(awakeSet.contacts, localIndex);
      if (movedContactIndex !== B2_NULL_INDEX) {
        const movedContactSim = awakeSet.contacts.data[localIndex];
        const movedId = movedContactSim.contactId;
        contacts[movedId].localIndex = localIndex;
      }
    }
    bodyId = body.islandNext;
  }
  let contactId = island.headContact;
  while (contactId !== B2_NULL_INDEX) {
    const contact = contacts[contactId];
    const colorIndex = contact.colorIndex;
    const color = world.constraintGraph.colors[colorIndex];
    if (colorIndex !== b2_overflowIndex) {
      b2ClearBit(color.bodySet, contact.edges[0].bodyId);
      b2ClearBit(color.bodySet, contact.edges[1].bodyId);
    }
    const awakeContactIndex = contact.localIndex;
    const awakeContactSim = color.contacts.data[awakeContactIndex];
    const sleepContactIndex = sleepSet.contacts.count;
    const sleepContactSim = b2AddContact(sleepSet.contacts);
    sleepContactSim.set(awakeContactSim);
    const movedIndex = b2RemoveContact(color.contacts, awakeContactIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedContactSim = color.contacts.data[awakeContactIndex];
      const movedId = movedContactSim.contactId;
      const movedContact = contacts[movedId];
      movedContact.localIndex = awakeContactIndex;
    }
    contact.setIndex = sleepSetId;
    contact.colorIndex = B2_NULL_INDEX;
    contact.localIndex = sleepContactIndex;
    contactId = contact.islandNext;
  }
  const joints = world.jointArray;
  let jointId = island.headJoint;
  while (jointId !== B2_NULL_INDEX) {
    const joint = joints[jointId];
    const colorIndex = joint.colorIndex;
    const localIndex = joint.localIndex;
    const color = world.constraintGraph.colors[colorIndex];
    const awakeJointSim = color.joints.data[localIndex];
    if (colorIndex !== b2_overflowIndex) {
      b2ClearBit(color.bodySet, joint.edges[0].bodyId);
      b2ClearBit(color.bodySet, joint.edges[1].bodyId);
    }
    const sleepJointIndex = sleepSet.joints.count;
    const sleepJointSim = b2AddJoint(sleepSet.joints);
    awakeJointSim.copyTo(sleepJointSim);
    const movedIndex = b2RemoveJoint(color.joints, localIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedJointSim = color.joints.data[localIndex];
      const movedId = movedJointSim.jointId;
      const movedJoint = joints[movedId];
      movedJoint.localIndex = localIndex;
    }
    joint.setIndex = sleepSetId;
    joint.colorIndex = B2_NULL_INDEX;
    joint.localIndex = sleepJointIndex;
    jointId = joint.islandNext;
  }
  const islandIndex = island.localIndex;
  const sleepIsland = b2AddIsland(sleepSet.islands);
  sleepIsland.islandId = islandId;
  const movedIslandIndex = b2RemoveIsland(awakeSet.islands, islandIndex);
  if (movedIslandIndex !== B2_NULL_INDEX) {
    const movedIslandSim = awakeSet.islands.data[islandIndex];
    const movedIslandId = movedIslandSim.islandId;
    const movedIsland = world.islandArray[movedIslandId];
    movedIsland.localIndex = islandIndex;
  }
  island.setIndex = sleepSetId;
  island.localIndex = 0;
  b2ValidateSolverSets(world);
}
function b2MergeSolverSets(world, setId1, setId2) {
  let set1 = world.solverSetArray[setId1];
  let set2 = world.solverSetArray[setId2];
  if (set1.sims.count < set2.sims.count) {
    [set1, set2] = [set2, set1];
    [setId1, setId2] = [setId2, setId1];
  }
  const bodies = world.bodyArray;
  const bodyCount = set2.sims.count;
  for (let i = 0; i < bodyCount; ++i) {
    const simSrc = set2.sims.data[i];
    const body = bodies[simSrc.bodyId];
    body.setIndex = setId1;
    body.localIndex = set1.sims.count;
    const simDst = b2AddBodySim(set1.sims);
    Object.assign(simDst, simSrc);
  }
  const contacts = world.contactArray;
  const contactCount = set2.contacts.count;
  for (let i = 0; i < contactCount; ++i) {
    const contactSrc = set2.contacts.data[i];
    const contact = contacts[contactSrc.contactId];
    contact.setIndex = setId1;
    contact.localIndex = set1.contacts.count;
    const contactDst = b2AddContact(set1.contacts);
    contactDst.set(contactSrc);
  }
  const joints = world.jointArray;
  const jointCount = set2.joints.count;
  for (let i = 0; i < jointCount; ++i) {
    const jointSrc = set2.joints.data[i];
    const joint = joints[jointSrc.jointId];
    joint.setIndex = setId1;
    joint.localIndex = set1.joints.count;
    const jointDst = b2AddJoint(set1.joints);
    Object.assign(jointDst, jointSrc);
  }
  const islands = world.islandArray;
  const islandCount = set2.islands.count;
  for (let i = 0; i < islandCount; ++i) {
    const islandSrc = set2.islands.data[i];
    const islandId = islandSrc.islandId;
    const island = islands[islandId];
    island.setIndex = setId1;
    island.localIndex = set1.islands.count;
    const islandDst = b2AddIsland(set1.islands);
    Object.assign(islandDst, islandSrc);
  }
  b2DestroySolverSet(world, setId2);
  b2ValidateSolverSets(world);
}
function b2TransferBody(world, targetSet, sourceSet, body) {
  const sourceIndex = body.localIndex;
  const sourceSim = sourceSet.sims.data[sourceIndex];
  const targetIndex = targetSet.sims.count;
  const targetSim = b2AddBodySim(targetSet.sims);
  Object.assign(targetSim, sourceSim);
  const movedIndex = b2RemoveBodySim(sourceSet.sims, sourceIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedSim = sourceSet.sims.data[sourceIndex];
    const movedId = movedSim.bodyId;
    const movedBody = world.bodyArray[movedId];
    movedBody.localIndex = sourceIndex;
  }
  if (sourceSet.setIndex === b2SetType.b2_awakeSet) {
    b2RemoveBodyState(sourceSet.states, sourceIndex);
  } else if (targetSet.setIndex === b2SetType.b2_awakeSet) {
    const state = b2AddBodyState(targetSet.states);
    Object.assign(state, new b2BodyState());
  }
  body.setIndex = targetSet.setIndex;
  body.localIndex = targetIndex;
}
function b2TransferJoint(world, targetSet, sourceSet, joint) {
  const localIndex = joint.localIndex;
  const colorIndex = joint.colorIndex;
  let sourceSim;
  if (sourceSet.setIndex === b2SetType.b2_awakeSet) {
    const color = world.constraintGraph.colors[colorIndex];
    sourceSim = color.joints.data[localIndex];
  } else {
    sourceSim = sourceSet.joints.data[localIndex];
  }
  if (targetSet.setIndex === b2SetType.b2_awakeSet) {
    b2AddJointToGraph(world, sourceSim, joint);
    joint.setIndex = b2SetType.b2_awakeSet;
  } else {
    joint.setIndex = targetSet.setIndex;
    joint.localIndex = targetSet.joints.count;
    joint.colorIndex = B2_NULL_INDEX;
    const targetSim = b2AddJoint(targetSet.joints);
    Object.assign(targetSim, sourceSim);
  }
  if (sourceSet.setIndex === b2SetType.b2_awakeSet) {
    b2RemoveJointFromGraph(world, joint.edges[0].bodyId, joint.edges[1].bodyId, colorIndex, localIndex);
  } else {
    const movedIndex = b2RemoveJoint(sourceSet.joints, localIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedJointSim = sourceSet.joints.data[localIndex];
      const movedId = movedJointSim.jointId;
      const movedJoint = world.jointArray[movedId];
      movedJoint.localIndex = localIndex;
    }
  }
}

// src/solver_c.js
var b2SolverStageType = {
  b2_stagePrepareJoints: 0,
  b2_stagePrepareContacts: 1,
  b2_stageIntegrateVelocities: 2,
  b2_stageWarmStart: 3,
  b2_stageSolve: 4,
  b2_stageIntegratePositions: 5,
  b2_stageRelax: 6,
  b2_stageRestitution: 7,
  b2_stageStoreImpulses: 8
};
var b2SolverBlockType = {
  b2_bodyBlock: 0,
  b2_jointBlock: 1,
  b2_contactBlock: 2,
  b2_graphJointBlock: 3,
  b2_graphContactBlock: 4
};
var b2SolverBlock = class {
  constructor() {
    this.startIndex = 0;
    this.count = 0;
    this.blockType = 0;
    this.syncIndex = 0;
  }
};
var b2SolverStage = class {
  constructor() {
    this.type = 0;
    this.blocks = null;
    this.blockCount = 0;
    this.colorIndex = 0;
    this.completionCount = 0;
  }
};
var b2WorkerContext = class {
  constructor() {
    this.context = new b2StepContext();
    this.workerIndex = 0;
    this.userTask = null;
  }
};
var b2Softness = class _b2Softness {
  constructor(biasRate = 0, massScale = 0, impulseScale = 0) {
    this.biasRate = biasRate;
    this.massScale = massScale;
    this.impulseScale = impulseScale;
  }
  clone() {
    return new _b2Softness(this.biasRate, this.massScale, this.impulseScale);
  }
};
var b2StepContext = class {
  constructor() {
    this.dt = 0;
    this.inv_dt = 0;
    this.h = 0;
    this.inv_h = 0;
    this.subStepCount = 0;
    this.jointSoftness = new b2Softness(0, 0, 0);
    this.contactSoftness = new b2Softness(0, 0, 0);
    this.staticSoftness = new b2Softness(0, 0, 0);
    this.restitutionThreshold = 0;
    this.maxLinearVelocity = 0;
    this.world = null;
    this.graph = null;
    this.states = null;
    this.sims = null;
    this.enlargedShapes = null;
    this.enlargedShapeCount = 0;
    this.fastBodies = null;
    this.fastBodyCount = 0;
    this.bulletBodies = null;
    this.bulletBodyCount = 0;
    this.joints = null;
    this.contacts = null;
    this.simdContactConstraints = null;
    this.activeColorCount = 0;
    this.workerCount = 0;
    this.stages = null;
    this.stageCount = 0;
    this.enableWarmStarting = false;
    this.atomicSyncBits = 0;
  }
};
function b2MakeSoft(hertz, zeta, h) {
  if (hertz === 0) {
    return new b2Softness(0, 1, 0);
  }
  const omega = 2 * B2_PI * hertz;
  const a1 = 2 * zeta + h * omega;
  const a2 = h * omega * a1;
  const a3 = 1 / (1 + a2);
  return new b2Softness(omega / a1, a2 * a3, a3);
}
function b2IntegrateVelocitiesTask(startIndex, endIndex, context) {
  const states = context.states;
  const sims = context.sims;
  const gravity = context.world.gravity;
  const h = context.h;
  const maxLinearSpeed = context.maxLinearVelocity;
  const maxAngularSpeed = B2_MAX_ROTATION * context.inv_dt;
  const maxLinearSpeedSquared = maxLinearSpeed * maxLinearSpeed;
  const maxAngularSpeedSquared = maxAngularSpeed * maxAngularSpeed;
  for (let i = startIndex; i < endIndex; ++i) {
    const sim = sims[i];
    const state = states[i];
    const v = state.linearVelocity;
    let w = state.angularVelocity;
    const linearDamping = 1 / (1 + h * sim.linearDamping);
    const angularDamping = 1 / (1 + h * sim.angularDamping);
    const m = sim.mass * sim.gravityScale;
    const im = h * sim.invMass;
    const lvdX = im * (sim.force.x + m * gravity.x);
    const lvdY = im * (sim.force.y + m * gravity.y);
    const angularVelocityDelta = h * sim.invInertia * sim.torque;
    v.x = lvdX + linearDamping * v.x;
    v.y = lvdY + linearDamping * v.y;
    w = angularVelocityDelta + angularDamping * w;
    const l = v.x * v.x + v.y * v.y;
    if (l > maxLinearSpeedSquared) {
      const ratio = maxLinearSpeed / Math.sqrt(l);
      v.x *= ratio;
      v.y *= ratio;
      sim.isSpeedCapped = true;
    }
    if (w * w > maxAngularSpeedSquared && sim.allowFastRotation === false) {
      const ratio = maxAngularSpeed / Math.abs(w);
      w *= ratio;
      sim.isSpeedCapped = true;
    }
    state.linearVelocity = v;
    state.angularVelocity = w;
  }
}
function b2IntegratePositionsTask(startIndex, endIndex, context) {
  const states = context.states;
  const h = context.h;
  for (let i = startIndex; i < endIndex; ++i) {
    const state = states[i];
    b2IntegrateRotationOut(state.deltaRotation, h * state.angularVelocity, state.deltaRotation);
    state.deltaPosition.x = state.deltaPosition.x + h * state.linearVelocity.x;
    state.deltaPosition.y = state.deltaPosition.y + h * state.linearVelocity.y;
  }
}
function b2FinalizeBodiesTask(startIndex, endIndex, threadIndex, context) {
  const stepContext = context;
  const world = stepContext.world;
  const enableSleep = world.enableSleep;
  const states = stepContext.states;
  const sims = stepContext.sims;
  const bodies = world.bodyArray;
  const timeStep = stepContext.dt;
  const invTimeStep = stepContext.inv_dt;
  const worldId = world.worldId;
  const moveEvents = world.bodyMoveEventArray;
  const islands = world.islandArray;
  const enlargedSimBitSet = world.taskContextArray[threadIndex].enlargedSimBitSet;
  const awakeIslandBitSet = world.taskContextArray[threadIndex].awakeIslandBitSet;
  const taskContext = world.taskContextArray[threadIndex];
  const enableContinuous = world.enableContinuous;
  const speculativeDistance = b2_speculativeDistance;
  const aabbMargin = b2_aabbMargin;
  for (let simIndex = startIndex; simIndex < endIndex; ++simIndex) {
    const state = states[simIndex];
    const sim = sims[simIndex];
    const v = state.linearVelocity;
    const w = state.angularVelocity;
    sim.center.x += state.deltaPosition.x;
    sim.center.y += state.deltaPosition.y;
    const c2 = b2MulRotC(state.deltaRotation, sim.transform.q);
    const s = b2MulRotS(state.deltaRotation, sim.transform.q);
    const im = b2InvMagRot(c2, s);
    sim.transform.q = new b2Rot(im * c2, im * s);
    const maxVelocity = b2Length(v) + Math.abs(w) * sim.maxExtent;
    const maxDeltaPosition = b2Length(state.deltaPosition) + Math.abs(state.deltaRotation.s) * sim.maxExtent;
    const positionSleepFactor = 0.5;
    const sleepVelocity = Math.max(maxVelocity, positionSleepFactor * invTimeStep * maxDeltaPosition);
    state.deltaPosition.x = 0;
    state.deltaPosition.y = 0;
    state.deltaRotation.c = 1;
    state.deltaRotation.s = 0;
    sim.transform.p.x = sim.center.x - (sim.transform.q.c * sim.localCenter.x - sim.transform.q.s * sim.localCenter.y);
    sim.transform.p.y = sim.center.y - (sim.transform.q.s * sim.localCenter.x + sim.transform.q.c * sim.localCenter.y);
    const body = bodies[sim.bodyId];
    body.bodyMoveIndex = simIndex;
    moveEvents[simIndex].transform = sim.transform;
    moveEvents[simIndex].bodyId = new b2BodyId(sim.bodyId + 1, worldId, body.revision);
    moveEvents[simIndex].userData = body.userData;
    moveEvents[simIndex].fellAsleep = false;
    sim.force.x = 0;
    sim.force.y = 0;
    sim.torque = 0;
    body.isSpeedCapped = sim.isSpeedCapped;
    sim.isSpeedCapped = false;
    sim.isFast = false;
    if (enableSleep === false || body.enableSleep === false || sleepVelocity > body.sleepThreshold) {
      body.sleepTime = 0;
      const safetyFactor = 0.5;
      if (body.type === b2BodyType.b2_dynamicBody && enableContinuous && maxVelocity * timeStep > safetyFactor * sim.minExtent) {
        if (sim.isBullet) {
          stepContext.bulletBodyCount++;
          stepContext.bulletBodies[stepContext.bulletBodyCount - 1] = simIndex;
        } else {
          stepContext.fastBodyCount++;
          stepContext.fastBodies[stepContext.fastBodyCount - 1] = simIndex;
        }
        sim.isFast = true;
      } else {
        sim.center0X = sim.center.x;
        sim.center0Y = sim.center.y;
        sim.rotation0.x = sim.transform.q.x;
        sim.rotation0.y = sim.transform.q.y;
      }
    } else {
      sim.center0X = sim.center.x;
      sim.center0Y = sim.center.y;
      sim.rotation0.x = sim.transform.q.x;
      sim.rotation0.y = sim.transform.q.y;
      body.sleepTime += timeStep;
    }
    const island = islands[body.islandId];
    if (body.sleepTime < b2_timeToSleep) {
      const islandIndex = island.localIndex;
      b2SetBit(awakeIslandBitSet, islandIndex);
    } else if (island.constraintRemoveCount > 0) {
      if (body.sleepTime > taskContext.splitSleepTime) {
        taskContext.splitIslandId = body.islandId;
        taskContext.splitSleepTime = body.sleepTime;
      }
    }
    const transform = sim.transform;
    const isFast = sim.isFast;
    let shapeId = body.headShapeId;
    while (shapeId !== B2_NULL_INDEX) {
      const shape = world.shapeArray[shapeId];
      if (isFast) {
        shape.isFast = true;
        b2SetBit(enlargedSimBitSet, simIndex);
      } else {
        const aabb = b2ComputeShapeAABB(shape, transform);
        aabb.lowerBoundX -= speculativeDistance;
        aabb.lowerBoundY -= speculativeDistance;
        aabb.upperBoundX += speculativeDistance;
        aabb.upperBoundY += speculativeDistance;
        shape.aabb = aabb;
        if (b2AABB_Contains(shape.fatAABB, aabb) === false) {
          const fatAABB = new b2AABB(
            aabb.lowerBoundX - aabbMargin,
            aabb.lowerBoundY - aabbMargin,
            aabb.upperBoundX + aabbMargin,
            aabb.upperBoundY + aabbMargin
          );
          shape.fatAABB = fatAABB;
          shape.enlargedAABB = true;
          b2SetBit(enlargedSimBitSet, simIndex);
        }
      }
      shapeId = shape.nextShapeId;
    }
  }
}
function b2ExecuteBlock(stage, context, block) {
  const stageType = stage.type;
  const startIndex = block.startIndex;
  const endIndex = startIndex + block.count;
  if (stageType === b2SolverStageType.b2_stageIntegrateVelocities) {
    b2IntegrateVelocitiesTask(startIndex, endIndex, context);
  } else if (stageType === b2SolverStageType.b2_stageIntegratePositions) {
    b2IntegratePositionsTask(startIndex, endIndex, context);
  } else {
  }
}
function b2ExecuteMainStage(stage, context) {
  const blockCount = stage.blockCount;
  for (let i = 0; i < blockCount; i++) {
    b2ExecuteBlock(stage, context, stage.blocks[i]);
  }
}
function b2SolverTask(workerContext) {
  const workerIndex = workerContext.workerIndex;
  const context = workerContext.context;
  const activeColorCount = context.activeColorCount;
  const stages = context.stages;
  if (workerIndex === 0) {
    let stageIndex = 0;
    b2ExecuteMainStage(stages[stageIndex], context);
    stageIndex += 1;
    b2ExecuteMainStage(stages[stageIndex], context);
    stageIndex += 1;
    b2PrepareOverflowJoints(context);
    b2PrepareOverflowContacts(context);
    const subStepCount = context.subStepCount;
    for (let i = 0; i < subStepCount; ++i) {
      let iterStageIndex = stageIndex;
      b2ExecuteMainStage(stages[iterStageIndex], context);
      iterStageIndex += 1;
      b2WarmStartOverflowJoints(context);
      b2WarmStartOverflowContacts(context);
      for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex) {
        b2ExecuteMainStage(stages[iterStageIndex], context);
        iterStageIndex += 1;
      }
      let useBias = true;
      b2SolveOverflowJoints(context, useBias);
      b2SolveOverflowContacts(context, useBias);
      for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex) {
        b2ExecuteMainStage(stages[iterStageIndex], context);
        iterStageIndex += 1;
      }
      b2ExecuteMainStage(stages[iterStageIndex], context);
      iterStageIndex += 1;
      useBias = false;
      b2SolveOverflowJoints(context, useBias);
      b2SolveOverflowContacts(context, useBias);
      for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex) {
        b2ExecuteMainStage(stages[iterStageIndex], context);
        iterStageIndex += 1;
      }
    }
    stageIndex += 1 + activeColorCount + activeColorCount + 1 + activeColorCount;
    {
      b2ApplyOverflowRestitution(context);
      let iterStageIndex = stageIndex;
      for (let colorIndex = 0; colorIndex < activeColorCount; ++colorIndex) {
        b2ExecuteMainStage(stages[iterStageIndex], context);
        iterStageIndex += 1;
      }
      stageIndex += activeColorCount;
    }
    b2StoreOverflowImpulses(context);
    b2ExecuteMainStage(stages[stageIndex], context);
    context.atomicSyncBits = Number.MAX_SAFE_INTEGER;
    return;
  }
}
var constSweep = new b2Sweep(new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Rot(), new b2Rot());
function b2ContinuousQueryCallback(proxyId, shapeId, context) {
  const continuousContext = context;
  const fastShape = continuousContext.fastShape;
  const fastBodySim = continuousContext.fastBodySim;
  if (shapeId === fastShape.id) {
    return true;
  }
  const world = continuousContext.world;
  const shape = world.shapeArray[shapeId];
  if (shape.bodyId === fastShape.bodyId) {
    return true;
  }
  if (shape.isSensor === true) {
    return true;
  }
  let canCollide = b2ShouldShapesCollide(fastShape.filter, shape.filter);
  if (canCollide === false) {
    return true;
  }
  const body = world.bodyArray[shape.bodyId];
  const bodySim = b2GetBodySim(world, body);
  if (bodySim.isBullet) {
    return true;
  }
  const fastBody = world.bodyArray[fastBodySim.bodyId];
  canCollide = b2ShouldBodiesCollide(world, fastBody, body);
  if (canCollide === false) {
    return true;
  }
  const customFilterFcn = world.customFilterFcn;
  if (customFilterFcn != null) {
    const idA = new b2ShapeId(shape.id + 1, world.worldId, shape.revision);
    const idB = new b2ShapeId(fastShape.id + 1, world.worldId, fastShape.revision);
    canCollide = customFilterFcn(idA, idB, world.customFilterContext);
    if (canCollide === false) {
      return true;
    }
  }
  if (shape.type === b2ShapeType.b2_chainSegmentShape) {
    const transform = bodySim.transform;
    const p14 = b2TransformPoint(transform, shape.chainSegment.segment.point1);
    const p23 = b2TransformPoint(transform, shape.chainSegment.segment.point2);
    const eX = p23.x - p14.x;
    const eY = p23.y - p14.y;
    const c1X = continuousContext.centroid1X;
    const c1Y = continuousContext.centroid1Y;
    const c2X = continuousContext.centroid2X;
    const c2Y = continuousContext.centroid2Y;
    let dx = c1X - p14.x;
    let dy = c1Y - p14.y;
    const offset1 = dx * eY - dy * eX;
    dx = c2X - p14.x;
    dy = c2Y - p14.y;
    const offset2 = dx * eY - dy * eX;
    if (offset1 < 0 || offset2 > 0) {
      return true;
    }
  }
  const input = new b2TOIInput();
  input.proxyA = b2MakeShapeDistanceProxy(shape);
  input.proxyB = b2MakeShapeDistanceProxy(fastShape);
  input.sweepA = b2MakeSweep(bodySim, constSweep);
  input.sweepB = continuousContext.sweep;
  input.tMax = continuousContext.fraction;
  let hitFraction = continuousContext.fraction;
  let didHit = false;
  let output = b2TimeOfImpact(input);
  if (0 < output.t && output.t < continuousContext.fraction) {
    hitFraction = output.t;
    didHit = true;
  } else if (0 === output.t) {
    const centroid = b2GetShapeCentroid(fastShape);
    input.proxyB = b2MakeProxy([centroid], 1, b2_speculativeDistance);
    output = b2TimeOfImpact(input);
    if (0 < output.t && output.t < continuousContext.fraction) {
      hitFraction = output.t;
      didHit = true;
    }
  }
  if (didHit && (shape.enablePreSolveEvents || fastShape.enablePreSolveEvents)) {
    const transformA = b2GetSweepTransform(input.sweepA, hitFraction);
    const transformB = b2GetSweepTransform(input.sweepB, hitFraction);
    const manifold = new b2Manifold();
    b2ComputeManifold(shape, transformA, fastShape, transformB, manifold);
    const shapeIdA = new b2ShapeId(shape.id + 1, world.worldId, shape.revision);
    const shapeIdB = new b2ShapeId(fastShape.id + 1, world.worldId, fastShape.revision);
    didHit = world.preSolveFcn(shapeIdA, shapeIdB, manifold, world.preSolveContext);
  }
  if (didHit) {
    continuousContext.fraction = hitFraction;
  }
  return true;
}
var b2ContinuousContext = class {
  constructor() {
    this.world = null;
    this.fastBodySim = null;
    this.fastShape = null;
    this.centroid1X = 0;
    this.centroid1Y = 0;
    this.centroid2X = 0;
    this.centroid2Y = 0;
    this.sweep = null;
    this.fraction = 0;
  }
};
var p = new b2Vec2();
var p1 = new b2Vec2();
var constSweep2 = new b2Sweep(new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Rot(), new b2Rot());
function b2SolveContinuous(world, bodySimIndex) {
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const fastBodySim = awakeSet.sims.data[bodySimIndex];
  const shapes = world.shapeArray;
  const sweep = b2MakeSweep(fastBodySim, constSweep2);
  p.x = sweep.c1.x - (sweep.q1.c * sweep.localCenter.x - sweep.q1.s * sweep.localCenter.y);
  p.y = sweep.c1.y - (sweep.q1.s * sweep.localCenter.x + sweep.q1.c * sweep.localCenter.y);
  const xf12 = new b2Transform(p, sweep.q1);
  p1.x = sweep.c2.x - (sweep.q2.c * sweep.localCenter.x - sweep.q2.s * sweep.localCenter.y);
  p1.y = sweep.c2.y - (sweep.q2.s * sweep.localCenter.x + sweep.q2.c * sweep.localCenter.y);
  const xf2 = new b2Transform(p1, sweep.q2);
  const staticTree = world.broadPhase.trees[b2BodyType.b2_staticBody];
  const kinematicTree = world.broadPhase.trees[b2BodyType.b2_kinematicBody];
  const dynamicTree = world.broadPhase.trees[b2BodyType.b2_dynamicBody];
  const fastBody = world.bodyArray[fastBodySim.bodyId];
  const context = new b2ContinuousContext();
  context.world = world;
  context.sweep = sweep;
  context.fastBodySim = fastBodySim;
  context.fraction = 1;
  const isBullet = fastBodySim.isBullet;
  let shapeId = fastBody.headShapeId;
  while (shapeId != B2_NULL_INDEX) {
    const fastShape = shapes[shapeId];
    shapeId = fastShape.nextShapeId;
    fastShape.isFast = false;
    context.fastShape = fastShape;
    b2TransformPointOut(xf12, fastShape.localCentroid, p);
    context.centroid1X = p.x;
    context.centroid1Y = p.y;
    b2TransformPointOut(xf2, fastShape.localCentroid, p);
    context.centroid2X = p.x;
    context.centroid2Y = p.y;
    const box1 = fastShape.aabb;
    const box2 = b2ComputeShapeAABB(fastShape, xf2);
    const box = b2AABB_Union(box1, box2);
    fastShape.aabb = box2;
    if (fastShape.isSensor) {
      continue;
    }
    b2DynamicTree_Query(staticTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);
    if (isBullet) {
      b2DynamicTree_Query(kinematicTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);
      b2DynamicTree_Query(dynamicTree, box, B2_DEFAULT_MASK_BITS, b2ContinuousQueryCallback, context);
    }
  }
  const speculativeDistance = b2_speculativeDistance;
  const aabbMargin = b2_aabbMargin;
  if (context.fraction < 1) {
    const q3 = b2NLerp(sweep.q1, sweep.q2, context.fraction);
    const c2 = b2Lerp(sweep.c1, sweep.c2, context.fraction);
    const origin = b2Sub(c2, b2RotateVector(q3, sweep.localCenter));
    const transform = new b2Transform(origin, q3);
    fastBodySim.transform = transform;
    fastBodySim.center = c2;
    fastBodySim.rotation0 = q3;
    fastBodySim.center0X = c2.x;
    fastBodySim.center0Y = c2.y;
    shapeId = fastBody.headShapeId;
    while (shapeId != B2_NULL_INDEX) {
      const shape = shapes[shapeId];
      const aabb = b2ComputeShapeAABB(shape, transform);
      aabb.lowerBoundX -= speculativeDistance;
      aabb.lowerBoundY -= speculativeDistance;
      aabb.upperBoundX += speculativeDistance;
      aabb.upperBoundY += speculativeDistance;
      shape.aabb = aabb;
      if (!b2AABB_Contains(shape.fatAABB, aabb)) {
        const fatAABB = new b2AABB(
          aabb.lowerBoundX - aabbMargin,
          aabb.lowerBoundY - aabbMargin,
          aabb.upperBoundX + aabbMargin,
          aabb.upperBoundY + aabbMargin
        );
        shape.fatAABB = fatAABB;
        shape.enlargedAABB = true;
        fastBodySim.enlargeAABB = true;
      }
      shapeId = shape.nextShapeId;
    }
  } else {
    fastBodySim.rotation0 = fastBodySim.transform.q;
    fastBodySim.center0X = fastBodySim.center.x;
    fastBodySim.center0Y = fastBodySim.center.y;
    shapeId = fastBody.headShapeId;
    while (shapeId != B2_NULL_INDEX) {
      const shape = shapes[shapeId];
      if (!b2AABB_Contains(shape.fatAABB, shape.aabb)) {
        const fatAABB = new b2AABB(
          shape.aabb.lowerBoundX - aabbMargin,
          shape.aabb.lowerBoundY - aabbMargin,
          shape.aabb.upperBoundX + aabbMargin,
          shape.aabb.upperBoundY + aabbMargin
        );
        shape.fatAABB = fatAABB;
        shape.enlargedAABB = true;
        fastBodySim.enlargeAABB = true;
      }
      shapeId = shape.nextShapeId;
    }
  }
}
function b2FastBodyTask(startIndex, endIndex, taskContext) {
  const stepContext = taskContext;
  for (let i = startIndex; i < endIndex; ++i) {
    const simIndex = stepContext.fastBodies[i];
    b2SolveContinuous(stepContext.world, simIndex);
  }
}
function b2BulletBodyTask(startIndex, endIndex, taskContext) {
  const stepContext = taskContext;
  for (let i = startIndex; i < endIndex; ++i) {
    const simIndex = stepContext.bulletBodies[i];
    b2SolveContinuous(stepContext.world, simIndex);
  }
}
function b2Solve(world, stepContext) {
  world.stepIndex += 1;
  b2MergeAwakeIslands(world);
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const awakeBodyCount = awakeSet.sims.count;
  if (awakeBodyCount === 0) {
    return;
  }
  stepContext.fastBodyCount = 0;
  stepContext.fastBodies = b2AllocateStackItem(world.stackAllocator, awakeBodyCount, "fast bodies");
  stepContext.bulletBodyCount = 0;
  stepContext.bulletBodies = b2AllocateStackItem(world.stackAllocator, awakeBodyCount, "bullet bodies");
  {
    const graph = world.constraintGraph;
    const colors = graph.colors;
    stepContext.sims = awakeSet.sims.data;
    stepContext.states = awakeSet.states.data;
    let awakeJointCount = 0;
    let activeColorCount = 0;
    for (let i = 0; i < b2_graphColorCount - 1; ++i) {
      const perColorContactCount = colors[i].contacts.count;
      const perColorJointCount = colors[i].joints.count;
      const occupancyCount = perColorContactCount + perColorJointCount;
      activeColorCount += occupancyCount > 0 ? 1 : 0;
      awakeJointCount += perColorJointCount;
    }
    {
      const bodyMoveEventArray = world.bodyMoveEventArray;
      while (bodyMoveEventArray.length < awakeBodyCount) {
        bodyMoveEventArray.push(new b2BodyMoveEvent());
      }
    }
    const workerCount = world.workerCount;
    const blocksPerWorker = 4;
    const maxBlockCount = blocksPerWorker * workerCount;
    let bodyBlockSize = 1 << 5;
    let bodyBlockCount;
    if (awakeBodyCount > bodyBlockSize * maxBlockCount) {
      bodyBlockSize = Math.floor(awakeBodyCount / maxBlockCount);
      bodyBlockCount = maxBlockCount;
    } else {
      bodyBlockCount = Math.floor(awakeBodyCount - 1 >> 5) + 1;
    }
    const colorContactCounts = new Array(b2_graphColorCount);
    const colorContactBlockSizes = new Array(b2_graphColorCount);
    const colorContactBlockCounts = new Array(b2_graphColorCount);
    const colorJointCounts = new Array(b2_graphColorCount);
    const colorJointBlockSizes = new Array(b2_graphColorCount);
    const colorJointBlockCounts = new Array(b2_graphColorCount);
    const graphBlockCount = 0;
    const simdContactCount = 0;
    const overflowContactCount = colors[b2_overflowIndex].contacts.count;
    const overflowContactConstraints = b2AllocateStackItem(
      world.stackAllocator,
      overflowContactCount,
      "overflow contact constraint",
      () => {
        return new b2ContactConstraint();
      }
    );
    graph.colors[b2_overflowIndex].overflowConstraints = overflowContactConstraints;
    let contactBlockSize = blocksPerWorker;
    let contactBlockCount = simdContactCount > 0 ? Math.floor(simdContactCount - 1 >> 2) + 1 : 0;
    if (simdContactCount > contactBlockSize * maxBlockCount) {
      contactBlockSize = Math.floor(simdContactCount / maxBlockCount);
      contactBlockCount = maxBlockCount;
    }
    let jointBlockSize = blocksPerWorker;
    let jointBlockCount = awakeJointCount > 0 ? Math.floor(awakeJointCount - 1 >> 2) + 1 : 0;
    if (awakeJointCount > jointBlockSize * maxBlockCount) {
      jointBlockSize = Math.floor(awakeJointCount / maxBlockCount);
      jointBlockCount = maxBlockCount;
    }
    let stageCount = 0;
    stageCount += 1;
    stageCount += 1;
    stageCount += 1;
    stageCount += activeColorCount;
    stageCount += activeColorCount;
    stageCount += 1;
    stageCount += activeColorCount;
    stageCount += activeColorCount;
    stageCount += 1;
    const stages = Array.from({ length: stageCount }, () => new b2SolverStage());
    const bodyBlocks = b2AllocateStackItem(world.stackAllocator, bodyBlockCount, "body blocks");
    const contactBlocks = b2AllocateStackItem(world.stackAllocator, contactBlockCount, "contact blocks");
    const jointBlocks = b2AllocateStackItem(world.stackAllocator, jointBlockCount, "joint blocks");
    const graphBlocks = b2AllocateStackItem(world.stackAllocator, graphBlockCount, "graph blocks");
    if (world.splitIslandId != B2_NULL_INDEX) {
      b2SplitIsland(world, world.splitIslandId);
    }
    for (let i = 0; i < bodyBlockCount; ++i) {
      const block = new b2SolverBlock();
      block.startIndex = i * bodyBlockSize;
      block.count = bodyBlockSize;
      block.blockType = b2SolverBlockType.b2_bodyBlock;
      block.syncIndex = 0;
      bodyBlocks[i] = block;
    }
    bodyBlocks[bodyBlockCount - 1].count = awakeBodyCount - (bodyBlockCount - 1) * bodyBlockSize;
    for (let i = 0; i < jointBlockCount; ++i) {
      const block = new b2SolverBlock();
      block.startIndex = i * jointBlockSize;
      block.count = jointBlockSize;
      block.blockType = b2SolverBlockType.b2_jointBlock;
      block.syncIndex = 0;
      jointBlocks[i] = block;
    }
    if (jointBlockCount > 0) {
      jointBlocks[jointBlockCount - 1].count = awakeJointCount - (jointBlockCount - 1) * jointBlockSize;
    }
    for (let i = 0; i < contactBlockCount; ++i) {
      const block = new b2SolverBlock();
      block.startIndex = i * contactBlockSize;
      block.count = contactBlockSize;
      block.blockType = b2SolverBlockType.b2_contactBlock;
      block.syncIndex = 0;
      contactBlocks[i] = block;
    }
    if (contactBlockCount > 0) {
      contactBlocks[contactBlockCount - 1].count = simdContactCount - (contactBlockCount - 1) * contactBlockSize;
    }
    const graphColorBlocks = new Array(b2_graphColorCount);
    let baseGraphBlock = 0;
    for (let i = 0; i < activeColorCount; ++i) {
      graphColorBlocks[i] = baseGraphBlock;
      const colorJointBlockCount = colorJointBlockCounts[i];
      const colorJointBlockSize = colorJointBlockSizes[i];
      for (let j = 0; j < colorJointBlockCount; ++j) {
        const block = new b2SolverBlock();
        block.startIndex = j * colorJointBlockSize;
        block.count = colorJointBlockSize;
        block.blockType = b2SolverBlockType.b2_graphJointBlock;
        block.syncIndex = 0;
        graphBlocks[baseGraphBlock + j] = block;
      }
      if (colorJointBlockCount > 0) {
        graphBlocks[baseGraphBlock + colorJointBlockCount - 1].count = colorJointCounts[i] - (colorJointBlockCount - 1) * colorJointBlockSize;
        baseGraphBlock += colorJointBlockCount;
      }
      const colorContactBlockCount = colorContactBlockCounts[i];
      const colorContactBlockSize = colorContactBlockSizes[i];
      for (let j = 0; j < colorContactBlockCount; ++j) {
        const block = new b2SolverBlock();
        block.startIndex = j * colorContactBlockSize;
        block.count = colorContactBlockSize;
        block.blockType = b2SolverBlockType.b2_graphContactBlock;
        block.syncIndex = 0;
        graphBlocks[baseGraphBlock + j] = block;
      }
      if (colorContactBlockCount > 0) {
        graphBlocks[baseGraphBlock + colorContactBlockCount - 1].count = colorContactCounts[i] - (colorContactBlockCount - 1) * colorContactBlockSize;
        baseGraphBlock += colorContactBlockCount;
      }
    }
    const blockDiff = baseGraphBlock;
    let si = 0;
    const setStageProperties = (stage, type, blocks, blockCount, colorIndex = -1) => {
      stage.type = type;
      stage.blocks = blocks;
      stage.blockCount = blockCount;
      stage.colorIndex = colorIndex;
      stage.completionCount = 0;
    };
    setStageProperties(stages[si++], b2SolverStageType.b2_stagePrepareJoints, jointBlocks, jointBlockCount);
    setStageProperties(stages[si++], b2SolverStageType.b2_stagePrepareContacts, contactBlocks, contactBlockCount);
    setStageProperties(stages[si++], b2SolverStageType.b2_stageIntegrateVelocities, bodyBlocks, bodyBlockCount);
    setStageProperties(stages[si++], b2SolverStageType.b2_stageIntegratePositions, bodyBlocks, bodyBlockCount);
    setStageProperties(stages[si++], b2SolverStageType.b2_stageStoreImpulses, contactBlocks, contactBlockCount);
    stepContext.graph = graph;
    stepContext.joints = null;
    stepContext.contacts = null;
    stepContext.simdContactConstraints = null;
    stepContext.activeColorCount = activeColorCount;
    stepContext.workerCount = workerCount;
    stepContext.stageCount = stageCount;
    stepContext.stages = stages;
    {
      const workerContext = new b2WorkerContext();
      workerContext.context = stepContext;
      workerContext.workerIndex = 0;
      b2SolverTask(workerContext);
    }
    world.splitIslandId = B2_NULL_INDEX;
    const awakeIslandCount = awakeSet.islands.count;
    for (let i = 0; i < world.workerCount; ++i) {
      const taskContext = world.taskContextArray[i];
      taskContext.enlargedSimBitSet = b2SetBitCountAndClear(taskContext.enlargedSimBitSet, awakeBodyCount);
      taskContext.awakeIslandBitSet = b2SetBitCountAndClear(taskContext.awakeIslandBitSet, awakeIslandCount);
      taskContext.splitIslandId = B2_NULL_INDEX;
      taskContext.splitSleepTime = 0;
    }
    b2FinalizeBodiesTask(0, awakeBodyCount, 0, stepContext);
    b2FreeStackItem(world.stackAllocator, graphBlocks);
    b2FreeStackItem(world.stackAllocator, jointBlocks);
    b2FreeStackItem(world.stackAllocator, contactBlocks);
    b2FreeStackItem(world.stackAllocator, bodyBlocks);
    b2FreeStackItem(world.stackAllocator, overflowContactConstraints);
  }
  {
    const threshold = world.hitEventThreshold;
    const colors = world.constraintGraph.colors;
    for (let i = 0; i < b2_graphColorCount; ++i) {
      const color = colors[i];
      const contactCount = color.contacts.count;
      const contactSims = color.contacts.data;
      for (let j = 0; j < contactCount; ++j) {
        const contactSim = contactSims[j];
        if ((contactSim.simFlags & b2ContactSimFlags.b2_simEnableHitEvent) === 0) {
          continue;
        }
        const event = new b2ContactHitEvent();
        event.approachSpeed = threshold;
        event.shapeIdA = new b2ShapeId(0, 0, 0);
        event.shapeIdB = new b2ShapeId(0, 0, 0);
        let hit = false;
        const pointCount = contactSim.manifold.pointCount;
        for (let k = 0; k < pointCount; ++k) {
          const mp = contactSim.manifold.points[k];
          const approachSpeed = -mp.normalVelocity;
          if (approachSpeed > event.approachSpeed && mp.maxNormalImpulse > 0) {
            event.approachSpeed = approachSpeed;
            event.pointX = mp.pointX;
            event.pointY = mp.pointY;
            hit = true;
          }
        }
        if (hit === true) {
          event.normalX = contactSim.manifold.normalX;
          event.normalY = contactSim.manifold.normalY;
          const shapeA = world.shapeArray[contactSim.shapeIdA];
          const shapeB = world.shapeArray[contactSim.shapeIdB];
          event.shapeIdA = new b2ShapeId(shapeA.id + 1, world.worldId, shapeA.revision);
          event.shapeIdB = new b2ShapeId(shapeB.id + 1, world.worldId, shapeB.revision);
          world.contactHitArray.push(event);
        }
      }
    }
  }
  const simBitSet = world.taskContextArray[0].enlargedSimBitSet;
  for (let i = 1; i < world.workerCount; ++i) {
    b2InPlaceUnion(simBitSet, world.taskContextArray[i].enlargedSimBitSet);
  }
  {
    const broadPhase = world.broadPhase;
    const shapes = world.shapeArray;
    const wordCount = simBitSet.blockCount;
    const bits = simBitSet.bits;
    for (let k = 0; k < wordCount; ++k) {
      let word = bits[k];
      while (word !== 0n) {
        const ctz = b2CTZ64(word);
        const bodySimIndex = 64 * k + ctz;
        const bodySim = awakeSet.sims.data[bodySimIndex];
        const body = world.bodyArray[bodySim.bodyId];
        let shapeId = body.headShapeId;
        while (shapeId !== B2_NULL_INDEX) {
          const shape = shapes[shapeId];
          if (shape.enlargedAABB) {
            b2BroadPhase_EnlargeProxy(broadPhase, shape.proxyKey, shape.fatAABB);
            shape.enlargedAABB = false;
          } else if (shape.isFast) {
            b2BufferMove(broadPhase, shape.proxyKey);
          }
          shapeId = shape.nextShapeId;
        }
        word = word & word - 1n;
      }
    }
  }
  if (stepContext.fastBodyCount > 0) {
    b2FastBodyTask(0, stepContext.fastBodyCount, stepContext);
  }
  {
    const broadPhase = world.broadPhase;
    const dynamicTree = broadPhase.trees[b2BodyType.b2_dynamicBody];
    const bodies = world.bodyArray;
    const shapes = world.shapeArray;
    const fastBodies = stepContext.fastBodies;
    const fastBodyCount = stepContext.fastBodyCount;
    for (let i = 0; i < fastBodyCount; ++i) {
      const fastBodySim = awakeSet.sims.data[fastBodies[i]];
      if (fastBodySim.enlargeAABB === false) {
        continue;
      }
      fastBodySim.enlargeAABB = false;
      const fastBody = bodies[fastBodySim.bodyId];
      let shapeId = fastBody.headShapeId;
      while (shapeId !== B2_NULL_INDEX) {
        const shape = shapes[shapeId];
        if (shape.enlargedAABB === false) {
          shapeId = shape.nextShapeId;
          continue;
        }
        shape.enlargedAABB = false;
        const proxyKey = shape.proxyKey;
        const proxyId = B2_PROXY_ID(proxyKey);
        b2DynamicTree_EnlargeProxy(dynamicTree, proxyId, shape.fatAABB);
        shapeId = shape.nextShapeId;
      }
    }
  }
  if (stepContext.bulletBodyCount > 0) {
    b2BulletBodyTask(0, stepContext.bulletBodyCount, stepContext);
  }
  {
    const broadPhase = world.broadPhase;
    const dynamicTree = broadPhase.trees[b2BodyType.b2_dynamicBody];
    const bodies = world.bodyArray;
    const shapes = world.shapeArray;
    const bulletBodies = stepContext.bulletBodies;
    const bulletBodyCount = stepContext.bulletBodyCount;
    for (let i = 0; i < bulletBodyCount; ++i) {
      const bulletBodySim = awakeSet.sims.data[bulletBodies[i]];
      if (bulletBodySim.enlargeAABB === false) {
        continue;
      }
      bulletBodySim.enlargeAABB = false;
      const bulletBody = bodies[bulletBodySim.bodyId];
      let shapeId = bulletBody.headShapeId;
      while (shapeId !== B2_NULL_INDEX) {
        const shape = shapes[shapeId];
        if (shape.enlargedAABB === false) {
          shapeId = shape.nextShapeId;
          continue;
        }
        shape.enlargedAABB = false;
        const proxyKey = shape.proxyKey;
        const proxyId = B2_PROXY_ID(proxyKey);
        b2DynamicTree_EnlargeProxy(dynamicTree, proxyId, shape.fatAABB);
        shapeId = shape.nextShapeId;
      }
    }
  }
  b2FreeStackItem(world.stackAllocator, stepContext.bulletBodies);
  stepContext.bulletBodies = null;
  stepContext.bulletBodyCount = 0;
  b2FreeStackItem(world.stackAllocator, stepContext.fastBodies);
  stepContext.fastBodies = null;
  stepContext.fastBodyCount = 0;
  if (world.enableSleep === true) {
    let splitSleepTimer = 0;
    for (let i = 0; i < world.workerCount; ++i) {
      const taskContext = world.taskContextArray[i];
      if (taskContext.splitIslandId !== B2_NULL_INDEX && taskContext.splitSleepTime > splitSleepTimer) {
        world.splitIslandId = taskContext.splitIslandId;
        splitSleepTimer = taskContext.splitSleepTime;
      }
    }
    const awakeIslandBitSet = world.taskContextArray[0].awakeIslandBitSet;
    for (let i = 1; i < world.workerCount; ++i) {
      b2InPlaceUnion(awakeIslandBitSet, world.taskContextArray[i].awakeIslandBitSet);
    }
    const islands = awakeSet.islands.data;
    const count = awakeSet.islands.count;
    for (let islandIndex = count - 1; islandIndex >= 0; islandIndex -= 1) {
      if (b2GetBit(awakeIslandBitSet, islandIndex) === true) {
        continue;
      }
      const island = islands[islandIndex];
      const islandId = island.islandId;
      b2TrySleepIsland(world, islandId);
    }
    b2ValidateSolverSets(world);
  }
}

// src/distance_joint_c.js
function b2DistanceJoint_SetLength(jointId, length) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  joint.length = b2ClampFloat(length, b2_linearSlop, B2_HUGE);
  joint.impulse = 0;
  joint.lowerImpulse = 0;
  joint.upperImpulse = 0;
}
function b2DistanceJoint_GetLength(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  return joint.length;
}
function b2DistanceJoint_EnableLimit(jointId, enableLimit) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  joint.enableLimit = enableLimit;
}
function b2DistanceJoint_IsLimitEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return joint.distanceJoint.enableLimit;
}
function b2DistanceJoint_SetLengthRange(jointId, minLength, maxLength) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  minLength = b2ClampFloat(minLength, b2_linearSlop, B2_HUGE);
  maxLength = b2ClampFloat(maxLength, b2_linearSlop, B2_HUGE);
  joint.minLength = Math.min(minLength, maxLength);
  joint.maxLength = Math.max(minLength, maxLength);
  joint.impulse = 0;
  joint.lowerImpulse = 0;
  joint.upperImpulse = 0;
}
function b2DistanceJoint_GetMinLength(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  return joint.minLength;
}
function b2DistanceJoint_GetMaxLength(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  return joint.maxLength;
}
function b2DistanceJoint_GetCurrentLength(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const world = b2GetWorld(jointId.world0);
  if (world.locked) {
    return 0;
  }
  const transformA = b2GetBodyTransform(world, base.bodyIdA);
  const transformB = b2GetBodyTransform(world, base.bodyIdB);
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const d = b2Sub(pB, pA);
  const length = b2Length(d);
  return length;
}
function b2DistanceJoint_EnableSpring(jointId, enableSpring) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  base.distanceJoint.enableSpring = enableSpring;
}
function b2DistanceJoint_IsSpringEnabled(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return base.distanceJoint.enableSpring;
}
function b2DistanceJoint_SetSpringHertz(jointId, hertz) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  base.distanceJoint.hertz = hertz;
}
function b2DistanceJoint_SetSpringDampingRatio(jointId, dampingRatio) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  base.distanceJoint.dampingRatio = dampingRatio;
}
function b2DistanceJoint_GetHertz(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  return joint.hertz;
}
function b2DistanceJoint_GetDampingRatio(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  const joint = base.distanceJoint;
  return joint.dampingRatio;
}
function b2DistanceJoint_EnableMotor(jointId, enableMotor) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  if (enableMotor !== joint.distanceJoint.enableMotor) {
    joint.distanceJoint.enableMotor = enableMotor;
    joint.distanceJoint.motorImpulse = 0;
  }
}
function b2DistanceJoint_IsMotorEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return joint.distanceJoint.enableMotor;
}
function b2DistanceJoint_SetMotorSpeed(jointId, motorSpeed) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  joint.distanceJoint.motorSpeed = motorSpeed;
}
function b2DistanceJoint_GetMotorSpeed(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return joint.distanceJoint.motorSpeed;
}
function b2DistanceJoint_GetMotorForce(jointId) {
  const world = b2GetWorld(jointId.world0);
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return world.inv_h * base.distanceJoint.motorImpulse;
}
function b2DistanceJoint_SetMaxMotorForce(jointId, force) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  joint.distanceJoint.maxMotorForce = force;
}
function b2DistanceJoint_GetMaxMotorForce(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_distanceJoint);
  return joint.distanceJoint.maxMotorForce;
}
function b2GetDistanceJointForce(world, base) {
  const joint = base.distanceJoint;
  const transformA = b2GetBodyTransform(world, base.bodyIdA);
  const transformB = b2GetBodyTransform(world, base.bodyIdB);
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const d = b2Sub(pB, pA);
  const axis = b2Normalize(d);
  const force = (joint.impulse + joint.lowerImpulse - joint.upperImpulse + joint.motorImpulse) * world.inv_h;
  return b2MulSV(force, axis);
}
function b2PrepareDistanceJoint(base, context) {
  const world = context.world;
  const bodies = world.bodyArray;
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.distanceJoint;
  joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? bodyA.localIndex : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? bodyB.localIndex : B2_NULL_INDEX;
  joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
  const rA = joint.anchorA;
  const rB = joint.anchorB;
  const separation = b2Add(b2Sub(rB, rA), joint.deltaCenter);
  const axis = b2Normalize(separation);
  const crA = b2Cross(rA, axis);
  const crB = b2Cross(rB, axis);
  const k = mA + mB + iA * crA * crA + iB * crB * crB;
  joint.axialMass = k > 0 ? 1 / k : 0;
  joint.distanceSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);
  if (context.enableWarmStarting === false) {
    joint.impulse = 0;
    joint.lowerImpulse = 0;
    joint.upperImpulse = 0;
    joint.motorImpulse = 0;
  }
}
function b2WarmStartDistanceJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.distanceJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const ds = b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), b2Sub(rB, rA));
  const separation = b2Add(joint.deltaCenter, ds);
  const axis = b2Normalize(separation);
  const axialImpulse = joint.impulse + joint.lowerImpulse - joint.upperImpulse + joint.motorImpulse;
  const P = b2MulSV(axialImpulse, axis);
  stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
  stateA.angularVelocity -= iA * b2Cross(rA, P);
  stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
  stateB.angularVelocity += iB * b2Cross(rB, P);
}
function b2SolveDistanceJoint(base, context, useBias) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.distanceJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = stateA.linearVelocity;
  let wA = stateA.angularVelocity;
  let vB = stateB.linearVelocity;
  let wB = stateB.angularVelocity;
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const ds = b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), b2Sub(rB, rA));
  const separation = b2Add(joint.deltaCenter, ds);
  const length = b2Length(separation);
  const axis = b2Normalize(separation);
  if (joint.enableSpring && (joint.minLength < joint.maxLength || joint.enableLimit === false)) {
    if (joint.hertz > 0) {
      const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
      const Cdot = b2Dot(axis, vr);
      const C = length - joint.length;
      const bias = joint.distanceSoftness.biasRate * C;
      const m = joint.distanceSoftness.massScale * joint.axialMass;
      const impulse = -m * (Cdot + bias) - joint.distanceSoftness.impulseScale * joint.impulse;
      joint.impulse += impulse;
      const P = b2MulSV(impulse, axis);
      vA = b2MulSub(vA, mA, P);
      wA -= iA * b2Cross(rA, P);
      vB = b2MulAdd(vB, mB, P);
      wB += iB * b2Cross(rB, P);
    }
    if (joint.enableLimit) {
      {
        const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
        const Cdot = b2Dot(axis, vr);
        const C = length - joint.minLength;
        let bias = 0;
        let massCoeff = 1;
        let impulseCoeff = 0;
        if (C > 0) {
          bias = C * context.inv_h;
        } else if (useBias) {
          bias = context.jointSoftness.biasRate * C;
          massCoeff = context.jointSoftness.massScale;
          impulseCoeff = context.jointSoftness.impulseScale;
        }
        const impulse = -massCoeff * joint.axialMass * (Cdot + bias) - impulseCoeff * joint.lowerImpulse;
        const newImpulse = Math.max(0, joint.lowerImpulse + impulse);
        const deltaImpulse = newImpulse - joint.lowerImpulse;
        joint.lowerImpulse = newImpulse;
        const P = b2MulSV(deltaImpulse, axis);
        vA = b2MulSub(vA, mA, P);
        wA -= iA * b2Cross(rA, P);
        vB = b2MulAdd(vB, mB, P);
        wB += iB * b2Cross(rB, P);
      }
      {
        const vr = b2Add(b2Sub(vA, vB), b2Sub(b2CrossSV(wA, rA), b2CrossSV(wB, rB)));
        const Cdot = b2Dot(axis, vr);
        const C = joint.maxLength - length;
        let bias = 0;
        let massScale = 1;
        let impulseScale = 0;
        if (C > 0) {
          bias = C * context.inv_h;
        } else if (useBias) {
          bias = context.jointSoftness.biasRate * C;
          massScale = context.jointSoftness.massScale;
          impulseScale = context.jointSoftness.impulseScale;
        }
        const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.upperImpulse;
        const newImpulse = Math.max(0, joint.upperImpulse + impulse);
        const deltaImpulse = newImpulse - joint.upperImpulse;
        joint.upperImpulse = newImpulse;
        const P = b2MulSV(-deltaImpulse, axis);
        vA = b2MulSub(vA, mA, P);
        wA -= iA * b2Cross(rA, P);
        vB = b2MulAdd(vB, mB, P);
        wB += iB * b2Cross(rB, P);
      }
    }
    if (joint.enableMotor) {
      const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
      const Cdot = b2Dot(axis, vr);
      const impulse = joint.axialMass * (joint.motorSpeed - Cdot);
      const oldImpulse = joint.motorImpulse;
      const maxImpulse = context.h * joint.maxMotorForce;
      joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
      const deltaImpulse = joint.motorImpulse - oldImpulse;
      const P = b2MulSV(deltaImpulse, axis);
      vA = b2MulSub(vA, mA, P);
      wA -= iA * b2Cross(rA, P);
      vB = b2MulAdd(vB, mB, P);
      wB += iB * b2Cross(rB, P);
    }
  } else {
    const vr = b2Add(b2Sub(vB, vA), b2Sub(b2CrossSV(wB, rB), b2CrossSV(wA, rA)));
    const Cdot = b2Dot(axis, vr);
    const C = length - joint.length;
    let bias = 0;
    let massScale = 1;
    let impulseScale = 0;
    if (useBias) {
      bias = context.jointSoftness.biasRate * C;
      massScale = context.jointSoftness.massScale;
      impulseScale = context.jointSoftness.impulseScale;
    }
    const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.impulse;
    joint.impulse += impulse;
    const P = b2MulSV(impulse, axis);
    vA = b2MulSub(vA, mA, P);
    wA -= iA * b2Cross(rA, P);
    vB = b2MulAdd(vB, mB, P);
    wB += iB * b2Cross(rB, P);
  }
  stateA.linearVelocity = vA;
  stateA.angularVelocity = wA;
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}
function b2DrawDistanceJoint(draw, base, transformA, transformB) {
  const joint = base.distanceJoint;
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const axis = b2Normalize(b2Sub(pB, pA));
  if (joint.minLength < joint.maxLength && joint.enableLimit) {
    const pMin = b2MulAdd(pA, joint.minLength, axis);
    const pMax = b2MulAdd(pA, joint.maxLength, axis);
    const offset = b2MulSV(0.05 * b2_lengthUnitsPerMeter2, b2RightPerp(axis));
    if (joint.minLength > b2_linearSlop) {
      draw.DrawSegment(b2Sub(pMin, offset), b2Add(pMin, offset), b2HexColor.b2_colorLightGreen, draw.context);
    }
    if (joint.maxLength < B2_HUGE) {
      draw.DrawSegment(b2Sub(pMax, offset), b2Add(pMax, offset), b2HexColor.b2_colorRed, draw.context);
    }
    if (joint.minLength > b2_linearSlop && joint.maxLength < B2_HUGE) {
      draw.DrawSegment(pMin, pMax, b2HexColor.b2_colorGray, draw.context);
    }
  }
  draw.DrawSegment(pA, pB, b2HexColor.b2_colorWhite, draw.context);
  draw.DrawPoint(pA.x, pA.y, 4, b2HexColor.b2_colorWhite, draw.context);
  draw.DrawPoint(pB.x, pB.y, 4, b2HexColor.b2_colorWhite, draw.context);
  if (joint.hertz > 0 && joint.enableSpring) {
    const pRest = b2MulAdd(pA, joint.length, axis);
    draw.DrawPoint(pRest.x, pRest.y, 4, b2HexColor.b2_colorBlue, draw.context);
  }
}

// src/prismatic_joint_c.js
function b2PrismaticJoint_EnableSpring(jointId, enableSpring) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  if (enableSpring !== joint.prismaticJoint.enableSpring) {
    joint.prismaticJoint.enableSpring = enableSpring;
    joint.prismaticJoint.springImpulse = 0;
  }
}
function b2PrismaticJoint_IsSpringEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.enableSpring;
}
function b2PrismaticJoint_SetSpringHertz(jointId, hertz) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  joint.prismaticJoint.hertz = hertz;
}
function b2PrismaticJoint_GetSpringHertz(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.hertz;
}
function b2PrismaticJoint_SetSpringDampingRatio(jointId, dampingRatio) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  joint.prismaticJoint.dampingRatio = dampingRatio;
}
function b2PrismaticJoint_GetSpringDampingRatio(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.dampingRatio;
}
function b2PrismaticJoint_EnableLimit(jointId, enableLimit) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  if (enableLimit !== joint.prismaticJoint.enableLimit) {
    joint.prismaticJoint.enableLimit = enableLimit;
    joint.prismaticJoint.lowerImpulse = 0;
    joint.prismaticJoint.upperImpulse = 0;
  }
}
function b2PrismaticJoint_IsLimitEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.enableLimit;
}
function b2PrismaticJoint_GetLowerLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.lowerTranslation;
}
function b2PrismaticJoint_GetUpperLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.upperTranslation;
}
function b2PrismaticJoint_SetLimits(jointId, lower, upper) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  if (lower !== joint.prismaticJoint.lowerTranslation || upper !== joint.prismaticJoint.upperTranslation) {
    joint.prismaticJoint.lowerTranslation = Math.min(lower, upper);
    joint.prismaticJoint.upperTranslation = Math.max(lower, upper);
    joint.prismaticJoint.lowerImpulse = 0;
    joint.prismaticJoint.upperImpulse = 0;
  }
}
function b2PrismaticJoint_EnableMotor(jointId, enableMotor) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  if (enableMotor !== joint.prismaticJoint.enableMotor) {
    joint.prismaticJoint.enableMotor = enableMotor;
    joint.prismaticJoint.motorImpulse = 0;
  }
}
function b2PrismaticJoint_IsMotorEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.enableMotor;
}
function b2PrismaticJoint_SetMotorSpeed(jointId, motorSpeed) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  joint.prismaticJoint.motorSpeed = motorSpeed;
}
function b2PrismaticJoint_GetMotorSpeed(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.motorSpeed;
}
function b2PrismaticJoint_GetMotorForce(jointId) {
  const world = b2GetWorld(jointId.world0);
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return world.inv_h * base.prismaticJoint.motorImpulse;
}
function b2PrismaticJoint_SetMaxMotorForce(jointId, force) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  joint.prismaticJoint.maxMotorForce = force;
}
function b2PrismaticJoint_GetMaxMotorForce(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_prismaticJoint);
  return joint.prismaticJoint.maxMotorForce;
}
function b2GetPrismaticJointForce(world, base) {
  const idA = base.bodyIdA;
  const transformA = b2GetBodyTransform(world, idA);
  const joint = base.prismaticJoint;
  const axisA = b2RotateVector(transformA.q, joint.localAxisA);
  const perpA = b2LeftPerp(axisA);
  const inv_h = world.inv_h;
  const perpForce = inv_h * joint.impulse.x;
  const axialForce = inv_h * (joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse);
  const force = b2Add(b2MulSV(perpForce, perpA), b2MulSV(axialForce, axisA));
  return force;
}
function b2GetPrismaticJointTorque(world, base) {
  return world.inv_h * base.prismaticJoint.impulse.y;
}
function b2PreparePrismaticJoint(base, context) {
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexA = bodyA.localIndex;
  const localIndexB = bodyB.localIndex;
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.prismaticJoint;
  joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  const qA = bodySimA.transform.q;
  const qB = bodySimB.transform.q;
  joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.axisA = b2RotateVector(qA, joint.localAxisA);
  joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
  joint.deltaAngle = b2RelativeAngle(qB, qA) - joint.referenceAngle;
  const rA = joint.anchorA;
  const rB = joint.anchorB;
  const d = b2Add(joint.deltaCenter, b2Sub(rB, rA));
  const a1 = b2Cross(b2Add(d, rA), joint.axisA);
  const a2 = b2Cross(rB, joint.axisA);
  const k = mA + mB + iA * a1 * a1 + iB * a2 * a2;
  joint.axialMass = k > 0 ? 1 / k : 0;
  joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);
  if (context.enableWarmStarting == false) {
    joint.impulse = new b2Vec2(0, 0);
    joint.springImpulse = 0;
    joint.motorImpulse = 0;
    joint.lowerImpulse = 0;
    joint.upperImpulse = 0;
  }
}
function b2WarmStartPrismaticJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.prismaticJoint;
  const stateA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
  const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
  const a1 = b2Cross(b2Add(d, rA), axisA);
  const a2 = b2Cross(rB, axisA);
  const axialImpulse = joint.springImpulse + joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse;
  const perpA = b2LeftPerp(axisA);
  const s1 = b2Cross(b2Add(d, rA), perpA);
  const s2 = b2Cross(rB, perpA);
  const perpImpulse = joint.impulse.x;
  const angleImpulse = joint.impulse.y;
  const P = b2Add(b2MulSV(axialImpulse, axisA), b2MulSV(perpImpulse, perpA));
  const LA = axialImpulse * a1 + perpImpulse * s1 + angleImpulse;
  const LB = axialImpulse * a2 + perpImpulse * s2 + angleImpulse;
  stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
  stateA.angularVelocity -= iA * LA;
  stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
  stateB.angularVelocity += iB * LB;
}
function b2SolvePrismaticJoint(base, context, useBias) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.prismaticJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = stateA.linearVelocity;
  let wA = stateA.angularVelocity;
  let vB = stateB.linearVelocity;
  let wB = stateB.angularVelocity;
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
  const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
  const translation = b2Dot(axisA, d);
  const a1 = b2Cross(b2Add(d, rA), axisA);
  const a2 = b2Cross(rB, axisA);
  if (joint.enableSpring) {
    const C = translation;
    const bias = joint.springSoftness.biasRate * C;
    const massScale = joint.springSoftness.massScale;
    const impulseScale = joint.springSoftness.impulseScale;
    const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
    const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.springImpulse;
    joint.springImpulse += impulse;
    const P = b2MulSV(impulse, axisA);
    const LA = impulse * a1;
    const LB = impulse * a2;
    vA = b2MulSub(vA, mA, P);
    wA -= iA * LA;
    vB = b2MulAdd(vB, mB, P);
    wB += iB * LB;
  }
  if (joint.enableMotor) {
    const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
    let impulse = joint.axialMass * (joint.motorSpeed - Cdot);
    const oldImpulse = joint.motorImpulse;
    const maxImpulse = context.h * joint.maxMotorForce;
    joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
    impulse = joint.motorImpulse - oldImpulse;
    const P = b2MulSV(impulse, axisA);
    const LA = impulse * a1;
    const LB = impulse * a2;
    vA = b2MulSub(vA, mA, P);
    wA -= iA * LA;
    vB = b2MulAdd(vB, mB, P);
    wB += iB * LB;
  }
  if (joint.enableLimit) {
    {
      const C = translation - joint.lowerTranslation;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const oldImpulse = joint.lowerImpulse;
      const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
      let impulse = -joint.axialMass * massScale * (Cdot + bias) - impulseScale * oldImpulse;
      joint.lowerImpulse = Math.max(oldImpulse + impulse, 0);
      impulse = joint.lowerImpulse - oldImpulse;
      const P = b2MulSV(impulse, axisA);
      const LA = impulse * a1;
      const LB = impulse * a2;
      vA = b2MulSub(vA, mA, P);
      wA -= iA * LA;
      vB = b2MulAdd(vB, mB, P);
      wB += iB * LB;
    }
    {
      const C = joint.upperTranslation - translation;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const oldImpulse = joint.upperImpulse;
      const Cdot = b2Dot(axisA, b2Sub(vA, vB)) + a1 * wA - a2 * wB;
      let impulse = -joint.axialMass * massScale * (Cdot + bias) - impulseScale * oldImpulse;
      joint.upperImpulse = Math.max(oldImpulse + impulse, 0);
      impulse = joint.upperImpulse - oldImpulse;
      const P = b2MulSV(impulse, axisA);
      const LA = impulse * a1;
      const LB = impulse * a2;
      vA = b2MulAdd(vA, mA, P);
      wA += iA * LA;
      vB = b2MulSub(vB, mB, P);
      wB -= iB * LB;
    }
  }
  {
    const perpA = b2LeftPerp(axisA);
    const s1 = b2Cross(b2Add(d, rA), perpA);
    const s2 = b2Cross(rB, perpA);
    const Cdot = new b2Vec2(b2Dot(perpA, b2Sub(vB, vA)) + s2 * wB - s1 * wA, wB - wA);
    let bias = new b2Vec2();
    let massScale = 1;
    let impulseScale = 0;
    if (useBias) {
      const C = new b2Vec2(b2Dot(perpA, d), b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle);
      bias = b2MulSV(context.jointSoftness.biasRate, C);
      massScale = context.jointSoftness.massScale;
      impulseScale = context.jointSoftness.impulseScale;
    }
    const k11 = mA + mB + iA * s1 * s1 + iB * s2 * s2;
    const k12 = iA * s1 + iB * s2;
    let k22 = iA + iB;
    if (k22 === 0) {
      k22 = 1;
    }
    const K = new b2Mat22(new b2Vec2(k11, k12), new b2Vec2(k12, k22));
    const b = b2Solve22(K, b2Add(Cdot, bias));
    const impulse = new b2Vec2(-massScale * b.x - impulseScale * joint.impulse.x, -massScale * b.y - impulseScale * joint.impulse.y);
    joint.impulse.x += impulse.x;
    joint.impulse.y += impulse.y;
    const P = b2MulSV(impulse.x, perpA);
    const LA = impulse.x * s1 + impulse.y;
    const LB = impulse.x * s2 + impulse.y;
    vA = b2MulSub(vA, mA, P);
    wA -= iA * LA;
    vB = b2MulAdd(vB, mB, P);
    wB += iB * LB;
  }
  stateA.linearVelocity = vA;
  stateA.angularVelocity = wA;
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}
function b2DrawPrismaticJoint(draw, base, transformA, transformB) {
  const joint = base.prismaticJoint;
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const axis = b2RotateVector(transformA.q, joint.localAxisA);
  const c1 = b2HexColor.b2_colorGray7;
  const c2 = b2HexColor.b2_colorGreen;
  const c3 = b2HexColor.b2_colorRed;
  const c4 = b2HexColor.b2_colorBlue;
  const c5 = b2HexColor.b2_colorGray4;
  draw.DrawSegment(pA, pB, c5, draw.context);
  if (joint.enableLimit) {
    const lower = b2MulAdd(pA, joint.lowerTranslation, axis);
    const upper = b2MulAdd(pA, joint.upperTranslation, axis);
    const perp = b2LeftPerp(axis);
    draw.DrawSegment(lower, upper, c1, draw.context);
    draw.DrawSegment(b2MulSub(lower, 0.1, perp), b2MulAdd(lower, 0.1, perp), c2, draw.context);
    draw.DrawSegment(b2MulSub(upper, 0.1, perp), b2MulAdd(upper, 0.1, perp), c3, draw.context);
  } else {
    draw.DrawSegment(b2MulSub(pA, 1, axis), b2MulAdd(pA, 1, axis), c1, draw.context);
  }
  draw.DrawPoint(pA.x, pA.y, 5, c1, draw.context);
  draw.DrawPoint(pB.x, pB.y, 5, c4, draw.context);
}

// src/revolute_joint_c.js
function b2RevoluteJoint_EnableSpring(jointId, enableSpring) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  if (enableSpring !== joint.revoluteJoint.enableSpring) {
    joint.revoluteJoint.enableSpring = enableSpring;
    joint.revoluteJoint.springImpulse = 0;
  }
}
function b2RevoluteJoint_IsSpringEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.enableSpring;
}
function b2RevoluteJoint_SetSpringHertz(jointId, hertz) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  joint.revoluteJoint.hertz = hertz;
}
function b2RevoluteJoint_GetSpringHertz(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.hertz;
}
function b2RevoluteJoint_SetSpringDampingRatio(jointId, dampingRatio) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  joint.revoluteJoint.dampingRatio = dampingRatio;
}
function b2RevoluteJoint_GetSpringDampingRatio(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.dampingRatio;
}
function b2RevoluteJoint_GetAngle(jointId) {
  const world = b2GetWorld(jointId.world0);
  const jointSim = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  const transformA = b2GetBodyTransform(world, jointSim.bodyIdA);
  const transformB = b2GetBodyTransform(world, jointSim.bodyIdB);
  let angle = b2RelativeAngle(transformB.q, transformA.q) - jointSim.revoluteJoint.referenceAngle;
  angle = b2UnwindAngle(angle);
  return angle;
}
function b2RevoluteJoint_EnableLimit(jointId, enableLimit) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  if (enableLimit !== joint.revoluteJoint.enableLimit) {
    joint.revoluteJoint.enableLimit = enableLimit;
    joint.revoluteJoint.lowerImpulse = 0;
    joint.revoluteJoint.upperImpulse = 0;
  }
}
function b2RevoluteJoint_IsLimitEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.enableLimit;
}
function b2RevoluteJoint_GetLowerLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.lowerAngle;
}
function b2RevoluteJoint_GetUpperLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.upperAngle;
}
function b2RevoluteJoint_SetLimits(jointId, lower, upper) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  if (lower !== joint.revoluteJoint.lowerAngle || upper !== joint.revoluteJoint.upperAngle) {
    joint.revoluteJoint.lowerAngle = Math.min(lower, upper);
    joint.revoluteJoint.upperAngle = Math.max(lower, upper);
    joint.revoluteJoint.lowerImpulse = 0;
    joint.revoluteJoint.upperImpulse = 0;
  }
}
function b2RevoluteJoint_EnableMotor(jointId, enableMotor) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  if (enableMotor !== joint.revoluteJoint.enableMotor) {
    joint.revoluteJoint.enableMotor = enableMotor;
    joint.revoluteJoint.motorImpulse = 0;
  }
}
function b2RevoluteJoint_IsMotorEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.enableMotor;
}
function b2RevoluteJoint_SetMotorSpeed(jointId, motorSpeed) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  joint.revoluteJoint.motorSpeed = motorSpeed;
}
function b2RevoluteJoint_GetMotorSpeed(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.motorSpeed;
}
function b2RevoluteJoint_GetMotorTorque(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return world.inv_h * joint.revoluteJoint.motorImpulse;
}
function b2RevoluteJoint_SetMaxMotorTorque(jointId, torque) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  joint.revoluteJoint.maxMotorTorque = torque;
}
function b2RevoluteJoint_GetMaxMotorTorque(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_revoluteJoint);
  return joint.revoluteJoint.maxMotorTorque;
}
function b2GetRevoluteJointForce(world, base) {
  const force = b2MulSV(world.inv_h, base.revoluteJoint.linearImpulse);
  return force;
}
function b2GetRevoluteJointTorque(world, base) {
  const revolute = base.revoluteJoint;
  const torque = world.inv_h * (revolute.motorImpulse + revolute.lowerImpulse - revolute.upperImpulse);
  return torque;
}
function b2PrepareRevoluteJoint(base, context) {
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexA = bodyA.localIndex;
  const localIndexB = bodyB.localIndex;
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.revoluteJoint;
  joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
  joint.deltaAngle = b2RelativeAngle(bodySimB.transform.q, bodySimA.transform.q) - joint.referenceAngle;
  joint.deltaAngle = b2UnwindAngle(joint.deltaAngle);
  const k = iA + iB;
  joint.axialMass = k > 0 ? 1 / k : 0;
  joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);
  if (context.enableWarmStarting === false) {
    joint.linearImpulse = new b2Vec2(0, 0);
    joint.springImpulse = 0;
    joint.motorImpulse = 0;
    joint.lowerImpulse = 0;
    joint.upperImpulse = 0;
  }
}
function b2WarmStartRevoluteJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.revoluteJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const axialImpulse = joint.springImpulse + joint.motorImpulse + joint.lowerImpulse - joint.upperImpulse;
  stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, joint.linearImpulse);
  stateA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + axialImpulse);
  stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, joint.linearImpulse);
  stateB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + axialImpulse);
}
function b2SolveRevoluteJoint(base, context, useBias) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.revoluteJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = stateA.linearVelocity.clone();
  let wA = stateA.angularVelocity;
  let vB = stateB.linearVelocity.clone();
  let wB = stateB.angularVelocity;
  const fixedRotation = iA + iB === 0;
  if (joint.enableSpring && fixedRotation === false) {
    const C = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
    const bias = joint.springSoftness.biasRate * C;
    const massScale = joint.springSoftness.massScale;
    const impulseScale = joint.springSoftness.impulseScale;
    const Cdot = wB - wA;
    const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.springImpulse;
    joint.springImpulse += impulse;
    wA -= iA * impulse;
    wB += iB * impulse;
  }
  if (joint.enableMotor && fixedRotation === false) {
    const Cdot = wB - wA - joint.motorSpeed;
    let impulse = -joint.axialMass * Cdot;
    const oldImpulse = joint.motorImpulse;
    const maxImpulse = context.h * joint.maxMotorTorque;
    joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
    impulse = joint.motorImpulse - oldImpulse;
    wA -= iA * impulse;
    wB += iB * impulse;
  }
  if (joint.enableLimit && fixedRotation === false) {
    let jointAngle = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
    jointAngle = b2UnwindAngle(jointAngle);
    {
      const C = jointAngle - joint.lowerAngle;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const Cdot = wB - wA;
      let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
      const oldImpulse = joint.lowerImpulse;
      joint.lowerImpulse = Math.max(joint.lowerImpulse + impulse, 0);
      impulse = joint.lowerImpulse - oldImpulse;
      wA -= iA * impulse;
      wB += iB * impulse;
    }
    {
      const C = joint.upperAngle - jointAngle;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const Cdot = wA - wB;
      let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
      const oldImpulse = joint.upperImpulse;
      joint.upperImpulse = Math.max(joint.upperImpulse + impulse, 0);
      impulse = joint.upperImpulse - oldImpulse;
      wA += iA * impulse;
      wB -= iB * impulse;
    }
  }
  {
    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
    const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));
    let bias = new b2Vec2(0, 0);
    let massScale = 1;
    let impulseScale = 0;
    if (useBias) {
      const dcA = stateA.deltaPosition;
      const dcB = stateB.deltaPosition;
      const separation = b2Add(b2Add(b2Sub(dcB, dcA), b2Sub(rB, rA)), joint.deltaCenter);
      bias = b2MulSV(context.jointSoftness.biasRate, separation);
      massScale = context.jointSoftness.massScale;
      impulseScale = context.jointSoftness.impulseScale;
    }
    const K = {
      cx: new b2Vec2(0, 0),
      cy: new b2Vec2(0, 0)
    };
    K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
    K.cy.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
    K.cx.y = K.cy.x;
    K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
    const b = b2Solve22(K, b2Add(Cdot, bias));
    const impulse = new b2Vec2(
      -massScale * b.x - impulseScale * joint.linearImpulse.x,
      -massScale * b.y - impulseScale * joint.linearImpulse.y
    );
    joint.linearImpulse.x += impulse.x;
    joint.linearImpulse.y += impulse.y;
    vA = b2MulSub(vA, mA, impulse);
    wA -= iA * b2Cross(rA, impulse);
    vB = b2MulAdd(vB, mB, impulse);
    wB += iB * b2Cross(rB, impulse);
  }
  stateA.linearVelocity = vA;
  stateA.angularVelocity = wA;
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}
function b2DrawRevoluteJoint(draw, base, transformA, transformB, drawSize) {
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const c1 = b2HexColor.b2_colorRed;
  const L = drawSize;
  draw.DrawCircle(pB, L, c1, draw.context);
  const angle = b2RelativeAngle(transformB.q, transformA.q);
  const r = new b2Vec2(L * Math.cos(angle), L * Math.sin(angle));
  const pC = b2Add(pB, r);
  draw.DrawSegment(pB, pC, c1, draw.context);
  const color = b2HexColor.b2_colorGold;
  draw.DrawSegment(transformA.p, pA, color, draw.context);
  draw.DrawSegment(pA, pB, color, draw.context);
  draw.DrawSegment(transformB.p, pB, color, draw.context);
}

// src/wheel_joint_c.js
function b2WheelJoint_EnableSpring(jointId, enableSpring) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  if (enableSpring !== joint.wheelJoint.enableSpring) {
    joint.wheelJoint.enableSpring = enableSpring;
    joint.wheelJoint.springImpulse = 0;
  }
}
function b2WheelJoint_IsSpringEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.enableSpring;
}
function b2WheelJoint_SetSpringHertz(jointId, hertz) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  joint.wheelJoint.hertz = hertz;
}
function b2WheelJoint_GetSpringHertz(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.hertz;
}
function b2WheelJoint_SetSpringDampingRatio(jointId, dampingRatio) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  joint.wheelJoint.dampingRatio = dampingRatio;
}
function b2WheelJoint_GetSpringDampingRatio(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.dampingRatio;
}
function b2WheelJoint_EnableLimit(jointId, enableLimit) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  if (joint.wheelJoint.enableLimit !== enableLimit) {
    joint.wheelJoint.lowerImpulse = 0;
    joint.wheelJoint.upperImpulse = 0;
    joint.wheelJoint.enableLimit = enableLimit;
  }
}
function b2WheelJoint_IsLimitEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.enableLimit;
}
function b2WheelJoint_GetLowerLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.lowerTranslation;
}
function b2WheelJoint_GetUpperLimit(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.upperTranslation;
}
function b2WheelJoint_SetLimits(jointId, lower, upper) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  if (lower !== joint.wheelJoint.lowerTranslation || upper !== joint.wheelJoint.upperTranslation) {
    joint.wheelJoint.lowerTranslation = Math.min(lower, upper);
    joint.wheelJoint.upperTranslation = Math.max(lower, upper);
    joint.wheelJoint.lowerImpulse = 0;
    joint.wheelJoint.upperImpulse = 0;
  }
}
function b2WheelJoint_EnableMotor(jointId, enableMotor) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  if (joint.wheelJoint.enableMotor !== enableMotor) {
    joint.wheelJoint.motorImpulse = 0;
    joint.wheelJoint.enableMotor = enableMotor;
  }
}
function b2WheelJoint_IsMotorEnabled(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.enableMotor;
}
function b2WheelJoint_SetMotorSpeed(jointId, motorSpeed) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  joint.wheelJoint.motorSpeed = motorSpeed;
}
function b2WheelJoint_GetMotorSpeed(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.motorSpeed;
}
function b2WheelJoint_GetMotorTorque(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return world.inv_h * joint.wheelJoint.motorImpulse;
}
function b2WheelJoint_SetMaxMotorTorque(jointId, torque) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  joint.wheelJoint.maxMotorTorque = torque;
}
function b2WheelJoint_GetMaxMotorTorque(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_wheelJoint);
  return joint.wheelJoint.maxMotorTorque;
}
function b2GetWheelJointForce(world, base) {
  const joint = base.wheelJoint;
  const axisA = joint.axisA;
  const perpA = b2LeftPerp(axisA);
  const perpForce = world.inv_h * joint.perpImpulse;
  const axialForce = world.inv_h * (joint.springImpulse + joint.lowerImpulse - joint.upperImpulse);
  const force = b2Add(b2MulSV(perpForce, perpA), b2MulSV(axialForce, axisA));
  return force;
}
function b2GetWheelJointTorque(world, base) {
  return world.inv_h * base.wheelJoint.motorImpulse;
}
function b2PrepareWheelJoint(base, context) {
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexA = bodyA.localIndex;
  const localIndexB = bodyB.localIndex;
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.wheelJoint;
  joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  const qA = bodySimA.transform.q;
  const qB = bodySimB.transform.q;
  joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.axisA = b2RotateVector(qA, joint.localAxisA);
  joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
  const rA = joint.anchorA;
  const rB = joint.anchorB;
  const d = b2Add(joint.deltaCenter, b2Sub(rB, rA));
  const axisA = joint.axisA;
  const perpA = b2LeftPerp(axisA);
  const s1 = b2Cross(b2Add(d, rA), perpA);
  const s2 = b2Cross(rB, perpA);
  const kp = mA + mB + iA * s1 * s1 + iB * s2 * s2;
  joint.perpMass = kp > 0 ? 1 / kp : 0;
  const a1 = b2Cross(b2Add(d, rA), axisA);
  const a2 = b2Cross(rB, axisA);
  const ka = mA + mB + iA * a1 * a1 + iB * a2 * a2;
  joint.axialMass = ka > 0 ? 1 / ka : 0;
  joint.springSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);
  const km = iA + iB;
  joint.motorMass = km > 0 ? 1 / km : 0;
  if (context.enableWarmStarting == false) {
    joint.perpImpulse = 0;
    joint.springImpulse = 0;
    joint.motorImpulse = 0;
    joint.lowerImpulse = 0;
    joint.upperImpulse = 0;
  }
}
function b2WarmStartWheelJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.wheelJoint;
  const stateA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
  const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
  const perpA = b2LeftPerp(axisA);
  const a1 = b2Cross(b2Add(d, rA), axisA);
  const a2 = b2Cross(rB, axisA);
  const s1 = b2Cross(b2Add(d, rA), perpA);
  const s2 = b2Cross(rB, perpA);
  const axialImpulse = joint.springImpulse + joint.lowerImpulse - joint.upperImpulse;
  const P = b2Add(b2MulSV(axialImpulse, axisA), b2MulSV(joint.perpImpulse, perpA));
  const LA = axialImpulse * a1 + joint.perpImpulse * s1 + joint.motorImpulse;
  const LB = axialImpulse * a2 + joint.perpImpulse * s2 + joint.motorImpulse;
  stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, P);
  stateA.angularVelocity -= iA * LA;
  stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, P);
  stateB.angularVelocity += iB * LB;
}
function b2SolveWheelJoint(base, context, useBias) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.wheelJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = stateA.linearVelocity;
  let wA = stateA.angularVelocity;
  let vB = stateB.linearVelocity;
  let wB = stateB.angularVelocity;
  const fixedRotation = iA + iB === 0;
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  const d = b2Add(b2Add(b2Sub(stateB.deltaPosition, stateA.deltaPosition), joint.deltaCenter), b2Sub(rB, rA));
  const axisA = b2RotateVector(stateA.deltaRotation, joint.axisA);
  const translation = b2Dot(axisA, d);
  const a1 = b2Cross(b2Add(d, rA), axisA);
  const a2 = b2Cross(rB, axisA);
  if (joint.enableMotor && fixedRotation === false) {
    const Cdot = wB - wA - joint.motorSpeed;
    let impulse = -joint.motorMass * Cdot;
    const oldImpulse = joint.motorImpulse;
    const maxImpulse = context.h * joint.maxMotorTorque;
    joint.motorImpulse = b2ClampFloat(joint.motorImpulse + impulse, -maxImpulse, maxImpulse);
    impulse = joint.motorImpulse - oldImpulse;
    wA -= iA * impulse;
    wB += iB * impulse;
  }
  if (joint.enableSpring) {
    const C = translation;
    const bias = joint.springSoftness.biasRate * C;
    const massScale = joint.springSoftness.massScale;
    const impulseScale = joint.springSoftness.impulseScale;
    const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
    const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.springImpulse;
    joint.springImpulse += impulse;
    const P = b2MulSV(impulse, axisA);
    const LA = impulse * a1;
    const LB = impulse * a2;
    vA = b2MulSub(vA, mA, P);
    wA -= iA * LA;
    vB = b2MulAdd(vB, mB, P);
    wB += iB * LB;
  }
  if (joint.enableLimit) {
    const translation2 = b2Dot(axisA, d);
    {
      const C = translation2 - joint.lowerTranslation;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const Cdot = b2Dot(axisA, b2Sub(vB, vA)) + a2 * wB - a1 * wA;
      let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.lowerImpulse;
      const oldImpulse = joint.lowerImpulse;
      joint.lowerImpulse = Math.max(oldImpulse + impulse, 0);
      impulse = joint.lowerImpulse - oldImpulse;
      const P = b2MulSV(impulse, axisA);
      const LA = impulse * a1;
      const LB = impulse * a2;
      vA = b2MulSub(vA, mA, P);
      wA -= iA * LA;
      vB = b2MulAdd(vB, mB, P);
      wB += iB * LB;
    }
    {
      const C = joint.upperTranslation - translation2;
      let bias = 0;
      let massScale = 1;
      let impulseScale = 0;
      if (C > 0) {
        bias = C * context.inv_h;
      } else if (useBias) {
        bias = context.jointSoftness.biasRate * C;
        massScale = context.jointSoftness.massScale;
        impulseScale = context.jointSoftness.impulseScale;
      }
      const Cdot = b2Dot(axisA, b2Sub(vA, vB)) + a1 * wA - a2 * wB;
      let impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.upperImpulse;
      const oldImpulse = joint.upperImpulse;
      joint.upperImpulse = Math.max(oldImpulse + impulse, 0);
      impulse = joint.upperImpulse - oldImpulse;
      const P = b2MulSV(impulse, axisA);
      const LA = impulse * a1;
      const LB = impulse * a2;
      vA = b2MulAdd(vA, mA, P);
      wA += iA * LA;
      vB = b2MulSub(vB, mB, P);
      wB -= iB * LB;
    }
  }
  {
    const perpA = b2LeftPerp(axisA);
    let bias = 0;
    let massScale = 1;
    let impulseScale = 0;
    if (useBias) {
      const C = b2Dot(perpA, d);
      bias = context.jointSoftness.biasRate * C;
      massScale = context.jointSoftness.massScale;
      impulseScale = context.jointSoftness.impulseScale;
    }
    const s1 = b2Cross(b2Add(d, rA), perpA);
    const s2 = b2Cross(rB, perpA);
    const Cdot = b2Dot(perpA, b2Sub(vB, vA)) + s2 * wB - s1 * wA;
    const impulse = -massScale * joint.perpMass * (Cdot + bias) - impulseScale * joint.perpImpulse;
    joint.perpImpulse += impulse;
    const P = b2MulSV(impulse, perpA);
    const LA = impulse * s1;
    const LB = impulse * s2;
    vA = b2MulSub(vA, mA, P);
    wA -= iA * LA;
    vB = b2MulAdd(vB, mB, P);
    wB += iB * LB;
  }
  stateA.linearVelocity = vA;
  stateA.angularVelocity = wA;
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}
function b2DrawWheelJoint(draw, base, transformA, transformB) {
  const joint = base.wheelJoint;
  const pA = b2TransformPoint(transformA, base.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, base.localOriginAnchorB);
  const axis = b2RotateVector(transformA.q, joint.localAxisA);
  const c1 = b2HexColor.b2_colorGray7;
  const c2 = b2HexColor.b2_colorGreen;
  const c3 = b2HexColor.b2_colorRed;
  const c4 = b2HexColor.b2_colorGray4;
  const c5 = b2HexColor.b2_colorBlue;
  draw.DrawSegment(pA, pB, c5, draw.context);
  if (joint.enableLimit) {
    const lower = b2MulAdd(pA, joint.lowerTranslation, axis);
    const upper = b2MulAdd(pA, joint.upperTranslation, axis);
    const perp = b2LeftPerp(axis);
    draw.DrawSegment(lower, upper, c1, draw.context);
    draw.DrawSegment(b2MulSub(lower, 0.1, perp), b2MulAdd(lower, 0.1, perp), c2, draw.context);
    draw.DrawSegment(b2MulSub(upper, 0.1, perp), b2MulAdd(upper, 0.1, perp), c3, draw.context);
  } else {
    draw.DrawSegment(b2MulSub(pA, 1, axis), b2MulAdd(pA, 1, axis), c1, draw.context);
  }
  draw.DrawPoint(pA.x, pA.y, 5, c1, draw.context);
  draw.DrawPoint(pB.x, pB.y, 5, c4, draw.context);
}

// src/motor_joint_c.js
function b2MotorJoint_SetLinearOffset(jointId, linearOffset) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  joint.motorJoint.linearOffset = linearOffset;
}
function b2MotorJoint_GetLinearOffset(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  return joint.motorJoint.linearOffset;
}
function b2MotorJoint_SetAngularOffset(jointId, angularOffset) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  joint.motorJoint.angularOffset = b2ClampFloat(angularOffset, -B2_PI, B2_PI);
}
function b2MotorJoint_GetAngularOffset(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  return joint.motorJoint.angularOffset;
}
function b2MotorJoint_SetMaxForce(jointId, maxForce) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  joint.motorJoint.maxForce = Math.max(0, maxForce);
}
function b2MotorJoint_GetMaxForce(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  return joint.motorJoint.maxForce;
}
function b2MotorJoint_SetMaxTorque(jointId, maxTorque) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  joint.motorJoint.maxTorque = Math.max(0, maxTorque);
}
function b2MotorJoint_GetMaxTorque(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  return joint.motorJoint.maxTorque;
}
function b2MotorJoint_SetCorrectionFactor(jointId, correctionFactor) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  joint.motorJoint.correctionFactor = b2ClampFloat(correctionFactor, 0, 1);
}
function b2MotorJoint_GetCorrectionFactor(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_motorJoint);
  return joint.motorJoint.correctionFactor;
}
function b2GetMotorJointForce(world, base) {
  const force = b2MulSV(world.inv_h, base.motorJoint.linearImpulse);
  return force;
}
function b2GetMotorJointTorque(world, base) {
  return world.inv_h * base.motorJoint.angularImpulse;
}
function b2PrepareMotorJoint(base, context) {
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexA = bodyA.localIndex;
  const localIndexB = bodyB.localIndex;
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.motorJoint;
  joint.indexA = bodyA.setIndex == b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex == b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  joint.anchorA = b2RotateVector(bodySimA.transform.q, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.deltaCenter = b2Sub(b2Sub(bodySimB.center, bodySimA.center), joint.linearOffset);
  joint.deltaAngle = b2RelativeAngle(bodySimB.transform.q, bodySimA.transform.q) - joint.angularOffset;
  joint.deltaAngle = b2UnwindAngle(joint.deltaAngle);
  const rA = joint.anchorA;
  const rB = joint.anchorB;
  const K = {
    cx: new b2Vec2(0, 0),
    cy: new b2Vec2(0, 0)
  };
  K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
  K.cx.y = -rA.y * rA.x * iA - rB.y * rB.x * iB;
  K.cy.x = K.cx.y;
  K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
  joint.linearMass = b2GetInverse22(K);
  const ka = iA + iB;
  joint.angularMass = ka > 0 ? 1 / ka : 0;
  if (context.enableWarmStarting == false) {
    joint.linearImpulse = new b2Vec2(0, 0);
    joint.angularImpulse = 0;
  }
}
function b2WarmStartMotorJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const joint = base.motorJoint;
  const dummyState = new b2BodyState();
  const bodyA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const bodyB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(bodyA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(bodyB.deltaRotation, joint.anchorB);
  bodyA.linearVelocity = b2MulSub(bodyA.linearVelocity, mA, joint.linearImpulse);
  bodyA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + joint.angularImpulse);
  bodyB.linearVelocity = b2MulAdd(bodyB.linearVelocity, mB, joint.linearImpulse);
  bodyB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);
}
function b2SolveMotorJoint(base, context, useBias) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.motorJoint;
  const bodyA = joint.indexA == B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const bodyB = joint.indexB == B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = bodyA.linearVelocity;
  let wA = bodyA.angularVelocity;
  let vB = bodyB.linearVelocity;
  let wB = bodyB.angularVelocity;
  {
    let angularSeperation = b2RelativeAngle(bodyB.deltaRotation, bodyA.deltaRotation) + joint.deltaAngle;
    angularSeperation = b2UnwindAngle(angularSeperation);
    const angularBias = context.inv_h * joint.correctionFactor * angularSeperation;
    const Cdot = wB - wA;
    let impulse = -joint.angularMass * (Cdot + angularBias);
    const oldImpulse = joint.angularImpulse;
    const maxImpulse = context.h * joint.maxTorque;
    joint.angularImpulse = b2ClampFloat(joint.angularImpulse + impulse, -maxImpulse, maxImpulse);
    impulse = joint.angularImpulse - oldImpulse;
    wA -= iA * impulse;
    wB += iB * impulse;
  }
  {
    const rA = b2RotateVector(bodyA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(bodyB.deltaRotation, joint.anchorB);
    const ds = b2Add(b2Sub(bodyB.deltaPosition, bodyA.deltaPosition), b2Sub(rB, rA));
    const linearSeparation = b2Add(joint.deltaCenter, ds);
    const linearBias = b2MulSV(context.inv_h * joint.correctionFactor, linearSeparation);
    const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));
    const b = b2MulMV(joint.linearMass, b2Add(Cdot, linearBias));
    let impulse = new b2Vec2(-b.x, -b.y);
    const oldImpulse = joint.linearImpulse;
    const maxImpulse = context.h * joint.maxForce;
    joint.linearImpulse = b2Add(joint.linearImpulse, impulse);
    if (b2LengthSquared(joint.linearImpulse) > maxImpulse * maxImpulse) {
      joint.linearImpulse = b2Normalize(joint.linearImpulse);
      joint.linearImpulse.x *= maxImpulse;
      joint.linearImpulse.y *= maxImpulse;
    }
    impulse = b2Sub(joint.linearImpulse, oldImpulse);
    vA = b2MulSub(vA, mA, impulse);
    wA -= iA * b2Cross(rA, impulse);
    vB = b2MulAdd(vB, mB, impulse);
    wB += iB * b2Cross(rB, impulse);
  }
  bodyA.linearVelocity = vA;
  bodyA.angularVelocity = wA;
  bodyB.linearVelocity = vB;
  bodyB.angularVelocity = wB;
}

// src/mouse_joint_c.js
function b2MouseJoint_SetTarget(jointId, target) {
  b2Joint_WakeBodies(jointId);
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  base.mouseJoint.targetA = target.clone();
}
function b2MouseJoint_GetTarget(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  return base.mouseJoint.targetA;
}
function b2MouseJoint_SetSpringHertz(jointId, hertz) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  base.mouseJoint.hertz = hertz;
}
function b2MouseJoint_GetSpringHertz(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  return base.mouseJoint.hertz;
}
function b2MouseJoint_SetSpringDampingRatio(jointId, dampingRatio) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  base.mouseJoint.dampingRatio = dampingRatio;
}
function b2MouseJoint_GetSpringDampingRatio(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  return base.mouseJoint.dampingRatio;
}
function b2MouseJoint_SetMaxForce(jointId, maxForce) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  base.mouseJoint.maxForce = maxForce;
}
function b2MouseJoint_GetMaxForce(jointId) {
  const base = b2GetJointSimCheckType(jointId, b2JointType.b2_mouseJoint);
  return base.mouseJoint.maxForce;
}
function b2GetMouseJointForce(world, base) {
  const force = b2MulSV(world.inv_h, base.mouseJoint.linearImpulse);
  return force;
}
function b2GetMouseJointTorque(world, base) {
  return world.inv_h * base.mouseJoint.angularImpulse;
}
function b2PrepareMouseJoint(base, context) {
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyB = bodies[idB];
  bodyB.setIndex === b2SetType.b2_awakeSet;
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexB = bodyB.localIndex;
  const bodySimB = setB.sims.data[localIndexB];
  base.invMassB = bodySimB.invMass;
  base.invIB = bodySimB.invInertia;
  const joint = base.mouseJoint;
  joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  joint.anchorB = b2RotateVector(bodySimB.transform.q, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.linearSoftness = b2MakeSoft(joint.hertz, joint.dampingRatio, context.h);
  const angularHertz = 0.5;
  const angularDampingRatio = 0.1;
  joint.angularSoftness = b2MakeSoft(angularHertz, angularDampingRatio, context.h);
  const rB = joint.anchorB;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  const K = {
    cx: new b2Vec2(mB + iB * rB.y * rB.y, -iB * rB.x * rB.y),
    cy: new b2Vec2(-iB * rB.x * rB.y, mB + iB * rB.x * rB.x)
  };
  joint.linearMass = b2GetInverse22(K);
  joint.deltaCenter = b2Sub(bodySimB.center, joint.targetA);
  if (context.enableWarmStarting === false) {
    joint.linearImpulse = new b2Vec2(0, 0);
    joint.angularImpulse = 0;
  }
}
function b2WarmStartMouseJoint(base, context) {
  base.type === b2JointType.b2_mouseJoint;
  const mB = base.invMassB;
  const iB = base.invIB;
  const joint = base.mouseJoint;
  const stateB = context.states[joint.indexB];
  let vB = stateB.linearVelocity.clone();
  let wB = stateB.angularVelocity;
  const dqB = stateB.deltaRotation;
  const rB = b2RotateVector(dqB, joint.anchorB);
  vB = b2MulAdd(vB, mB, joint.linearImpulse);
  wB += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}
function b2SolveMouseJoint(base, context) {
  const mB = base.invMassB;
  const iB = base.invIB;
  const joint = base.mouseJoint;
  const stateB = context.states[joint.indexB];
  let vB = stateB.linearVelocity.clone();
  let wB = stateB.angularVelocity;
  {
    const massScale = joint.angularSoftness.massScale;
    const impulseScale = joint.angularSoftness.impulseScale;
    let impulseStrength = iB > 0 ? -wB / iB : 0;
    impulseStrength = massScale * impulseStrength - impulseScale * joint.angularImpulse;
    joint.angularImpulse += impulseStrength;
    wB += iB * impulseStrength;
  }
  const maxImpulse = joint.maxForce * context.h;
  {
    const dqB = stateB.deltaRotation;
    const rB = b2RotateVector(dqB, joint.anchorB);
    const Cdot = b2Add(vB, b2CrossSV(wB, rB));
    const separation = b2Add(b2Add(stateB.deltaPosition, rB), joint.deltaCenter);
    const bias = b2MulSV(joint.linearSoftness.biasRate, separation);
    const massScale = joint.linearSoftness.massScale;
    const impulseScale = joint.linearSoftness.impulseScale;
    const b = b2MulMV(joint.linearMass, b2Add(Cdot, bias));
    const impulseVector = new b2Vec2(
      -massScale * b.x - impulseScale * joint.linearImpulse.x,
      -massScale * b.y - impulseScale * joint.linearImpulse.y
    );
    const oldImpulse = joint.linearImpulse.clone();
    joint.linearImpulse.x += impulseVector.x;
    joint.linearImpulse.y += impulseVector.y;
    const mag = b2Length(joint.linearImpulse);
    if (mag > maxImpulse) {
      joint.linearImpulse = b2MulSV(maxImpulse, b2Normalize(joint.linearImpulse));
    }
    impulseVector.x = joint.linearImpulse.x - oldImpulse.x;
    impulseVector.y = joint.linearImpulse.y - oldImpulse.y;
    vB = b2MulAdd(vB, mB, impulseVector);
    wB += iB * b2Cross(rB, impulseVector);
  }
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}

// src/weld_joint_c.js
function b2WeldJoint_SetLinearHertz(jointId, hertz) {
  if (!(b2IsValid(hertz) && hertz >= 0)) {
    throw new Error("Invalid hertz value");
  }
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  joint.weldJoint.linearHertz = hertz;
}
function b2WeldJoint_GetLinearHertz(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  return joint.weldJoint.linearHertz;
}
function b2WeldJoint_SetLinearDampingRatio(jointId, dampingRatio) {
  if (!(b2IsValid(dampingRatio) && dampingRatio >= 0)) {
    throw new Error("Invalid dampingRatio value");
  }
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  joint.weldJoint.linearDampingRatio = dampingRatio;
}
function b2WeldJoint_GetLinearDampingRatio(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  return joint.weldJoint.linearDampingRatio;
}
function b2WeldJoint_SetAngularHertz(jointId, hertz) {
  if (!(b2IsValid(hertz) && hertz >= 0)) {
    throw new Error("Invalid hertz value");
  }
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  joint.weldJoint.angularHertz = hertz;
}
function b2WeldJoint_GetAngularHertz(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  return joint.weldJoint.angularHertz;
}
function b2WeldJoint_SetAngularDampingRatio(jointId, dampingRatio) {
  if (!(b2IsValid(dampingRatio) && dampingRatio >= 0)) {
    throw new Error("Invalid dampingRatio value");
  }
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  joint.weldJoint.angularDampingRatio = dampingRatio;
}
function b2WeldJoint_GetAngularDampingRatio(jointId) {
  const joint = b2GetJointSimCheckType(jointId, b2JointType.b2_weldJoint);
  return joint.weldJoint.angularDampingRatio;
}
function b2GetWeldJointForce(world, base) {
  const force = b2MulSV(world.inv_h, base.weldJoint.linearImpulse);
  return force;
}
function b2GetWeldJointTorque(world, base) {
  return world.inv_h * base.weldJoint.angularImpulse;
}
function b2PrepareWeldJoint(base, context) {
  if (base.type !== b2JointType.b2_weldJoint) {
    throw new Error("Invalid joint type");
  }
  const idA = base.bodyIdA;
  const idB = base.bodyIdB;
  const world = context.world;
  const bodies = world.bodyArray;
  const bodyA = bodies[idA];
  const bodyB = bodies[idB];
  if (!(bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet)) {
    throw new Error("At least one body must be awake");
  }
  const setA = world.solverSetArray[bodyA.setIndex];
  const setB = world.solverSetArray[bodyB.setIndex];
  const localIndexA = bodyA.localIndex;
  const localIndexB = bodyB.localIndex;
  if (!(0 <= localIndexA && localIndexA <= setA.sims.count)) {
    throw new Error("Invalid localIndexA");
  }
  if (!(0 <= localIndexB && localIndexB <= setB.sims.count)) {
    throw new Error("Invalid localIndexB");
  }
  const bodySimA = setA.sims.data[bodyA.localIndex];
  const bodySimB = setB.sims.data[bodyB.localIndex];
  const mA = bodySimA.invMass;
  const iA = bodySimA.invInertia;
  const mB = bodySimB.invMass;
  const iB = bodySimB.invInertia;
  base.invMassA = mA;
  base.invMassB = mB;
  base.invIA = iA;
  base.invIB = iB;
  const joint = base.weldJoint;
  joint.indexA = bodyA.setIndex === b2SetType.b2_awakeSet ? localIndexA : B2_NULL_INDEX;
  joint.indexB = bodyB.setIndex === b2SetType.b2_awakeSet ? localIndexB : B2_NULL_INDEX;
  const qA = bodySimA.transform.q;
  const qB = bodySimB.transform.q;
  joint.anchorA = b2RotateVector(qA, b2Sub(base.localOriginAnchorA, bodySimA.localCenter));
  joint.anchorB = b2RotateVector(qB, b2Sub(base.localOriginAnchorB, bodySimB.localCenter));
  joint.deltaCenter = b2Sub(bodySimB.center, bodySimA.center);
  joint.deltaAngle = b2RelativeAngle(qB, qA) - joint.referenceAngle;
  const ka = iA + iB;
  joint.axialMass = ka > 0 ? 1 / ka : 0;
  if (joint.linearHertz === 0) {
    joint.linearSoftness = context.jointSoftness;
  } else {
    joint.linearSoftness = b2MakeSoft(joint.linearHertz, joint.linearDampingRatio, context.h);
  }
  if (joint.angularHertz === 0) {
    joint.angularSoftness = context.jointSoftness;
  } else {
    joint.angularSoftness = b2MakeSoft(joint.angularHertz, joint.angularDampingRatio, context.h);
  }
  if (context.enableWarmStarting === false) {
    joint.linearImpulse = new b2Vec2(0, 0);
    joint.angularImpulse = 0;
  }
}
function b2WarmStartWeldJoint(base, context) {
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.weldJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
  const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
  stateA.linearVelocity = b2MulSub(stateA.linearVelocity, mA, joint.linearImpulse);
  stateA.angularVelocity -= iA * (b2Cross(rA, joint.linearImpulse) + joint.angularImpulse);
  stateB.linearVelocity = b2MulAdd(stateB.linearVelocity, mB, joint.linearImpulse);
  stateB.angularVelocity += iB * (b2Cross(rB, joint.linearImpulse) + joint.angularImpulse);
}
function b2SolveWeldJoint(base, context, useBias) {
  if (base.type !== b2JointType.b2_weldJoint) {
    throw new Error("Invalid joint type");
  }
  const mA = base.invMassA;
  const mB = base.invMassB;
  const iA = base.invIA;
  const iB = base.invIB;
  const dummyState = new b2BodyState();
  const joint = base.weldJoint;
  const stateA = joint.indexA === B2_NULL_INDEX ? dummyState : context.states[joint.indexA];
  const stateB = joint.indexB === B2_NULL_INDEX ? dummyState : context.states[joint.indexB];
  let vA = stateA.linearVelocity;
  let wA = stateA.angularVelocity;
  let vB = stateB.linearVelocity;
  let wB = stateB.angularVelocity;
  {
    let bias = 0;
    let massScale = 1;
    let impulseScale = 0;
    if (useBias || joint.angularHertz > 0) {
      const C = b2RelativeAngle(stateB.deltaRotation, stateA.deltaRotation) + joint.deltaAngle;
      bias = joint.angularSoftness.biasRate * C;
      massScale = joint.angularSoftness.massScale;
      impulseScale = joint.angularSoftness.impulseScale;
    }
    const Cdot = wB - wA;
    const impulse = -massScale * joint.axialMass * (Cdot + bias) - impulseScale * joint.angularImpulse;
    joint.angularImpulse += impulse;
    wA -= iA * impulse;
    wB += iB * impulse;
  }
  {
    const rA = b2RotateVector(stateA.deltaRotation, joint.anchorA);
    const rB = b2RotateVector(stateB.deltaRotation, joint.anchorB);
    let bias = new b2Vec2(0, 0);
    let massScale = 1;
    let impulseScale = 0;
    if (useBias || joint.linearHertz > 0) {
      const dcA = stateA.deltaPosition;
      const dcB = stateB.deltaPosition;
      const C = b2Add(b2Add(b2Sub(dcB, dcA), b2Sub(rB, rA)), joint.deltaCenter);
      bias = b2MulSV(joint.linearSoftness.biasRate, C);
      massScale = joint.linearSoftness.massScale;
      impulseScale = joint.linearSoftness.impulseScale;
    }
    const Cdot = b2Sub(b2Add(vB, b2CrossSV(wB, rB)), b2Add(vA, b2CrossSV(wA, rA)));
    const K = new b2Mat22();
    K.cx.x = mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB;
    K.cy.x = -rA.y * rA.x * iA - rB.y * rB.x * iB;
    K.cx.y = K.cy.x;
    K.cy.y = mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB;
    const b = b2Solve22(K, b2Add(Cdot, bias));
    const impulse = new b2Vec2(
      -massScale * b.x - impulseScale * joint.linearImpulse.x,
      -massScale * b.y - impulseScale * joint.linearImpulse.y
    );
    joint.linearImpulse = b2Add(joint.linearImpulse, impulse);
    vA = b2MulSub(vA, mA, impulse);
    wA -= iA * b2Cross(rA, impulse);
    vB = b2MulAdd(vB, mB, impulse);
    wB += iB * b2Cross(rB, impulse);
  }
  stateA.linearVelocity = vA;
  stateA.angularVelocity = wA;
  stateB.linearVelocity = vB;
  stateB.angularVelocity = wB;
}

// src/joint_c.js
function b2DefaultDistanceJointDef() {
  const def = new b2DistanceJointDef();
  def.length = 1;
  def.maxLength = B2_HUGE;
  return def;
}
function b2DefaultMotorJointDef() {
  const def = new b2MotorJointDef();
  def.maxForce = 1;
  def.maxTorque = 1;
  def.correctionFactor = 0.3;
  return def;
}
function b2DefaultMouseJointDef() {
  const def = new b2MouseJointDef();
  def.hertz = 4;
  def.dampingRatio = 1;
  def.maxForce = 1;
  return def;
}
function b2DefaultPrismaticJointDef() {
  const def = new b2PrismaticJointDef();
  def.localAxisA = new b2Vec2(1, 0);
  return def;
}
function b2DefaultRevoluteJointDef() {
  const def = new b2RevoluteJointDef();
  def.drawSize = 0.25;
  return def;
}
function b2DefaultWeldJointDef() {
  return new b2WeldJointDef();
}
function b2DefaultWheelJointDef() {
  const def = new b2WheelJointDef();
  def.localAxisA = new b2Vec2(0, 1);
  def.enableSpring = true;
  def.hertz = 1;
  def.dampingRatio = 0.7;
  return def;
}
function b2GetJointFullId(world, jointId) {
  const id = jointId.index1 - 1;
  const joint = world.jointArray[id];
  return joint;
}
function b2GetJoint(world, jointId) {
  return world.jointArray[jointId];
}
function b2GetJointSim(world, joint) {
  if (joint.setIndex === b2SetType.b2_awakeSet) {
    const color = world.constraintGraph.colors[joint.colorIndex];
    if (joint.jointId !== color.joints.data[joint.localIndex].jointId) {
    }
    return color.joints.data[joint.localIndex];
  }
  const set = world.solverSetArray[joint.setIndex];
  return set.joints.data[joint.localIndex];
}
function b2GetJointSimCheckType(jointId, type) {
  const world = b2GetWorld(jointId.world0);
  if (world.locked) {
    return null;
  }
  const joint = b2GetJointFullId(world, jointId);
  const jointSim = b2GetJointSim(world, joint);
  return jointSim;
}
var b2JointPair = class {
  constructor(joint = null, jointSim = null) {
    this.joint = joint;
    this.jointSim = jointSim;
  }
};
function b2CreateJoint(world, bodyA, bodyB, userData, drawSize, type, collideConnected) {
  b2ValidateSolverSets(world);
  const bodyIdA = bodyA.id;
  const bodyIdB = bodyB.id;
  const maxSetIndex = Math.max(bodyA.setIndex, bodyB.setIndex);
  const jointId = b2AllocId(world.jointIdPool);
  while (jointId >= world.jointArray.length) {
    world.jointArray.push(new b2Joint());
  }
  const joint = world.jointArray[jointId];
  joint.edges = [new b2JointEdge(), new b2JointEdge()];
  joint.jointId = jointId;
  joint.userData = userData;
  joint.setIndex = B2_NULL_INDEX;
  joint.colorIndex = B2_NULL_INDEX;
  joint.localIndex = B2_NULL_INDEX;
  joint.islandId = B2_NULL_INDEX;
  joint.islandPrev = B2_NULL_INDEX;
  joint.islandNext = B2_NULL_INDEX;
  joint.revision += 1;
  joint.drawSize = drawSize;
  joint.type = type;
  joint.isMarked = false;
  joint.collideConnected = collideConnected;
  joint.edges[0].bodyId = bodyIdA;
  joint.edges[0].prevKey = B2_NULL_INDEX;
  joint.edges[0].nextKey = bodyA.headJointKey;
  const keyA = jointId << 1 | 0;
  if (bodyA.headJointKey !== B2_NULL_INDEX) {
    const jointA = world.jointArray[bodyA.headJointKey >> 1];
    const edgeA = jointA.edges[bodyA.headJointKey & 1];
    edgeA.prevKey = keyA;
  }
  bodyA.headJointKey = keyA;
  bodyA.jointCount += 1;
  joint.edges[1].bodyId = bodyIdB;
  joint.edges[1].prevKey = B2_NULL_INDEX;
  joint.edges[1].nextKey = bodyB.headJointKey;
  const keyB = jointId << 1 | 1;
  if (bodyB.headJointKey !== B2_NULL_INDEX) {
    const jointB = world.jointArray[bodyB.headJointKey >> 1];
    const edgeB = jointB.edges[bodyB.headJointKey & 1];
    edgeB.prevKey = keyB;
  }
  bodyB.headJointKey = keyB;
  bodyB.jointCount += 1;
  let jointSim;
  if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet) {
    const set = world.solverSetArray[b2SetType.b2_disabledSet];
    joint.setIndex = b2SetType.b2_disabledSet;
    joint.localIndex = set.joints.length;
    jointSim = b2AddJoint(set.joints);
    jointSim.jointId = jointId;
    jointSim.bodyIdA = bodyIdA;
    jointSim.bodyIdB = bodyIdB;
  } else if (bodyA.setIndex === b2SetType.b2_staticSet && bodyB.setIndex === b2SetType.b2_staticSet) {
    const set = world.solverSetArray[b2SetType.b2_staticSet];
    joint.setIndex = b2SetType.b2_staticSet;
    joint.localIndex = set.joints.length;
    jointSim = b2AddJoint(set.joints);
    jointSim.jointId = jointId;
    jointSim.bodyIdA = bodyIdA;
    jointSim.bodyIdB = bodyIdB;
  } else if (bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet) {
    if (maxSetIndex >= b2SetType.b2_firstSleepingSet) {
      b2WakeSolverSet(world, maxSetIndex);
    }
    joint.setIndex = b2SetType.b2_awakeSet;
    jointSim = b2CreateJointInGraph(world, joint);
    jointSim.jointId = jointId;
    jointSim.bodyIdA = bodyIdA;
    jointSim.bodyIdB = bodyIdB;
  } else {
    let setIndex = maxSetIndex;
    const set = world.solverSetArray[setIndex];
    joint.setIndex = setIndex;
    joint.localIndex = set.joints.length;
    jointSim = b2AddJoint(set.joints);
    jointSim.jointId = jointId;
    jointSim.bodyIdA = bodyIdA;
    jointSim.bodyIdB = bodyIdB;
    if (bodyA.setIndex !== bodyB.setIndex && bodyA.setIndex >= b2SetType.b2_firstSleepingSet && bodyB.setIndex >= b2SetType.b2_firstSleepingSet) {
      b2MergeSolverSets(world, bodyA.setIndex, bodyB.setIndex);
      setIndex = bodyA.setIndex;
      jointSim = world.solverSetArray[setIndex].joints[joint.localIndex];
    }
  }
  if (joint.setIndex > b2SetType.b2_disabledSet) {
    b2LinkJoint(world, joint);
  }
  b2ValidateSolverSets(world);
  return new b2JointPair(joint, jointSim);
}
function b2DestroyContactsBetweenBodies(world, bodyA, bodyB) {
  let contactKey;
  let otherBodyId;
  if (bodyA.contactCount < bodyB.contactCount) {
    contactKey = bodyA.headContactKey;
    otherBodyId = bodyB.id;
  } else {
    contactKey = bodyB.headContactKey;
    otherBodyId = bodyA.id;
  }
  const wakeBodies = false;
  while (contactKey !== B2_NULL_INDEX) {
    const contactId = contactKey >> 1;
    const edgeIndex = contactKey & 1;
    const contact = world.contactArray[contactId];
    contactKey = contact.edges[edgeIndex].nextKey;
    const otherEdgeIndex = edgeIndex ^ 1;
    if (contact.edges[otherEdgeIndex].bodyId === otherBodyId) {
      b2DestroyContact(world, contact, wakeBodies);
    }
  }
  b2ValidateSolverSets(world);
}
function b2CreateDistanceJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_distanceJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_distanceJoint;
  joint.localOriginAnchorA = def.localAnchorA;
  joint.localOriginAnchorB = def.localAnchorB;
  joint.distanceJoint = new b2DistanceJoint();
  joint.distanceJoint.length = Math.max(def.length, b2_linearSlop);
  joint.distanceJoint.hertz = def.hertz;
  joint.distanceJoint.dampingRatio = def.dampingRatio;
  joint.distanceJoint.minLength = Math.max(def.minLength, b2_linearSlop);
  joint.distanceJoint.maxLength = Math.max(def.minLength, def.maxLength);
  joint.distanceJoint.maxMotorForce = def.maxMotorForce;
  joint.distanceJoint.motorSpeed = def.motorSpeed;
  joint.distanceJoint.enableSpring = def.enableSpring;
  joint.distanceJoint.enableLimit = def.enableLimit;
  joint.distanceJoint.enableMotor = def.enableMotor;
  joint.distanceJoint.impulse = 0;
  joint.distanceJoint.lowerImpulse = 0;
  joint.distanceJoint.upperImpulse = 0;
  joint.distanceJoint.motorImpulse = 0;
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreateMotorJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_motorJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_motorJoint;
  joint.localOriginAnchorA = new b2Vec2(0, 0);
  joint.localOriginAnchorB = new b2Vec2(0, 0);
  joint.motorJoint = new b2MotorJoint();
  joint.motorJoint.linearOffset = def.linearOffset;
  joint.motorJoint.angularOffset = def.angularOffset;
  joint.motorJoint.maxForce = def.maxForce;
  joint.motorJoint.maxTorque = def.maxTorque;
  joint.motorJoint.correctionFactor = b2ClampFloat(def.correctionFactor, 0, 1);
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreateMouseJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const transformA = b2GetBodyTransformQuick(world, bodyA);
  const transformB = b2GetBodyTransformQuick(world, bodyB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_mouseJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_mouseJoint;
  joint.localOriginAnchorA = b2InvTransformPoint(transformA, def.target);
  joint.localOriginAnchorB = b2InvTransformPoint(transformB, def.target);
  joint.mouseJoint = new b2MouseJoint();
  joint.mouseJoint.targetA = def.target;
  joint.mouseJoint.hertz = def.hertz;
  joint.mouseJoint.dampingRatio = def.dampingRatio;
  joint.mouseJoint.maxForce = def.maxForce;
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreateRevoluteJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, def.drawSize, b2JointType.b2_revoluteJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_revoluteJoint;
  joint.localOriginAnchorA = def.localAnchorA;
  joint.localOriginAnchorB = def.localAnchorB;
  joint.revoluteJoint = new b2RevoluteJoint();
  joint.revoluteJoint.referenceAngle = b2ClampFloat(def.referenceAngle, -Math.PI, Math.PI);
  joint.revoluteJoint.linearImpulse = new b2Vec2(0, 0);
  joint.revoluteJoint.axialMass = 0;
  joint.revoluteJoint.springImpulse = 0;
  joint.revoluteJoint.motorImpulse = 0;
  joint.revoluteJoint.lowerImpulse = 0;
  joint.revoluteJoint.upperImpulse = 0;
  joint.revoluteJoint.hertz = def.hertz;
  joint.revoluteJoint.dampingRatio = def.dampingRatio;
  joint.revoluteJoint.lowerAngle = Math.min(def.lowerAngle, def.upperAngle);
  joint.revoluteJoint.upperAngle = Math.max(def.lowerAngle, def.upperAngle);
  joint.revoluteJoint.lowerAngle = b2ClampFloat(joint.revoluteJoint.lowerAngle, -Math.PI, Math.PI);
  joint.revoluteJoint.upperAngle = b2ClampFloat(joint.revoluteJoint.upperAngle, -Math.PI, Math.PI);
  joint.revoluteJoint.maxMotorTorque = def.maxMotorTorque;
  joint.revoluteJoint.motorSpeed = def.motorSpeed;
  joint.revoluteJoint.enableSpring = def.enableSpring;
  joint.revoluteJoint.enableLimit = def.enableLimit;
  joint.revoluteJoint.enableMotor = def.enableMotor;
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreatePrismaticJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_prismaticJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_prismaticJoint;
  joint.localOriginAnchorA = def.localAnchorA;
  joint.localOriginAnchorB = def.localAnchorB;
  joint.prismaticJoint = new b2PrismaticJoint();
  joint.prismaticJoint.localAxisA = b2Normalize(def.localAxisA);
  joint.prismaticJoint.referenceAngle = def.referenceAngle;
  joint.prismaticJoint.impulse = new b2Vec2(0, 0);
  joint.prismaticJoint.axialMass = 0;
  joint.prismaticJoint.springImpulse = 0;
  joint.prismaticJoint.motorImpulse = 0;
  joint.prismaticJoint.lowerImpulse = 0;
  joint.prismaticJoint.upperImpulse = 0;
  joint.prismaticJoint.hertz = def.hertz;
  joint.prismaticJoint.dampingRatio = def.dampingRatio;
  joint.prismaticJoint.lowerTranslation = def.lowerTranslation;
  joint.prismaticJoint.upperTranslation = def.upperTranslation;
  joint.prismaticJoint.maxMotorForce = def.maxMotorForce;
  joint.prismaticJoint.motorSpeed = def.motorSpeed;
  joint.prismaticJoint.enableSpring = def.enableSpring;
  joint.prismaticJoint.enableLimit = def.enableLimit;
  joint.prismaticJoint.enableMotor = def.enableMotor;
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreateWeldJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_weldJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_weldJoint;
  joint.localOriginAnchorA = def.localAnchorA;
  joint.localOriginAnchorB = def.localAnchorB;
  joint.weldJoint = new b2WeldJoint();
  joint.weldJoint.referenceAngle = def.referenceAngle;
  joint.weldJoint.linearHertz = def.linearHertz;
  joint.weldJoint.linearDampingRatio = def.linearDampingRatio;
  joint.weldJoint.angularHertz = def.angularHertz;
  joint.weldJoint.angularDampingRatio = def.angularDampingRatio;
  joint.weldJoint.linearImpulse = new b2Vec2(0, 0);
  joint.weldJoint.angularImpulse = 0;
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2CreateWheelJoint(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2JointId();
  }
  const bodyA = b2GetBodyFullId(world, def.bodyIdA);
  const bodyB = b2GetBodyFullId(world, def.bodyIdB);
  const pair = b2CreateJoint(world, bodyA, bodyB, def.userData, 1, b2JointType.b2_wheelJoint, def.collideConnected);
  const joint = pair.jointSim;
  joint.type = b2JointType.b2_wheelJoint;
  joint.localOriginAnchorA = def.localAnchorA;
  joint.localOriginAnchorB = def.localAnchorB;
  joint.wheelJoint = new b2WheelJoint();
  joint.wheelJoint.localAxisA = b2Normalize(def.localAxisA);
  joint.wheelJoint.perpMass = 0;
  joint.wheelJoint.axialMass = 0;
  joint.wheelJoint.motorImpulse = 0;
  joint.wheelJoint.lowerImpulse = 0;
  joint.wheelJoint.upperImpulse = 0;
  joint.wheelJoint.lowerTranslation = def.lowerTranslation;
  joint.wheelJoint.upperTranslation = def.upperTranslation;
  joint.wheelJoint.maxMotorTorque = def.maxMotorTorque;
  joint.wheelJoint.motorSpeed = def.motorSpeed;
  joint.wheelJoint.hertz = def.hertz;
  joint.wheelJoint.dampingRatio = def.dampingRatio;
  joint.wheelJoint.enableSpring = def.enableSpring;
  joint.wheelJoint.enableLimit = def.enableLimit;
  joint.wheelJoint.enableMotor = def.enableMotor;
  if (def.collideConnected === false) {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
  const jointId = new b2JointId(joint.jointId + 1, world.worldId, pair.joint.revision);
  return jointId;
}
function b2DestroyJointInternal(world, joint, wakeBodies) {
  const jointId = joint.jointId;
  const edgeA = joint.edges[0];
  const edgeB = joint.edges[1];
  const idA = edgeA.bodyId;
  const idB = edgeB.bodyId;
  const bodyA = b2GetBody(world, idA);
  const bodyB = b2GetBody(world, idB);
  if (edgeA.prevKey !== B2_NULL_INDEX) {
    const prevJoint = world.jointArray[edgeA.prevKey >> 1];
    const prevEdge = prevJoint.edges[edgeA.prevKey & 1];
    prevEdge.nextKey = edgeA.nextKey;
  }
  if (edgeA.nextKey !== B2_NULL_INDEX) {
    const nextJoint = world.jointArray[edgeA.nextKey >> 1];
    const nextEdge = nextJoint.edges[edgeA.nextKey & 1];
    nextEdge.prevKey = edgeA.prevKey;
  }
  const edgeKeyA = jointId << 1 | 0;
  if (bodyA.headJointKey === edgeKeyA) {
    bodyA.headJointKey = edgeA.nextKey;
  }
  bodyA.jointCount -= 1;
  if (edgeB.prevKey !== B2_NULL_INDEX) {
    const prevJoint = world.jointArray[edgeB.prevKey >> 1];
    const prevEdge = prevJoint.edges[edgeB.prevKey & 1];
    prevEdge.nextKey = edgeB.nextKey;
  }
  if (edgeB.nextKey !== B2_NULL_INDEX) {
    const nextJoint = world.jointArray[edgeB.nextKey >> 1];
    const nextEdge = nextJoint.edges[edgeB.nextKey & 1];
    nextEdge.prevKey = edgeB.prevKey;
  }
  const edgeKeyB = jointId << 1 | 1;
  if (bodyB.headJointKey === edgeKeyB) {
    bodyB.headJointKey = edgeB.nextKey;
  }
  bodyB.jointCount -= 1;
  b2UnlinkJoint(world, joint);
  const setIndex = joint.setIndex;
  const localIndex = joint.localIndex;
  if (setIndex === b2SetType.b2_awakeSet) {
    b2RemoveJointFromGraph(world, joint.edges[0].bodyId, joint.edges[1].bodyId, joint.colorIndex, localIndex);
  } else {
    const set = world.solverSetArray[setIndex];
    const movedIndex = b2RemoveJoint(set.joints, localIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedJointSim = set.joints.data[localIndex];
      const movedId = movedJointSim.jointId;
      const movedJoint = world.jointArray[movedId];
      movedJoint.localIndex = localIndex;
    }
  }
  joint.setIndex = B2_NULL_INDEX;
  joint.colorIndex = B2_NULL_INDEX;
  joint.localIndex = B2_NULL_INDEX;
  joint.jointId = B2_NULL_INDEX;
  joint.type = b2JointType.b2_unknown;
  b2FreeId(world.jointIdPool, jointId);
  if (wakeBodies) {
    b2WakeBody(world, bodyA);
    b2WakeBody(world, bodyB);
  }
  b2ValidateSolverSets(world);
}
function b2DestroyJoint(jointId) {
  const world = b2GetWorld(jointId.world0);
  if (world.locked) {
    return;
  }
  const joint = b2GetJointFullId(world, jointId);
  b2DestroyJointInternal(world, joint, true);
}
function b2Joint_GetType(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  return joint.type;
}
function b2Joint_GetBodyA(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  return b2MakeBodyId(world, joint.edges[0].bodyId);
}
function b2Joint_GetBodyB(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  return b2MakeBodyId(world, joint.edges[1].bodyId);
}
function b2Joint_GetLocalAnchorA(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  const jointSim = b2GetJointSim(world, joint);
  return jointSim.localOriginAnchorA;
}
function b2Joint_GetLocalAnchorB(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  const jointSim = b2GetJointSim(world, joint);
  return jointSim.localOriginAnchorB;
}
function b2Joint_SetCollideConnected(jointId, shouldCollide) {
  const world = b2GetWorldLocked(jointId.world0);
  if (world === null) {
    return;
  }
  const joint = b2GetJointFullId(world, jointId);
  if (joint.collideConnected === shouldCollide) {
    return;
  }
  joint.collideConnected = shouldCollide;
  const bodyA = b2GetBody(world, joint.edges[0].bodyId);
  const bodyB = b2GetBody(world, joint.edges[1].bodyId);
  if (shouldCollide) {
    const shapeCountA = bodyA.shapeCount;
    const shapeCountB = bodyB.shapeCount;
    let shapeId = shapeCountA < shapeCountB ? bodyA.headShapeId : bodyB.headShapeId;
    while (shapeId !== B2_NULL_INDEX) {
      const shape = world.shapeArray[shapeId];
      if (shape.proxyKey !== B2_NULL_INDEX) {
        b2BufferMove(world.broadPhase, shape.proxyKey);
      }
      shapeId = shape.nextShapeId;
    }
  } else {
    b2DestroyContactsBetweenBodies(world, bodyA, bodyB);
  }
}
function b2Joint_GetCollideConnected(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  return joint.collideConnected;
}
function b2Joint_SetUserData(jointId, userData) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  joint.userData = userData;
}
function b2Joint_GetUserData(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  return joint.userData;
}
function b2Joint_WakeBodies(jointId) {
  const world = b2GetWorldLocked(jointId.world0);
  if (world === null) {
    return;
  }
  const joint = b2GetJointFullId(world, jointId);
  const bodyA = world.bodyArray[joint.edges[0].bodyId];
  const bodyB = world.bodyArray[joint.edges[1].bodyId];
  b2WakeBody(world, bodyA);
  b2WakeBody(world, bodyB);
}
function b2Joint_GetConstraintForce(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  const base = b2GetJointSim(world, joint);
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      return b2GetDistanceJointForce(world, base);
    case b2JointType.b2_motorJoint:
      return b2GetMotorJointForce(world, base);
    case b2JointType.b2_mouseJoint:
      return b2GetMouseJointForce(world, base);
    case b2JointType.b2_prismaticJoint:
      return b2GetPrismaticJointForce(world, base);
    case b2JointType.b2_revoluteJoint:
      return b2GetRevoluteJointForce(world, base);
    case b2JointType.b2_weldJoint:
      return b2GetWeldJointForce(world, base);
    case b2JointType.b2_wheelJoint:
      return b2GetWheelJointForce(world, base);
    default:
      return new b2Vec2(0, 0);
  }
}
function b2Joint_GetConstraintTorque(jointId) {
  const world = b2GetWorld(jointId.world0);
  const joint = b2GetJointFullId(world, jointId);
  const base = b2GetJointSim(world, joint);
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      return 0;
    case b2JointType.b2_motorJoint:
      return b2GetMotorJointTorque(world, base);
    case b2JointType.b2_mouseJoint:
      return b2GetMouseJointTorque(world, base);
    case b2JointType.b2_prismaticJoint:
      return b2GetPrismaticJointTorque(world, base);
    case b2JointType.b2_revoluteJoint:
      return b2GetRevoluteJointTorque(world, base);
    case b2JointType.b2_weldJoint:
      return b2GetWeldJointTorque(world, base);
    case b2JointType.b2_wheelJoint:
      return b2GetWheelJointTorque(world, base);
    default:
      return 0;
  }
}
function b2PrepareJoint(joint, context) {
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      b2PrepareDistanceJoint(joint, context);
      break;
    case b2JointType.b2_motorJoint:
      b2PrepareMotorJoint(joint, context);
      break;
    case b2JointType.b2_mouseJoint:
      b2PrepareMouseJoint(joint, context);
      break;
    case b2JointType.b2_prismaticJoint:
      b2PreparePrismaticJoint(joint, context);
      break;
    case b2JointType.b2_revoluteJoint:
      b2PrepareRevoluteJoint(joint, context);
      break;
    case b2JointType.b2_weldJoint:
      b2PrepareWeldJoint(joint, context);
      break;
    case b2JointType.b2_wheelJoint:
      b2PrepareWheelJoint(joint, context);
      break;
    default:
  }
}
function b2WarmStartJoint(joint, context) {
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      b2WarmStartDistanceJoint(joint, context);
      break;
    case b2JointType.b2_motorJoint:
      b2WarmStartMotorJoint(joint, context);
      break;
    case b2JointType.b2_mouseJoint:
      b2WarmStartMouseJoint(joint, context);
      break;
    case b2JointType.b2_prismaticJoint:
      b2WarmStartPrismaticJoint(joint, context);
      break;
    case b2JointType.b2_revoluteJoint:
      b2WarmStartRevoluteJoint(joint, context);
      break;
    case b2JointType.b2_weldJoint:
      b2WarmStartWeldJoint(joint, context);
      break;
    case b2JointType.b2_wheelJoint:
      b2WarmStartWheelJoint(joint, context);
      break;
    default:
  }
}
function b2SolveJoint(joint, context, useBias) {
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      b2SolveDistanceJoint(joint, context, useBias);
      break;
    case b2JointType.b2_motorJoint:
      b2SolveMotorJoint(joint, context, useBias);
      break;
    case b2JointType.b2_mouseJoint:
      b2SolveMouseJoint(joint, context);
      break;
    case b2JointType.b2_prismaticJoint:
      b2SolvePrismaticJoint(joint, context, useBias);
      break;
    case b2JointType.b2_revoluteJoint:
      b2SolveRevoluteJoint(joint, context, useBias);
      break;
    case b2JointType.b2_weldJoint:
      b2SolveWeldJoint(joint, context, useBias);
      break;
    case b2JointType.b2_wheelJoint:
      b2SolveWheelJoint(joint, context, useBias);
      break;
    default:
  }
}
function b2PrepareOverflowJoints(context) {
  const graph = context.graph;
  const joints = graph.colors[b2_overflowIndex].joints.data;
  const jointCount = graph.colors[b2_overflowIndex].joints.count;
  for (let i = 0; i < jointCount; ++i) {
    const joint = joints[i];
    b2PrepareJoint(joint, context);
  }
}
function b2WarmStartOverflowJoints(context) {
  const graph = context.graph;
  const joints = graph.colors[b2_overflowIndex].joints.data;
  const jointCount = graph.colors[b2_overflowIndex].joints.count;
  for (let i = 0; i < jointCount; ++i) {
    const joint = joints[i];
    b2WarmStartJoint(joint, context);
  }
}
function b2SolveOverflowJoints(context, useBias) {
  const graph = context.graph;
  const joints = graph.colors[b2_overflowIndex].joints.data;
  const jointCount = graph.colors[b2_overflowIndex].joints.count;
  for (let i = 0; i < jointCount; ++i) {
    const joint = joints[i];
    b2SolveJoint(joint, context, useBias);
  }
}
function b2DrawJoint(draw, world, joint) {
  const bodyA = b2GetBody(world, joint.edges[0].bodyId);
  const bodyB = b2GetBody(world, joint.edges[1].bodyId);
  if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet) {
    return;
  }
  const jointSim = b2GetJointSim(world, joint);
  const transformA = b2GetBodyTransformQuick(world, bodyA);
  const transformB = b2GetBodyTransformQuick(world, bodyB);
  const pA = b2TransformPoint(transformA, jointSim.localOriginAnchorA);
  const pB = b2TransformPoint(transformB, jointSim.localOriginAnchorB);
  const color = b2HexColor.b2_colorDarkSeaGreen;
  switch (joint.type) {
    case b2JointType.b2_distanceJoint:
      b2DrawDistanceJoint(draw, jointSim, transformA, transformB);
      break;
    case b2JointType.b2_mouseJoint:
      {
        const target = jointSim.mouseJoint.targetA;
        const c1 = b2HexColor.b2_colorGreen;
        draw.DrawPoint(target.x, target.y, 4, c1, draw.context);
        draw.DrawPoint(pB.x, pB.y, 4, c1, draw.context);
        const c2 = b2HexColor.b2_colorGray8;
        draw.DrawSegment(target, pB, c2, draw.context);
      }
      break;
    case b2JointType.b2_prismaticJoint:
      b2DrawPrismaticJoint(draw, jointSim, transformA, transformB);
      break;
    case b2JointType.b2_revoluteJoint:
      b2DrawRevoluteJoint(draw, jointSim, transformA, transformB, joint.drawSize);
      break;
    case b2JointType.b2_wheelJoint:
      b2DrawWheelJoint(draw, jointSim, transformA, transformB);
      break;
    default:
      draw.DrawSegment(transformA.p, pA, color, draw.context);
      draw.DrawSegment(pA, pB, color, draw.context);
      draw.DrawSegment(transformB.p, pB, color, draw.context);
  }
  if (draw.drawGraphColors) {
    const colors = [
      b2HexColor.b2_colorRed,
      b2HexColor.b2_colorOrange,
      b2HexColor.b2_colorYellow,
      b2HexColor.b2_colorGreen,
      b2HexColor.b2_colorCyan,
      b2HexColor.b2_colorBlue,
      b2HexColor.b2_colorViolet,
      b2HexColor.b2_colorPink,
      b2HexColor.b2_colorChocolate,
      b2HexColor.b2_colorGoldenrod,
      b2HexColor.b2_colorCoral,
      b2HexColor.b2_colorBlack
    ];
    const colorIndex = joint.colorIndex;
    if (colorIndex !== B2_NULL_INDEX) {
      const p4 = b2Lerp(pA, pB, 0.5);
      draw.DrawPoint(p4.x, p4.y, 5, colors[colorIndex], draw.context);
    }
  }
}

// src/include/joint_h.js
var b2JointEdge = class {
  constructor() {
    this.bodyId = B2_NULL_INDEX;
    this.prevKey = B2_NULL_INDEX;
    this.nextKey = B2_NULL_INDEX;
  }
};
var b2Joint = class {
  constructor() {
    this.userData = null;
    this.setIndex = B2_NULL_INDEX;
    this.colorIndex = B2_NULL_INDEX;
    this.localIndex = B2_NULL_INDEX;
    this.edges = [new b2JointEdge(), new b2JointEdge()];
    this.jointId = B2_NULL_INDEX;
    this.islandId = B2_NULL_INDEX;
    this.islandPrev = B2_NULL_INDEX;
    this.islandNext = B2_NULL_INDEX;
    this.revision = 0;
    this.drawSize = 0;
    this.type = b2JointType.b2_unknown;
    this.isMarked = false;
    this.collideConnected = false;
  }
};
var b2DistanceJoint = class _b2DistanceJoint {
  constructor() {
    this.length = 0;
    this.hertz = 0;
    this.dampingRatio = 0;
    this.minLength = 0;
    this.maxLength = 0;
    this.maxMotorForce = 0;
    this.motorSpeed = 0;
    this.impulse = 0;
    this.lowerImpulse = 0;
    this.upperImpulse = 0;
    this.motorImpulse = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.distanceSoftness = new b2Softness();
    this.axialMass = 0;
    this.enableSpring = false;
    this.enableLimit = false;
    this.enableMotor = false;
  }
  clone() {
    const dj = new _b2DistanceJoint();
    dj.length = this.length;
    dj.hertz = this.hertz;
    dj.dampingRatio = this.dampingRatio;
    dj.minLength = this.minLength;
    dj.maxLength = this.maxLength;
    dj.maxMotorForce = this.maxMotorForce;
    dj.motorSpeed = this.motorSpeed;
    dj.impulse = this.impulse;
    dj.lowerImpulse = this.lowerImpulse;
    dj.upperImpulse = this.upperImpulse;
    dj.motorImpulse = this.motorImpulse;
    dj.indexA = this.indexA;
    dj.indexB = this.indexB;
    dj.anchorA = this.anchorA.clone();
    dj.anchorB = this.anchorB.clone();
    dj.deltaCenter = this.deltaCenter.clone();
    dj.distanceSoftness = this.distanceSoftness;
    dj.axialMass = this.axialMass;
    dj.enableSpring = this.enableSpring;
    dj.enableLimit = this.enableLimit;
    dj.enableMotor = this.enableMotor;
    return dj;
  }
};
var b2MotorJoint = class _b2MotorJoint {
  constructor() {
    this.linearOffset = new b2Vec2();
    this.angularOffset = 0;
    this.linearImpulse = new b2Vec2();
    this.angularImpulse = 0;
    this.maxForce = 0;
    this.maxTorque = 0;
    this.correctionFactor = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.deltaAngle = 0;
    this.linearMass = new b2Mat22();
    this.angularMass = 0;
  }
  clone() {
    const mj = new _b2MotorJoint();
    mj.linearOffset = this.linearOffset.clone();
    mj.angularOffset = this.angularOffset;
    mj.linearImpulse = this.linearImpulse.clone();
    mj.angularImpulse = this.angularImpulse;
    mj.maxForce = this.maxForce;
    mj.maxTorque = this.maxTorque;
    mj.correctionFactor = this.correctionFactor;
    mj.indexA = this.indexA;
    mj.indexB = this.indexB;
    mj.anchorA = this.anchorA.clone();
    mj.anchorB = this.anchorB.clone();
    mj.deltaCenter = this.deltaCenter.clone();
    mj.deltaAngle = this.deltaAngle;
    mj.linearMass = this.linearMass.clone();
    mj.angularMass = this.angularMass;
    return mj;
  }
};
var b2MouseJoint = class _b2MouseJoint {
  constructor() {
    this.targetA = new b2Vec2();
    this.hertz = 0;
    this.dampingRatio = 0;
    this.maxForce = 0;
    this.linearImpulse = new b2Vec2();
    this.angularImpulse = 0;
    this.linearSoftness = new b2Softness();
    this.angularSoftness = new b2Softness();
    this.indexB = B2_NULL_INDEX;
    this.anchorB = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.linearMass = new b2Mat22();
  }
  clone() {
    const mj = new _b2MouseJoint();
    mj.targetA = this.targetA.clone();
    mj.hertz = this.hertz;
    mj.dampingRatio = this.dampingRatio;
    mj.maxForce = this.maxForce;
    mj.linearImpulse = this.linearImpulse.clone();
    mj.angularImpulse = this.angularImpulse;
    mj.linearSoftness = this.linearSoftness;
    mj.angularSoftness = this.angularSoftness;
    mj.indexB = this.indexB;
    mj.anchorB = this.anchorB.clone();
    mj.deltaCenter = this.deltaCenter.clone();
    mj.linearMass = this.linearMass.clone();
    return mj;
  }
};
var b2PrismaticJoint = class _b2PrismaticJoint {
  constructor() {
    this.localAxisA = new b2Vec2();
    this.impulse = new b2Vec2();
    this.springImpulse = 0;
    this.motorImpulse = 0;
    this.lowerImpulse = 0;
    this.upperImpulse = 0;
    this.hertz = 0;
    this.dampingRatio = 0;
    this.maxMotorForce = 0;
    this.motorSpeed = 0;
    this.referenceAngle = 0;
    this.lowerTranslation = 0;
    this.upperTranslation = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.axisA = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.deltaAngle = 0;
    this.axialMass = 0;
    this.springSoftness = new b2Softness();
    this.enableSpring = false;
    this.enableLimit = false;
    this.enableMotor = false;
  }
  clone() {
    const pj = new _b2PrismaticJoint();
    pj.localAxisA = this.localAxisA.clone();
    pj.impulse = this.impulse.clone();
    pj.springImpulse = this.springImpulse;
    pj.motorImpulse = this.motorImpulse;
    pj.lowerImpulse = this.lowerImpulse;
    pj.upperImpulse = this.upperImpulse;
    pj.hertz = this.hertz;
    pj.dampingRatio = this.dampingRatio;
    pj.maxMotorForce = this.maxMotorForce;
    pj.motorSpeed = this.motorSpeed;
    pj.referenceAngle = this.referenceAngle;
    pj.lowerTranslation = this.lowerTranslation;
    pj.upperTranslation = this.upperTranslation;
    pj.indexA = this.indexA;
    pj.indexB = this.indexB;
    pj.anchorA = this.anchorA.clone();
    pj.anchorB = this.anchorB.clone();
    pj.axisA = this.axisA.clone();
    pj.deltaCenter = this.deltaCenter.clone();
    pj.deltaAngle = this.deltaAngle;
    pj.axialMass = this.axialMass;
    pj.springSoftness = this.springSoftness.clone();
    pj.enableSpring = this.enableSpring;
    pj.enableLimit = this.enableLimit;
    pj.enableMotor = this.enableMotor;
    return pj;
  }
};
var b2RevoluteJoint = class _b2RevoluteJoint {
  constructor() {
    this.linearImpulse = new b2Vec2();
    this.springImpulse = 0;
    this.motorImpulse = 0;
    this.lowerImpulse = 0;
    this.upperImpulse = 0;
    this.hertz = 0;
    this.dampingRatio = 0;
    this.maxMotorTorque = 0;
    this.motorSpeed = 0;
    this.referenceAngle = 0;
    this.lowerAngle = 0;
    this.upperAngle = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.deltaAngle = 0;
    this.axialMass = 0;
    this.springSoftness = new b2Softness();
    this.enableSpring = false;
    this.enableMotor = false;
    this.enableLimit = false;
  }
  clone() {
    const rj = new _b2RevoluteJoint();
    rj.linearImpulse = this.linearImpulse.clone();
    rj.springImpulse = this.springImpulse;
    rj.motorImpulse = this.motorImpulse;
    rj.lowerImpulse = this.lowerImpulse;
    rj.upperImpulse = this.upperImpulse;
    rj.hertz = this.hertz;
    rj.dampingRatio = this.dampingRatio;
    rj.maxMotorTorque = this.maxMotorTorque;
    rj.motorSpeed = this.motorSpeed;
    rj.referenceAngle = this.referenceAngle;
    rj.lowerAngle = this.lowerAngle;
    rj.upperAngle = this.upperAngle;
    rj.indexA = this.indexA;
    rj.indexB = this.indexB;
    rj.anchorA = this.anchorA.clone();
    rj.anchorB = this.anchorB.clone();
    rj.deltaCenter = this.deltaCenter.clone();
    rj.deltaAngle = this.deltaAngle;
    rj.axialMass = this.axialMass;
    rj.springSoftness = this.springSoftness;
    rj.enableSpring = this.enableSpring;
    rj.enableMotor = this.enableMotor;
    rj.enableLimit = this.enableLimit;
    return rj;
  }
};
var b2WeldJoint = class _b2WeldJoint {
  constructor() {
    this.referenceAngle = 0;
    this.linearHertz = 0;
    this.linearDampingRatio = 0;
    this.angularHertz = 0;
    this.angularDampingRatio = 0;
    this.linearSoftness = new b2Softness();
    this.angularSoftness = new b2Softness();
    this.linearImpulse = new b2Vec2();
    this.angularImpulse = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.deltaAngle = 0;
    this.axialMass = 0;
  }
  clone() {
    const wj = new _b2WeldJoint();
    wj.referenceAngle = this.referenceAngle;
    wj.linearHertz = this.linearHertz;
    wj.linearDampingRatio = this.linearDampingRatio;
    wj.angularHertz = this.angularHertz;
    wj.angularDampingRatio = this.angularDampingRatio;
    wj.linearSoftness = this.linearSoftness;
    wj.angularSoftness = this.angularSoftness;
    wj.linearImpulse = this.linearImpulse.clone();
    wj.angularImpulse = this.angularImpulse;
    wj.indexA = this.indexA;
    wj.indexB = this.indexB;
    wj.anchorA = this.anchorA.clone();
    wj.anchorB = this.anchorB.clone();
    wj.deltaCenter = this.deltaCenter.clone();
    wj.deltaAngle = this.deltaAngle;
    wj.axialMass = this.axialMass;
    return wj;
  }
};
var b2WheelJoint = class _b2WheelJoint {
  constructor() {
    this.localAxisA = new b2Vec2();
    this.perpImpulse = 0;
    this.motorImpulse = 0;
    this.springImpulse = 0;
    this.lowerImpulse = 0;
    this.upperImpulse = 0;
    this.maxMotorTorque = 0;
    this.motorSpeed = 0;
    this.lowerTranslation = 0;
    this.upperTranslation = 0;
    this.hertz = 0;
    this.dampingRatio = 0;
    this.indexA = B2_NULL_INDEX;
    this.indexB = B2_NULL_INDEX;
    this.anchorA = new b2Vec2();
    this.anchorB = new b2Vec2();
    this.axisA = new b2Vec2();
    this.deltaCenter = new b2Vec2();
    this.perpMass = 0;
    this.motorMass = 0;
    this.axialMass = 0;
    this.springSoftness = new b2Softness();
    this.enableSpring = false;
    this.enableMotor = false;
    this.enableLimit = false;
  }
  clone() {
    const wj = new _b2WheelJoint();
    wj.localAxisA = this.localAxisA.clone();
    wj.perpImpulse = this.perpImpulse;
    wj.motorImpulse = this.motorImpulse;
    wj.springImpulse = this.springImpulse;
    wj.lowerImpulse = this.lowerImpulse;
    wj.upperImpulse = this.upperImpulse;
    wj.maxMotorTorque = this.maxMotorTorque;
    wj.motorSpeed = this.motorSpeed;
    wj.lowerTranslation = this.lowerTranslation;
    wj.upperTranslation = this.upperTranslation;
    wj.hertz = this.hertz;
    wj.dampingRatio = this.dampingRatio;
    wj.indexA = this.indexA;
    wj.indexB = this.indexB;
    wj.anchorA = this.anchorA.clone();
    wj.anchorB = this.anchorB.clone();
    wj.axisA = this.axisA.clone();
    wj.deltaCenter = this.deltaCenter.clone();
    wj.perpMass = this.perpMass;
    wj.motorMass = this.motorMass;
    wj.axialMass = this.axialMass;
    wj.springSoftness = this.springSoftness;
    wj.enableSpring = this.enableSpring;
    wj.enableMotor = this.enableMotor;
    wj.enableLimit = this.enableLimit;
    return wj;
  }
};
var b2JointSim = class {
  constructor() {
    this.jointId = B2_NULL_INDEX;
    this.bodyIdA = B2_NULL_INDEX;
    this.bodyIdB = B2_NULL_INDEX;
    this.type = b2JointType.b2_unknown;
    this.localOriginAnchorA = new b2Vec2();
    this.localOriginAnchorB = new b2Vec2();
    this.invMassA = 0;
    this.invMassB = 0;
    this.invIA = 0;
    this.invIB = 0;
    this.joint = null;
    this.distanceJoint = null;
    this.motorJoint = null;
    this.mouseJoint = null;
    this.revoluteJoint = null;
    this.prismaticJoint = null;
    this.weldJoint = null;
    this.wheelJoint = null;
  }
  copyTo(dst) {
    dst.jointId = this.jointId;
    dst.bodyIdA = this.bodyIdA;
    dst.bodyIdB = this.bodyIdB;
    dst.type = this.type;
    dst.localOriginAnchorA = this.localOriginAnchorA.clone();
    dst.localOriginAnchorB = this.localOriginAnchorB.clone();
    dst.invMassA = this.invMassA;
    dst.invMassB = this.invMassB;
    dst.invIA = this.invIA;
    dst.invIB = this.invIB;
    dst.joint = this.joint;
    dst.distanceJoint = this.distanceJoint ? this.distanceJoint.clone() : null;
    dst.motorJoint = this.motorJoint ? this.motorJoint.clone() : null;
    dst.mouseJoint = this.mouseJoint ? this.mouseJoint.clone() : null;
    dst.revoluteJoint = this.revoluteJoint ? this.revoluteJoint.clone() : null;
    dst.prismaticJoint = this.prismaticJoint ? this.prismaticJoint.clone() : null;
    dst.weldJoint = this.weldJoint ? this.weldJoint.clone() : null;
    dst.wheelJoint = this.wheelJoint ? this.wheelJoint.clone() : null;
  }
};

// src/island_c.js
var b2Island = class {
  setIndex = 0;
  localIndex = 0;
  islandId = 0;
  headBody = 0;
  tailBody = 0;
  bodyCount = 0;
  headContact = 0;
  tailContact = 0;
  contactCount = 0;
  headJoint = 0;
  tailJoint = 0;
  jointCount = 0;
  parentIsland = 0;
  constraintRemoveCount = 0;
};
var b2IslandSim = class {
  islandId = 0;
};
function b2CreateIsland(world, setIndex) {
  const islandId = b2AllocId(world.islandIdPool);
  if (islandId === world.islandArray.length) {
    const emptyIsland = new b2Island();
    emptyIsland.setIndex = B2_NULL_INDEX;
    world.islandArray.push(emptyIsland);
  } else {
  }
  const set = world.solverSetArray[setIndex];
  const island = world.islandArray[islandId];
  island.setIndex = setIndex;
  island.localIndex = set.islands.count;
  island.islandId = islandId;
  island.headBody = B2_NULL_INDEX;
  island.tailBody = B2_NULL_INDEX;
  island.bodyCount = 0;
  island.headContact = B2_NULL_INDEX;
  island.tailContact = B2_NULL_INDEX;
  island.contactCount = 0;
  island.headJoint = B2_NULL_INDEX;
  island.tailJoint = B2_NULL_INDEX;
  island.jointCount = 0;
  island.parentIsland = B2_NULL_INDEX;
  island.constraintRemoveCount = 0;
  const islandSim = b2AddIsland(set.islands);
  islandSim.islandId = islandId;
  return island;
}
function b2DestroyIsland(world, islandId) {
  const island = world.islandArray[islandId];
  const set = world.solverSetArray[island.setIndex];
  const movedIndex = b2RemoveIsland(set.islands, island.localIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedElement = set.islands.data[island.localIndex];
    const movedId = movedElement.islandId;
    const movedIsland = world.islandArray[movedId];
    movedIsland.localIndex = island.localIndex;
  }
  island.islandId = B2_NULL_INDEX;
  island.setIndex = B2_NULL_INDEX;
  island.localIndex = B2_NULL_INDEX;
  b2FreeId(world.islandIdPool, islandId);
}
function b2GetIsland(world, islandId) {
  return world.islandArray[islandId];
}
function b2AddContactToIsland(world, islandId, contact) {
  const island = world.islandArray[islandId];
  if (island.headContact !== B2_NULL_INDEX) {
    contact.islandNext = island.headContact;
    const headContact = world.contactArray[island.headContact];
    headContact.islandPrev = contact.contactId;
  }
  island.headContact = contact.contactId;
  if (island.tailContact === B2_NULL_INDEX) {
    island.tailContact = island.headContact;
  }
  island.contactCount += 1;
  contact.islandId = islandId;
  b2ValidateIsland(world, islandId);
}
function b2LinkContact(world, contact) {
  const bodyIdA = contact.edges[0].bodyId;
  const bodyIdB = contact.edges[1].bodyId;
  const bodyA = b2GetBody(world, bodyIdA);
  const bodyB = b2GetBody(world, bodyIdB);
  if (bodyA.setIndex === b2SetType.b2_awakeSet && bodyB.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeSolverSet(world, bodyB.setIndex);
  }
  if (bodyB.setIndex === b2SetType.b2_awakeSet && bodyA.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeSolverSet(world, bodyA.setIndex);
  }
  let islandIdA = bodyA.islandId;
  let islandIdB = bodyB.islandId;
  if (islandIdA === islandIdB) {
    b2AddContactToIsland(world, islandIdA, contact);
    return;
  }
  let islandA = null;
  if (islandIdA !== B2_NULL_INDEX) {
    islandA = b2GetIsland(world, islandIdA);
    let parentId = islandA.parentIsland;
    while (parentId !== B2_NULL_INDEX) {
      const parent = b2GetIsland(world, parentId);
      if (parent.parentIsland !== B2_NULL_INDEX) {
        islandA.parentIsland = parent.parentIsland;
      }
      islandA = parent;
      islandIdA = parentId;
      parentId = islandA.parentIsland;
    }
  }
  let islandB = null;
  if (islandIdB !== B2_NULL_INDEX) {
    islandB = b2GetIsland(world, islandIdB);
    let parentId = islandB.parentIsland;
    while (islandB.parentIsland !== B2_NULL_INDEX) {
      const parent = b2GetIsland(world, parentId);
      if (parent.parentIsland !== B2_NULL_INDEX) {
        islandB.parentIsland = parent.parentIsland;
      }
      islandB = parent;
      islandIdB = parentId;
      parentId = islandB.parentIsland;
    }
  }
  if (islandA !== islandB && islandA !== null && islandB !== null) {
    islandB.parentIsland = islandIdA;
  }
  if (islandA !== null) {
    b2AddContactToIsland(world, islandIdA, contact);
  } else {
    b2AddContactToIsland(world, islandIdB, contact);
  }
}
function b2UnlinkContact(world, contact) {
  const islandId = contact.islandId;
  const island = b2GetIsland(world, islandId);
  if (contact.islandPrev !== B2_NULL_INDEX) {
    const prevContact = world.contactArray[contact.islandPrev];
    prevContact.islandNext = contact.islandNext;
  }
  if (contact.islandNext !== B2_NULL_INDEX) {
    const nextContact = world.contactArray[contact.islandNext];
    nextContact.islandPrev = contact.islandPrev;
  }
  if (island.headContact === contact.contactId) {
    island.headContact = contact.islandNext;
  }
  if (island.tailContact === contact.contactId) {
    island.tailContact = contact.islandPrev;
  }
  island.contactCount -= 1;
  island.constraintRemoveCount += 1;
  contact.islandId = B2_NULL_INDEX;
  contact.islandPrev = B2_NULL_INDEX;
  contact.islandNext = B2_NULL_INDEX;
  b2ValidateIsland(world, islandId);
}
function b2AddJointToIsland(world, islandId, joint) {
  const island = world.islandArray[islandId];
  if (island.headJoint !== B2_NULL_INDEX) {
    joint.islandNext = island.headJoint;
    const headJoint = b2GetJoint(world, island.headJoint);
    headJoint.islandPrev = joint.jointId;
  }
  island.headJoint = joint.jointId;
  if (island.tailJoint === B2_NULL_INDEX) {
    island.tailJoint = island.headJoint;
  }
  island.jointCount += 1;
  joint.islandId = islandId;
  b2ValidateIsland(world, islandId);
}
function b2LinkJoint(world, joint) {
  const bodyA = b2GetBody(world, joint.edges[0].bodyId);
  const bodyB = b2GetBody(world, joint.edges[1].bodyId);
  if (bodyA.setIndex === b2SetType.b2_awakeSet && bodyB.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeSolverSet(world, bodyB.setIndex);
  } else if (bodyB.setIndex === b2SetType.b2_awakeSet && bodyA.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeSolverSet(world, bodyA.setIndex);
  }
  let islandIdA = bodyA.islandId;
  let islandIdB = bodyB.islandId;
  if (islandIdA === islandIdB) {
    b2AddJointToIsland(world, islandIdA, joint);
    return;
  }
  let islandA = null;
  if (islandIdA !== B2_NULL_INDEX) {
    islandA = b2GetIsland(world, islandIdA);
    while (islandA.parentIsland !== B2_NULL_INDEX) {
      const parent = b2GetIsland(world, islandA.parentIsland);
      if (parent.parentIsland !== B2_NULL_INDEX) {
        islandA.parentIsland = parent.parentIsland;
      }
      islandIdA = islandA.parentIsland;
      islandA = parent;
    }
  }
  let islandB = null;
  if (islandIdB !== B2_NULL_INDEX) {
    islandB = b2GetIsland(world, islandIdB);
    while (islandB.parentIsland !== B2_NULL_INDEX) {
      const parent = b2GetIsland(world, islandB.parentIsland);
      if (parent.parentIsland !== B2_NULL_INDEX) {
        islandB.parentIsland = parent.parentIsland;
      }
      islandIdB = islandB.parentIsland;
      islandB = parent;
    }
  }
  if (islandA !== islandB && islandA !== null && islandB !== null) {
    islandB.parentIsland = islandIdA;
  }
  if (islandA !== null) {
    b2AddJointToIsland(world, islandIdA, joint);
  } else {
    b2AddJointToIsland(world, islandIdB, joint);
  }
}
function b2UnlinkJoint(world, joint) {
  const islandId = joint.islandId;
  const island = world.islandArray[islandId];
  if (joint.islandPrev !== B2_NULL_INDEX) {
    const prevJoint = b2GetJoint(world, joint.islandPrev);
    prevJoint.islandNext = joint.islandNext;
  }
  if (joint.islandNext !== B2_NULL_INDEX) {
    const nextJoint = b2GetJoint(world, joint.islandNext);
    nextJoint.islandPrev = joint.islandPrev;
  }
  if (island.headJoint === joint.jointId) {
    island.headJoint = joint.islandNext;
  }
  if (island.tailJoint === joint.jointId) {
    island.tailJoint = joint.islandPrev;
  }
  island.jointCount -= 1;
  island.constraintRemoveCount += 1;
  joint.islandId = B2_NULL_INDEX;
  joint.islandPrev = B2_NULL_INDEX;
  joint.islandNext = B2_NULL_INDEX;
  b2ValidateIsland(world, islandId);
}
function b2MergeIsland(world, island) {
  const rootId = island.parentIsland;
  const rootIsland = world.islandArray[rootId];
  let bodyId = island.headBody;
  while (bodyId !== B2_NULL_INDEX) {
    const body = b2GetBody(world, bodyId);
    body.islandId = rootId;
    bodyId = body.islandNext;
  }
  let contactId = island.headContact;
  while (contactId !== B2_NULL_INDEX) {
    const contact = world.contactArray[contactId];
    contact.islandId = rootId;
    contactId = contact.islandNext;
  }
  let jointId = island.headJoint;
  while (jointId !== B2_NULL_INDEX) {
    const joint = b2GetJoint(world, jointId);
    joint.islandId = rootId;
    jointId = joint.islandNext;
  }
  const tailBody = b2GetBody(world, rootIsland.tailBody);
  tailBody.islandNext = island.headBody;
  const headBody = b2GetBody(world, island.headBody);
  headBody.islandPrev = rootIsland.tailBody;
  rootIsland.tailBody = island.tailBody;
  rootIsland.bodyCount += island.bodyCount;
  if (rootIsland.headContact === B2_NULL_INDEX) {
    rootIsland.headContact = island.headContact;
    rootIsland.tailContact = island.tailContact;
    rootIsland.contactCount = island.contactCount;
  } else if (island.headContact !== B2_NULL_INDEX) {
    const tailContact = world.contactArray[rootIsland.tailContact];
    tailContact.islandNext = island.headContact;
    const headContact = world.contactArray[island.headContact];
    headContact.islandPrev = rootIsland.tailContact;
    rootIsland.tailContact = island.tailContact;
    rootIsland.contactCount += island.contactCount;
  }
  if (rootIsland.headJoint === B2_NULL_INDEX) {
    rootIsland.headJoint = island.headJoint;
    rootIsland.tailJoint = island.tailJoint;
    rootIsland.jointCount = island.jointCount;
  } else if (island.headJoint !== B2_NULL_INDEX) {
    const tailJoint = b2GetJoint(world, rootIsland.tailJoint);
    tailJoint.islandNext = island.headJoint;
    const headJoint = b2GetJoint(world, island.headJoint);
    headJoint.islandPrev = rootIsland.tailJoint;
    rootIsland.tailJoint = island.tailJoint;
    rootIsland.jointCount += island.jointCount;
  }
  rootIsland.constraintRemoveCount += island.constraintRemoveCount;
  b2ValidateIsland(world, rootId);
}
function b2MergeAwakeIslands(world) {
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const islandSims = awakeSet.islands.data;
  const awakeIslandCount = awakeSet.islands.count;
  const islands = world.islandArray;
  for (let i = 0; i < awakeIslandCount; ++i) {
    const islandId = islandSims[i].islandId;
    const island = islands[islandId];
    let rootId = islandId;
    let rootIsland = island;
    while (rootIsland.parentIsland !== B2_NULL_INDEX) {
      const parent = islands[rootIsland.parentIsland];
      if (parent.parentIsland !== B2_NULL_INDEX) {
        rootIsland.parentIsland = parent.parentIsland;
      }
      rootId = rootIsland.parentIsland;
      rootIsland = parent;
    }
    if (rootIsland !== island) {
      island.parentIsland = rootId;
    }
  }
  for (let i = awakeIslandCount - 1; i >= 0; --i) {
    const islandId = islandSims[i].islandId;
    const island = islands[islandId];
    if (island.parentIsland === B2_NULL_INDEX) {
      continue;
    }
    b2MergeIsland(world, island);
    b2DestroyIsland(world, islandId);
  }
  b2ValidateConnectivity(world);
}
function b2SplitIsland(world, baseId) {
  const baseIsland = world.islandArray[baseId];
  const setIndex = baseIsland.setIndex;
  if (setIndex !== b2SetType.b2_awakeSet) {
    return;
  }
  if (baseIsland.constraintRemoveCount === 0) {
    return;
  }
  b2ValidateIsland(world, baseId);
  const bodyCount = baseIsland.bodyCount;
  const bodies = world.bodyArray;
  const contacts = world.contactArray;
  const stack2 = [];
  const bodyIds = [];
  let nextBody = baseIsland.headBody;
  while (nextBody !== B2_NULL_INDEX) {
    bodyIds.push(nextBody);
    const body = bodies[nextBody];
    body.isMarked = false;
    nextBody = body.islandNext;
  }
  let nextContactId = baseIsland.headContact;
  while (nextContactId !== B2_NULL_INDEX) {
    const contact = contacts[nextContactId];
    contact.isMarked = false;
    nextContactId = contact.islandNext;
  }
  let nextJoint = baseIsland.headJoint;
  while (nextJoint !== B2_NULL_INDEX) {
    const joint = b2GetJoint(world, nextJoint);
    joint.isMarked = false;
    nextJoint = joint.islandNext;
  }
  b2DestroyIsland(world, baseId);
  for (let i = 0; i < bodyCount; ++i) {
    const seedIndex = bodyIds[i];
    const seed = bodies[seedIndex];
    if (seed.isMarked === true) {
      continue;
    }
    stack2.push(seedIndex);
    seed.isMarked = true;
    const island = b2CreateIsland(world, setIndex);
    const islandId = island.islandId;
    while (stack2.length > 0) {
      const bodyId = stack2.pop();
      const body = bodies[bodyId];
      body.islandId = islandId;
      if (island.tailBody !== B2_NULL_INDEX) {
        bodies[island.tailBody].islandNext = bodyId;
      }
      body.islandPrev = island.tailBody;
      body.islandNext = B2_NULL_INDEX;
      island.tailBody = bodyId;
      if (island.headBody === B2_NULL_INDEX) {
        island.headBody = bodyId;
      }
      island.bodyCount += 1;
      let contactKey = body.headContactKey;
      while (contactKey !== B2_NULL_INDEX) {
        const contactId = contactKey >> 1;
        const edgeIndex = contactKey & 1;
        const contact = world.contactArray[contactId];
        contactKey = contact.edges[edgeIndex].nextKey;
        if (contact.isMarked) {
          continue;
        }
        if (contact.flags & b2ContactFlags.b2_contactSensorFlag) {
          continue;
        }
        if ((contact.flags & b2ContactFlags.b2_contactTouchingFlag) === 0) {
          continue;
        }
        contact.isMarked = true;
        const otherEdgeIndex = edgeIndex ^ 1;
        const otherBodyId = contact.edges[otherEdgeIndex].bodyId;
        const otherBody = bodies[otherBodyId];
        if (otherBody.isMarked === false && otherBody.setIndex !== b2SetType.b2_staticSet) {
          stack2.push(otherBodyId);
          otherBody.isMarked = true;
        }
        contact.islandId = islandId;
        if (island.tailContact !== B2_NULL_INDEX) {
          const tailContact = world.contactArray[island.tailContact];
          tailContact.islandNext = contactId;
        }
        contact.islandPrev = island.tailContact;
        contact.islandNext = B2_NULL_INDEX;
        island.tailContact = contactId;
        if (island.headContact === B2_NULL_INDEX) {
          island.headContact = contactId;
        }
        island.contactCount += 1;
      }
      let jointKey = body.headJointKey;
      while (jointKey !== B2_NULL_INDEX) {
        const jointId = jointKey >> 1;
        const edgeIndex = jointKey & 1;
        const joint = b2GetJoint(world, jointId);
        jointKey = joint.edges[edgeIndex].nextKey;
        if (joint.isMarked) {
          continue;
        }
        joint.isMarked = true;
        const otherEdgeIndex = edgeIndex ^ 1;
        const otherBodyId = joint.edges[otherEdgeIndex].bodyId;
        const otherBody = bodies[otherBodyId];
        if (otherBody.setIndex === b2SetType.b2_disabledSet) {
          continue;
        }
        if (otherBody.isMarked === false && otherBody.setIndex === b2SetType.b2_awakeSet) {
          stack2.push(otherBodyId);
          otherBody.isMarked = true;
        }
        joint.islandId = islandId;
        if (island.tailJoint !== B2_NULL_INDEX) {
          const tailJoint = b2GetJoint(world, island.tailJoint);
          tailJoint.islandNext = jointId;
        }
        joint.islandPrev = island.tailJoint;
        joint.islandNext = B2_NULL_INDEX;
        island.tailJoint = jointId;
        if (island.headJoint === B2_NULL_INDEX) {
          island.headJoint = jointId;
        }
        island.jointCount += 1;
      }
    }
    b2ValidateIsland(world, islandId);
  }
}
function b2ValidateIsland(world, islandId) {
  if (!b2Validation) {
    return;
  }
  b2CheckIndex(world.islandArray, islandId);
  const island = world.islandArray[islandId];
  {
    const bodies = world.bodyArray;
    if (island.bodyCount > 1) {
    }
    let count = 0;
    let bodyId = island.headBody;
    while (bodyId != B2_NULL_INDEX) {
      b2CheckIndex(bodies, bodyId);
      const body = bodies[bodyId];
      count += 1;
      if (count == island.bodyCount) {
      }
      bodyId = body.islandNext;
    }
  }
  if (island.headContact != B2_NULL_INDEX) {
    if (island.contactCount > 1) {
    }
    let count = 0;
    let contactId = island.headContact;
    while (contactId != B2_NULL_INDEX) {
      b2CheckIndex(world.contactArray, contactId);
      const contact = world.contactArray[contactId];
      count += 1;
      if (count == island.contactCount) {
      }
      contactId = contact.islandNext;
    }
  } else {
  }
  if (island.headJoint != B2_NULL_INDEX) {
    if (island.jointCount > 1) {
    }
    let count = 0;
    let jointId = island.headJoint;
    while (jointId != B2_NULL_INDEX) {
      b2CheckIndex(world.jointArray, jointId);
      const joint = world.jointArray[jointId];
      count += 1;
      if (count == island.jointCount) {
      }
      jointId = joint.islandNext;
    }
  } else {
  }
}

// src/body_c.js
function b2MakeSweep(bodySim, out) {
  out.c1.x = bodySim.center0X;
  out.c1.y = bodySim.center0Y;
  out.c2.copy(bodySim.center);
  out.q1.copy(bodySim.rotation0);
  out.q2.copy(bodySim.transform.q);
  out.localCenter.copy(bodySim.localCenter);
  return out;
}
function b2GetBody(world, bodyId) {
  return world.bodyArray[bodyId];
}
function b2GetBodyFullId(world, bodyId) {
  return b2GetBody(world, bodyId.index1 - 1);
}
function b2GetBodyTransformQuick(world, body) {
  const set = world.solverSetArray[body.setIndex];
  const bodySim = set.sims.data[body.localIndex];
  return bodySim.transform;
}
function b2GetBodyTransform(world, bodyId) {
  const body = world.bodyArray[bodyId];
  return b2GetBodyTransformQuick(world, body);
}
function b2MakeBodyId(world, bodyId) {
  const body = world.bodyArray[bodyId];
  return new b2BodyId(bodyId + 1, world.worldId, body.revision);
}
function b2GetBodySim(world, body) {
  const set = world.solverSetArray[body.setIndex];
  return set.sims.data[body.localIndex];
}
function b2GetBodyState(world, body) {
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    return set.states.data[body.localIndex];
  }
  return null;
}
function b2CreateIslandForBody(world, setIndex, body) {
  const island = b2CreateIsland(world, setIndex);
  body.islandId = island.islandId;
  island.headBody = body.id;
  island.tailBody = body.id;
  island.bodyCount = 1;
}
function b2RemoveBodyFromIsland(world, body) {
  if (body.islandId === B2_NULL_INDEX) {
    return;
  }
  const islandId = body.islandId;
  const island = world.islandArray[islandId];
  if (body.islandPrev !== B2_NULL_INDEX) {
    const prevBody = b2GetBody(world, body.islandPrev);
    prevBody.islandNext = body.islandNext;
  }
  if (body.islandNext !== B2_NULL_INDEX) {
    const nextBody = b2GetBody(world, body.islandNext);
    nextBody.islandPrev = body.islandPrev;
  }
  island.bodyCount -= 1;
  let islandDestroyed = false;
  if (island.headBody === body.id) {
    island.headBody = body.islandNext;
    if (island.headBody === B2_NULL_INDEX) {
      b2DestroyIsland(world, island.islandId);
      islandDestroyed = true;
    }
  } else if (island.tailBody === body.id) {
    island.tailBody = body.islandPrev;
  }
  if (islandDestroyed === false) {
    b2ValidateIsland(world, islandId);
  }
  body.islandId = B2_NULL_INDEX;
  body.islandPrev = B2_NULL_INDEX;
  body.islandNext = B2_NULL_INDEX;
}
function b2DestroyBodyContacts(world, body, wakeBodies) {
  let edgeKey = body.headContactKey;
  while (edgeKey !== B2_NULL_INDEX) {
    const contactId = edgeKey >> 1;
    const edgeIndex = edgeKey & 1;
    const contact = world.contactArray[contactId];
    edgeKey = contact.edges[edgeIndex].nextKey;
    b2DestroyContact(world, contact, wakeBodies);
  }
  b2ValidateSolverSets(world);
}
function b2CreateBody(worldId, def) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2BodyId(0, 0, 0);
  }
  const isAwake = (def.isAwake || def.enableSleep === false) && def.isEnabled;
  let setId;
  if (def.isEnabled === false) {
    setId = b2SetType.b2_disabledSet;
  } else if (def.type === b2BodyType.b2_staticBody) {
    setId = b2SetType.b2_staticSet;
  } else if (isAwake === true) {
    setId = b2SetType.b2_awakeSet;
  } else {
    setId = b2AllocId(world.solverSetIdPool);
    if (setId === world.solverSetArray.length) {
      const set2 = new b2SolverSet();
      set2.setIndex = setId;
      world.solverSetArray.push(set2);
    } else {
    }
    world.solverSetArray[setId].setIndex = setId;
  }
  const bodyId = b2AllocId(world.bodyIdPool);
  const set = world.solverSetArray[setId];
  const bodySim = b2AddBodySim(set.sims);
  Object.assign(bodySim, {
    transform: new b2Transform(def.position, def.rotation),
    center: def.position.clone(),
    rotation0: def.rotation,
    center0X: def.position.x,
    center0Y: def.position.y,
    localCenter: new b2Vec2(),
    force: new b2Vec2(),
    torque: 0,
    mass: 0,
    invMass: 0,
    inertia: 0,
    invInertia: 0,
    minExtent: B2_HUGE,
    maxExtent: 0,
    linearDamping: def.linearDamping,
    angularDamping: def.angularDamping,
    gravityScale: def.gravityScale,
    bodyId,
    isBullet: def.isBullet,
    allowFastRotation: def.allowFastRotation,
    enlargeAABB: false,
    isFast: false,
    isSpeedCapped: false
  });
  if (setId === b2SetType.b2_awakeSet) {
    const bodyState = b2AddBodyState(set.states);
    Object.assign(bodyState, {
      linearVelocity: def.linearVelocity,
      angularVelocity: def.angularVelocity,
      deltaRotation: new b2Rot()
    });
  }
  while (bodyId >= world.bodyArray.length) {
    world.bodyArray.push(new b2Body());
  }
  const body = world.bodyArray[bodyId];
  Object.assign(body, {
    userData: def.userData,
    setIndex: setId,
    localIndex: set.sims.count - 1,
    revision: body.revision + 1,
    headShapeId: B2_NULL_INDEX,
    shapeCount: 0,
    headChainId: B2_NULL_INDEX,
    headContactKey: B2_NULL_INDEX,
    contactCount: 0,
    headJointKey: B2_NULL_INDEX,
    // PJB NOTE: combination of joint id (>> 1) and edge index (& 0x01)
    jointCount: 0,
    islandId: B2_NULL_INDEX,
    islandPrev: B2_NULL_INDEX,
    islandNext: B2_NULL_INDEX,
    bodyMoveIndex: B2_NULL_INDEX,
    id: bodyId,
    // PJB NOTE: body.id is bodyId (is index in worldBodyArray)
    sleepThreshold: def.sleepThreshold,
    sleepTime: 0,
    type: def.type,
    enableSleep: def.enableSleep,
    fixedRotation: def.fixedRotation,
    isSpeedCapped: false,
    isMarked: false,
    updateBodyMass: def.updateBodyMass
  });
  if (setId >= b2SetType.b2_awakeSet) {
    b2CreateIslandForBody(world, setId, body);
  }
  b2ValidateSolverSets(world);
  return new b2BodyId(bodyId + 1, world.worldId, body.revision);
}
function b2WakeBody(world, body) {
  if (body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeSolverSet(world, body.setIndex);
    return true;
  }
  return false;
}
function b2DestroyBody(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const wakeBodies = true;
  let edgeKey = body.headJointKey;
  while (edgeKey !== B2_NULL_INDEX) {
    const jointId = edgeKey >> 1;
    const edgeIndex = edgeKey & 1;
    const joint = world.jointArray[jointId];
    edgeKey = joint.edges[edgeIndex].nextKey;
    b2DestroyJointInternal(world, joint, wakeBodies);
  }
  b2DestroyBodyContacts(world, body, wakeBodies);
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    b2DestroyShapeProxy(shape, world.broadPhase);
    b2FreeId(world.shapeIdPool, shapeId);
    shape.id = B2_NULL_INDEX;
    shapeId = shape.nextShapeId;
  }
  let chainId = body.headChainId;
  while (chainId !== B2_NULL_INDEX) {
    const chain = world.chainArray[chainId];
    chain.shapeIndices = null;
    b2FreeId(world.chainIdPool, chainId);
    chain.id = B2_NULL_INDEX;
    chainId = chain.nextChainId;
  }
  b2RemoveBodyFromIsland(world, body);
  const set = world.solverSetArray[body.setIndex];
  const movedIndex = b2RemoveBodySim(set.sims, body.localIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedSim = set.sims.data[body.localIndex];
    const movedId = movedSim.bodyId;
    const movedBody = world.bodyArray[movedId];
    movedBody.localIndex = body.localIndex;
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const result = b2RemoveBodyState(set.states, body.localIndex);
  } else if (set.setIndex >= b2SetType.b2_firstSleepingSet && set.sims.count == 0) {
    b2DestroySolverSet(world, set.setIndex);
  }
  b2FreeId(world.bodyIdPool, body.id);
  body.setIndex = B2_NULL_INDEX;
  body.localIndex = B2_NULL_INDEX;
  body.id = B2_NULL_INDEX;
  b2ValidateSolverSets(world);
}
function b2Body_GetContactCapacity(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return 0;
  }
  const body = b2GetBodyFullId(world, bodyId);
  return body.contactCount;
}
function b2Body_GetContactData(bodyId, contactData, capacity) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return 0;
  }
  const body = b2GetBodyFullId(world, bodyId);
  let contactKey = body.headContactKey;
  let index = 0;
  while (contactKey !== B2_NULL_INDEX && index < capacity) {
    const contactId = contactKey >> 1;
    const edgeIndex = contactKey & 1;
    const contact = world.contactArray[contactId];
    if (contact.flags & b2ContactFlags.b2_contactTouchingFlag) {
      const shapeA = world.shapeArray[contact.shapeIdA];
      const shapeB = world.shapeArray[contact.shapeIdB];
      contactData[index].shapeIdA = new b2ShapeId(shapeA.id + 1, bodyId.world0, shapeA.revision);
      contactData[index].shapeIdB = new b2ShapeId(shapeB.id + 1, bodyId.world0, shapeB.revision);
      const contactSim = b2GetContactSim(world, contact);
      contactData[index].manifold = contactSim.manifold;
      index += 1;
    }
    contactKey = contact.edges[edgeIndex].nextKey;
  }
  return index;
}
function b2Body_ComputeAABB(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return new b2AABB();
  }
  const body = b2GetBodyFullId(world, bodyId);
  if (body.headShapeId === B2_NULL_INDEX) {
    const transform = b2GetBodyTransform(world, body.id);
    const aabb2 = new b2AABB(transform.p.x, transform.p.y, transform.p.x, transform.p.y);
    return aabb2;
  }
  let shape = world.shapeArray[body.headShapeId];
  let aabb = shape.aabb;
  while (shape.nextShapeId !== B2_NULL_INDEX) {
    shape = world.shapeArray[shape.nextShapeId];
    aabb = b2AABB_Union(aabb, shape.aabb);
  }
  return aabb;
}
function b2UpdateBodyMassData(world, body) {
  const bodySim = b2GetBodySim(world, body);
  bodySim.mass = 0;
  bodySim.invMass = 0;
  bodySim.inertia = 0;
  bodySim.invInertia = 0;
  bodySim.minExtent = B2_HUGE;
  bodySim.maxExtent = 0;
  if (body.type !== b2BodyType.b2_dynamicBody) {
    bodySim.center = bodySim.transform.p.clone();
    if (body.type === b2BodyType.b2_kinematicBody) {
      let shapeId2 = body.headShapeId;
      while (shapeId2 !== B2_NULL_INDEX) {
        const s = world.shapeArray[shapeId2];
        shapeId2 = s.nextShapeId;
        const extent = b2ComputeShapeExtent(s, new b2Vec2());
        bodySim.minExtent = Math.min(bodySim.minExtent, extent.minExtent);
        bodySim.maxExtent = Math.max(bodySim.maxExtent, extent.maxExtent);
      }
    }
    return;
  }
  let localCenter = new b2Vec2();
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const s = world.shapeArray[shapeId];
    shapeId = s.nextShapeId;
    if (s.density === 0) {
      continue;
    }
    const massData = b2ComputeShapeMass(s);
    bodySim.mass += massData.mass;
    localCenter = b2MulAdd(localCenter, massData.mass, massData.center);
    bodySim.inertia += massData.rotationalInertia;
  }
  if (bodySim.mass > 0) {
    bodySim.invMass = 1 / bodySim.mass;
    localCenter = b2MulSV(bodySim.invMass, localCenter);
  }
  if (bodySim.inertia > 0 && body.fixedRotation === false) {
    bodySim.inertia -= bodySim.mass * b2Dot(localCenter, localCenter);
    bodySim.invInertia = 1 / bodySim.inertia;
  } else {
    bodySim.inertia = 0;
    bodySim.invInertia = 0;
  }
  const oldCenter = bodySim.center.clone();
  bodySim.localCenter = localCenter;
  bodySim.center = b2TransformPoint(bodySim.transform, bodySim.localCenter);
  const state = b2GetBodyState(world, body);
  if (state !== null) {
    const deltaLinear = b2CrossSV(state.angularVelocity, b2Sub(bodySim.center, oldCenter));
    state.linearVelocity = b2Add(state.linearVelocity, deltaLinear);
  }
  shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const s = world.shapeArray[shapeId];
    shapeId = s.nextShapeId;
    const extent = b2ComputeShapeExtent(s, localCenter);
    bodySim.minExtent = Math.min(bodySim.minExtent, extent.minExtent);
    bodySim.maxExtent = Math.max(bodySim.maxExtent, extent.maxExtent);
  }
}
function b2Body_GetPosition(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return transform.p;
}
function b2Body_GetRotation(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return transform.q;
}
function b2Body_GetTransform(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return b2GetBodyTransformQuick(world, body);
}
function b2Body_GetLocalPoint(bodyId, worldPoint) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return b2InvTransformPoint(transform, worldPoint);
}
function b2Body_GetWorldPoint(bodyId, localPoint) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return b2TransformPoint(transform, localPoint);
}
function b2Body_GetLocalVector(bodyId, worldVector) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return b2InvRotateVector(transform.q, worldVector);
}
function b2Body_GetWorldVector(bodyId, localVector) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  return b2RotateVector(transform.q, localVector);
}
function b2Body_SetTransform(bodyId, position, rotation) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.transform.p = position;
  if (rotation !== void 0) {
    bodySim.transform.q = rotation;
  }
  bodySim.center = b2TransformPoint(bodySim.transform, bodySim.localCenter);
  bodySim.rotation0 = bodySim.transform.q;
  bodySim.center0X = bodySim.center.x;
  bodySim.center0Y = bodySim.center.y;
  const broadPhase = world.broadPhase;
  const transform = bodySim.transform;
  const margin = b2_aabbMargin;
  const speculativeDistance = b2_speculativeDistance;
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    const aabb = b2ComputeShapeAABB(shape, transform);
    aabb.lowerBoundX -= speculativeDistance;
    aabb.lowerBoundY -= speculativeDistance;
    aabb.upperBoundX += speculativeDistance;
    aabb.upperBoundY += speculativeDistance;
    shape.aabb = aabb;
    if (b2AABB_Contains(shape.fatAABB, aabb) === false) {
      const fatAABB = new b2AABB(
        aabb.lowerBoundX - margin,
        aabb.lowerBoundY - margin,
        aabb.upperBoundX + margin,
        aabb.upperBoundY + margin
      );
      shape.fatAABB = fatAABB;
      if (shape.proxyKey !== B2_NULL_INDEX) {
        b2BroadPhase_MoveProxy(broadPhase, shape.proxyKey, fatAABB);
      }
    }
    shapeId = shape.nextShapeId;
  }
}
function b2Body_GetLinearVelocity(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const state = b2GetBodyState(world, body);
  if (state !== null) {
    return state.linearVelocity.clone();
  }
  return new b2Vec2();
}
function b2Body_GetAngularVelocity(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const state = b2GetBodyState(world, body);
  if (state !== null) {
    return state.angularVelocity;
  }
  return 0;
}
function b2Body_SetLinearVelocity(bodyId, linearVelocity) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (body.type == b2BodyType.b2_staticBody) {
    return;
  }
  if (b2LengthSquared(linearVelocity) > 0) {
    b2WakeBody(world, body);
  }
  const state = b2GetBodyState(world, body);
  if (state === null) {
    return;
  }
  state.linearVelocity = linearVelocity;
}
function b2Body_SetAngularVelocity(bodyId, angularVelocity) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (body.type == b2BodyType.b2_staticBody || body.fixedRotation) {
    return;
  }
  if (angularVelocity !== 0) {
    b2WakeBody(world, body);
  }
  const state = b2GetBodyState(world, body);
  if (state === null) {
    return;
  }
  state.angularVelocity = angularVelocity;
}
function b2Body_ApplyForce(bodyId, force, point, wake) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const bodySim = b2GetBodySim(world, body);
    bodySim.force = b2Add(bodySim.force, force);
    bodySim.torque += b2Cross(b2Sub(point, bodySim.center), force);
  }
}
function b2Body_ApplyForceToCenter(bodyId, force, wake) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const bodySim = b2GetBodySim(world, body);
    bodySim.force = b2Add(bodySim.force, force);
  }
}
function b2Body_ApplyTorque(bodyId, torque, wake) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const bodySim = b2GetBodySim(world, body);
    bodySim.torque += torque;
  }
}
function b2Body_ApplyLinearImpulse(bodyId, impulse, point, wake) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const localIndex = body.localIndex;
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    const state = set.states.data[localIndex];
    const bodySim = set.sims.data[localIndex];
    state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
    state.angularVelocity += bodySim.invInertia * b2Cross(b2Sub(point, bodySim.center), impulse);
  }
}
function b2Body_ApplyLinearImpulseToCenter(bodyId, impulse, wake) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const localIndex = body.localIndex;
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    const state = set.states.data[localIndex];
    const bodySim = set.sims.data[localIndex];
    state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
  }
}
function b2Body_ApplyAngularImpulse(bodyId, impulse, wake) {
  const world = b2GetWorld(bodyId.world0);
  const id = bodyId.index1 - 1;
  const body = world.bodyArray[id];
  if (wake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  }
  if (body.setIndex === b2SetType.b2_awakeSet) {
    const localIndex = body.localIndex;
    const set = world.solverSetArray[b2SetType.b2_awakeSet];
    const state = set.states.data[localIndex];
    const sim = set.sims.data[localIndex];
    state.angularVelocity += sim.invInertia * impulse;
  }
}
function b2Body_GetType(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.type;
}
function b2Body_SetType(bodyId, type) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const originalType = body.type;
  if (originalType === type) {
    return;
  }
  if (body.setIndex === b2SetType.b2_disabledSet) {
    body.type = type;
    b2UpdateBodyMassData(world, body);
    return;
  }
  const wakeBodies = false;
  b2DestroyBodyContacts(world, body, wakeBodies);
  b2WakeBody(world, body);
  {
    let jointKey = body.headJointKey;
    while (jointKey !== B2_NULL_INDEX) {
      const jointId = jointKey >> 1;
      const edgeIndex = jointKey & 1;
      const joint = world.jointArray[jointId];
      if (joint.islandId !== B2_NULL_INDEX) {
        b2UnlinkJoint(world, joint);
      }
      const bodyA = world.bodyArray[joint.edges[0].bodyId];
      const bodyB = world.bodyArray[joint.edges[1].bodyId];
      b2WakeBody(world, bodyA);
      b2WakeBody(world, bodyB);
      jointKey = joint.edges[edgeIndex].nextKey;
    }
  }
  body.type = type;
  if (originalType === b2BodyType.staticBody) {
    const staticSet = world.solverSetArray[b2SetType.b2_staticSet];
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    b2TransferBody(world, awakeSet, staticSet, body);
    b2CreateIslandForBody(world, b2SetType.b2_awakeSet, body);
    let jointKey = body.headJointKey;
    while (jointKey !== B2_NULL_INDEX) {
      const jointId = jointKey >> 1;
      const edgeIndex = jointKey & 1;
      const joint = world.jointArray[jointId];
      if (joint.setIndex === b2SetType.b2_staticSet) {
        b2TransferJoint(world, awakeSet, staticSet, joint);
      } else if (joint.setIndex === b2SetType.b2_awakeSet) {
        b2TransferJoint(world, staticSet, awakeSet, joint);
        b2TransferJoint(world, awakeSet, staticSet, joint);
      } else {
      }
      jointKey = joint.edges[edgeIndex].nextKey;
    }
    const transform = b2GetBodyTransformQuick(world, body);
    let shapeId = body.headShapeId;
    while (shapeId !== B2_NULL_INDEX) {
      const shape = world.shapeArray[shapeId];
      shapeId = shape.nextShapeId;
      b2DestroyShapeProxy(shape, world.broadPhase);
      const forcePairCreation = true;
      const proxyType = type;
      b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
    }
  } else if (type === b2BodyType.b2_staticBody) {
    const staticSet = world.solverSetArray[b2SetType.b2_staticSet];
    const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
    b2TransferBody(world, staticSet, awakeSet, body);
    b2RemoveBodyFromIsland(world, body);
    let jointKey = body.headJointKey;
    while (jointKey !== B2_NULL_INDEX) {
      const jointId = jointKey >> 1;
      const edgeIndex = jointKey & 1;
      const joint = world.jointArray[jointId];
      jointKey = joint.edges[edgeIndex].nextKey;
      const otherEdgeIndex = edgeIndex ^ 1;
      const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];
      if (joint.setIndex === b2SetType.b2_disabledSet) {
        continue;
      }
      if (otherBody.setIndex === b2SetType.b2_staticSet) {
        b2TransferJoint(world, staticSet, awakeSet, joint);
      } else {
        b2TransferJoint(world, staticSet, awakeSet, joint);
        b2TransferJoint(world, awakeSet, staticSet, joint);
      }
    }
    const transform = b2GetBodyTransformQuick(world, body);
    let shapeId = body.headShapeId;
    while (shapeId !== B2_NULL_INDEX) {
      const shape = world.shapeArray[shapeId];
      shapeId = shape.nextShapeId;
      b2DestroyShapeProxy(shape, world.broadPhase);
      const forcePairCreation = true;
      b2CreateShapeProxy(shape, world.broadPhase, b2BodyType.b2_staticBody, transform, forcePairCreation);
    }
  } else {
    const transform = b2GetBodyTransformQuick(world, body);
    let shapeId = body.headShapeId;
    while (shapeId !== B2_NULL_INDEX) {
      const shape = world.shapeArray[shapeId];
      shapeId = shape.nextShapeId;
      b2DestroyShapeProxy(shape, world.broadPhase);
      const proxyType = type;
      const forcePairCreation = true;
      b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
    }
  }
  {
    let jointKey = body.headJointKey;
    while (jointKey !== B2_NULL_INDEX) {
      const jointId = jointKey >> 1;
      const edgeIndex = jointKey & 1;
      const joint = world.jointArray[jointId];
      jointKey = joint.edges[edgeIndex].nextKey;
      const otherEdgeIndex = edgeIndex ^ 1;
      const otherBodyId = joint.edges[otherEdgeIndex].bodyId;
      const otherBody = world.bodyArray[otherBodyId];
      if (otherBody.setIndex === b2SetType.b2_disabledSet) {
        continue;
      }
      if (body.type === b2BodyType.b2_staticBody && otherBody.type === b2BodyType.b2_staticBody) {
        continue;
      }
      b2LinkJoint(world, joint);
    }
  }
  b2UpdateBodyMassData(world, body);
  b2ValidateConnectivity(world);
  b2ValidateSolverSets(world);
}
function b2Body_SetUserData(bodyId, userData) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  body.userData = userData;
}
function b2Body_GetUserData(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.userData;
}
function b2Body_GetMass(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.mass;
}
function b2Body_GetInertiaTensor(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.inertia;
}
function b2Body_GetLocalCenterOfMass(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.localCenter.clone();
}
function b2Body_GetWorldCenterOfMass(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.center.clone();
}
function b2Body_SetMassData(bodyId, massData) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.mass = massData.mass;
  bodySim.inertia = massData.rotationalInertia;
  bodySim.localCenter = massData.center;
  const center = b2TransformPoint(bodySim.transform, massData.center);
  bodySim.center = center;
  bodySim.center0X = center.x;
  bodySim.center0Y = center.y;
  bodySim.invMass = bodySim.mass > 0 ? 1 / bodySim.mass : 0;
  bodySim.invInertia = bodySim.inertia > 0 ? 1 / bodySim.inertia : 0;
}
function b2Body_GetMassData(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  const massData = new b2MassData();
  massData.mass = bodySim.mass;
  massData.center = bodySim.localCenter;
  massData.rotationalInertia = bodySim.inertia;
  return massData;
}
function b2Body_ApplyMassFromShapes(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  b2UpdateBodyMassData(world, body);
}
function b2Body_SetLinearDamping(bodyId, linearDamping) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.linearDamping = linearDamping;
}
function b2Body_GetLinearDamping(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.linearDamping;
}
function b2Body_SetAngularDamping(bodyId, angularDamping) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.angularDamping = angularDamping;
}
function b2Body_GetAngularDamping(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.angularDamping;
}
function b2Body_SetGravityScale(bodyId, gravityScale) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.gravityScale = gravityScale;
}
function b2Body_GetGravityScale(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.gravityScale;
}
function b2Body_IsAwake(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.setIndex === b2SetType.b2_awakeSet;
}
function b2Body_SetAwake(bodyId, awake) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  if (awake && body.setIndex >= b2SetType.b2_firstSleepingSet) {
    b2WakeBody(world, body);
  } else if (awake === false && body.setIndex === b2SetType.b2_awakeSet) {
    const island = world.islandArray[body.islandId];
    if (island.constraintRemoveCount > 0) {
      b2SplitIsland(world, body.islandId);
    }
    b2TrySleepIsland(world, body.islandId);
  }
}
function b2Body_IsEnabled(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.setIndex !== b2SetType.b2_disabledSet;
}
function b2Body_IsSleepEnabled(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.enableSleep;
}
function b2Body_SetSleepThreshold(bodyId, sleepVelocity) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  body.sleepThreshold = sleepVelocity;
}
function b2Body_GetSleepThreshold(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.sleepThreshold;
}
function b2Body_EnableSleep(bodyId, enableSleep) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  body.enableSleep = enableSleep;
  if (enableSleep === false) {
    b2WakeBody(world, body);
  }
}
function b2Body_Disable(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  if (body.setIndex === b2SetType.b2_disabledSet) {
    return;
  }
  const wakeBodies = true;
  b2DestroyBodyContacts(world, body, wakeBodies);
  b2RemoveBodyFromIsland(world, body);
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    shapeId = shape.nextShapeId;
    b2DestroyShapeProxy(shape, world.broadPhase);
  }
  const set = world.solverSetArray[body.setIndex];
  const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
  b2TransferBody(world, disabledSet, set, body);
  let jointKey = body.headJointKey;
  while (jointKey !== B2_NULL_INDEX) {
    const jointId = jointKey >> 1;
    const edgeIndex = jointKey & 1;
    const joint = world.jointArray[jointId];
    jointKey = joint.edges[edgeIndex].nextKey;
    if (joint.setIndex === b2SetType.b2_disabledSet) {
      continue;
    }
    if (joint.islandId !== B2_NULL_INDEX) {
      b2UnlinkJoint(world, joint);
    }
    const jointSet = world.solverSetArray[joint.setIndex];
    b2TransferJoint(world, disabledSet, jointSet, joint);
  }
  b2ValidateConnectivity(world);
  b2ValidateSolverSets(world);
}
function b2Body_Enable(bodyId) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  if (body.setIndex !== b2SetType.b2_disabledSet) {
    return;
  }
  const disabledSet = world.solverSetArray[b2SetType.b2_disabledSet];
  const setId = body.type === b2BodyType.b2_staticBody ? b2SetType.b2_staticSet : b2SetType.b2_awakeSet;
  const targetSet = world.solverSetArray[setId];
  b2TransferBody(world, targetSet, disabledSet, body);
  const transform = b2GetBodyTransformQuick(world, body);
  const proxyType = body.type;
  const forcePairCreation = true;
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    shapeId = shape.nextShapeId;
    b2CreateShapeProxy(shape, world.broadPhase, proxyType, transform, forcePairCreation);
  }
  if (setId !== b2SetType.b2_staticSet) {
    b2CreateIslandForBody(world, setId, body);
  }
  let jointKey = body.headJointKey;
  while (jointKey !== B2_NULL_INDEX) {
    const jointId = jointKey >> 1;
    const edgeIndex = jointKey & 1;
    const joint = world.jointArray[jointId];
    jointKey = joint.edges[edgeIndex].nextKey;
    const bodyA = world.bodyArray[joint.edges[0].bodyId];
    const bodyB = world.bodyArray[joint.edges[1].bodyId];
    if (bodyA.setIndex === b2SetType.b2_disabledSet || bodyB.setIndex === b2SetType.b2_disabledSet) {
      continue;
    }
    let jointSetId;
    if (bodyA.setIndex === b2SetType.b2_staticSet && bodyB.setIndex === b2SetType.b2_staticSet) {
      jointSetId = b2SetType.b2_staticSet;
    } else if (bodyA.setIndex === b2SetType.b2_staticSet) {
      jointSetId = bodyB.setIndex;
    } else {
      jointSetId = bodyA.setIndex;
    }
    const jointSet = world.solverSetArray[jointSetId];
    b2TransferJoint(world, jointSet, disabledSet, joint);
    if (jointSetId !== b2SetType.b2_staticSet) {
      b2LinkJoint(world, joint);
    }
  }
  b2ValidateConnectivity(world);
  b2ValidateSolverSets(world);
}
function b2Body_SetFixedRotation(bodyId, flag) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  if (body.fixedRotation !== flag) {
    body.fixedRotation = flag;
    const state = b2GetBodyState(world, body);
    if (state !== null) {
      state.angularVelocity = 0;
    }
    b2UpdateBodyMassData(world, body);
  }
}
function b2Body_IsFixedRotation(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.fixedRotation;
}
function b2Body_SetBullet(bodyId, flag) {
  const world = b2GetWorldLocked(bodyId.world0);
  if (world === null) {
    return;
  }
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  bodySim.isBullet = flag;
}
function b2Body_IsBullet(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  const bodySim = b2GetBodySim(world, body);
  return bodySim.isBullet;
}
function b2Body_EnableHitEvents(bodyId, enableHitEvents) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  let shapeId = body.headShapeId;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    shape.enableHitEvents = enableHitEvents;
    shapeId = shape.nextShapeId;
  }
}
function b2Body_GetShapeCount(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.shapeCount;
}
function b2Body_GetShapes(bodyId, shapeArray) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  let shapeId = body.headShapeId;
  let shapeCount = 0;
  while (shapeId !== B2_NULL_INDEX) {
    const shape = world.shapeArray[shapeId];
    const id = new b2ShapeId(shape.id + 1, bodyId.world0, shape.revision);
    shapeArray[shapeCount] = id;
    shapeCount += 1;
    shapeId = shape.nextShapeId;
  }
  return shapeCount;
}
function b2Body_GetJointCount(bodyId) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  return body.jointCount;
}
function b2Body_GetJoints(bodyId, jointArray, capacity) {
  const world = b2GetWorld(bodyId.world0);
  const body = b2GetBodyFullId(world, bodyId);
  let jointKey = body.headJointKey;
  let jointCount = 0;
  while (jointKey !== B2_NULL_INDEX && jointCount < capacity) {
    const jointId = jointKey >> 1;
    const edgeIndex = jointKey & 1;
    const joint = b2GetJoint(world, jointId);
    const id = new b2JointId();
    id.index1 = jointId + 1;
    id.world0 = bodyId.world0;
    id.revision = joint.revision;
    jointArray[jointCount] = id;
    jointCount += 1;
    jointKey = joint.edges[edgeIndex].nextKey;
  }
  return jointCount;
}
function b2ShouldBodiesCollide(world, bodyA, bodyB) {
  if (bodyA.type !== b2BodyType.b2_dynamicBody && bodyB.type !== b2BodyType.b2_dynamicBody) {
    return false;
  }
  let jointKey;
  let otherBodyId;
  if (bodyA.jointCount < bodyB.jointCount) {
    jointKey = bodyA.headJointKey;
    otherBodyId = bodyB.id;
  } else {
    jointKey = bodyB.headJointKey;
    otherBodyId = bodyA.id;
  }
  while (jointKey !== B2_NULL_INDEX) {
    const jointId = jointKey >> 1;
    const edgeIndex = jointKey & 1;
    const otherEdgeIndex = edgeIndex ^ 1;
    const joint = b2GetJoint(world, jointId);
    if (joint.collideConnected === false && joint.edges[otherEdgeIndex].bodyId === otherBodyId) {
      return false;
    }
    jointKey = joint.edges[edgeIndex].nextKey;
  }
  return true;
}
function resetProperties(obj) {
  const resetProperty = (item) => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item).forEach((key) => {
        switch (typeof item[key]) {
          case "number":
            item[key] = 0;
            break;
          case "boolean":
            item[key] = false;
            break;
          case "string":
            item[key] = "";
            break;
          case "object":
            if (Array.isArray(item[key])) {
            } else if (item[key] !== null) {
              resetProperty(item[key]);
            } else {
              item[key] = null;
            }
            break;
        }
      });
    }
  };
  resetProperty(obj);
}

// src/include/body_h.js
var b2Body = class {
  constructor() {
    this.userData = null;
    this.setIndex = 0;
    this.localIndex = 0;
    this.headContactKey = 0;
    this.contactCount = 0;
    this.headShapeId = 0;
    this.shapeCount = 0;
    this.headChainId = 0;
    this.headJointKey = B2_NULL_INDEX;
    this.jointCount = 0;
    this.islandId = 0;
    this.islandPrev = 0;
    this.islandNext = 0;
    this.sleepThreshold = 0;
    this.sleepTime = 0;
    this.bodyMoveIndex = 0;
    this.id = B2_NULL_INDEX;
    this.type = b2BodyType.b2_staticBody;
    this.revision = 0;
    this.enableSleep = false;
    this.fixedRotation = false;
    this.isSpeedCapped = false;
    this.isMarked = false;
    this.updateBodyMass = false;
  }
};
var b2BodyState = class {
  constructor() {
    this.linearVelocity = new b2Vec2(0, 0);
    this.angularVelocity = 0;
    this.flags = 0;
    this.deltaPosition = new b2Vec2(0, 0);
    this.deltaRotation = new b2Rot(1, 0);
  }
};
var b2BodySim = class {
  constructor() {
    this.transform = new b2Transform();
    this.center = new b2Vec2(0, 0);
    this.rotation0 = new b2Rot(1, 0);
    this.center0X = 0;
    this.center0Y = 0;
    this.localCenter = new b2Vec2(0, 0);
    this.force = new b2Vec2(0, 0);
    this.torque = 0;
    this.mass = 0;
    this.invMass = 0;
    this.inertia = 0;
    this.invInertia = 0;
    this.minExtent = 0;
    this.maxExtent = 0;
    this.linearDamping = 0;
    this.angularDamping = 0;
    this.gravityScale = 0;
    this.bodyId = 0;
    this.isFast = false;
    this.isBullet = false;
    this.isSpeedCapped = false;
    this.allowFastRotation = false;
    this.enlargeAABB = false;
  }
  copyTo(dst) {
    dst.transform = this.transform.deepClone();
    dst.center = this.center.clone();
    dst.rotation0 = this.rotation0.clone();
    dst.center0X = this.center0X;
    dst.center0Y = this.center0Y;
    dst.localCenter = this.localCenter.clone();
    dst.force = this.force.clone();
    dst.torque = this.torque;
    dst.mass = this.mass;
    dst.invMass = this.invMass;
    dst.inertia = this.inertia;
    dst.invInertia = this.invInertia;
    dst.minExtent = this.minExtent;
    dst.maxExtent = this.maxExtent;
    dst.linearDamping = this.linearDamping;
    dst.angularDamping = this.angularDamping;
    dst.gravityScale = this.gravityScale;
    dst.bodyId = this.bodyId;
    dst.isFast = this.isFast;
    dst.isBullet = this.isBullet;
    dst.isSpeedCapped = this.isSpeedCapped;
    dst.allowFastRotation = this.allowFastRotation;
    dst.enlargeAABB = this.enlargeAABB;
  }
};

// src/block_array_c.js
var B2_INITIAL_CAPACITY = 16;
var b2BodySimArray = class {
  constructor(capacity = 0) {
    this.data = [];
    this.count = 0;
    this.capacity = capacity;
  }
};
var b2BodyStateArray = class {
  constructor(capacity = 0) {
    this.data = [];
    this.count = 0;
    this.capacity = capacity;
  }
};
var b2ContactArray = class {
  constructor(capacity = 0) {
    this.data = [];
    this.count = 0;
    this.capacity = capacity;
  }
};
var b2IslandArray = class {
  constructor(capacity = 0) {
    this.data = [];
    this.count = 0;
    this.capacity = capacity;
  }
};
var b2JointArray = class {
  constructor(capacity = 0) {
    this.data = [];
    this.count = 0;
    this.capacity = capacity;
  }
};
function b2CreateBodySimArray(capacity) {
  const array = new b2BodySimArray(capacity);
  if (capacity > 0) {
    array.data = b2Alloc(capacity, () => {
      return new b2BodySim();
    });
    return array;
  }
  array.data = null;
  return array;
}
function b2CreateContactArray(capacity) {
  const array = new b2ContactArray(capacity);
  if (capacity > 0) {
    array.data = b2Alloc(capacity, () => {
      return new b2ContactSim();
    });
    return array;
  }
  array.data = null;
  return array;
}
function b2CreateJointArray(capacity) {
  const array = new b2JointArray(capacity);
  if (capacity > 0) {
    array.data = b2Alloc(capacity, () => {
      return new b2JointSim();
    });
    return array;
  }
  array.data = null;
  return array;
}
function b2AddBodySim(array) {
  if (array.capacity === 0) {
    array.data = b2Alloc(B2_INITIAL_CAPACITY, () => {
      return new b2BodySim();
    });
    array.capacity = B2_INITIAL_CAPACITY;
    array.count = 0;
  } else if (array.count === array.capacity) {
    const newCapacity = 2 * array.capacity;
    b2Grow(array.data, newCapacity, () => {
      return new b2BodySim();
    });
    array.capacity = newCapacity;
  } else {
    resetProperties(array.data[array.count]);
  }
  array.count += 1;
  return array.data[array.count - 1];
}
function b2AddBodyState(array) {
  if (array.capacity === 0) {
    array.data = b2Alloc(B2_INITIAL_CAPACITY, () => {
      return new b2BodyState();
    });
    array.capacity = B2_INITIAL_CAPACITY;
    array.count = 0;
  } else if (array.count === array.capacity) {
    const newCapacity = 2 * array.capacity;
    b2Grow(array.data, newCapacity, () => {
      return new b2BodyState();
    });
    array.capacity = newCapacity;
  } else {
    resetProperties(array.data[array.count]);
  }
  array.count += 1;
  return array.data[array.count - 1];
}
function b2AddContact(array) {
  if (array.capacity === 0) {
    array.data = b2Alloc(B2_INITIAL_CAPACITY, () => {
      return new b2ContactSim();
    });
    array.capacity = B2_INITIAL_CAPACITY;
    array.count = 0;
  } else if (array.count === array.capacity) {
    const newCapacity = 8 * array.capacity;
    b2Grow(array.data, newCapacity, () => {
      return new b2ContactSim();
    });
    array.capacity = newCapacity;
  } else {
    const sim = array.data[array.count];
    resetProperties(sim);
    sim._bodyIdA = sim._bodyIdB = B2_NULL_INDEX;
  }
  array.count += 1;
  return array.data[array.count - 1];
}
function b2AddJoint(array) {
  if (array.capacity === 0) {
    array.data = b2Alloc(B2_INITIAL_CAPACITY, () => {
      return new b2JointSim();
    });
    array.capacity = B2_INITIAL_CAPACITY;
    array.count = 0;
  } else if (array.count === array.capacity) {
    const newCapacity = 2 * array.capacity;
    b2Grow(array.data, newCapacity, () => {
      return new b2JointSim();
    });
    array.capacity = newCapacity;
  } else {
    resetProperties(array.data[array.count]);
  }
  array.count += 1;
  return array.data[array.count - 1];
}
function b2AddIsland(array) {
  if (array.capacity === 0) {
    array.data = b2Alloc(B2_INITIAL_CAPACITY, () => {
      return new b2IslandSim();
    });
    array.capacity = B2_INITIAL_CAPACITY;
    array.count = 0;
  } else if (array.count === array.capacity) {
    const newCapacity = 2 * array.capacity;
    b2Grow(array.data, newCapacity, () => {
      return new b2IslandSim();
    });
    array.capacity = newCapacity;
  } else {
    resetProperties(array.data[array.count]);
  }
  array.count += 1;
  array.data[array.count - 1].islandId = B2_NULL_INDEX;
  return array.data[array.count - 1];
}
function removeArrayIndex(array, index) {
  if (index < array.count - 1) {
    const swapA = array.data[array.count - 1];
    const swapB = array.data[index];
    array.data[index] = swapA;
    array.data[array.count - 1] = swapB;
    array.count -= 1;
    return array.count;
  }
  array.count -= 1;
  return B2_NULL_INDEX;
}
function b2RemoveBodySim(array, index) {
  return removeArrayIndex(array, index);
}
function b2RemoveBodyState(array, index) {
  return removeArrayIndex(array, index);
}
function b2RemoveContact(array, index) {
  return removeArrayIndex(array, index);
}
function b2RemoveJoint(array, index) {
  return removeArrayIndex(array, index);
}
function b2RemoveIsland(array, index) {
  return removeArrayIndex(array, index);
}

// src/manifold_c.js
var B2_MAKE_ID = (A, B) => (A & 255) << 8 | B & 255;
var xf = new b2Transform(new b2Vec2(), new b2Rot());
var xf1 = new b2Transform(new b2Vec2(), new b2Rot());
var p12 = new b2Vec2();
var p2 = new b2Vec2();
var q1 = new b2Vec2();
var q2 = new b2Vec2();
function b2MakeCapsule(p14, p23, radius) {
  const axis = b2NormalizeChecked(b2Sub(p23, p14));
  const normal = b2RightPerp(axis);
  const shape = new b2Polygon();
  shape.vertices = [p14, p23];
  shape.centroid = b2Lerp(p14, p23, 0.5);
  shape.normals = [normal, b2Neg(normal)];
  shape.count = 2;
  shape.radius = radius;
  return shape;
}
function b2CollideCircles(circleA, xfA, circleB, xfB, manifold) {
  b2InvMulTransformsOut(xfA, xfB, xf);
  const pointA = circleA.center;
  const pointBX = xf.q.c * circleB.center.x - xf.q.s * circleB.center.y + xf.p.x;
  const pointBY = xf.q.s * circleB.center.x + xf.q.c * circleB.center.y + xf.p.y;
  const sx = pointBX - pointA.x;
  const sy = pointBY - pointA.y;
  const distance = Math.sqrt(sx * sx + sy * sy);
  let normalX = 0, normalY = 0;
  if (distance >= eps) {
    normalX = sx / distance;
    normalY = sy / distance;
  }
  const radiusA = circleA.radius;
  const radiusB = circleB.radius;
  const separation = distance - radiusA - radiusB;
  if (separation > b2_speculativeDistance) {
    return manifold.clear();
  }
  const cAx = pointA.x + radiusA * normalX;
  const cAy = pointA.y + radiusA * normalY;
  const cBx = pointBX + -radiusB * normalX;
  const cBy = pointBY + -radiusB * normalY;
  const contactPointAx = cAx + 0.5 * (cBx - cAx);
  const contactPointAy = cAy + 0.5 * (cBy - cAy);
  manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
  manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
  manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
  manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
  const mp = manifold.points[0];
  mp.anchorAX = xfA.q.c * contactPointAx - xfA.q.s * contactPointAy;
  mp.anchorAY = xfA.q.s * contactPointAx + xfA.q.c * contactPointAy;
  mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
  mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
  mp.pointX = xfA.p.x + mp.anchorAX;
  mp.pointY = xfA.p.y + mp.anchorAY;
  mp.separation = separation;
  mp.id = 0;
  manifold.pointCount = 1;
  return manifold;
}
function b2CollideCapsuleAndCircle(capsuleA, xfA, circleB, xfB, manifold) {
  b2InvMulTransformsOut(xfA, xfB, xf);
  const pB = b2TransformPoint(xf, circleB.center);
  const p14 = capsuleA.center1;
  const p23 = capsuleA.center2;
  const e = b2Sub(p23, p14);
  let pA;
  const s1 = b2Dot(b2Sub(pB, p14), e);
  const s2 = b2Dot(b2Sub(p23, pB), e);
  if (s1 < 0) {
    pA = p14;
  } else if (s2 < 0) {
    pA = p23;
  } else {
    const s = s1 / b2Dot(e, e);
    pA = b2MulAdd(p14, s, e);
  }
  const res = b2GetLengthAndNormalize(b2Sub(pB, pA));
  const distance = res.length;
  const normal = res.normal;
  const radiusA = capsuleA.radius;
  const radiusB = circleB.radius;
  const separation = distance - radiusA - radiusB;
  if (separation > b2_speculativeDistance) {
    return manifold.clear();
  }
  const cA = b2MulAdd(pA, radiusA, normal);
  const cB = b2MulAdd(pB, -radiusB, normal);
  const contactPointA = b2Lerp(cA, cB, 0.5);
  manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
  manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;
  const mp = manifold.points[0];
  mp.anchorAX = xfA.q.c * contactPointA.x - xfA.q.s * contactPointA.y;
  mp.anchorAY = xfA.q.s * contactPointA.x + xfA.q.c * contactPointA.y;
  mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
  mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
  mp.pointX = xfA.p.x + mp.anchorAX;
  mp.pointY = xfA.p.y + mp.anchorAY;
  mp.separation = separation;
  mp.id = 0;
  manifold.pointCount = 1;
  return manifold;
}
var c = new b2Vec2();
function b2CollidePolygonAndCircle(polygonA, xfA, circleB, xfB, manifold) {
  const speculativeDistance = b2_speculativeDistance;
  b2InvMulTransformsOut(xfA, xfB, xf);
  b2TransformPointOut(xf, circleB.center, c);
  const radiusA = polygonA.radius;
  const radiusB = circleB.radius;
  const radius = radiusA + radiusB;
  let normalIndex = 0;
  let separation = -Number.MAX_VALUE;
  const vertexCount = polygonA.count;
  const vertices = polygonA.vertices;
  const normals = polygonA.normals;
  for (let i = 0; i < vertexCount; ++i) {
    const s = normals[i].x * (c.x - vertices[i].x) + normals[i].y * (c.y - vertices[i].y);
    if (s > separation) {
      separation = s;
      normalIndex = i;
    }
  }
  if (separation > radius + speculativeDistance) {
    return manifold.clear();
  }
  const vertIndex1 = normalIndex;
  const vertIndex2 = vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0;
  const v1 = vertices[vertIndex1];
  const v2 = vertices[vertIndex2];
  const u1 = (c.x - v1.x) * (v2.x - v1.x) + (c.y - v1.y) * (v2.y - v1.y);
  const u2 = (c.x - v2.x) * (v1.x - v2.x) + (c.y - v2.y) * (v1.y - v2.y);
  if (u1 < 0 && separation > eps) {
    const x = c.x - v1.x;
    const y = c.y - v1.y;
    const length = Math.sqrt(x * x + y * y);
    let normalX = 0, normalY = 0;
    if (length > eps) {
      const invLength = 1 / length;
      normalX = x * invLength;
      normalY = y * invLength;
    }
    separation = (c.x - v1.x) * normalX + (c.y - v1.y) * normalY;
    if (separation > radius + speculativeDistance) {
      return manifold.clear();
    }
    const cAX = v1.x + radiusA * normalX;
    const cAY = v1.y + radiusA * normalY;
    const cBX = c.x - radiusB * normalX;
    const cBY = c.y - radiusB * normalY;
    const contactPointAX = 0.5 * (cAX + cBX);
    const contactPointAY = 0.5 * (cAY + cBY);
    manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
    manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
    const mp = manifold.points[0];
    mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
    mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = (cBX - cAX) * normalX + (cBY - cAY) * normalY;
    mp.id = 0;
    manifold.pointCount = 1;
  } else if (u2 < 0 && separation > eps) {
    const x = c.x - v2.x;
    const y = c.y - v2.y;
    const length = Math.sqrt(x * x + y * y);
    let normalX = 0, normalY = 0;
    if (length > eps) {
      const invLength = 1 / length;
      normalX = x * invLength;
      normalY = y * invLength;
    }
    separation = (c.x - v2.x) * normalX + (c.y - v2.y) * normalY;
    if (separation > radius + speculativeDistance) {
      return manifold.clear();
    }
    const cAX = v2.x + radiusA * normalX;
    const cAY = v2.y + radiusA * normalY;
    const cBX = c.x - radiusB * normalX;
    const cBY = c.y - radiusB * normalY;
    const contactPointAX = 0.5 * (cAX + cBX);
    const contactPointAY = 0.5 * (cAY + cBY);
    manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
    manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
    const mp = manifold.points[0];
    mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
    mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = (cBX - cAX) * normalX + (cBY - cAY) * normalY;
    mp.id = 0;
    manifold.pointCount = 1;
  } else {
    const normalX = normals[normalIndex].x;
    const normalY = normals[normalIndex].y;
    manifold.normalX = xfA.q.c * normalX - xfA.q.s * normalY;
    manifold.normalY = xfA.q.s * normalX + xfA.q.c * normalY;
    const d = radiusA - ((c.x - v1.x) * normalX + (c.y - v1.y) * normalY);
    const cAX = c.x + d * normalX;
    const cAY = c.y + d * normalY;
    const cBX = c.x - radiusB * normalX;
    const cBY = c.y - radiusB * normalY;
    const contactPointAX = (cAX + cBX) * 0.5;
    const contactPointAY = (cAY + cBY) * 0.5;
    const mp = manifold.points[0];
    mp.anchorAX = xfA.q.c * contactPointAX - xfA.q.s * contactPointAY;
    mp.anchorAY = xfA.q.s * contactPointAX + xfA.q.c * contactPointAY;
    mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
    mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
    mp.pointX = xfA.p.x + mp.anchorAX;
    mp.pointY = xfA.p.y + mp.anchorAY;
    mp.separation = separation - radius;
    mp.id = 0;
    manifold.pointCount = 1;
  }
  return manifold;
}
function b2CollideCapsules(capsuleA, xfA, capsuleB, xfB, manifold) {
  const origin = capsuleA.center1;
  b2MulAddOut(xfA.p, 1, b2RotateVector(xfA.q, origin), xf1.p);
  xf1.q = xfA.q;
  b2InvMulTransformsOut(xf1, xfB, xf);
  p12.x = 0;
  p12.y = 0;
  q1.x = capsuleA.center2.x - origin.x;
  q1.y = capsuleA.center2.y - origin.y;
  b2TransformPointOut(xf, capsuleB.center1, p2);
  b2TransformPointOut(xf, capsuleB.center2, q2);
  const d1X = q1.x;
  const d1Y = q1.y;
  const d2X = q2.x - p2.x;
  const d2Y = q2.y - p2.y;
  const dd1 = d1X * d1X + d1Y * d1Y;
  const dd2 = d2X * d2X + d2Y * d2Y;
  const rX = p12.x - p2.x;
  const rY = p12.y - p2.y;
  const rd1 = rX * d1X + rY * d1Y;
  const rd2 = rX * d2X + rY * d2Y;
  const d12 = d1X * d2X + d1Y * d2Y;
  const denom = dd1 * dd2 - d12 * d12;
  let f1 = 0;
  if (denom !== 0) {
    f1 = b2ClampFloat((d12 * rd2 - rd1 * dd2) / denom, 0, 1);
  }
  let f2 = (d12 * f1 + rd2) / dd2;
  if (f2 < 0) {
    f2 = 0;
    f1 = b2ClampFloat(-rd1 / dd1, 0, 1);
  } else if (f2 > 1) {
    f2 = 1;
    f1 = b2ClampFloat((d12 - rd1) / dd1, 0, 1);
  }
  const closest1 = { x: p12.x + f1 * d1X, y: p12.y + f1 * d1Y };
  const closest2 = { x: p2.x + f2 * d2X, y: p2.y + f2 * d2Y };
  const distanceSquared = b2DistanceSquared(closest1, closest2);
  const radiusA = capsuleA.radius;
  const radiusB = capsuleB.radius;
  const radius = radiusA + radiusB;
  const maxDistance = radius + b2_speculativeDistance;
  if (distanceSquared > maxDistance * maxDistance) {
    resetProperties(manifold);
    return;
  }
  const distance = Math.sqrt(distanceSquared);
  const length1 = b2LengthXY(d1X, d1Y);
  const u1X = d1X * 1 / length1;
  const u1Y = d1Y * 1 / length1;
  const length2 = b2LengthXY(d2X, d2Y);
  const u2X = d2X * 1 / length2;
  const u2Y = d2Y * 1 / length2;
  const fp2 = (p2.x - p12.x) * u1X + (p2.y - p12.y) * u1Y;
  const fq2 = (q2.x - p12.x) * u1X + (q2.y - p12.y) * u1Y;
  const outsideA = fp2 <= 0 && fq2 <= 0 || fp2 >= length1 && fq2 >= length1;
  const fp1 = (p12.x - p2.x) * u1X + (p12.y - p2.y) * u2Y;
  const fq1 = (q1.x - p2.x) * u1X + (q1.y - p2.y) * u2Y;
  const outsideB = fp1 <= 0 && fq1 <= 0 || fp1 >= length2 && fq1 >= length2;
  manifold.pointCount = 0;
  if (outsideA === false && outsideB === false) {
    let normalAX, normalAY, separationA;
    {
      normalAX = -u1Y;
      normalAY = u1X;
      const ss1 = (p2.x - p12.x) * normalAX + (p2.y - p12.y) * normalAY;
      const ss2 = (q2.x - p12.x) * normalAX + (q2.y - p12.y) * normalAY;
      const s1p = Math.min(ss1, ss2);
      const s1n = Math.max(-ss1, -ss2);
      if (s1p > s1n) {
        separationA = s1p;
      } else {
        separationA = s1n;
        normalAX = -normalAX;
        normalAY = -normalAY;
      }
    }
    let normalBX, normalBY, separationB;
    {
      normalBX = -u2Y;
      normalBY = u2X;
      const ss1 = (p12.x - p2.x) * normalBX + (p12.y - p2.y) * normalBY;
      const ss2 = (q1.x - p2.x) * normalBX + (q1.y - p2.y) * normalBY;
      const s1p = Math.min(ss1, ss2);
      const s1n = Math.max(-ss1, -ss2);
      if (s1p > s1n) {
        separationB = s1p;
      } else {
        separationB = s1n;
        normalBX = -normalBX;
        normalBY = -normalBY;
      }
    }
    if (separationA >= separationB) {
      manifold.normalX = normalAX;
      manifold.normalY = normalAY;
      let cpX = p2.x;
      let cpY = p2.y;
      let cqX = q2.x;
      let cqY = q2.y;
      if (fp2 < 0 && fq2 > 0) {
        const t = (0 - fp2) / (fq2 - fp2);
        cpX = p2.x + t * (q2.x - p2.x);
        cpY = p2.y + t * (q2.y - p2.y);
      } else if (fq2 < 0 && fp2 > 0) {
        const t = (0 - fq2) / (fp2 - fq2);
        cqX = q2.x + t * (p2.x - q2.x);
        cqY = q2.y + t * (p2.y - q2.y);
      }
      if (fp2 > length1 && fq2 < length1) {
        const t = (fp2 - length1) / (fp2 - fq2);
        cpX = p2.x + t * (q2.x - p2.x);
        cpY = p2.y + t * (q2.y - p2.y);
      } else if (fq2 > length1 && fp2 < length1) {
        const t = (fq2 - length1) / (fq2 - fp2);
        cqX = q2.x + t * (p2.x - q2.x);
        cqY = q2.y + t * (p2.y - q2.y);
      }
      const sp = (cpX - p12.x) * normalAX + (cpY - p12.y) * normalAY;
      const sq = (cqX - p12.x) * normalAX + (cqY - p12.y) * normalAY;
      if (sp <= distance + b2_linearSlop || sq <= distance + b2_linearSlop) {
        let s = 0.5 * (radiusA - radiusB - sp);
        manifold.points[0].anchorAX = cpX + s * normalAX;
        manifold.points[0].anchorAY = cpY + s * normalAY;
        manifold.points[0].separation = sp - radius;
        manifold.points[0].id = B2_MAKE_ID(0, 0);
        s = 0.5 * (radiusA - radiusB - sq);
        manifold.points[1].anchorAX = cqX + s * normalAX;
        manifold.points[1].anchorAY = cqY + s * normalAY;
        manifold.points[1].separation = sq - radius;
        manifold.points[1].id = B2_MAKE_ID(0, 1);
        manifold.pointCount = 2;
      }
    } else {
      manifold.normalX = -normalBX;
      manifold.normalY = -normalBY;
      let cpX = p12.x;
      let cpY = p12.y;
      let cqX = q1.x;
      let cqY = q1.y;
      if (fp1 < 0 && fq1 > 0) {
        const t = (0 - fp1) / (fq1 - fp1);
        cpX = p12.x + t * (q1.x - p12.x);
        cpY = p12.y + t * (q1.y - p12.y);
      } else if (fq1 < 0 && fp1 > 0) {
        const t = (0 - fq1) / (fp1 - fq1);
        cqX = q1.x + t * (p12.x - q1.x);
        cqY = q1.y + t * (p12.y - q1.y);
      }
      if (fp1 > length2 && fq1 < length2) {
        const t = (fp1 - length2) / (fp1 - fq1);
        cpX = p12.x + t * (q1.x - p12.x);
        cpY = p12.y + t * (q1.y - p12.y);
      } else if (fq1 > length2 && fp1 < length2) {
        const t = (fq1 - length2) / (fq1 - fp1);
        cqX = q1.x + t * (p12.x - q1.x);
        cqY = q1.y + t * (p12.y - q1.y);
      }
      const sp = (cpX - p2.x) * normalBX + (cpY - p2.y) * normalBY;
      const sq = (cqX - p2.x) * normalBX + (cqY - p2.y) * normalBY;
      if (sp <= distance + b2_linearSlop || sq <= distance + b2_linearSlop) {
        let s = 0.5 * (radiusB - radiusA - sp);
        manifold.points[0].anchorAX = cpX + s * normalBX;
        manifold.points[0].anchorAY = cpY + s * normalBY;
        manifold.points[0].separation = sp - radius;
        manifold.points[0].id = B2_MAKE_ID(0, 0);
        s = 0.5 * (radiusB - radiusA - sq);
        manifold.points[1].anchorAX = cqX + s * normalBX;
        manifold.points[1].anchorAY = cqY + s * normalBY;
        manifold.points[1].separation = sq - radius;
        manifold.points[1].id = B2_MAKE_ID(1, 0);
        manifold.pointCount = 2;
      }
    }
  }
  if (manifold.pointCount === 0) {
    let normalX = closest2.x - closest1.x;
    let normalY = closest2.y - closest1.y;
    const lengthSq = normalX * normalX + normalY * normalY;
    if (lengthSq > epsSqr) {
      const length = Math.sqrt(lengthSq);
      normalX /= length;
      normalY /= length;
    } else {
      normalX = -u1Y;
      normalY = u1X;
    }
    const c1X = closest1.x + radiusA * normalX;
    const c1Y = closest1.y + radiusA * normalY;
    const c2X = closest2.x - radiusB * normalX;
    const c2Y = closest2.y - radiusB * normalY;
    const i1 = f1 === 0 ? 0 : 1;
    const i2 = f2 === 0 ? 0 : 1;
    manifold.normalX = normalX;
    manifold.normalY = normalY;
    manifold.points[0].anchorAX = (c1X + c2X) * 0.5;
    manifold.points[0].anchorAY = (c1Y + c2Y) * 0.5;
    manifold.points[0].separation = Math.sqrt(distanceSquared) - radius;
    manifold.points[0].id = B2_MAKE_ID(i1, i2);
    manifold.pointCount = 1;
  }
  if (manifold.pointCount > 0) {
    const rotatedNormalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
    const rotatedNormalY = xfA.q.s * manifold.normalX + xfA.q.c * manifold.normalY;
    manifold.normalX = rotatedNormalX;
    manifold.normalY = rotatedNormalY;
    for (let i = 0; i < manifold.pointCount; ++i) {
      const mp = manifold.points[i];
      const vx = mp.anchorAX + origin.x;
      const vy = mp.anchorAY + origin.y;
      const rotatedVecX = xfA.q.c * vx - xfA.q.s * vy;
      const rotatedVecY = xfA.q.s * vx + xfA.q.c * vy;
      mp.anchorAX = rotatedVecX;
      mp.anchorAY = rotatedVecY;
      mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
      mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
      mp.pointX = xfA.p.x + mp.anchorAX;
      mp.pointY = xfA.p.y + mp.anchorAY;
    }
  }
  return;
}
var constCapsule = new b2Capsule();
function b2CollideSegmentAndCapsule(segmentA, xfA, capsuleB, xfB, manifold) {
  constCapsule.center1 = segmentA.point1;
  constCapsule.center2 = segmentA.point2;
  constCapsule.radius = 0;
  return b2CollideCapsules(constCapsule, xfA, capsuleB, xfB);
}
function b2CollidePolygonAndCapsule(polygonA, xfA, capsuleB, xfB, manifold) {
  const polyB = b2MakeCapsule(capsuleB.center1, capsuleB.center2, capsuleB.radius);
  return b2CollidePolygons(polygonA, xfA, polyB, xfB, manifold);
}
function b2ClipPolygons(polyA, polyB, edgeA, edgeB, flip, manifold) {
  let poly1, i11, i12;
  let poly2, i21, i22;
  if (flip) {
    poly1 = polyB;
    poly2 = polyA;
    i11 = edgeB;
    i12 = edgeB + 1 < polyB.count ? edgeB + 1 : 0;
    i21 = edgeA;
    i22 = edgeA + 1 < polyA.count ? edgeA + 1 : 0;
  } else {
    poly1 = polyA;
    poly2 = polyB;
    i11 = edgeA;
    i12 = edgeA + 1 < polyA.count ? edgeA + 1 : 0;
    i21 = edgeB;
    i22 = edgeB + 1 < polyB.count ? edgeB + 1 : 0;
  }
  const normal = poly1.normals[i11];
  const v11 = poly1.vertices[i11];
  const v12 = poly1.vertices[i12];
  const v21 = poly2.vertices[i21];
  const v22 = poly2.vertices[i22];
  const tangentX = -1 * normal.y;
  const tangentY = 1 * normal.x;
  const lower1 = 0;
  let subX = v12.x - v11.x;
  let subY = v12.y - v11.y;
  const upper1 = subX * tangentX + subY * tangentY;
  subX = v21.x - v11.x;
  subY = v21.y - v11.y;
  const upper2 = subX * tangentX + subY * tangentY;
  subX = v22.x - v11.x;
  subY = v22.y - v11.y;
  const lower2 = subX * tangentX + subY * tangentY;
  let vLower;
  if (lower2 < lower1 && upper2 - lower2 > eps) {
    vLower = b2Lerp(v22, v21, (lower1 - lower2) / (upper2 - lower2));
  } else {
    vLower = v22;
  }
  let vUpper;
  if (upper2 > upper1 && upper2 - lower2 > eps) {
    vUpper = b2Lerp(v22, v21, (upper1 - lower2) / (upper2 - lower2));
  } else {
    vUpper = v21;
  }
  const separationLower = b2DotSub(vLower, v11, normal);
  const separationUpper = b2DotSub(vUpper, v11, normal);
  const r1 = poly1.radius;
  const r2 = poly2.radius;
  b2MulAddOut(vLower, 0.5 * (r1 - r2 - separationLower), normal, p12);
  b2MulAddOut(vUpper, 0.5 * (r1 - r2 - separationUpper), normal, p2);
  const radius = r1 + r2;
  if (flip === false) {
    manifold.normalX = normal.x;
    manifold.normalY = normal.y;
    let mp = manifold.points[0];
    mp.anchorAX = p12.x;
    mp.anchorAY = p12.y;
    mp.separation = separationLower - radius;
    mp.id = B2_MAKE_ID(i11, i22);
    mp = manifold.points[1];
    mp.anchorAX = p2.x;
    mp.anchorAY = p2.y;
    mp.separation = separationUpper - radius;
    mp.id = B2_MAKE_ID(i12, i21);
    manifold.pointCount = 2;
  } else {
    manifold.normalX = -normal.x;
    manifold.normalY = -normal.y;
    let mp = manifold.points[0];
    mp.anchorAX = p2.x;
    mp.anchorAY = p2.y;
    mp.separation = separationUpper - radius;
    mp.id = B2_MAKE_ID(i21, i12);
    mp = manifold.points[1];
    mp.anchorAX = p12.x;
    mp.anchorAY = p12.y;
    mp.separation = separationLower - radius;
    mp.id = B2_MAKE_ID(i22, i11);
    manifold.pointCount = 2;
  }
  return manifold;
}
function b2FindMaxSeparation(poly1, poly2) {
  const count1 = poly1.count;
  const count2 = poly2.count;
  const n1s = poly1.normals;
  const v1s = poly1.vertices;
  const v2s = poly2.vertices;
  let bestIndex = 0;
  let maxSeparation = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < count1; ++i) {
    const n = n1s[i];
    const vx = v1s[i].x, vy = v1s[i].y;
    let si = Number.POSITIVE_INFINITY;
    for (let j = 0; j < count2; ++j) {
      const dx = v2s[j].x - vx;
      const dy = v2s[j].y - vy;
      const sij = n.x * dx + n.y * dy;
      if (sij < si) {
        si = sij;
      }
    }
    if (si > maxSeparation) {
      maxSeparation = si;
      bestIndex = i;
    }
  }
  return { edgeIndex: bestIndex, maxSeparation };
}
var localPolyA = new b2Polygon(B2_MAX_POLYGON_VERTICES);
var localPolyB = new b2Polygon(B2_MAX_POLYGON_VERTICES);
var p3 = new b2Vec2();
var sfA = new b2Transform();
function b2CollidePolygons(polygonA, xfA, polygonB, xfB, manifold) {
  const originX = polygonA.vertices[0].x;
  const originY = polygonA.vertices[0].y;
  p3.x = xfA.p.x + (xfA.q.c * originX - xfA.q.s * originY);
  p3.y = xfA.p.y + (xfA.q.s * originX + xfA.q.c * originY);
  sfA.p = p3;
  sfA.q = xfA.q;
  b2InvMulTransformsOut(sfA, xfB, xf);
  localPolyA.centroid = null;
  localPolyA.count = polygonA.count;
  localPolyA.radius = polygonA.radius;
  localPolyA.vertices[0].x = 0;
  localPolyA.vertices[0].y = 0;
  localPolyA.normals[0].x = polygonA.normals[0].x;
  localPolyA.normals[0].y = polygonA.normals[0].y;
  for (let i = 1; i < localPolyA.count; ++i) {
    const v = localPolyA.vertices[i];
    v.x = polygonA.vertices[i].x - originX;
    v.y = polygonA.vertices[i].y - originY;
    const n = localPolyA.normals[i];
    n.x = polygonA.normals[i].x;
    n.y = polygonA.normals[i].y;
  }
  localPolyA.centroid = null;
  localPolyB.count = polygonB.count;
  localPolyB.radius = polygonB.radius;
  for (let i = 0; i < localPolyB.count; ++i) {
    const v = localPolyB.vertices[i];
    const p4 = polygonB.vertices[i];
    v.x = xf.q.c * p4.x - xf.q.s * p4.y + xf.p.x;
    v.y = xf.q.s * p4.x + xf.q.c * p4.y + xf.p.y;
    const n = localPolyB.normals[i];
    n.x = xf.q.c * polygonB.normals[i].x - xf.q.s * polygonB.normals[i].y;
    n.y = xf.q.s * polygonB.normals[i].x + xf.q.c * polygonB.normals[i].y;
  }
  const ret1 = b2FindMaxSeparation(localPolyA, localPolyB);
  let edgeA = ret1.edgeIndex;
  const separationA = ret1.maxSeparation;
  const ret2 = b2FindMaxSeparation(localPolyB, localPolyA);
  let edgeB = ret2.edgeIndex;
  const separationB = ret2.maxSeparation;
  const radius = localPolyA.radius + localPolyB.radius;
  if (separationA > b2_speculativeDistance + radius || separationB > b2_speculativeDistance + radius) {
    return manifold.clear();
  }
  let flip;
  if (separationA >= separationB) {
    flip = false;
    const searchDirection = localPolyA.normals[edgeA];
    const count = localPolyB.count;
    const normals = localPolyB.normals;
    edgeB = 0;
    let minDot = Number.MAX_VALUE;
    for (let i = 0; i < count; ++i) {
      const dot = searchDirection.x * normals[i].x + searchDirection.y * normals[i].y;
      if (dot < minDot) {
        minDot = dot;
        edgeB = i;
      }
    }
  } else {
    flip = true;
    const searchDirection = localPolyB.normals[edgeB];
    const count = localPolyA.count;
    const normals = localPolyA.normals;
    edgeA = 0;
    let minDot = Number.MAX_VALUE;
    for (let i = 0; i < count; ++i) {
      const dot = searchDirection.x * normals[i].x + searchDirection.y * normals[i].y;
      if (dot < minDot) {
        minDot = dot;
        edgeA = i;
      }
    }
  }
  if (separationA > 0.1 * b2_linearSlop || separationB > 0.1 * b2_linearSlop) {
    const i11 = edgeA;
    const i12 = edgeA + 1 < localPolyA.count ? edgeA + 1 : 0;
    const i21 = edgeB;
    const i22 = edgeB + 1 < localPolyB.count ? edgeB + 1 : 0;
    const v11 = localPolyA.vertices[i11];
    const v12 = localPolyA.vertices[i12];
    const v21 = localPolyB.vertices[i21];
    const v22 = localPolyB.vertices[i22];
    const result = b2SegmentDistance(v11.x, v11.y, v12.x, v12.y, v21.x, v21.y, v22.x, v22.y);
    if (result.fraction1 === 0 && result.fraction2 === 0) {
      let normalX = v21.x - v11.x;
      let normalY = v21.y - v11.y;
      const distance = Math.sqrt(result.distanceSquared);
      if (distance > b2_speculativeDistance + radius) {
        return manifold.clear();
      }
      const invDistance = 1 / distance;
      normalX *= invDistance;
      normalY *= invDistance;
      const c1X = v11.x + localPolyA.radius * normalX;
      const c1Y = v11.y + localPolyA.radius * normalY;
      const c2X = v21.x - localPolyB.radius * normalX;
      const c2Y = v21.y - localPolyB.radius * normalY;
      manifold.normalX = normalX;
      manifold.normalY = normalY;
      const mp = manifold.points[0];
      mp.anchorAX = (c1X + c2X) * 0.5;
      mp.anchorAY = (c1Y + c2Y) * 0.5;
      mp.separation = distance - radius;
      mp.id = B2_MAKE_ID(i11, i21);
      manifold.pointCount = 1;
    } else if (result.fraction1 === 0 && result.fraction2 === 1) {
      let normalX = v22.x - v11.x;
      let normalY = v22.y - v11.y;
      const distance = Math.sqrt(result.distanceSquared);
      if (distance > b2_speculativeDistance + radius) {
        return manifold.clear();
      }
      const invDistance = 1 / distance;
      normalX *= invDistance;
      normalY *= invDistance;
      const c1X = v11.x + localPolyA.radius * normalX;
      const c1Y = v11.y + localPolyA.radius * normalY;
      const c2X = v22.x - localPolyB.radius * normalX;
      const c2Y = v22.y - localPolyB.radius * normalY;
      manifold.normalX = normalX;
      manifold.normalY = normalY;
      const mp = new b2ManifoldPoint();
      mp.anchorAX = (c1X + c2X) * 0.5;
      mp.anchorAY = (c1Y + c2Y) * 0.5;
      mp.separation = distance - radius;
      mp.id = B2_MAKE_ID(i11, i22);
      manifold.points[0] = mp;
      manifold.pointCount = 1;
    } else if (result.fraction1 === 1 && result.fraction2 === 0) {
      let normalX = v21.x - v12.x;
      let normalY = v21.y - v12.y;
      const distance = Math.sqrt(result.distanceSquared);
      if (distance > b2_speculativeDistance + radius) {
        return manifold.clear();
      }
      const invDistance = 1 / distance;
      normalX *= invDistance;
      normalY *= invDistance;
      const c1X = v12.x + localPolyA.radius * normalX;
      const c1Y = v12.y + localPolyA.radius * normalY;
      const c2X = v21.x - localPolyB.radius * normalX;
      const c2Y = v21.y - localPolyB.radius * normalY;
      manifold.normalX = normalX;
      manifold.normalY = normalY;
      const mp = new b2ManifoldPoint();
      mp.anchorAX = (c1X + c2X) * 0.5;
      mp.anchorAY = (c1Y + c2Y) * 0.5;
      mp.separation = distance - radius;
      mp.id = B2_MAKE_ID(i12, i21);
      manifold.points[0] = mp;
      manifold.pointCount = 1;
    } else if (result.fraction1 === 1 && result.fraction2 === 1) {
      let normalX = v22.x - v12.x;
      let normalY = v22.y - v12.y;
      const distance = Math.sqrt(result.distanceSquared);
      if (distance > b2_speculativeDistance + radius) {
        return manifold.clear();
      }
      const invDistance = 1 / distance;
      normalX *= invDistance;
      normalY *= invDistance;
      const c1X = v12.x + localPolyA.radius * normalX;
      const c1Y = v12.y + localPolyA.radius * normalY;
      const c2X = v22.x - localPolyB.radius * normalX;
      const c2Y = v22.y - localPolyB.radius * normalY;
      manifold.normalX = normalX;
      manifold.normalY = normalY;
      const mp = new b2ManifoldPoint();
      mp.anchorAX = (c1X + c2X) * 0.5;
      mp.anchorAY = (c1Y + c2Y) * 0.5;
      mp.separation = distance - radius;
      mp.id = B2_MAKE_ID(i12, i22);
      manifold.points[0] = mp;
      manifold.pointCount = 1;
    } else {
      b2ClipPolygons(localPolyA, localPolyB, edgeA, edgeB, flip, manifold);
    }
  } else {
    b2ClipPolygons(localPolyA, localPolyB, edgeA, edgeB, flip, manifold);
  }
  if (manifold.pointCount > 0) {
    const tmpx = manifold.normalX;
    manifold.normalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
    manifold.normalY = xfA.q.s * tmpx + xfA.q.c * manifold.normalY;
    for (let i = 0; i < manifold.pointCount; ++i) {
      const mp = manifold.points[i];
      const addX = mp.anchorAX + originX;
      const addY = mp.anchorAY + originY;
      mp.anchorAX = xfA.q.c * addX - xfA.q.s * addY;
      mp.anchorAY = xfA.q.s * addX + xfA.q.c * addY;
      mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
      mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
      mp.pointX = xfA.p.x + mp.anchorAX;
      mp.pointY = xfA.p.y + mp.anchorAY;
    }
  }
  return manifold;
}
function b2CollideSegmentAndCircle(segmentA, xfA, circleB, xfB, manifold) {
  const capsuleA = new b2Capsule();
  capsuleA.center1 = segmentA.point1;
  capsuleA.center2 = segmentA.point2;
  capsuleA.radius = 0;
  return b2CollideCapsuleAndCircle(capsuleA, xfA, circleB, xfB, manifold);
}
function b2CollideSegmentAndPolygon(segmentA, xfA, polygonB, xfB, manifold) {
  const polygonA = b2MakeCapsule(segmentA.point1, segmentA.point2, 0);
  return b2CollidePolygons(polygonA, xfA, polygonB, xfB, manifold);
}
function b2CollideChainSegmentAndCircle(chainSegmentA, xfA, circleB, xfB, manifold) {
  b2InvMulTransformsOut(xfA, xfB, xf);
  const pB = b2TransformPoint(xf, circleB.center);
  const p14 = chainSegmentA.segment.point1;
  const p23 = chainSegmentA.segment.point2;
  const e = b2Sub(p23, p14);
  const offset = b2Dot(b2RightPerp(e), b2Sub(pB, p14));
  if (offset < 0) {
    return manifold.clear();
  }
  const u = b2Dot(e, b2Sub(p23, pB));
  const v = b2Dot(e, b2Sub(pB, p14));
  let pA;
  if (v <= 0) {
    const prevEdge = b2Sub(p14, chainSegmentA.ghost1);
    const uPrev = b2Dot(prevEdge, b2Sub(pB, p14));
    if (uPrev <= 0) {
      return manifold.clear();
    }
    pA = p14;
  } else if (u <= 0) {
    const nextEdge = b2Sub(chainSegmentA.ghost2, p23);
    const vNext = b2Dot(nextEdge, b2Sub(pB, p23));
    if (vNext > 0) {
      return manifold.clear();
    }
    pA = p23;
  } else {
    const ee = b2Dot(e, e);
    pA = new b2Vec2(u * p14.x + v * p23.x, u * p14.y + v * p23.y);
    pA = ee > 0 ? b2MulSV(1 / ee, pA) : p14;
  }
  const res = b2GetLengthAndNormalize(b2Sub(pB, pA));
  const distance = res.length;
  const normal = res.normal;
  const radius = circleB.radius;
  const separation = distance - radius;
  if (separation > b2_speculativeDistance) {
    return manifold.clear();
  }
  const cA = pA;
  const cB = b2MulAdd(pB, -radius, normal);
  const contactPointA = b2Lerp(cA, cB, 0.5);
  manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
  manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;
  const mp = manifold.points[0];
  mp.anchorAX = xfA.q.c * contactPointA.x - xfA.q.s * contactPointA.y;
  mp.anchorAY = xfA.q.s * contactPointA.x + xfA.q.c * contactPointA.y;
  mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
  mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
  mp.pointX = xfA.p.x + mp.anchorAX;
  mp.pointY = xfA.p.y + mp.anchorAY;
  mp.separation = separation;
  mp.id = 0;
  manifold.pointCount = 1;
  return manifold;
}
function b2CollideChainSegmentAndCapsule(segmentA, xfA, capsuleB, xfB, cache, manifold) {
  const polyB = b2MakeCapsule(capsuleB.center1, capsuleB.center2, capsuleB.radius);
  return b2CollideChainSegmentAndPolygon(segmentA, xfA, polyB, xfB, cache, manifold);
}
function b2ClipSegments(a1, a2, b1, b2, normal, ra, rb, id1, id2, manifold) {
  const tangent = b2LeftPerp(normal);
  const lower1 = 0;
  const upper1 = b2Dot(b2Sub(a2, a1), tangent);
  const upper2 = b2Dot(b2Sub(b1, a1), tangent);
  const lower2 = b2Dot(b2Sub(b2, a1), tangent);
  if (upper2 < lower1 || upper1 < lower2) {
    return manifold.clear();
  }
  let vLower;
  if (lower2 < lower1 && upper2 - lower2 > eps) {
    vLower = b2Lerp(b2, b1, (lower1 - lower2) / (upper2 - lower2));
  } else {
    vLower = b2;
  }
  let vUpper;
  if (upper2 > upper1 && upper2 - lower2 > eps) {
    vUpper = b2Lerp(b2, b1, (upper1 - lower2) / (upper2 - lower2));
  } else {
    vUpper = b1;
  }
  const separationLower = b2Dot(b2Sub(vLower, a1), normal);
  const separationUpper = b2Dot(b2Sub(vUpper, a1), normal);
  vLower = b2MulAdd(vLower, 0.5 * (ra - rb - separationLower), normal);
  vUpper = b2MulAdd(vUpper, 0.5 * (ra - rb - separationUpper), normal);
  const radius = ra + rb;
  manifold.normalX = normal.x;
  manifold.normalY = normal.y;
  const p03 = manifold.points[0];
  p03.anchorAX = vLower.x;
  p03.anchorAY = vLower.y;
  p03.separation = separationLower - radius;
  p03.id = id1;
  const p14 = manifold.points[1];
  p14.anchorAX = vUpper.x;
  p14.anchorAY = vUpper.y;
  p14.separation = separationUpper - radius;
  p14.id = id2;
  manifold.pointCount = 2;
  return manifold;
}
var b2NormalType = {
  b2_normalSkip: 0,
  b2_normalAdmit: 1,
  b2_normalSnap: 2
};
function b2ClassifyNormal(params, normal) {
  const sinTol = 0.01;
  if (b2Dot(normal, params.edge1) <= 0) {
    if (params.convex1) {
      if (b2Cross(normal, params.normal0) > sinTol) {
        return b2NormalType.b2_normalSkip;
      }
      return b2NormalType.b2_normalAdmit;
    } else {
      return b2NormalType.b2_normalSnap;
    }
  } else {
    if (params.convex2) {
      if (b2Cross(params.normal2, normal) > sinTol) {
        return b2NormalType.b2_normalSkip;
      }
      return b2NormalType.b2_normalAdmit;
    } else {
      return b2NormalType.b2_normalSnap;
    }
  }
}
var b2ChainSegmentParams = class {
  constructor() {
    this.edge1 = new b2Vec2();
    this.normal0 = new b2Vec2();
    this.normal2 = new b2Vec2();
    this.convex1 = false;
    this.convex2 = false;
  }
};
function b2CollideChainSegmentAndPolygon(chainSegmentA, xfA, polygonB, xfB, cache, manifold) {
  b2InvMulTransformsOut(xfA, xfB, xf);
  const centroidB = b2TransformPoint(xf, polygonB.centroid);
  const radiusB = polygonB.radius;
  const p14 = chainSegmentA.segment.point1;
  const p23 = chainSegmentA.segment.point2;
  const edge1 = b2Normalize(b2Sub(p23, p14));
  const chainParams = new b2ChainSegmentParams();
  chainParams.edge1 = edge1.clone();
  const convexTol = 0.01;
  const edge0 = b2Normalize(b2Sub(p14, chainSegmentA.ghost1));
  chainParams.normal0 = b2RightPerp(edge0);
  chainParams.convex1 = b2Cross(edge0, edge1) >= convexTol;
  const edge2 = b2Normalize(b2Sub(chainSegmentA.ghost2, p23));
  chainParams.normal2 = b2RightPerp(edge2);
  chainParams.convex2 = b2Cross(edge1, edge2) >= convexTol;
  const normal1 = b2RightPerp(edge1);
  const behind1 = b2Dot(normal1, b2Sub(centroidB, p14)) < 0;
  let behind0 = true;
  let behind2 = true;
  if (chainParams.convex1) {
    behind0 = b2Dot(chainParams.normal0, b2Sub(centroidB, p14)) < 0;
  }
  if (chainParams.convex2) {
    behind2 = b2Dot(chainParams.normal2, b2Sub(centroidB, p23)) < 0;
  }
  if (behind1 && behind0 && behind2) {
    return manifold.clear();
  }
  const count = polygonB.count;
  const vertices = [];
  const normals = [];
  for (let i = 0; i < count; ++i) {
    vertices[i] = b2TransformPoint(xf, polygonB.vertices[i]);
    normals[i] = b2RotateVector(xf.q, polygonB.normals[i]);
  }
  const input = new b2DistanceInput();
  input.proxyA = b2MakeProxy([chainSegmentA.segment.point1, chainSegmentA.segment.point2], 2, 0);
  input.proxyB = b2MakeProxy(vertices, count, 0);
  input.transformA = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.useRadii = false;
  const output = b2ShapeDistance(cache, input, null, 0);
  if (output.distance > radiusB + b2_speculativeDistance) {
    return manifold.clear();
  }
  const n0 = chainParams.convex1 ? chainParams.normal0 : normal1;
  const n2 = chainParams.convex2 ? chainParams.normal2 : normal1;
  let incidentIndex = -1;
  let incidentNormal = -1;
  if (behind1 == false && output.distance > 0.1 * b2_linearSlop) {
    if (cache.count == 1) {
      const pA = output.pointA;
      const pB = output.pointB;
      const normal = b2Normalize(b2Sub(pB, pA));
      const type = b2ClassifyNormal(chainParams, normal);
      if (type == b2NormalType.b2_normalSkip) {
        return manifold.clear();
      }
      if (type == b2NormalType.b2_normalAdmit) {
        manifold.normalX = xfA.q.c * normal.x - xfA.q.s * normal.y;
        manifold.normalY = xfA.q.s * normal.x + xfA.q.c * normal.y;
        const mp = new b2ManifoldPoint();
        mp.anchorAX = xfA.q.c * pA.x - xfA.q.s * pA.y;
        mp.anchorAY = xfA.q.s * pA.x + xfA.q.c * pA.y;
        mp.anchorBX = mp.anchorAX + (xfA.p.x - xfB.p.x);
        mp.anchorBY = mp.anchorAY + (xfA.p.y - xfB.p.y);
        mp.pointX = xfA.p.x + mp.anchorAX;
        mp.pointY = xfA.p.y + mp.anchorAY;
        mp.separation = output.distance - radiusB;
        mp.id = B2_MAKE_ID(cache.indexA[0], cache.indexB[0]);
        manifold.points[0] = mp;
        manifold.pointCount = 1;
        return manifold;
      }
      incidentIndex = cache.indexB[0];
    } else {
      const ia1 = cache.indexA[0];
      const ia2 = cache.indexA[1];
      let ib12 = cache.indexB[0];
      let ib22 = cache.indexB[1];
      if (ia1 == ia2) {
        let normalB = b2Sub(output.pointA, output.pointB);
        let dot1 = b2Dot(normalB, normals[ib12]);
        let dot2 = b2Dot(normalB, normals[ib22]);
        const ib = dot1 > dot2 ? ib12 : ib22;
        normalB = normals[ib];
        const type = b2ClassifyNormal(chainParams, b2Neg(normalB));
        if (type == b2NormalType.b2_normalSkip) {
          return manifold.clear();
        }
        if (type == b2NormalType.b2_normalAdmit) {
          ib12 = ib;
          ib22 = ib < count - 1 ? ib + 1 : 0;
          const b12 = vertices[ib12];
          const b22 = vertices[ib22];
          dot1 = b2Dot(normalB, b2Sub(p14, b12));
          dot2 = b2Dot(normalB, b2Sub(p23, b12));
          if (dot1 < dot2) {
            if (b2Dot(n0, normalB) < b2Dot(normal1, normalB)) {
              return manifold.clear();
            }
          } else {
            if (b2Dot(n2, normalB) < b2Dot(normal1, normalB)) {
              return manifold.clear();
            }
          }
          b2ClipSegments(b12, b22, p14, p23, normalB, radiusB, 0, B2_MAKE_ID(ib12, 1), B2_MAKE_ID(ib22, 0), manifold);
          manifold.normalX = xfA.q.c * -normalB.x - xfA.q.s * -normalB.y;
          manifold.normalY = xfA.q.s * -normalB.x + xfA.q.c * -normalB.y;
          manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
          manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;
          manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
          manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
          const pAB2 = b2Sub(xfA.p, xfB.p);
          manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB2.x;
          manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB2.y;
          manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB2.x;
          manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB2.y;
          manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
          manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;
          manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
          manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;
          return manifold;
        }
        incidentNormal = ib;
      } else {
        const dot1 = b2Dot(normal1, b2Sub(vertices[ib12], p14));
        const dot2 = b2Dot(normal1, b2Sub(vertices[ib22], p23));
        incidentIndex = dot1 < dot2 ? ib12 : ib22;
      }
    }
  } else {
    let edgeSeparation = Number.MAX_VALUE;
    for (let i = 0; i < count; ++i) {
      const s = b2Dot(normal1, b2Sub(vertices[i], p14));
      if (s < edgeSeparation) {
        edgeSeparation = s;
        incidentIndex = i;
      }
    }
    if (chainParams.convex1) {
      let s0 = Number.MAX_VALUE;
      for (let i = 0; i < count; ++i) {
        const s = b2Dot(chainParams.normal0, b2Sub(vertices[i], p14));
        if (s < s0) {
          s0 = s;
        }
      }
      if (s0 > edgeSeparation) {
        edgeSeparation = s0;
        incidentIndex = -1;
      }
    }
    if (chainParams.convex2) {
      let s2 = Number.MAX_VALUE;
      for (let i = 0; i < count; ++i) {
        const s = b2Dot(chainParams.normal2, b2Sub(vertices[i], p23));
        if (s < s2) {
          s2 = s;
        }
      }
      if (s2 > edgeSeparation) {
        edgeSeparation = s2;
        incidentIndex = -1;
      }
    }
    let polygonSeparation = -Number.MAX_VALUE;
    let referenceIndex = -1;
    for (let i = 0; i < count; ++i) {
      const n = normals[i];
      const type = b2ClassifyNormal(chainParams, b2Neg(n));
      if (type != b2NormalType.b2_normalAdmit) {
        continue;
      }
      const p4 = vertices[i];
      const s = Math.min(b2Dot(n, b2Sub(p23, p4)), b2Dot(n, b2Sub(p14, p4)));
      if (s > polygonSeparation) {
        polygonSeparation = s;
        referenceIndex = i;
      }
    }
    if (polygonSeparation > edgeSeparation) {
      const ia1 = referenceIndex;
      const ia2 = ia1 < count - 1 ? ia1 + 1 : 0;
      const a1 = vertices[ia1];
      const a2 = vertices[ia2];
      const n = normals[ia1];
      const dot1 = b2Dot(n, b2Sub(p14, a1));
      const dot2 = b2Dot(n, b2Sub(p23, a1));
      if (dot1 < dot2) {
        if (b2Dot(n0, n) < b2Dot(normal1, n)) {
          return manifold.clear();
        }
      } else {
        if (b2Dot(n2, n) < b2Dot(normal1, n)) {
          return manifold.clear(0);
        }
      }
      b2ClipSegments(a1, a2, p14, p23, normals[ia1], radiusB, 0, B2_MAKE_ID(ia1, 1), B2_MAKE_ID(ia2, 0), manifold);
      manifold.normalX = xfA.q.c * -normals[ia1].x - xfA.q.s * -normals[ia1].y;
      manifold.normalY = xfA.q.s * -normals[ia1].x + xfA.q.c * -normals[ia1].y;
      manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
      manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;
      manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
      manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
      const pAB2 = b2Sub(xfA.p, xfB.p);
      manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB2.x;
      manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB2.y;
      manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB2.x;
      manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB2.y;
      manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
      manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;
      manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
      manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;
      return manifold;
    }
    if (incidentIndex == -1) {
      return manifold.clear();
    }
  }
  let b1, b2;
  let ib1, ib2;
  if (incidentNormal != -1) {
    ib1 = incidentNormal;
    ib2 = ib1 < count - 1 ? ib1 + 1 : 0;
    b1 = vertices[ib1];
    b2 = vertices[ib2];
  } else {
    const i2 = incidentIndex;
    const i1 = i2 > 0 ? i2 - 1 : count - 1;
    const d1 = b2Dot(normal1, normals[i1]);
    const d2 = b2Dot(normal1, normals[i2]);
    if (d1 < d2) {
      ib1 = i1;
      ib2 = i2;
      b1 = vertices[ib1];
      b2 = vertices[ib2];
    } else {
      ib1 = i2;
      ib2 = i2 < count - 1 ? i2 + 1 : 0;
      b1 = vertices[ib1];
      b2 = vertices[ib2];
    }
  }
  b2ClipSegments(p14, p23, b1, b2, normal1, 0, radiusB, B2_MAKE_ID(0, ib2), B2_MAKE_ID(1, ib1), manifold);
  manifold.normalX = xfA.q.c * manifold.normalX - xfA.q.s * manifold.normalY;
  manifold.normalY = xfA.q.s * manifold.normalX + xfA.q.c * manifold.normalY;
  manifold.points[0].anchorAX = xfA.q.c * manifold.points[0].anchorAX - xfA.q.s * manifold.points[0].anchorAY;
  manifold.points[0].anchorAY = xfA.q.s * manifold.points[0].anchorAX + xfA.q.c * manifold.points[0].anchorAY;
  manifold.points[1].anchorAX = xfA.q.c * manifold.points[1].anchorAX - xfA.q.s * manifold.points[1].anchorAY;
  manifold.points[1].anchorAY = xfA.q.s * manifold.points[1].anchorAX + xfA.q.c * manifold.points[1].anchorAY;
  const pAB = b2Sub(xfA.p, xfB.p);
  manifold.points[0].anchorBX = manifold.points[0].anchorAX + pAB.x;
  manifold.points[0].anchorBY = manifold.points[0].anchorAY + pAB.y;
  manifold.points[1].anchorBX = manifold.points[1].anchorAX + pAB.x;
  manifold.points[1].anchorBY = manifold.points[1].anchorAY + pAB.y;
  manifold.points[0].pointX = xfA.p.x + manifold.points[0].anchorAX;
  manifold.points[0].pointY = xfA.p.y + manifold.points[0].anchorAY;
  manifold.points[1].pointX = xfA.p.x + manifold.points[1].anchorAX;
  manifold.points[1].pointY = xfA.p.y + manifold.points[1].anchorAY;
  return manifold;
}

// src/contact_c.js
var b2ContactFlags = {
  b2_contactTouchingFlag: 1,
  b2_contactHitEventFlag: 2,
  b2_contactSensorFlag: 4,
  b2_contactSensorTouchingFlag: 8,
  b2_contactEnableSensorEvents: 16,
  b2_contactEnableContactEvents: 32
};
var b2ContactEdge = class {
  constructor() {
    this.bodyId = 0;
    this.prevKey = 0;
    this.nextKey = 0;
  }
};
var b2Contact = class {
  constructor() {
    this.setIndex = 0;
    this.colorIndex = 0;
    this.localIndex = 0;
    this.edges = [new b2ContactEdge(), new b2ContactEdge()];
    this.shapeIdA = 0;
    this.shapeIdB = 0;
    this.islandPrev = 0;
    this.islandNext = 0;
    this.islandId = B2_NULL_INDEX;
    this.contactId = B2_NULL_INDEX;
    this.flags = 0;
    this.isMarked = false;
  }
};
var b2ContactSim = class {
  constructor(manifold = new b2Manifold()) {
    this.contactId = 0;
    this._bodyIdA = B2_NULL_INDEX;
    this._bodyIdB = B2_NULL_INDEX;
    this.bodySimIndexA = 0;
    this.bodySimIndexB = 0;
    this.shapeIdA = 0;
    this.shapeIdB = 0;
    this.invMassA = 0;
    this.invIA = 0;
    this.invMassB = 0;
    this.invIB = 0;
    this.manifold = manifold;
    this.friction = 0;
    this.restitution = 0;
    this.tangentSpeed = 0;
    this.simFlags = 0;
    this.cache = new b2DistanceCache();
  }
  set(src) {
    this.contactId = src.contactId;
    this._bodyIdA = src._bodyIdA;
    this._bodyIdB = src._bodyIdB;
    this.bodySimIndexA = src.bodySimIndexA;
    this.bodySimIndexB = src.bodySimIndexB;
    this.shapeIdA = src.shapeIdA;
    this.shapeIdB = src.shapeIdB;
    this.invMassA = src.invMassA;
    this.invIA = src.invIA;
    this.invMassB = src.invMassB;
    this.invIB = src.invIB;
    src.manifold.copyTo(this.manifold);
    this.friction = src.friction;
    this.restitution = src.restitution;
    this.tangentSpeed = src.tangentSpeed;
    this.simFlags = src.simFlags;
    this.cache = src.cache.clone();
  }
};
function b2MixFriction(friction1, friction2) {
  return Math.sqrt(friction1 * friction2);
}
function b2MixRestitution(restitution1, restitution2) {
  return Math.max(restitution1, restitution2);
}
var b2ContactRegister = class {
  constructor(fcn = null, primary = false) {
    this.fcn = fcn;
    this.primary = primary;
  }
};
var s_registers = Array(b2ShapeType.b2_shapeTypeCount).fill().map(
  () => Array(b2ShapeType.b2_shapeTypeCount).fill().map(() => new b2ContactRegister())
);
var s_initialized = false;
function b2CircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideCircles(shapeA.circle, xfA, shapeB.circle, xfB, manifold);
}
function b2CapsuleAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideCapsuleAndCircle(shapeA.capsule, xfA, shapeB.circle, xfB, manifold);
}
function b2CapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideCapsules(shapeA.capsule, xfA, shapeB.capsule, xfB, manifold);
}
function b2PolygonAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollidePolygonAndCircle(shapeA.polygon, xfA, shapeB.circle, xfB, manifold);
}
function b2PolygonAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollidePolygonAndCapsule(shapeA.polygon, xfA, shapeB.capsule, xfB, manifold);
}
function b2PolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollidePolygons(shapeA.polygon, xfA, shapeB.polygon, xfB, manifold);
}
function b2SegmentAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideSegmentAndCircle(shapeA.segment, xfA, shapeB.circle, xfB, manifold);
}
function b2SegmentAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideSegmentAndCapsule(shapeA.segment, xfA, shapeB.capsule, xfB, manifold);
}
function b2SegmentAndPolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideSegmentAndPolygon(shapeA.segment, xfA, shapeB.polygon, xfB, manifold);
}
function b2ChainSegmentAndCircleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideChainSegmentAndCircle(shapeA.chainSegment, xfA, shapeB.circle, xfB, manifold);
}
function b2ChainSegmentAndCapsuleManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideChainSegmentAndCapsule(shapeA.chainSegment, xfA, shapeB.capsule, xfB, cache, manifold);
}
function b2ChainSegmentAndPolygonManifold(shapeA, xfA, shapeB, xfB, cache, manifold) {
  return b2CollideChainSegmentAndPolygon(shapeA.chainSegment, xfA, shapeB.polygon, xfB, cache, manifold);
}
function b2AddType(fcn, type1, type2) {
  s_registers[type1][type2].fcn = fcn;
  s_registers[type1][type2].primary = true;
  if (type1 != type2) {
    s_registers[type2][type1].fcn = fcn;
    s_registers[type2][type1].primary = false;
  }
}
function b2InitializeContactRegisters() {
  if (s_initialized === false) {
    b2AddType(b2CircleManifold, b2ShapeType.b2_circleShape, b2ShapeType.b2_circleShape);
    b2AddType(b2CapsuleAndCircleManifold, b2ShapeType.b2_capsuleShape, b2ShapeType.b2_circleShape);
    b2AddType(b2CapsuleManifold, b2ShapeType.b2_capsuleShape, b2ShapeType.b2_capsuleShape);
    b2AddType(b2PolygonAndCircleManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_circleShape);
    b2AddType(b2PolygonAndCapsuleManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_capsuleShape);
    b2AddType(b2PolygonManifold, b2ShapeType.b2_polygonShape, b2ShapeType.b2_polygonShape);
    b2AddType(b2SegmentAndCircleManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_circleShape);
    b2AddType(b2SegmentAndCapsuleManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_capsuleShape);
    b2AddType(b2SegmentAndPolygonManifold, b2ShapeType.b2_segmentShape, b2ShapeType.b2_polygonShape);
    b2AddType(b2ChainSegmentAndCircleManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_circleShape);
    b2AddType(b2ChainSegmentAndCapsuleManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_capsuleShape);
    b2AddType(b2ChainSegmentAndPolygonManifold, b2ShapeType.b2_chainSegmentShape, b2ShapeType.b2_polygonShape);
    s_initialized = true;
  }
}
function b2CreateContact(world, shapeA, shapeB) {
  const type1 = shapeA.type;
  const type2 = shapeB.type;
  if (s_registers[type1][type2].fcn === null) {
    return;
  }
  if (s_registers[type1][type2].primary === false) {
    b2CreateContact(world, shapeB, shapeA);
    return;
  }
  const bodyA = b2GetBody(world, shapeA.bodyId);
  const bodyB = b2GetBody(world, shapeB.bodyId);
  let setIndex;
  if (bodyA.setIndex === b2SetType.b2_awakeSet || bodyB.setIndex === b2SetType.b2_awakeSet) {
    setIndex = b2SetType.b2_awakeSet;
  } else {
    setIndex = b2SetType.b2_disabledSet;
  }
  const set = world.solverSetArray[setIndex];
  const contactId = b2AllocId(world.contactIdPool);
  while (world.contactArray.length <= contactId) {
    world.contactArray.push(new b2Contact());
  }
  const shapeIdA = shapeA.id;
  const shapeIdB = shapeB.id;
  const contact = world.contactArray[contactId];
  contact.contactId = contactId;
  contact.setIndex = setIndex;
  contact.colorIndex = B2_NULL_INDEX;
  contact.localIndex = set.contacts.count;
  contact.islandId = B2_NULL_INDEX;
  contact.islandPrev = B2_NULL_INDEX;
  contact.islandNext = B2_NULL_INDEX;
  contact.shapeIdA = shapeIdA;
  contact.shapeIdB = shapeIdB;
  contact.isMarked = false;
  contact.flags = 0;
  if (shapeA.isSensor || shapeB.isSensor) {
    contact.flags |= b2ContactFlags.b2_contactSensorFlag;
  }
  if (shapeA.enableSensorEvents || shapeB.enableSensorEvents) {
    contact.flags |= b2ContactFlags.b2_contactEnableSensorEvents;
  }
  if (shapeA.enableContactEvents || shapeB.enableContactEvents) {
    contact.flags |= b2ContactFlags.b2_contactEnableContactEvents;
  }
  {
    contact.edges[0].bodyId = shapeA.bodyId;
    contact.edges[0].prevKey = B2_NULL_INDEX;
    contact.edges[0].nextKey = bodyA.headContactKey;
    const keyA = contactId << 1 | 0;
    const headContactKey = bodyA.headContactKey;
    if (headContactKey !== B2_NULL_INDEX) {
      const headContact = world.contactArray[headContactKey >> 1];
      headContact.edges[headContactKey & 1].prevKey = keyA;
    }
    bodyA.headContactKey = keyA;
    bodyA.contactCount += 1;
  }
  {
    contact.edges[1].bodyId = shapeB.bodyId;
    contact.edges[1].prevKey = B2_NULL_INDEX;
    contact.edges[1].nextKey = bodyB.headContactKey;
    const keyB = contactId << 1 | 1;
    const headContactKey = bodyB.headContactKey;
    if (bodyB.headContactKey !== B2_NULL_INDEX) {
      const headContact = world.contactArray[headContactKey >> 1];
      headContact.edges[headContactKey & 1].prevKey = keyB;
    }
    bodyB.headContactKey = keyB;
    bodyB.contactCount += 1;
  }
  const pairKey = B2_SHAPE_PAIR_KEY(shapeIdA, shapeIdB);
  b2AddKey(world.broadPhase.pairSet, pairKey);
  const contactSim = b2AddContact(set.contacts);
  contactSim.contactId = contactId;
  contactSim._bodyIdA = shapeA.bodyId;
  contactSim._bodyIdB = shapeB.bodyId;
  contactSim.bodySimIndexA = B2_NULL_INDEX;
  contactSim.bodySimIndexB = B2_NULL_INDEX;
  contactSim.invMassA = 0;
  contactSim.invIA = 0;
  contactSim.invMassB = 0;
  contactSim.invIB = 0;
  contactSim.shapeIdA = shapeIdA;
  contactSim.shapeIdB = shapeIdB;
  contactSim.friction = b2MixFriction(shapeA.friction, shapeB.friction);
  contactSim.restitution = b2MixRestitution(shapeA.restitution, shapeB.restitution);
  contactSim.tangentSpeed = 0;
  contactSim.simFlags = 0;
  if (shapeA.enablePreSolveEvents || shapeB.enablePreSolveEvents) {
    contactSim.simFlags |= b2ContactSimFlags.b2_simEnablePreSolveEvents;
  }
}
function b2DestroyContact(world, contact, wakeBodies) {
  const pairKey = B2_SHAPE_PAIR_KEY(contact.shapeIdA, contact.shapeIdB);
  b2RemoveKey(world.broadPhase.pairSet, pairKey);
  const edgeA = contact.edges[0];
  const edgeB = contact.edges[1];
  const bodyIdA = edgeA.bodyId;
  const bodyIdB = edgeB.bodyId;
  const bodyA = b2GetBody(world, bodyIdA);
  const bodyB = b2GetBody(world, bodyIdB);
  const flags = contact.flags;
  if ((flags & (b2ContactFlags.b2_contactTouchingFlag | b2ContactFlags.b2_contactSensorTouchingFlag)) != 0 && (flags & (b2ContactFlags.b2_contactEnableContactEvents | b2ContactFlags.b2_contactEnableSensorEvents)) != 0) {
    const worldId = world.worldId;
    const shapeA = world.shapeArray[contact.shapeIdA];
    const shapeB = world.shapeArray[contact.shapeIdB];
    const shapeIdA = new b2ShapeId(shapeA.id + 1, worldId, shapeA.revision);
    const shapeIdB = new b2ShapeId(shapeB.id + 1, worldId, shapeB.revision);
    if ((flags & b2ContactFlags.b2_contactTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableContactEvents) != 0) {
      const event = new b2ContactEndTouchEvent(shapeIdA, shapeIdB);
      world.contactEndArray.push(event);
    }
    if ((flags & b2ContactFlags.b2_contactSensorTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0) {
      const event = new b2SensorEndTouchEvent();
      if (shapeA.isSensor) {
        event.sensorShapeId = shapeIdA;
        event.visitorShapeId = shapeIdB;
      } else {
        event.sensorShapeId = shapeIdB;
        event.visitorShapeId = shapeIdA;
      }
      world.sensorEndEventArray.push(event);
    }
  }
  if (edgeA.prevKey !== B2_NULL_INDEX) {
    const prevContact = world.contactArray[edgeA.prevKey >> 1];
    const prevEdge = prevContact.edges[edgeA.prevKey & 1];
    prevEdge.nextKey = edgeA.nextKey;
  }
  if (edgeA.nextKey !== B2_NULL_INDEX) {
    const nextContact = world.contactArray[edgeA.nextKey >> 1];
    const nextEdge = nextContact.edges[edgeA.nextKey & 1];
    nextEdge.prevKey = edgeA.prevKey;
  }
  const contactId = contact.contactId;
  const edgeKeyA = contactId << 1 | 0;
  if (bodyA.headContactKey === edgeKeyA) {
    bodyA.headContactKey = edgeA.nextKey;
  }
  bodyA.contactCount -= 1;
  if (edgeB.prevKey !== B2_NULL_INDEX) {
    const prevContact = world.contactArray[edgeB.prevKey >> 1];
    const prevEdge = prevContact.edges[edgeB.prevKey & 1];
    prevEdge.nextKey = edgeB.nextKey;
  }
  if (edgeB.nextKey !== B2_NULL_INDEX) {
    const nextContact = world.contactArray[edgeB.nextKey >> 1];
    const nextEdge = nextContact.edges[edgeB.nextKey & 1];
    nextEdge.prevKey = edgeB.prevKey;
  }
  const edgeKeyB = contactId << 1 | 1;
  if (bodyB.headContactKey === edgeKeyB) {
    bodyB.headContactKey = edgeB.nextKey;
  }
  bodyB.contactCount -= 1;
  if (contact.islandId !== B2_NULL_INDEX) {
    b2UnlinkContact(world, contact);
  }
  if (contact.colorIndex !== B2_NULL_INDEX) {
    b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, contact.colorIndex, contact.localIndex);
  } else {
    const set = world.solverSetArray[contact.setIndex];
    const movedIndex = b2RemoveContact(set.contacts, contact.localIndex);
    if (movedIndex !== B2_NULL_INDEX) {
      const movedContact = set.contacts.data[contact.localIndex];
      world.contactArray[movedContact.contactId].localIndex = contact.localIndex;
    }
  }
  contact.contactId = B2_NULL_INDEX;
  contact.setIndex = B2_NULL_INDEX;
  contact.colorIndex = B2_NULL_INDEX;
  contact.localIndex = B2_NULL_INDEX;
  b2FreeId(world.contactIdPool, contactId);
  if (wakeBodies) {
    b2WakeBody(world, bodyA);
    b2WakeBody(world, bodyB);
  }
}
function b2GetContactSim(world, contact) {
  if (contact.setIndex === b2SetType.b2_awakeSet && contact.colorIndex !== B2_NULL_INDEX) {
    const color = world.constraintGraph.colors[contact.colorIndex];
    const sim = color.contacts.data[contact.localIndex];
    return sim;
  }
  const set = world.solverSetArray[contact.setIndex];
  return set.contacts.data[contact.localIndex];
}
function b2ShouldShapesCollide(filterA, filterB) {
  if (filterA.groupIndex === filterB.groupIndex && filterA.groupIndex !== 0) {
    return filterA.groupIndex > 0;
  }
  const collide = (filterA.maskBits & filterB.categoryBits) !== 0 && (filterA.categoryBits & filterB.maskBits) !== 0;
  return collide;
}
function b2TestShapeOverlap(shapeA, xfA, shapeB, xfB, cache) {
  const input = new b2DistanceInput();
  input.proxyA = b2MakeShapeDistanceProxy(shapeA);
  input.proxyB = b2MakeShapeDistanceProxy(shapeB);
  input.transformA = xfA;
  input.transformB = xfB;
  input.useRadii = true;
  const output = b2ShapeDistance(cache, input, null, 0);
  return output.distance < 10 * eps;
}
var oldManifold = new b2Manifold();
function b2UpdateContact(world, contactSim, shapeA, transformA, centerOffsetA2, shapeB, transformB, centerOffsetB2) {
  let touching;
  if (shapeA.isSensor || shapeB.isSensor) {
    touching = b2TestShapeOverlap(shapeA, transformA, shapeB, transformB, contactSim.cache);
  } else {
    contactSim.manifold.copyTo(oldManifold);
    const fcn = s_registers[shapeA.type][shapeB.type].fcn;
    fcn(shapeA, transformA, shapeB, transformB, contactSim.cache, contactSim.manifold);
    const pointCount = contactSim.manifold.pointCount;
    touching = pointCount > 0;
    if (touching && world.preSolveFcn && (contactSim.simFlags & b2ContactSimFlags.b2_simEnablePreSolveEvents) != 0) {
      const shapeIdA = new b2ShapeId(shapeA.id + 1, world.worldId, shapeA.revision);
      const shapeIdB = new b2ShapeId(shapeB.id + 1, world.worldId, shapeB.revision);
      touching = world.preSolveFcn(shapeIdA, shapeIdB, contactSim.manifold, world.preSolveContext);
      if (touching == false) {
        contactSim.manifold.pointCount = 0;
      }
    }
    if (touching && (shapeA.enableHitEvents || shapeB.enableHitEvents)) {
      contactSim.simFlags |= b2ContactSimFlags.b2_simEnableHitEvent;
    } else {
      contactSim.simFlags &= ~b2ContactSimFlags.b2_simEnableHitEvent;
    }
    for (let i = 0; i < pointCount; ++i) {
      const mp2 = contactSim.manifold.points[i];
      mp2.anchorAX -= centerOffsetA2.x;
      mp2.anchorAY -= centerOffsetA2.y;
      mp2.anchorBX -= centerOffsetB2.x;
      mp2.anchorBY -= centerOffsetB2.y;
      mp2.normalImpulse = 0;
      mp2.tangentImpulse = 0;
      mp2.maxNormalImpulse = 0;
      mp2.normalVelocity = 0;
      mp2.persisted = false;
      const id2 = mp2.id;
      for (let j = 0, l = oldManifold.pointCount; j < l; ++j) {
        const mp1 = oldManifold.points[j];
        if (mp1.id === id2) {
          mp2.normalImpulse = mp1.normalImpulse;
          mp2.tangentImpulse = mp1.tangentImpulse;
          mp2.persisted = true;
          break;
        }
      }
    }
  }
  if (touching) {
    contactSim.simFlags |= b2ContactSimFlags.b2_simTouchingFlag;
  } else {
    contactSim.simFlags &= ~b2ContactSimFlags.b2_simTouchingFlag;
  }
  return touching;
}
function b2ComputeManifold(shapeA, transformA, shapeB, transformB, manifold) {
  const fcn = s_registers[shapeA.type][shapeB.type].fcn;
  const cache = new b2DistanceCache();
  return fcn(shapeA, transformA, shapeB, transformB, cache, manifold);
}

// src/include/contact_h.js
var b2ContactSimFlags = {
  b2_simTouchingFlag: 65536,
  b2_simDisjoint: 131072,
  b2_simStartedTouching: 262144,
  b2_simStoppedTouching: 524288,
  b2_simEnableHitEvent: 1048576,
  b2_simEnablePreSolveEvents: 2097152
};

// src/broad_phase_c.js
var b2BroadPhase = class {
  constructor() {
    this.trees = new Array(b2BodyType.b2_bodyTypeCount).fill().map(() => new b2DynamicTree());
    this.moveSet = null;
    this.moveArray = null;
    this.moveResults = null;
    this.movePairs = null;
    this.movePairCapacity = 0;
    this.movePairIndex = 0;
    this.pairSet = null;
  }
};
var B2_PROXY_TYPE = (KEY) => KEY & 3;
var B2_PROXY_ID = (KEY) => KEY >> 2;
var B2_PROXY_KEY = (ID, TYPE) => ID << 2 | TYPE;
function b2BufferMove(bp, queryProxy) {
  if (!b2AddKey(bp.moveSet, queryProxy + 1)) {
    bp.moveArray.push(queryProxy);
  }
}
function b2CreateBroadPhase(bp) {
  bp.moveSet = b2CreateSet();
  bp.moveArray = [];
  bp.moveResults = null;
  bp.movePairs = null;
  bp.movePairCapacity = 0;
  bp.movePairIndex = 0;
  bp.pairSet = b2CreateSet();
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    bp.trees[i] = b2DynamicTree_Create();
  }
}
function b2DestroyBroadPhase(bp) {
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Destroy(bp.trees[i]);
  }
  b2DestroySet(bp.moveSet);
  bp.moveArray = null;
  b2DestroySet(bp.pairSet);
  Object.keys(bp).forEach((key) => delete bp[key]);
}
function b2UnBufferMove(bp, proxyKey) {
  const found = b2RemoveKey(bp.moveSet, proxyKey + 1);
  if (found) {
    const count = bp.moveArray.length;
    for (let i = 0; i < count; ++i) {
      if (bp.moveArray[i] === proxyKey) {
        bp.moveArray[i] = bp.moveArray[count - 1];
        bp.moveArray.pop();
        break;
      }
    }
  }
}
function b2BroadPhase_CreateProxy(bp, proxyType, aabb, categoryBits, shapeIndex, forcePairCreation) {
  const proxyId = b2DynamicTree_CreateProxy(bp.trees[proxyType], aabb, categoryBits, shapeIndex);
  const proxyKey = B2_PROXY_KEY(proxyId, proxyType);
  if (proxyType !== b2BodyType.b2_staticBody || forcePairCreation) {
    b2BufferMove(bp, proxyKey);
  }
  return proxyKey;
}
function b2BroadPhase_DestroyProxy(bp, proxyKey) {
  b2UnBufferMove(bp, proxyKey);
  const proxyType = B2_PROXY_TYPE(proxyKey);
  const proxyId = B2_PROXY_ID(proxyKey);
  b2DynamicTree_DestroyProxy(bp.trees[proxyType], proxyId);
}
function b2BroadPhase_MoveProxy(bp, proxyKey, aabb) {
  const proxyType = B2_PROXY_TYPE(proxyKey);
  const proxyId = B2_PROXY_ID(proxyKey);
  b2DynamicTree_MoveProxy(bp.trees[proxyType], proxyId, aabb);
  b2BufferMove(bp, proxyKey);
}
function b2BroadPhase_EnlargeProxy(bp, proxyKey, aabb) {
  const typeIndex = B2_PROXY_TYPE(proxyKey);
  const proxyId = B2_PROXY_ID(proxyKey);
  b2DynamicTree_EnlargeProxy(bp.trees[typeIndex], proxyId, aabb);
  b2BufferMove(bp, proxyKey);
}
var b2MovePair = class {
  constructor() {
    this.shapeIndexA = 0;
    this.shapeIndexB = 0;
    this.next = null;
  }
};
var b2MoveResult = class {
  constructor() {
    this.pairList = null;
  }
};
var b2QueryPairContext = class {
  constructor() {
    this.world = null;
    this.moveResult = null;
    this.queryTreeType = 0;
    this.queryProxyKey = 0;
    this.queryShapeIndex = 0;
  }
};
function b2PairQueryCallback(proxyId, shapeId, context) {
  const queryContext = context;
  const bp = queryContext.world.broadPhase;
  const proxyKey = B2_PROXY_KEY(proxyId, queryContext.queryTreeType);
  if (proxyKey === queryContext.queryProxyKey) {
    return true;
  }
  if (queryContext.queryTreeType !== b2BodyType.b2_staticBody) {
    if (proxyKey < queryContext.queryProxyKey && b2ContainsKey(bp.moveSet, proxyKey + 1)) {
      return true;
    }
  }
  const pairKey = B2_SHAPE_PAIR_KEY(shapeId, queryContext.queryShapeIndex);
  if (b2ContainsKey(bp.pairSet, pairKey)) {
    return true;
  }
  let shapeIdA, shapeIdB;
  if (proxyKey < queryContext.queryProxyKey) {
    shapeIdA = shapeId;
    shapeIdB = queryContext.queryShapeIndex;
  } else {
    shapeIdA = queryContext.queryShapeIndex;
    shapeIdB = shapeId;
  }
  const world = queryContext.world;
  const shapeA = world.shapeArray[shapeIdA];
  const shapeB = world.shapeArray[shapeIdB];
  const bodyIdA = shapeA.bodyId;
  const bodyIdB = shapeB.bodyId;
  if (bodyIdA === bodyIdB) {
    return true;
  }
  if (!b2ShouldShapesCollide(shapeA.filter, shapeB.filter)) {
    return true;
  }
  if (shapeA.isSensor && shapeB.isSensor) {
    return true;
  }
  const bodyA = b2GetBody(world, bodyIdA);
  const bodyB = b2GetBody(world, bodyIdB);
  if (!b2ShouldBodiesCollide(world, bodyA, bodyB)) {
    return true;
  }
  const customFilterFcn = queryContext.world.customFilterFcn;
  if (customFilterFcn) {
    const idA = new b2ShapeId(shapeIdA + 1, world.worldId, shapeA.revision);
    const idB = new b2ShapeId(shapeIdB + 1, world.worldId, shapeB.revision);
    const shouldCollide = customFilterFcn(idA, idB, queryContext.world.customFilterContext);
    if (!shouldCollide) {
      return true;
    }
  }
  const pairIndex = bp.movePairIndex++;
  let pair;
  if (pairIndex < bp.movePairCapacity) {
    pair = bp.movePairs[pairIndex];
  } else {
    pair = new b2MovePair();
  }
  pair.shapeIndexA = shapeIdA;
  pair.shapeIndexB = shapeIdB;
  pair.next = queryContext.moveResult.pairList;
  queryContext.moveResult.pairList = pair;
  return true;
}
function b2UpdateBroadPhasePairs(world) {
  const bp = world.broadPhase;
  const moveCount = bp.moveArray.length;
  if (moveCount === 0) {
    return;
  }
  const alloc = world.stackAllocator;
  bp.moveResults = b2AllocateStackItem(alloc, moveCount, "move results", () => new b2MoveResult());
  b2FindPairsTask(0, moveCount, world);
  const shapes = world.shapeArray;
  for (const result of bp.moveResults) {
    for (let pair = result.pairList; pair; pair = pair.next) {
      b2CreateContact(world, shapes[pair.shapeIndexA], shapes[pair.shapeIndexB]);
    }
  }
  bp.moveArray.length = 0;
  b2ClearSet(bp.moveSet);
  b2FreeStackItem(alloc, bp.moveResults);
  bp.moveResults = null;
  b2ValidateSolverSets(world);
}
function b2FindPairsTask(startIndex, endIndex, world) {
  const bp = world.broadPhase;
  const queryContext = new b2QueryPairContext();
  queryContext.world = world;
  for (let i = startIndex; i < endIndex; ++i) {
    const proxyKey = bp.moveArray[i];
    if (proxyKey === B2_NULL_INDEX) {
      continue;
    }
    const proxyType = B2_PROXY_TYPE(proxyKey);
    const proxyId = B2_PROXY_ID(proxyKey);
    queryContext.queryProxyKey = proxyKey;
    const baseTree = bp.trees[proxyType];
    const fatAABB = baseTree.nodes[proxyId].aabb;
    queryContext.queryShapeIndex = b2DynamicTree_GetUserData(baseTree, proxyId);
    const moveResult = bp.moveResults[i];
    moveResult.pairList = null;
    queryContext.moveResult = moveResult;
    if (proxyType === b2BodyType.b2_dynamicBody) {
      b2QueryTreeForPairs(bp, fatAABB, queryContext, b2BodyType.b2_kinematicBody);
      b2QueryTreeForPairs(bp, fatAABB, queryContext, b2BodyType.b2_staticBody);
    }
    queryContext.queryTreeType = b2BodyType.b2_dynamicBody;
    b2DynamicTree_QueryAll(bp.trees[b2BodyType.b2_dynamicBody], fatAABB, queryContext);
  }
}
function b2QueryTreeForPairs(bp, fatAABB, queryContext, treeType) {
  queryContext.queryTreeType = treeType;
  b2DynamicTree_QueryAll(bp.trees[treeType], fatAABB, queryContext);
}
function b2BroadPhase_RebuildTrees(bp) {
  b2DynamicTree_Rebuild(bp.trees[b2BodyType.b2_dynamicBody]);
  b2DynamicTree_Rebuild(bp.trees[b2BodyType.b2_kinematicBody]);
}

// src/world_c.js
var B2_MAX_WORLDS = 32;
var b2SetType = {
  b2_staticSet: 0,
  b2_disabledSet: 1,
  b2_awakeSet: 2,
  b2_firstSleepingSet: 3
};
var b2World = class {
  stackAllocator = new b2StackAllocator();
  broadPhase = new b2BroadPhase();
  constraintGraph = new b2ConstraintGraph();
  // bodyIdPool = new b2IdPool();
  bodyArray = [];
  // solverSetIdPool = new b2IdPool();
  solverSetArray = [];
  // jointIdPool = new b2IdPool();
  jointArray = [];
  // contactIdPool = new b2IdPool();
  contactArray = [];
  // islandIdPool = new b2IdPool();
  islandArray = [];
  // shapeIdPool = new b2IdPool();
  // chainIdPool = new b2IdPool();
  shapeArray = [];
  chainArray = [];
  taskContextArray = [];
  bodyMoveEventArray = [];
  sensorBeginEventArray = [];
  sensorEndEventArray = [];
  contactBeginArray = [];
  contactEndArray = [];
  contactHitArray = [];
  debugBodySet = new b2BitSet();
  debugJointSet = new b2BitSet();
  debugContactSet = new b2BitSet();
  stepIndex = 0;
  splitIslandId = 0;
  gravity = new b2Vec2(0, 0);
  hitEventThreshold = 0;
  restitutionThreshold = 0;
  maxLinearVelocity = 0;
  contactPushoutVelocity = 0;
  contactHertz = 0;
  contactDampingRatio = 0;
  jointHertz = 0;
  jointDampingRatio = 0;
  revision = 0;
  // profile = new b2Profile();
  preSolveFcn = null;
  preSolveContext = null;
  customFilterFcn = null;
  customFilterContext = null;
  workerCount = 0;
  userTaskContext = null;
  userTreeTask = null;
  inv_h = 0;
  worldId = new b2WorldId();
  enableSleep = true;
  locked = false;
  enableWarmStarting = false;
  enableContinuous = false;
  inUse = false;
};
var WorldOverlapContext = class {
  constructor() {
    this.world = null;
    this.fcn = null;
    this.filter = null;
    this.proxy = null;
    this.transform = null;
    this.userContext = null;
  }
};
var WorldRayCastContext = class {
  constructor() {
    this.world = null;
    this.fcn = null;
    this.filter = null;
    this.fraction = 0;
    this.userContext = null;
  }
};
var b2TaskContext = class {
  constructor() {
    this.contactStateBitSet = new b2BitSet();
    this.enlargedSimBitSet = new b2BitSet();
    this.awakeIslandBitSet = new b2BitSet();
    this.splitSleepTime = 0;
    this.splitIslandId = B2_NULL_INDEX;
  }
};
function b2GetWorldFromId(id) {
  const world = b2_worlds[id.index1 - 1];
  return world;
}
function b2GetWorld(index) {
  const world = b2_worlds[index];
  return world;
}
function b2GetWorldLocked(index) {
  const world = b2_worlds[index];
  if (world.locked) {
    return null;
  }
  return world;
}
var b2_worlds = null;
function b2CreateWorldArray() {
  if (b2_worlds != null) {
    return;
  }
  b2_worlds = [];
  for (let i = 0; i < B2_MAX_WORLDS; i++) {
    b2_worlds[i] = new b2World();
    b2_worlds[i].inUse = false;
  }
}
function b2CreateWorld(def) {
  let worldId = B2_NULL_INDEX;
  for (let i = 0; i < b2_worlds.length; ++i) {
    if (b2_worlds[i].inUse === false) {
      worldId = i;
      break;
    }
  }
  if (worldId === B2_NULL_INDEX) {
    return new b2WorldId(0, 0);
  }
  b2InitializeContactRegisters();
  const world = b2_worlds[worldId];
  const revision = world.revision;
  world.worldId = worldId;
  world.revision = revision;
  world.inUse = true;
  world.stackAllocator = b2CreateStackAllocator();
  b2CreateBroadPhase(world.broadPhase);
  world.constraintGraph = b2CreateGraph(world.constraintGraph, 16);
  world.bodyIdPool = b2CreateIdPool("body");
  world.bodyArray = [];
  world.solverSetArray = [];
  world.solverSetIdPool = b2CreateIdPool("solverSet");
  let set;
  set = new b2SolverSet();
  set.setIndex = b2AllocId(world.solverSetIdPool);
  world.solverSetArray.push(set);
  set = new b2SolverSet();
  set.setIndex = b2AllocId(world.solverSetIdPool);
  world.solverSetArray.push(set);
  set = new b2SolverSet();
  set.setIndex = b2AllocId(world.solverSetIdPool);
  world.solverSetArray.push(set);
  world.shapeIdPool = b2CreateIdPool("shapeId");
  world.shapeArray = [];
  world.chainIdPool = b2CreateIdPool("chainId");
  world.chainArray = [];
  world.contactIdPool = b2CreateIdPool("contactId");
  world.contactArray = [];
  for (let i = 0; i < 4096; i++) {
    world.contactArray.push(new b2Contact());
  }
  world.jointIdPool = b2CreateIdPool("jointId");
  world.jointArray = [];
  world.islandIdPool = b2CreateIdPool("islandId");
  world.islandArray = [];
  world.bodyMoveEventArray = [];
  world.sensorBeginEventArray = [];
  world.sensorEndEventArray = [];
  world.contactBeginArray = [];
  world.contactEndArray = [];
  world.contactHitArray = [];
  world.stepIndex = 0;
  world.splitIslandId = B2_NULL_INDEX;
  world.gravity = def.gravity;
  world.hitEventThreshold = def.hitEventThreshold;
  world.restitutionThreshold = def.restitutionThreshold;
  world.maxLinearVelocity = def.maximumLinearVelocity;
  world.contactPushoutVelocity = def.contactPushoutVelocity;
  world.contactHertz = def.contactHertz;
  world.contactDampingRatio = def.contactDampingRatio;
  world.jointHertz = def.jointHertz;
  world.jointDampingRatio = def.jointDampingRatio;
  world.enableSleep = def.enableSleep;
  world.locked = false;
  world.enableWarmStarting = true;
  world.enableContinuous = def.enableContinuous;
  world.userTreeTask = null;
  world.workerCount = 1;
  world.userTaskContext = null;
  world.taskContextArray = [];
  for (let i = 0; i < world.workerCount; ++i) {
    const context = new b2TaskContext();
    context.contactStateBitSet = b2CreateBitSet(1024);
    context.enlargedSimBitSet = b2CreateBitSet(256), context.awakeIslandBitSet = b2CreateBitSet(256);
    world.taskContextArray[i] = context;
  }
  world.debugBodySet = b2CreateBitSet(256);
  world.debugJointSet = b2CreateBitSet(256);
  world.debugContactSet = b2CreateBitSet(256);
  return new b2WorldId(worldId + 1, world.revision);
}
function b2DestroyWorld(worldId) {
  let world = b2GetWorldFromId(worldId);
  b2DestroyBitSet(world.debugBodySet);
  b2DestroyBitSet(world.debugJointSet);
  b2DestroyBitSet(world.debugContactSet);
  for (let i = 0; i < world.workerCount; ++i) {
    b2DestroyBitSet(world.taskContextArray[i].contactStateBitSet);
    b2DestroyBitSet(world.taskContextArray[i].enlargedSimBitSet);
    b2DestroyBitSet(world.taskContextArray[i].awakeIslandBitSet);
  }
  world.taskContextArray = null;
  world.bodyMoveEventArray = null;
  world.sensorBeginEventArray = null;
  world.sensorEndEventArray = null;
  world.contactBeginArray = null;
  world.contactEndArray = null;
  world.contactHitArray = null;
  const chainCapacity = world.chainArray.length;
  for (let i = 0; i < chainCapacity; ++i) {
    const chain = world.chainArray[i];
    if (chain.id !== B2_NULL_INDEX) {
      chain.shapeIndices = null;
    } else {
    }
  }
  world.bodyArray = null;
  world.shapeArray = null;
  world.chainArray = null;
  world.contactArray = null;
  world.jointArray = null;
  world.islandArray = null;
  const setCapacity = world.solverSetArray.length;
  for (let i = 0; i < setCapacity; ++i) {
    const set = world.solverSetArray[i];
    if (set.setIndex !== B2_NULL_INDEX) {
      b2DestroySolverSet(world, i);
    }
  }
  world.solverSetArray = null;
  b2DestroyGraph(world.constraintGraph);
  b2DestroyBroadPhase(world.broadPhase);
  b2DestroyIdPool(world.bodyIdPool);
  b2DestroyIdPool(world.shapeIdPool);
  b2DestroyIdPool(world.chainIdPool);
  b2DestroyIdPool(world.contactIdPool);
  b2DestroyIdPool(world.jointIdPool);
  b2DestroyIdPool(world.islandIdPool);
  b2DestroyIdPool(world.solverSetIdPool);
  b2DestroyStackAllocator(world.stackAllocator);
  const revision = world.revision;
  world = new b2World();
  world.worldId = B2_NULL_INDEX;
  world.revision = revision + 1;
}
var centerOffsetA = new b2Vec2();
var centerOffsetB = new b2Vec2();
function b2CollideTask(startIndex, endIndex, threadIndex, context) {
  const stepContext = context;
  const world = stepContext.world;
  const taskContext = world.taskContextArray[threadIndex];
  const contactSims = stepContext.contacts;
  const shapes = world.shapeArray;
  const bodies = world.bodyArray;
  for (let i = startIndex; i < endIndex; ++i) {
    const contactSim = contactSims[i];
    const contactId = contactSim.contactId;
    const shapeA = shapes[contactSim.shapeIdA];
    const shapeB = shapes[contactSim.shapeIdB];
    const overlap = b2AABB_Overlaps(shapeA.fatAABB, shapeB.fatAABB);
    if (!overlap) {
      contactSim.simFlags |= b2ContactSimFlags.b2_simDisjoint;
      contactSim.simFlags &= ~b2ContactSimFlags.b2_simTouchingFlag;
      b2SetBit(taskContext.contactStateBitSet, contactId);
    } else {
      const wasTouching = (contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag) !== 0;
      const bodyA = bodies[shapeA.bodyId];
      const bodyB = bodies[shapeB.bodyId];
      const bodySimA = b2GetBodySim(world, bodyA);
      const bodySimB = b2GetBodySim(world, bodyB);
      contactSim.bodySimIndexA = bodyA.setIndex === b2SetType.b2_awakeSet ? bodyA.localIndex : B2_NULL_INDEX;
      contactSim.invMassA = bodySimA.invMass;
      contactSim.invIA = bodySimA.invInertia;
      contactSim.bodySimIndexB = bodyB.setIndex === b2SetType.b2_awakeSet ? bodyB.localIndex : B2_NULL_INDEX;
      contactSim.invMassB = bodySimB.invMass;
      contactSim.invIB = bodySimB.invInertia;
      const transformA = bodySimA.transform;
      const transformB = bodySimB.transform;
      centerOffsetA.x = transformA.q.c * bodySimA.localCenter.x - transformA.q.s * bodySimA.localCenter.y;
      centerOffsetA.y = transformA.q.s * bodySimA.localCenter.x + transformA.q.c * bodySimA.localCenter.y;
      centerOffsetB.x = transformB.q.c * bodySimB.localCenter.x - transformB.q.s * bodySimB.localCenter.y;
      centerOffsetB.y = transformB.q.s * bodySimB.localCenter.x + transformB.q.c * bodySimB.localCenter.y;
      const touching = b2UpdateContact(world, contactSim, shapeA, transformA, centerOffsetA, shapeB, transformB, centerOffsetB);
      if (touching && !wasTouching) {
        contactSim.simFlags |= b2ContactSimFlags.b2_simStartedTouching;
        b2SetBit(taskContext.contactStateBitSet, contactId);
      } else if (!touching && wasTouching) {
        contactSim.simFlags |= b2ContactSimFlags.b2_simStoppedTouching;
        b2SetBit(taskContext.contactStateBitSet, contactId);
      }
    }
  }
}
function b2AddNonTouchingContact(world, contact, contactSim) {
  const set = world.solverSetArray[b2SetType.b2_awakeSet];
  contact.colorIndex = B2_NULL_INDEX;
  contact.localIndex = set.contacts.count;
  const newContactSim = b2AddContact(set.contacts);
  newContactSim.set(contactSim);
}
function b2RemoveNonTouchingContact(world, setIndex, localIndex) {
  const set = world.solverSetArray[setIndex];
  const movedIndex = b2RemoveContact(set.contacts, localIndex);
  if (movedIndex !== B2_NULL_INDEX) {
    const movedContactSim = set.contacts.data[localIndex];
    const movedContact = world.contactArray[movedContactSim.contactId];
    movedContact.localIndex = localIndex;
  }
}
function b2Collide(context) {
  const world = context.world;
  b2BroadPhase_RebuildTrees(world.broadPhase);
  let contactCount = 0;
  const graphColors = world.constraintGraph.colors;
  for (let i = 0; i < b2_graphColorCount; ++i) {
    contactCount += graphColors[i].contacts.count;
  }
  const nonTouchingCount = world.solverSetArray[b2SetType.b2_awakeSet].contacts.count;
  contactCount += nonTouchingCount;
  if (contactCount == 0) {
    return;
  }
  const contactSims = [];
  let contactIndex = 0;
  for (let i = 0; i < b2_graphColorCount; ++i) {
    const color = graphColors[i];
    const count = color.contacts.count;
    const base = color.contacts.data;
    for (let j = 0; j < count; ++j) {
      contactSims.push(base[j]);
      contactIndex += 1;
    }
  }
  {
    const base = world.solverSetArray[b2SetType.b2_awakeSet].contacts.data;
    for (let i = 0; i < nonTouchingCount; ++i) {
      contactSims.push(base[i]);
      contactIndex += 1;
    }
  }
  context.contacts = contactSims;
  const contactIdCapacity = b2GetIdCapacity(world.contactIdPool);
  for (let i = 0; i < world.workerCount; ++i) {
    world.taskContextArray[i].contactStateBitSet = b2SetBitCountAndClear(world.taskContextArray[i].contactStateBitSet, contactIdCapacity);
  }
  b2CollideTask(0, contactCount, 0, context);
  context.contacts = null;
  const bitSet = world.taskContextArray[0].contactStateBitSet;
  for (let i = 1; i < world.workerCount; ++i) {
    b2InPlaceUnion(bitSet, world.taskContextArray[i].contactStateBitSet);
  }
  const contacts = world.contactArray;
  const awakeSet = world.solverSetArray[b2SetType.b2_awakeSet];
  const shapes = world.shapeArray;
  const worldId = world.worldId;
  for (let k = 0; k < bitSet.blockCount; ++k) {
    let bits = bitSet.bits[k];
    while (bits != 0n) {
      const ctz = b2CTZ64(bits);
      const contactId = 64 * k + ctz;
      const contact = contacts[contactId];
      const colorIndex = contact.colorIndex;
      const localIndex = contact.localIndex;
      let contactSim;
      if (colorIndex != B2_NULL_INDEX) {
        const color = graphColors[colorIndex];
        contactSim = color.contacts.data[localIndex];
      } else {
        contactSim = awakeSet.contacts.data[localIndex];
      }
      const shapeA = shapes[contact.shapeIdA];
      const shapeB = shapes[contact.shapeIdB];
      const shapeIdA = new b2ShapeId(shapeA.id + 1, worldId, shapeA.revision);
      const shapeIdB = new b2ShapeId(shapeB.id + 1, worldId, shapeB.revision);
      const flags = contact.flags;
      const simFlags = contactSim.simFlags;
      if (simFlags & b2ContactSimFlags.b2_simDisjoint) {
        if ((flags & b2ContactFlags.b2_contactTouchingFlag) != 0 && (flags & b2ContactFlags.b2_contactEnableContactEvents) != 0) {
          const event = new b2ContactEndTouchEvent();
          event.shapeIdA = shapeIdA;
          event.shapeIdB = shapeIdB;
          world.contactEndArray.push(event);
        }
        contact.flags &= ~b2ContactFlags.b2_contactTouchingFlag;
        b2DestroyContact(world, contact, false);
      } else if (simFlags & b2ContactSimFlags.b2_simStartedTouching) {
        if ((flags & b2ContactFlags.b2_contactSensorFlag) != 0) {
          if ((flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0) {
            if (shapeA.isSensor) {
              const event = new b2SensorBeginTouchEvent();
              event.sensorShapeId = shapeIdA;
              event.visitorShapeId = shapeIdB;
              world.sensorBeginEventArray.push(event);
            }
            if (shapeB.isSensor) {
              const event = new b2SensorBeginTouchEvent();
              event.sensorShapeId = shapeIdB;
              event.visitorShapeId = shapeIdA;
              world.sensorBeginEventArray.push(event);
            }
          }
          contactSim.simFlags &= ~b2ContactSimFlags.b2_simStartedTouching;
          contact.flags |= b2ContactFlags.b2_contactSensorTouchingFlag;
        } else {
          if (flags & b2ContactFlags.b2_contactEnableContactEvents) {
            const event = new b2ContactBeginTouchEvent();
            event.shapeIdA = shapeIdA;
            event.shapeIdB = shapeIdB;
            event.manifold = contactSim.manifold;
            world.contactBeginArray.push(event);
          }
          contact.flags |= b2ContactFlags.b2_contactTouchingFlag;
          b2LinkContact(world, contact);
          contactSim = awakeSet.contacts.data[localIndex];
          contactSim.simFlags &= ~b2ContactSimFlags.b2_simStartedTouching;
          b2AddContactToGraph(world, contactSim, contact);
          b2RemoveNonTouchingContact(world, b2SetType.b2_awakeSet, localIndex);
        }
      } else if (simFlags & b2ContactSimFlags.b2_simStoppedTouching) {
        contactSim.simFlags &= ~b2ContactSimFlags.b2_simStoppedTouching;
        if ((flags & b2ContactFlags.b2_contactSensorFlag) != 0) {
          contact.flags &= ~b2ContactFlags.b2_contactSensorTouchingFlag;
          if ((flags & b2ContactFlags.b2_contactEnableSensorEvents) != 0) {
            if (shapeA.isSensor) {
              const event = new b2SensorEndTouchEvent();
              event.sensorShapeId = shapeIdA;
              event.visitorShapeId = shapeIdB;
              world.sensorEndEventArray.push(event);
            }
            if (shapeB.isSensor) {
              const event = new b2SensorEndTouchEvent();
              event.sensorShapeId = shapeIdB;
              event.visitorShapeId = shapeIdA;
              world.sensorEndEventArray.push(event);
            }
          }
        } else {
          contact.flags &= ~b2ContactFlags.b2_contactTouchingFlag;
          if (contact.flags & b2ContactFlags.b2_contactEnableContactEvents) {
            const event = new b2ContactEndTouchEvent();
            event.shapeIdA = shapeIdA;
            event.shapeIdB = shapeIdB;
            world.contactEndArray.push(event);
          }
          b2UnlinkContact(world, contact);
          const bodyIdA = contact.edges[0].bodyId;
          const bodyIdB = contact.edges[1].bodyId;
          b2AddNonTouchingContact(world, contact, contactSim);
          b2RemoveContactFromGraph(world, bodyIdA, bodyIdB, colorIndex, localIndex);
        }
      }
      bits = bits & bits - 1n;
    }
  }
  b2ValidateSolverSets(world);
  b2ValidateContacts(world);
}
GlobalDebug.b2Vec2Count = 0;
b2Vec2Where.calls = {};
GlobalDebug.b2Rot2Count = 0;
b2Rot2Where.calls = {};
GlobalDebug.b2ManifoldCount = 0;
GlobalDebug.b2ManifoldPointCount = 0;
b2ManifoldPointWhere.calls = {};
GlobalDebug.b2PolyCollideCount = 0;
GlobalDebug.b2ContactSimCount = 0;
GlobalDebug.b2TOIInputCount = 0;
GlobalDebug.b2ShapeCastPairInputCount = 0;
GlobalDebug.b2SweepCount = 0;
function b2World_Step(worldId, timeStep, subStepCount) {
  GlobalDebug.b2FrameCount++;
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.bodyMoveEventArray = [];
  world.sensorBeginEventArray = [];
  world.sensorEndEventArray = [];
  world.contactBeginArray = [];
  world.contactEndArray = [];
  world.contactHitArray = [];
  if (timeStep === 0) {
    return;
  }
  world.locked = true;
  b2UpdateBroadPhasePairs(world);
  const context = new b2StepContext();
  context.world = world;
  context.dt = timeStep;
  context.subStepCount = Math.max(1, subStepCount);
  if (timeStep > 0) {
    context.inv_dt = 1 / timeStep;
    context.h = timeStep / context.subStepCount;
    context.inv_h = context.subStepCount * context.inv_dt;
  } else {
    context.inv_dt = 0;
    context.h = 0;
    context.inv_h = 0;
  }
  world.inv_h = context.inv_h;
  const contactHertz = Math.min(world.contactHertz, 0.25 * context.inv_h);
  const jointHertz = Math.min(world.jointHertz, 0.125 * context.inv_h);
  context.contactSoftness = b2MakeSoft(contactHertz, world.contactDampingRatio, context.h);
  context.staticSoftness = b2MakeSoft(2 * contactHertz, world.contactDampingRatio, context.h);
  context.jointSoftness = b2MakeSoft(jointHertz, world.jointDampingRatio, context.h);
  context.restitutionThreshold = world.restitutionThreshold;
  context.maxLinearVelocity = world.maxLinearVelocity;
  context.enableWarmStarting = world.enableWarmStarting;
  b2Collide(context);
  if (context.dt > 0) {
    b2Solve(world, context);
  }
  world.locked = false;
}
var p13 = new b2Vec2();
var p22 = new b2Vec2();
var q = new b2Rot();
var txf = new b2Transform(p13, q);
function b2DrawShape(draw, shape, transform, color) {
  const xf2 = transform.clone();
  switch (shape.type) {
    case b2ShapeType.b2_capsuleShape:
      {
        const capsule = shape.capsule;
        b2TransformPointOut(xf2, capsule.center1, p13);
        b2TransformPointOut(xf2, capsule.center2, p22);
        if (shape.image) {
          draw.DrawImageCapsule(p13, p22, capsule.radius, shape, draw.context);
        } else if (!shape.imageNoDebug) {
          draw.DrawSolidCapsule(p13, p22, capsule.radius, color, draw.context);
        }
      }
      break;
    case b2ShapeType.b2_circleShape:
      {
        const circle = shape.circle;
        b2TransformPointOutXf(xf2, circle.center, txf);
        if (shape.image) {
          draw.DrawImageCircle(txf, circle.radius, shape, draw.context);
        } else if (!shape.imageNoDebug) {
          draw.DrawSolidCircle(txf, circle.radius, color, draw.context);
        }
      }
      break;
    case b2ShapeType.b2_polygonShape:
      {
        const poly = shape.polygon;
        if (shape.image) {
          draw.DrawImagePolygon(xf2, shape, draw.context);
        } else if (!shape.imageNoDebug) {
          draw.DrawSolidPolygon(xf2, poly.vertices, poly.count, poly.radius, color, draw.context);
        }
      }
      break;
    case b2ShapeType.b2_segmentShape:
      {
        const segment = shape.segment;
        b2TransformPointOut(xf2, segment.point1, p13);
        b2TransformPointOut(xf2, segment.point2, p22);
        if (!shape.imageNoDebug) {
          draw.DrawSegment(p13, p22, color, draw.context);
        }
      }
      break;
    case b2ShapeType.b2_chainSegmentShape:
      {
        const segment = shape.chainSegment.segment;
        b2TransformPointOut(xf2, segment.point1, p13);
        b2TransformPointOut(xf2, segment.point2, p22);
        if (!shape.imageNoDebug) {
          draw.DrawSegment(p13, p22, color, draw.context);
        }
      }
      break;
    default:
      break;
  }
}
var DrawContext = class {
  constructor(world, draw) {
    this.world = world;
    this.draw = draw;
  }
};
function DrawQueryCallback(proxyId, shapeId, context) {
  const drawContext = context;
  const world = drawContext.world;
  const draw = drawContext.draw;
  const shape = world.shapeArray[shapeId];
  b2SetBit(world.debugBodySet, shape.bodyId);
  if (draw.drawShapes) {
    const body = world.bodyArray[shape.bodyId];
    const bodySim = b2GetBodySim(world, body);
    let color;
    if (body.setIndex >= b2SetType.b2_firstSleepingSet) {
      color = b2HexColor.b2_colorGray;
    } else if (shape.customColor !== 0) {
      color = shape.customColor;
    } else if (body.type === b2BodyType.b2_dynamicBody && bodySim.mass === 0) {
      color = b2HexColor.b2_colorRed;
    } else if (body.setIndex === b2SetType.b2_disabledSet) {
      color = b2HexColor.b2_colorSlateGray;
    } else if (shape.isSensor) {
      color = b2HexColor.b2_colorWheat;
    } else if (bodySim.isBullet && body.setIndex === b2SetType.b2_awakeSet) {
      color = b2HexColor.b2_colorTurquoise;
    } else if (body.isSpeedCapped) {
      color = b2HexColor.b2_colorYellow;
    } else if (bodySim.isFast) {
      color = b2HexColor.b2_colorSalmon;
    } else if (body.type === b2BodyType.b2_staticBody) {
      color = b2HexColor.b2_colorPaleGreen;
    } else if (body.type === b2BodyType.b2_kinematicBody) {
      color = b2HexColor.b2_colorRoyalBlue;
    } else if (body.setIndex === b2SetType.b2_awakeSet) {
      color = b2HexColor.b2_colorPink;
    } else {
      color = b2HexColor.b2_colorGray;
    }
    b2DrawShape(draw, shape, bodySim.transform, color);
  }
  if (draw.drawAABBs) {
    const aabb = shape.fatAABB;
    const vs = [
      new b2Vec2(aabb.lowerBoundX, aabb.lowerBoundY),
      new b2Vec2(aabb.upperBoundX, aabb.lowerBoundY),
      new b2Vec2(aabb.upperBoundX, aabb.upperBoundY),
      new b2Vec2(aabb.lowerBoundX, aabb.upperBoundY)
    ];
    draw.DrawPolygon(vs, 4, b2HexColor.b2_colorGold, draw.context);
  }
  return true;
}
function b2DrawWithBounds(world, draw) {
  const k_impulseScale = 1;
  const k_axisScale = 0.3;
  const speculativeColor = b2HexColor.b2_colorGray3;
  const addColor = b2HexColor.b2_colorGreen;
  const persistColor = b2HexColor.b2_colorBlue;
  const normalColor = b2HexColor.b2_colorGray9;
  const impulseColor = b2HexColor.b2_colorMagenta;
  const frictionColor = b2HexColor.b2_colorYellow;
  const graphColors = [
    b2HexColor.b2_colorRed,
    b2HexColor.b2_colorOrange,
    b2HexColor.b2_colorYellow,
    b2HexColor.b2_colorGreen,
    b2HexColor.b2_colorCyan,
    b2HexColor.b2_colorBlue,
    b2HexColor.b2_colorViolet,
    b2HexColor.b2_colorPink,
    b2HexColor.b2_colorChocolate,
    b2HexColor.b2_colorGoldenrod,
    b2HexColor.b2_colorCoral,
    b2HexColor.b2_colorBlack
  ];
  const bodyCapacity = b2GetIdCapacity(world.bodyIdPool);
  world.debugBodySet = b2SetBitCountAndClear(world.debugBodySet, bodyCapacity);
  const jointCapacity = b2GetIdCapacity(world.jointIdPool);
  world.debugJointSet = b2SetBitCountAndClear(world.debugJointSet, jointCapacity);
  const contactCapacity = b2GetIdCapacity(world.contactIdPool);
  world.debugContactSet = b2SetBitCountAndClear(world.debugContactSet, contactCapacity);
  const drawContext = new DrawContext(world, draw);
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Query(
      world.broadPhase.trees[i],
      draw.drawingBounds,
      B2_DEFAULT_MASK_BITS,
      DrawQueryCallback,
      drawContext
    );
  }
  const wordCount = world.debugBodySet.blockCount;
  const bits = world.debugBodySet.bits;
  for (let k = 0; k < wordCount; ++k) {
    let word = bits[k];
    while (word !== 0) {
      const ctz = b2CTZ64(word);
      const bodyId = 64 * k + ctz;
      const body = world.bodyArray[bodyId];
      if (draw.drawMass && body.type === b2BodyType.b2_dynamicBody) {
        const offset = new b2Vec2(0.1, 0.1);
        const bodySim = b2GetBodySim(world, body);
        const transform = new b2Transform(bodySim.center, bodySim.transform.q);
        draw.DrawTransform(transform, draw.context);
        const p4 = b2TransformPoint(transform, offset);
        const buffer = `  ${bodySim.mass.toFixed(2)}`;
        draw.DrawString(p4, buffer, draw.context);
      }
      if (draw.drawJoints) {
        let jointKey = body.headJointKey;
        while (jointKey !== B2_NULL_INDEX) {
          const jointId = jointKey >> 1;
          const edgeIndex = jointKey & 1;
          const joint = world.jointArray[jointId];
          if (b2GetBit2(world.debugJointSet, jointId) === false) {
            b2DrawJoint(draw, world, joint);
            b2SetBit(world.debugJointSet, jointId);
          }
          jointKey = joint.edges[edgeIndex].nextKey;
        }
      }
      const linearSlop = b2_linearSlop;
      if (draw.drawContacts && body.type === b2BodyType.b2_dynamicBody && body.setIndex === b2SetType.b2_awakeSet) {
        let contactKey = body.headContactKey;
        while (contactKey !== B2_NULL_INDEX) {
          const contactId = contactKey >> 1;
          const edgeIndex = contactKey & 1;
          const contact = world.contactArray[contactId];
          contactKey = contact.edges[edgeIndex].nextKey;
          if (contact.setIndex !== b2SetType.b2_awakeSet || contact.colorIndex === B2_NULL_INDEX) {
            continue;
          }
          if (b2GetBit2(world.debugContactSet, contactId) === false) {
            const gc = world.constraintGraph.colors[contact.colorIndex];
            const contactSim = gc.contacts.data[contact.localIndex];
            const pointCount = contactSim.manifold.pointCount;
            const normal = new b2Vec2(contactSim.manifold.normalX, contactSim.manifold.normalY);
            for (let j = 0; j < pointCount; ++j) {
              const point = contactSim.manifold.points[j];
              if (draw.drawGraphColors) {
                const pointSize = contact.colorIndex === b2_overflowIndex ? 7.5 : 5;
                draw.DrawPoint(point.pointX, point.pointY, pointSize, graphColors[contact.colorIndex], draw.context);
              } else if (point.separation > linearSlop) {
                draw.DrawPoint(point.pointX, point.pointY, 5, speculativeColor, draw.context);
              } else if (point.persisted === false) {
                draw.DrawPoint(point.pointX, point.pointY, 10, addColor, draw.context);
              } else if (point.persisted === true) {
                draw.DrawPoint(point.pointX, point.pointY, 5, persistColor, draw.context);
              }
              if (draw.drawContactNormals) {
                const p14 = new b2Vec2(point.pointX, point.pointY);
                const p23 = b2MulAdd(p14, k_axisScale, normal);
                draw.DrawSegment(p14, p23, normalColor, draw.context);
              } else if (draw.drawContactImpulses) {
                const p14 = new b2Vec2(point.pointX, point.pointY);
                const p23 = b2MulAdd(p14, k_impulseScale * point.normalImpulse, normal);
                draw.DrawSegment(p14, p23, impulseColor, draw.context);
                const buffer = `${(1e3 * point.normalImpulse).toFixed(1)}`;
                draw.DrawString(p14, buffer, draw.context);
              }
              if (draw.drawFrictionImpulses) {
                const tangent = b2RightPerp(normal);
                const p14 = new b2Vec2(point.pointX, point.pointY);
                const p23 = b2MulAdd(p14, k_impulseScale * point.tangentImpulse, tangent);
                draw.DrawSegment(p14, p23, frictionColor, draw.context);
                const buffer = `${(1e3 * point.tangentImpulse).toFixed(1)}`;
                draw.DrawString(p14, buffer, draw.context);
              }
            }
            b2SetBit(world.debugContactSet, contactId);
          }
          contactKey = contact.edges[edgeIndex].nextKey;
        }
      }
      word = word & word - 1;
    }
  }
}
function b2World_Draw(worldId, draw) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  if (draw.useDrawingBounds) {
    b2DrawWithBounds(world, draw);
    return;
  }
  if (draw.drawShapes) {
    const setCount = world.solverSetArray.length;
    for (let setIndex = 0; setIndex < setCount; ++setIndex) {
      const set = world.solverSetArray[setIndex];
      const bodyCount = set.sims.count;
      for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex) {
        const bodySim = set.sims.data[bodyIndex];
        const body = world.bodyArray[bodySim.bodyId];
        const xf2 = bodySim.transform;
        let shapeId = body.headShapeId;
        while (shapeId !== B2_NULL_INDEX) {
          const shape = world.shapeArray[shapeId];
          let color;
          if (body.setIndex >= b2SetType.b2_firstSleepingSet) {
            color = b2HexColor.b2_colorGray;
          } else if (shape.customColor !== 0) {
            color = shape.customColor;
          } else if (body.type === b2BodyType.b2_dynamicBody && bodySim.mass === 0) {
            color = b2HexColor.b2_colorRed;
          } else if (body.setIndex === b2SetType.b2_disabledSet) {
            color = b2HexColor.b2_colorSlateGray;
          } else if (shape.isSensor) {
            color = b2HexColor.b2_colorWheat;
          } else if (bodySim.isBullet && body.setIndex === b2SetType.b2_awakeSet) {
            color = b2HexColor.b2_colorTurquoise;
          } else if (body.isSpeedCapped) {
            color = b2HexColor.b2_colorYellow;
          } else if (bodySim.isFast) {
            color = b2HexColor.b2_colorSalmon;
          } else if (body.type === b2BodyType.b2_staticBody) {
            color = b2HexColor.b2_colorPaleGreen;
          } else if (body.type === b2BodyType.b2_kinematicBody) {
            color = b2HexColor.b2_colorRoyalBlue;
          } else if (body.setIndex === b2SetType.b2_awakeSet) {
            color = b2HexColor.b2_colorPink;
          } else {
            color = b2HexColor.b2_colorGray;
          }
          b2DrawShape(draw, shape, xf2, color);
          shapeId = shape.nextShapeId;
        }
      }
    }
  }
  if (draw.drawJoints) {
    const count = world.jointArray.length;
    for (let i = 0; i < count; ++i) {
      const joint = world.jointArray[i];
      if (joint.setIndex === B2_NULL_INDEX) {
        continue;
      }
      b2DrawJoint(draw, world, joint);
    }
  }
  if (draw.drawAABBs) {
    const color = b2HexColor.b2_colorGray;
    const setIndex = b2SetType.b2_awakeSet;
    {
      const set = world.solverSetArray[setIndex];
      const bodyCount = set.sims.count;
      for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex) {
        const bodySim = set.sims.data[bodyIndex];
        const xf2 = b2Transform.identity();
        const body = world.bodyArray[bodySim.bodyId];
        let shapeId = body.headShapeId;
        while (shapeId !== B2_NULL_INDEX) {
          const shape = world.shapeArray[shapeId];
          const aabb = shape.fatAABB;
          const vs = [
            new b2Vec2(aabb.lowerBoundX, aabb.lowerBoundY),
            new b2Vec2(aabb.upperBoundX, aabb.lowerBoundY),
            new b2Vec2(aabb.upperBoundX, aabb.upperBoundY),
            new b2Vec2(aabb.lowerBoundX, aabb.upperBoundY)
          ];
          draw.DrawPolygon(xf2, vs, 4, color, draw.context);
          shapeId = shape.nextShapeId;
        }
      }
    }
  }
  if (draw.drawMass) {
    const offset = new b2Vec2(0.1, 0.1);
    const setCount = world.solverSetArray.length;
    for (let setIndex = 0; setIndex < setCount; ++setIndex) {
      const set = world.solverSetArray[setIndex];
      const bodyCount = set.sims.count;
      for (let bodyIndex = 0; bodyIndex < bodyCount; ++bodyIndex) {
        const bodySim = set.sims.data[bodyIndex];
        const transform = new b2Transform(bodySim.center, bodySim.transform.q);
        draw.DrawTransform(transform, draw.context);
        const p4 = b2TransformPoint(transform, offset);
        const buffer = `  ${bodySim.mass.toFixed(2)}`;
        draw.DrawString(p4, buffer, draw.context);
      }
    }
  }
  if (draw.drawContacts) {
    const k_impulseScale = 1;
    const k_axisScale = 0.3;
    const linearSlop = b2_linearSlop;
    const speculativeColor = b2HexColor.b2_colorGray3;
    const addColor = b2HexColor.b2_colorGreen;
    const persistColor = b2HexColor.b2_colorBlue;
    const normalColor = b2HexColor.b2_colorGray9;
    const impulseColor = b2HexColor.b2_colorMagenta;
    const frictionColor = b2HexColor.b2_colorYellow;
    const colors = [
      b2HexColor.b2_colorRed,
      b2HexColor.b2_colorOrange,
      b2HexColor.b2_colorYellow,
      b2HexColor.b2_colorGreen,
      b2HexColor.b2_colorCyan,
      b2HexColor.b2_colorBlue,
      b2HexColor.b2_colorViolet,
      b2HexColor.b2_colorPink,
      b2HexColor.b2_colorChocolate,
      b2HexColor.b2_colorGoldenrod,
      b2HexColor.b2_colorCoral,
      b2HexColor.b2_colorBlack
    ];
    for (let colorIndex = 0; colorIndex < b2_graphColorCount; ++colorIndex) {
      const graphColor = world.constraintGraph.colors[colorIndex];
      const contactCount = graphColor.contacts.count;
      for (let contactIndex = 0; contactIndex < contactCount; ++contactIndex) {
        const contact = graphColor.contacts.data[contactIndex];
        const pointCount = contact.manifold.pointCount;
        const normal = new b2Vec2(contact.manifold.normalX, contact.manifold.normalY);
        for (let j = 0; j < pointCount; ++j) {
          const point = contact.manifold.points[j];
          if (draw.drawGraphColors && 0 <= colorIndex && colorIndex <= b2_graphColorCount) {
            const pointSize = colorIndex === b2_overflowIndex ? 7.5 : 5;
            draw.DrawPoint(point.pointX, point.pointY, pointSize, colors[colorIndex], draw.context);
          } else if (point.separation > linearSlop) {
            draw.DrawPoint(point.pointX, point.pointY, 5, speculativeColor, draw.context);
          } else if (point.persisted === false) {
            draw.DrawPoint(point.pointX, point.pointY, 10, addColor, draw.context);
          } else if (point.persisted === true) {
            draw.DrawPoint(point.pointX, point.pointY, 5, persistColor, draw.context);
          }
          if (draw.drawContactNormals) {
            const p14 = new b2Vec2(point.pointX, point.pointY);
            const p23 = b2MulAdd(p14, k_axisScale, normal);
            draw.DrawSegment(p14, p23, normalColor, draw.context);
          } else if (draw.drawContactImpulses) {
            const p14 = new b2Vec2(point.pointX, point.pointY);
            const p23 = b2MulAdd(p14, k_impulseScale * point.normalImpulse, normal);
            draw.DrawSegment(p14, p23, impulseColor, draw.context);
            const buffer = `${(1e3 * point.normalImpulse).toFixed(2)}`;
            draw.DrawString(p14, buffer, draw.context);
          }
          if (draw.drawFrictionImpulses) {
            const tangent = b2RightPerp(normal);
            const p14 = new b2Vec2(point.pointX, point.pointY);
            const p23 = b2MulAdd(p14, k_impulseScale * point.tangentImpulse, tangent);
            draw.DrawSegment(p14, p23, frictionColor, draw.context);
            const buffer = `${point.normalImpulse.toFixed(2)}`;
            draw.DrawString(p14, buffer, draw.context);
          }
        }
      }
    }
  }
}
function b2World_GetBodyEvents(worldId) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2BodyEvents();
  }
  const count = world.bodyMoveEventArray.length;
  const events = new b2BodyEvents();
  events.moveEvents = world.bodyMoveEventArray;
  events.moveCount = count;
  return events;
}
function b2World_GetSensorEvents(worldId) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2SensorEvents();
  }
  const beginCount = world.sensorBeginEventArray.length;
  const endCount = world.sensorEndEventArray.length;
  const events = new b2SensorEvents();
  events.beginEvents = world.sensorBeginEventArray;
  events.endEvents = world.sensorEndEventArray;
  events.beginCount = beginCount;
  events.endCount = endCount;
  return events;
}
function b2World_GetContactEvents(worldId) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return new b2ContactEvents();
  }
  const beginCount = world.contactBeginArray.length;
  const endCount = world.contactEndArray.length;
  const hitCount = world.contactHitArray.length;
  const events = new b2ContactEvents();
  events.beginEvents = world.contactBeginArray;
  events.endEvents = world.contactEndArray;
  events.hitEvents = world.contactHitArray;
  events.beginCount = beginCount;
  events.endCount = endCount;
  events.hitCount = hitCount;
  return events;
}
function b2World_IsValid(id) {
  if (id === void 0) {
    return false;
  }
  if (id.index1 < 1 || B2_MAX_WORLDS < id.index1) {
    return false;
  }
  const world = b2_worlds[id.index1 - 1];
  if (world.worldId !== id.index1 - 1) {
    return false;
  }
  return id.revision === world.revision;
}
function b2Body_IsValid(id) {
  if (id === void 0) {
    return false;
  }
  if (!(id instanceof b2BodyId)) {
    return false;
  }
  if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0) {
    return false;
  }
  const world = b2_worlds[id.world0];
  if (world.worldId !== id.world0) {
    return false;
  }
  if (id.index1 < 1 || world.bodyArray.length < id.index1) {
    return false;
  }
  const body = world.bodyArray[id.index1 - 1];
  if (body.setIndex === B2_NULL_INDEX) {
    return false;
  }
  if (body.revision !== id.revision) {
    return false;
  }
  return true;
}
function b2Shape_IsValid(id) {
  if (id === void 0) {
    return false;
  }
  if (B2_MAX_WORLDS <= id.world0) {
    return false;
  }
  const world = b2_worlds[id.world0];
  if (world.worldId !== id.world0) {
    return false;
  }
  const shapeId = id.index1 - 1;
  if (shapeId < 0 || world.shapeArray.length <= shapeId) {
    return false;
  }
  const shape = world.shapeArray[shapeId];
  if (shape.id === B2_NULL_INDEX) {
    return false;
  }
  return id.revision === shape.revision;
}
function b2Chain_IsValid(id) {
  if (id === void 0) {
    return false;
  }
  if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0) {
    return false;
  }
  const world = b2_worlds[id.world0];
  if (world.worldId !== id.world0) {
    return false;
  }
  const chainId = id.index1 - 1;
  if (chainId < 0 || world.chainArray.length <= chainId) {
    return false;
  }
  const chain = world.chainArray[chainId];
  if (chain.id === B2_NULL_INDEX) {
    return false;
  }
  return id.revision === chain.revision;
}
function b2Joint_IsValid(id) {
  if (id === void 0) {
    return false;
  }
  if (id.world0 < 0 || B2_MAX_WORLDS <= id.world0) {
    return false;
  }
  const world = b2_worlds[id.world0];
  if (world.worldId !== id.world0) {
    return false;
  }
  const jointId = id.index1 - 1;
  if (jointId < 0 || world.jointArray.length <= jointId) {
    return false;
  }
  const joint = world.jointArray[jointId];
  if (joint.jointId === B2_NULL_INDEX) {
    return false;
  }
  return id.revision === joint.revision;
}
function b2World_EnableSleeping(worldId, flag) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  if (flag === world.enableSleep) {
    return;
  }
  world.enableSleep = flag;
  if (flag === false) {
    const setCount = world.solverSetArray.length;
    for (let i = b2SetType.b2_firstSleepingSet; i < setCount; ++i) {
      const set = world.solverSetArray[i];
      if (set.sims.length > 0) {
        b2WakeSolverSet(world, i);
      }
    }
  }
}
function b2World_EnableWarmStarting(worldId, flag) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.enableWarmStarting = flag;
}
function b2World_EnableContinuous(worldId, flag) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.enableContinuous = flag;
}
function b2World_SetRestitutionThreshold(worldId, value) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.restitutionThreshold = Math.max(0, Math.min(value, Number.MAX_VALUE));
}
function b2World_SetHitEventThreshold(worldId, value) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.hitEventThreshold = Math.max(0, Math.min(value, Number.MAX_VALUE));
}
function b2World_SetContactTuning(worldId, hertz, dampingRatio, pushOut) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  world.contactHertz = b2ClampFloat(hertz, 0, Number.MAX_VALUE);
  world.contactDampingRatio = b2ClampFloat(dampingRatio, 0, Number.MAX_VALUE);
  world.contactPushoutVelocity = b2ClampFloat(pushOut, 0, Number.MAX_VALUE);
}
function TreeQueryCallback(proxyId, shapeId, context) {
  const worldContext = context;
  const world = worldContext.world;
  const shape = world.shapeArray[shapeId];
  const shapeFilter = shape.filter;
  const queryFilter = worldContext.filter;
  if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0) {
    return true;
  }
  const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
  const result = worldContext.fcn(id, worldContext.userContext);
  return result;
}
var WorldQueryContext = class {
  constructor(world = null, fcn = null, filter = null, userContext = null) {
    this.world = world;
    this.fcn = fcn;
    this.filter = filter;
    this.userContext = userContext;
  }
};
function b2World_OverlapAABB(worldId, aabb, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const worldContext = new WorldQueryContext(world, fcn, filter, context);
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeQueryCallback, worldContext);
  }
}
function TreeOverlapCallback(proxyId, shapeId, context) {
  const worldContext = context;
  const world = worldContext.world;
  const shape = world.shapeArray[shapeId];
  const shapeFilter = shape.filter;
  const queryFilter = worldContext.filter;
  if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0) {
    return true;
  }
  const body = b2GetBody(world, shape.bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const input = new b2DistanceInput();
  input.proxyA = worldContext.proxy;
  input.proxyB = b2MakeShapeDistanceProxy(shape);
  input.transformA = worldContext.transform;
  input.transformB = transform;
  input.useRadii = true;
  const cache = new b2DistanceCache();
  const output = b2ShapeDistance(cache, input, null, 0);
  if (output.distance > 0) {
    return true;
  }
  const id = new b2ShapeId(shape.id + 1, world.worldId, shape.revision);
  const result = worldContext.fcn(id, worldContext.userContext);
  return result;
}
function b2World_OverlapCircle(worldId, circle, transform, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const aabb = b2ComputeCircleAABB(circle, transform);
  const worldContext = new WorldOverlapContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.proxy = b2MakeProxy(circle.center, 1, circle.radius);
  worldContext.transform = transform;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
  }
}
function b2World_OverlapCapsule(worldId, capsule, transform, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const aabb = b2ComputeCapsuleAABB(capsule, transform);
  const worldContext = new WorldOverlapContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.proxy = b2MakeProxy(capsule.center, 2, capsule.radius);
  worldContext.transform = transform;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
  }
}
function b2World_OverlapPolygon(worldId, polygon, transform, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const aabb = b2ComputePolygonAABB(polygon, transform);
  const worldContext = new WorldOverlapContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.proxy = b2MakeProxy(polygon.vertices, polygon.count, polygon.radius), worldContext.transform = transform;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_Query(world.broadPhase.trees[i], aabb, filter.maskBits, TreeOverlapCallback, worldContext);
  }
}
function RayCastCallback(input, proxyId, shapeId, context) {
  const worldContext = context;
  const world = worldContext.world;
  const shape = world.shapeArray[shapeId];
  const shapeFilter = shape.filter;
  const queryFilter = worldContext.filter;
  if ((shapeFilter.categoryBits & queryFilter.maskBits) === 0 || (shapeFilter.maskBits & queryFilter.categoryBits) === 0) {
    return input.maxFraction;
  }
  const body = b2GetBody(world, shape.bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const output = b2RayCastShape(input, shape, transform);
  if (output.hit) {
    const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
    const fraction = worldContext.fcn(id, output.point, output.normal, output.fraction, worldContext.userContext);
    if (fraction >= 0 && fraction <= 1) {
      worldContext.fraction = fraction;
    }
    return fraction;
  }
  return input.maxFraction;
}
function b2World_CastRay(worldId, origin, translation, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const input = new b2RayCastInput();
  input.origin = origin;
  input.translation = translation;
  input.maxFraction = 1;
  const worldContext = new WorldRayCastContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.fraction = 1;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_RayCast(world.broadPhase.trees[i], input, filter.maskBits, RayCastCallback, worldContext);
    if (worldContext.fraction === 0) {
      return;
    }
    input.maxFraction = worldContext.fraction;
  }
}
function b2RayCastClosestFcn(shapeId, point, normal, fraction, context) {
  const rayResult = context;
  rayResult.shapeId = shapeId;
  rayResult.point = point;
  rayResult.normal = normal;
  rayResult.fraction = fraction;
  rayResult.hit = true;
  return fraction;
}
function b2World_CastRayClosest(worldId, origin, translation, filter) {
  const result = new b2RayResult();
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return result;
  }
  const input = new b2RayCastInput();
  input.origin = origin;
  input.translation = translation;
  input.maxFraction = 1;
  const worldContext = new WorldRayCastContext();
  worldContext.world = world;
  worldContext.fcn = b2RayCastClosestFcn;
  worldContext.fraction = 1;
  worldContext.userContext = result;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_RayCast(world.broadPhase.trees[i], input, filter.maskBits, RayCastCallback, worldContext);
    if (worldContext.fraction == 0) {
      return result;
    }
    input.maxFraction = worldContext.fraction;
  }
  return result;
}
function ShapeCastCallback(input, proxyId, shapeId, context) {
  const worldContext = context;
  const world = worldContext.world;
  const shape = world.shapeArray[shapeId];
  const shapeFilter = shape.filter;
  const queryFilter = worldContext.filter;
  if ((shapeFilter.categoryBits & queryFilter.maskBits) == 0 || (shapeFilter.maskBits & queryFilter.categoryBits) == 0) {
    return input.maxFraction;
  }
  const body = b2GetBody(world, shape.bodyId);
  const transform = b2GetBodyTransformQuick(world, body);
  const output = b2ShapeCastShape(input, shape, transform);
  if (output.hit) {
    const id = new b2ShapeId(shapeId + 1, world.worldId, shape.revision);
    const fraction = worldContext.fcn(id, output.point, output.normal, output.fraction, worldContext.userContext);
    worldContext.fraction = fraction;
    return fraction;
  }
  return input.maxFraction;
}
function b2World_CastCircle(worldId, circle, originTransform, translation, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const input = new b2ShapeCastInput();
  input.points = [b2TransformPoint(originTransform, circle.center)];
  input.count = 1;
  input.radius = circle.radius;
  input.translation = translation;
  input.maxFraction = 1;
  const worldContext = new WorldRayCastContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.fraction = 1;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);
    if (worldContext.fraction == 0) {
      return;
    }
    input.maxFraction = worldContext.fraction;
  }
}
function b2World_CastCapsule(worldId, capsule, originTransform, translation, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const input = new b2ShapeCastInput();
  input.points = [b2TransformPoint(originTransform, capsule.center1), b2TransformPoint(originTransform, capsule.center2)];
  input.count = 2;
  input.radius = capsule.radius;
  input.translation = translation;
  input.maxFraction = 1;
  const worldContext = new WorldRayCastContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.fraction = 1;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);
    if (worldContext.fraction == 0) {
      return;
    }
    input.maxFraction = worldContext.fraction;
  }
}
function b2World_CastPolygon(worldId, polygon, originTransform, translation, filter, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const input = new b2ShapeCastInput();
  input.points = polygon.vertices.map((vertex) => b2TransformPoint(originTransform, vertex));
  input.count = polygon.count;
  input.radius = polygon.radius;
  input.translation = translation;
  input.maxFraction = 1;
  const worldContext = new WorldRayCastContext();
  worldContext.world = world;
  worldContext.fcn = fcn;
  worldContext.filter = filter;
  worldContext.fraction = 1;
  worldContext.userContext = context;
  for (let i = 0; i < b2BodyType.b2_bodyTypeCount; ++i) {
    b2DynamicTree_ShapeCast(world.broadPhase.trees[i], input, filter.maskBits, ShapeCastCallback, worldContext);
    if (worldContext.fraction == 0) {
      return;
    }
    input.maxFraction = worldContext.fraction;
  }
}
function b2World_SetPreSolveCallback(worldId, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  world.preSolveFcn = fcn;
  world.preSolveContext = context;
}
function b2World_SetCustomFilterCallback(worldId, fcn, context) {
  const world = b2GetWorldFromId(worldId);
  world.customFilterFcn = fcn;
  world.customFilterContext = context;
}
function b2World_SetGravity(worldId, gravity) {
  const world = b2GetWorldFromId(worldId);
  world.gravity = gravity;
}
function b2World_GetGravity(worldId) {
  const world = b2GetWorldFromId(worldId);
  return world.gravity;
}
var ExplosionContext = class {
  constructor(world, position, radius, magnitude) {
    this.world = world;
    this.position = position;
    this.radius = radius;
    this.magnitude = magnitude;
  }
};
function ExplosionCallback(proxyId, shapeId, context) {
  const explosionContext = context;
  const world = explosionContext.world;
  const shape = world.shapeArray[shapeId];
  const body = world.bodyArray[shape.bodyId];
  if (body.type === b2BodyType.b2_kinematicBody) {
    return true;
  }
  b2WakeBody(world, body);
  if (body.setIndex !== b2SetType.b2_awakeSet) {
    return true;
  }
  const transform = b2GetBodyTransformQuick(world, body);
  const input = new b2DistanceInput();
  input.proxyA = b2MakeShapeDistanceProxy(shape);
  input.proxyB = b2MakeProxy([explosionContext.position], 1, 0);
  input.transformA = transform;
  input.transformB = new b2Transform(new b2Vec2(0, 0), new b2Rot(1, 0));
  input.useRadii = true;
  const cache = new b2DistanceCache();
  const output = b2ShapeDistance(cache, input, null, 0);
  if (output.distance > explosionContext.radius) {
    return true;
  }
  let closestPoint = output.pointA;
  if (output.distance === 0) {
    const localCentroid = b2GetShapeCentroid(shape);
    closestPoint = b2TransformPoint(transform, localCentroid);
  }
  const falloff = 0.4;
  const perimeter = b2GetShapePerimeter(shape);
  const magnitude = explosionContext.magnitude * perimeter * (1 - falloff * output.distance / explosionContext.radius);
  const direction = b2Normalize(b2Sub(closestPoint, explosionContext.position));
  const impulse = b2MulSV(magnitude, direction);
  const localIndex = body.localIndex;
  const set = world.solverSetArray[b2SetType.b2_awakeSet];
  const state = set.states.data[localIndex];
  const bodySim = set.sims.data[localIndex];
  state.linearVelocity = b2MulAdd(state.linearVelocity, bodySim.invMass, impulse);
  state.angularVelocity += bodySim.invInertia * b2Cross(b2Sub(closestPoint, bodySim.center), impulse);
  return true;
}
function b2World_Explode(worldId, position, radius, magnitude) {
  const world = b2GetWorldFromId(worldId);
  if (world.locked) {
    return;
  }
  const explosionContext = new ExplosionContext(world, position, radius, magnitude);
  const aabb = new b2AABB(position.x - radius, position.y - radius, position.x + radius, position.y + radius);
  b2DynamicTree_Query(
    world.broadPhase.trees[b2BodyType.b2_dynamicBody],
    aabb,
    B2_DEFAULT_MASK_BITS,
    ExplosionCallback,
    explosionContext
  );
}
function b2GetRootIslandId(world, islandId) {
  if (islandId === B2_NULL_INDEX) {
    return B2_NULL_INDEX;
  }
  let rootId = islandId;
  let rootIsland = world.islandArray[islandId];
  while (rootIsland.parentIsland !== B2_NULL_INDEX) {
    const parent = world.islandArray[rootIsland.parentIsland];
    rootId = rootIsland.parentIsland;
    rootIsland = parent;
  }
  return rootId;
}
function b2CheckId(a, id) {
}
function b2CheckIndex(a, i) {
  if (Array.isArray(a)) {
  } else {
  }
}
function b2ValidateConnectivity(world) {
  if (!b2Validation) {
    return;
  }
  const bodyCapacity = world.bodyArray.length;
  for (let bodyIndex = 0; bodyIndex < bodyCapacity; ++bodyIndex) {
    const body = world.bodyArray[bodyIndex];
    if (body.id === B2_NULL_INDEX) {
      continue;
    }
    const bodyIslandId = b2GetRootIslandId(world, body.islandId);
    const bodySetIndex = body.setIndex;
    let contactKey = body.headContactKey;
    while (contactKey !== B2_NULL_INDEX) {
      const contactId = contactKey >> 1;
      const edgeIndex = contactKey & 1;
      const contact = world.contactArray[contactId];
      const touching = (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0;
      if (touching && (contact.flags & b2ContactFlags.b2_contactSensorFlag) === 0) {
        if (bodySetIndex !== b2SetType.b2_staticSet) {
          const contactIslandId = b2GetRootIslandId(world, contact.islandId);
        }
      } else {
      }
      contactKey = contact.edges[edgeIndex].nextKey;
    }
    let jointKey = body.headJointKey;
    while (jointKey !== B2_NULL_INDEX) {
      const jointId = jointKey >> 1;
      const edgeIndex = jointKey & 1;
      const joint = world.jointArray[jointId];
      const otherEdgeIndex = edgeIndex ^ 1;
      const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];
      if (bodySetIndex === b2SetType.b2_disabledSet || otherBody.setIndex === b2SetType.b2_disabledSet) {
      } else if (bodySetIndex === b2SetType.b2_staticSet) {
        if (otherBody.setIndex === b2SetType.b2_staticSet) {
        }
      } else {
        const jointIslandId = b2GetRootIslandId(world, joint.islandId);
      }
      jointKey = joint.edges[edgeIndex].nextKey;
    }
  }
}
function b2ValidateSolverSets(world) {
  if (!b2Validation) {
    return;
  }
  let activeSetCount = 0;
  let totalBodyCount = 0;
  let totalJointCount = 0;
  let totalContactCount = 0;
  let totalIslandCount = 0;
  const setCount = world.solverSetArray.length;
  for (let setIndex = 0; setIndex < setCount; ++setIndex) {
    const set = world.solverSetArray[setIndex];
    if (set.setIndex !== B2_NULL_INDEX) {
      activeSetCount += 1;
      if (setIndex === b2SetType.b2_staticSet) {
      } else if (setIndex === b2SetType.b2_awakeSet) {
      } else if (setIndex === b2SetType.b2_disabledSet) {
      } else {
      }
      {
        const bodies = world.bodyArray;
        totalBodyCount += set.sims.count;
        for (let i = 0; i < set.sims.count; ++i) {
          const bodySim = set.sims.data[i];
          const bodyId = bodySim.bodyId;
          b2CheckIndex(bodies, bodyId);
          const body = bodies[bodyId];
          if (setIndex === b2SetType.b2_disabledSet) {
          }
          let prevShapeId = B2_NULL_INDEX;
          let shapeId = body.headShapeId;
          while (shapeId !== B2_NULL_INDEX) {
            b2CheckId(world.shapeArray, shapeId);
            const shape = world.shapeArray[shapeId];
            if (setIndex === b2SetType.b2_disabledSet) {
            } else if (setIndex === b2SetType.b2_staticSet) {
            } else {
              const proxyType = B2_PROXY_TYPE(shape.proxyKey);
            }
            prevShapeId = shapeId;
            shapeId = shape.nextShapeId;
          }
          let contactKey = body.headContactKey;
          while (contactKey !== B2_NULL_INDEX) {
            const contactId = contactKey >> 1;
            const edgeIndex = contactKey & 1;
            b2CheckIndex(world.contactArray, contactId);
            const contact = world.contactArray[contactId];
            contactKey = contact.edges[edgeIndex].nextKey;
          }
          let jointKey = body.headJointKey;
          while (jointKey !== B2_NULL_INDEX) {
            const jointId = jointKey >> 1;
            const edgeIndex = jointKey & 1;
            b2CheckIndex(world.jointArray, jointId);
            const joint = world.jointArray[jointId];
            const otherEdgeIndex = edgeIndex ^ 1;
            b2CheckIndex(world.bodyArray, joint.edges[otherEdgeIndex].bodyId);
            const otherBody = world.bodyArray[joint.edges[otherEdgeIndex].bodyId];
            if (setIndex === b2SetType.b2_disabledSet || otherBody.setIndex === b2SetType.b2_disabledSet) {
            } else if (setIndex === b2SetType.b2_staticSet && otherBody.setIndex === b2SetType.b2_staticSet) {
            } else if (setIndex === b2SetType.b2_awakeSet) {
            } else if (setIndex >= b2SetType.b2_firstSleepingSet) {
            }
            const jointSim = b2GetJointSim(world, joint);
            jointKey = joint.edges[edgeIndex].nextKey;
          }
        }
      }
      {
        const contacts = world.contactArray;
        totalContactCount += set.contacts.count;
        for (let i = 0; i < set.contacts.count; ++i) {
          const contactSim = set.contacts.data[i];
          const contact = contacts[contactSim.contactId];
          if (setIndex === b2SetType.b2_awakeSet) {
          }
        }
      }
      {
        const joints = world.jointArray;
        totalJointCount += set.joints.count;
        for (let i = 0; i < set.joints.count; ++i) {
          const jointSim = set.joints.data[i];
          const joint = joints[jointSim.jointId];
        }
      }
      {
        const islands = world.islandArray;
        totalIslandCount += set.islands.count;
        for (let i = 0; i < set.islands.count; ++i) {
          const islandSim = set.islands.data[i];
          const island = islands[islandSim.islandId];
        }
      }
    } else {
    }
  }
  const setIdCount = b2GetIdCount(world.solverSetIdPool);
  const bodyIdCount = b2GetIdCount(world.bodyIdPool);
  const islandIdCount = b2GetIdCount(world.islandIdPool);
  for (let colorIndex = 0; colorIndex < b2_graphColorCount; ++colorIndex) {
    const color = world.constraintGraph.colors[colorIndex];
    {
      const contacts = world.contactArray;
      totalContactCount += color.contacts.count;
      for (let i = 0; i < color.contacts.count; ++i) {
        const contactSim = color.contacts.data[i];
        b2CheckIndex(contacts, contactSim.contactId);
        const contact = contacts[contactSim.contactId];
        const bodyIdA = contact.edges[0].bodyId;
        const bodyIdB = contact.edges[1].bodyId;
        b2CheckIndex(world.bodyArray, bodyIdA);
        b2CheckIndex(world.bodyArray, bodyIdB);
        if (colorIndex < b2_overflowIndex) {
          const bodyA = world.bodyArray[bodyIdA];
          const bodyB = world.bodyArray[bodyIdB];
        }
      }
    }
    {
      const joints = world.jointArray;
      totalJointCount += color.joints.count;
      for (let i = 0; i < color.joints.count; ++i) {
        const jointSim = color.joints.data[i];
        b2CheckIndex(joints, jointSim.jointId);
        const joint = joints[jointSim.jointId];
        const bodyIdA = joint.edges[0].bodyId;
        const bodyIdB = joint.edges[1].bodyId;
        b2CheckIndex(world.bodyArray, bodyIdA);
        b2CheckIndex(world.bodyArray, bodyIdB);
        if (colorIndex < b2_overflowIndex) {
          const bodyA = world.bodyArray[bodyIdA];
          const bodyB = world.bodyArray[bodyIdB];
        }
      }
    }
  }
  const contactIdCount = b2GetIdCount(world.contactIdPool);
  const jointIdCount = b2GetIdCount(world.jointIdPool);
}
function b2GetBit2(bitSet, bitIndex) {
  const blockIndex = Math.floor(bitIndex / 64);
  if (blockIndex >= bitSet.blockCount) {
    return false;
  }
  return (bitSet.bits[blockIndex] & BigInt(1) << BigInt(bitIndex % 64)) !== BigInt(0);
}
function b2ValidateContacts(world) {
  if (!b2Validation) {
    return;
  }
  const contactCount = world.contactArray.length;
  let allocatedContactCount = 0;
  for (let contactIndex = 0; contactIndex < contactCount; ++contactIndex) {
    const contact = world.contactArray[contactIndex];
    if (contact.contactId === B2_NULL_INDEX) {
      continue;
    }
    allocatedContactCount += 1;
    const touching = (contact.flags & b2ContactFlags.b2_contactTouchingFlag) !== 0;
    const sensorTouching = (contact.flags & b2ContactFlags.b2_contactSensorTouchingFlag) !== 0;
    const isSensor = (contact.flags & b2ContactFlags.b2_contactSensorFlag) !== 0;
    const setId = contact.setIndex;
    if (setId === b2SetType.b2_awakeSet) {
      if (touching && isSensor === false) {
      } else {
      }
    } else if (setId >= b2SetType.b2_firstSleepingSet) {
    } else {
    }
    const contactSim = b2GetContactSim(world, contact);
    const simTouching = (contactSim.simFlags & b2ContactSimFlags.b2_simTouchingFlag) !== 0;
  }
  const contactIdCount = b2GetIdCount(world.contactIdPool);
}

// src/include/world_h.js
function b2World_GetProfile() {
}
function b2World_GetCounters() {
}
function b2World_DumpMemoryStats() {
}

// src/debug_draw.js
var p02 = new b2Vec2();

// src/ragdoll.js
var JointedBone = class {
  constructor() {
    this.bodyId = null;
    this.jointId = null;
    this.frictionScale = 1;
    this.parentIndex = -1;
    this.name = "";
  }
};
var Skeletons = class {
  static HumanBones = {
    e_hip: 0,
    e_torso: 1,
    e_head: 2,
    e_upperLeftLeg: 3,
    e_lowerLeftLeg: 4,
    e_upperRightLeg: 5,
    e_lowerRightLeg: 6,
    e_upperLeftArm: 7,
    e_lowerLeftArm: 8,
    e_upperRightArm: 9,
    e_lowerRightArm: 10,
    e_count: 11
  };
  static sideViewHuman11 = {
    BONE_DATA: [
      { name: "hip", parentIndex: -1, position: [0, 0.95], capsule: { center1: [0, -0.02], center2: [0, 0.02], radius: 0.095 } },
      { name: "torso", parentIndex: 0, position: [0, 1.2], capsule: { center1: [0, -0.135], center2: [0, 0.135], radius: 0.09 }, frictionScale: 0.5 },
      { name: "head", parentIndex: 1, position: [0, 1.5], capsule: { center1: [0, -0.0325], center2: [0, 0.0325], radius: 0.08 }, frictionScale: 0.25, linearDamping: 0.1 },
      { name: "upperLeftLeg", parentIndex: 0, position: [0, 0.775], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.06 } },
      { name: "lowerLeftLeg", parentIndex: 3, position: [0, 0.475], capsule: { center1: [0, -0.14], center2: [0, 0.125], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
      { name: "upperRightLeg", parentIndex: 0, position: [0, 0.775], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.06 } },
      { name: "lowerRightLeg", parentIndex: 5, position: [0, 0.475], capsule: { center1: [0, -0.14], center2: [0, 0.125], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
      { name: "upperLeftArm", parentIndex: 1, position: [0, 1.225], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.035 }, frictionScale: 0.5 },
      { name: "lowerLeftArm", parentIndex: 7, position: [0, 0.975], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
      { name: "upperRightArm", parentIndex: 1, position: [0, 1.225], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.035 }, frictionScale: 0.5 },
      { name: "lowerRightArm", parentIndex: 9, position: [0, 0.975], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 }
    ],
    JOINT_DATA: [
      { boneName: "torso", pivot: [0, 1], limits: [-0.25 * Math.PI, 0] },
      { boneName: "head", pivot: [0, 1.4], limits: [-0.3 * Math.PI, 0.1 * Math.PI] },
      { boneName: "upperLeftLeg", pivot: [0, 0.9], limits: [-0.05 * Math.PI, 0.4 * Math.PI] },
      { boneName: "lowerLeftLeg", pivot: [0, 0.625], limits: [-0.5 * Math.PI, -0.02 * Math.PI] },
      { boneName: "upperRightLeg", pivot: [0, 0.9], limits: [-0.05 * Math.PI, 0.4 * Math.PI] },
      { boneName: "lowerRightLeg", pivot: [0, 0.625], limits: [-0.5 * Math.PI, -0.02 * Math.PI] },
      { boneName: "upperLeftArm", pivot: [0, 1.35], limits: [-0.1 * Math.PI, 0.8 * Math.PI] },
      { boneName: "lowerLeftArm", pivot: [0, 1.1], limits: [0.01 * Math.PI, 0.5 * Math.PI] },
      { boneName: "upperRightArm", pivot: [0, 1.35], limits: null },
      { boneName: "lowerRightArm", pivot: [0, 1.1], limits: [0.01 * Math.PI, 0.5 * Math.PI] }
    ]
  };
  static frontViewHuman11 = {
    BONE_DATA: [
      { name: "hip", parentIndex: -1, position: [0, 0.95], capsule: { center1: [-0.03, 0], center2: [0.03, 0], radius: 0.095 } },
      { name: "torso", parentIndex: 0, position: [0, 1.2], capsule: { center1: [0, -0.135], center2: [0, 0.135], radius: 0.09 }, frictionScale: 0.5 },
      { name: "head", parentIndex: 1, position: [0, 1.5], capsule: { center1: [0, -0.0325], center2: [0, 0.0325], radius: 0.08 }, frictionScale: 0.25, linearDamping: 0.1 },
      { name: "upperLeftLeg", parentIndex: 0, position: [-0.1, 0.775], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.06 } },
      { name: "lowerLeftLeg", parentIndex: 3, position: [-0.1, 0.475], capsule: { center1: [0, -0.14], center2: [0, 0.125], radius: 0.05 }, frictionScale: 0.5, foot: "left" },
      { name: "upperRightLeg", parentIndex: 0, position: [0.1, 0.775], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.06 } },
      { name: "lowerRightLeg", parentIndex: 5, position: [0.1, 0.475], capsule: { center1: [0, -0.14], center2: [0, 0.125], radius: 0.05 }, frictionScale: 0.5, foot: "right" },
      { name: "upperLeftArm", parentIndex: 1, position: [-0.15, 1.22], capsule: { center1: [0, -0.125], center2: [0.05, 0.125], radius: 0.035 }, frictionScale: 0.5 },
      { name: "lowerLeftArm", parentIndex: 7, position: [-0.15, 0.97], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 },
      { name: "upperRightArm", parentIndex: 1, position: [0.15, 1.22], capsule: { center1: [0, -0.125], center2: [-0.05, 0.125], radius: 0.035 }, frictionScale: 0.5 },
      { name: "lowerRightArm", parentIndex: 9, position: [0.15, 0.97], capsule: { center1: [0, -0.125], center2: [0, 0.125], radius: 0.03 }, frictionScale: 0.1, linearDamping: 0.1 }
    ],
    JOINT_DATA: [
      { boneName: "torso", pivot: [0, 1], limits: [-0.1 * Math.PI, 0.1 * Math.PI] },
      { boneName: "head", pivot: [0, 1.4], limits: [-0.2 * Math.PI, 0.2 * Math.PI] },
      { boneName: "upperLeftLeg", pivot: [-0.1, 0.9], limits: [-0.3 * Math.PI, 0.1 * Math.PI] },
      { boneName: "lowerLeftLeg", pivot: [-0.1, 0.625], limits: [0, 0.5 * Math.PI] },
      { boneName: "upperRightLeg", pivot: [0.1, 0.9], limits: [-0.1 * Math.PI, 0.3 * Math.PI] },
      { boneName: "lowerRightLeg", pivot: [0.1, 0.625], limits: [-0.5 * Math.PI, 0] },
      { boneName: "upperLeftArm", pivot: [-0.12, 1.35], limits: [-0.7 * Math.PI, 0.1 * Math.PI] },
      { boneName: "lowerLeftArm", pivot: [-0.16, 1.1], limits: [0, 0.75 * Math.PI] },
      { boneName: "upperRightArm", pivot: [0.12, 1.35], limits: [-0.1 * Math.PI, 0.7 * Math.PI] },
      { boneName: "lowerRightArm", pivot: [0.14, 1.1], limits: [0, 0.75 * Math.PI] }
    ]
  };
  static ElephantBones = {
    e_torso: 0,
    e_head: 1,
    e_trunkBase: 2,
    e_trunkMid: 3,
    e_trunkTip: 4,
    e_upperFrontLegL: 5,
    e_lowerFrontLegL: 6,
    e_upperRearLegL: 7,
    e_lowerRearLegL: 8,
    e_tail: 9,
    e_ear: 10,
    e_count: 11
  };
  static sideViewElephant = {
    BONE_DATA: [
      { name: "torso", parentIndex: -1, position: [0, 1.5], capsule: { center1: [0.8, 0], center2: [-0.8, 0], radius: 0.6 }, frictionScale: 0.5 },
      { name: "head", parentIndex: 0, position: [-1.4, 2.2], capsule: { center1: [0.3, 0], center2: [-0.3, 0], radius: 0.35 }, frictionScale: 0.25, linearDamping: 0.1 },
      { name: "trunkBase", parentIndex: 1, position: [-1.95, 1.85], capsule: { center1: [0, -0.2], center2: [0, 0.2], radius: 0.15 } },
      { name: "trunkMid", parentIndex: 2, position: [-1.95, 1.4], capsule: { center1: [0, -0.2], center2: [0, 0.2], radius: 0.12 } },
      { name: "trunkTip", parentIndex: 3, position: [-1.95, 1.05], capsule: { center1: [0, -0.2], center2: [0, 0.2], radius: 0.08 }, frictionScale: 0.1, linearDamping: 0.1 },
      { name: "upperFrontLeg", parentIndex: 0, position: [-0.6, 0.8], capsule: { center1: [0, -0.3], center2: [0, 0.3], radius: 0.2 } },
      { name: "lowerFrontLeg", parentIndex: 5, position: [-0.6, 0.2], capsule: { center1: [0, -0.3], center2: [0, 0.3], radius: 0.18 }, frictionScale: 0.5 },
      { name: "upperBackLeg", parentIndex: 0, position: [0.7, 0.8], capsule: { center1: [0, -0.3], center2: [0, 0.3], radius: 0.22 } },
      { name: "lowerBackLeg", parentIndex: 7, position: [0.7, 0.2], capsule: { center1: [0, -0.3], center2: [0, 0.3], radius: 0.2 }, frictionScale: 0.5 },
      { name: "tail", parentIndex: 0, position: [1.2, 1.6], capsule: { center1: [0, -0.3], center2: [0, 0.3], radius: 0.05 }, frictionScale: 0.1, linearDamping: 0.1 },
      { name: "ear", parentIndex: 1, position: [-1.1, 2], capsule: { center1: [0, -0.15], center2: [0, 0.15], radius: 0.3 }, frictionScale: 0.1, linearDamping: 0.1 }
    ],
    JOINT_DATA: [
      { boneName: "head", pivot: [-1, 2], limits: [-0.1 * Math.PI, 0.3 * Math.PI] },
      { boneName: "trunkBase", pivot: [-1.95, 2], limits: [-0.5 * Math.PI, 0.5 * Math.PI] },
      { boneName: "trunkMid", pivot: [-1.95, 1.55], limits: [-0.7 * Math.PI, 0.7 * Math.PI] },
      { boneName: "trunkTip", pivot: [-1.95, 1.15], limits: [-0.9 * Math.PI, 0.9 * Math.PI] },
      { boneName: "upperFrontLeg", pivot: [-0.6, 1.1], limits: [-0.2 * Math.PI, 0.2 * Math.PI] },
      { boneName: "lowerFrontLeg", pivot: [-0.6, 0.5], limits: [-0.3 * Math.PI, 0.1 * Math.PI] },
      { boneName: "upperBackLeg", pivot: [0.7, 1.1], limits: [-0.2 * Math.PI, 0.2 * Math.PI] },
      { boneName: "lowerBackLeg", pivot: [0.7, 0.5], limits: [-0.1 * Math.PI, 0.3 * Math.PI] },
      { boneName: "tail", pivot: [1.2, 1.9], limits: [-0.4 * Math.PI, 0.4 * Math.PI] },
      { boneName: "ear", pivot: [-1.1, 2.2], limits: [-0.3 * Math.PI, 0.9 * Math.PI] }
    ]
  };
};
var Ragdoll = class {
  constructor(skeleton, x, y, worldId, groupIndex, color, size = 2) {
    this.skeleton = skeleton;
    this.position = new b2Vec2(x, y);
    this.worldId = worldId;
    this.groupIndex = groupIndex;
    this.color = color;
    this.m_scale = size;
    this.frictionTorque = 0.05;
    this.hertz = 0;
    this.dampingRatio = 0.5;
    this.jointDrawSize = 0.5;
    this.maxTorque = this.frictionTorque * this.m_scale;
    this.m_bones = [];
    this.create();
  }
  createBone(boneData) {
    const { bodyId } = CreateCapsule({
      worldId: this.worldId,
      position: b2Add(new b2Vec2(boneData.position[0] * this.m_scale, boneData.position[1] * this.m_scale), this.position),
      type: b2BodyType.b2_dynamicBody,
      center1: new b2Vec2(boneData.capsule.center1[0] * this.m_scale, boneData.capsule.center1[1] * this.m_scale),
      center2: new b2Vec2(boneData.capsule.center2[0] * this.m_scale, boneData.capsule.center2[1] * this.m_scale),
      radius: boneData.capsule.radius * this.m_scale,
      density: 1,
      friction: 0.2,
      groupIndex: -this.groupIndex,
      color: this.color
    });
    const bone = new JointedBone();
    bone.name = boneData.name;
    bone.parentIndex = boneData.parentIndex;
    bone.frictionScale = boneData.frictionScale || 1;
    bone.bodyId = bodyId;
    if (boneData.foot) {
      const footShapeDef = b2DefaultShapeDef();
      footShapeDef.density = 1;
      footShapeDef.friction = 0.2;
      footShapeDef.filter.groupIndex = -this.groupIndex;
      footShapeDef.filter.maskBits = 1;
      footShapeDef.customColor = this.color;
      const footDir = boneData.foot == "left" ? -1 : 1;
      const footCapsule = new b2Capsule();
      footCapsule.center1 = new b2Vec2(footDir * -0.02 * this.m_scale, -0.175 * this.m_scale);
      footCapsule.center2 = new b2Vec2(footDir * 0.13 * this.m_scale, -0.175 * this.m_scale);
      footCapsule.radius = 0.03 * this.m_scale;
      b2CreateCapsuleShape(bodyId, footShapeDef, footCapsule);
    }
    return bone;
  }
  createJoint(jointData) {
    const bone = this.m_bones.find((b) => b.name === jointData.boneName);
    const parentBone = this.m_bones[bone.parentIndex];
    const pivot = b2Add(new b2Vec2(jointData.pivot[0] * this.m_scale, jointData.pivot[1] * this.m_scale), this.position);
    const jointDef = new b2RevoluteJointDef();
    jointDef.bodyIdA = parentBone.bodyId;
    jointDef.bodyIdB = bone.bodyId;
    jointDef.localAnchorA = b2Body_GetLocalPoint(jointDef.bodyIdA, pivot);
    jointDef.localAnchorB = b2Body_GetLocalPoint(jointDef.bodyIdB, pivot);
    if (jointData.limits) {
      jointDef.enableLimit = true;
      jointDef.lowerAngle = jointData.limits[0];
      jointDef.upperAngle = jointData.limits[1];
    }
    jointDef.enableMotor = true;
    jointDef.maxMotorTorque = bone.frictionScale * this.maxTorque;
    jointDef.enableSpring = this.hertz > 0;
    jointDef.hertz = this.hertz;
    jointDef.dampingRatio = this.dampingRatio;
    jointDef.drawSize = this.jointDrawSize;
    return b2CreateRevoluteJoint(this.worldId, jointDef);
  }
  create() {
    this.m_bones = this.skeleton.BONE_DATA.map((boneData) => this.createBone(boneData));
    this.skeleton.JOINT_DATA.forEach((jointData) => {
      const bone = this.m_bones.find((b) => b.name === jointData.boneName);
      bone.jointId = this.createJoint(jointData);
    });
    this.m_bones.forEach((bone) => b2Body_SetUserData(bone.bodyId, this));
    return this;
  }
  destroy() {
    for (let i = 0; i < this.m_bones.length; ++i) {
      if (this.m_bones[i].jointId) {
        if (this.m_bones[i].jointId.index1 - 1 != B2_NULL_INDEX) {
          b2DestroyJoint(this.m_bones[i].jointId);
          this.m_bones[i].jointId = new b2JointId();
        }
      }
    }
    for (let i = 0; i < this.m_bones.length; ++i) {
      if (this.m_bones[i].bodyId.index1 - 1 != B2_NULL_INDEX) {
        b2DestroyBody(this.m_bones[i].bodyId);
        this.m_bones[i].bodyId = null;
      }
    }
    this.m_bones = null;
  }
};

// src/main.js
var DYNAMIC = 2;

// src/physics.js
function setIfDef(obj, prop, value) {
  if (value !== void 0) {
    obj[prop] = value;
    return true;
  }
  return false;
}
var WorldSprites = /* @__PURE__ */ new Map();
var SCALE = 30;
function SetWorldScale(scale) {
  SCALE = scale;
}
function GetWorldScale() {
  return SCALE;
}
function mpx(meters) {
  return meters * SCALE;
}
function pxm(pixels) {
  return pixels / SCALE;
}
function pxmVec2(x, y) {
  return new b2Vec2(x / SCALE, y / SCALE);
}
function RotFromRad(radians) {
  return new b2Rot(Math.cos(-radians), Math.sin(-radians));
}
function AddSpriteToWorld(worldId, sprite, body) {
  if (!WorldSprites.has(worldId)) {
    WorldSprites.set(worldId, /* @__PURE__ */ new Map());
  }
  WorldSprites.get(worldId).set(sprite, body);
}
function RemoveSpriteFromWorld(worldId, sprite, destroyBody = false) {
  if (WorldSprites.has(worldId)) {
    const worldMap = WorldSprites.get(worldId);
    const body = worldMap.get(sprite);
    if (body && destroyBody) {
      const bodyId = body.bodyId;
      b2DestroyBody(bodyId);
    }
    worldMap.delete(sprite);
  }
}
function ClearWorldSprites(worldId) {
  if (WorldSprites.has(worldId)) {
    WorldSprites.get(worldId).clear();
  }
}
function GetBodyFromSprite(worldId, sprite) {
  if (WorldSprites.has(worldId)) {
    return WorldSprites.get(worldId).get(sprite);
  }
  return null;
}
function UpdateWorldSprites(worldId) {
  if (WorldSprites.has(worldId)) {
    WorldSprites.get(worldId).forEach((body, sprite) => {
      BodyToSprite(body, sprite);
    });
  }
}
function BodyToSprite(body, sprite) {
  const t = b2Body_GetTransform(body.bodyId);
  sprite.x = t.p.x * SCALE;
  sprite.y = -(t.p.y * SCALE);
  sprite.rotation = -Math.atan2(t.q.s, t.q.c);
}
function SpriteToBox(worldId, sprite, data) {
  const scaleX = sprite?.scaleX || sprite?.scale?.x || 1;
  const scaleY = sprite?.scaleY || sprite?.scale?.y || 1;
  const props = {
    worldId,
    type: DYNAMIC,
    size: pxmVec2(sprite.width * scaleX / 2, sprite.height * scaleY / 2)
  };
  const body = CreateBoxPolygon({ ...props, ...data });
  b2Body_SetTransform(
    body.bodyId,
    pxmVec2(sprite.x, -sprite.y),
    RotFromRad(sprite.rotation)
  );
  return body;
}
function SpriteToCircle(worldId, sprite, data) {
  const scaleX = sprite?.scaleX || sprite?.scale?.x || 1;
  const scaleY = sprite?.scaleY || sprite?.scale?.y || 1;
  const props = {
    worldId,
    type: DYNAMIC,
    size: pxmVec2(sprite.width * scaleX / 2, sprite.height * scaleY / 2)
  };
  const body = CreateCircle({ ...props, ...data });
  b2Body_SetTransform(
    body.bodyId,
    pxmVec2(sprite.x, -sprite.y),
    RotFromRad(sprite.rotation)
  );
  return body;
}
function CreateWorld(data) {
  let worldDef = data.worldDef;
  if (!worldDef) {
    worldDef = b2DefaultWorldDef();
  }
  b2CreateWorldArray();
  const worldId = b2CreateWorld(worldDef);
  return { worldId };
}
var _accumulator = 0;
function WorldStep(data) {
  let fixedTimeStep = data.fixedTimeStep;
  if (!fixedTimeStep) {
    fixedTimeStep = 1 / 60;
  }
  let subStepCount = data.subStepCount;
  if (!subStepCount) {
    subStepCount = 4;
  }
  const borrowedTime = fixedTimeStep * 2;
  _accumulator = Math.min(_accumulator + data.deltaTime, fixedTimeStep + borrowedTime);
  const catchUpMax = 2;
  let c2 = catchUpMax;
  if (data.deltaTime > fixedTimeStep) {
    c2 = 0;
  }
  let totalTime = 0;
  while (_accumulator >= fixedTimeStep && c2-- >= 0 && totalTime < fixedTimeStep) {
    const start = performance.now();
    b2World_Step(data.worldId, fixedTimeStep, subStepCount);
    const end = performance.now();
    totalTime = (end - start) / 1e3;
    _accumulator -= fixedTimeStep;
  }
  return totalTime;
}
function CreateChain(data) {
  const chainSpacing = b2Distance(data.firstLinkPosition, data.lastLinkPosition) / data.chainLinks;
  const type = data.type !== void 0 ? data.type : b2BodyType.b2_dynamicBody;
  const density = data.density !== void 0 ? data.density : 1;
  const friction = data.friction !== void 0 ? data.friction : 0.5;
  const color = data.color !== void 0 ? data.color : b2HexColor.b2_colorGold;
  const radius = data.radius !== void 0 ? data.radius : 0.5;
  var lastLink = null;
  var position = b2Add(data.firstLinkPosition, new b2Vec2(data.linkLength, 0));
  const listLinks = [];
  for (let i = 0; i < data.chainLinks; i++) {
    const link = CreateCapsule({ worldId: data.worldId, type, position, center1: new b2Vec2(-data.linkLength / 2 + data.radius, 0), center2: new b2Vec2(data.linkLength / 2 - data.radius, 0), radius, density, friction, groupIndex: -1, color });
    listLinks.push(link);
    if (i == 0) {
      if (data.fixEnds) {
        CreateRevoluteJoint({
          worldId: data.worldId,
          bodyIdA: data.groundId,
          bodyIdB: link.bodyId,
          anchorA: data.firstLinkPosition,
          anchorB: new b2Vec2(-data.linkLength / 2, 0)
        });
      }
    } else {
      CreateRevoluteJoint({
        worldId: data.worldId,
        bodyIdA: lastLink.bodyId,
        bodyIdB: link.bodyId,
        anchorA: new b2Vec2(data.linkLength / 2, 0),
        anchorB: new b2Vec2(-data.linkLength / 2, 0)
      });
    }
    lastLink = link;
    position = b2Add(position, new b2Vec2(chainSpacing, 0));
  }
  if (data.fixEnds) {
    CreateRevoluteJoint({
      worldId: data.worldId,
      bodyIdA: data.groundId,
      bodyIdB: lastLink.bodyId,
      anchorA: data.lastLinkPosition,
      anchorB: new b2Vec2(data.linkLength / 2, 0)
    });
  }
  return listLinks;
}
function CreateCircle(data) {
  let bodyDef = data.bodyDef;
  if (!bodyDef) {
    bodyDef = b2DefaultBodyDef();
  }
  setIfDef(bodyDef, "type", data.type);
  setIfDef(bodyDef, "position", data.position);
  let bodyId = data.bodyId;
  if (!bodyId) {
    bodyId = b2CreateBody(data.worldId, bodyDef);
  }
  let shapeDef = data.shapeDef;
  if (!shapeDef) {
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
  if (data.bodyId) {
    setIfDef(ball, "center", data.offset);
  }
  const shapeId = b2CreateCircleShape(bodyId, shapeDef, ball);
  return { bodyId, shapeId, object: ball };
}
function CreateCapsule(data) {
  let bodyDef = data.bodyDef;
  if (!bodyDef) {
    bodyDef = b2DefaultBodyDef();
  }
  setIfDef(bodyDef, "type", data.type);
  setIfDef(bodyDef, "position", data.position);
  setIfDef(bodyDef, "fixedRotation", data.fixedRotation);
  setIfDef(bodyDef, "linearDamping", data.linearDamping);
  let bodyId = data.bodyId;
  if (!bodyId) {
    bodyId = b2CreateBody(data.worldId, bodyDef);
  }
  let shapeDef = data.shapeDef;
  if (!shapeDef) {
    shapeDef = b2DefaultShapeDef();
  }
  setIfDef(shapeDef, "density", data.density);
  setIfDef(shapeDef, "friction", data.friction);
  setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
  setIfDef(shapeDef.filter, "categoryBits", data.categoryBits);
  setIfDef(shapeDef.filter, "maskBits", data.maskBits);
  setIfDef(shapeDef, "customColor", data.color);
  const capsule = new b2Capsule();
  if (data.width) {
    data.radius = data.width / 2;
  }
  if (data.height) {
    data.radius = Math.min(data.radius, data.height / 2);
    data.center1 = new b2Vec2(0, -(data.height / 2));
    data.center2 = new b2Vec2(0, data.height / 2);
  }
  setIfDef(capsule, "center1", data.center1);
  setIfDef(capsule, "center2", data.center2);
  setIfDef(capsule, "radius", data.radius);
  const shapeId = b2CreateCapsuleShape(bodyId, shapeDef, capsule);
  return { bodyId, shapeId, object: capsule };
}
function CreateBoxPolygon(data) {
  let bodyDef = data.bodyDef;
  if (!bodyDef) {
    bodyDef = b2DefaultBodyDef();
  }
  setIfDef(bodyDef, "type", data.type);
  setIfDef(bodyDef, "position", data.position);
  setIfDef(bodyDef, "fixedRotation", data.fixedRotation);
  setIfDef(bodyDef, "linearDamping", data.linearDamping);
  setIfDef(bodyDef, "angularDamping", data.angularDamping);
  let bodyId = data.bodyId;
  if (!bodyId) {
    bodyId = b2CreateBody(data.worldId, bodyDef);
  }
  let shapeDef = data.shapeDef;
  if (!shapeDef) {
    shapeDef = b2DefaultShapeDef();
  }
  const userData = data.userData;
  if (userData) {
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
  let box;
  if (data.size instanceof b2Vec2) {
    if (data.bodyId) {
      box = b2MakeOffsetBox(data.size.x, data.size.y, data.position, 0);
    } else {
      box = b2MakeBox(data.size.x, data.size.y);
    }
  } else {
    box = b2MakeBox(data.size, data.size);
  }
  const shapeId = b2CreatePolygonShape(bodyId, shapeDef, box);
  return { bodyId, shapeId, object: box };
}
function CreateNGonPolygon(data) {
  if (data.sides < 3 || data.sides > B2_MAX_POLYGON_VERTICES) {
    return null;
  }
  const bodyDef = data.bodyDef || b2DefaultBodyDef();
  setIfDef(bodyDef, "type", data.type);
  setIfDef(bodyDef, "position", data.position);
  let bodyId = data.bodyId;
  if (!bodyId) {
    bodyId = b2CreateBody(data.worldId, bodyDef);
  }
  const shapeDef = data.shapeDef || b2DefaultShapeDef();
  setIfDef(shapeDef, "density", data.density);
  setIfDef(shapeDef, "friction", data.friction);
  setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
  setIfDef(shapeDef, "customColor", data.color);
  const vertices = [];
  const angleStep = 2 * Math.PI / data.sides;
  for (let i = 0; i < data.sides; i++) {
    const angle = i * angleStep;
    const x = data.radius * Math.cos(angle);
    const y = data.radius * Math.sin(angle);
    vertices.push(new b2Vec2(x, y));
  }
  let nGon;
  const hull = b2ComputeHull(vertices, data.sides);
  if (data.bodyId != null) {
    const oldxf = b2GetBodyTransform(data.worldId, data.bodyId);
    const xf2 = new b2Transform(data.position, oldxf.q);
    nGon = b2MakeOffsetPolygon(hull, 0, xf2);
  } else {
    nGon = b2MakePolygon(hull, 0);
  }
  const shapeId = b2CreatePolygonShape(bodyId, shapeDef, nGon);
  return { bodyId, shapeId, object: nGon };
}
function CreatePolygon(data) {
  if (data.vertices.length < 3 || data.vertices.length > B2_MAX_POLYGON_VERTICES) {
    return null;
  }
  const bodyDef = data.bodyDef || b2DefaultBodyDef();
  setIfDef(bodyDef, "type", data.type);
  setIfDef(bodyDef, "position", data.position);
  let bodyId = data.bodyId;
  if (!bodyId) {
    bodyId = b2CreateBody(data.worldId, bodyDef);
  }
  const shapeDef = data.shapeDef || b2DefaultShapeDef();
  setIfDef(shapeDef, "density", data.density);
  setIfDef(shapeDef, "friction", data.friction);
  setIfDef(shapeDef.filter, "groupIndex", data.groupIndex);
  setIfDef(shapeDef, "customColor", data.color);
  let nGon;
  const hull = b2ComputeHull(data.vertices, data.vertices.length);
  if (data.bodyId != null) {
    const oldxf = b2GetBodyTransform(data.worldId, data.bodyId);
    const xf2 = new b2Transform(data.position, oldxf.q);
    nGon = b2MakeOffsetPolygon(hull, 0, xf2);
  } else {
    nGon = b2MakePolygon(hull, 0);
  }
  const shapeId = b2CreatePolygonShape(bodyId, shapeDef, nGon);
  return { bodyId, shapeId, object: nGon };
}
function CreatePolygonFromEarcut(data) {
  if (data.vertices.length < 3) {
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
  if (!scale) {
    scale = new b2Vec2(1, 1);
  }
  let offset = data.vertexOffset;
  if (!offset) {
    offset = new b2Vec2(0, 0);
  }
  for (let i = 0, l = data.indices[0].length; i < l; i += 3) {
    const part = [];
    for (let j = 0; j < 3; j++) {
      const index = data.indices[0][i + j] * 2;
      part.push(new b2Vec2((data.vertices[index] + offset.x) * scale.x, (data.vertices[index + 1] + offset.y) * scale.y));
    }
    parts.push(part);
  }
  let body = null;
  parts.forEach((part) => {
    if (!body) {
      body = CreatePolygon({
        worldId: data.worldId,
        type: b2BodyType.b2_dynamicBody,
        bodyDef,
        // position: position,
        vertices: part,
        density: 1,
        friction: 0.3,
        color: b2HexColor.b2_colorSkyBlue
      });
    } else {
      const hull = b2ComputeHull(part, part.length);
      const nGon = b2MakePolygon(hull, 0);
      b2CreatePolygonShape(body.bodyId, shapeDef, nGon);
    }
  });
}
function CreatePolygonFromVertices(data) {
  if (data.vertices.length < 3) {
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
  if (!scale) {
    scale = new b2Vec2(1, 1);
  }
  let offset = data.vertexOffset;
  if (!offset) {
    offset = new b2Vec2(0, 0);
  }
  const parts = [];
  for (let i = 0, l = data.indices.length; i < l; i++) {
    const part = [];
    const indices = data.indices[i];
    for (let p4 = 0, pl = indices.length; p4 < pl; p4++) {
      const index = indices[p4] * 2;
      part.push(new b2Vec2((data.vertices[index] + offset.x) * scale.x, (data.vertices[index + 1] + offset.y) * scale.y));
    }
    parts.push(part);
  }
  let body = null;
  parts.forEach((part) => {
    if (!body) {
      body = CreatePolygon({
        worldId: data.worldId,
        type: b2BodyType.b2_dynamicBody,
        bodyDef,
        // position: position,
        vertices: part,
        density: 1,
        friction: 0.3,
        color: b2HexColor.b2_colorSkyBlue
      });
    } else {
      const hull = b2ComputeHull(part, part.length);
      const nGon = b2MakePolygon(hull, 0);
      b2CreatePolygonShape(body.bodyId, shapeDef, nGon);
    }
  });
}
function CreatePhysicsEditorShape(data) {
  const key = data.key;
  const url = data.url;
  async function loadXMLFromFile(url2) {
    try {
      const response = await fetch(url2);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      return xmlDoc;
    } catch (error) {
      throw error;
    }
  }
  function extractPolygons(key2, xmlDoc) {
    const polygonElements = xmlDoc.querySelectorAll(`body[name=${key2}] fixtures polygon`);
    const uniqueVertices = [];
    const polygonIndices = [];
    function getVertexIndex(x, y) {
      const epsilon = 1e-6;
      const last = uniqueVertices.length;
      for (let i = 0; i < last; i += 2) {
        if (Math.abs(uniqueVertices[i] - x) < epsilon && Math.abs(uniqueVertices[i + 1] - y) < epsilon) {
          return i / 2;
        }
      }
      uniqueVertices.push(x, y);
      return last / 2;
    }
    Array.from(polygonElements).forEach((polygon) => {
      const numbers = polygon.textContent.trim().split(/[,\s]+/).map(Number);
      const polygonIndexList = [];
      for (let i = 0; i < numbers.length; i += 2) {
        const vertexIndex = getVertexIndex(numbers[i], numbers[i + 1]);
        polygonIndexList.push(vertexIndex);
      }
      polygonIndices.push(polygonIndexList);
    });
    return {
      vertices: uniqueVertices,
      // a flat array of x,y coordinates
      indices: polygonIndices
      // an array of index arrays, one per polygon
    };
  }
  function createPolygons(polygons) {
    return CreatePolygonFromVertices({
      ...data,
      indices: polygons.indices,
      vertices: polygons.vertices
    });
  }
  return new Promise(async (resolve, reject) => {
    try {
      const xmlDoc = await loadXMLFromFile(url);
      const polygons = extractPolygons(key, xmlDoc);
      const result = createPolygons(polygons);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
function CreateRevoluteJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreateWeldJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreateDistanceJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreateWheelJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreatePrismaticJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreateMotorJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
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
  return { jointId };
}
function CreateMouseJoint(data) {
  let jointDef = data.jointDef;
  if (!jointDef) {
    jointDef = new b2MouseJointDef();
  }
  jointDef.bodyIdA = data.bodyIdA;
  jointDef.bodyIdB = data.bodyIdB;
  setIfDef(jointDef, "target", data.target);
  setIfDef(jointDef, "hertz", data.hertz);
  setIfDef(jointDef, "dampingRatio", data.dampingRatio);
  setIfDef(jointDef, "maxForce", data.maxForce);
  setIfDef(jointDef, "collideConnected", data.collideConnected);
  const jointId = b2CreateMouseJoint(data.worldId, jointDef);
  return { jointId };
}

// src/main-prod.js
var STATIC = 0;
var KINEMATIC = 1;
var DYNAMIC2 = 2;
export {
  AddSpriteToWorld,
  B2_ID_EQUALS,
  B2_IS_NON_NULL,
  B2_IS_NULL,
  B2_NULL_INDEX,
  BodyToSprite,
  ClearWorldSprites,
  CreateBoxPolygon,
  CreateCapsule,
  CreateChain,
  CreateCircle,
  CreateDistanceJoint,
  CreateMotorJoint,
  CreateMouseJoint,
  CreateNGonPolygon,
  CreatePhysicsEditorShape,
  CreatePolygon,
  CreatePolygonFromEarcut,
  CreatePolygonFromVertices,
  CreatePrismaticJoint,
  CreateRevoluteJoint,
  CreateWeldJoint,
  CreateWheelJoint,
  CreateWorld,
  DYNAMIC2 as DYNAMIC,
  GetBodyFromSprite,
  GetWorldScale,
  KINEMATIC,
  Ragdoll,
  RemoveSpriteFromWorld,
  RotFromRad,
  STATIC,
  SetWorldScale,
  Skeletons,
  SpriteToBox,
  SpriteToCircle,
  UpdateWorldSprites,
  WorldStep,
  b2AABB,
  b2AABB_Center,
  b2AABB_Contains,
  b2AABB_Extents,
  b2AABB_IsValid,
  b2AABB_Union,
  b2Abs,
  b2AbsFloat,
  b2AbsInt,
  b2Add,
  b2BodyDef,
  b2BodyEvents,
  b2BodyId,
  b2BodyType,
  b2Body_ApplyAngularImpulse,
  b2Body_ApplyForce,
  b2Body_ApplyForceToCenter,
  b2Body_ApplyLinearImpulse,
  b2Body_ApplyLinearImpulseToCenter,
  b2Body_ApplyMassFromShapes,
  b2Body_ApplyTorque,
  b2Body_ComputeAABB,
  b2Body_Disable,
  b2Body_Enable,
  b2Body_EnableHitEvents,
  b2Body_EnableSleep,
  b2Body_GetAngularDamping,
  b2Body_GetAngularVelocity,
  b2Body_GetContactCapacity,
  b2Body_GetContactData,
  b2Body_GetGravityScale,
  b2Body_GetInertiaTensor,
  b2Body_GetJointCount,
  b2Body_GetJoints,
  b2Body_GetLinearDamping,
  b2Body_GetLinearVelocity,
  b2Body_GetLocalCenterOfMass,
  b2Body_GetLocalPoint,
  b2Body_GetLocalVector,
  b2Body_GetMass,
  b2Body_GetMassData,
  b2Body_GetPosition,
  b2Body_GetRotation,
  b2Body_GetShapeCount,
  b2Body_GetShapes,
  b2Body_GetSleepThreshold,
  b2Body_GetTransform,
  b2Body_GetType,
  b2Body_GetUserData,
  b2Body_GetWorldCenterOfMass,
  b2Body_GetWorldPoint,
  b2Body_GetWorldVector,
  b2Body_IsAwake,
  b2Body_IsBullet,
  b2Body_IsEnabled,
  b2Body_IsFixedRotation,
  b2Body_IsSleepEnabled,
  b2Body_IsValid,
  b2Body_SetAngularDamping,
  b2Body_SetAngularVelocity,
  b2Body_SetAwake,
  b2Body_SetBullet,
  b2Body_SetFixedRotation,
  b2Body_SetGravityScale,
  b2Body_SetLinearDamping,
  b2Body_SetLinearVelocity,
  b2Body_SetMassData,
  b2Body_SetSleepThreshold,
  b2Body_SetTransform,
  b2Body_SetType,
  b2Body_SetUserData,
  b2Capsule,
  b2CastOutput,
  b2ChainDef,
  b2ChainId,
  b2ChainSegment,
  b2Chain_IsValid,
  b2Chain_SetFriction,
  b2Chain_SetRestitution,
  b2Circle,
  b2Clamp,
  b2ClampFloat,
  b2ClampInt,
  b2CollideCapsuleAndCircle,
  b2CollideCapsules,
  b2CollideChainSegmentAndCapsule,
  b2CollideChainSegmentAndCircle,
  b2CollideChainSegmentAndPolygon,
  b2CollideCircles,
  b2CollidePolygonAndCapsule,
  b2CollidePolygonAndCircle,
  b2CollidePolygons,
  b2CollideSegmentAndCapsule,
  b2CollideSegmentAndCircle,
  b2CollideSegmentAndPolygon,
  b2ComputeAngularVelocity,
  b2ComputeCapsuleAABB,
  b2ComputeCapsuleMass,
  b2ComputeCircleAABB,
  b2ComputeCircleMass,
  b2ComputeHull,
  b2ComputePolygonAABB,
  b2ComputePolygonMass,
  b2ComputeSegmentAABB,
  b2ContactData,
  b2ContactEvents,
  b2CreateBody,
  b2CreateCapsuleShape,
  b2CreateChain,
  b2CreateCircleShape,
  b2CreateDistanceJoint,
  b2CreateMotorJoint,
  b2CreateMouseJoint,
  b2CreatePolygonShape,
  b2CreatePrismaticJoint,
  b2CreateRevoluteJoint,
  b2CreateSegmentShape,
  b2CreateTimer,
  b2CreateWeldJoint,
  b2CreateWheelJoint,
  b2CreateWorld,
  b2CreateWorldArray,
  b2Cross,
  b2CrossSV,
  b2CrossVS,
  b2DebugDraw,
  b2DefaultBodyDef,
  b2DefaultChainDef,
  b2DefaultDistanceJointDef,
  b2DefaultFilter,
  b2DefaultMotorJointDef,
  b2DefaultMouseJointDef,
  b2DefaultPrismaticJointDef,
  b2DefaultQueryFilter,
  b2DefaultRevoluteJointDef,
  b2DefaultShapeDef,
  b2DefaultWeldJointDef,
  b2DefaultWheelJointDef,
  b2DefaultWorldDef,
  b2DestroyBody,
  b2DestroyChain,
  b2DestroyJoint,
  b2DestroyShape,
  b2DestroyWorld,
  b2Distance,
  b2DistanceCache,
  b2DistanceInput,
  b2DistanceJointDef,
  b2DistanceJoint_EnableLimit,
  b2DistanceJoint_EnableMotor,
  b2DistanceJoint_EnableSpring,
  b2DistanceJoint_GetCurrentLength,
  b2DistanceJoint_GetDampingRatio,
  b2DistanceJoint_GetHertz,
  b2DistanceJoint_GetLength,
  b2DistanceJoint_GetMaxLength,
  b2DistanceJoint_GetMaxMotorForce,
  b2DistanceJoint_GetMinLength,
  b2DistanceJoint_GetMotorForce,
  b2DistanceJoint_GetMotorSpeed,
  b2DistanceJoint_IsLimitEnabled,
  b2DistanceJoint_IsMotorEnabled,
  b2DistanceJoint_IsSpringEnabled,
  b2DistanceJoint_SetLength,
  b2DistanceJoint_SetLengthRange,
  b2DistanceJoint_SetMaxMotorForce,
  b2DistanceJoint_SetMotorSpeed,
  b2DistanceJoint_SetSpringDampingRatio,
  b2DistanceJoint_SetSpringHertz,
  b2DistanceOutput,
  b2DistanceProxy,
  b2DistanceSquared,
  b2Dot,
  b2DynamicTree,
  b2DynamicTree_Create,
  b2DynamicTree_CreateProxy,
  b2DynamicTree_Destroy,
  b2DynamicTree_DestroyProxy,
  b2DynamicTree_EnlargeProxy,
  b2DynamicTree_GetAreaRatio,
  b2DynamicTree_GetByteCount,
  b2DynamicTree_GetHeight,
  b2DynamicTree_GetMaxBalance,
  b2DynamicTree_GetProxyCount,
  b2DynamicTree_MoveProxy,
  b2DynamicTree_Query,
  b2DynamicTree_RayCast,
  b2DynamicTree_Rebuild,
  b2DynamicTree_RebuildBottomUp,
  b2DynamicTree_ShapeCast,
  b2DynamicTree_ShiftOrigin,
  b2DynamicTree_Validate,
  b2Filter,
  b2GetByteCount,
  b2GetInverse22,
  b2GetLengthAndNormalize,
  b2GetLengthUnitsPerMeter,
  b2GetMilliseconds,
  b2GetMillisecondsAndReset,
  b2GetSweepTransform,
  b2GetTicks,
  b2GetVersion,
  b2HexColor,
  b2Hull,
  b2IntegrateRotation,
  b2InvMulRot,
  b2InvMulTransforms,
  b2InvRotateVector,
  b2InvTransformPoint,
  b2IsNormalized,
  b2IsValid,
  b2IsValidRay,
  b2JointId,
  b2JointType,
  b2Joint_GetBodyA,
  b2Joint_GetBodyB,
  b2Joint_GetCollideConnected,
  b2Joint_GetConstraintForce,
  b2Joint_GetConstraintTorque,
  b2Joint_GetLocalAnchorA,
  b2Joint_GetLocalAnchorB,
  b2Joint_GetType,
  b2Joint_GetUserData,
  b2Joint_IsValid,
  b2Joint_SetCollideConnected,
  b2Joint_SetUserData,
  b2Joint_WakeBodies,
  b2LeftPerp,
  b2Length,
  b2LengthSquared,
  b2Lerp,
  b2MakeBox,
  b2MakeOffsetBox,
  b2MakeOffsetPolygon,
  b2MakePolygon,
  b2MakeProxy,
  b2MakeRot,
  b2MakeRoundedBox,
  b2MakeSquare,
  b2Manifold,
  b2MassData,
  b2Max,
  b2MaxFloat,
  b2MaxInt,
  b2Min,
  b2MinFloat,
  b2MinInt,
  b2MotorJointDef,
  b2MotorJoint_GetAngularOffset,
  b2MotorJoint_GetCorrectionFactor,
  b2MotorJoint_GetLinearOffset,
  b2MotorJoint_GetMaxForce,
  b2MotorJoint_GetMaxTorque,
  b2MotorJoint_SetAngularOffset,
  b2MotorJoint_SetCorrectionFactor,
  b2MotorJoint_SetLinearOffset,
  b2MotorJoint_SetMaxForce,
  b2MotorJoint_SetMaxTorque,
  b2MouseJointDef,
  b2MouseJoint_GetMaxForce,
  b2MouseJoint_GetSpringDampingRatio,
  b2MouseJoint_GetSpringHertz,
  b2MouseJoint_GetTarget,
  b2MouseJoint_SetMaxForce,
  b2MouseJoint_SetSpringDampingRatio,
  b2MouseJoint_SetSpringHertz,
  b2MouseJoint_SetTarget,
  b2Mul,
  b2MulAdd,
  b2MulMV,
  b2MulRot,
  b2MulSV,
  b2MulSub,
  b2MulTransforms,
  b2NLerp,
  b2Neg,
  b2Normalize,
  b2NormalizeChecked,
  b2NormalizeRot,
  b2PointInCapsule,
  b2PointInCircle,
  b2PointInPolygon,
  b2Polygon,
  b2PrismaticJointDef,
  b2PrismaticJoint_EnableLimit,
  b2PrismaticJoint_EnableMotor,
  b2PrismaticJoint_EnableSpring,
  b2PrismaticJoint_GetLowerLimit,
  b2PrismaticJoint_GetMaxMotorForce,
  b2PrismaticJoint_GetMotorForce,
  b2PrismaticJoint_GetMotorSpeed,
  b2PrismaticJoint_GetSpringDampingRatio,
  b2PrismaticJoint_GetSpringHertz,
  b2PrismaticJoint_GetUpperLimit,
  b2PrismaticJoint_IsLimitEnabled,
  b2PrismaticJoint_IsMotorEnabled,
  b2PrismaticJoint_IsSpringEnabled,
  b2PrismaticJoint_SetLimits,
  b2PrismaticJoint_SetMaxMotorForce,
  b2PrismaticJoint_SetMotorSpeed,
  b2PrismaticJoint_SetSpringDampingRatio,
  b2PrismaticJoint_SetSpringHertz,
  b2QueryFilter,
  b2RayCastCapsule,
  b2RayCastCircle,
  b2RayCastInput,
  b2RayCastPolygon,
  b2RayCastSegment,
  b2RayResult,
  b2RelativeAngle,
  b2RevoluteJointDef,
  b2RevoluteJoint_EnableLimit,
  b2RevoluteJoint_EnableMotor,
  b2RevoluteJoint_EnableSpring,
  b2RevoluteJoint_GetAngle,
  b2RevoluteJoint_GetLowerLimit,
  b2RevoluteJoint_GetMaxMotorTorque,
  b2RevoluteJoint_GetMotorSpeed,
  b2RevoluteJoint_GetMotorTorque,
  b2RevoluteJoint_GetSpringDampingRatio,
  b2RevoluteJoint_GetSpringHertz,
  b2RevoluteJoint_GetUpperLimit,
  b2RevoluteJoint_IsLimitEnabled,
  b2RevoluteJoint_IsMotorEnabled,
  b2RevoluteJoint_IsSpringEnabled,
  b2RevoluteJoint_SetLimits,
  b2RevoluteJoint_SetMaxMotorTorque,
  b2RevoluteJoint_SetMotorSpeed,
  b2RevoluteJoint_SetSpringDampingRatio,
  b2RevoluteJoint_SetSpringHertz,
  b2RightPerp,
  b2Rot,
  b2Rot_GetAngle,
  b2Rot_GetXAxis,
  b2Rot_GetYAxis,
  b2Rot_IsValid,
  b2RotateVector,
  b2Segment,
  b2SegmentDistance,
  b2SegmentDistanceResult,
  b2SensorEvents,
  b2SetAllocator,
  b2SetAssertFcn,
  b2SetLengthUnitsPerMeter,
  b2ShapeCast,
  b2ShapeCastCapsule,
  b2ShapeCastCircle,
  b2ShapeCastInput,
  b2ShapeCastPairInput,
  b2ShapeCastPolygon,
  b2ShapeCastSegment,
  b2ShapeDef,
  b2ShapeDistance,
  b2ShapeId,
  b2ShapeType,
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
  b2Shape_GetCapsule,
  b2Shape_GetChainSegment,
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
  b2Shape_GetType,
  b2Shape_GetUserData,
  b2Shape_IsSensor,
  b2Shape_IsValid,
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
  b2Simplex,
  b2SleepMilliseconds,
  b2Solve22,
  b2Sub,
  b2Sweep,
  b2TOIInput,
  b2TOIOutput,
  b2TimeOfImpact,
  b2Transform,
  b2TransformPoint,
  b2TransformPolygon,
  b2UnwindAngle,
  b2ValidateHull,
  b2Vec2,
  b2Vec2_IsValid,
  b2WeldJointDef,
  b2WeldJoint_GetAngularDampingRatio,
  b2WeldJoint_GetAngularHertz,
  b2WeldJoint_GetLinearDampingRatio,
  b2WeldJoint_GetLinearHertz,
  b2WeldJoint_SetAngularDampingRatio,
  b2WeldJoint_SetAngularHertz,
  b2WeldJoint_SetLinearDampingRatio,
  b2WeldJoint_SetLinearHertz,
  b2WheelJointDef,
  b2WheelJoint_EnableLimit,
  b2WheelJoint_EnableMotor,
  b2WheelJoint_EnableSpring,
  b2WheelJoint_GetLowerLimit,
  b2WheelJoint_GetMaxMotorTorque,
  b2WheelJoint_GetMotorSpeed,
  b2WheelJoint_GetMotorTorque,
  b2WheelJoint_GetSpringDampingRatio,
  b2WheelJoint_GetSpringHertz,
  b2WheelJoint_GetUpperLimit,
  b2WheelJoint_IsLimitEnabled,
  b2WheelJoint_IsMotorEnabled,
  b2WheelJoint_IsSpringEnabled,
  b2WheelJoint_SetLimits,
  b2WheelJoint_SetMaxMotorTorque,
  b2WheelJoint_SetMotorSpeed,
  b2WheelJoint_SetSpringDampingRatio,
  b2WheelJoint_SetSpringHertz,
  b2WorldDef,
  b2WorldId,
  b2World_CastCapsule,
  b2World_CastCircle,
  b2World_CastPolygon,
  b2World_CastRay,
  b2World_CastRayClosest,
  b2World_Draw,
  b2World_DumpMemoryStats,
  b2World_EnableContinuous,
  b2World_EnableSleeping,
  b2World_EnableWarmStarting,
  b2World_Explode,
  b2World_GetBodyEvents,
  b2World_GetContactEvents,
  b2World_GetCounters,
  b2World_GetGravity,
  b2World_GetProfile,
  b2World_GetSensorEvents,
  b2World_IsValid,
  b2World_OverlapAABB,
  b2World_OverlapCapsule,
  b2World_OverlapCircle,
  b2World_OverlapPolygon,
  b2World_SetContactTuning,
  b2World_SetCustomFilterCallback,
  b2World_SetGravity,
  b2World_SetHitEventThreshold,
  b2World_SetPreSolveCallback,
  b2World_SetRestitutionThreshold,
  b2World_Step,
  b2Yield,
  mpx,
  pxm,
  pxmVec2
};
