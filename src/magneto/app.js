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
 * @param {*} dna 
 */
module.exports.isMutant = async (event) => {
    try {
        let dna = JSON.parse(event.body ? event.body : event);
        if (utils.validarLetras(dna)) {
            dna = dna.replace(/[^A-Z,]/g, '');
            let adnArreglo = dna.split(',');
            let secuencias = 0;
            secuencias = await horizontal.adnHorizontal(adnArreglo);
            if (!utils.esMutante(secuencias)) {
                let arreglo = utils.separarLetrasAdn(adnArreglo);
                let arregloVertical = utils.rotarMatriz(Object.assign([], arreglo));
                secuencias += await vertical.adnVertical(arregloVertical);
                if (!utils.esMutante(secuencias)) {
                    secuencias += await oblicua.adnOblicua(Object.assign([], arreglo));
                    if (!utils.esMutante(secuencias)) {
                        let arregloOblicua = utils.rotarMatriz(Object.assign([], arreglo));
                        secuencias += await oblicua.adnOblicua(arregloOblicua);
                    }
                }
            }
            let esMutante = utils.esMutante(secuencias);
            let dynamo = new AWS.DynamoDB.DocumentClient();
            await guardarAdn(adn, esMutante, dynamo);
            await actualizarEstadisticas(esMutante, dynamo);
            return utils.respuestaServicio(esMutante ? 200 : 403, esMutante ? 200 : 403, esMutante ? 'OK' : 'Forbidden');
        }
    } catch (error) {
        console.error(error);
    }
    return utils.respuestaServicio(403, 403, 'Forbidden');
};

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