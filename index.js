#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const process = require('process');


// Ejecutamos las promesas y obtenemos sus estadísticas.
const readContentMD = (archive) => {	

	getLinks(archive)
			
		.then((links) => {		
			const promises = links.map(getStatus)		
			return Promise.all(promises);
		})
		
		.then((result) => {
			archivePath(archive);

			let counterOk = [];
			let counterFail = [];

			result.forEach((link) => {

				if(link.status == 200){
					counterOk.push(link.status);
				}else if(link.status != 200){
					counterFail.push(link.status);
				}
			})

			let totalLinks = counterOk.length + counterFail.length;
			console.log('Total de links', (totalLinks), 'Links Ok', (counterOk.length), 'Links rotos', (counterFail.length));
			
			return(counterOk, counterFail)		
		})		
		.catch((error) => console.log(chalk.red(error)))		
};



// Ingresar a los directorios y obtener su contenido.
const contentArchive = (archive) => {

	fs.readdir(archive, (err, files) => {

		if(err){
			console.log(chalk.red('Error al imprimir los archivos'));
		}else{			
			files.forEach((doc) => {				
				const newPath = archive + '/' + doc;
				extensionArchive(newPath);
			})
		}
	})	
};



// Obtener la extensión (archivos o carpetas).
const extensionArchive = (archive) => {
	
	const extNamePath = path.extname(archive);

	if (extNamePath == '.md') {		
		readContentMD(archive);
	} else if (extNamePath == '') {		
		archivePath(archive)
		contentArchive(archive);		
	}
};



// Mostrar en consola el Path del archivo.
const archivePath = (archive) => {

	const extensionPath = path.extname(archive);

	if(extensionPath == '.md'){
		console.log(chalk.magentaBright('Accediendo a los Links de los archivos:', archive))
	}else if(extensionPath == ''){
		// console.log(chalk.gray('Accediendo a los archivos dentro del directorio:', archive))
	}
};



// Verificar el estatus de los Links.
const getStatus = (link) => {
	
	return fetch(link)	

	.then((response) => {		
		return response.ok ? {status:response.status, text:"OK", url:link} : {status:response.status, text:"FAIL", url:link}		
	})
	.catch((error) => {	
		return {status: 500, text: 'FAIL', url:link}		
	})
};



// Depurar Links.
const depurateLinks = (link) => {

	const deleteItem = link.indexOf(')');
	let finalLinks = "";

	if(deleteItem !== -1){
		finalLinks = link.slice(0, deleteItem);
	}else{
		finalLinks = link;
	}return finalLinks;
};



// Obteniendo el contenido de los archivos .md y sus links.
const getLinks = (archive) => {
	
	return new Promise((resolve, reject) => {
		
		const links = []

		fs.readFile(archive, 'utf-8', (err, data) => {

			if (err){
				console.log(chalk.red('Error al obtener los links del archivo'));
			}else{		
				const splitData = data.split('\n');

				splitData.forEach(textLine => {
					const http = /http/.test(textLine);
					const https = /https/.test(textLine);
				
					if(http == true || https == true) {						
						const regExpUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
						const regExp = new RegExp(regExpUrl);
						const urlMatch = textLine.match(regExp);						
						
						if(urlMatch) {

							urlMatch.forEach(link => {
								const finalLink = depurateLinks(link);								
								links.push(finalLink);															
							})					
						}	
					}
				})
			}	
			resolve(links);			
		})
	})
}



// Definición del CLI.
// Nota: se puede correr en consola con el siguiente comando: md-links ./Carpeta --validate
const argPath = process.argv[2];
const validate1 = process.argv[3];
const validate2 = process.argv[4];
let cli = {}

if(validate1 == '--validate' || validate2 == '--validate' ) {
	cli.validate = '--validate';	
} if(validate2 == '--stats' || validate1 == '--stats') {
	cli.stats = '--stats';
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


// Indicación donde se ejecutará nuestro programa.
extensionArchive('./files');
