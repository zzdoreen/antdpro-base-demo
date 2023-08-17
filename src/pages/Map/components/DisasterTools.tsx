import { EventType } from "@/config/dictions"
import { useEffect, useMemo, useState } from "react"
import { flashfloodInfo, intensityInfo, info as otherInfo } from "./configuration"
import { intensityMapRender, flashfloodMapRender } from './useDetailRender'
import { useModel } from 'umi'

export default function DisasterTools({ map }: { map: BMapGL.Map }) {
    const [disasterType, setDisasterType] = useState<EventType | undefined>(undefined)
    const { mapViewPointFuncRef, centerAndZoomMap } = useModel('bmap', ({ mapViewPointFuncRef, centerAndZoomMap }) => ({ mapViewPointFuncRef, centerAndZoomMap }))

    const info = useMemo(() => {
        switch (disasterType) {
            case EventType.INTENSITY: return intensityInfo;
            case EventType.FLASHFLOOD: return flashfloodInfo;
            default: return otherInfo
        }
    }, [disasterType])

    useEffect(() => {
        if (!map || !disasterType || !info) return

        let baseResult = {}

        const cPt = new BMapGL.Point(info?.longitude, info?.latitude),
            boundsPts: BMapGL.Point[] = [];

        if (disasterType === EventType.INTENSITY)
            baseResult = intensityMapRender(map, info)
        else if (disasterType === EventType.FLASHFLOOD)
            baseResult = flashfloodMapRender(map, info)
        else {
            const marker = new BMapGL.Marker(cPt)
            marker.setZIndex(9)
            map.addOverlay(marker)
            baseResult.points = [cPt]
            baseResult.cleaner = () => map.removeOverlay(marker)
        }

        if (baseResult.points)
            boundsPts.push(...baseResult.points)

        if (boundsPts.length > 1)//有多个点，自适应
            mapViewPointFuncRef.current = (margins: any) => map.setViewport(boundsPts, { margins })
        else //一个点，zoomFactor-2到17级
            mapViewPointFuncRef.current = (margins: any) => map.setViewport(boundsPts, { margins, zoomFactor: -2 })
        centerAndZoomMap()


        return () => {
            baseResult.cleaner?.()
            mapViewPointFuncRef.current = undefined
        }
    }, [disasterType, info, map])

    return <div className="disaster-tools">
        <div className="item" onClick={() => { setDisasterType(undefined); centerAndZoomMap() }}>清空</div>
        <div className="item" onClick={() => setDisasterType(EventType.INTENSITY)}>烈度速报</div>
        <div className="item" onClick={() => setDisasterType(EventType.FLASHFLOOD)}>山洪</div>
        <div className="item" onClick={() => setDisasterType(EventType.FIRE)}>其他</div>
    </div>
}