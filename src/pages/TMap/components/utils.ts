
export function isSupportCanvas() {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

/**
 * 天地图
 * 生成热力图
 */
export const heatMapGenerator = (map: any, data: Record<'lng' | 'lat' | 'count', number>[]) => {
    if (!isSupportCanvas()) return
    const heatmapOverlay = new T.HeatmapOverlay({
        radius: 20,
        // defaultMaxOpacity: 0.7,
        // defaultMinOpacity: 0.01,
        gradient: {
            0: 'rgb(0,0,0)',
            0.15: 'rgb(0,0,125)',
            0.45: 'rgb(0,0,255)',
            0.55: 'rgb(0,255,255)',
            0.65: 'rgb(0,255,0)',
            0.95: 'yellow',
            1: 'rgb(255,0,0)',
        },
    });
    // heatmapOverlay.enableMassClear = false
    map.addOverLay(heatmapOverlay);
    const max = data.reduce((pre, cur) => Math.max(pre, cur.count), 0)
    heatmapOverlay.setDataSet({ data, max: max / 2 });
    return heatmapOverlay;
}


/**
 * 天地图
 * 生成热力图(点状)
 */
export const heatMapDotGenerator = (map: any, data: Record<'lng' | 'lat' | 'count', number>[]) => {
    let max = 0;
    let min = 0;
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
    const points: T.LngLat[] = [];
    const ram = Math.max(10, Math.min(100, Math.floor(max / 100)));
    const randoms = Array(ram)
        .fill(0)
        .map(() => Math.random() - 0.5);
    const diff = max - min;
    data.forEach((m, index) => {
        let n = Math.floor((m.count * ram) / diff);
        for (let i = 0; i < n; i++) {
            points.push(
                new T.LngLat(
                    randoms[(i * index) % ram] * minLng + m.lng,
                    randoms[((ram - i) * index) % ram] * minLat + m.lat,
                ),
            );
        }
    });

    const pointCollection = new T.CloudMarkerCollection(points,
        {
            color: '#FF825F',
            ShapeType: TDT_POINT_SHAPE_CIRCLE,
            SizeType: TDT_POINT_SIZE_TINY
        }
    )
    map.addControl(pointCollection)
    return pointCollection;
}
