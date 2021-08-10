const request = require('supertest');
const { matchers } = require('jest-json-schema');

const app = require('../app');
const mockdata = require('../data/testCase.json');

expect.extend(matchers);

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/tax')
        .send(mockdata);

        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toMatchSchema({
            title: 'Response Calculate Tax Schema',
            type: 'array',
            required: ['monthlySalary', 'marriageStatus', 'totalTax', 'detail', 'annualIncome', 'taxRelief'],
            properties: {
                monthlySalary: {type: 'number'},
                marriageStatus: {type: 'string'},
                totalTax: {type: 'number'},
                annualIncome: {type: 'number'},
                taxRelief: {
                    type: 'object',
                    required: ['id', 'name', 'code', 'amount'],
                },
                detail: {
                    type: 'array',
                    required: ['amountStart', 'amountEnd', 'taxRate', 'amount', 'total'],
                    properties: {
                        amountStart: {type: 'number'},
                        amountEnd: {type: 'number'},
                        taxRate: {type: 'number'},
                        amount: {type: 'number'},
                        total: {type: 'number'},
                    }
                }
            }
        });
    });
});