/* eslint-disable react-hooks/rules-of-hooks */
import { useFullscreen, useSetState } from "ahooks";
import { useCallback, useEffect, useRef } from "react";
import type { MapCenterFunc } from "./bmap";

const initialMapState: {
    heatmap: boolean //tools的tooltip状态
    roads: boolean //tool中道路的tooltip状态（公路、铁路）
    lineTo: boolean // 线路
} = {
    heatmap: false,
    roads: true,
    lineTo: false
}

export default function tmap() {
    const mapViewPointFuncRef = useRef<MapCenterFunc>()
    const mapServiceAreaFuncRef = useRef<MapCenterFunc>() //默认额服务区域边界
    const [mapState, setMapState] = useSetState(initialMapState);

    const centerAndZoomMap = useCallback((func?: typeof mapViewPointFuncRef, delay = 500) => {
        setTimeout(() => {
            if (mapViewPointFuncRef.current) return mapViewPointFuncRef.current()
            else if (func?.current) mapServiceAreaFuncRef.current = func.current
            mapServiceAreaFuncRef.current?.()
        }, delay);
    }, [])

    const [isFull, { toggleFullscreen: toggleFull }] = useFullscreen(() => document.body,
        {
            onEnter: () => { centerAndZoomMap(mapViewPointFuncRef); },
            onExit: () => { centerAndZoomMap(mapViewPointFuncRef); }
        })

    useEffect(centerAndZoomMap, [])

    return {
        // ...state,
        isFull,
        toggleFull,
        // openMapWindow,
        // closeMapWindow,
        // afterVisibleChange,
        mapViewPointFuncRef,
        centerAndZoomMap,
        // margins, setMargins, marginsRef,
        mapState, setMapState,
        // resetMapState,
        // mapStyleV2Ref
    }
}