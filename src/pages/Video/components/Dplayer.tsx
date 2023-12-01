import { useEffect, useRef } from 'react'
import type { DPlayerEvents } from 'dplayer';
import DPlayer from 'dplayer'
import Hls from 'hls.js'
import { event } from '@/.umi/plugin-locale/locale';

// npm install dplayer --save
// npm install hls.js --save

// https://dplayer.diygod.dev/zh/guide.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B
export default function Dplayer() {
    const ref = useRef<HTMLDivElement>()

    useEffect(() => {
        if (!ref?.current) return
        const dp = new DPlayer({
            container: ref?.current,
            autoplay: false,
            lang: 'zh-cn',
            screenshot: true,
            preload: 'none',
            volume: 0,
            hotkey: true,
            video: {
                pic: 'https://img2.baidu.com/it/u=1814561676,2470063876&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500',
                // url: '',
                url: 'http://222.86.87.5:9997/hls/live/cameraid/1000006%240/substream/1.m3u8',
                type: 'customHls',
                customType: {
                    customHls: function (video: HTMLMediaElement, player: any) {
                        const hls = new Hls();
                        hls.loadSource(video.src);
                        hls.attachMedia(video);
                    },
                },
            },
            highlight: [
                {
                    time: 2,
                    text: '这是第 2 秒',
                },
                {
                    time: 120,
                    text: '这是 2 分钟',
                },
            ],
            danmaku: {
                id: '9E2E3368B56CDBB4',
                api: 'https://api.prprpr.me/dplayer/',
                token: 'tokendemo',
                maximum: '1000',
                addition: ['https://api.prprpr.me/dplayer/v3/bilibili?aid=4157142'],
                user: 'DIYgod',
                bottom: '15%',
                unlimited: true,
                // speedRate: 0.5,
            },
            contextmenu: [
                // {
                //     text: 'custom1',
                //     link: 'https://github.com/DIYgod/DPlayer',
                // },
                // {
                //     text: 'custom2',
                //     click: () => {
                //         console.log(event);
                //         return
                //     },
                // },
            ],
        })

        // api
        // dp.play() \ pause() \ toggle() \ dp.video (原生video 可以获取相关熟悉)

        // 事件绑定
        dp.on("canplay" as DPlayerEvents, () => {
            console.log(event)
        })

        setTimeout(() => {
            console.log(dp.danmaku)
            dp.danmaku?.send({
                text: 'zz test!!',
                color: '#b7daff',
                type: 'top'
            }, function () {
                console.log('send')
            })

            dp.danmaku?.draw({
                text: 'zz test',
                color: 'red',
                type: 'top'
            })
        }, 2000);

        return () => {
            dp?.destroy()
        }
    }, [])
    return <div>
        <h1>dplayer</h1>
        {/* @ts-ignore */}
        <div ref={ref} style={{ width: '500px', height: '500px' }} />
    </div>
}