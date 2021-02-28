'use strict';

const config = require('../config');

/**
 * Se encarga de validar que dentro de la cadena del adn solo vengan las letras A,T,C,G
 * @param {*} adn 
 */
module.exports.validarLetras = (adn) => {
    try {
        let letras = adn.replace(/[\[{',}\]]/gi, '');
        return letras.match(/[ATCG]/g).length === letras.length;
    } catch (error) {
        console.error(error);
        throw new Error('Error validarLetras');
    }
    return false;
};

/**
 * Sabrás si un humano es mutante, si encuentras más de una secuencia de cuatro letras iguales
 * @param {*} secuencias 
 */
module.exports.esMutante = (secuencias) => {
    return config.NROSECUENCIAS <= secuencias;
};

/**
 * Se encarga de validar la secuencia del adn por cada una de las letras: (A,T,C,G)
 * @param {*} adn 
 * @param {*} letra 
 */
module.exports.validarSecuenciaLetra = (adn, letra) => {
    return new Promise(async (resolve) => {
        // Expresión regular para la validación de la secuencia
        let regexObj = new RegExp(`${letra}{${config.SECUENCIALETRAS}}`, 'g');
        resolve(regexObj.test(adn));
    });
};

/**
 * Se encarga de separar la cadena del adn en un arreglo de caracteres
 * Ej: 'ATGCGA' -> ['A','T','G','C','G','A']
 * @param {*} arreglo 
 */
module.exports.separarLetrasAdn = (arreglo) => {
    arreglo.forEach((element, index) => {
        arreglo[index] = element.split('');
    });
    return arreglo;
};

/**
 * Se encarga de rotar la matriz del adn en 90 grados
 *  Código tomado de la pagina:
 *      https://codereview.stackexchange.com/questions/186805/rotate-an-n-%C3%97-n-matrix-90-degrees-clockwise/186834
 * @param {*} matrix 
 */
module.exports.rotarMatriz = (matrix) => { // function statement
    const N = matrix.length - 1; // use a constant
    // use arrow functions and nested map;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    matrix.length = 0; // hold original array reference
    matrix.push(...result); // Spread operator
    return matrix;
};

/**
 * JSON respuesta de los servicios
 * @param {*} statusCode 
 * @param {*} codigo 
 * @param {*} mensaje 
 * @param {*} respuesta 
 */
module.exports.respuestaServicio = (statusCode, codigo, mensaje, respuesta) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({ codigo: codigo, mensaje: mensaje, respuesta: respuesta ? respuesta : {} }, null, 2)
    };
};