import { createApp, route } from '../../src/index.js';
import { attrs, fragment, html, htmlResponse, layout, page, raw } from '../../src/html.js';

const userName = '<Ada & Grace>';
const trustedIcon = raw('<span aria-hidden="true">★</span>');
const appLayout = layout(({ title, children }) => html`
  <main${attrs({ class: ['page', 'html-basic'], 'data-example': 'html-basic' })}>
    <h1>${trustedIcon} ${title}</h1>
    ${children}
  </main>
`);

export const app = createApp({
  routes: [
    route('GET', '/', () => htmlResponse(page({
      title: 'Potentia HTML',
      head: html`<meta name="description" content="PotentiaJS HTML helper example">`,
      body: appLayout({
        title: 'Potentia HTML',
        children: fragment(
          html`
        <p>Hello, ${userName}</p>
        <p>${'Escaped by default: <script>'}</p>
      `,
          html`<p>${raw('Trusted raw HTML: <strong>explicit</strong>')}</p>`
        )
      })
    })))
  ]
});

const response = await app.fetch(new Request('http://localhost/'));

console.log(JSON.stringify({
  status: response.status,
  contentType: response.headers.get('content-type'),
  body: await response.text()
}, null, 2));
