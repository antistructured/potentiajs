import { json, ok, route } from '../../../../src/index.js';

export default route('GET', '/', () => ok(json({ route: 'root' })));
