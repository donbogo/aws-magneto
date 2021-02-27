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
            let vertical = [];
            for (let i = 0; i < adn.length; i++) {
                for (let x = 0; x < config.ADNLETRAS.length; x++) {
                    vertical.push(utils.validarSecuenciaLetra(adn[i].toString().replace(/[^A-Z]/g, ''), config.ADNLETRAS[x]));
                }
            }
            let result = await Promise.all(vertical);
            resultVtl = result.filter(r => r).length;
        } catch (error) {
            console.error(error);
        }
        resolve(resultVtl);
    });
};