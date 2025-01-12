import {
    DevCycleClient,
    DevCycleCloudClient,
    initializeDevCycle,
} from '../src/index'

jest.mock('../src/bucketing')
jest.mock('@devcycle/config-manager')

describe('NodeJS SDK Initialize', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('sucessfully calls initialize with no options', async () => {
        const client: DevCycleClient = await initializeDevCycle(
            'dvc_server_token',
        ).onClientInitialized()
        expect(client).toBeDefined()
    })

    it('fails to initialize in Local Bucketing mode when no token is provided', () => {
        expect(() =>
            initializeDevCycle(undefined as unknown as string),
        ).toThrow('Missing SDK key! Call initialize with a valid SDK key')
    })

    it('fails to initialize in Local Bucketing mode when client token is provided', () => {
        expect(() => initializeDevCycle('dvc_client_token')).toThrow(
            'Invalid SDK key provided. Please call initialize with a valid server SDK key',
        )
    })

    it('sucessfully calls initialize with enableCloudBucketing set to true', () => {
        const client: DevCycleCloudClient = initializeDevCycle(
            'dvc_server_token',
            {
                enableCloudBucketing: true,
            },
        )
        expect(client).toBeDefined()
    })

    it('fails to initialize in Cloud Bucketing mode when no token is provided', () => {
        expect(() =>
            initializeDevCycle(undefined as unknown as string, {
                enableCloudBucketing: true,
            }),
        ).toThrow('Missing SDK key! Call initialize with a valid SDK key')
    })
})
