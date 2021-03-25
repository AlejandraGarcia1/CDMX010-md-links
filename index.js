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
	
	let totalStatus200 = []	

	fetch(links)
	.then((response) => {		
		// console.log(chalk.cyanBright(response.status, response.url))
		if(response.status == 200){
			let linksStatus200 = response.status
			totalStatus200.push(linksStatus200)
			console.log('Solicitud exitosa', linksStatus200, response.url)
		}else if(response.status == 403 ){
			let linksStatus403 = response.status
			console.log('Sin autorización de acceso', linksStatus403, response.url)
		}else if(response.status == 404){
			let linksStatus404 = response.status
			console.log('Servidor no encontrado', linksStatus404, response.url)
		}else if(response.status == 500){
			let linksStatus500 = response.status
			console.log('Error del servidor', linksStatus500, response.url)
		}else if(response.status == 503){
			let linksStatus503 = response.status
			console.log('Servidor sobresaturado', linksStatus503, response.url)
		}
	})
	.catch((error) => {
		console.log(chalk.red('Status error', error))
	})
	console.log(totalStatus200)
	return(totalStatus200)
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
