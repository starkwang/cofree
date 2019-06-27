import { toLambda } from '../src/adapter'
import * as request from 'supertest'
import * as assert from 'assert'
import application from './app'

const lambda = toLambda(application)

const inputEvent = {
    headerParameters: {},
    headers:
    {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cache-control': 'max-age=0',
        connection: 'keep-alive',
        'endpoint-timeout': '15',
        host: 'service-rggu3eoy-1257776809.gz.apigw.tencentcs.com',
        'if-none-match': 'W/"c-Lve95gjOVATpfV8EL5X4nxwjKHE"',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36',
        'x-anonymous-consumer': 'true',
        'x-qualifier': '$LATEST'
    },
    httpMethod: 'GET',
    path: '/',
    pathParameters: {},
    queryString: {},
    queryStringParameters: {},
    requestContext:
    {
        httpMethod: 'GET',
        identity: {},
        path: '/',
        serviceId: 'service-rggu3eoy',
        sourceIp: '14.17.22.35',
        stage: 'test'
    }
}

lambda(inputEvent).then(console.log)
