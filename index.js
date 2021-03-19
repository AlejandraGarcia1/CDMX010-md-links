const fs = require('fs');
const path = require('path');

// const extension = '.md';
// const archive = './files';


//Accediendo a los archivos y leyendo su extensión (Casi buena) ---------
// fs.readdir(archive, (err, files) => {
// 	if (err){
// 		return console.log('Error al imprimir los archivos')
		
// 	}	else if (path.extname(files) === extension){
		
// 		fs.readFile(files, 'utf8', (err, fileData) => {
// 			if (err){
// 				console.log('No se pudo leer el archivo')
// 			}
// 			console.log(fileData)
// 		})
	
// 	}

// 	// let filtro = archive.filter(path.extname(files) === extension)
// 	// console.log(filtro);
	
// })

//Leer el archivo es una función, llamada en la función global -----------
// fs.readdir(archive, (err, files) => {
// 	if (err){
// 		return console.log('Error al imprimir los archivos')
		
// 	}	else if (path.extname(files) === extension){		
// 		read();	
// 	}	
// })

// const read = () => {
// 	fs.readFile(archive, 'utf8', (err, fileData) => {
// 		if (err) {
// 			return console.log('error al leer el archivo');
// 		}
// 			console.log(fileData)		
// 	})
// }

//Usando el método de Lau ---------

// const ReadDoc = (doc) => {
// 	// const mdDocFilter = doc.endsWith('.md');
//   // if (mdDocFilter === true) {
// 		const docContent = fs.readFileSync(doc, 'utf8');
// 		console.log(docContent);
// 	// } else {
// 	// 	console.log(chalk.red.bold('no soy un archivo ".md"'));
// 	// }
// }

const read = (archive) => {
	fs.readFile(archive, 'utf8', (err, fileData) => {
		if (err) {
			return console.log('prueba');
		}
			console.log(fileData)		
	})
}

//La buena-----

const leerCarpeta = (archive) => {
	fs.readdir(archive, (err, files) => {
		if (err){
			return console.log('Error al imprimir los archivos')
			
		}	else {	
			files.forEach((doc) => {
				const extNamePath = path.extname(doc)				
				if(extNamePath == '.md'){
				read(doc);	
			} else if (extNamePath == ''){
				console.log('Soy una carpeta', doc)
				const newPath = archive + '/' + doc
				console.log('HOLA', newPath)
				leerCarpeta(newPath)
			}
			})
			console.log(files)
		}	
		
	})
}
leerCarpeta('./files');






// fs.readdir(archive, (err, files) => {
// 	if (err){
// 		return console.log('Error al imprimir los archivos')		
// 	}

// 	let filtro = files.endsWith(extension)
// 	console.log(filtro);
	
// })



// -----------------------------------------


// Leyendo el archivo
// fs.readFile('README.md', 'utf8', (err, fileData) => {
// 	if (err) {
// 		return console.log('error al leer el archivo');
// 	}
// 	console.log(fileData);
// });


//Identificando la extensión del archivo
// const extension = () => {
// 	let ext = path.extname('README.md');
// 	console.log(path.extname())
//   console.log('HOLA', ext);
// }


// //Obteniendo el contenido de un archivo
// fs.readdir('./files', (err, files) => {
// 	if (err){
// 		return console.log('Error al imprimir los archivos')
// 	}
// 	// extension();
// 	console.log(files);
// })