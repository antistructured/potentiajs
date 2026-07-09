import { route } from '@potentiajs/core';

import { renderUserPage } from '../../form.js';

export default route('GET', '/:id', (ctx) => renderUserPage(ctx.params.id));
