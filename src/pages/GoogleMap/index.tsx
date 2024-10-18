import type { MapCenterFunc } from '@/models/bmap'
import { Loader } from '@googlemaps/js-api-loader'
import { useSafeState } from 'ahooks'
import { Button, Col, Row } from 'antd'
import { useCallback, useEffect, useRef } from 'react'
import { useModel } from 'umi'
import { info, intensityInfo } from '../Map/components/configuration'
import type { IntensityInfoEntity } from '@/services/entities'
import './index.less'

export default function () {
    const heatmap = useRef<google.maps.visualization.HeatmapLayer | null>(null)
    const onceRef = useRef<MapCenterFunc>()
    const polygons = useModel('@@initialState', ({ initialState }) => initialState?.serveArea?.polygons)
    const [map, setMap] = useSafeState<google.maps.Map | null>(null)

    useEffect(() => {
        /* 
            drawing，提供一个图形界面，以供用户在地图上绘制多边形、矩形、多段线、圆形和标记。如需了解详情，请参阅绘图库文档。
            geometry，包含实用函数，用于计算地球表面的标量几何值（例如距离和面积）。如需了解详情，请参阅几何图形库文档。
            journeySharing，为 Google Maps Platform 交通运输和物流解决方案提供支持。
            localContext，向用户显示指定位置附近的主要景点。如需了解详情，请参阅 Local Context Library 文档。
            marker，可让您向地图添加可灵活定制且性能出色的高级标记。如需了解详情，请参阅高级标记文档。
            places，让您的应用能够在指定的区域内搜索场所、地理位置或受关注的地图注点等地点。如需了解详情，请参阅地点库文档。
            visualization，提供热图，用于直观呈现数据。如需了解详情，请参阅可视化库文档。
       */
        const loader = new Loader({
            apiKey: 'AIzaSyAVCnvk7bAyB_O0LKwrR74zkTu9DCTkkMs',
            version: 'weekly',
            language: 'zh-CN',
            libraries: ['places', 'marker', 'maps', 'drawing', 'geocoding', 'geometry',
                'elevation', 'routes', 'streetView', 'visualization', 'core'],
        })
        loader.load().then(() => {
            const m = new google.maps.Map(document.getElementById('map')!, {
                center: {
                    lng: 104,
                    lat: 30.5
                },
                zoom: 7,
                mapId: 'trans-shuttle-423602-h9',
                mapTypeControl: true,
                mapTypeId: 'roadmap',
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google?.maps?.ControlPosition.TOP_CENTER,
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
                },
                streetViewControl: true,
            })
            setMap(m)

            new google.maps.drawing.DrawingManager({
                map: m,
                // drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.MARKER,
                        google.maps.drawing.OverlayType.CIRCLE,
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.POLYLINE,
                        google.maps.drawing.OverlayType.RECTANGLE,
                    ],
                },
                markerOptions: {
                    // icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                },
                circleOptions: {
                    fillColor: "#ffff00",
                    fillOpacity: 1,
                    strokeWeight: 5,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                },
            });

        })

        // 单独引入、 libraries 不进行配置
        // loader.importLibrary('maps').then(({ Map }) => {
        //     const m = new Map(document.getElementById('map')!, mapOptions)
        //     setMap(m)
        // }).catch((e) => console.log('error', e))
        // loader.importLibrary('marker')
    }, [])

    // 加载边界
    useEffect(() => {
        if (!map || !polygons) return

        // 添加几何图形/折线
        const polyline = new google.maps.Polyline({
            map,
            strokeColor: "#CC0099",
            strokeOpacity: 1.0,
            strokeWeight: 3,
            geodesic: true,
        });
        const polygon = new google.maps.Polygon({
            map,
            strokeColor: '#000000',
            fillColor: 'rgba(60,151,255,0.15)',
            fillOpacity: 0.5,
            strokeWeight: 3,
        })

        const bounds = new google.maps.LatLngBounds()
        polygons.forEach((boundary) => {
            const path = boundary.map(([lng, lat]: [number, number]) => {
                const pt = new google.maps.LatLng(lat, lng)
                bounds.extend(pt)
                return pt
            })
            polyline.setPath(path)
            polygon.setPath(path)
        })

        // 中心复位
        const { east, west, north, south } = bounds?.toJSON()
        const center = { lng: (east + west) / 2, lat: (north + south) / 2 }

        onceRef.current = () => {
            map.setCenter(center)
            map.setZoom(7)
        }
        onceRef.current()

        // map.addListener('center_changed', () => {
        //     setTimeout(() => {
        //         map.panTo(marker.position as google.maps.LatLng)
        //     }, 2e3);
        // })

        // map.addListener('click', (e) => {
        //     map.setZoom(8);
        //     map.setCenter(marker.position as google.maps.LatLng)
        //     console.log('click', e)
        // })

        return () => {
            polygon.setMap(null)
            polyline.setMap(null)
        }

    }, [map, polygons])

    const centerAndZoomMap = useCallback((func?: typeof onceRef, delay = 500) => {
        setTimeout(() => {
            if (onceRef.current) return onceRef.current()
            else if (func?.current) onceRef.current = func.current
            onceRef.current?.()
        }, delay);
    }, [])

    const handleHeatmapRender = useCallback(() => {
        if (!map) return
        if (!heatmap.current) {
            const data = JSON.parse(info.heatmap || "[]")
                .map(({ lng, lat, count: weight }: Record<string, number>) => ({
                    weight,
                    location: new google.maps.LatLng(lat, lng)
                }))

            heatmap.current = new google.maps.visualization.HeatmapLayer({
                map,
                data,
                gradient: ['rgba(0,0,0,0)', 'rgb(0,0,125)', 'rgb(0,0,255)', 'rgb(0,255,255)',
                    'rgb(0,255,0)', 'rgb(255,255,0)', 'rgb(255,0,0)'],
                radius: 20,
            })
        } else {
            heatmap.current?.setMap(null)
            heatmap.current = null
        }
    }, [map])

    const intensityRef = useRef<any[] | null>(null)

    const intensityMapRender = () => {
        if (intensityRef?.current) {
            intensityRef?.current?.map(v => v?.setMap(null))
            intensityRef.current = null
            centerAndZoomMap()
        } else {
            intensityRef.current = []

            const { latitude, longitude, irregulars = [], thresholdIntensity = 0, thermodyNamic = '[]' } = intensityInfo as unknown as IntensityInfoEntity
            const overlays = []
            const effectiveIrregulars = irregulars.filter(({ intensity: v }) => v >= thresholdIntensity)

            // 获取烈度最小的点位，设置地图自适应
            const minIntensity = effectiveIrregulars[effectiveIrregulars.length - 1].intensity
            let pts: any[] = []
            effectiveIrregulars.forEach(({ intensity, points }) => {
                if (intensity === minIntensity)
                    pts = pts.concat(points.map(({ longitude: lng, latitude: lat }) => new google.maps.LatLng(lat, lng)))
            })

            const epicenterMarker = new google.maps.Circle({
                center: { lng: longitude, lat: latitude },
                radius: 1460,
                strokeColor: '#000000',
                strokeWeight: 1,
                strokeOpacity: 0.6,
                fillColor: '#ff0',
                map
            })

            onceRef.current = () => {
                map?.setZoom(10)
                map?.setCenter(new google.maps.LatLng({ lat: latitude, lng: longitude }))
            }
            centerAndZoomMap(onceRef, 0)

            overlays.push(epicenterMarker);
            // 烈度圈
            [...effectiveIrregulars].reverse().forEach(({ color, points, intensity }) => {
                const polygon = new google.maps.Polygon({
                    strokeColor: 'blue',
                    strokeWeight: 1,
                    strokeOpacity: 0.2,
                    fillColor: color,
                    fillOpacity: .2,
                    map
                });
                const path = points.map(({ longitude: lng, latitude: lat }) => new google.maps.LatLng(lat, lng))
                polygon.setPath(path)
                overlays.push(polygon)

                const { longitude: lng, latitude: lat } = points[Math.floor(points.length / 2)];
                const label = document.createElement('div')
                label.className = 'intensity-label'
                label.textContent = `${intensity}度区`
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: { lng, lat },
                    content: label
                })
                overlays.push(marker)
            })
            intensityRef.current = overlays

            // 点状热力图
            const heatmapDots = heatMapDotGenerator(JSON.parse(thermodyNamic))

            heatmapDots.forEach(({ lng, lat }) => {
                const dot = document.createElement('div')
                dot.className = 'intensity-heatmap-dot'
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lng, lat },
                    content: dot,
                    map
                })
                overlays.push(marker)
            })
        }
    }

    return <div className='google-map-wrapper'>
        <Row>
            <Button onClick={() => centerAndZoomMap()}>复位</Button>
            <Button onClick={handleHeatmapRender}>热力图</Button>
            <Button onClick={intensityMapRender}>烈度速报</Button>
            <Button>1</Button>
        </Row>
        <div id="map" style={{ height: '900px' }} />
    </div>
}

const heatMapDotGenerator = (data: Record<'lng' | 'lat' | 'count', number>[]) => {
    let max = 0;
    let min = 0;
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
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
    const points: { lng: number, lat: number }[] = [];
    const ram = Math.max(10, Math.min(100, Math.floor(max / 100)));
    const randoms = Array(ram)
        .fill(0)
        .map(() => Math.random() - 0.5);
    const diff = max - min;
    data.forEach((m, index) => {
        const n = Math.floor((m.count * ram) / diff);
        for (let i = 0; i < n; i++) {
            points.push({
                lat: randoms[((ram - i) * index) % ram] * minLat + m.lat,
                lng: randoms[(i * index) % ram] * minLng + m.lng,
            })
        }
    });
    return points
}