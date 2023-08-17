/* eslint-disable @typescript-eslint/no-loop-func */
import { useDebounce } from "ahooks";
import { Button, Input } from "antd";
import { useCallback, useRef, useState } from "react";

export default function MapBoundaryComponent({ map }: { map: BMapGL.Map }) {
    const [value, setValue] = useState<string>()
    const debouncedValue = useDebounce(value, { wait: 500 })
    const mapData = useRef<{ pointArr: BMapGL.Point[], polygonArr: BMapGL.Polygon[], prismArr: BMapGL.Prism[] }>({ pointArr: [], polygonArr: [], prismArr: [] })

    const handleRenderBoundary = useCallback(() => {
        mapData.current.polygonArr.map(o => map.removeOverlay(o));
        mapData.current.prismArr.map(o => map.removeOverlay(o))

        mapData.current = { pointArr: [], polygonArr: [], prismArr: [] }
        if (!debouncedValue || !map) return
        const bdary = new BMapGL.Boundary()
        bdary.get(debouncedValue!, (rs) => {
            const count = rs.boundaries.length
            if (count === 0) return

            for (let i = 0; i < count; i++) {
                // GL版本必须传Point数组
                const arr = rs.boundaries[i].split(';').map(p => {
                    const [lng, lat] = p.split(', ')
                    const point = new BMapGL.Point(lng, lat)
                    return point
                });
                mapData.current.pointArr = mapData.current.pointArr.concat(arr)

                // 建立棱柱 卫星图中没有效果
                const prism = new BMapGL.Prism(arr, 5000, // 必须返回BMapGL.Point[]
                    {
                        topFillColor: '#5679ea',
                        topFillOpacity: 0.5,
                        sideFillColor: '#5679ea',
                        sideFillOpacity: 0.9
                        // enableMassClear: true // 是否再调用前清除本身
                    });

                // 多边形覆盖物
                const ply = new BMapGL.Polygon(rs.boundaries[i] as any, // 返回的不是BMap.Point[] 也能画, 返回的是 105.11,31.5;106.5,23.5... 字符串
                    {
                        strokeWeight: 2,
                        strokeStyle: 'dashed',
                        strokeColor: "#ff0000",
                        strokeOpacity: 0.6,
                        fillColor: 'pink'
                    });

                mapData.current.polygonArr = mapData.current.polygonArr.concat(ply)
                mapData.current.prismArr = mapData.current.prismArr.concat(prism)
            }

            mapData.current.polygonArr.map(o => map.addOverlay(o));
            mapData.current.prismArr.map(o => map.addOverlay(o))
            map.setViewport(mapData.current.pointArr);    // 调整视野
        })

    }, [map, debouncedValue])

    return <div className="boundarys">
        <Input value={value} onChange={v => setValue(v.target.value)} />
        <Button type="primary" onClick={handleRenderBoundary}>确定</Button>
    </div>
} 