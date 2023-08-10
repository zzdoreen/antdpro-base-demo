import { useEffect, useRef } from 'react';
import videojs from 'video.js'
import "video.js/dist/video-js.css";
import 'videojs-flvjs-es6'
import './index.less'

const hls = { url: "https://cmgw-vpc.lechange.com:8890/LCO/8H0A08FPAZ3C136/5/1/20230106T020224/d71110c700a2643132223a685565bbfc.m3u8?proto=https", img: 'https://neijiang-test.oss-cn-chengdu.aliyuncs.com/neijiang_warning_wateraccum_snap/8F022C4RANDB420/8F022C4RANDB420_1687844782.jpg' }
const flv = { url: 'ws://test191.chinaeew.cn:5021/live/xd-001.live.flv', img: '/files/screenShoot/1659102220/109d89be-f11c-11ec-aac2-083a8891a376/20220729/1/dsf_786c2ba3-0f43-11ed-b20e-083a8891a376_27030498_27586850.jpg' }

export default function Video() {
    const videoPlayer_flv = useRef(null)
    const videoPlayer_hls = useRef(null)
    useEffect(() => {
        if (!videoPlayer_hls.current || !videoPlayer_flv.current) return

        const hlsVideo = videojs(videoPlayer_hls.current!, {
            controls: true,
            muted: true,
            techOrder: ["html5", "flvjs"],
            preload: 'none',
            sources: [{ src: hls.url, type: "application/x-mpegURL" }]

        })

        const flvVideo = videojs(videoPlayer_flv.current!, {
            controls: true,
            muted: true,
            // techOrder: ["html5", "flvjs"],
            preload: 'none',
            sources: [{ src: flv.url, type: "video/x-flv" }]
        })

        return () => {
            flvVideo?.dispose()
            hlsVideo?.dispose()
        }
    }, [])
    return <div className='video-container'>
        {/* @ts-ignore */}
        <div>
            <h1>flv</h1>
            <video ref={videoPlayer_flv} style={{ width: '500px', height: '500px' }} className="video-js vjs-default-skin vjs-big-play-centered" />

        </div>
        <div>
            <h1>hls</h1>
            <video ref={videoPlayer_hls} style={{ width: '500px', height: '500px' }} className="video-js vjs-default-skin vjs-big-play-centered" />
        </div>

    </div>
}


// 安装 video.js videojs-flvjs-es6 flv.js  支持播放flv协议的实时流   type: "video/x-flv"

// 安装 video.js 支持播放hls协议的实时流 type: "application/x-mpegURL"

// npm install --save video.js flv.js videojs-flvjs-es6
