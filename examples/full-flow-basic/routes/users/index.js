import { route } from '@potentiajs/core';

import { handleCreateUser } from '../../form.js';

export default route('POST', '/', (ctx) => handleCreateUser(ctx.request));
