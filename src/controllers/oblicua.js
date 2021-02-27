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
            let oblicua = [];
            let length = adn.length;
            for (let i = 0; i < length && i + config.SECUENCIALETRAS - 1 <= length - 1; i++) {
                let vlrTodasDiagonales = true; // Bandera que indica si se validan todas las diagonales
                if (i !== 0) {
                    adn = adn.slice(1, adn.length);
                    vlrTodasDiagonales = false;
                }
                oblicua = oblicua.concat(validarAdnOblicua(adn, vlrTodasDiagonales));
            }
            let result = await Promise.all(oblicua);
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
        let oblicua = [];
        for (let i = 0; i < adn.length && i + config.SECUENCIALETRAS - 1 <= adn.length - 1; i++) {
            let letras = math.diag(adn, i).toString().replace(/[^A-Z]/g, '');
            for (let x = 0; x < config.ADNLETRAS.length; x++) {
                oblicua.push(utils.validarSecuenciaLetra(letras, config.ADNLETRAS[x]));
            }
            if (!vlrTodasDiagonales) {
                i = adn.length;
            }
        }
        return oblicua;
    } catch (error) {
        console.error(error);
        return [];
    }
};