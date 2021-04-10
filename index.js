#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const process = require('process');

// 1. Obtener la extensión (saber si son archivos o carpetas)
const extensionArchive = (archive) => {	
	// Devuelve la extensión del path, desde la última aparición del carácter "."
	const extNamePath = path.extname(archive);

	if(extNamePath === '.md'){
		readContentMD(archive)
		//Path indicando la ruta de la carpeta. Ejemplo: ./files/prueba3.md
		// console.log(chalk.yellow('soy un archivo con extensión .md', archive))
	}else if(extNamePath === ''){
		// Path indicando la ruta de la carpeta. Ejemplo: ./files/Carpeta2/Carpeta3
		// console.log(chalk.magenta('soy una carpeta', archive))
		contentArchive(archive)
	}
}

// 2. Ingresar a las carpetas y obtener su contenido
const contentArchive = (archive) => {
	// Entra al directorio y a las carpetas dentro de carpetas. Ejemplo: ./files/Carpeta2/Carpeta3
	// console.log(chalk.red(archive))

	// Lee el contenido de un directorio
 fs.readdir(archive, (error, files) => {

	 if(error){
		 console.log(chalk.red('error al imprimir los archivos, dentro de otros archivos'))
	 }else{
		 files.forEach((doc) => {
			 // Definimos un nuevo Path en dado caso que nos encontremos con otro directorio
			 // Nota: Al imprimir "newPath" nos devuelve todos los documentos sin importar la extensión que tengan.
			 const newPath = archive + '/' + doc
			 // Path con la nueva ruta encontrada de una carpeta dentro de otra carpeta. Ejemplo: ./files/prueba.md
			//  console.log(chalk.blue('soy una nueva carpeta', newPath))
			extensionArchive(newPath)
		 })
	 }
 })
}

// 4. Depurar los links obtenidos del contenido de los archivos con extensión .md
const depurateLinks = (link) => {	
	// Retorna el primer índice en el que se puede encontrar un elemento dado en el array, ó retorna -1 si el elemento no esta presente.
	const deleteItem = link.indexOf(')');
	let cleanLinks = "";	

	if(deleteItem !== -1){
		// Cortamos los paréntesis
		cleanLinks = link.slice(0, deleteItem);
	}else{
		cleanLinks = link;
	}	
	return cleanLinks;
}


// 3. Leer el contenido de los archivos con extensión ".md" y obtener los links
const getLinks = (archive) => {
	
	// Creamos una nueva promesa
	return new Promise((resolve, reject) => {

		const links = []

		// Leemos el contenio del archivo con extensión .md
		fs.readFile(archive, 'utf-8', (error, data) => {
			if(error){
				console.log(chalk.red('Error al obtener el contenido del archivo con extensión .md'))
			}else{
				// Devuelve el contenido de cada archivo con terminación .md
				// console.log(chalk.magenta(data))

				// Vamos a fragmentar el contenido del documento en saltos de página
				const splitData = data.split('\n');
			
				splitData.forEach(textLine => {

					// Buscamos la coincidencia de una expresión regular con ".test" (Si se encuentra devuelve "true", si no "false")
					const http = /http/.test(textLine);
					const https = /https/.test(textLine);				

					if(http === true || https === true){
						// Expresión regular para hacer coincidir una URL
						const regExpUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
						// Se crea una nueva expresión regular en relación a la anterior
						const regExp = new RegExp(regExpUrl);						
						// Con "match" obtenemos todas las ocurrencias de una expresión regular dentro de una cadena.
						const urlMatch = textLine.match(regExp);												

						if(urlMatch){

							urlMatch.forEach(link => {
								const finalLink = depurateLinks(link);											
								links.push(finalLink)
							})							
						}						
					}					
				}) 
			}				
			resolve(links)
		})
	})
}

