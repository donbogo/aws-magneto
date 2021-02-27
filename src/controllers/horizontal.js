'use strict';

const config = require('../config');
const utils = require('../utils');

/**
 * Se encarga de validar la secuencia horizontal del adn
 * @param {*} adn 
 */
module.exports.adnHorizontal = async (adn) => {
    try {
        let horizontal = [];
        for (let i = 0; i < adn.length; i++) {
            for (let x = 0; x < config.ADNLETRAS.length; x++) {
                horizontal.push(utils.validarSecuenciaLetra(adn[i], config.ADNLETRAS[x]));
            }
        }
        let result = await Promise.all(horizontal);
        return result.filter(r => r).length;
    } catch (error) {
        console.error(error);
        return 0;
    }
};