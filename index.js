#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const process = require('process');


// De acuerdo al contenido que obtuvimos, vamos a ejecutar todas las promesas anteriores
const readContentMD = (archive) => {
	// 2. Mandamos llamar la función de "getLinks"
	getLinks(archive)
		//Definimos una promesa, donde si obtenemos el arreglo de links entonces:
		.then((links) => {
			//vamos a mapear cada link del arreglo, y el resultado retornará otro arreglo según la definición de su estatus de "getStatus"
			const promises = links.map(getStatus)
			//Devuelve una promesa que termina correctamente cuando todas las promesas anteriores se ejecutarón con exito
			return Promise.all(promises);
		})
		//Mostramos en consola el resultado general de la ejecuación de cada una de las promesas
		//Esto nos muestra el número total de links en cada archivo .md
		// .then(result => console.log('Total de links encontrados en el archivo', result, result.length)) // [200, 200, 200, ...]		
		.then((result) => {

			archivePath(archive)

			let counterOk = [];
			let counterFail = [];

			result.forEach((link) => {
				if(link.status == 200){
					counterOk.push(link.status)
				}else if(link.status != 200){
					counterFail.push(link.status)
				}
			})
			let totalLinks = counterOk.length + counterFail.length;
			console.log('Total de links', (totalLinks), 'Links Ok', (counterOk.length), 'Links rotos', (counterFail.length))
			// console.log(result)
			// console.log(chalk.magenta(counterOk), chalk.yellow(counterOk.length), chalk.red(counterFail), chalk.cyan(counterFail.length))
			return(counterOk, counterFail)		
		})		
		.catch((error) => console.log(chalk.red(error)))		
}



// Ingresar a los archivos y obtener su contenido
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



// Obteniendo la extensión (archivos o carpetas)
const extensionArchive = (archive) => {
	const extNamePath = path.extname(archive);

	if (extNamePath == '.md') {
		// console.log(chalk.yellow('Soy un archivo con extensión .md'));
		readContentMD(archive);

	} else if (extNamePath == '') {
		// console.log(chalk.cyan('Soy una carpeta'));
		archivePath(archive)
		contentArchive(archive);		
	}
}



//Mostrar en consola el Path del archivo
const archivePath = (archive) => {
	const extensionPath = path.extname(archive)

	if(extensionPath == '.md'){
		console.log(chalk.magentaBright('Accediendo a los Links de los archivos:', archive))
	}else if(extensionPath == ''){
		// console.log(chalk.gray('Accediendo a los archivos dentro del directorio:', archive))
	}
}



// Verificar el estatus de los Links
const getStatus = (link) => {
	//Aquí utilizamos retun, porque queremos que nos devuelva el link
	return fetch(link)	

	.then((response) => {				
			// console.log(chalk.cyan(response.status, response.url))
			return response.ok ? {status:response.status, text:"OK", url:link} : {status:response.status, text:"FAIL", url:link}		
	})
	.catch((error) => {	
			// console.log(chalk.red(error.status))
			return {status: 500, text: 'FAIL', url:link}		
	})
}



// Depurar Links
const depurateLinks = (link) => {
	const deleteItem = link.indexOf(')');
	let finalLinks = "";

	if(deleteItem !== -1){
		finalLinks = link.slice(0,deleteItem)
	}else{
		finalLinks = link
	}return finalLinks
}



// //Obteniendo el contenido de los archivos .md y sus links
const getLinks = (archive) => {
	// console.log('getlinks archive', archive)
	return new Promise((resolve, reject) => {
		//1. Definimos el arreglo en donde entrará cada Link validado
		const links = []
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
								// console.log(chalk.green(finalLink))
								//Estamos empujando al arreglo "links" cada Link ya depurado
								links.push(finalLink)
								//getStatus(finalLink)								
							})					
						}	
					}
				})
			}	

			
			// Nos retorna el el arreglo de "links", con todos los links dentro
			// console.log(chalk.magenta(links))		
			resolve(links);			
		})
	})
}

//Definir CLI
// const process = require('process');

const argPath = process.argv[2];
const validate1 = process.argv[3];
const validate2 = process.argv[4];
let cli = {}

if(validate1 == '--validate' || validate2 == '--validate' ){
	cli.validate = '--validate'	
} if(validate2 == '--stats' || validate1 == '--stats'){
	cli.stats = '--stats'
} 

console.log(argPath)
console.log(cli)

const mdLinks = (argPath, cli) => {
	if(cli.validate == '--validate'){
		
		// extensionArchive()
		// contentArchive()
		// getLinks()
		// depurateLinks()	
		return getStatus()
		.then(value => console.log('Hola',value))		
		// console.log(getStatus())
	}

	
	
	console.log('Si funciono', argPath)
	// return('Hola', getStatus())

}
mdLinks(argPath, cli)



extensionArchive('./files');
