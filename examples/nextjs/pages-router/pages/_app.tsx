import '../styles/globals.css'
import React from 'react'
import type { AppProps } from 'next/app'
import { withDevCycleProvider } from '@devcycle/react-client-sdk'

const SDK_KEY =
    process.env.DEVCYCLE_CLIENT_SDK_KEY || '<DEVCYCLE_CLIENT_SDK_KEY>'
const user = {
    user_id: 'userId1',
    email: 'auto@taplytics.com',
    customData: {
        cps: 'Matthew',
        cpn: 777,
        cpb: true,
    },
    isAnonymous: false,
}

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default withDevCycleProvider({ sdkKey: SDK_KEY, user: user })(
    MyApp as React.FC,
)