import type { ChannelType, Sw, UserChannelType } from "@/config/dictions";

export interface InitialConfigEntity {
    serveArea: {
        code: number
        level: number
        name: string
        polygons: [number, number][][]
    }
}
export interface BaseResponse<T> {
    code: number;
    data: T;
    message: string;
}

export interface TableList<T> {
    total: number
    list: T[]
}

export interface NotifyEntity {
    eventId: number // 事件id,用于查询
    drill: boolean // 是否为演练
    id: number, // 自定义消息id，方便管理
    type: 1 | 2 | 3,// 事件类型
    message: string,// 通知内容
    hasRead: boolean// 消息已读
}
// 灾害
export interface DisasterEntity {
    eventId: string // 预警编号
    eventType: number // 灾害类别 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水
    reportType: number //报类型 1-自动报 2-研判报
    warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
    sourceType: number //数据源类型 1-仪器 2-卫星 3-视频 4-气象
    updateType: number //更新类型 烈度速报(1-自动报 2-更新报 3-修正报) 其他(1-首报 2-更新报 3-解除报)
    level: number // 预警等级  5-红 4-橙 3-黄 2-蓝 1-低风险
    longitude: number // 经度
    latitude: number // 纬度
    location: string // 地点
    createdAt: number // 提示时刻
    areaCode: number, //行政区域编码
    waterAccum: { //针对积水
        waterState: 0 | 1 | 2 //是否有积水 0-有积水深度(depth>=0)，1-无积水，2-有积水
        depth: number //积水深度
        img?: string //图片地址
        video?: string //视频地址
    }
    intensity: { //针对烈度速报
        startAt: number //发震时间戳(s)
        magnitude: number //预警震级
    }
    fire: {
        cloud: number
        subtype: number
    }
    riverflood: RiverfloodInfo['riverflood']
    hour?: number // 小时
    count?: number
    analysisReport?: string  //案例分析报告
    originalCode: string //监测点ID
    visualization?: boolean  //是否进行报的展示(可视化首页专用) true展示在最顶端 false不展示
    drill?: boolean //是否为演练的预警
    town: string
    pastRain: number
    futureRain: number
    pastRainSum?: number
    futureRainSum?: number
}
// 灾害历史统计/列表
export interface DisasterHistoryEntity extends DisasterEntity {
    originalCode: string //点位编号
    count: number //此点位累计预警告警事件
    name: string //名称
    firstReportAt: number //首报时间戳(s)
    firstReportLevel: number //首报等级
    maxReportAt: number //最大报时间戳(s)
    maxReportLevel: number //最大报等级
    latestReportAt: number //最新报时间戳(s)
    latestReportLevel: number //最新报等级
    latestUpdateType: number //最新报状态
    analysisReport?: string  //案例分析报告
}

// 灾害隐患点
export interface HazardEntity {
    id: number
    code: string // 隐患点编号
    name: string // 隐患点名称
    type: number // 隐患点类别 滑坡-2、泥石流-3、沉降-4
    level: number // 预警等级 红-5、橙-4、黄-3、蓝-2
    updatedAt: number// 最后更新时间
    longitude: number // 经度
    latitude: number // 纬度
    location: string // 全拼接
    createdAt: number // 提示时刻
    count: number // 预警次数
}

// 灾害事件的多报列表，详情页展示
export type DisasterInfoEntity<T extends WaterAccumInfo | FireInfo | FloodInfo | RiverfloodInfo = {}> = T & {
    eventId: string
    level: number
    hour: number
    eventType: number
    createdAt: number // 提示时刻
    location: string // 地点
    longitude: number
    latitude: number
    algorithm: string //算法
    description: string //说明
    sourceType: number //数据源类型 1-仪器 2-卫星 3-视频 4-气象
    updateType: number //更新类型 烈度速报(1-自动报 2-更新报 3-修正报) 其他(1-首报 2-更新报 3-解除报)
    warnType: number //预警类型 1-预报预警 2-监测预报 3-监测报警
    reportType: number //报类型(产生方式) 1-自动报 2-研判报
    briefWeather: BriefWeather
    analysisReport?: string,
    originalCode: string //监测点ID
    drillNums: { channel: number, success: number, fail: number, toBeConfirmed: number, isConfirmed: number }[] // 
    heatmap: string //人口热力字符串json格式如：[{"lng":102.48287200927734,"lat":24.719886779785156,"count":140}]
    heatmapCount: {
        range: number //米
        population: number //人数
    }[]//人口热力范围内人数
    futureRain?: number
}
// 烈度速报
export interface IntensityInfoEntity
    extends Omit<DisasterInfoEntity, 'hour' | 'location' | 'description' | 'reportType'> {
    startAt: number // 发震时刻，针对地震烈度速报
    epicenter: string // 震中位置
    magnitude: number // 预警震级，针对地震烈度速报
    maxIntensity: number// 最大烈度
    thresholdIntensity: number //作图阈值
    sms: string // 震情通报
    // eventId: number //
    // zoom: number
    updateHistory: {  // 更新历史记录
        updateType: 1 | 2 | 3, //最新报状态 1-自动报 2-更新报 3-修正报
        createdAt: number
    }[],
    irregulars: { // 烈度圈数据
        intensity: number // 烈度
        points: { // 烈度圈的点坐标
            longitude: number
            latitude: number
        }[]
        color: string// 颜色
    }[]// : 烈度圈数据
    areas: { //影响区域
        intensity: number // 烈度
        area: number //面积，平方公里
    }[]
    // thresholdIntensity: number // 作图阈值
    thermodyNamic: string //人口热力图数据， 格式如：[{"lng":102.48287200927734,"lat":24.719886779785156,"count":140}]
    popDistribution?: { //影响人口
        intensity: number //烈度
        population: number //人口
    }[]
}
// 积水
export interface WaterAccumInfo {
    waterAccum: {
        img: string //图片地址
        video: string //视频地址
        waterState: number //是否有积水 0-有积水深度(depth>=0)，1-无积水，2-有积水
        depth: number //积水深度
    }
}
// 积水
export interface RiverfloodInfo {
    riverflood: {
        img?: string //图片地址
        video?: string //视频地址
        waterLevel: number //积水深度
    }
}
// 山火
export interface FireInfo {
    fire: {
        points: number[][] // 火点经纬度
        subtype: number //火情子类型: 0-待研判 2-森林火灾 3-草原火灾 4-建筑火灾 5-秸秆焚烧 6-炼山 7-计划烧除 8-其他火情 101-工厂高温作业 102-其他非火情
        cloud: number //覆云情况 1-有云 2-无云
        happendAt: number //卫星监测时间
    }
}
// 山洪
export interface FloodInfo {
    flashflood: {
        // shapeArea: number // 集水面积
        stream: string // 汇水路径经纬度 "lng1 lat2,lng2 lat2"
        // streamLength: number // 汇水路径长度
        boundary: string // 集水面经纬度 "lng1 lat2,lng2 lat2"
        // height: number // 高度
        landDesc: string //流域土地类型文字描述
        preventCapacity: number //防洪能力
        flowCurveStartAt: number //流量过程线开始时间戳s
        arriveAt: number //风险时段时间戳s
        flowCurve: number[] //流量过程线
    }
}
// 简要天气信息
interface BriefWeather {
    skycon: string // 天气现象
    temperature: number // 温度
    wind: {
        direction: string // 风向
        scale: number // 风级
        speed: number //风速
    }
}

