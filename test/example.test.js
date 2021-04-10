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
// describe('Suit de test unitario',()=>{
//     test('recibir mensaje',()=>{
//         expect(print('holi')).toBe('Estoy recibiendo holi')
//     })
// })


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

it('Espero que me devuelva el link depurado', () => {
	expect(functions.depurateLinks(undeporedLinks))
	.toEqual(expect.arrayContaining(linksMock))
})

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





// async -----------

// test('Obtener la extensión de archivos y carpetas', done => {
// 	function callback(archiveMock){
// 		try{
// 			expect(archiveMock).toBe('Accediendo a los Links de los archivos:');
// 			done();
// 		}catch(error){
// 			done(error);
// 		}
// 	}
// 	archivePath(callback);
// })