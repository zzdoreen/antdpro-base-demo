/* eslint-disable @typescript-eslint/no-for-in-array */
/* eslint-disable @typescript-eslint/no-shadow */
import { useDebounceEffect } from "ahooks";
import { message } from "antd";
import { useModel } from "umi";
import { info } from './configuration'
import { DOMControl } from "./utils";
import { HeatMapLegend, LegendClassName } from "./legend";

export function useDetailRender({ map, }: { map: BMapGL.Map | undefined }) {
    const { mapState, marginsRef, setMapState } = useModel('bmap', ({ mapState, marginsRef, setMapState }) => ({ setMapState, mapState, marginsRef }))

    // 热力图
    useDebounceEffect(() => {
        // info.heatmap会先清空再存值 需要防抖
        if (!map || !mapState.heatmap) return
        const view = new mapvgl.View({ map })
        const heatmap = JSON.parse(info.heatmap || "[]") as Record<'lng' | 'lat' | 'count', number>[]
        if (heatmap.length === 0) {
            message.info('暂无人口热力数据！')
            setMapState(({ heatmap }) => ({ heatmap: !heatmap }));
            return
        }

        const overlay = heatMapGenerator(view, heatmap)
        const { bottom, left } = marginsRef.current
        const legend = new DOMControl(
            <div className="static-legend" style={{ width: 128 }}>
                <HeatMapLegend />
            </div>,
            {
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMapGL.Size(left + 80, bottom + 60),
                className: LegendClassName
            }
        );
        map.addControl(legend)
        return () => {
            view.removeLayer(overlay)
            map.removeControl(legend)
        }
    }, [map, mapState.heatmap, info.heatmap], { wait: 500 });
}


/**
 * 生成热力图
 */
export const heatMapGenerator = (view: MapVGL.View, data: Record<'lng' | 'lat' | 'count', number>[]) => {
    const d = data.map(({ lng, lat, count }) => ({
        geometry: {
            type: 'Point',
            coordinates: [lng, lat],
        },
        properties: {
            count
        }
    }))
    const max = data.reduce((pre, cur) => Math.max(pre, cur.count), 0)
    const heatmapOverlay = new mapvgl.HeatmapLayer({
        size: data.length < 10 ? 40 : 20, // 单个点绘制大小
        max: max / 2, // 最大阈值
        height: 0, // 最大高度，默认为0
        unit: 'px', // 单位，m:米，px: 像素
        defaultMaxOpacity: 0.7,
        defaultMinOpacity: 0.01,
        gradient: { // 对应比例渐变色
            0: 'rgb(0,0,0)',
            0.15: 'rgb(0,0,125)',
            0.45: 'rgb(0,0,255)',
            0.55: 'rgb(0,255,255)',
            0.65: 'rgb(0,255,0)',
            0.95: 'yellow',
            1: 'rgb(255,0,0)',
        },

    });

    view.addLayer(heatmapOverlay);
    heatmapOverlay.setData(d)

    return heatmapOverlay;
}


// export const useMapBoundaryRender(){
//     return
// }


/**
 * 生成热力图(点状)
 */
export const heatMapDotGenerator = (view: MapVGL.View, data: Record<'lng' | 'lat' | 'count', number>[]) => {
    let max = 0;
    let min = 0;
    for (const pt in data) {
        max = Math.max(max, data[pt].count);
        min = Math.min(min, data[pt].count);
    }

    let minLng = Number.MAX_VALUE;
    let minLat = Number.MAX_VALUE;
    let sorts = data.sort((a, b) => a.lng - b.lng);
    sorts.reduce((m, n) => {
        if (n.lng - m.lng > 1e-3) {
            minLng = Math.min(minLng, n.lng - m.lng);
        }
        return n;
    }, sorts[0]);

    sorts = data.sort((a, b) => a.lat - b.lat);
    sorts.reduce((m, n) => {
        if (n.lat - m.lat > 1e-3) {
            minLat = Math.min(minLat, n.lat - m.lat);
        }
        return n;
    }, sorts[0]);
    const points: BMapGL.Point[] = [];
    const ram = Math.max(10, Math.min(100, Math.floor(max / 100)));
    const randoms = Array(ram)
        .fill(0)
        .map(() => Math.random() - 0.5);
    const diff = max - min;
    data.forEach((m, index) => {
        let n = Math.floor((m.count * ram) / diff);
        for (let i = 0; i < n; i++) {
            points.push(
                new BMapGL.Point(
                    randoms[(i * index) % ram] * minLng + m.lng,
                    randoms[((ram - i) * index) % ram] * minLat + m.lat,
                ),
            );
        }
    });

    const pointCollection = new mapvgl.PointLayer(
        {
            color: '#FF825F',
            shape: 'circle',
            size: 2,
            data: points.map(p => ({
                geometry: {
                    type: 'Point',
                    coordinates: [p.lng, p.lat]
                },
            }))
        }
    )
    view.addLayer(pointCollection)
    return pointCollection;
}