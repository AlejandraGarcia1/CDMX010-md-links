// const process = require('process');
// const { readContentMD, getStatus } = require('./index');


// const argPath = process.argv[2];
// let arg1 = process.argv[3];
// let arg2 = process.argv[4];

// const cli = (argPath) => {

// 	if(arg1 == '--validate'){
// 		console.log(getStatus('Obteniendo el estatus de los linsk'))
// 	}if(arg2 == '--stats'){
// 		console.log(readContentMD('Obteniendo estadísticas'))
// 	}if(arg1 == '--validate' && arg2 == 'stats'){
// 		console.log(getStatus('Obteniendo el estatus de los linsk'), readContentMD('Obteniendo estadísticas'))
// 	}	
// }
// ------------------------------
const process = require('process');
const { readContentMD, getStatus } = require('../index');

const argPath = process.argv[2];
const validate1 = process.argv[3];
const validate2 = process.argv[4];
let cli = {}

if(validate1 [3] == '--validate' || validate1 [4] == '--validate' ){
	cli.validate = '--validate'	
} if(validate2[3] == '--stats' || validate2[4] == '--stats'){
	cli.stats = '--stats'
} if(validate1[3] == '--validate --stats' || validate1[3] == '--stats --validate' || validate2[4] == '--validate --stats' || validate2[4] == '--stats --validate'){
	cli.validate = '--validate'
	cli.stats = '--validate'
}

console.log(argPath)

const mdLinks = (argPath, validate1, validate2) => {
	if(cli.validate == '--validates'){
		extensionArchive()
		2
		3
		3
		getStatus()
		console.log(getStatus)
	}

}




// --------------------
// const process = require('process');
// const { print } = require('./helper');

// const cli = process.argv[2]

// switch(cli){
//     case('--validate'):
//         console.log(print('Validar los links'));
			
//         break;
//     case('--stats'):
//         console.log(print('Generar estadistica'));				
//         break;
//     default:
//         console.log(print('Errrorrrrrrrr'));
// }



// const {print}= require( './helper.js')
