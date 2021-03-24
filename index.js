const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

//Obtener el contenido de los archivos .md
const readContentMD = (archive) => {
	let readArchive = fs.readFileSync(archive, 'utf-8');
	console.log(chalk.magenta(readArchive));
	getLinks(archive)
}

//Ingresar a los archivos y obtener su contenido
const contentArchive = (archive) => {
	fs.readdir(archive, (err, files) => {
		if(err){
			console.log(chalk.red('Error al imprimir los archivos'));
		}else{
			// console.log(chalk.green(files))
			files.forEach((doc) => {
				const newPath = archive + '/' + doc
				extensionArchive(newPath);
			})
		}
	})	
}

//Obteniendo la extensión (archivos o carpetas)
const extensionArchive = (archive) => {
	const extNamePath = path.extname(archive);

	if (extNamePath == '.md') {
		console.log(chalk.yellow('Soy un archivo con extensión .md'));
		readContentMD(archive);

	} else if (extNamePath == '') {
		console.log(chalk.cyan('Soy una carpeta'));
		contentArchive(archive);		
	}
}

//Obteniendo los links de los archivos
const getLinks = (archive) => {
	return new Promise((resolve, reject) => {
		fs.readFile(archive, 'utf-8', (err, data) => {
			if (err){
				console.log(chalk.red('Error al obtener los links del archivo'))
			}else{		
						
				const splitData = data.split('\n')							
				// console.log(splitData)

				splitData.forEach(textLine =>{
					const http = /http/.test(textLine)
					const https = /https/.test(textLine)
					
					if(http == true || https == true){
						//Nos trae cada línea que contiene una URL
						// let urlHttp = http
						// console.log(urlHttp, textLine)
						const url = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
						const urlExtraidos = textLine.match(url);
						console.log(urlExtraidos)
					}
				})
			}			
			// resolve(links);
		})
	})
}





extensionArchive('./files');