export interface HazardInfo extends HazardEntity {
    threatenedProperty: number // 威胁财产
    threatenedHousehold: number // 威胁户数
    threatenedPeople: number // 威胁人数
    isResPlan: string // 是否建立档案 “1”-是 “2”-否
    isDoubleCard: string // 是否发放两卡 “1”-是 “2”-否
    isWarnNet: string // 是否建立监测网 “1”-是 “2”-否
    respName: string // 防灾责任人姓名
    respPhone: string// 防灾责任人电话
    respPost: string// 防灾责任人职位
    monitorRespName: string // 监测责任人姓名
    monitorRespPhone: string // 监测责任人电话
    monitorName: string // 专职监测员姓名
    monitorPhone: string // 专职监测员电话
}

export interface PaginationParams {
    pageNum?: number
    pageSize?: number
}

export interface WeatherEntity {
    createdAt: number
    pastRainSum?: number
    pastRain: number[]
    realtime: {
        skycon: string // 天气现象
        rainIntensity: number // 降水强度, mm/hr
        temperature: number // 温度，摄氏度
        feelsTemp: number // 体感温度, 摄氏度
        humidity: number // 湿度, [0,1]
        clouds: number // 云量, [0,1]
        pressure: number // 气压, 百帕
        visibility: number // 能见度，公里
        wind: {
            speed: number // 风速，m/s
            scale: number // 风级, [0,18]
            direction: string // 风向
        }
    }
    minute: {
        precipitation: number[]
    }  // 两小时逐分钟降水(总共 120 个值，第一个值表征当前分钟的情况) // mm/hr
    hourly: { // 三天逐小时预报(总共 72 个值，第一个值表征当前小时的情况)
        rainIntensity: number // mm/hr
        temperature: number // 摄氏度
        humidity: number // 范围[0,1]
        visibility: number // 公里
        wind: {
            direction: string
            speed: number // m/s
            scale: number // 范围[0,18]
        }
    }[]
    daily: { // 十五天逐天预报(总共 15 个值，第一个值表征当天的情况)
        skycon: string
        rainIntensity: { // mm/hr
            max: number
            min: number
            avg: number
        }
        temperature: { // 摄氏度
            max: number
            min: number
            avg: number
        }
        humidity: { // 范围[0,1]
            max: number
            min: number
            avg: number
        }
        visibility: { // 公里
            max: number
            min: number
            avg: number
        }
        windStatistics: {
            max: {
                direction: string
                speed: number // m/s
                scale: number // 范围[0,18]
            }
            min: {
                direction: string
                speed: number // m/s
                scale: number // 范围[0,18]
            }
            avg: {
                direction: string
                speed: number // m/s
                scale: number // 范围[0,18]
            }
        }
    }[],
}

export type StatisticEntity<T> = T & {
    count: number
}

export interface CurrentUserInfo {
    username: string
    password: string //
    enterprise: string
    createdAt: number
    address: string
    phone: string
    fax: string
    contacter: {
        name: string
        department: string
        phone: string
    }
    iclContacter: {
        name: string
        phone: string
    }
}

export interface HazardStatisticListItem {
    code: string
    level: number
    createdAt: number
}
export interface HazardStatisticCountItem {
    month: string
    count: number
}

export interface HazardStatistic {
    list: HazardStatisticListItem[],
    statistic: HazardStatisticCountItem[]
}
// 行政区域
export interface RegionEntity {
    code: number
    fullName: string
    name: string
    parentCode: number
    children?: RegionEntity[]
}
// 乡镇数据
export interface DowntownEntity {
    code: number
    parentCode: number
    fullName: string
    longitude: number
    latitude: number
}
// export interface RainEntity {
//     interval: float  // 统计时间间隔 (暂定固定为1， 20200704)
//     time: number      // 查询时间戳
//     points: {
//         lng: float       // 经度
//         lat: float       // 纬度
//         warns: {
//             startAt: number    // 与此刻的时间差
//             endAt: number    // 与此刻的时间差
//             rainfall: float // 累计雨量（mm）
//             level: number    // 等级 0-无， 1-蓝， 2-黄, 3-橙, 4-红
//         }[]
//     }[]
// }

// 降水图片数据
export interface RainDataEntity {
    timestamp: number;
    // timestamp: number
    // latSize: number // 纬度网格长度
    // lngSize: number  // 经度网格大小
    // level: number[]  // 点的等级
    lngs: [number, number] // 经度范围
    lats: [number, number] // 纬度范围
    url: string //图片地址
}
export interface RainPointEntity {
    longitude: number //数据定位网格经度
    latitude: number //数据定位网格纬度
    value: number //降水数值
    hour: number //对应的hour
}
// 暴雨预警详情
export interface RainEntity {
    // future3: number
    // future6: number
    // future12: number
    lat: number
    level: number
    lng: number
    // past3: number
    // past6: number
    // past12: number
    // startAt number     // 与此刻的时间差
    // endAt   number     // 与此刻的时间差
    // rainfall float  // 累计雨量（mm）
}

export interface MonitorDeviceEntity {
    sensorID: string //设备id，唯一编号
    sensorTypeName: string //设备类型名称
    address: string //全拼位置
    lng: number //经度
    lat: number //纬度
    targetName: string //所属监测点
    connectState: number //连接状态，1-在线 2-离线
    number: number  //现场编号
    targetTypeName?: string
    lastTime: number//设备数据更新时间
    value: number //设备数据

    launchedAt: number  //安装时间（秒级时间戳）
    deviceId: string // 设备id
    source: string //数据源
    town: string //所在乡镇
    level: number     //当前级别 
    waterLevel: number //当前水尺读数
    state: number //连接状态，1-在线 2-离线
    deviceId: string  //设备编号
    onlineTime: number   //上线时间
    offlineTime: number   //下线时间
    connectRate: number //7天连接在线率
    dataRate: number //7天数据在线率
    deviceInfo: string  //设备特性信息
    location: string  //位置
    targetID: string  //监测点Id
    targetName: string  //监测点名称
    source: stringn //数据源
    connectStatus: number  //连接在线状态,1在线2离线
    dataStatus: number     //数据在线状态,1在线2离线
    url: string //实时视频流地址
    img: string //最近的截图地址
    river?: string,
    basin?: string
}