// 5. Verificar el estatus de los links
const getStatus = (link) => {	
		
	// "fetch" acceder y manipular partes del canal HTTP, tales como peticiones y respuestas (Es una promesa)
	return fetch(link)

	.then((response) => {
		// Nos devuelve un objeto por cada link, pero yo le defino unas propiedades en específico para que coincidan con el .catch		
		return response.ok ? {status:response.status, text:"OK", url:link} : {status:response.status, text:"FAIL", url:link}
	})
	.catch((error) => {
		// Nos devuelve un objeto por cada link, pero yo le defino unas propiedades en específico para que coincidan con el .catch			
		return {status: 500, text: 'FAIL', url:link}	
	})
	
}

// 6. Ejecutamos las promesas
const readContentMD = (archive) => {
	// Nos trae todos los links ya depurados en un objeto
	getLinks(archive)	
	
	.then((links) => {
		// console.log(chalk.red(links))
		const promises = links.map(getStatus)
		// console.log(Promise.all(promises))
		// let promis = Promise.all(promises)
		// console.log(getLinks(promis))		
		return Promise.all(promises)
	})
	.then((result) => {
		// Obtenemos un arreglo, con distintos objetos que son cada resultado.
		// console.log(result)
		
		if(process.argv.includes('--validate')){ 

			result.forEach((result) => {

				if(result.status === 200){
					console.log(chalk.gray(result.url), chalk.green(result.text), chalk.green('-'), chalk.green(result.status))
					// return chalk.magenta(result.url, result.text, result.status)
				}else if(result.status != 200){
					console.log(chalk.gray(result.url), chalk.red(result.text), chalk.red('-'), chalk.red(result.status))
					// return chalk.blue(result.url, result.text, result.status)
				}	
			})
		}

		stats(archive)


		// Contador ------------------------
		// if(process.argv.includes('--stats' && '--validate')){  **************************************** STATS Y VALIDATE

		// let counterOk = [];
		// let counterFail = [];

		// result.forEach((link) => {

		// 	if(link.status == 200){				
		// 		counterOk.push(link.status)
		// 	}else if(link.status != 200){
		// 		counterFail.push(link.status)
		// 	}

		// })
		// // // archivePath(archive)

		
		// console.log(chalk.green('El total de links OK: ', counterOk.length))
		// console.log(chalk.red('El total de links FAIL: ', counterFail.length))

		// // stats(archive)

		// }
		// ***********************+ aqui se ejecutan los links y stats
		// stats(archive) 

		// console.log(result)	
		// stats(archive)	
	})
	// stats(archive) 
}


// 6.1 Mostrar el Path de donde se esta obteniendo la información
const archivePath = (archive) => {
	// Se obtiene la extensión del Path
	const extensionPath = path.extname(archive)

	if(extensionPath === '.md'){
		console.log('Accediendo a los archivos de: ', archive)
	}else if(extensionPath === ''){
		console.log('Accediendo al directorio: ', archive)
	}

}

// 7. Estadísticas
const stats = (archive) => {
	
	if(process.argv.includes('--stats')){ 
	
		// console.log(process.argv)
		getLinks(archive)

		.then((links) => {
		
			// archivePath(archive)

			let totalLinks = links.length
			console.log(chalk.yellow('El total de links es: ', totalLinks))

			let uniqueLinks = [...new Set(links)].length
			console.log(chalk.blue('Los links unicos son: ', uniqueLinks))
	})
	}
}

// stats()	


// 8. Stats para stats y validate
const allStats = (archive) => {

	getLinks(archive)
	.then((links) => {

		let counterOk = [];
		let counterFail = [];

		links.forEach((link) => {

		if(link.status == 200){				
			counterOk.push(link.status)
		}else if(link.status != 200){
			counterFail.push(link.status)
		}

		console.log(chalk.green('El total de links OK: ', counterOk.length))
		console.log(chalk.red('El total de links FAIL: ', counterFail.length))

	})

	})

}



// 1.1 Definir en donde se ejecuta la primera función 
extensionArchive('./files')

module.exports = {
	'extensionArchive' : extensionArchive,
	'contentArchive' : contentArchive,
	'depurateLinks' : depurateLinks,
	'getLinks' : getLinks,
	'getStatus' : getStatus,
	'readContentMD' : readContentMD,
	'archivePath' : archivePath,
	'stats' : stats
}
