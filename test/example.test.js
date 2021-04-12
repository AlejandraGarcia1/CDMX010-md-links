/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions *//* eslint-disable linebreak-style */

const functions = require('../index');

const textMock = `[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...), y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional README.md).

Estos archivos Markdown normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato Markdown, para verificar los links que contengan y reportar
algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)`;

const linksMock = [
  'https://es.wikipedia.org/wiki/Markdown',
  'https://nodejs.org/',
  'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
];

const links = 'https://jestjs.io/)';
'https://nodejs.org/api/http.html#http_http_get_options_callback)';
'https://www.youtube.com/watch?v=lPPgY3HLlhQ)';

const linksDepurate = 'https://jestjs.io/';
'https://nodejs.org/api/http.html#http_http_get_options_callback';
'https://www.youtube.com/watch?v=lPPgY3HLlhQ';

describe('Probando la función getStatus', () => {
  it('Debe ser una función', () => {
    expect(typeof functions.getStatus).toBe('function');
  });

  it('Espero que verifique que el estaus del link sea 200', () => functions.getStatus('https://nodejs.org/api/path.html').then((value) => {
    expect(value).toEqual(expect.objectContaining({ status: 200, text: 'OK', url: 'https://nodejs.org/api/path.html' }));
  }));

  it('Espero que verifique que el estaus del link sea 500', () => functions.getStatus('https://otra-cosa.net/algun-doc.html').then((value) => {
    expect(value).toEqual(expect.objectContaining({ status: 500, text: 'FAIL', url: 'https://otra-cosa.net/algun-doc.html' }));
  }));
});

describe('Probando la función de depurateLinks', () => {
  it('Debe ser una función', () => {
    expect(typeof functions.depurateLinks).toBe('function');
  });

  it('Espero que me devuelva el link depurado', () => {
    expect(functions.depurateLinks('https://nodejs.org/api/path.html)'))
      .toEqual(expect.stringContaining('https://nodejs.org/api/path.html'));
  });

  it('Debe devolverme una lista de links depurados', () => {
    expect(functions.depurateLinks(links))
      .toEqual(expect.stringContaining(linksDepurate));
  });
});

describe('Probando la función getLinks', () => {
  it('Debe ser una función', () => {
    expect(typeof functions.getLinks).toBe('function');
  });

  it('Debe poder leer el texto y devolver los links encontrados', () => functions.getLinks(textMock).then((data) => {
    expect(data).toEqual(linksMock);
  }));
});
