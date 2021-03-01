'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Se encarga de validar la secuencia vertical del adn
 * @param {*} adn 
 */
module.exports.adnVertical = async (adn) => {
    return new Promise(async (resolve) => {
        let resultVtl = 0;
        try {
            let vertical = []; // Arreglo de promesas para las validaciones de las filas del adn
            // Se recorre cada fila (secuencia) del adn
            for (let i = 0; i < adn.length; i++) {
                 // Validación de la secuencia por cada letra
                for (let x = 0; x < config.ADNLETRAS.length; x++) {
                    vertical.push(utils.validarSecuenciaLetra(adn[i].toString().replace(/[^A-Z]/g, ''), config.ADNLETRAS[x]));
                }
            }
            // Resultado de las validaciones de las secuencias del adn
            let result = await Promise.all(vertical);
            // Número de secuencias que cumplen el patron
            resultVtl = result.filter(r => r).length;
        } catch (error) {
            console.error(error);
        }
        resolve(resultVtl);
    });
};