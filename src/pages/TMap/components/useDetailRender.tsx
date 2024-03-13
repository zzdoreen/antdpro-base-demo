/* eslint-disable @typescript-eslint/no-shadow */
import { Descriptions } from "antd"
import { heatMapDotGenerator } from "./utils"
import cs from 'color-string';
import type { DisasterInfoEntity, FloodInfo, IntensityInfoEntity } from "@/services/entities";
import { TDOMControl } from "@/pages/Map/components/utils";

function calcRGB(a: string, b?: string, opacity?: number): string {
    const background = 'rgb(245,243,240)';
    const aa = cs.get(a)!.value;
    const bb = cs.get(b || background)!.value;
    const [R1, G1, B1, A1] = aa;
    const [R2, G2, B2] = bb;
    const factor = 1 - (opacity || A1);
    const R = R1 - (R1 - R2) * factor;
    const G = G1 - (G1 - G2) * factor;
    const B = B1 - (B1 - B2) * factor;
    const A = 1;
    return cs.to.rgb([R, G, B, A]);
}

export const intensityMapRender = (map: T.Map, intensity: IntensityInfoEntity) => {
    const { latitude, longitude, irregulars = [], thresholdIntensity = 0, thermodyNamic = '[]' } = intensity
    const effectiveIrregulars = irregulars.filter(({ intensity }) => intensity >= thresholdIntensity)
    const overlays: T.Overlay[] = []
    const mapvLayers: T.Layer[] = []
    // 震中marker
    const centerPoint = new T.LngLat(longitude, latitude)
    // 获取烈度最小的点位，设置地图自适应
    const minIntensity = effectiveIrregulars[effectiveIrregulars.length - 1].intensity
    let pts: T.LngLat[] = []
    effectiveIrregulars.forEach(({ intensity, points }) => {
        if (intensity === minIntensity)
            pts = pts.concat(points.map(({ longitude, latitude }) => new T.LngLat(longitude, latitude)))
    })
    // 调整地图缩放
    const epicenterMarker = new T.Circle(centerPoint, 1460, {
        color: 'black',
        weight: 1,
        opacity: 0.6,
        fillColor: '#ff0',
        enableMassClear: false,
    });
    overlays.push(epicenterMarker);
    // 烈度圈:从外向里作图，避免颜色覆盖与图例产生色差
    [...effectiveIrregulars].reverse().forEach(({ color, points, intensity }) => {
        const polygon = new T.Polygon(points.map(({ longitude, latitude }) => new T.LngLat(longitude, latitude)),
            {
                color: 'blue',
                weight: 1,
                opacity: 0.2,
                fillColor: color,
                fillOpacity: .2
            })
        overlays.push(polygon)
        // if (intensityType === IntensityType.HEATMAP) {
        const { longitude, latitude } = points[Math.floor(points.length / 2)];
        const label = new T.Label({
            text: `${intensity}度区`,
            position: new T.LngLat(longitude, latitude),
            offset: new T.Point(0, 0),
        });
        overlays.push(label)
        // }
    })
    // 热力图
    // if (intensityType === IntensityType.HEATMAP) {
    //     const heatMapOverlay = heatMapGenerator(view, JSON.parse(thermodyNamic))
    //     mapvLayers.push(heatMapOverlay)
    // } else if (intensityType === IntensityType.HEATMAP_DOT) {
    const heatMapOverlay = heatMapDotGenerator(map, JSON.parse(thermodyNamic))
    mapvLayers.push(heatMapOverlay)
    // }
    const controls: BMapGL.Control[] = []

    // 数据返回的irregulars可能会裁剪为矩形：比如，四个角上的5度区，后端返回的是四个5度区数据，图例上需要去重
    const simplifiedIrregulars = effectiveIrregulars.reduce((prev, cur) => {
        if (prev.every(e => e.intensity !== cur.intensity))
            prev.push({
                intensity: cur.intensity,
                color: cur.color
            })
        return prev
    }, [] as { intensity: number, color: string }[])
    // 图例
    const colors = [...simplifiedIrregulars].reverse().reduce((m: string[], { color }) => {
        const targetColor = calcRGB(color, m[m.length - 1], 0.2);
        m.push(targetColor);
        return m;
    }, []).reverse()
    const legend = new TDOMControl(<div className="static-legend intensity-legend" style={{ width: 128 }}>
        <Descriptions title={<div className="legend-title">图例</div>}
            colon={false} className="legend-info" column={1}>
            {simplifiedIrregulars.map(({ intensity, color }, index) => (
                <Descriptions.Item key={intensity}
                    label={<div className="legend-block" style={{
                        backgroundColor: colors[index],
                        height: 12,
                        top: 5
                    }} />}
                >
                    {`${intensity}度区`}
                </Descriptions.Item>
            ))}
            <Descriptions.Item label={<div className="legend-defects" />}>断裂带</Descriptions.Item>
            <Descriptions.Item label={<div className="legend-epicenter" />} >震中</Descriptions.Item>
        </Descriptions>
    </div>, {});

    controls.push([legend, {
        position: T_ANCHOR_BOTTOM_LEFT,
        offset: new T.Point(16, 60)
    }])

    overlays.forEach(overlay => overlay.isVisible?.() || map.addOverLay(overlay))
    controls.forEach(([control, { position, offset }]) => {
        map.addControl(control);
        control.setOffset(offset)
        control.setPosition(position)
    })

    return {
        points: pts,
        cleaner: () => {
            overlays.forEach(overlay => map.removeOverLay(overlay))
            controls.forEach(([control, config]) => map.removeControl(control))
            mapvLayers.forEach(a => map.removeControl(a))
        }
    }
}


