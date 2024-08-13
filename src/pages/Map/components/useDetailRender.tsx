/* eslint-disable @typescript-eslint/no-shadow */
import { Descriptions } from "antd"
import { heatMapDotGenerator } from "./hooks"
import { DOMControl } from "./utils"
import cs from 'color-string';
import type { DisasterInfoEntity, FloodInfo, IntensityInfoEntity } from "@/services/entities";
import moment from "moment";

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
interface EarthquakeInfoEntity {
    eventId: number,
    updates: number,
    epicenter: string,
    startAt: number,
    updateAt: number,
    longitude: number,
    latitude: number,
    magnitude: number,
    depth: number,
    distance: number,
    countdown: number,
    intensity: number,
    recTime: number,
    stations: number,
    insideNet: number,
    notice: number
}

export const earthquakeMapRender = (map: BMapGL.Map) => {
    const now = moment().unix()
    const detail: EarthquakeInfoEntity = {
        "eventId": 51130,
        "updates": 1,
        "epicenter": "四川汶川多报（测试）",
        "startAt": now - 4000,
        "updateAt": now + 2000,
        "longitude": 103.4,
        "latitude": 31,
        "magnitude": 5.2,
        "depth": 15,
        "distance": 82,
        "countdown": 18,
        "intensity": 3.3225582,
        "recTime": 1669791248259,
        "stations": 3,
        "insideNet": 1,
        notice: 2,
    }
    const { distance, longitude, latitude, } = detail
    const interval = 50
    let radius = 1
    const centerPoint = new BMapGL.Point(longitude, latitude)
    // 震中
    const size = 18
    const centerLabel = new BMapGL.Label(``, {
        offset: new BMapGL.Size(-size / 2, -size / 2),
        position: centerPoint,
    })
    centerLabel.setStyle({
        border: 'none',
        padding: 0,
        backgroundColor: 'red',
        display: 'inline-block',
        height: size + 'px',
        width: size + 'px',
        borderRadius: '50%',
    })

    // 预警圈
    const circle = new BMapGL.Circle(centerPoint, radius, {
        fillColor: '#00f',
        fillOpacity: .1,
        strokeColor: '#f00',
        strokeOpacity: .9,
        strokeWeight: 2,
    })
    const timer_circle = setInterval(() => {
        radius += 3.5 * interval / 1000
        if (radius >= distance) {
            radius = distance
            clearInterval(timer_circle)
        }
        circle.setRadius(radius * 1000)
    }, interval);

    const centerArray = [circle, centerLabel]
    centerArray.forEach(o => map.addOverlay(o))

    return {
        // TODO
        points: [new BMapGL.Point(102.56, 31.18), new BMapGL.Point(104.26, 30.99),
        new BMapGL.Point(103.4, 30.24), new BMapGL.Point(103.39, 31.73)],
        cleaner: () => {
            centerArray.forEach(v => map.removeOverlay(v))
            clearInterval(timer_circle)
        }
    }

}

export const intensityMapRender = (map: BMapGL.Map, intensity: IntensityInfoEntity): { points: BMapGL.Point[], cleaner: () => void } => {
    const { latitude, longitude, irregulars = [], thresholdIntensity = 0, thermodyNamic = '[]' } = intensity
    const effectiveIrregulars = irregulars.filter(({ intensity }) => intensity >= thresholdIntensity)
    const overlays: BMapGL.Overlay[] = []
    const mapvLayers: MapVGL.Layer[] = []
    // 震中marker
    const centerPoint = new BMapGL.Point(longitude, latitude)
    // 获取烈度最小的点位，设置地图自适应
    const minIntensity = effectiveIrregulars[effectiveIrregulars.length - 1].intensity
    let pts: BMapGL.Point[] = []
    effectiveIrregulars.forEach(({ intensity, points }) => {
        if (intensity === minIntensity)
            pts = pts.concat(points.map(({ longitude, latitude }) => new BMapGL.Point(longitude, latitude)))
    })
    // 调整地图缩放
    const epicenterMarker = new BMapGL.Circle(centerPoint, 1460, {
        strokeColor: 'black',
        strokeWeight: 1,
        strokeOpacity: 0.6,
        fillColor: '#ff0',
        enableMassClear: false,
    });
    overlays.push(epicenterMarker);
    // 烈度圈:从外向里作图，避免颜色覆盖与图例产生色差
    [...effectiveIrregulars].reverse().forEach(({ color, points, intensity }) => {
        const polygon = new BMapGL.Polygon(points.map(({ longitude, latitude }) => new BMapGL.Point(longitude, latitude)),
            {
                strokeColor: 'blue',
                strokeWeight: 1,
                strokeOpacity: 0.2,
                fillColor: color, // IntensityColors[intensity - 1],
                // fillOpacity: 0.2,
                enableMassClear: false,
                fillOpacity: .2
            })
        overlays.push(polygon)
        // if (intensityType === IntensityType.HEATMAP) {
        const { longitude, latitude } = points[Math.floor(points.length / 2)];
        const label = new BMapGL.Label(`${intensity}度区`, {
            position: new BMapGL.Point(longitude, latitude),
            offset: new BMapGL.Size(0, 0),
            enableMassClear: false,
        });
        overlays.push(label)
        // }
    })
    // 热力图
    const view = new mapvgl.View({ map })
    // if (intensityType === IntensityType.HEATMAP) {
    //     const heatMapOverlay = heatMapGenerator(view, JSON.parse(thermodyNamic))
    //     mapvLayers.push(heatMapOverlay)
    // } else if (intensityType === IntensityType.HEATMAP_DOT) {
    const heatMapOverlay = heatMapDotGenerator(view, JSON.parse(thermodyNamic))
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
    const legend = new DOMControl(<div className="static-legend intensity-legend" style={{ width: 128 }}>
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
    </div>, {
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        offset: new BMapGL.Size(136, 60)
    });
    controls.push(legend)

    overlays.forEach(overlay => overlay.isVisible?.() || map.addOverlay(overlay))
    controls.forEach(control => map.addControl(control))

    return {
        points: pts,
        cleaner: () => {
            overlays.forEach(overlay => map.removeOverlay(overlay))
            controls.forEach(control => map.removeControl(control))
            mapvLayers.forEach(a => view.removeLayer(a))
        }
    }
}


