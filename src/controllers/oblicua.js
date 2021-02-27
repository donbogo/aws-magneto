'use strict';

const math = require('mathjs');
const config = require('../config');
const utils = require('../utils');

/**
 * Se encarga de validar la secuencia oblicua del adn
 * @param {*} adn 
 */
module.exports.adnOblicua = async (adn) => {
    try {
        let oblicua = [];
        let length = adn.length;
        for (let i = 0; i < length && i + config.SECUENCIALETRAS - 1 <= length - 1; i++) {
            if (i !== 0) {
                adn = adn.slice(1, adn.length);
            }
            oblicua = oblicua.concat(validarAdnOblicua(adn));
        }
        let result = await Promise.all(oblicua);
        return result.filter(r => r).length;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

/**
 * Se encarga de validar la secuencia de las letras
 * @param {*} adn 
 */
let validarAdnOblicua = (adn) => {
    try {
        let oblicua = [];
        for (let i = 0; i < adn.length && i + config.SECUENCIALETRAS - 1 <= adn.length - 1; i++) {
            let letras = math.diag(adn, i).toString().replace(/[^A-Z]/g, '');
            for (let x = 0; x < config.ADNLETRAS.length; x++) {
                oblicua.push(utils.validarSecuenciaLetra(letras, config.ADNLETRAS[x]));
            }
        }
        return oblicua;
    } catch (error) {
        console.error(error);
        return [];
    }
};