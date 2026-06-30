import { json, ok, route } from '../../../../src/index.js';

export default route('GET', '/health', () => ok(json({ ok: true })));
