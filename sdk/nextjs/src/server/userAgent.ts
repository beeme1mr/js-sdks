import { cacheStorageError, getOptions } from './requestContext'
import { headers } from 'next/headers'

export const getUserAgent = (): string | undefined => {
    const options = getOptions()

    if (!options) {
        throw cacheStorageError()
    }

    if (options.staticMode) {
        return
    }

    const reqHeaders = headers()
    return reqHeaders.get('user-agent') ?? undefined
}
