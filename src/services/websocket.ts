import { WS_URL } from '@/config';
import type { WebSocketMessage } from '@/models/emitter';
import alder32 from 'adler-32';
import { message, notification } from 'antd';
import { getProto } from '.';

const { setTimeout, setInterval, clearInterval, clearTimeout } = window
const InitialConnectState = {
    timer: undefined as any as number,//重连定时器
    count: 0, //重连次数
    state: 0 //断连类型，0正常，1重连中，2网络断开
}

interface Actions {
    onWebSocketMessage: (message: WebSocketMessage) => void
}

/**
 * 
 * @param account 当前账号密码
 * @param actions 更新model数据的函数
 */
export async function WebSocketManager(account: Record<'account' | 'password', string>, actions: Actions) {
    const {
        Authentication,
        Consequence,
        WsHeartbeat,
        WarnNote,
        ServerStatus,
        QuakeUpdate
    } = await getProto()
    let connectState = InitialConnectState
    let NO_RECONNECT = false
    let timer: number
    let ws: WebSocket
    function startWS() {
        ws = new WebSocket(WS_URL);
        ws.binaryType = 'arraybuffer'

        ws.onopen = () => {
            // console.log("%C websocket连接启动", 'color:pink');
            const data = Authentication.encode(Authentication.create(account)).finish()
            ws.send(getFormattedBinaryFromBuffer('instruct.Authentication', data));
        };

        ws.onmessage = ({ data }) => {
            const { key, content } = getBufferFromFormattedBinary(data)
            if (content === undefined) return
            let dispatchEvent = true, payload: any
            switch (key) {
                case 'instruct.Consequence':
                    payload = Consequence.toObject(Consequence.decode(new Uint8Array(content)))
                    const { verdict, message: msg } = payload
                    if (verdict) {
                        timer = setInterval(() => {
                            ws.send(getFormattedBinaryFromBuffer('instruct.Heartbeat', WsHeartbeat.encode(WsHeartbeat.create({})).finish()))
                        }, 30000)
                        connectState.state !== 0 && message.destroy()
                        connectState = InitialConnectState
                    } else {
                        notification.error({
                            duration: null,
                            message: '连接失败',
                            description: msg || 'websocket验证失败，请重新登录！'
                        })
                    }
                    break
                case 'instruct.WarnNote':
                    payload = WarnNote.toObject(WarnNote.decode(new Uint8Array(content)))
                    break
                case 'instruct.ServerStatus':
                    payload = ServerStatus.toObject(ServerStatus.decode(new Uint8Array(content)))
                    break
                case 'instruct.QuakeUpdate':
                    payload = QuakeUpdate.toObject(QuakeUpdate.decode(new Uint8Array(content)))
                    break
                case 'instruct.WsHeartbeat':
                    dispatchEvent = false
                    break
                default:
                    console.log('websocket收到未知类型消息');
                    dispatchEvent = false
                    break
            }
            if (dispatchEvent) actions.onWebSocketMessage({ message: key.slice(key.indexOf('.') + 1) as any, payload })
        };
        ws.onclose = () => {
            clearInterval(timer)
            console.log("websocket连接已关闭");
            // reconnect()
        };
        ws.onerror = () => {
            console.log("websocket连接发生错误");
        };
        // if (Notification.permission !== "granted") {
        //     Notification.requestPermission().then(permission => {
        //         permission === 'denied' && message.error('拒绝通知后不能及时推送系统通知，若有需求，请在浏览器设置中重新授权并刷新！')
        //     })
        // }
    }

    /**
    * 重连机制：间隔2^n秒重连,最大30秒;根据网络状态区分显示提示
    */
    function reconnect() {
        if (NO_RECONNECT) return
        let { timer, count, state } = connectState
        clearTimeout(timer)
        if (count > 4) {
            if (!navigator.onLine && state !== 2) {
                state === 1 && message.destroy()
                message.error('连接已断开，请检查网络连接！', 0)
                state = 2
            } else if (state !== 1) {
                state === 2 && message.destroy()
                message.warn('连接已断开，正在尝试重连...', 0)
                state = 1
            }
        }
        timer = setTimeout(() => {
            console.log(`正在尝试第${connectState.count}次重连...`);
            // startWS()
        }, Math.min(30, Math.pow(2, count++)) * 1000);
        connectState = { timer, count, state }
    }
    // startWS()
    return () => {
        clearInterval(timer)
        clearTimeout(connectState.timer)
        connectState.state !== 0 && message.destroy()
        NO_RECONNECT = true
        ws?.close()
    }
}

/**
 * 
 * @param key 字段名, 如 instruct.Heartbeat
 * @param data 原始二进制数据
 * @returns 格式化校验的Buffer
 */
function getFormattedBinaryFromBuffer(key: string, data: Uint8Array) {
    const nameLen = key.length
    const dataLen = data.length
    const fontArea = new ArrayBuffer(5)
    const fontAreaDataView = new DataView(fontArea)
    fontAreaDataView.setUint32(0, dataLen + nameLen + 5)
    fontAreaDataView.setUint8(4, nameLen)
    const verifyFields = concatArrayBuffer(new Uint8Array(fontArea), string2buffer(key), data)
    const verifyArea = new ArrayBuffer(4)
    const verifyAreaDataView = new DataView(verifyArea)
    verifyAreaDataView.setUint32(0, alder32.buf(verifyFields))
    const buffers = concatArrayBuffer(verifyFields, new Uint8Array(verifyArea))
    return buffers.buffer
}
/**
 * 
 * @param data 服务器返回的、格式化校验的二进制数据
 */
function getBufferFromFormattedBinary(data: ArrayBuffer) {
    const len = data.byteLength
    const dataview = new DataView(data)
    // const totalLen = dataview.getUint16(0)
    const nameLen = dataview.getUint8(4)
    const alder32Code = dataview.getUint32(len - 4)
    const keyArr = data.slice(5, 5 + nameLen)
    const content = data.slice(5 + nameLen, -4)
    let key = buffer2string(keyArr)
    if (alder32.buf(new Uint8Array(data.slice(0, -4)))[0] !== alder32Code[0]) {
        console.log('websocket收到验证失败的消息');
        return {}
    }
    return {
        key,
        content
    }
}

export function string2buffer(str: string) {
    let val = Array.from(str).map(e => e.charCodeAt(0))
    return new Uint8Array(val)
}

function buffer2string(ArrayBuffer: ArrayBuffer) {
    return String.fromCharCode.apply(null, new Uint8Array(ArrayBuffer) as unknown as Array<number>);
}

function concatArrayBuffer(...typedArrays: Uint8Array[]) {
    const len = typedArrays.reduce((pre, cur) => pre + cur.length, 0)
    const result = new Uint8Array(len)
    for (let i = 0, offset = 0; i < typedArrays.length; i++) {
        const typedArray = typedArrays[i]
        result.set(typedArray, offset);
        offset += typedArray.length
    }
    return result
}