import { DVCLogger } from '@devcycle/types'

export class StreamingConnection {
    private connection: EventSource

    constructor(
        private url: string,
        private onMessage: (message: unknown) => void,
        private logger: DVCLogger
    ) {
        this.openConnection()
    }

    private openConnection() {
        this.connection = new EventSource(this.url, { withCredentials: true })
        this.connection.onmessage = (event) => {
            this.onMessage(event.data)
        }
        this.connection.onerror = (err) => {
            this.logger.error('StreamingConnection error', err)
        }
        this.connection.onopen = () => {
            this.logger.debug('StreamingConnection opened')
        }
    }

    isConnected(): boolean {
        return this.connection.readyState === this.connection.OPEN
    }

    reopen(): void {
        if (!this.isConnected()) {
            this.openConnection()
        }
    }

    close(): void {
        this.connection.close()
    }
}