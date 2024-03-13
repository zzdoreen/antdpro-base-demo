import '../Map/index.less'
import MapTools from './components/MapTools'
import { useEffect, useRef, useState } from 'react'
import { useModel } from 'umi'
import type { MapCenterFunc } from '@/models/bmap'
import { useDetailRender } from './components/hooks'
import DisasterTools from './components/DisasterTools'
// import { MapBoundary } from './components/MapBoundary'

export default function TDMap() {
    const [map, setMap] = useState<any>()
    const { initialState } = useModel('@@initialState')
    const onceRef = useRef<MapCenterFunc>()
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { centerAndZoomMap } = useModel('tmap', ({ centerAndZoomMap }) => ({ centerAndZoomMap }))

    useDetailRender({ map })

    useEffect(() => {
        if (!map) {
            const imageURL = `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0` +
                `&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=1cdc7e840fd7b63469e908f9bfd811f7`
            const layers = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
            const m = new T.Map('map', { layers })
            m.centerAndZoom(new T.LngLat(102.54, 30.05), 12)
            setMap(m)
        }
    }, [])

    useEffect(() => {
        if (!map) return
        const boundarys = initialState?.serveArea?.polygons
        const strokeColor = 'white'
        const polylines: any[] = []
        let pts: any[] = []

        boundarys.forEach((boundary, i) => {
            const points: any[] = boundary.map(([lng, lat]: number[]) => {
                return new T.LngLat(lng, lat)
            })
            const polyline = new T.Polyline(points, {
                // fillOpacity: 'transparent',
                // fillColor: 'transparent',
                weight: 3,
                fillColor: 'rgba(60,151,255,0.15)',
                color: strokeColor
            })
            polylines.push(polyline)
            pts = pts.concat(points)
            // if (i === 5) prev5Index = pts.length
        })

        const polygons = polylines.map(polyline => {
            const polygon = new T.Polygon(polyline.getLngLats(), {
                strokeColor: 'white',
                fillColor: 'rgba(60,151,255,0.15)',
                strokeWeight: 4,
                fillOpacity: 0.25,
                strokeOpacity: 0.5,
            })
            map.addOverLay(polygon)
            return polygon
        })
        if (!onceRef.current) {
            onceRef.current = () => {
                map.setViewport(pts)
                map.setZoom(7)
            }
            centerAndZoomMap(onceRef)
        }

        return () => {
            polygons.map(polygon => map.removeOverLay(polygon))
        }
    }, [map, initialState?.serveArea?.polygons])

    return <div className='wrapper'>
        <div id="map" style={{ width: '100%', height: '850px' }} />
        {/* <MapBoundary map={map} /> */}
        <MapTools map={map} />
        <DisasterTools map={map} />
    </div>
}