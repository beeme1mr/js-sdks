import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import { registerDecorator, ValidationOptions } from '@nestjs/class-validator'

/**
 * Validates that JSON Object is a valid JSON Object with only
 * top-level string / number / boolean / null values.
 */
export function IsDVCCustomDataJSONObject(
    validationOptions?: ValidationOptions,
) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            name: 'isLongerThan',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate,
                defaultMessage() {
                    return '$property must be a JSON Object with only string / number / boolean / null types'
                },
            },
        })
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function validate(json: any): boolean {
    if (!isPlainObject(json)) return false

    for (const key in json) {
        if (!isString(key)) return false

        const value = json[key]
        if (
            isUndefined(value) ||
            !(
                isString(value) ||
                isNumber(value) ||
                isBoolean(value) ||
                isNull(value)
            )
        ) {
            return false
        }
    }
    return true
}
