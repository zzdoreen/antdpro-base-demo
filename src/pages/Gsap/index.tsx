import { gsap } from 'gsap'
import './index.less'
import { useEffect, useRef } from 'react'
import { Radio } from 'antd'
import { useSafeState } from 'ahooks'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const options = ['to', 'from', 'fromTo', 'set']
export default function Gsap() {
    const gsapRef = useRef<HTMLDivElement>(null)
    const [type, setType] = useSafeState<string>('to')
    // const [code, setCode] = useSafeState<string>('')

    useEffect(() => {
        if (!gsapRef.current) return
        gsap.set(gsapRef.current!, {
            x: 0,
            y: 0,
            background: 'transparent'
        })

        setTimeout(() => {
            // 相关属性 https://gsap.com/resources/get-started
            // svg\css\canvas相关属性
            switch (type) {
                case 'to': gsap.to(gsapRef.current, { x: 200, duration: 2, rotation: 360, }); break;
                case 'from': gsap.from(gsapRef.current, { x: 200, ease: "bounce.out" }); break;
                case 'fromTo': gsap.fromTo(gsapRef.current, { duration: 2.5, x: 200, background: 'red', opacity: 0.5 }, { y: 10, background: '#00bae2', opacity: 1 }); break;
                case 'set': gsap.set(gsapRef.current, { x: 200 }); break;
            }
        }, 1e3);

    }, [type])

    return <>
        <Radio.Group options={options.map(v => ({ label: v, value: v }))} value={type} onChange={v => setType(v?.target.value)} />
        <br /><br /><div className="box green" ref={gsapRef} />

        {/* <SyntaxHighlighter language="javascript" style={dark}>
            {code}
        </SyntaxHighlighter> */}
    </>
}