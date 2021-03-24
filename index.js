const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

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

// Verificar el estatus de los Links
const getStatus = (links) => {
	fetch(links)
	.then(response => console.log(chalk.cyanBright(response)))
	// .then(response => response.json())
	// 	.then(json => console.log(chalk.cyanBright(json)))
		// .then(response => console.log(chalk.cyanBright(response)));
		
}

//Depurar Links
const depurateLinks = (link) => {
	const deleteItem = link.indexOf(')');
	let finalLinks = "";

	if(deleteItem !== -1){
		finalLinks = link.slice(0,deleteItem)
	}else{
		finalLinks = link
	}return finalLinks
}



//Obteniendo los links de los archivos
const getLinks = (archive) => {
	return new Promise((resolve, reject) => {
		fs.readFile(archive, 'utf-8', (err, data) => {			
			if (err){
				console.log(chalk.red('Error al obtener los links del archivo'))
			}else{		
				const splitData = data.split('\n')

				splitData.forEach(textLine => {
					const http = /http/.test(textLine)
					const https = /https/.test(textLine)

					//Nos trae cada línea que contiene una URL:
					if(http == true || https == true){
						//Expresión regular de http o https
						const regExpUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
						const regExp = new RegExp(regExpUrl);
						const urlMatch = textLine.match(regExp);
						
						if(urlMatch){
							urlMatch.forEach(link => {
								const finalLink = depurateLinks(link) 
								console.log(chalk.green(finalLink))
								getStatus(link)
							})						
						}
					}
				})
			}			
			resolve('¡Todo salió según lo planeado!');
		})
	})
}





extensionArchive('./files');
