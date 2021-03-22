const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

//Obtener el contenido de los archivos .md
const readContentMD = (archive) => {
	let readArchive = fs.readFileSync(archive, 'utf-8')
	console.log(chalk.magenta(readArchive))
}

//Ingresar a los archivos y obtener su contenido
const contentArchive = (archive) => {
	fs.readdir(archive, (err, files) => {
		if(err){
			console.log(chalk.red('Error al imprimir los archivos'))
		}else{
			// console.log(chalk.green(files))
			files.forEach((doc) => {
				const newPath = archive + '/' + doc
				extensionArchive(newPath)
			})
		}
	})
	
}

//Obteniendo la extensión (archivos o carpetas)
const extensionArchive = (archive) => {
	const extNamePath = path.extname(archive);

	if (extNamePath == '.md') {
		console.log(chalk.yellow('Soy un archivo con extensión .md'));
		readContentMD(archive)

	} else if (extNamePath == '') {
		console.log(chalk.cyan('Soy una carpeta'));
		contentArchive(archive)		
	}
}

extensionArchive('./files');
