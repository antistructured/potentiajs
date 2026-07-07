import { ok, route, text } from '@potentiajs/core';

export default route('GET', '/', () => ok(text('file routing home')));
