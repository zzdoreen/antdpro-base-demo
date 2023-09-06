import { useDebounce } from "ahooks";
import { Button, Input } from "antd";
import { useCallback, useState } from "react";

export function MapBoundary({ map }: { map: any }) {
    const [value, setValue] = useState<string>()
    const debouncedValue = useDebounce(value, { wait: 500 })

    const handleRenderBoundary = useCallback(() => {
        if (!debouncedValue) return
        const administrative = new T.AdministrativeDivision();
        administrative.search({
            searchWord: debouncedValue,
            searchType: 1, // 0: code查询， 1: 名称查询
            needSubInfo: true,
            needAll: true,
            needPre: true,
            needPolygon: true,
        }, (res: any) => {
            // 都没有返回边界 ？
            // const data = res.getData()[0]?.points
            console.log(res, res.getData())
        })
    }, [map, debouncedValue])

    return <div className="boundarys">
        <Input value={value} onChange={v => setValue(v.target.value)} />
        <Button type="primary" onClick={handleRenderBoundary}>确定</Button>
    </div>
}