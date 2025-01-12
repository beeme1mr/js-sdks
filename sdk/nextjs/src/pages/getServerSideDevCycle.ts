import { SSRProps } from './types'
import { DevCycleUser } from '@devcycle/js-client-sdk'
import { getBucketedConfig } from './bucketing.js'
import { GetServerSidePropsContext } from 'next'

type IdentifiedUser = Omit<DevCycleUser, 'user_id' | 'isAnonymous'> & {
    user_id: string
}

export const getServerSideDevCycle = async (
    sdkKey: string,
    user: IdentifiedUser,
    context: GetServerSidePropsContext,
): Promise<SSRProps> => {
    const userAgent = context.req.headers['user-agent'] ?? null
    const bucketingConfig = await getBucketedConfig(sdkKey, user, userAgent)
    return {
        _devcycleSSR: {
            bucketedConfig: bucketingConfig.config,
            user,
            sdkKey,
            userAgent,
        },
    }
}

export const getStaticDevCycle = async (
    sdkKey: string,
    user: IdentifiedUser,
): Promise<SSRProps> => {
    const bucketingConfig = await getBucketedConfig(sdkKey, user, null)
    return {
        _devcycleSSR: {
            bucketedConfig: bucketingConfig.config,
            sdkKey,
            user,
            userAgent: null,
        },
    }
}
