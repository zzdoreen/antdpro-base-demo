/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import type { DisasterEntity, DisasterHistoryEntity, JudgeDisasterEntity, MonitorDeviceEntity, MonitorTargetEntity, PublishEntity, RainPointEntity } from "@/services/entities";
import { useFullscreen, useLatest, useSetState } from "ahooks";
import { useCallback, useEffect, useRef } from "react";
import { useModel } from "umi";

type HazardEntity = {
    id: number,
    type: string
    name: string,
    longitude: number
    latitude: number
    location: string,
    riskLevel: number //易发性分级，1-4对应文字：不易发，低易发，中易发，高易发
}

type infoType<T, E> = {
    type_source: T,
} & E

export enum InfoVisibleType {
    NONE, //不展示
    WINDOW, //展示
    DRAWER
}

type infoWindow = {  //地图信息浮窗
    visible: boolean

    info: infoType<'disaster', DisasterEntity> |
    infoType<'disaster_history', DisasterHistoryEntity> |
    infoType<'rain_point', RainPointEntity> |
    infoType<'monitor', MonitorDeviceEntity> |
    infoType<'target', MonitorTargetEntity> |
    infoType<'judge', JudgeDisasterEntity> |
    infoType<'publish', PublishEntity> |
    infoType<'emergency_disaster', DisasterEntity> |
    infoType<'emergency_judge', JudgeDisasterEntity> |
    infoType<'hazard', HazardEntity> |
    infoType<'earthquake', any>

    x: number
    y: number
}

export type mapState = {
    heatmap: boolean //tools的tooltip状态
    roads: boolean //tool中道路的tooltip状态（公路、铁路）
    lineTo: boolean // 线路
    screenshot: boolean // 截图
}
const initialMapState: mapState = {
    heatmap: false,
    roads: true,
    lineTo: false,
    screenshot: false,
}
/**overlay的层级优先级 */
export enum LayerZIndex {
    RADAR_AREA = -10000002,
    RAIN,
    RADAR_DADIXINYA,
    // 以上是GroundOVerlay
    LABELS = 0,
    // 以上是Label
    HAZARD,
    MONITOR,
    WARNING,
    MARKER_TOOL = 999,
    // 以上是Marker
}
export type MapCenterFunc = (margins?: number[]) => void
export type MarginsType = Record<'top' | 'right' | 'bottom' | 'left', number>

export default function bmap() {
    const [state, setState] = useSetState<infoWindow>({} as any)
    const [isFull, { toggleFullscreen: toggleFull }] = useFullscreen(() => document.body,
        {
            onEnter: () => { centerAndZoomMap(mapViewPointFuncRef); },
            onExit: () => { centerAndZoomMap(mapViewPointFuncRef); }
        })
    const cleanerRef = useRef<Function>()
    const openMapWindow = useCallback((infoWindow: Omit<infoWindow, 'visible'>, map: BMap.Map) => {
        setState({ ...infoWindow, visible: true })
        map.addEventListener('zoomstart', closeMapWindow)
        cleanerRef.current = () => map.removeEventListener('zoomstart', closeMapWindow)
    }, [])

    const closeMapWindow = useCallback((animation = true) => {
        setState({ visible: false })
        if (!animation) afterVisibleChange(false)
        cleanerRef.current?.()
    }, [])
    const afterVisibleChange = useCallback((visible: boolean) => {
        visible || setState({ info: undefined } as any)
    }, [])
    // 筛选行政区域后或灾害详情页，地图设置合适的中心点函数
    const mapViewPointFuncRef = useRef<MapCenterFunc>()
    const mapServiceAreaFuncRef = useRef<MapCenterFunc>() //默认额服务区域边界
    const collapsed = useModel('@@initialState', ({ initialState }) => initialState?.collapsed)
    const collapsedRef = useLatest(collapsed)
    const centerAndZoomMap = useCallback((func?: typeof mapViewPointFuncRef, delay = 500) => {
        setTimeout(() => {
            const { left, right, top, bottom } = marginsRef.current
            let l = left
            if (collapsedRef.current === false) l -= 208
            if (collapsedRef.current === true) l -= 48
            const margins = [top, right, bottom, l]
            if (mapViewPointFuncRef.current) return mapViewPointFuncRef.current(margins)
            else if (func?.current) mapServiceAreaFuncRef.current = func.current
            mapServiceAreaFuncRef.current?.(margins)
        }, delay);
    }, [])


    // 地图悬浮边界
    const [margins, setMargins] = useSetState<MarginsType>({
        top: 80,
        right: 0,
        bottom: 0,
        left: 0,
    });


    const marginsRef = useLatest(margins)

    const [mapState, setMapState] = useSetState(initialMapState);

    const resetMapState = useCallback(() => setMapState(initialMapState), [])

    const mapStyleV2Ref = useRef<BMapGL.MapStyleItem[]>([])

    // 收起折叠侧边二级菜单,适应地图中心
    useEffect(() => {
        if (collapsed !== undefined) centerAndZoomMap(undefined, 500)
    }, [collapsed]);
    // margins变化,适应地图中心
    useEffect(centerAndZoomMap, [margins]);

    return {
        ...state,
        isFull,
        toggleFull,
        openMapWindow,
        closeMapWindow,
        afterVisibleChange,
        mapViewPointFuncRef,
        centerAndZoomMap,
        margins, setMargins, marginsRef,
        mapState, setMapState, resetMapState,
        mapStyleV2Ref
    }
}