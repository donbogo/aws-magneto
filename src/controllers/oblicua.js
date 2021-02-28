'use strict';

const math = require('mathjs');
const config = require('../config');
const utils = require('../utils');

/**
 * Se encarga de validar la secuencia oblicua del adn
 * @param {*} adn 
 */
module.exports.adnOblicua = async (adn) => {
    return new Promise(async (resolve) => {
        let resultObc = 0;
        try {
            let oblicua = []; // Arreglo de promesas para las validaciones de las filas del adn
            let length = adn.length; // Longitud de la matriz del adn
            // Se recorre la matriz del adn y se valida que la suma del index y la secuencia de letras no supere la longitud de la matriz
            for (let i = 0; i < length && i + config.SECUENCIALETRAS - 1 <= length - 1; i++) {
                let vlrTodasDiagonales = true; // Bandera que indica si se validan todas las diagonales
                if (i !== 0) { // Se valida que no sea la primera iteración
                    adn = adn.slice(1, adn.length); // Se elimina la primera fila de la matriz
                    vlrTodasDiagonales = false;
                }
                // Validar secuencias de la matriz en diagonal
                oblicua = oblicua.concat(validarAdnOblicua(adn, vlrTodasDiagonales));
            }
            // Resultado de las validaciones de las secuencias del adn
            let result = await Promise.all(oblicua);
            // Número de secuencias que cumplen el patron
            resultObc = result.filter(r => r).length;
        } catch (error) {
            console.error(error);
        }
        resolve(resultObc);
    });
};

/**
 * Se encarga de validar la secuencia de las letras
 * @param {*} adn 
 * @param {*} vlrTodasDiagonales 
 */
let validarAdnOblicua = (adn, vlrTodasDiagonales) => {
    try {
        let oblicua = []; // Arreglo de promesas para las validaciones en diagonal del adn
        for (let i = 0; i < adn.length && i + config.SECUENCIALETRAS - 1 <= adn.length - 1; i++) {
            // Cadena con las letras de la secuencia
            let letras = math.diag(adn, i).toString().replace(/[^A-Z]/g, '');
            // Validación de la secuencia por cada letra
            for (let x = 0; x < config.ADNLETRAS.length; x++) {
                oblicua.push(utils.validarSecuenciaLetra(letras, config.ADNLETRAS[x]));
            }
            // Identifica si solo se valida la diagonal principal de la matriz 
            if (!vlrTodasDiagonales) {
                i = adn.length; // Termina la ejecución de las validaciones
            }
        }
        return oblicua;
    } catch (error) {
        console.error(error);
        return [];
    }
};