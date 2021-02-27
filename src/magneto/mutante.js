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
        let body = JSON.parse(event.body ? event.body : event);
        let adn = body.adn.toString();
        if (utils.validarLetras(adn)) {
            adn = adn.replace(/[^A-Z,]/g, '');
            let adnArreglo = adn.split(',');
            let validar = [];
            let arreglo = utils.separarLetrasAdn(adnArreglo);
            let matrizRotada = utils.rotarMatriz(Object.assign([], arreglo));
            validar.push(horizontal.adnHorizontal(adnArreglo));
            validar.push(vertical.adnVertical(Object.assign([], matrizRotada)));
            validar.push(oblicua.adnOblicua(Object.assign([], arreglo)));
            validar.push(oblicua.adnOblicua(Object.assign([], matrizRotada)));
            let result = await Promise.all(validar);
            let secuencias = result.reduce((a, b) => a + b, 0);
            let esMutante = utils.esMutante(secuencias);
            let dynamo = new AWS.DynamoDB.DocumentClient();
            let _adn = await consultarAdn(adn, dynamo);
            await guardarAdn(adn, esMutante, dynamo);
            if (_adn && !_adn.Item) {
                await actualizarEstadisticas(esMutante, dynamo);
            }
            return utils.respuestaServicio(esMutante ? 200 : 403, esMutante ? 200 : 403, esMutante ? 'OK' : 'Forbidden');
        }
    } catch (error) {
        console.error(error);
        return utils.respuestaServicio(500, 500, 'Error');
    }
    return utils.respuestaServicio(403, 403, 'Forbidden');
};

/**
 * 
 * @param {*} adn 
 * @param {*} dynamo 
 */
let consultarAdn = async (adn, dynamo) => {
    try {
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
 * 
 * @param {*} adn 
 * @param {*} esMutante 
 * @param {*} dynamo 
 */
let guardarAdn = async (adn, esMutante, dynamo) => {
    try {
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
 * 
 * @param {*} esMutante 
 * @param {*} dynamo 
 */
let actualizarEstadisticas = async (esMutante, dynamo) => {
    try {
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