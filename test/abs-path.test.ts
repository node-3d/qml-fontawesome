import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { absPath } from '@node-3d/qml-fontawesome';

test('absPath resolves to the package root containing the QML module', () => {
	assert.equal(absPath, resolve(import.meta.dirname, '..'));
	assert.ok(existsSync(join(absPath, 'FontAwesome', 'qmldir')));
});
