import { useEffect, useRef } from 'react'
import type { DPlayerEvents } from 'dplayer';
import DPlayer from 'dplayer'
import Hls from 'hls.js'

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
            video: {
                url: 'http://222.86.87.5:9997/hls/live/cameraid/1000006%240/substream/1.m3u8',
                type: 'customHls',
                customType: {
                    customHls: function (video: HTMLMediaElement, player: any) {
                        const hls = new Hls();
                        hls.loadSource(video.src);
                        hls.attachMedia(video);
                    },
                },
            }
        })

        dp.on("canplay" as DPlayerEvents, () => {
            console.log(event)
        })
        return () => {
            dp?.destroy()
        }
    }, [])
    return <div>
        <h1>dplayer</h1>
        {/* @ts-ignore */}
        <div className="video-js vjs-default-skin vjs-big-play-centered" ref={ref} style={{ width: '500px', height: '500px' }} />
    </div>
}