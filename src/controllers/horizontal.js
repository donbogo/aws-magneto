'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Se encarga de validar la secuencia horizontal del adn
 * @param {*} adn 
 */
module.exports.adnHorizontal = async (adn) => {
    return new Promise(async (resolve) => {
        let resultHrz = 0;
        try {
            let horizontal = []; // Arreglo de promesas para las validaciones de las filas del adn
            // Se recorre cada fila (secuencia) del adn
            for (let i = 0; i < adn.length; i++) {
                // Validación de la secuencia por cada letra
                for (let x = 0; x < config.ADNLETRAS.length; x++) {
                    horizontal.push(utils.validarSecuenciaLetra(adn[i], config.ADNLETRAS[x]));
                }
            }
            // Resultado de las validaciones de las secuencias del adn
            let result = await Promise.all(horizontal);
            // Número de secuencias que cumplen el patron
            resultHrz = result.filter(r => r).length;
        } catch (error) {
            console.error(error);
        }
        // Resultado secuencias horizontales
        resolve(resultHrz);
    });
};