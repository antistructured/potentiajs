import { route } from '@potentiajs/core';

import { renderHomePage } from '../form.js';

export default route('GET', '/', () => renderHomePage());
