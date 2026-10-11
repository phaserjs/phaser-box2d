import assert from 'node:assert/strict';
import test from 'node:test';

import {
    b2CreateWorld,
    b2CreateWorldArray,
    b2DefaultWorldDef,
    b2DestroyWorld,
    b2World_GetGravity,
    b2World_IsValid,
    b2World_SetGravity,
    b2World_Step,
    b2Vec2
} from '../src/main.js';

test('world slots can be reused without invalidating other worlds', () =>
{
    b2CreateWorldArray();

    const previousWorldIds = [];
    let recycledSlot;

    for (let i = 0; i < 100; ++i)
    {
        const worldDef = b2DefaultWorldDef();
        worldDef.gravity.x = i;
        worldDef.gravity.y = -i;

        const worldId = b2CreateWorld(worldDef);

        assert.notEqual(worldId.index1, 0, `world allocation failed on cycle ${i + 1}`);
        recycledSlot ??= worldId.index1;
        assert.equal(worldId.index1, recycledSlot);
        assert.equal(b2World_IsValid(worldId), true);
        assert.ok(previousWorldIds.every((previousWorldId) => !b2World_IsValid(previousWorldId)));
        assert.equal(b2World_GetGravity(worldId).x, i);
        assert.equal(b2World_GetGravity(worldId).y, -i);

        b2World_Step(worldId, 1 / 60, 1);
        b2DestroyWorld(worldId);
        previousWorldIds.push(worldId);
        assert.equal(b2World_IsValid(worldId), false);
    }

    const worldIds = [];

    for (let i = 0; i < 32; ++i)
    {
        const worldId = b2CreateWorld(b2DefaultWorldDef());

        assert.notEqual(worldId.index1, 0);
        worldIds.push(worldId);
    }

    assert.equal(b2CreateWorld(b2DefaultWorldDef()).index1, 0);

    const destroyedWorldId = worldIds[15];
    const survivingWorldId = worldIds[0];

    b2DestroyWorld(destroyedWorldId);

    assert.equal(b2World_IsValid(destroyedWorldId), false);

    const reusedWorldId = b2CreateWorld(b2DefaultWorldDef());

    assert.equal(reusedWorldId.index1, destroyedWorldId.index1);
    assert.notEqual(reusedWorldId.revision, destroyedWorldId.revision);
    assert.equal(b2World_IsValid(destroyedWorldId), false);
    assert.equal(b2World_IsValid(survivingWorldId), true);

    b2World_Step(survivingWorldId, 1 / 60, 1);

    for (const worldId of worldIds)
    {
        if (b2World_IsValid(worldId))
        {
            b2DestroyWorld(worldId);
        }
    }

    b2DestroyWorld(reusedWorldId);
});

test('stale world IDs cannot destroy a replacement world', () =>
{
    b2CreateWorldArray();

    const staleWorldId = b2CreateWorld(b2DefaultWorldDef());
    b2DestroyWorld(staleWorldId);

    const replacementWorldId = b2CreateWorld(b2DefaultWorldDef());

    assert.equal(replacementWorldId.index1, staleWorldId.index1);
    assert.equal(b2World_IsValid(staleWorldId), false);
    assert.throws(() => b2DestroyWorld(staleWorldId), /Invalid world ID/);
    assert.equal(b2World_IsValid(replacementWorldId), true);

    b2World_Step(replacementWorldId, 1 / 60, 1);
    b2DestroyWorld(replacementWorldId);
});

test('stale world IDs cannot mutate a replacement world', () =>
{
    b2CreateWorldArray();

    const staleWorldId = b2CreateWorld(b2DefaultWorldDef());
    b2DestroyWorld(staleWorldId);

    const replacementWorldId = b2CreateWorld(b2DefaultWorldDef());
    const replacementGravity = b2World_GetGravity(replacementWorldId);

    assert.equal(replacementWorldId.index1, staleWorldId.index1);
    assert.throws(
        () => b2World_Step(staleWorldId, 1 / 60, 1),
        /Invalid world ID/
    );
    assert.throws(
        () => b2World_SetGravity(staleWorldId, new b2Vec2(100, 200)),
        /Invalid world ID/
    );
    assert.equal(b2World_IsValid(replacementWorldId), true);
    assert.equal(b2World_GetGravity(replacementWorldId).x, replacementGravity.x);
    assert.equal(b2World_GetGravity(replacementWorldId).y, replacementGravity.y);

    b2World_Step(replacementWorldId, 1 / 60, 1);
    b2DestroyWorld(replacementWorldId);
});
