'use strict';

const AWS = require('aws-sdk');
const horizontal = require('../controllers/horizontal');
const vertical = require('../controllers/vertical');
const oblicua = require('../controllers/oblicua');
const utils = require('../utils');

const TABLA_ADNS = process.env.TABLA_ADNS;
const TABLA_STATS = process.env.TABLA_STATS;

AWS.config.update({ region: process.env.REGION });

/**
 * Sabrás si un humano es mutante, si encuentras más de una secuencia de cuatro letras iguales, 
 * de forma oblicua, horizontal o vertical.
 * @param {*} event 
 */
module.exports.isMutant = async (event) => {
    try {
        // Body de la petición
        let body = JSON.parse(event.body ? event.body : event);
        let adn = body.adn.toString();
        if (utils.validarLetras(adn)) { // Validar que se cumplan los requerimientos de las letras en la matriz
            adn = adn.replace(/[^A-Z,]/g, ''); // Eliminar caracteres
            let dynamo = new AWS.DynamoDB.DocumentClient();
            let esMutante = false;
            // Se consulta el adn ingresado
            let _adn = await consultarAdn(adn, dynamo);
            if (_adn && !_adn.Item) { // Se valida que el adn no exista, que no se haya validado anteriormente
                let adnArreglo = adn.split(','); // Arreglo con las filas de las secuencias
                let validar = []; // Arreglo de promesas para las validaciones: oblicua, horizontal y vertical
                let arreglo = utils.separarLetrasAdn(adnArreglo); // Arreglo con las secuencias del adn
                let matrizRotada = utils.rotarMatriz(Object.assign([], arreglo)); // Se rota o se gira la matriz 90 grados de izquierda a derecha
                validar.push(horizontal.adnHorizontal(adnArreglo)); // Validaciones horizontales
                validar.push(vertical.adnVertical(Object.assign([], matrizRotada))); // Validaciones verticales
                validar.push(oblicua.adnOblicua(Object.assign([], arreglo))); // Validaciones diagonales de izquierda a derecha
                validar.push(oblicua.adnOblicua(Object.assign([], matrizRotada))); // Validaciones de derecha a izquierda
                let result = await Promise.all(validar); // Resultado con las validaciones del adn
                let secuencias = result.reduce((a, b) => a + b, 0); // Cantidad de secuencias encontradas en la matriz
                esMutante = utils.esMutante(secuencias); // Se valida si es o no mutante
                await guardarAdn(adn, esMutante, dynamo); // Se almacena el adn
                await actualizarEstadisticas(esMutante, dynamo); // Se actualizan las estadisticas
            } else {
                esMutante = _adn.Item.esMutante;
            }
            return utils.respuestaServicio(esMutante ? 200 : 403, esMutante ? 200 : 403, esMutante ? 'OK' : 'Forbidden');
        }
        return utils.respuestaServicio(400, 400, 'Bad Request');
    } catch (error) {
        console.error(error);
        return utils.respuestaServicio(500, 500, 'Error');
    }
};

/**
 * Consulta un adn en la base de datos
 * @param {*} adn 
 * @param {*} dynamo 
 */
let consultarAdn = async (adn, dynamo) => {
    try {
        // Parametros de la consulta
        let params = {
            TableName: TABLA_ADNS,
            Key: { adn: adn }
        };
        return await dynamo.get(params).promise();
    } catch (error) {
        console.error(error);
    }
};

/**
 * Almacena un adn en la base de datos
 * @param {*} adn 
 * @param {*} esMutante 
 * @param {*} dynamo 
 */
let guardarAdn = async (adn, esMutante, dynamo) => {
    try {
        // Parametros para el almacenamiento
        let params = {
            TableName: TABLA_ADNS,
            Item: {
                adn: adn,
                esMutante: esMutante
            }
        };
        await dynamo.put(params).promise();
    } catch (error) {
        console.error(error);
    }
};

/**
 * Actualiza las estadisticas de validación del adn
 * @param {*} esMutante 
 * @param {*} dynamo 
 */
let actualizarEstadisticas = async (esMutante, dynamo) => {
    try {
        // Parametros de actualización de estadisticas
        let params = {
            TableName: TABLA_STATS,
            Key: { stats: 'magneto' },
            AttributeUpdates: {
                mutante: {
                    Action: 'ADD',
                    Value: esMutante ? 1 : 0
                },
                humano: {
                    Action: 'ADD',
                    Value: esMutante ? 0 : 1
                }
            },
            ReturnValues: 'NONE'
        };
        await dynamo.update(params).promise();
    } catch (error) {
        console.error(error);
    }
};