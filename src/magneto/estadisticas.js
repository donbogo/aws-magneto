'use strict';

const AWS = require('aws-sdk');
const utils = require('../utils');

const TABLA_STATS = process.env.TABLA_STATS;

AWS.config.update({ region: process.env.REGION });

/**
 * Estadísticas de las verificaciones del ADN
 * @param {*} event 
 */
module.exports.stats = async (event) => {
    try {
        console.log(event);
        // JSON para las estadísticas de las verificaciones del ADN
        let estadistica = { count_mutant_dna: 0, count_human_dna: 0, ratio: 0 };
        let dynamo = new AWS.DynamoDB.DocumentClient();
        // Parametros de consulta
        let params = {
            TableName: TABLA_STATS,
            Key: { stats: 'magneto' }
        };
        console.log(params);
        let result = await dynamo.get(params).promise();
        console.log(result);
        // Se valida el resultado de la consulta
        if (result && result.Item) {
            // Mapeo del resultado
            estadistica.count_mutant_dna = result.Item.mutante;
            estadistica.count_human_dna = result.Item.humano;
            estadistica.ratio = result.Item.humano > 0 ? result.Item.mutante / result.Item.humano : 0;
        }
        return utils.respuestaServicio(200, 200, '', estadistica);
    } catch (error) {
        console.error(error);
        return utils.respuestaServicio(500, 500, 'Error');
    }
};