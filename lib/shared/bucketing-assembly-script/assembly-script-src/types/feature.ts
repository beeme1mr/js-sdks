import { JSON } from "assemblyscript-json"
import {
    getJSONArrayFromJSON,
    getJSONObjFromJSON, getJSONValueFromJSON,
    getStringFromJSON,
    isValidString,
    jsonArrFromValueArray
} from "./jsonHelpers"
import { FeatureConfiguration } from "./featureConfiguration"

const validTypes = ['release', 'experiment', 'permission', 'ops']

export class Feature extends JSON.Value {
    _id: string
    type: string
    key: string
    variations: Variation[]
    configuration: FeatureConfiguration

    constructor(feature: JSON.Obj) {
        super()
        this._id = getStringFromJSON(feature, '_id')

        this.type = isValidString(feature, 'type', validTypes)

        this.key = getStringFromJSON(feature, 'key')

        const variations = getJSONArrayFromJSON(feature, 'variations')
        this.variations = variations.valueOf().map<Variation>((variation) => {
            return new Variation(variation as JSON.Obj)
        })

        this.configuration = new FeatureConfiguration(getJSONObjFromJSON(feature, 'configuration'))
    }

    stringify(): string {
        const json = new JSON.Obj()
        json.set('_id', this._id)
        json.set('type', this.type)
        json.set('key', this.key)
        json.set('variations', jsonArrFromValueArray(this.variations))
        json.set('configuration', this.configuration)
        return json.stringify()
    }
}

export class Variation extends JSON.Value {
    _id: string
    name: string | null
    variables: Array<VariationVariable>

    constructor(variation: JSON.Obj) {
        super()
        this._id = getStringFromJSON(variation, '_id')

        const name = variation.getString('name')
        this.name = name ? name.toString() : null

        const variables = getJSONArrayFromJSON(variation, 'variables')
        this.variables = variables.valueOf().map<VariationVariable>((variable) => {
            return new VariationVariable(variable as JSON.Obj)
        })
    }

    stringify(): string {
        const json = new JSON.Obj()
        json.set('_id', this._id)
        if (this.name) {
            json.set('name', this.name)
        }

        json.set('variables', jsonArrFromValueArray(this.variables))

        return json.stringify()
    }
}

export class VariationVariable extends JSON.Value {
    _var: string
    value: JSON.Value

    constructor(variable: JSON.Obj) {
        super()
        this._var = getStringFromJSON(variable, '_var')
        this.value = getJSONValueFromJSON(variable, 'value')
    }

    stringify(): string {
        const json = new JSON.Obj()
        json.set('_var', this._var)
        json.set('value', this.value)
        return json.stringify()
    }
}
