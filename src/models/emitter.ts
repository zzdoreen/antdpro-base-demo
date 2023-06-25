import { useEventEmitter } from "ahooks";
import { useCallback } from "react";
import { history } from "umi";

type Event<T extends string, U = undefined> = {
    type: T
} & (U extends undefined ? { payload?: undefined } : { payload: U })

type EventEmitter =
    Event<'onLogout'> |
    Event<'onWarnNote', { msg: string }> |
    Event<'onServerStatusChange', { name: string, status: boolean }>

type Message<T extends string, U = undefined> = {
    message: T
} & (U extends undefined ? { payload?: U } : { payload: U })

export type WebSocketMessage =
    Message<'Consequence', { verdict: boolean, message: string }> |
    // Message<'Control', { operation: 1 | 2 }> | //操作类型 1:下线 2:重新登录 
    Message<'WarnNote', { msg: string }> |
    Message<'ServerStatus', { name: string, status: boolean }>

export default function Emitter() {

    const emitter = useEventEmitter<EventEmitter>()

    // websocket消息分发
    const onWebSocketMessage = useCallback(({ message, payload }: WebSocketMessage) => {
        if (message === 'Consequence') {
            const { verdict } = payload
            if (!verdict) emitter.emit({ type: 'onLogout' })
        } else if (message === 'WarnNote') {
            emitter.emit({ type: 'onWarnNote', payload })
        } else if (message === 'ServerStatus') {
            emitter.emit({ type: 'onServerStatusChange', payload })
        } else if (message === 'QuakeUpdate') {
            const homeUrl = '/general'
            // 不在首页先跳转到首页，再播放预警
            if (window.location.pathname !== homeUrl) {
                history.push(homeUrl)
                setTimeout(() => {
                    emitter.emit({ type: 'onQuakeUpdate', payload });
                }, 1000);
            } else
                emitter.emit({ type: 'onQuakeUpdate', payload })
        }
    }, []);

    return {
        emitter,
        onWebSocketMessage
    }
}