// https://github.com/huiyan-fe/react-bmap
import type { SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react'
import { Map } from 'react-bmapgl'
import { styleJson } from './components/style'
import { useModel } from 'umi';
import './index.less'
import MapToolsComponent from './components/MapTools';
import { useDetailRender } from './components/hooks';

type MapCenterFunc = (margins?: number[]) => void

export default function MapConponent() {
    const [map, setMap] = useState<BMapGL.Map>()
    const { initialState } = useModel('@@initialState')
    const onceRef = useRef<MapCenterFunc>()

    const { centerAndZoomMap } = useModel('bmap', ({ centerAndZoomMap }) => ({ centerAndZoomMap }))

    useDetailRender({ map })

    useEffect(() => {
        if (!map) return
        const boundarys = initialState?.serveArea?.polygons
        const strokeColor = '#338aec'
        const polylines: BMapGL.Polyline[] = []
        let pts: BMapGL.Point[] = []

        boundarys.forEach((boundary, i) => {
            const points: BMapGL.Point[] = boundary.map(([lng, lat]: number[]) => {
                // return new BMap.Point(lng, lat)
                // ADD 边界线经纬度转换
                return new BMapGL.Point(lng, lat)
            })
            const polyline = new BMapGL.Polyline(points, {
                // fillOpacity: 'transparent',
                // fillColor: 'transparent',
                strokeWeight: 3.5,
                strokeColor
            })
            polylines.push(polyline)
            pts = pts.concat(points)
            // if (i === 5) prev5Index = pts.length
        })
        if (!onceRef.current) {
            onceRef.current = (margins) => {
                // if (isAllNation) {
                //     // 非全屏下的全国边界定位取前五个
                //     let points = pts
                //     const [_, right = 0, __, left = 0] = margins || []
                //     if (window.innerHeight < 1080 || alwaysFullScreen)
                //         points = points.slice(0, prev5Index)
                //     margins = window.innerHeight < 1080 ? [65, right, 78, left] : [65, right, 220, left]
                //     map.setViewport(points, {
                //         // enableAnimation: false,
                //         delay: 0,
                //         margins
                //     })
                // } else
                map.setViewport(pts, {
                    // enableAnimation: false,
                    delay: 20,
                    margins
                })
            }
            centerAndZoomMap(onceRef)
        }

        const polygons = polylines.map(polyline => {
            const polygon = new BMapGL.Polygon(polyline.getPath(), {
                strokeColor: '#50b5ff',
                fillColor: 'rgba(60,151,255,0.15)',
                strokeWeight: 4,
            })
            map.addOverlay(polygon)
            return polygon
        })

        return () => {
            polygons.map(polygon => map.removeOverlay(polygon))
        }

    }, [map, initialState?.serveArea?.polygon])

    return <div className='wrapper'>
        <Map ref={(ref: { map: SetStateAction<BMapGL.Map | undefined> }) => setMap(ref?.map)}
            // center={{ lng: 116.402544, lat: 39.928216 }}
            style={{ height: 850 }} enableScrollWheelZoom={true}
            mapStyleV2={{ styleJson }} >
            <MapToolsComponent map={map!} />
        </Map>
    </div>
}