export const flashfloodMapRender = (map: BMapGL.Map, detail: DisasterInfoEntity<FloodInfo>) => {
    const { flashflood: { boundary, stream } } = detail
    const overlays: BMapGL.Overlay[] = []
    // 震中marker
    const centerPoint = new BMapGL.Point(detail?.longitude, detail?.latitude) //getBaiduPoint(detail)
    // 调整地图缩放与中心
    const floodAreaPoints = boundary.split(',').map(lnglat => {
        const [longitude, latitude] = lnglat.split(' ').map(e => Number(e))
        return new BMapGL.Point(longitude, latitude) // getBaiduPoint({ longitude, latitude, eventType: EventType.FLASHFLOOD })
    })
    // 集水面作图
    const polygon = new BMapGL.Polygon(floodAreaPoints, {
        strokeColor: 'rgb(22,137,239)',
        strokeWeight: 1,
        strokeOpacity: 0.7,
        fillColor: 'rgb(22,137,239)', // IntensityColors[intensity - 1],
        fillOpacity: 0.7,
        enableMassClear: false,
    })
    overlays.push(polygon)
    const controls: BMapGL.Control[] = []
    // 汇水路径作图
    const polyline = new BMapGL.Polyline(
        stream.split(',').map(lnglat => {
            const [longitude, latitude] = lnglat.split(' ').map(e => Number(e))
            return new BMapGL.Point(longitude, latitude) // getBaiduPoint({ longitude, latitude, eventType: EventType.FLASHFLOOD })
        }), {
        strokeColor: '#FFF04D',
        strokeWeight: 2,
        strokeOpacity: 1,
        enableMassClear: false,
    })
    overlays.push(polyline)
    const epicenterMarker = new BMapGL.Circle(centerPoint, 60, {
        strokeColor: 'black',
        strokeWeight: 1,
        strokeOpacity: 1,
        fillColor: '#FF6609',
        fillOpacity: 1,
        enableMassClear: false,
    });
    overlays.push(epicenterMarker);

    // 设置中心点像素大小固定
    const listener = () => setTimeout(() => epicenterMarker.setRadius(Math.pow(2, 18 - map?.getZoom()) * 5), 500);

    map.addEventListener('zoomend', listener)
    // 图例
    const legend = new DOMControl(<div className="static-legend flashflood" style={{ width: 128 }}>
        <div className="intensity-legend">
            <div className="legend-title">图例</div>
            <Descriptions colon={false} className="legend-info" column={1}>
                <Descriptions.Item
                    label={<div className="legend-block" style={{ backgroundColor: 'rgba(22,137,239,.7)', height: 12 }} />}
                >
                    集水面
                </Descriptions.Item>
                <Descriptions.Item label={<div className="legend-defects" />}>汇水路径</Descriptions.Item>
                <Descriptions.Item label={<div className="legend-epicenter" />} >倾泻点</Descriptions.Item>
            </Descriptions>
        </div>
    </div>, {
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
        offset: new BMapGL.Size(136, 60)
        // className: styles.legend
    });
    controls.push(legend)
    overlays.forEach(overlay => map.addOverlay(overlay))
    controls.forEach(control => map.addControl(control))
    return {
        points: floodAreaPoints,
        cleaner: () => {
            map.removeEventListener('zoomend', listener)
            overlays.forEach(overlay => map.removeOverlay(overlay))
            controls.forEach(control => map.removeControl(control))
        }
    }
}
