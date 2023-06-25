import { Button, Input } from "antd"
import { useCallback, useState } from "react"
import { useModel } from "umi"
import './index.less'

export default function Websocket() {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { emitter, onWebSocketMessage } = useModel('emitter', ({ emitter, onWebSocketMessage }) => ({ emitter, onWebSocketMessage }))

    const [receive, setRecive] = useState({ 'onWarnNote': [], 'onServerStatusChange': [] })
    const [websocket, setWebsocket] = useState<string>('')

    const sendFunction = useCallback((payload: string) => {
        const message = Math.floor(Math.random() * 2 + 1) === 1 ? 'WarnNote' : 'ServerStatus'
        // 模拟发送消息
        onWebSocketMessage({ message, payload } as any)
    }, [])

    // 接收信息 
    emitter.useSubscription(({ type, payload }) => {
        setRecive(v => ({
            ...v,
            [type]: [payload, ...v[type as 'onWarnNote' | 'onServerStatusChange']]
        }) as any)
    })

    return <div className="conatiner">
        <Input allowClear onChange={v => setWebsocket(v.target.value)} /><Button onClick={() => sendFunction(websocket)}  >模拟发送</Button>
        <br />
        {
            Object.keys(receive).map(title => <div className="receive-container" key={title}>
                <h1>{title}</h1>
                <div className="content">
                    {
                        receive[title]?.map((msg: string) => <p key={msg}>{msg}</p>)
                    }
                </div>
            </div>)
        }
    </div>
}