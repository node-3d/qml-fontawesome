import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { platform } from 'node:process';
import test from 'node:test';

import type { TGlfw } from '@node-3d/core';

const { absPath } = await import('@node-3d/qml-fontawesome');

if (platform === 'darwin') {
	await import('@node-3d/plugin-qml');

	test('loads the packed FontAwesome module assets', () => {
		assert.ok(existsSync(join(absPath, 'FontAwesome', 'qmldir')));
		assert.ok(existsSync(join(absPath, 'FontAwesome', 'IconAwesome.qml')));
	});
} else {
	const useGles = platform === 'linux';
	const [{ addThreeHelpers, gl, init: initCore }, three, { init: initQml }] = await Promise.all([
		import('@node-3d/core'),
		import('three'),
		import('@node-3d/plugin-qml'),
	]);

	test('loads FontAwesome through the packed package', async () => {
		const core = initCore({
			height: 32,
			isGles3: useGles,
			isVisible: false,
			isWebGL2: useGles,
			width: 32,
			onBeforeWindow(_window, currentGlfw) {
				if (!useGles) {
					return;
				}
				const current = currentGlfw as TGlfw;
				current.windowHint(current.VISIBLE, current.FALSE);
				current.windowHint(current.OPENGL_PROFILE, current.OPENGL_ANY_PROFILE);
				current.windowHint(current.CONTEXT_VERSION_MAJOR, 3);
				current.windowHint(current.CONTEXT_VERSION_MINOR, 2);
				current.windowHint(current.CLIENT_API, current.OPENGL_ES_API);
				current.windowHint(current.STENCIL_BITS, 0);
				current.windowHint(current.DEPTH_BITS, 0);
				current.windowHint(current.SAMPLES, 0);
			},
		});
		addThreeHelpers();
		const { QmlOverlay, View, loop } = initQml({
			cwd: import.meta.dirname,
			doc: core.doc,
			gl,
			three,
		});
		View.libs(absPath);
		const overlay = new QmlOverlay({ file: `${import.meta.dirname}/test.qml` });
		const loaded = new Promise<boolean>((res) => {
			const timeout = setTimeout(() => res(false), 5000);
			overlay.once('load', () => {
				clearTimeout(timeout);
				res(true);
			});
			overlay.once('error', () => {
				clearTimeout(timeout);
				res(false);
			});
		});
		const stop = loop(() => {
			/* nop */
		});

		try {
			assert.equal(await loaded, true);
			assert.equal(overlay.get('icon', 'name'), 'fa_play');
		} finally {
			stop();
			core.doc.destroy();
			await new Promise<void>((res) => {
				setTimeout(res, 500);
			});
		}
	});
}
