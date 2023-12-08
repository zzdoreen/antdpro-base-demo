import { useEffect, useRef, useState } from "react";
import './index.less'
import { useReactive } from "ahooks";

export default function Player() {
    const points = useReactive<{ list: [number, number][], path: string }>({ list: [], path: '' })
    const [markerFlag, setMarkerFlag] = useState<boolean>(false)
    const markerOverlay = useRef<HTMLDivElement>(null)
    const pathOverlayer = useRef<SVGPathElement>(null)
    const svgOverlay = useRef<SVGElement>(null)

    const getVideoImg = () => {
        const video: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement
        return new Promise(function (resolve, reject) {
            let dataURL = '';
            const canvas = document.createElement("canvas"),
                width = video?.width, //canvas的尺寸和图片一样
                height = video?.height;
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(video, 0, 0, width, height); //绘制canvas
            setTimeout(function () {
                dataURL = canvas.toDataURL('image/jpeg'); //转换为base64
                console.log(dataURL);
                (document.getElementById('testImg') as HTMLImageElement).src = dataURL
                resolve(dataURL);
            }, 0);
        })
    }

    const getPath = (p?: [number, number][]) => {
        let pointList: [number, number][] = []
        if (p) pointList = p
        else pointList = points.list

        if (pointList.length < 1) return ''
        return pointList.map((point, index) => {
            if (!point) return ''
            if (index === 0) return `M ${point[0]} ${point[1]}`;
            if (index === 1) return `L ${point[0]} ${point[1]}`;
            if (index === pointList.length - 1) return `${point[0]} ${point[1]} Z`;
            return `${point[0]} ${point[1]}`
        }).join(',')
    }

    const handleOverlayPoints = (e) => {
        points.list.push([e.layerX, e.layerY])
        points.path = getPath()
    }
    const handleMouseMoveFn = (e) => { points.path = getPath([...points.list, [e.layerX, e.layerY]]) }

    const handlePathOverlayPoints = (e) => {
        points.list.push([e.offsetX, e.offsetY])
        points.path = getPath()
    }
    const handleMouseOutFn = () => { points.path = getPath() }

    useEffect(() => {
        if (!markerOverlay.current) return
        markerOverlay.current?.addEventListener('click', handleOverlayPoints)
        markerOverlay.current?.addEventListener('mousemove', handleMouseMoveFn)
        pathOverlayer.current?.addEventListener('click', handlePathOverlayPoints)
        svgOverlay.current?.addEventListener('mouseleave', handleMouseOutFn)

        return () => {
            markerOverlay.current?.removeEventListener('click', handleOverlayPoints)
            markerOverlay.current?.removeEventListener('mousemove', handleMouseMoveFn)
            pathOverlayer.current?.removeEventListener('click', handlePathOverlayPoints)
            svgOverlay.current?.removeEventListener('mouseleave', handleMouseOutFn)
        }
    }, [])

    return <div>
        <button onClick={getVideoImg}>截图</button>
        <button onClick={() => setMarkerFlag(true)}>标记点</button>
        <button onClick={() => {
            console.log(points.list)
            setMarkerFlag(false);
            points.list = []; points.path = ''
        }}>提交</button>
        <br />
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" ref={svgOverlay}>
            <foreignObject x="0" y="0" width="500" height="300">
                <div ref={markerOverlay} className="video-marker-cover" style={{ width: '500px', height: '300px', display: markerFlag ? 'block' : 'none' }} />
                <video autoPlay muted src="/antdpro-base-demo/public/video/big_buck_bunny.mp4" width={500} height={300} id="video" controls />
            </foreignObject>
            <path ref={pathOverlayer} fill="none" stroke="red" d={points.path} />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="300">
            <foreignObject x="0" y="0" width="500" height="300">
                <div>
                    <img src="" width="500" height="300" id="testImg" alt="" />
                </div>
            </foreignObject>
            <path fill="none" stroke="red" d={points.path} />
        </svg>
    </div>
}