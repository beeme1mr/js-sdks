import { JSON } from "assemblyscript-json"
import { getStringFromJSON, getJSONObjFromJSON, getJSONArrayFromJSON } from './jsonHelpers'
import { Feature, Variable } from "./feature"


export class PublicProject extends JSON.Value {
    _id: string
    key: string

    constructor(project: JSON.Obj) {
        super()
        this._id = getStringFromJSON(project, '_id')
        this.key = getStringFromJSON(project, 'key')
    }

    stringify(): string {
        const json = new JSON.Obj()
        json.set('_id', this._id)
        json.set('key', this.key)
        return json.stringify()
    }
}

export class PublicEnvironment extends JSON.Value {
    _id: string
    key: string

    constructor(environment: JSON.Obj) {
        super()
        this._id = getStringFromJSON(environment, '_id')
        this.key = getStringFromJSON(environment, 'key')
    }

    stringify(): string {
        const json = new JSON.Obj()
        json.set('_id', this._id)
        json.set('key', this.key)
        return json.stringify()
    }
}

export class ConfigBody {
    project: PublicProject
    environment: PublicEnvironment
    features: Feature[]
    variables: Variable[]
    variableHashes: Map<string, number>

    constructor(configJSON: JSON.Obj) {
        this.project = new PublicProject(getJSONObjFromJSON(configJSON, "project"))

        this.environment = new PublicEnvironment(getJSONObjFromJSON(configJSON, "environment"))

        const features = getJSONArrayFromJSON(configJSON, 'features')
        this.features = features.valueOf().map<Feature>((feature) => {
            return new Feature(feature as JSON.Obj)
        })

        const variables = getJSONArrayFromJSON(configJSON, 'variables')
        this.variables = variables.valueOf().map<Variable>((variable) => {
            return new Variable(variable as JSON.Obj)
        })

        const variableHashes = getJSONObjFromJSON(configJSON, 'variableHashes')
        const variableHashesMap = new Map<string, number>()
        const keys = variableHashes.keys
        for (let i=0; i++; i < keys.length) {
            const key = keys[i]
            const value = variableHashes.getNum(key)
            if (!value) throw new Error(`Unable to get variableHashes value for key: ${key}`)
            variableHashesMap.set(key, value.valueOf())
        }
        this.variableHashes = variableHashesMap
    }


    stringify(): string {
        const json: JSON.Obj = new JSON.Obj()
        json.set('project', this.project)
        json.set('environment', this.environment)
        json.set('features', this.features)
        json.set('variables', this.variables)
        json.set('variableHashes', this.variableHashes)
        return json.stringify()
    }
}
