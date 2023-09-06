import { Colors } from "@/config/dictions";
import { LayerZIndex } from "@/models/bmap";
import { Button, Form, InputNumber, Row, Tooltip, Typography } from "antd";
import classNames from "classnames";
import ReactDOM from "react-dom";
import { useModel } from "umi";

export default function MapTools(props: any) {
    const { map } = props
    const { centerAndZoomMap, toggleFull, setMapState, isFull } = useModel('tmap', ({ centerAndZoomMap, setMapState, toggleFull, isFull }) => ({ centerAndZoomMap, setMapState, toggleFull, isFull }))

    return <div className="tools"
        // 事件委托/代理
        onClick={(e) => {
            const target = e.target as HTMLDivElement
            if (!target) return
            markerToolFunc.close();
            distanceToolFunc.close()
            if (target.classList.contains('marker')) markerToolFunc.open(map!)
            else if (target.classList.contains('distance')) distanceToolFunc.open(map!)
        }}
    >
        {/* @ts-ignore */}
        < Tooltip placement="left" title={isFull ? "退出全屏" : "全屏"} color={Colors.primaryColor} getPopupContainer={v => document.getElementsByClassName('full-screen')[0]} >
            <div onClick={toggleFull} className={classNames("full-screen", isFull && 'exit-full')} >{isFull ? '退出全屏' : '全屏'}</div>
        </Tooltip >
        {/* @ts-ignore */}
        <Tooltip placement="left" title="添加标记" color={Colors.primaryColor} getPopupContainer={v => document.getElementsByClassName('marker')[0]}>
            <div className="marker reset" >添加标记</div>
        </Tooltip>
        {/* @ts-ignore */}
        <Tooltip placement="left" title="测距" color={Colors.primaryColor} getPopupContainer={v => document.getElementsByClassName('distance')[0]}>
            <div className="distance reset" >测距</div>
        </Tooltip>
        {/* @ts-ignore */}
        <Tooltip placement="left" title="人口热力" color={Colors.primaryColor} getPopupContainer={v => document.getElementsByClassName('heatmap')[0]} >
            <div onClick={() => setMapState(({ heatmap }) => ({ heatmap: !heatmap }))} className="heatmap reset" >人口热力</div>
        </Tooltip>
        {/* @ts-ignore */}{/* arrow诡异的1px空隙 */}
        {/* <Tooltip placement="left" title="切换地图类型" color={Colors.primaryColor} overlayInnerStyle={{ marginRight: -1 }} getPopupContainer={v => document.getElementsByClassName('maptype')[0]}>
            <div onClick={() => {
                const mapType = map?.getMapType() === 'B_NORMAL_MAP' as unknown as BMapGL.MapType ? BMAP_SATELLITE_MAP : BMAP_NORMAL_MAP
                map.setMapType(mapType)
            }} className="maptype" >类型</div>
        </Tooltip> */}
        {/* @ts-ignore */}{/* arrow诡异的1px空隙 */}
        <Tooltip placement="left" title="返回默认地图" color={Colors.primaryColor} overlayInnerStyle={{ marginRight: -1 }} getPopupContainer={v => document.getElementsByClassName('reset')[0]}>
            <div onClick={() => centerAndZoomMap(undefined, 0)} className="reset" >返回</div>
        </Tooltip>
    </div >
}

/**
 * 距离测量工具函数
 */
export const distanceToolFunc = (() => {
    let lineTool: any;
    return {
        open(map: any) {
            const config = {
                // showLabel: true,
                color: 'red',
                showLabel: true,
            }
            lineTool = new T.PolylineTool(map, config)
            lineTool.open()
        },
        close() {
            lineTool?.close()
        }
    }
})()

export const markerToolFunc = (() => {
    let markerTool: any;
    const markers: T.Marker[] = [];
    let preMap: T.Map

    return {
        open(map: T.Map) {
            if (!markerTool || map !== preMap) {
                markerTool = new T.MarkTool(preMap = map, { follow: true });
                markerTool.addEventListener('mouseup', function (evt: any) {
                    markerTool.close()
                    document.onkeydown = null
                    const marker = evt.currentMarker;
                    // 层级在marker里最高
                    marker.setZIndexOffset(LayerZIndex.MARKER_TOOL)
                    function openInfoWindow() {
                        const { lng, lat } = marker.getLngLat()
                        const InfoWindowContent = (<>
                            <Typography.Title level={5} >标记点详情</Typography.Title>
                            <Form
                                onFinish={v => {
                                    marker.setLngLat(new T.LngLat(v.lng, v.lat));
                                    marker.closeInfoWindow();
                                }}
                                onReset={() => {
                                    markers.splice(markers.indexOf(marker), 1);
                                    map.removeOverLay(marker);
                                }}
                                initialValues={{ lng: lng, lat: lat, name }}
                            // initialValues={{ lng: numberFixed(lng, 2), lat: numberFixed(lat, 2), name }}
                            >
                                {/* <Form.Item label="&nbsp;名&nbsp;&nbsp;称" name="name" rules={[{ max: 255, message: '名称长度不超过255' }]}>
                                    <Input />
                                </Form.Item> */}
                                <Row justify="space-between">
                                    <Form.Item label="经度" name="lng" rules={[{ required: true, message: '请输入经度' }]}>
                                        <InputNumber min={-180} max={180} step={1} precision={2} style={{ width: 100 }} />
                                    </Form.Item>
                                    <Form.Item label="纬度" name="lat" rules={[{ required: true, message: '请输入纬度' }]}>
                                        <InputNumber min={-90} max={90} step={1} precision={2} style={{ width: 100 }} />
                                    </Form.Item>
                                </Row>
                                <div style={{ textAlign: 'right' }}>
                                    <Button htmlType="reset" style={{ marginRight: 15 }} >删除</Button>
                                    <Button htmlType="submit" type="primary">确定</Button>
                                </div>
                            </Form>
                        </>
                        );
                        const container = document.createElement('div');
                        ReactDOM.render(InfoWindowContent, container);
                        const infoWindow = new T.InfoWindow(container, { minWidth: 380, minHeight: 200 });
                        marker.openInfoWindow(infoWindow);
                    }
                    openInfoWindow();

                    marker.addEventListener('click', () => {
                        openInfoWindow();
                    });
                    markers.push(marker);
                });
            }
            markerTool.open();
            document.onkeydown = ({ keyCode }) => {//esc 取消
                if (keyCode === 27) markerTool.close();
            }
        },
        close() {
            markerTool?.close()
        }
    }
})()