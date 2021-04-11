
const functions = require('../index');

const textMock = `Los tests unitarios deben cubrir un mínimo del 70% de _statements_, functions_,
	_lines_ y _branches_. Te recomendamos explorar [Jest](https://jestjs.io/)
  para tus pruebas unitarias.

	[ ] Verbos HTTP ([http.get](https://nodejs.org/api/http.html#http_http_get_options_callback))
  Fundamentos de programación.
  [ ] [Recursión.](https://www.youtube.com/watch?v=lPPgY3HLlhQ)`

const linksMock = [
	"https://jestjs.io/",
	"https://nodejs.org/api/http.html#http_http_get_options_callback",
	"https://www.youtube.com/watch?v=lPPgY3HLlhQ"
]

const undeporedLinks = [
	"(https://jestjs.io/)",
	"(https://nodejs.org/api/http.html#http_http_get_options_callback)",
	"(https://www.youtube.com/watch?v=lPPgY3HLlhQ)"
]

const mockStatus200 = [
  { status: 200, text: 'OK', url: 'https://nodejs.org/api/path.html' },
  {
    status: 200,
    text: 'OK',
    url: 'https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e'
  }
]

// describe('Le ingreso un arreglo con links sin depurar, por lo que espero que los devuelva depurados', () => {
// 	ValidityState(getLinks)
// 	.then((data) => {
// 		expect(data).toEqual(expect.arrayContaining(['https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n']))
// 	})
// 	// it('Espero que me devuelva el link depurado', () => {
// 	// 	expect(getLinks(['https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n)']))
// 	// 	.toEqual(expect.arrayContaining(['https://developer.mozilla.org/es/docs/Referencia_DOM_de_Gecko/Introducci%C3%B3n']))
// 	// })
// })

// test('Obtengo los links depurados de un texto', () => {
//   return expect(functions.getLinks(textMock)).expect.arrayContaining(linksMock);
// });

// it('Espero que me devuelva el link depurado', () => {
// 	expect(functions.depurateLinks(undeporedLinks))
// 	.toEqual(expect.arrayContaining(linksMock))
// })

// --- CASI BIEN
// test('Obtengo los links depurados de un texto', () => {
//   return functions.getLinks(textMock).then(data => {
//     expect(data).toEqual(linksMock);
//   });
// });

// EJEMPLO DE LAU -----------------------
// test('Obtengo los links depurados de un texto', () => {
//   return expect(functions.getLinks(textMock)).resolves.toStrictEqual(linksMock);
// });

// DICE QUE MANDO UN OBJETO VACÍO
// it('Espero que regrese los links limpios', () => {
// 	expect(functions.getLinks(['https://nodejs.org/api/http.html#http_http_get_options_callback)']))
// 	.toEqual(expect.objectContaining(['https://nodejs.org/api/http.html#http_http_get_options_callback']))
// })
describe('Probando la función getStatus', () =>{

	it('Debe ser una función', () => {
		expect(typeof functions.getStatus).toBe('function')
	});

	it('Espero que verifique que el estaus del link sea 200', () => {
		return functions.getStatus('https://nodejs.org/api/path.html').then(value => {
			expect(value).toEqual(expect.objectContaining({"status":200, "text":"OK", "url":"https://nodejs.org/api/path.html"}))
		})
	});

	it('Espero que verifique que el estaus del link sea 500', () => {
		return functions.getStatus('https://otra-cosa.net/algun-doc.html').then(value => {
			expect(value).toEqual(expect.objectContaining({"status": 500, "text":"FAIL", "url":"https://otra-cosa.net/algun-doc.html"}))
		})
	})

});






//MISMO ERROR DE ABAJO
// it('Espero que me devuelva el link depurado', () => {
// 	return functions.depurateLinks('https://nodejs.org/api/path.html)').then(value => {
// 		expect(value).toEqual(expect.objectContaining(['https://nodejs.org/api/path.html']))
// 	})
// })

// // DICE QUE .THEN NO ES UNA FUNCIÓN, PERO ESTOY SIGUIENDO EL EJEMPLO DE LA DOCUMENTACIÓN (ES EL COMENTADO ABAJO)
// 	test('Depurar links', () => {
// 		return functions.depurateLinks('https://nodejs.org/api/path.html)').then(data => {
// 			expect(data).toStrictEqual('https://nodejs.org/api/path.html')
// 		})
// 	})

// it('Espero que ')



// test('the data is peanut butter', () => {
//   return fetchData().then(data => {
//     expect(data).toBe('peanut butter');
//   });
// });



// depurate links 
// getLinks
