import { json, ok, route } from '@potentiajs/core';

export default route('GET', '/health', () => ok(json({ ok: true })));
