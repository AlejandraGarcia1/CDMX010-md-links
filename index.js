const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

//Obtener el contenido de cada archivo

const readContentMD = (archive) => {
	let readArchive = fs.readFileSync(archive, 'utf-8')
	console.log(chalk.magenta(readArchive))
}


//Entrar a las carpetas y archivos

// const enterFile = (archive) => {
// 	fs.readdir(archive, (err, files) => {
// 		if (err){
// 			return console.log(chalk.red('Error al imprimir los archivos'));			
// 		}	else {	
// 			files.forEach((doc) => {
// 				const docNamePath = path.extname(doc)				
// 				if(docNamePath == '.md'){
// 				const newPath = archive + '/' + doc	
// 				read(newPath);	
// 			} else if (docNamePath == ''){
// 				console.log(chalk.yellow('Soy una carpeta', doc))
// 				const newPath = archive + '/' + doc
// 				// console.log(chalk.cyan('Estamos accediendo a la ruta:', newPath)) --> Nos muestra la ruta a  que accedemos
// 				enterFile(newPath)
// 			}
// 			})
// 			// console.log(files) --> Nos muestra todas las carpetas y archivos (sin importar la extensión) de la ruta
// 		}		
// 	})
// }

// const contentArchive = (archive) => {
// 	fs.readdir(archive, (err, files) => {
// 		if(err){
// 			console.log(chalk.red('Error al obtener los archivos de la carpeta'))
// 		}else{
// 			files.forEach((doc) => {
// 				const newPath = archive + '/' + doc
// 				read(newPath)
// 				// console.log(newPath)
// 				// read(newPath)
// 			})			
// 		}		
// 	})
// }

const contentArchive = (archive) => {
	fs.readdir(archive, (err, files) => {
		if(err){
			console.log(chalk.red('Error al imprimir los archivos'))
		}else{
			console.log(chalk.magenta(files))
			files.forEach((doc) => {
				const newPath = archive + '/' + doc
				extensionArchive(newPath)
			})
		}
	})
	
}


const extensionArchive = (archive) => {
	const extNamePath = path.extname(archive);
	if (extNamePath == '.md') {
		console.log(chalk.yellow('Soy un archivo .md'));
		readContentMD(archive)
		// readDocMd(archive);
	} else if (extNamePath == '') {
		console.log(chalk.cyan('Soy una carpeta'));
		contentArchive(archive)
		// readDirectory(archive);
	}
}

extensionArchive('./files');
