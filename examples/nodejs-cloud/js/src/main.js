const DevCycle = require('@devcycle/nodejs-server-sdk')
const express = require('express')

const DEVCYCLE_SERVER_SDK_KEY =
    process.env['DEVCYCLE_SERVER_SDK_KEY'] || '<DEVCYCLE_SERVER_SDK_KEY>'
let devcycleClient

async function startDevCycle() {
    devcycleClient = DevCycle.initializeDevCycle(DEVCYCLE_SERVER_SDK_KEY, {
        logLevel: 'info',
        enableCloudBucketing: true,
    })
    console.log('DevCycle Cloud Bucketing JS Client Ready')

    const user = {
        user_id: 'node_sdk_test',
        country: 'CA',
    }

    const partyTime = await devcycleClient.variableValue(
        user,
        'elliot-test',
        false,
    )
    if (partyTime) {
        const invitation = await devcycleClient.variable(
            user,
            'invitation-message',
            'My birthday has been cancelled this year',
        )
        console.log(
            "Hi there, we've been friends for a long time so I thought I would tell you personally: \n",
        )
        console.log(invitation.value)
        const event = {
            type: 'customType',
            target: invitation.key,
            date: Date.now(),
        }
        try {
            await devcycleClient.track(user, event)
        } catch (e) {
            console.error(e)
        }
    }

    const defaultVariable = await devcycleClient.variableValue(
        user,
        'not-a-real-key',
        true,
    )
    console.log(`Value of the variable is ${defaultVariable} \n`)
    const variables = await devcycleClient.allVariables(user)
    console.log('Variables: ')
    console.dir(variables)
    const features = await devcycleClient.allFeatures(user)
    console.log('Features: ')
    console.dir(features)
}

startDevCycle()

const app = express()
const port = 5002
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

function createUserFromQueryParams(queryParams) {
    let user = {}
    if (!queryParams) {
        throw new Error('Invalid query parameters')
    }
    for (const key in queryParams) {
        user[key] = queryParams[key]
    }
    if (!user.user_id) {
        throw new Error('user_id must be defined')
    }
    return user
}

app.get('/variables', (req, res) => {
    let user = createUserFromQueryParams(req.query)

    res.set(defaultHeaders)
    res.send(JSON.stringify(devcycleClient.allVariables(user)))
})

app.get('/features', (req, res) => {
    let user = createUserFromQueryParams(req.query)

    res.set(defaultHeaders)
    res.send(JSON.stringify(devcycleClient.allFeatures(user)))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
