const process = require('process');
const { print } = require('./helper');

const cli = process.argv[2]

switch(cli){
    case('--validate'):
        console.log(print('Validar los links'));
			
        break;
    case('--stats'):
        console.log(print('Generar estadistica'));				
        break;
    default:
        console.log(print('Errrorrrrrrrr'));
}
