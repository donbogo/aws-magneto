'use strict';

const AWS = require('aws-sdk'),
    AWSMock = require('aws-sdk-mock'),
    chai = require('chai'),
    expect = chai.expect;

AWSMock.setSDKInstance(AWS);

describe('Test mutant', function () {
    this.timeout(0);
    beforeEach(function () {
        
    });
    it('mutant test', async () => {
        const result = await handlerFileUpload.fileUploadHandler(modelEvent.eventQuery(requestFileUpload, 'POST', { 'Authorization': `Bearer ${access_token.access_token_1}` }, {}, { batchType: 'third-parties-ach', typeApproval: 'direct' }), { 'awsRequestId': '3000' });
        console.log('-------------------------------------------------------------');
        console.log('Result file upload', JSON.stringify(result));
        console.log('-------------------------------------------------------------');
        expect(result.status.statusCode).to.equal(200);
    });
    after(function () {
        AWSMock.restore();
    });
});