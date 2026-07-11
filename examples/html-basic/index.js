import { createApp, route } from '../../src/index.js';
import { attrs, fragment, html, htmlResponse, raw } from '../../src/html.js';

const userName = '<Ada & Grace>';
const trustedIcon = raw('<span aria-hidden="true">★</span>');

export const app = createApp({
  routes: [
    route('GET', '/', () => htmlResponse(html`
      <main${attrs({ class: ['page', 'html-basic'], 'data-example': 'html-basic' })}>
        <h1>${trustedIcon} Potentia HTML</h1>
        <p>Hello, ${userName}</p>
        ${fragment(
          html`<p>${'Escaped by default: <script>'}</p>`,
          html`<p>${raw('Trusted raw HTML: <strong>explicit</strong>')}</p>`
        )}
      </main>
    `))
  ]
});

const response = await app.fetch(new Request('http://localhost/'));

console.log(JSON.stringify({
  status: response.status,
  contentType: response.headers.get('content-type'),
  body: await response.text()
}, null, 2));
