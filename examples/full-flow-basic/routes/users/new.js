import { route } from '@potentiajs/core';

import { renderCreateUserPage } from '../../form.js';

export default route('GET', '/new', () => renderCreateUserPage());
