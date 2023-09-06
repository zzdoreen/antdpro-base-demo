import { HeatMapLegend, LegendClassName } from "@/pages/Map/components/legend";
import { TDOMControl } from "@/pages/Map/components/utils";
import { useDebounceEffect } from "ahooks";
import { message } from "antd";
import { useModel } from "umi";
import { info } from '../../Map/components/configuration'
import { heatMapGenerator } from "./utils";

export function useDetailRender({ map }: { map: any }) {
    const { mapState, setMapState } = useModel('tmap', ({ mapState, setMapState }) => ({ setMapState, mapState, }))

    // 热力图
    useDebounceEffect(() => {
        // info.heatmap会先清空再存值 需要防抖
        if (!map || !mapState.heatmap) return
        const heatmap = JSON.parse(info.heatmap || "[]") as Record<'lng' | 'lat' | 'count', number>[]
        if (heatmap.length === 0) {
            message.info('暂无人口热力数据！')
            setMapState(({ heatmap }) => ({ heatmap: !heatmap }));
            return
        }

        const heatMapOverlay = heatMapGenerator(map, heatmap)

        const legend = new TDOMControl(
            <div className="static-legend" style={{ width: 128 }}>
                <HeatMapLegend />
            </div>,
            {
                className: LegendClassName
            }
        );

        map.addControl(legend)
        legend.setPosition(T_ANCHOR_BOTTOM_LEFT)
        legend.setOffset(new T.Point(16, 16))

        map.addOverLay(heatMapOverlay)
        return () => {
            map.removeOverLay(heatMapOverlay)
            map.removeControl(legend)
        }
    }, [map, mapState.heatmap, info.heatmap], { wait: 500 });

}
