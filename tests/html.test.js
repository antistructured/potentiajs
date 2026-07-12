import { describe, expect, test } from 'bun:test';

import * as rootApi from '@potentiajs/core';
import * as htmlApi from '@potentiajs/core/html';
import { attrs, escapeHtml, fragment, html, htmlResponse, layout, page, raw } from '../src/html.js';

const text = (value) => String(value);

describe('HTML primitives', () => {
  test('escapeHtml escapes text and attribute characters', () => {
    expect(escapeHtml('&< >"\'')).toBe('&amp;&lt; &gt;&quot;&#39;');
  });

  test('escapeHtml handles null undefined and primitives', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(42)).toBe('42');
    expect(escapeHtml(false)).toBe('false');
    expect(escapeHtml(10n)).toBe('10');
  });

  test('raw preserves trusted HTML and empty values', () => {
    expect(text(raw('<strong>x</strong>'))).toBe('<strong>x</strong>');
    expect(text(raw(null))).toBe('');
    expect(text(raw(undefined))).toBe('');
  });

  test('plain objects cannot accidentally forge safe HTML values', () => {
    const forged = {
      value: '<strong>x</strong>',
      toString() {
        return '<strong>x</strong>';
      }
    };

    expect(text(fragment(forged))).toBe('&lt;strong&gt;x&lt;/strong&gt;');
  });

  test('html escapes interpolated values', () => {
    const value = '<script>alert("x")</script>';

    expect(text(html`<p>${value}</p>`)).toBe('<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>');
  });

  test('html preserves raw values', () => {
    expect(text(html`<p>${raw('<strong>x</strong>')}</p>`)).toBe('<p><strong>x</strong></p>');
  });

  test('html flattens arrays and omits nullish values', () => {
    expect(text(html`<ul>${['<a>', raw('<li>b</li>'), [null, undefined, 'c']]}</ul>`))
      .toBe('<ul>&lt;a&gt;<li>b</li>c</ul>');
  });

  test('html throws when called as a normal function', () => {
    expect(() => html('<p>literal</p>')).toThrow(TypeError);
  });

  test('fragment flattens without commas', () => {
    expect(text(fragment('a', ['<b>', raw('<strong>c</strong>')], null, undefined, 'd')))
      .toBe('a&lt;b&gt;<strong>c</strong>d');
  });

  test('attrs escapes values', () => {
    expect(text(attrs({ title: 'A&B "<tag>"' }))).toBe(' title="A&amp;B &quot;&lt;tag&gt;&quot;"');
  });

  test('attrs handles booleans and omitted values', () => {
    expect(text(attrs({ disabled: true, hidden: false, inert: null, role: undefined }))).toBe(' disabled');
  });

  test('attrs handles class arrays and className mapping', () => {
    expect(text(attrs({ class: ['a', ['b', null, false, 'c']] }))).toBe(' class="a b c"');
    expect(text(attrs({ className: 'button' }))).toBe(' class="button"');
  });

  test('attrs escapes safe HTML values in attribute context', () => {
    expect(text(attrs({ title: raw('<strong>x</strong>') }))).toBe(' title="&lt;strong&gt;x&lt;/strong&gt;"');
  });

  test('attrs rejects invalid names', () => {
    expect(() => attrs({ 'bad name': 'x' })).toThrow(TypeError);
    expect(() => attrs({ 'bad/name': 'x' })).toThrow(TypeError);
    expect(() => attrs({ 'bad="x"': 'x' })).toThrow(TypeError);
  });

  test('attrs rejects event handler attributes in preview.0', () => {
    expect(() => attrs({ onclick: 'alert(1)' })).toThrow(TypeError);
    expect(() => attrs({ onClick: 'alert(1)' })).toThrow(TypeError);
  });

  test('htmlResponse returns an HTML Response', async () => {
    const response = htmlResponse(html`<h1>${'Hello'}</h1>`, { status: 201, statusText: 'Created' });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(201);
    expect(response.statusText).toBe('Created');
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(await response.text()).toBe('<h1>Hello</h1>');
  });

  test('htmlResponse preserves existing content-type', () => {
    const response = htmlResponse(html`<p>x</p>`, {
      headers: { 'content-type': 'application/xhtml+xml' }
    });

    expect(response.headers.get('content-type')).toBe('application/xhtml+xml');
  });

  test('htmlResponse escapes plain strings and renders arrays safely', async () => {
    expect(await htmlResponse('<strong>x</strong>').text()).toBe('&lt;strong&gt;x&lt;/strong&gt;');
    expect(await htmlResponse(['a', raw('<b>b</b>'), '<c>']).text()).toBe('a<b>b</b>&lt;c&gt;');
  });

  test('layout requires a render function and returns a render function', () => {
    expect(() => layout(null)).toThrow(TypeError);
    expect(typeof layout(() => html`<p>x</p>`)).toBe('function');
  });

  test('layout passes props and preserves safe HTML results', () => {
    const card = layout(({ title, children }) => html`<section><h2>${title}</h2>${children}</section>`);

    expect(text(card({ title: '<Hello>', children: html`<p>World</p>` })))
      .toBe('<section><h2>&lt;Hello&gt;</h2><p>World</p></section>');
  });

  test('layout escapes plain results and flattens arrays', () => {
    expect(text(layout(() => '<main>x</main>')())).toBe('&lt;main&gt;x&lt;/main&gt;');
    expect(text(layout(() => ['a', raw('<b>b</b>'), ['<c>']])())).toBe('a<b>b</b>&lt;c&gt;');
  });

  test('layout renders nullish results as empty and does not swallow errors', () => {
    expect(text(layout(() => null)())).toBe('');
    expect(text(layout(() => undefined)())).toBe('');
    expect(() => layout(() => { throw new Error('boom'); })()).toThrow('boom');
  });

  test('page renders default document shell', () => {
    const value = text(page());

    expect(value).toStartWith('<!doctype html>');
    expect(value).toContain('<html lang="en">');
    expect(value).toContain('<meta charset="utf-8">');
    expect(value).toContain('<meta name="viewport" content="width=device-width, initial-scale=1">');
    expect(value).toContain('<body>');
  });

  test('page supports custom lang html attrs and body attrs', () => {
    const value = text(page({
      lang: 'de',
      htmlAttrs: { lang: 'ignored', class: 'app' },
      bodyAttrs: { class: ['page', 'home'], id: 'top' },
      body: 'Hello'
    }));

    expect(value).toContain('<html lang="de" class="app">');
    expect(value).toContain('<body class="page home" id="top">');
  });

  test('page escapes title head and plain body strings', () => {
    const value = text(page({
      title: '<Title>',
      head: '<meta name="bad">',
      body: '<main>Unsafe</main>'
    }));

    expect(value).toContain('<title>&lt;Title&gt;</title>');
    expect(value).toContain('&lt;meta name=&quot;bad&quot;&gt;');
    expect(value).toContain('&lt;main&gt;Unsafe&lt;/main&gt;');
  });

  test('page preserves safe head and body values', () => {
    const value = text(page({
      title: 'Safe',
      head: html`<meta name="description" content="Example">`,
      body: html`<main>${'Hello'}</main>`
    }));

    expect(value).toContain('<meta name="description" content="Example">');
    expect(value).toContain('<main>Hello</main>');
  });

  test('page supports children alias and body wins over children', () => {
    expect(text(page({ children: html`<main>Children</main>` }))).toContain('<main>Children</main>');
    const value = text(page({ body: html`<main>Body</main>`, children: html`<main>Children</main>` }));

    expect(value).toContain('<main>Body</main>');
    expect(value).not.toContain('<main>Children</main>');
  });

  test('page composes with htmlResponse', async () => {
    const response = htmlResponse(page({ title: 'Hello', body: html`<main>World</main>` }), { status: 202 });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(202);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(await response.text()).toContain('<main>World</main>');
  });

  test('subpath import works and exposes only HTML helpers', () => {
    expect(Object.keys(htmlApi).sort()).toEqual([
      'attrs',
      'escapeHtml',
      'fragment',
      'html',
      'htmlResponse',
      'layout',
      'page',
      'raw'
    ]);
  });

  test('root export does not include HTML helpers', () => {
    for (const key of Object.keys(htmlApi)) {
      expect(key in rootApi).toBe(false);
    }
  });

  test('package and JSR metadata expose the html subpath', async () => {
    const packageJson = await import('../package.json', { with: { type: 'json' } });
    const jsrJson = await import('../jsr.json', { with: { type: 'json' } });

    expect(packageJson.default.exports['./html']).toEqual({
      types: './src/html.d.ts',
      import: './src/html.js'
    });
    expect(jsrJson.default.exports['./html']).toBe('./src/html.js');
  });
});
