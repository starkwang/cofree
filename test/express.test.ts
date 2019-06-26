import { toKoaRouter, toScf, toExpress } from '../src/adapter'
import { Get, Body, Headers, Req } from '../src/http'
import { Module, Controller } from '../src/module'
import { Injectable, createApplication } from '../src/ioc'
import * as request from 'supertest'
import * as assert from 'assert'

@Injectable()
class FooProvider {
    constructor() { }
    say() {
        return 'hello! stark!'
    }
}

@Controller()
class FooController {
    constructor(
        private readonly fooProvider: FooProvider
    ) { }

    @Get('/')
    async index(@Body() body) {
        return this.fooProvider.say()
    }
}

@Controller()
class BarController {
    constructor(
        private readonly fooProvider: FooProvider
    ) { }

    @Get('/headers')
    async body(@Headers() headers) {
        return JSON.stringify(headers)
    }

    async noRoute() { }
}



@Module({
    controllers: [FooController, BarController],
    providers: [FooProvider]
})
class AppModule { }

const application = createApplication(AppModule)
const expressApp = toExpress(application)


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe('Adapter for express', function () {
    it('should listen for 3000', async function () {
        const res = await request(expressApp)
            .get('/')
            .expect(200)
        assert.strictEqual(res.text, 'hello! stark!')
    });

    it('should return headers', async function () {
        const res = await request(expressApp)
            .get('/headers')
            .expect(200)
        assert(res.text.includes('accept-encoding'))
    });
});