export type MonitorTargetEntity = {
    targetID: string //监测点ID
    targetName: string //监测点名称
    location: string //全拼位置
    lng: number //经度
    lat: number //纬度
    targetTypeName?: string
    createdAt: number //创建时间,s
    note: string
    url: string
    river?: string,
    basin?: string
} & Pick<MonitorDeviceEntity,
    'town' | 'waterLevel' | 'number' | 'source' | 'img' |
    'deviceId' | 'connectStatus' | 'dataStatus' | 'launchedAt'
>

export interface MonitorData {
    collectTime: number, //时间,s
    x: number
    y: number
    z: number
    d: number
    a: number
}

export interface MonitorDataGNSS extends Omit<MonitorData, 'value'> {
    x: number
    y: number
    z: number
    distance: number
}

// 雨量计数据
export interface RealRainEntity extends MonitorDeviceEntity {
    regionCode: number //行政区域编码
    regionName: string //行政区域名称：xx省xx市xx县
    value: number //累计降水量(mm)
    owner: string //所属单位
    stationId: string //监测站点号
}

export interface CurrentUserConfig {
    downtown?: DowntownEntity[]
    layout: { // 信息配置
        projectNumber: string
        platformTitle: string // 平台标题
        platformLogo: string // 平台logo, 相对路径
        brandName: string // 品牌名称
        signatureTitle: string // 署名标题1
        signatureLogo: string // 署名logo1, 相对路径
        signatureTitle2: string //署名标题2
        signatureLogo2: string //署名logo2（相对路径）
        signatureTitle3: string //署名标题3
        signatureLogo3: string //署名logo3（相对路径）
        outboundStatus: number // 智能外呼，1-开启 2-关闭
        smsStatus: number // 短信，1-开启 2-关闭
        modules: Record<string, 1 | 2> //模块权限
    }
    serveArea: { // 服务区域
        type: number // 类型 1-行政区域 2-多边形 0-未知
        code: number // 行政区域编码(针对type=1)
        name: string // 行政区域名称 “四川省/甘孜州”(针对type=1)
        polygons: number[][][] // 三维数组多边形边界(针对type=1&2), eg.[[[105.3,30.5],[98.7,40.5],...]]
        subPolygons: number[][][] // 三维数组,下级行政区域多边形边界(针对type=1&2), eg.[[[105.3,30.5],[98.7,40.5],...]]
    }
    strategy: { // 接收策略
        intensity: { // 烈度速报
            status: number // 1-开启 2-关闭
            magnitude: number // 触发震级
            intensity: number // 触发烈度 
        }
        landslide: { // 滑坡
            status: number // 1-开启 2-关闭
            weather: { // 气象预报预警
                status: number // 1-开启 2-关闭
                hours: number[] // 提前预警时间
            }
            monitor: { // 仪器监测预警
                status: number // 1-开启 2-关闭
            }
        }
        mudslide: { // 泥石流
            status: number // 1-开启 2-关闭
            weather: { // 气象预报预警
                status: number // 1-开启 2-关闭
                hours: number[] // 提前预警时间
            }
            monitor: { // 仪器监测预警
                status: number // 1-开启 2-关闭
            }
            alarm: { // 仪器监测报警
                status: number // 1-开启 2-关闭
            }
        }
        flashflood: { // 山洪
            status: number // 1-开启 2-关闭
            weather: { // 气象预报预警（累积雨量算法）
                status: number // 1-开启 2-关闭
                hours: number[] // 提前预警时间
            }
            flow: { //气象预报预警（流量算法）
                status: number // 1-开启 2-关闭
                hours: number[] // 提前预警时间
            }
        }
        subsidence: { // 沉降
            status: number // 1-开启 2-关闭
            weather: { // 气象预报预警
                status: number // 1-开启 2-关闭
                hours: number[] // 提前预警时间
            }
            alarm: { // 监测仪器报警
                status: number // 1-开启 2-关闭
            }
        }
        waterAccum: { // 积水
            status: number // 1-开启 2-关闭
            camera: { // 视频监测报警
                status: number // 1-开启 2-关闭
            }
        }
        riverflood: { // 河道洪水
            status: number // 1-开启 2-关闭
            camera: { // 视频监测报警
                status: number // 1-开启 2-关闭
            }
        }
        fire: { // 火情
            status: number // 1-开启 2-关闭
        }
        collapse: { // 崩塌
            status: number // 1-开启 2-关闭
            monitor: { // 监测预警
                status: number // 1-开启 2-关闭
            }
        }
        rainfall: { // 预报降水图
            status: number // 1-开启 2-关闭
        }
        realRainICL: { // 实测降水图ICL
            status: number // 1-开启 2-关闭
        }
        realRainNMC: { // 实测降水图NMC
            status: number // 1-开启 2-关闭
        }
        radarPictureXinya: { // 气象雷达图，大地新亚
            status: number // 1-开启 2-关闭
        }
        rainstorm: { // 暴雨预警图
            status: number // 1-开启 2-关闭
        }
        radarScope: { // 雷达覆盖图
            status: number // 1-开启 2-关闭
        }
        subsRecords: { //历史订阅记录
            eventTypes: number[] //事件类型并集，1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水
            weatherLandslideHours: number[] //气象滑坡时段并集
            weatherMudslideHours: number[] //气象泥石流时段并集
            weatherSubsidenceHours: number[] //气象沉降时段并集
            weatherFlashfloodHours: number[] //气象山洪时段并集
        },
    }
    drill: {
        drillStatus: number //预警演练开关 1-开启 2-关闭
        maxDrillNum: number //每日最大演练次数
        drilledNum: number //今日已演练次数
    }
    monitor: MonitorStrategyEntity
    visualization: VisualizationStrategyEntity
    permission: string[]
}

export interface ProjectEntity {
    account: string //账号
    password: string //密码
    projectNumber: string //项目编号
    projectName: string //项目名称
    projectType: number //项目类型 1-商业试用 2-商业正式 3-公益
    enterpriseName: string //单位名称
    enterpriseMaintype: number //单位主类型
    enterpriseSubtype: number //单位子类型
    enterpriseTypeName: string //单位类型文字描述
    enterpriseLevel: number //单位级别 1-国家级 2-省级 3-地市级 4-区县级
    enterpriseArea: string //单位区域，格式如“四川省/成都市/武侯区”
    enterpriseAddress: string //单位详细地址
    serviceFrom: number //服务有效期开始时间戳(s)
    serviceTo: number //服务有效期截止时间戳(s)
    serviceStatus: number //服务状态 1-正常 2-禁用
    createdAt: number //创建时间戳(s)
    notes: string //备注
    contactIcl: { //我方联系人
        name: string //姓名
        phone: string //联系电话
    }[]
    contactCustomer: { //客户联系人
        name: string //姓名
        phone: string //联系电话
    }[]
    webStatus: number //web渠道服务状态 1-开启 2-关闭
    outboundStatus: number //智能外呼渠道服务状态  1-开启 2-关闭
    smsStatus: number //短信服务状态  1-开启 2-关闭
    platformTitle: string //平台标题
    platformLogo: string //平台logo（相对路径）
    brandName: string //品牌名称
    signatureTitle: string //署名标题
    signatureLogo: string//署名logo（相对路径）
    signatureTitle2: string //署名标题2
    signatureLogo2: string //署名logo2（相对路径）
    signatureTitle3: string //署名标题3
    signatureLogo3: string //署名logo3（相对路径）
    outboundSigEnterprise: string //智能外呼署名单位
    smsSigEnterprise: string //短信署名单位
}

