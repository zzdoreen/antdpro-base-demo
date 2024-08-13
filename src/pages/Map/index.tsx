// https://github.com/huiyan-fe/react-bmap
import type { SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react'
import { Map } from 'react-bmapgl'
import { styleJson } from './components/style'
import { useModel } from 'umi';
import MapToolsComponent from './components/MapTools';
import { useDetailRender } from './components/hooks';
import MapBoundaryComponent from './components/MapBoundary';
import DisasterTools from './components/DisasterTools';
import { useMinuteRainManager } from './components/HoursRainfall';
import './index.less'

type MapCenterFunc = (margins?: number[]) => void

export default function MapConponent() {
    const [map, setMap] = useState<BMapGL.Map>()
    const boundarys = useModel('@@initialState', ({ initialState }) => initialState?.serveArea?.polygons)
    const onceRef = useRef<MapCenterFunc>()
    const centerAndZoomMap = useModel('bmap', ({ centerAndZoomMap: centerAndZoomMapFn }) => centerAndZoomMapFn)
    const [current, setCurrent] = useState('')

    useDetailRender({ map })
    useMinuteRainManager({ map })

    // 边界加载
    useEffect(() => {
        if (!map || !boundarys) return
        const strokeColor = '#338aec'
        const polylines: BMapGL.Polyline[] = []
        let pts: BMapGL.Point[] = []

        boundarys!.forEach((boundary: number[][]) => {
            const points: BMapGL.Point[] = boundary.map(([lng, lat]: number[]) => new BMapGL.Point(lng, lat))
            const polyline = new BMapGL.Polyline(points, {
                // fillOpacity: 'transparent',
                // fillColor: 'transparent',
                strokeWeight: 3.5,
                strokeColor
            })
            polylines.push(polyline)
            pts = pts.concat(points)
        })
        if (!onceRef.current) {
            onceRef.current = (margins) => map.setViewport(pts, { delay: 20, margins })
            centerAndZoomMap(onceRef)
        }

        const polygons = polylines.map(polyline => {
            const polygon = new BMapGL.Polygon(polyline.getPath(), {
                strokeColor: '#50b5ff',
                fillColor: 'rgba(60,151,255,0.15)',
                strokeWeight: 4,
                fillOpacity: 0.15,
                strokeOpacity: 0.5,
            })
            map.addOverlay(polygon)
            return polygon
        })

        return () => {
            polygons.map(polygon => map.removeOverlay(polygon))
        }
    }, [map, boundarys, centerAndZoomMap])

    // 右键菜单
    useEffect(() => {
        if (!map) return
        const menu = new BMapGL.ContextMenu()
        const menuItem = new BMapGL.MenuItem(
            '查看',
            (v: BMapGL.Point) => {
                const { lng, lat } = v
                const infoWindow = new BMapGL.InfoWindow(`${lng},${lat}`, {
                    width: 300,
                    height: 50,
                    title: 'title',
                })
                map.openInfoWindow(infoWindow, v)
            })
        menu.addItem(menuItem)
        map.addContextMenu(menu)


        const geolocation = new BMapGL.Geolocation()
        geolocation.getCurrentPosition(result => {
            console.log(result) // null
            setCurrent(result?.address?.province + result?.address?.city + result?.address?.country)
            const marker = new BMapGL.Marker(result?.point)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE)
            map.addOverlay(marker)
            return () => {
                map?.removeOverlay(marker)
            }
        })

    }, [map])


    return <div className='wrapper'>
        <Map ref={(ref: { map: SetStateAction<BMapGL.Map | undefined> }) => setMap(ref?.map)}
            style={{ height: 850 }}
            enableScrollWheelZoom={true}
            defaultOptions={{ preserveDrawingBuffer: true }} // 否则截图不生效
            mapStyleV2={{ styleJson }}
        >
            <MapBoundaryComponent map={map!} />
            <MapToolsComponent map={map!} />
            <DisasterTools map={map!} />
        </Map>
        {current}
    </div>
}