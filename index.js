#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs *//* eslint-disable linebreak-style */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const process = require('process');

// 4. Depurar los links obtenidos del contenido de los archivos con extensión .md
const depurateLinks = (link) => {
  const deleteItem = link.indexOf(')');
  let cleanLinks = '';

  if (deleteItem !== -1) {
    cleanLinks = link.slice(0, deleteItem);
  } else {
    cleanLinks = link;
  }
  return cleanLinks;
};

// 3. Leer el contenido de los archivos con extensión ".md" y obtener los links
const getLinks = (archive) => new Promise((resolve) => {
  const links = [];

  fs.readFile(archive, 'utf-8', (error, data) => {
    if (error) {
      console.log(chalk.red('Error al obtener el contenido del archivo con extensión .md'));
    } else {
      const splitData = data.split('\n');

      splitData.forEach((textLine) => {
        const http = /http/.test(textLine);
        const https = /https/.test(textLine);

        if (http === true || https === true) {
          const regExpUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
          const regExp = new RegExp(regExpUrl);
          const urlMatch = textLine.match(regExp);

          if (urlMatch) {
            urlMatch.forEach((link) => {
              const finalLink = depurateLinks(link);
              links.push(finalLink);
            });
          }
        }
      });
    }
    resolve(links);
  });
});

// 6.1 Mostrar el Path de donde se esta obteniendo la información
const archivePath = (archive) => {
  const extensionPath = path.extname(archive);

  if (extensionPath === '.md') {
    console.log(chalk.cyan('Accediendo a los archivos de: ', archive));
  } else if (extensionPath === '') {
    console.log(chalk.yellow('Accediendo al directorio: ', archive));
  }
};

// 5. Verificar el estatus de los links
const getStatus = (link) => fetch(link)

  .then((response) => (response.ok ? { status: response.status, text: 'OK', url: link } : { status: response.status, text: 'FAIL', url: link }))
  .catch(() => ({ status: 500, text: 'FAIL', url: link }));

// 6. Ejecutamos las promesas
const readContentMD = (archive) => {
  getLinks(archive)

    .then((links) => {
      const promises = links.map(getStatus);
      return Promise.all(promises);
    })
    .then((result) => {
      if (process.argv.includes('--validate')) {
        archivePath(archive);

        // eslint-disable-next-line no-shadow
        result.forEach((result) => {
          if (result.status === 200) {
            console.log(chalk.gray(result.url), chalk.green(result.text), chalk.green('-'), chalk.green(result.status));
          } else if (result.status !== 200) {
            console.log(chalk.gray(result.url), chalk.red(result.text), chalk.red('-'), chalk.red(result.status));
          }
        });
      }
      // eslint-disable-next-line no-use-before-define
      stats(archive);
    });
};

// 1. Obtener la extensión (saber si son archivos o carpetas)
const extensionArchive = (archive) => {
  const extNamePath = path.extname(archive);

  if (extNamePath === '.md') {
    readContentMD(archive);
  } else if (extNamePath === '') {
    // eslint-disable-next-line no-use-before-define
    contentArchive(archive);
  }
};

// 2. Ingresar a las carpetas y obtener su contenido
const contentArchive = (archive) => {
  fs.readdir(archive, (error, files) => {
    if (error) {
      console.log(chalk.red('error al imprimir los archivos, dentro de otros archivos'));
    } else {
      files.forEach((doc) => {
        const newPath = `${archive}/${doc}`;
        extensionArchive(newPath);
      });
    }
  });
};

// 7. Estadísticas
const stats = (archive) => {
  if (process.argv.includes('--stats')) {
    getLinks(archive)

      .then((links) => {
        const promises = links.map(getStatus);
        return Promise.all(promises);
      })
      .then((result) => {
        const counterOk = [];
        const counterFail = [];

        result.forEach((link) => {
          if (link.status === 200) {
            counterOk.push(link.status);
          } else if (link.status !== 200) {
            counterFail.push(link.status);
          }
        });

        archivePath(archive);

        const totalLinks = result.length;
        console.log(chalk.gray('El'), chalk.yellow('TOTAL'), chalk.gray('de links es: '), chalk.yellow(totalLinks));
        const uniqueLinks = [...new Set(result)].length;
        console.log(chalk.gray('Los links'), chalk.magenta('UNICOS'), chalk.gray('son: '), chalk.magenta(uniqueLinks));
        console.log(chalk.gray('El total de links'), chalk.green('INTACTOS'), chalk.gray('son: '), chalk.green(counterOk.length));
        console.log(chalk.gray('El total de links'), chalk.red('ROTOS'), chalk.gray('son: '), chalk.red(counterFail.length));
      });
  }
};

// 1.1 Definir en donde se ejecuta la primera función
extensionArchive('./files');

module.exports = {
  extensionArchive,
  contentArchive,
  depurateLinks,
  getLinks,
  getStatus,
  readContentMD,
  archivePath,
  stats,
};