// add 默认策略配置
export interface DefaultStrategyEntity {
    flashflood: { //山洪
        status: number //1-开启 2-关闭
        weather: { //仪器监测预警
            status: number //1-开启 2-关闭
            hours: number[] //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    },
    river: { // 河道洪水
        status: number //1-开启 2-关闭
        camera: { //视频监测报警
            status: number //1-开启 2-关闭
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
}


// 智能外呼策略
export interface OutboundStrategyEntity {
    intensity: { //烈度速报
        status: number //1-开启 2-关闭
        magnitude: number //震级
        intensity: number //烈度
    }
    landslide: { //滑坡
        status: number //1-开启 2-关闭
        monitor: { //仪器监测预警
            status: number //1-开启 2-关闭
            judgeStatus: number //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    waterAccum: { //积水
        status: number //1-开启 2-关闭
        camera: { //视频监测报警
            status: number //1-开启 2-关闭
            judgeStatus: number //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    fire: { //火情
        status: number //1-开启 2-关闭
        subTypes: number[] //火情类型(有则表示选择)  2-森林火灾 3-草原火灾
    }
}

// 短信通知策略
export interface SmsStrategyEntity {
    landslide: { //滑坡
        status: number //1-开启 2-关闭
        weather: { //仪器监测预警
            status: number //1-开启 2-关闭
            hours: number[] //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    mudslide: { //泥石流
        status: number //1-开启 2-关闭
        weather: { //仪器监测预警
            status: number //1-开启 2-关闭
            hours: number[] //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    flashflood: { //山洪
        status: number //1-开启 2-关闭
        weather: { //仪器监测预警
            status: number //1-开启 2-关闭
            hours: number[] //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    subsidence: { //山洪
        status: number //1-开启 2-关闭
        weather: { //仪器监测预警
            status: number //1-开启 2-关闭
            hours: number[] //研判状态 1-不选(自动报研判报都不要) 2-研判报
            triggerLevel: number //触发等级 5-红,4-橙,3-黄,2-蓝
        }
    }
    intensity: { //烈度速报
        status: number //1-开启 2-关闭
        magnitude: number //震级
        intensity: number //烈度
    }
}

// 智能外呼/短信配置的人员
export interface StaffEntity {
    id: number //外呼人员的数据库编号
    name: string //姓名 eg.张三
    title: string //称谓 eg.张局长
    department: string //部门
    position: string //职务
    phone: string //手机号码
    notes: string //备注
    createdAt: number //添加时间戳(s)

    inGroup: number //1-在当前组 2-不在当前组

    // app
    enterprise?: string   //所属单位
    status?: number // 1-正常，2-禁用

    strategyType: number // 策略类别
    district: string
    towns: string[]
}

export interface CustomerInfo {
    createdAt: number //创建时间戳(s)
    enterpriseName: string //单位名称
    enterpriseArea: string //单位区域 eg."四川省/成都市/武侯区"
    enterpriseAddress: string //单位详细地址
    projectName: string //项目名称
    projectType: number //项目类型 1-商业试用 2-商业正式 3-公益
    serviceFrom: number //服务开始时间戳(s)
    serviceTo: number //服务结束时间戳(s)
    account: string //账号
    password: string //密码
}

type RRain = {
    value: number
    lng: number,
    lat: number
}

export interface RegionRain {
    province: RRain[],
    city: RRain[],
    county: RRain[]
}

export interface MonitorStrategyEntity {
    owners: string[], //设备所属单位
    manageStatus: 1 | 2 //监测信息管理页面 1-开启 2-关闭
}
export interface VisualizationStrategyEntity {
    visualStatus: 1 | 2 //可视化首页 1-开启 2-关闭
}

export type DrillnStrategyEntity = CurrentUserConfig['strategy']['drill']
export interface VisualizationStatisticsEntity {
    levels: { //等级统计
        red: number
        orange: number
        yellow: number
        blue: number
    }
    eventTypes: { //灾种统计
        eventType: number //灾害类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
        count: number //数量
    }[]
    areas: { //地区统计，返回的结果按count倒序排序
        area: string //区域名称
        count: number //数量
    }[]
}
export type VisualizationCountsEntity = {
    id: number
    area: string  //省份名称
    eventType: number //灾害类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
    red: number
    orange: number
    yellow: number
    blue: number
}

export type DrillEntity = {
    drillName: string
    channels: {
        channel: number  //渠道 1-多灾种预警平台 2-短信 3-智能外呼
        staffNum: number //所选人员数量
        staffIds: number[] //所选人员id
    }[]
    emergency: { channel: number }[]
    drillStatus?: Sw
} & DisasterEntity

/** 预警研判审核概览 */
export type JudgeOverview = {
    //待研判类型，等级，数量
    toCounts: {
        eventType: number //事件类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
        level: number //【最新报】风险等级 红-5、橙-4、黄-3、蓝-2 
        count: number //事件数
    }[],
    //待研判区域数量分布
    toAreas: {
        area: string //区域名称
        count: number //数量
    }[],
    //已研判/预警事件类型，等级，数量
    counts: {
        eventType: number //事件类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
        maxLevel: number //最高风险等级 红-5、橙-4、黄-3、蓝-2 (研判次数时为研判报等级，预警事件时为最大报等级)
        count: number //事件数
    }[],
    //已研判/预警事件区域数量分布
    areas: {
        area: string //区域名称
        count: number //数量
    }[],
    // 近一年研判审核数据趋势统计
    // 近1年统计，横轴按月份统计；
    // 近3个月统计，按照10天
    // 近1个月统计，按照3天；
    // 近7天统计，横轴按照1天
    // 今日统计，显示一个点
    //趋势统计
    freq: {
        time: string // 小时，天，月份字符串
        count: number //事件数
    }[]
    //已研判预警事件图标
    events: JudgeDisasterEntity[]
}

export type JudgeEntity = Pick<DisasterEntity,
    'location' | 'longitude' | 'latitude' | 'level' | 'eventType' | 'createdAt' |
    'areaCode' | 'eventId'
> & {
    populationHeatNum: number // 人口热力数
    //WaterState number   `json:"waterState"` //是否有积水 0-有积水深度(depth>=0)，1-无积水，2-有积水
    depth: number     //积水深度 (只有当WaterState为0有积水深度时，depth才有意义；当WaterState不为
    detail: string  //详细说明
    judgeAccount: string //研判人账号
    isJudged: number //1-未研判,2-已研判
    judgeAt: number //研判时间(当有值时为已研判)
    latestReportAt: number //事件最新报的时间，判断事件是否更新、可以再次研判
    waterLevel: number //河道洪水水深
    fire?: {
        subtype: number
    }
}
export type JudgeDisasterEntity = DisasterEntity & {
    isJudged: number //1-未研判,2-已研判
    judgeAt: number
    populationHeatNum: number // 人口热力数
    //WaterState number   `json:"waterState"` //是否有积水 0-有积水深度(depth>=0)，1-无积水，2-有积水
    reportId: number
    detail: string
    pastRainSum?: number
    futureRainSum?: number
}


/** 预警发布概览 */
export type PublishOverview = Omit<JudgeOverview, 'events' | 'counts' | 'freq'> & {
    //已发布预警事件图标
    list: PublishEntity[]
    counts: {
        eventType: number //事件类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
        level: number //最高风险等级 红-5、橙-4、黄-3、蓝-2 (研判次数时为研判报等级，预警事件时为最大报等级)
        count: number //事件数
    }[],
    freq: {
        time: string // 小时，天，月份字符串
        eventType: number//事件类型 1-林草火灾 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
        count: number //事件数
    }[]
    sendPercents: {
        publishType: number  //1预授权自动发布（直接系统就发送了），2研判后手动发布，3研判后自动发布（暂无）
        success: number //已送达数量 
        fail: number    //未送达数量
    }[]
}

export type PublishEntity = JudgeEntity & {
    id: number
    isPublished: number //1.已发布 2.未发布
    number: number //第几次发布

    approver: string //签批人
    approveAt: number  //签批时间戳
    approveNote: string //备注

    publisher: string //发布人名字
    publishAt: number  //发布时间戳s
    publishType: number  //1预授权自动发布（直接系统就发送了），2研判后手动发布，3研判后自动发布（暂无）

    publishNums: {
        channel: number   //渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
        success: number //发送成功总数
        fail: number //发送失败总数
        toBeConfirmed: number // 待确认的总数
        isConfirmed: number // 是否已确认 1.已确认
        rings: number // 智能外呼接通个数
    }[]

    judgeId?: number //查询时使用，关联研判的最新发布
    riverflood?: RiverfloodInfo['riverflood']
    waterAccum?: WaterAccumInfo['waterAccum']
    channel?: ChannelType
}

export type StaffInGroup = {
    id: number
    name: string //姓名
    phone: string
    groupId: number  //组ID
    groupName: string //组名
    isRecv: 1 | 2 | 3 //1接收到,2未接收 3.待确认
    CallBackMes: ICallback
    notifyWay?: number // 通知方式 2-短信 3-智能外呼
    endType: number
}
interface ICallback {
    memberId: number        // 号码唯一标识，实时呼叫调用时，号码返回的对应标识
    callbackType: number    // 回调数据类型， 0-任务呼叫单通电话回调 1-号码组终态回调 2-任务状态变更回调 3-实时呼叫单通电话回调
    record: IRecord[]       // 会话还原记录
    endType: number         // 接通状态 1-已接通 0-未接通
    endTypeReason: string   // 未接通原因
    ringStartTime: number   // 振铃开始时间-Unix时间戳(单位:毫秒)
    endTime: number         // 呼叫结束时间-Unix时间戳(单位:毫秒)
    ringingTimeLen: number
}

interface IRecord {
    role: 'speech' | 'voice' //会话角色，分为机器人侧（speech）和客户侧（voice）
    timestamp: number       //会话时间戳，微秒
    contextText: string     //会话文本
}

export type WebUserRoleEntity = {
    id: number    //角色ID
    roleName: string   //角色名字(可改变),每个项目里唯一
    isAdmin: number    //1表示子系统管理员 //2表示子系统普通角色
    operator: string   //最近操作人
    createdAt: number    //创建时间戳(s)
    permission: string[] //角色的页面权限,前端使用
}

export type WebUserEntity = {
    id: number
    account: string //外呼人员账号
    password: string   //登录密码
    name: string //姓名 eg.张三
    department: string //部门
    position: string //职务
    phone: string //手机号码
    createdAt: number //添加时间戳(s)

    roleId: number   //角色ID（角色名前端自己对应起来）
    isAdmin: number    //1表示子系统管理员 //2表示子系统普通角色
    operator: string   //最近操作人
    disable: number //1未禁用 //2已禁用
    note: string
    isTerminal: number //是否为终端账号1是2否
}

// 手动发布
export type ManualPublishEntity = {
    persons: {
        staffId: number       //发布对象
        groupId: number       //发布对象组ID
        channel: number       //发布的渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
    }[],
    disasterType: string
    approver: string //签批人
    approveAt: number  //签批时间戳
    approveNote: string //备注
    content: string //发布内容
    signature: string //署名
}

// app管理
export type AppVersionEntity = {
    version: string	// 版本号 
    upgradeId: number	// 升级序号，序号值越大，版本越高
    forceUpgrade: number | string	// 是否强制升级，1-是；其他值-否
    note: string		// 更新描述
    createdAt: number // 更新时间
    status: number | string  //状态，1正常2已禁用
    file: string		// 文件名
    apkUrl: string	// 文件下载url
}

// app用户
export type AppUserEntity = {
    id?: string
    phone: string //
    name: string //
    enterprise: string //
    department: string //
    position: string //
    notes: string //
    status: number // 状态，1正常2禁用
    createdAt: number //
    password: string //
    online?: boolean
    userType: number // 是否为管理员 1 是 2 否
    latestLogin: number // 最后登录时间
}

export type PatrolTackEntity = {
    id: number
    patrolPlanId: number
    names: string
    points: IPointsList[]
    startAt: number
    patrolStatus: number
    startTime: number,//   int 巡查开始时间
    endTime: number//
}

// 途径点
export interface IPointsList {
    no: number, //int
    name: string,//  string途经点名称
    lat: number,
    lng: number
}

export interface IPosition {
    lat: number
    lng: number
    name?: string
}
export interface ITrack extends IPosition {
    name: string
    imgurl: string
    checkInName: string
    status: number

}

//////////////////////////////////////// 应急预案
export interface PlanCitySideEntity {
    id?: number
    refugeName: string            //避难所名称
    refugeLocation: string        //避难所地址
    refugeLabels: string[]        //避难所标签
    refugeArea: number          //占地面积（平方米）
    refugeNumber: number           //容纳人数
    refugeContact: string         //联系人
    refugeContactPhone: string         //联系电话
    refugePics?: string[]       //避难所图片url
}

export interface DangersEntity {
    id?: number
    dangerName: string           //危险源名称
    dangerLocation: string        //危险源地址
    dangerLevel: string         //危险源等级
    dangerContact: string      //联系人
    dangerContactPhone: string    //联系电话
    dangerPics?: string[]
}

export interface EmergencyPointsEntity {
    id?: number
    potentialName: string            //隐患点名称
    potentialLocation: string        //隐患点地址
    potentialLevel: string          //隐患等级
    potentialType: string          //隐患点等级
    potentialNumber: number           //威胁人数
    potentialContact: string         //联系人
    potentialContactPhone: string    //联系电话
    potentialPics?: string[]         //隐患点图片url
}

export interface GroupPersonEntity {
    groupName: string //组名
    groupDuty: string //小组职责
    groupPersons: SingleGroupPersonEntity[]
}

export interface SingleGroupPersonEntity {
    id: string
    ptype: string       //人员级别
    name: string       //人员名称
    position: string    //职位
    phone: string
    spare: string        //备用联系人
    sparePhone: string     //备用联系电话
    duty: string       //职责
    notices: string[]     //通知方式 
    content: string      //通知内容
}

export interface LevelResponseEntity {
    id?: number
    eventType: number     //事件类型 1-火情 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
    level?: number     //等级 5-红 4-橙 3-黄 2-蓝 1-低风险
    magnitude?: number  //预警震级
    maxIntensity?: number  //最大烈度
    respLevel: number   //响应等级
    note?: string   //响应等级说明
    measure?: string   //响应措施
    rescues?: GroupPersonEntity[]
}
export interface PlanContentEntity {
    titleText: string
    content: string
    column: string | null
    key: string
    title?: any
    children?: PlanContentEntity[]
}
export interface PlanEntity {
    id?: number
    name: string          //预案名称
    enterprise: string         //编制单位
    createdAt: null | number          //编制时间
    account: string         //编制人
    delStatus?: number            //1正常 2删除
    currentTab: number
    content?: PlanContentEntity[]         // 预案文本
    refuges?: PlanCitySideEntity[] // 避难场所
    dangers?: DangersEntity[] // 危险源
    potentials?: EmergencyPointsEntity[] //隐患点
    rescues?: GroupPersonEntity[] // 小组
    planResponses?: LevelResponseEntity[]// 分级响应
    postProcess?: string         // 后期处置
}
export interface IPlanItems {
    triggerLevel: number, //5-红 4-橙 3-黄 2-蓝 1-低风险
    alertType: number, ////预警类型 1-预报预警、2-监测报警
    judgeStatus: number,//生产方式研判状态 1-自动报 2-研判报
    planID: number,//预案自增id
}
export interface PlanConfig {
    id?: number,
    intensity: {
        intensity: number
        magnitude: number
    }[],
    intensityStatus: Sw,
    water: IPlanItems[],
    waterStatus: Sw,
    flashFloodStatus: Sw,
    flashFlood: IPlanItems[],
    landslide: IPlanItems[],
    landslideStatus: Sw,
    mudslide: IPlanItems[],
    mudslideStatus: Sw,
    collapse: IPlanItems[],
    collapseStatus: Sw,
    fire: IPlanItems[],
    fireStatus: Sw
}

export interface PlanStartListEntity {
    id?: number,
    eventType: number,
    level: number,
    levelForEarthquake: number,
    magnitude: number,
    planID: number,
    name: string,
    createdAt: number,
    investigation?: string[],
    summary?: string[]
}

export interface PlanRecordReceive {
    id: number,
    emergencyPlanRecordId: number,
    channel: number,
    name: string,//通知对象
    position: string,//职位
    isRecv: number //是否送达 1-成功 2-失败
    isAnswer: number //是否接听 1-已接听 2-未接听（智能外呼预留字段）
    createdAt: number//发送时间戳(s)
}

export interface PlanRecordStatistics {
    sendAt: number,
    outLine: {
        recvSuccessNum: number,
        recvFailNum: number,
        answerSuccessNum: number,
        answerFailNum: number
    },
    sms: {
        recvSuccessNum: number,
        recvFailNum: number,
        answerSuccessNum: number,
        answerFailNum: number
    }
}
// ********************** 应急值班 **********************
// 概览-值班统计
export interface ScheduleOverview {
    type: {
        staffTypeId: number // 人员类型
        count: number
    }[]
    list: {
        departmentId: number //值班单位
        staffName: string //值班人员
        staffTypeId: number //人员类型，eg.主班
        workdayNum: number //工作日次数
        weekendNum: number //休息日次数
        holidayNum: number //节假日次数 
    }[]
}
// 概览-值班工作统计
export interface RecordOverview {
    record: { //值班记录类型统计
        recordTypeId: number //记录类型
        count: number //数量
    }[]
    affair: { //值班事务类型统计
        affairTypeId: number //记录类型
        count: number //数量
    }[]
    recordStatus: { //值班记录处理情况统计
        status: number //状态，1-未处理 2-已处理
        count: number //数量
    }[]
    shiftStatus: { //交接班记录处理情况统计
        status: number //状态，1-未处理 2-已处理
        count: number //数量
    }[]
}


export interface BasicSettingEnumEntity {
    id?: number
    type?: number //枚举类型 1-记录类型 2-事务类型 3-人员类型 4-值班单位
    name: string //枚举名称
    status: number //状态，1-开启 2-关闭
    order: number //排序值，数字越小排序越靠前
    operator?: string //操作人
    createdAt?: number //创建时间，时间戳(s)
    updatedAt?: number //更新时间，时间戳(s)
}

export interface BasicSettingWorkEntity {
    id?: number
    departmentId: number //值班单位
    rule: number //值班规则，1-顺序制 2-交替制
    strategies: {
        dateType: number // 日期类型，1-工作日 2-休息日 3-节假日
        staffTypeId: number // 人员类型
        classId: number // 班次名称
    }[]
    notes: string //备注
    operator: string //操作人
    createdAt: string //创建时间，时间戳(s)
    updatedAt: string //更新时间，时间戳(s)
}

export interface BasicSettingShfitEntity {
    id?: number //id
    className: string //班次名称
    timePeriod: string //时间范围
    notes: string //备注
    operator: string //操作人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)
}

export interface BasicSettingEmployeeEntity {
    id?: number //id
    departmentId: number //值班单位
    staffName: string //值班人员
    position: string //职位
    staffTypeId: number //人员类型，eg.主班
    staffStatus: number //人员状态，1-值班 2-不值班
    phone: string //联系电话
    order: number //排序值
    operator: string //操作人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)
    disableStatus?: number
}

export interface BasicSettingDateEntity {
    id?: number //id
    startAt: number //开始时间，时间戳(s)
    endAt: number //结束时间，时间戳(s)
    dateType: number //日期类型，1-工作日 2-休息日 3-节假日
    leaveType: string //假期类型，eg.国庆节
    notes: string //备注
    operator: string //操作人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)
}

export interface EmergencyWorkList {
    id?: number //id
    recordTypeInfo?: {
        recordTypeId: number,
        recordType: string
    }  //记录类型
    recordTypeId?: number
    affairTypeInfo?: {
        affairTypeId: number,
        affairType: string
    } //事务类型
    affairTypeId?: number
    source: string //来源
    occurAt: number //发生时间，时间戳(s)
    contactName: string //联系人
    contactPhone: string //联系电话
    content: string //内容
    fileAddrs?: string[] //文件地址，其中频地址格式如下:"视频封面地址;视频地址"
    status: number //状态，1-未处理 2-已处理
    operator: string //登记人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)
    dealRecords?: DealRecords[]
    dealRecordIds?: number[]
}

export interface DealRecords {
    id?: number //处理记录id
    content: string //处理内容
    fileAddrs?: string[] //文件地址
    operator: string //处理人
    createdAt: number //处理时间，时间戳(s)
}

export interface HandoverListEntity {
    id?: number //id
    content: string //注意事项
    operator1: string //登记人
    createdAt: number //登记时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)
    status: number //状态，1-未处理 2-已处理
    result: string //处理结果
    operator2: string //处理人
    dealAt: number //处理时间，时间戳(s) 
}

export interface EmergencyStartEntity {
    id?: number //id
    eventId: string //事件Id
    createdAt: number //预警时间戳(s)
    reportType: number //报类型 1-自动报 2-研判报
    eventType: number //事件类型 1-火情 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
    warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
    level: number //风险等级 5-红 4-橙 3-黄 2-蓝 1-低风险
}

export interface LinkRecordDetail {
    send: {
        sendAt: number
        sendStatistics: SendStatistics[]
    }
    list: SendList[]
}
interface SendStatistics {
    channel: number
    recvSuccessNum: number // 发送成功数量
    recvFailNum: number // 发送失败数量
    answerSuccessNum: number // 已接通数量
    answerFailNum: number // 未接通数量
    needCallBackNum: number // 待确认数量
}
interface SendList {
    id: number
    linkageRecordId: number // 预警联动记录id
    channel: number
    name: string
    department: string
    isRecv: number // 是否送达 1-成功 2-失败
    endType: number // 是否接通 1-已接通 2-未接通 
}
export interface StrategyConfigEntity {
    id?: number //id
    departmentId: number //值班单位
    landslide: { //滑坡
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: string //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }
    mudslide: { //泥石流
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: string //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }
    flashflood: { //山洪
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: number //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }[]
    waterAccum: { //积水
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: number //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }[]
    collapse: { //崩塌
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: number //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }[]
    fire: { //火情
        status: number //状态，1-开启 2-关闭
        strategies: {
            triggerLevel: number //触发等级 5-红 4-橙 3-黄 2-蓝 1-低风险
            warnType: number //预警类型 1-预报预警 2-监测预警 3-监测报警
            reportType: number //报类型 1-自动报 2-研判报
            staffTypeId: number //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }[]
    intensity: { //烈度速报
        status: number //状态，1-开启 2-关闭
        strategies: {
            intensity: number //触发烈度
            magnitude: number //触发震级
            staffTypeId: number //人员类型，eg.主班
            channel: number //通知渠道 1-多灾种预警平台 2-短信 3-智能外呼 暂时没有1
            content: string //通知内容
        }[]
    }[]
    operator: string //登记人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)  
}

export interface WorkManageEntity {
    id?: number //id
    dateAt: number //日期，时间戳(s)
    week: string //星期
    departmentId: number
    staffInfo: {
        [x: string]: any;
        staffId: number //人员id
        staffName: string //值班人员
        position: string //职位
        staffTypeId: number //人员类型，eg.主班
        staffStatus: number //人员状态，1-值班 2-不值班 
        phone: string //联系电话
    }
    classId: number //班次id
    department?: string
    staffName?: string //值班人员
    className?: string //班次名称
    notes: string //备注
    operator: string //操作人
    createdAt: number //创建时间，时间戳(s)
    updatedAt: number //更新时间，时间戳(s)   
}

export interface IWorkManage {
    id?: number // (列表模式下传入)
    departmentId: number | null //值班单位
    dateAt: number //日期，使用当日23:59:59的时间戳(s)方便编辑时校验
    week: string //星期
    schedules: {
        staffId: string | number //值班人员id
        classId: string //班次名称
    }[]
    notes: string //备注
}

export interface IntensityListQuery {
    location: string   //震中位置
    maxMag: number  //最大震级
    minMag: number  //最小震级
    maxIntensity: number  //最大烈度
    minIntensity: number  //最小烈度
}

export interface IntensityListEntity {
    eventId: string //预警告警事件id
    location: string //地点
    longitude: number //经度
    latitude: number //纬度
    startAt: number //发震时刻
    magnitude: number //震级
    maxIntensity: number //最大烈度
    createdAt: number //发报时刻
    latestUpdateType: number //当前状态
}

export interface IntensityUpdateRecord {
    updateType: number
    createdAt: number
}

export interface ITerminalQuery {
    name: string
    account: string
}
export interface ITerminalEntity {
    id?: number //账号id
    account: string //外呼人员账号
    password: string
    name: string //姓名 eg.张三
    department: string //部门
    address: string //地址
    createdAt?: number //添加时间戳(s)
    operator?: string   //最近操作人
    isTerminal?: number //1、是2、否
    note: string //
}

export interface IUploadEntity {
    name: string
    uid?: number | string
    url: string
    fileUrl?: string,
    status: 'done' | 'error'
}

export interface Quake {
    type: PlayType
    eventId: string
    updates: number
    longitude: number
    latitude: number
    depth: number
    level: number
    magnitude: number
    startAt: number
    updateAt: number
    intensity: number
    distance: number
    countdown: number
    epicenter: string
}

export interface HomeRecord {
    originalCode?: string; // 设备编号
    eventId: string // 事件Id
    eventType: number // 事件类型 5-烈度速报 7-积水
    reportType: number // 报类型 1-自动报 2-研判报 
    warnType: number // 预警类型 1-预报预警 2-监测预警 3-监测报警 4-人工上报
    sourceType: number // 数据源类型 1-仪器 2-卫星 3-视频 4-气象
    updateType: number // 更新类型 烈度速报(1-自动报 2-更新报 3-修正报) 其他(1-首报 2-更新报 3-解除报)
    level: number // 风险等级 5-红 4-橙 3-黄 2-蓝 1-低风险
    location: string // 预警告警位置
    longitude: number // 经度
    latitude: number // 纬度
    areaCode: number // 行政区域编码
    createdAt: number // 提示时间戳(s)
    depth: number
    waterAccum: { // 针对积水
        waterState: number // 是否有积水 0-有积水深度(depth>=0)，1-无积水，2-有积水
        depth: number // 积水深度
    }
    intensity: { // 针对烈度速报
        startAt: number // 发震时间戳(s)
        magnitude: number // 预警震级
    }
    deviceId?: string
    lng?: number
    lat?: number
}

export interface IntensityRecord {
    eventId: string
    location: string
    createdAt: number
    startAt: number
    latitude: number
    intensity: number
    longitude: number
    magnitude: number
    maxIntensity: number
    latestUpdateType: number
}

/**地震预警记录 */
export type EarthquakeEntity = {
    eventId: number //事件身份标识
    updates: number //最终报报数
    epicenter: string //震中位置
    startAt: number //发震时刻
    longitude: number //经度
    latitude: number //纬度
    magnitude: number //震级
    depth: number //震源深度
    updateAt: number //发报时刻/更新时间
    drill: boolean //是否为演习
    notice?: number

    // 以下字段在服务端计算时带有
    distance: number //震中距(单位:公里)
    countdown: number //倒计时
    intensity: number //预估烈度
    target: string  //目标地址
    eventType?: EventType
    level?: number
    originalCode?: number
    drill?: boolean
    target?: string
    hasReplay: boolean
}

export type ProjectConfigEntity = {
    /**行政区域编码 */
    code: number,
    /**行政区域 */
    name: string,
    /**行政区域简称 */
    raw: string,
    /**平台标题 */
    title: string,
    bureau: {
        /**单位名称 */
        name: string,
        /**经纬度 */
        location: { lat: number, lng: number },
    },
    /**菜单 */
    menu: {
        type: 'long' | 'mini',
        exclude: MemuItem[]
        reportName: string
        hasReport: boolean
        order: MemuItem[]
    }
    /**是否按自定义区域统计设备 */
    custom: boolean
}

export type WsCalEarlywarningEntity = {
    eventId: number       //地震id
    longitude: number   //经度
    latitude: number   //维度
    depth: number    //深度
    epicenter: string   //震中位置
    startAt: number      //发震时刻
    updateAt: number      //更新时刻
    magnitude: number    //震级
    updates: number //第几报
    update?: number
    drill: boolean  //是否演习 true:演习 false:正式
    distance: number  //震中距 km
    countdown: number  //预警时间 s
    intensity: number  //预估烈度
    target: string  //目标地址
    notice: number  //通知类型 1：小弹窗 2：全屏通知
    voice: boolean  //是否播放声音 true:是 false:否
    nearbyTargets: WsNearbyTarget[]
}

export interface IntensityEntity {
    name: string// 演习名称
    report: boolean;
    smsSimple: string;
    term: number;
    towns: any[];
    townsLocal: any[];
    id: number; //烈度速报id
    eventId: number; //地震id
    longitude: number; //经度
    latitude: number; //维度
    depth: number; //深度
    epicenter: string; //震中位置
    startAt: number; //发震时刻（距1970的毫秒数）
    updateAt: number; //更新时刻（距1970的毫秒数）
    magnitude: number; //震级
    type: number; //报数 1:自动烈度速报 2:更新报 3:修正报，对演习无效
    maxIntensity: number; //最大烈度
    publishAt: number; //发布时间 （距1970的毫秒数）
    irregulars: {
        intensity: number; //烈度
        points: {
            latitude: number;
            longitude: number;
        }[];
        color: string; //颜色
    }[];
    areas: {
        intensity: number; //烈度
        area: number; //面积
    }[];
    //本地面积分布
    areasLocal: {
        intensity: number; //烈度
        area: number; //面积
    }[];
    sms: string; //短信内容
    smsLocal: string; //短信内容
    smsBasic: string;
    counties: {
        name: string; //名称
        longitude: number; //经度
        latitude: number; //纬度
        dintance: number; //震中距
    }[];
    zoom: number; //地图缩放级别
    center: {
        longitude: number;
        latitude: number;
    };
    thermodynamic: string; //热力图数据 自动报没有
    //热力图圈人数
    popDist: {
        intensity: number;
        population: number;
    }[];
    //本地热力图圈人数
    popDistLocal: {
        intensity: number;
        population: number;
    }[];
    pointWeather: WeatherRecord;
    townDistLocal: IntensityDetailRecord[];
    thresholdIntensity: number;
    regions: {
        //震区受影响的地区分布
        intensity: number; //烈度
        provinces: {
            //受影响的省
            province: string;
            cities: {
                //受影响的市州
                city: string;
                counties: {
                    //受影响的区县
                    county: string;
                    regions: {
                        //受影响的乡镇
                        code: number;
                        parentCode: number;
                        full_name: string;
                        province: string;
                        city: string;
                        county: string;
                        longitude: number;
                        latitude: number;
                        level: number;
                        distance: number;
                        intensity: number;
                    }[];
                }[];
            }[];
        }[];
    }[];
    regionsLocal: {
        //本地受影响的地区分布
        intensity: number; //烈度
        provinces: {
            //受影响的省
            province: string;
            cities: {
                //受影响的市州
                city: string;
                counties: {
                    //受影响的区县
                    county: string;
                    regions: {
                        //受影响的乡镇
                        code: number;
                        parentCode: number;
                        full_name: string;
                        province: string;
                        city: string;
                        county: string;
                        Longitude: number;
                        latitude: number;
                        level: number;
                        distance: number;
                        intensity: number;
                    }[];
                }[];
            }[];
        }[];
    }[];
}

// 研判后自动发布策略
export interface JudgeStrategyEntity {
    judgeStrategyType?: UserChannelType //策略类型 1-默认策略 2-自定义策略
    judgeDistrict?: string //区域 eg.市中区
    judgeTowns?: string[]
    judgeFire: { //火情
        status: Sw //1-开启 2-关闭
        subTypes?: number[] //火情类型(有则表示选择)  2-森林火灾 3-草原火灾
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    judgeLandslide: { //滑坡-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    judgeMudslide: { //泥石流-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    judgeFlashflood: { //山洪-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    judgeWaterAccum: { //积水
        status: Sw //1-开启 2-关闭
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    judgeCollapse: { //崩塌-只有设备监测报警，todo: 内江没有崩塌设备，问过产品暂时不处理
        status: Sw //1-开启 2-关闭
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
}

export interface AutoStrategyEntity {
    strategyType?: UserChannelType,
    district?: string //区域 eg.市中区
    towns?: string[],
    intensity: { //烈度速报
        status: Sw //1-开启 2-关闭
        magnitude?: number //震级
        intensity?: number //烈度
    }
    landslide: { //滑坡-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    mudslide: { //泥石流-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    collapse: { //崩塌-只有设备监测报警，todo: 内江没有崩塌设备，问过产品暂时不处理
        status: Sw //1-开启 2-关闭
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    flashflood: { //山洪-气象预报预警
        status: Sw //1-开启 2-关闭
        hours?: number[] //气象预报时段
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    waterAccum: { //积水
        status: Sw //1-开启 2-关闭
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
    fire: { //火情
        status: Sw //1-开启 2-关闭
        subTypes?: number[]//火情类型(有则表示选择)  2-森林火灾 3-草原火灾
        triggerLevel?: number //触发等级 5-红,4-橙,3-黄,2-蓝 
    }
}