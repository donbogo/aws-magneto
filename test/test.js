'use strict';

const AWS = require('aws-sdk'),
    AWSMock = require('aws-sdk-mock'),
    chai = require('chai'),
    expect = chai.expect;

const mutante = require('../src/magneto/mutante'),
    estadisticas = require('../src/magneto/estadisticas');

AWS.config.update({ region: process.env.REGION });
AWSMock.setSDKInstance(AWS);

describe('Test mutant OK', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(null, {});
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
            callback(null, true);
        });
    });
    it('mutant test 200', async () => {
        const result = await mutante.isMutant({
            'body': "{\"adn\":[\"ATGCCG\",\"CAGTGC\",\"TTAGGT\",\"AGGAGG\",\"ACCTCA\",\"TCGAGG\"]}",
            'method': 'POST',
            'headers': {},
            'query': {},
            'path': {}
        }, { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Respuesta es mutante', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.statusCode).to.equal(200);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('Test mutant Forbidden', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(null, {});
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'put', function (params, callback) {
            callback(null, true);
        });
        AWSMock.mock('DynamoDB.DocumentClient', 'update', function (params, callback) {
            callback(null, true);
        });
    });
    it('mutant test 403', async () => {
        const result = await mutante.isMutant({
            'body': "{\"adn\":[\"ATCG\",\"TCGA\",\"CGAT\",\"GATC\"]}",
            'method': 'POST',
            'headers': {},
            'query': {},
            'path': {}
        }, { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Respuesta es mutante', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.statusCode).to.equal(403);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('Test mutant Fallido', function () {
    this.timeout(0);
    beforeEach(function () {
    });
    it('mutant test error', async () => {
        const result = await mutante.isMutant({
            'body': "{\"adn\":[]}",
            'method': 'POST',
            'headers': {},
            'query': {},
            'path': {}
        }, { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Respuesta es mutante', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.statusCode).to.equal(500);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('Test stats OK', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(null, { Item: { 'stats': 'magneto', 'mutante': 40, 'humano': 100 } });
        });
    });
    it('estadisticas test 200', async () => {
        const result = await estadisticas.stats({
            'body': {},
            'method': 'GET',
            'headers': {},
            'query': {},
            'path': {}
        }, { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Respuesta estadistica', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.statusCode).to.equal(200);
    });
    after(function () {
        AWSMock.restore();
    });
});

describe('Test stats fallida', function () {
    this.timeout(0);
    beforeEach(function () {
        AWSMock.mock('DynamoDB.DocumentClient', 'get', function (params, callback) {
            callback(new Error('Error'), {});
        });
    });
    it('estadisticas test error', async () => {
        const result = await estadisticas.stats({
            'body': {},
            'method': 'GET',
            'headers': {},
            'query': {},
            'path': {}
        }, { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Respuesta estadistica', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.statusCode).to.equal(500);
    });
    after(function () {
        AWSMock.restore();
    });
});