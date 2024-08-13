import { EventType } from "@/config/dictions"
import { useEffect, useMemo, useState } from "react"
import { flashfloodInfo, intensityInfo, info as otherInfo } from "./configuration"
import { intensityMapRender, flashfloodMapRender, earthquakeMapRender } from './useDetailRender'
import { useModel } from 'umi'
import type { DisasterInfoEntity, FloodInfo, IntensityInfoEntity } from "@/services/entities"

export default function DisasterTools({ map }: { map: BMapGL.Map }) {
    const [disasterType, setDisasterType] = useState<EventType | undefined>()
    const { _mapViewPointFuncRef: mapViewPointFuncRef, _centerAndZoomMap: centerAndZoomMap } = useModel('bmap',
        ({ mapViewPointFuncRef: _mapViewPointFuncRef, centerAndZoomMap: _centerAndZoomMap }) => ({ _mapViewPointFuncRef, _centerAndZoomMap }))

    const info = useMemo(() => {
        switch (disasterType) {
            case EventType.INTENSITY: return intensityInfo;
            case EventType.FLASHFLOOD: return flashfloodInfo;
            default: return otherInfo
        }
    }, [disasterType])

    useEffect(() => {
        if (!map || !disasterType || !info) return

        let baseResult: { points?: BMapGL.Point[], cleaner?: () => void } = {};

        const cPt = new BMapGL.Point(info?.longitude, info?.latitude),
            boundsPts: BMapGL.Point[] = [];

        if (disasterType === EventType.INTENSITY)
            baseResult = intensityMapRender(map, info as unknown as IntensityInfoEntity)
        else if (disasterType === EventType.EARTHQUAKE)
            baseResult = earthquakeMapRender(map)
        else if (disasterType === EventType.FLASHFLOOD)
            baseResult = flashfloodMapRender(map, info as unknown as DisasterInfoEntity<FloodInfo>)
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
        <div className="item" onClick={() => setDisasterType(EventType.EARTHQUAKE)}>地震</div>
        <div className="item" onClick={() => setDisasterType(EventType.FLASHFLOOD)}>山洪</div>
        <div className="item" onClick={() => setDisasterType(EventType.FIRE)}>其他</div>
    </div>
}