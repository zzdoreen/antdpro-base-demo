import { getTuringRequestService } from "@/services/turing"
import { useRequest } from "ahooks"
import { Button, Input } from "antd"
import { useEffect, useRef, useState } from "react"
import './index.less'
import moment from "moment";

export default function Turing() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [inputValue, setInputValue] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [messages, setMessages] = useState<{ user: string, msg: string, time: string }[]>([])
    // @ts-ignore
    const { data, loading } = useRequest(() => getTuringRequestService(text),
        {
            defaultParams: [text],
            refreshDeps: [text],
        })

    useEffect(() => {
        if (!loading && data) {
            setMessages(a => {
                return [
                    ...a,
                    {
                        user: 'turing',
                        msg: data?.results[0]?.values?.text,
                        time: moment().format('yyyy-MM-DD HH:mm:ss')
                    }
                ]
            })
        }
    }, [loading, data])

    useEffect(() => {
        if (containerRef.current)
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [messages])

    const handleSendMsg = () => {
        if (!inputValue) return

        setText(inputValue)
        setMessages(v => {
            return [
                ...v,
                {
                    user: 'user',
                    msg: inputValue,
                    time: moment().format('yyyy-MM-DD HH:mm:ss')
                }
            ]
        })
        setInputValue('')
    }
    return <>
        <div className="container" >
            <header className="msg-header">{loading ? '正在瞎编中...' : 'Turing'} </header>
            <div className="content" ref={containerRef}>
                {
                    messages.map(v => <>
                        <div key={v?.time} className={`message ${v?.user === 'user' ? 'user' : 'customer-service'}`}>
                            {v?.msg}
                            <div className="time">{v?.time}</div>
                        </div>
                    </>)
                }
            </div>
            <footer>
                <Input autoFocus allowClear value={inputValue} onPressEnter={handleSendMsg} onChange={(v) => setInputValue(v.target.value)} />
                <Button onClick={handleSendMsg} loading={loading}>发送</Button>
            </footer>
        </div>
    </>
}