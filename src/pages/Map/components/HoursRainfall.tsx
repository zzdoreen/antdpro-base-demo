import type { RainDataEntity } from "@/services/entities"
import { useReactive } from "ahooks"
import { Descriptions, Slider } from "antd"
import { useEffect, useState } from "react";
import { DOMControl } from "./utils";
import classNames from "classnames";
import legendStyles from './legend.less'
import { getHoursRainfallService } from "@/services/api";
import { Access, useModel } from "umi"
import { PauseOutlined } from "@ant-design/icons";
import moment from "moment";
import { useAsyncEffect } from "@/utils/tools";
import { LayerZIndex } from "@/models/bmap";

export function useMinuteRainManager({ map }: { map: BMapGL.Map | undefined }) {
    const [loading, setloading] = useState(false);
    const { margins } = useModel('bmap', ({ margins }) => ({ margins }))
    const state = useReactive({
        index: 0,
        list: [] as RainDataEntity[],
        playing: false
    })
    // 初始化预测降雨数据
    useAsyncEffect((isValid) => {
        setloading(true)
        getHoursRainfallService().then(({ code, data }) => {
            if (isValid()) {
                state.index = 0
                if (code === 0) {
                    // @ts-ignore
                    state.list = data
                } else
                    state.list = []
            }
        }).finally(() => setloading(false))
    }, []);

    // 添加图例
    useEffect(() => {
        if (!map) return
        const legend = new DOMControl(<MinuteRainLegend />, {
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            offset: new BMapGL.Size(10 + margins.left, 50 + margins.bottom),
            border: true,
            className: classNames(legendStyles['rain-legend'], legendStyles.fullscreen)
        })
        map.addControl(legend)
        return () => map.removeOverlay(legend)
    }, [map]);

    //渲染降水图
    useEffect(() => {
        const data = state.list[state.index]
        if (!map || !data) {
            state.playing = false
            const imgOverlay = map?.getOverlays().find(m => m instanceof BMapGL.GroundOverlay) as BMapGL.GroundOverlay | undefined
            return () => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                imgOverlay && map?.removeOverlay(imgOverlay)
            }
        }

        return RainPictureRender(data, map)
        // return RainPictureRender(data, map, state.index === 0)
    }, [map, state.index, state.list]);

    // 添加播放按钮
    useEffect(() => {
        if (!map || !state.list.length) return
        const data = state.list[state.index]
        const legend = new DOMControl(
            <div className="container">
                <div className="play-btn" onClick={() => state.playing = !state.playing}>
                    <Access accessible={state.playing} fallback={<span className="anticon anticon-play" />} >
                        <PauseOutlined />
                    </Access>
                </div>
                <Slider value={state.index} min={0} max={state.list.length - 1} onAfterChange={i => state.index = i}
                    tooltipVisible={false}
                />
                <span className="time">{moment.unix(data.timestamp).format('MM-DD HH:mm')}</span>
            </div>, {
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            offset: new BMapGL.Size(10 + margins.left, 250 + margins.top),
            border: true,
            className: legendStyles['minute-rain-play-ctrl']
        })
        map.addControl(legend)
        return () => map.removeOverlay(legend)
    }, [map, state.list, state.index, state.playing, margins.left, margins.top]);

    // 自动播放
    useEffect(() => {
        if (!state.playing) return
        if (state.index >= state.list.length - 1) state.index = 0
        const interval = window.setInterval(() => {
            if (state.index >= state.list.length - 1) {
                clearInterval(interval)
                state.playing = false
                //播放完成后去后台拉取最新的数据
                // updateRain(4)
                return
            }
            state.index++
        }, 700)
        return () => window.clearInterval(interval)
    }, [state.playing, state.list]);

    // useEffect(() => {
    //     if (!visible) {
    //         state.index = 0
    //         state.list = []
    //     }
    // }, [visible]);
    return { loading }
}

const MinuteRainLegend: React.FC<{ hour?: number, zeroBgColor?: string }> = ({ hour = 0, zeroBgColor = minuteRainConfig.zeroBgColor }) => {
    const texts = hour < 24 ? minuteRainConfig.legendTexts : minuteRainConfig.legendTextsGTE24
    const color = hour < 24 ? minuteRainConfig.colors : minuteRainConfig.colorsGTE24
    return <div className="level-legend">
        <div className="legend-title">
            <div>降水图例</div>
            <div>(mm/h)</div>
        </div>
        <Descriptions colon={false} className="legend-info reverse-items" column={1}>
            {texts.map((text, index) => (
                <Descriptions.Item key={text}
                    label={<div className="legend-block" style={{ backgroundColor: color[index] }} />}
                >
                    {text}
                </Descriptions.Item>
            ))}
            <Descriptions.Item
                label={<div className="legend-block" style={{ border: `1px solid ${zeroBgColor}` }} />}
            >
                无降水
            </Descriptions.Item>
        </Descriptions>
    </div>
}

