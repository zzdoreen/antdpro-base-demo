import { useDebounceEffect } from "ahooks";
import { message } from "antd";
import { useModel } from "umi";
import { info } from './configuration'
import { DOMControl } from "./utils";
import { HeatMapLegend, LegendClassName } from "./legend";

export function useDetailRender({ map, }: any) {
    const { mapState, marginsRef, setMapState } = useModel('bmap', ({ mapState, marginsRef, setMapState }) => ({ setMapState, mapState, marginsRef }))

    // useHeatMapLib()

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
                anchor: BMAP_ANCHOR_BOTTOM_LEFT,
                offset: new BMapGL.Size(left + 16, bottom + 60),
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
        size: 40, // 单个点绘制大小
        max: max / 2, // 最大阈值
        height: 0, // 最大高度，默认为0
        unit: 'px', // 单位，m:米，px: 像素
        gradient: { // 对应比例渐变色
            0: 'rgb(0,0,0)',
            0.15: 'rgb(0,0,125)',
            0.45: 'rgb(0,0,255)',
            0.55: 'rgb(0,255,255)',
            0.65: 'rgb(0,255,0)',
            0.95: 'yellow',
            1: 'rgb(255,0,0)',
        }
    });

    view.addLayer(heatmapOverlay);
    heatmapOverlay.setData(d)

    return heatmapOverlay;
}