export const flashfloodMapRender = (map: BMapGL.Map, detail: DisasterInfoEntity<FloodInfo>) => {
    const { flashflood: { boundary, stream } } = detail
    const overlays: T.Overlay[] = []
    // 震中marker
    const centerPoint = new T.LngLat(detail?.longitude, detail?.latitude) //getBaiduPoint(detail)
    // 调整地图缩放与中心
    const floodAreaPoints = boundary.split(',').map(lnglat => {
        const [longitude, latitude] = lnglat.split(' ').map(e => Number(e))
        return new T.LngLat(longitude, latitude) // getBaiduPoint({ longitude, latitude, eventType: EventType.FLASHFLOOD })
    })
    // 集水面作图
    const polygon = new T.Polygon(floodAreaPoints, {
        color: 'rgb(22,137,239)',
        weight: 1,
        opacity: 0.7,
        fillColor: 'rgb(22,137,239)', // IntensityColors[intensity - 1],
        fillOpacity: 0.7,
        // enableMassClear: false,
    })
    overlays.push(polygon)
    const controls: T.Control[] = []
    // 汇水路径作图
    const polyline = new T.Polyline(
        stream.split(',').map(lnglat => {
            const [longitude, latitude] = lnglat.split(' ').map(e => Number(e))
            return new T.LngLat(longitude, latitude) // getBaiduPoint({ longitude, latitude, eventType: EventType.FLASHFLOOD })
        }), {
        color: '#FFF04D',
        weight: 2,
        opacity: 1,
        // enableMassClear: false,
    })
    overlays.push(polyline)
    const epicenterMarker = new T.Circle(centerPoint, 60, {
        color: 'black',
        weight: 1,
        opacity: 1,
        fillColor: '#FF6609',
        fillOpacity: 1,
        // enableMassClear: false,
    });
    overlays.push(epicenterMarker);
    // 设置中心点像素大小固定
    const listener = () => {
        epicenterMarker.setRadius(Math.pow(2, 18 - map.getZoom()) * 5)
        console.log(Math.pow(2, 18 - map.getZoom()) * 5, map.getZoom())
    }
    // listener()
    // map.addEventListener('zoomend', listener)

    // 图例
    const legend = new TDOMControl(<div className="static-legend flashflood" style={{ width: 128 }}>
        <div className="intensity-legend">
            <div className="legend-title">图例</div>
            <Descriptions colon={false} className="legend-info" column={1}>
                <Descriptions.Item label={<div className="legend-block" style={{ backgroundColor: 'rgba(22,137,239,.7)', height: 12 }} />}>集水面</Descriptions.Item>
                <Descriptions.Item label={<div className="legend-defects" />}>汇水路径</Descriptions.Item>
                <Descriptions.Item label={<div className="legend-epicenter" />} >倾泻点</Descriptions.Item>
            </Descriptions>
        </div>
    </div>, {});

    controls.push([legend, {
        position: T_ANCHOR_BOTTOM_LEFT,
        offset: new T.Point(16, 0)
    }])
    overlays.forEach(overlay => map.addOverLay(overlay))
    controls.forEach(([control, { position, offset }]) => {
        map.addControl(control)
        control.setPosition(position)
        control.setOffset(offset)
    })
    return {
        points: floodAreaPoints,
        cleaner: () => {
            // map.removeEventListener('zoomend', listener)
            overlays.forEach(overlay => map.removeOverLay(overlay))
            controls.forEach(([control, config]) => map.removeControl(control))
        }
    }
}