function getBounds(lngs: [number, number], lats: [number, number]) {
    return new BMapGL.Bounds(new BMapGL.Point(lngs[0], lats[0]), new BMapGL.Point(lngs[1], lats[1]))
}
/**
 * 降水动图渲染
 * @param data 
 * @param map 
 * @param hide 
 * @returns 
 */
// function RainPictureRender(data: RainDataEntity, map: BMapGL.Map, hide?: boolean) {
//     const { lngs, lats, url } = data
//     const bounds = getBounds(lngs, lats)
//     const k = map.getOverlays().find(m => m instanceof BMapGL.GroundOverlay) as BMapGL.GroundOverlay | undefined
//     if (k) {
//         if (url) {
//             // 不知道为什么页面不生效
//             k?.setOptions({
//                 type: 'image', opacity: 1,
//                 // texture: url,
//                 url: url,
//             })
//             k.draw?.()
//             k.show?.()
//         } else if (hide) {
//             k.hide?.()
//             map.removeOverlay(k)
//         }
//     } else {
//         const bgOverlay = new BMapGL.GroundOverlay(bounds, { type: 'image', opacity: 1, url })
//         map.addOverlay(bgOverlay)
//     }
//     return
// }
function RainPictureRender(data: RainDataEntity, map: BMapGL.Map, contextMenuRender?: (bgOverlay: BMapGL.GroundOverlay) => Function | undefined) {
    if (!data) return
    const imgOverlay = map?.getOverlays().find(m => m instanceof BMapGL.GroundOverlay) as BMapGL.GroundOverlay | undefined
    if (imgOverlay) map.removeOverlay(imgOverlay)

    const { lngs, lats, url } = data
    const bounds = getBounds(lngs, lats)

    const bgOverlay = new BMapGL.GroundOverlay(bounds, {
        // @ts-ignore 参数变了文档又不更新
        type: 'image',
        url,
    })
    map.addOverlay(bgOverlay)
    // @ts-ignore
    const dom = bgOverlay.ca as HTMLElement
    if (dom) dom.style.zIndex = LayerZIndex.RAIN + ''

    const contextMenuCleaner = contextMenuRender?.(bgOverlay)
    return () => {
        contextMenuCleaner?.()
        map.removeOverlay(bgOverlay)
    }
}

const minuteRainConfig = {
    zeroBgColor: '#7d7d7d',
    colors: [
        'rgba(250, 0, 250, 0.55)',
        'rgba(0, 0, 255, 0.55)',
        'rgba(97, 184, 255, 0.55)',
        'rgba(61, 186, 61, 0.55)',
        'rgba(161, 241, 141, 0.55)',
    ],
    colorsGTE24: [
        'rgba(128, 0, 64, 0.55)',
        'rgba(250, 0, 250, 0.55)',
        'rgba(0, 0, 255, 0.55)',
        'rgba(97, 184, 255, 0.55)',
        'rgba(61, 186, 61, 0.55)',
        'rgba(161, 241, 141, 0.55)',
    ],
    legendTexts: [
        '> 100',
        '50~100',
        '25~50',
        '10~25',
        '0~10'
    ],
    legendTextsGTE24: [
        '> 250',
        '100~250',
        '50~100',
        '25~50',
        '10~25',
        '0~10'
    ],
    getColor(value: number, hour = 2) {
        let index = -1
        if (hour >= 24) {
            if (value > 250) {
                index = 0
            } else if (value > 100) {
                index = 1
            } else if (value > 50) {
                index = 2
            } else if (value > 25) {
                index = 3
            } else if (value > 10) {
                index = 4
            } else if (value > 0) {
                index = 5
            }
            return minuteRainConfig.colorsGTE24[index]
        } else {
            if (value > 100) {
                index = 0
            } else if (value > 50) {
                index = 1
            } else if (value > 25) {
                index = 2
            } else if (value > 10) {
                index = 3
            } else if (value > 0) {
                index = 4
            }
            return minuteRainConfig.colors[index]
        }
    },
}