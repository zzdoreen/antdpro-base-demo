import { isDrillMapPage } from '@/utils/tools'
import colors from './variable.less'

export const FormatDate = "YYYY-MM-DD HH:mm:ss"
export interface OptionType {
    value: number,
    label: string,
    order?: number //展示的排序
    status?: number
}

export interface OptionTypeWithCount extends OptionType {
    count: number
}

export const DrillStatusOptions: OptionType[] = [
    {
        value: 1,
        label: '已完成'
    },
    {
        value: 2,
        label: '未开始'
    }
]

export const LevelOptions: OptionType[] = [
    {
        value: 5,
        label: '红色'
    },
    {
        value: 4,
        label: '橙色'
    },
    {
        value: 3,
        label: '黄色'
    },
    {
        value: 2,
        label: '蓝色'
    },
    {
        value: 1,
        label: '低风险'
    }
]
export const LevelOptionsWithHazard = [
    ...LevelOptions,
    {
        value: 0,
        label: '地灾隐患点'
    }

]

export enum PlayType {
    Playback = 1,
    Realtime
}

export enum Level { // 预警等级
    HAZARD = 0,
    GRAY = 1,
    BLUE,
    YELLOW,
    ORANGE,
    RED,
}

export enum EventType { // 灾害类型
    FIRE = 1,
    LANDSLIDE,
    MUDSLIDE,
    SUBSIDENCE,
    INTENSITY,
    FLASHFLOOD = 6,
    WATERACCUM,
    COLLAPSE, //崩塌
    RIVERFLOOD = 9, //河道洪水
}


export const DisasterOptions: OptionType[] = [
    {
        value: 1,
        label: '林草火灾',
        order: 7
    },
    {
        value: 2,
        label: '滑坡',
        order: 2
    },
    {
        value: 3,
        label: '泥石流',
        order: 3
    },
    // {
    //     value: 4,
    //     label: '沉降',
    //     order: 4
    // },
    {
        value: 5,
        label: '地震',
        order: 1
    },
    {
        value: 6,
        label: '山洪',
        order: 5
    },
    {
        value: 7,
        label: '积水',
        order: 6
    },
    {
        value: 8,
        label: '崩塌',
        order: 8
    }
    // {
    //     value: 9,
    //     label: '河道洪水',
    //     order: 9
    // }
].sort((a, b) => a.order - b.order)

export const All_Disasters = DisasterOptions.map(e => e.value)

export const DisasterWithHours = [EventType.LANDSLIDE, EventType.MUDSLIDE, EventType.COLLAPSE, EventType.SUBSIDENCE, EventType.FLASHFLOOD]

export const FloodDisaters = [EventType.FLASHFLOOD, EventType.WATERACCUM]
export const GeoDisaters = [EventType.LANDSLIDE, EventType.MUDSLIDE, EventType.COLLAPSE,]
export const FireDisaters = [EventType.FIRE]

/**
 * hour>=2时存在的地质灾害预警类型
 */
export const OtherDisasterOptions: OptionType[] = getDynamicOptions(DisasterOptions, DisasterWithHours)

export function getDisasterOptions(eventTypes: EventType[] | undefined, hour: number) {
    const eventTypeOptions = eventTypes ? getDynamicOptions(DisasterOptions, eventTypes) : DisasterOptions
    if (hour > 0) {
        return eventTypeOptions.filter(e => DisasterWithHours.includes(e.value))
    }
    return eventTypeOptions
}

export const RiskOptions: OptionType[] = [
    {
        value: 5,
        label: '极高'
    },
    {
        value: 4,
        label: '高'
    },
    {
        value: 3,
        label: '较高'
    },
    {
        value: 2,
        label: '较低'
    }
]
export const getUpdateTypeOptions = (eventType?: EventType, omitLast?: boolean) => eventType === EventType.INTENSITY
    ?
    [
        {
            value: 1,
            label: '自动报'
        },
        {
            value: 2,
            label: '更新报'
        },
        {
            value: 3,
            label: '修正报'
        }
    ]
    :
    [
        {
            value: 1,
            label: '首报'
        },
        {
            value: 2,
            label: '更新报'
        },
        {
            value: 3,
            label: '更新报'
        }
    ].slice(0, omitLast ? 2 : 3) as OptionType[]

export const UpdateTypeOptionsWithComplexedLabel = getUpdateTypeOptions(EventType.INTENSITY)
    .map(e => e.value == 1 ? { ...e, label: '首报/' + e.label } : e)
//更新类型 烈度速报(1-自动报 2-更新报 3-修正报) 其他(1-首报 2-更新报 3-解除报)
export enum UpdateType {
    AUTO = 1,
    UPDATE,
    REVISE,
    FIRST = 1,
    LAST = 3
}

export const LevelColor = {
    [Level.RED]: colors.red,
    [Level.ORANGE]: colors.orange,
    [Level.YELLOW]: colors.yellow,
    [Level.BLUE]: colors.blue,
    [Level.GRAY]: colors.hazard,
    [Level.HAZARD]: colors.hazard
}
export function getNameByListId(list: OptionType[], value: number) {
    return list.find(e => e.value === value)?.label || ''
}
export function getOrderByListId(list: OptionType[], value: number) {
    return list.find(e => e.value === value)?.order
}

/**
 * 
 * @deprecated 用getvalueEnumMap代替
 * @param list 字典表
 * @param available 可选的动态数组，默认为全部
 * @returns 用于protable的valueMap
 */
export function getvalueEnum(list: { label: string, value: number }[], availables?: number[]) {
    let l = list
    if (availables) {
        l = availables.map(value => ({ value, label: getNameByListId(list, value) }))
    }
    return l.reduce((pre, cur) => {
        // eslint-disable-next-line no-param-reassign
        pre[cur.value] = cur.label
        return pre
    }, {})
}

/**
 * 
 * @param list 字典表
 * @param available 可选的动态数组，默认为全部
 * @returns 用于protable的valueMap
 */
export function getvalueEnumMap(list: { label: string, value: number }[], availables?: number[]) {
    const m = new Map<number, string>()
    if (availables) {
        availables.forEach(value => {
            m.set(value, getNameByListId(list, value))
        })
    } else {
        list.forEach(({ label, value }) => {
            m.set(value, label)
        })
    }
    return m
}

/**
 * 
 * @param list 字典表
 * @param available  动态数组
 * @returns 动态的options
 */
export function getDynamicOptions(list: OptionType[], availables: number[]) {
    let opts: typeof list = []
    if (availables) {
        opts = list.filter(({ value }) => availables.includes(value))
    }
    return opts
}

export const Colors = colors as {
    red: string
    orange: string
    yellow: string
    blue: string
    gray: string
    hazard: string
    primaryColor: string
    success: string
    online: string
    offline: string
}

export const disasterChartColors = ['#FF5E34', '#FFA834', '#398CFF', '#5FB2F7', '#3DDBD9', '#945FB9', '#E0529C', '#b95f84']

export const TargetOptions: OptionType[] = [
    {
        value: 1,
        label: '杆塔'
    },
    {
        value: 2,
        label: '变电站'
    },
    {
        value: 3,
        label: '生活生产场所'
    }
]
export enum Target {
    TOWER = 1,
    STATION,
    BUILDING
}

export enum AlgorithmType {
    RAIN = "Q-01",// 降雨算法
    FLOW = "Q-03",// (山洪)流量算法
    CRACK_ACCELERATEION = "L-01",// 裂缝计加速度算法
    CRACK_ANGLE = 'L-02',// 裂缝计切线角算法
}

export const LandslideSourceTypeOptions = [
    {
        value: 1,
        label: '仪器监测预警'
    },
    {
        value: 4,
        label: '气象预报预警'
    },
]

export enum SourceType {
    NONE = 0,
    SENSOR = 1,
    SATELLITE,
    VIDEO,
    WEATHER
}

export const SourceTypeOptions = [
    {
        value: 1,
        label: '仪器'
    },
    {
        value: 2,
        label: '卫星'
    },
    {
        value: 3,
        label: '视频'
    },
    {
        value: 4,
        label: '气象'
    },
]

export const MonitorOptions: OptionType[] = [
    {
        value: 0,
        label: 'GNSS监测站'
    },
    {
        value: 1,
        label: 'GNSS基站'
    },
    {
        value: 2,
        label: '雨量计'
    },
    {
        value: 3,
        label: '裂缝计'
    },
    // {
    //     value: 4,
    //     label: '报警器'
    // },
    // {
    //     value: 5,
    //     label: '泥位计'
    // }
]
export enum MonitorType {
    "雨量计",
    "GNSS",
    "裂缝计",
    "风向风速仪",
    "加速度计",
    "地磁仪",
    "倾角仪",
    "泥水位计",
    "断线仪",
    "土壤温度计",
    "土壤含水率计",
    "云图传感器"
}

export const MonitorSource = [
    'ZKCX',
    'ICL',
    'CDUT',
]
/**
 * 实时,未来n小时
 */
export const HoursOptions: OptionType[] = [
    {
        value: 0,
        label: '实时'
    },
    {
        value: 2,
        label: '未来2小时'
    },
    {
        value: 6,
        label: '未来6小时'
    },
    {
        value: 12,
        label: '未来12小时'
    },
    {
        value: 24,
        label: '未来24小时'
    },
    {
        value: 48,
        label: '未来48小时'
    },
    {
        value: 72,
        label: '未来72小时'
    },
]
export const flashfloodHourOptions = getDynamicOptions(HoursOptions, [2, 6, 12, 24])
// 未来n小时
export const WeatherHoursOptions = HoursOptions.slice(1)

// 带(实时监测/未来2小时气象预报)描述的时段options
export const HoursOptionsWithComplexedLabel = HoursOptions.map(({ value, label }) => ({
    value,
    label: value === 0 ? `${label}(实时监测/未来2小时气象预报)` : `${label}(气象预报)`
}))
/**管理平台角色 */
export enum RoleType {
    ADMIN = 1,
    CUSTOMER, //包括WebRoleType.ADMIN, WebRoleType.CUSTOMER
}
/**客户平台的角色 */
export enum WebRoleType {
    ADMIN = 1,
    CUSTOMER
}

/**
 * 开关状态
 */
export enum Sw {
    ON = 1,
    OFF
}

/* 策略类型 */
export enum UserChannelType {
    DEFAULT = 1,
    PERSONAL
}

export const SwMap = {
    [Sw.ON]: '开启',
    [Sw.OFF]: '关闭'
}

/**山火的研判类型 */
export const FireSubTypeOptions: OptionType[] = [
    {
        value: 2,
        label: '森林火灾'
    },
    {
        value: 3,
        label: '草原火灾'
    }
]

/**山火的研判类型 */
export const FireCloudOptions: OptionType[] = [
    {
        value: 1,
        label: '有云'
    },
    {
        value: 2,
        label: '无云'
    }
]

export enum WarnType {
    /** 预报预警 */
    PREDICT = 1,
    /** 监测预警 */
    MONITOR_PRE,
    /** 监测报警 */
    MONITOR_REAL
}

export const WarnTypeOptions: OptionType[] = [
    {
        value: 1,
        label: '预报预警'
    },
    {
        value: 2,
        label: '监测预警'
    },
    {
        value: 3,
        label: '监测报警'
    },
]

/**
 * 获取各个页面下的预警类型子类型
 */
export function getSubTypeArrayMap() {
    if (isDrillMapPage()) {
        return DisasterOptions.reduce((prev, cur) => {
            if (cur.value !== EventType.INTENSITY)
                prev[cur.value] = [
                    [SourceType.NONE, WarnType.MONITOR_REAL],
                    [SourceType.NONE, WarnType.MONITOR_PRE],
                    [SourceType.NONE, WarnType.PREDICT]
                ]
            return prev
        }, {} as { [k: number]: [SourceType, WarnType][] })
    }
    return {
        /* [EventType.LANDSLIDE]: [
            [SourceType.SENSOR, WarnType.MONITOR_PRE],
            [SourceType.WEATHER, WarnType.PREDICT]
        ],
        [EventType.MUDSLIDE]: [
            [SourceType.SENSOR, WarnType.MONITOR_REAL],
            [SourceType.SENSOR, WarnType.MONITOR_PRE],
            [SourceType.WEATHER, WarnType.PREDICT]
        ], */
        [EventType.SUBSIDENCE]: [
            [SourceType.SENSOR, WarnType.MONITOR_REAL],
            [SourceType.WEATHER, WarnType.PREDICT]
        ]
    } as { [k: number]: [SourceType, WarnType][] }
}

export function getSubTypeValue(s: SourceType | 0, w: WarnType) {
    if (!s) return `${w}`
    return `${s}-${w}`
}

export function getSubTypeLabel(s: SourceType | 0, w: WarnType) {
    if (!s) return getNameByListId(WarnTypeOptions, w)
    return `${getNameByListId(SourceTypeOptions, s)}${getNameByListId(WarnTypeOptions, w)}`
}

/**
 * 产生方式
 */
export const ReportTypeOptions: OptionType[] = [
    {
        value: 1,
        label: '自动报'
    },
    {
        value: 2,
        label: '研判报'
    },
]

/**
 * 产生方式
 */
export const JudgeStatusOptions: OptionType[] = [
    {
        value: 1,
        label: '待研判'
    },
    {
        value: 2,
        label: '已研判'
    },
]

export enum JudgeStatus {
    UNDO = 1,
    DONE = 2
}


export enum RainType {
    NONE,
    STORM,
    LEVEL,
    VALUE,
    REAL_ICL,
    REAL_NMC,
    MINUTE // 分钟级预测降水
}

export const RainTypeOptions = [
    {
        value: RainType.NONE,
        label: ''
    },
    {
        value: RainType.STORM,
        label: '暴雨预警图'
    },
    {
        value: RainType.VALUE,
        label: '降水数值图'
    },
    {
        value: RainType.LEVEL,
        label: '降水等级图'
    },
    {
        value: RainType.REAL_ICL,
        label: '实测降水图（ICL）'
    },
    {
        value: RainType.REAL_NMC,
        label: '实测降水图（NMC）'
    },
    {
        value: RainType.MINUTE,
        label: '未来2小时分钟级降水预测图'
    }
]

export const EmergencyLinkOptions = [
    { value: 6, label: '应急值班' },
    { value: 5, label: '应急预案' },
]
export enum EmergencyLinkType {
    EMERGENCY_PLAN = 5,
    EMERGENCY_WORK

}
export const EmergencyLinks = [
    EmergencyLinkType.EMERGENCY_WORK,
    EmergencyLinkType.EMERGENCY_PLAN
]
// 1-多灾种预警平台 2-短信 3-智能外呼
export const ChannelOptions = [
    {
        value: 1,
        label: '多灾种预警平台'
    },
    {
        value: 2,
        label: '短信'
    },
    {
        value: 3,
        label: '智能外呼'
    },
    {
        value: 4,
        label: '预警接收终端',
    }
]

// 演练、发布渠道
export enum ChannelType {
    WEB = 1,
    SMS,
    OUTBOUND,
    TERMINAL,
    // APP
}
export const Channels = [
    ChannelType.WEB,
    ChannelType.SMS,
    ChannelType.OUTBOUND,
    ChannelType.TERMINAL,
    // ChannelType.APP
]
export enum PublishType {
    /** 预授权发布*/
    AUTO = 1,
    /** 研判指定发布*/
    JUDGE_MANUAL,
    /** 研判自动发布*/
    JUDGE_AUTO,
    /** 手动发布*/
    MANUAL
}

export const PublishTypeOptions = [
    {
        value: 1,
        label: '预授权自动发布',
        tooltip: '无需研判，按照配置策略自动发布至指定渠道的所有用户',
        color: '#1FAEFF',
    },
    {
        value: 2,
        label: '研判后手动发布',
        disabled: true,
        color: '#FFA834',
    },
    {
        value: 3,
        label: '研判后自动发布',
        disabled: true,
        tooltip: '研判后，按照配置策略自动发布至指定渠道的所有用户',
        color: '#87D657',
    },
]

export function getEventCategory(evt: EventType) {
    if (FloodDisaters.includes(evt)) return 'flood'
    if (GeoDisaters.includes(evt)) return 'geology'
    if (FireDisaters.includes(evt)) return 'fire'
    return 'flood'
}

export const OnlineStatusOptions = [
    {
        value: Sw.ON,
        label: '在线',
        color: Colors.online
    },
    {
        value: Sw.OFF,
        label: '离线',
        color: Colors.offline
    }
]

export const ReportTypeOpts = [
    {
        value: Sw.OFF,
        label: '系统报'
    },
    {
        value: Sw.ON,
        label: '审核报'
    }
]

export const StatusTypeOpts = [
    {
        value: Sw.ON,
        label: '启用'
    },
    {
        value: Sw.OFF,
        label: '禁用'
    },
]

export const EnumTypeOpts = [
    { value: 1, label: '记录类型' },
    { value: 2, label: '事务类型' },
    { value: 3, label: '人员类型' },
    { value: 4, label: '值班单位' },
]

export const WorkRuleTypeOpts = [
    { value: 1, label: '顺序制' },
    { value: 2, label: '交替制' },
]

export const DateTypeOpts = [
    { value: 3, label: '节假日' },
    { value: Sw.ON, label: '工作日' },
    { value: Sw.OFF, label: '休息日' },
]

export const WorkTypeOpts = [
    { value: Sw.ON, label: '值班' },
    { value: Sw.OFF, label: '暂不安排' },
]

export const EventTypeOpts = [
    { value: 7, label: '积水' },
    { value: 2, label: '滑坡' },
    { value: 3, label: '泥石流' },
    { value: 6, label: '山洪' },
    { value: 8, label: '崩塌' },
    { value: 1, label: '林草火灾' },
    { value: 5, label: '地震' },
]
// 1-火情 2-滑坡 3-泥石流 4-沉降 5-烈度速报 6-山洪 7-积水 8-崩塌
export const WorkListStatusTypeOpts = [
    { value: 1, label: '未处理' },
    { value: 2, label: '已处理' },
]

export const WeekTypeOpts = [
    { value: 1, label: '星期一' },
    { value: 2, label: '星期二' },
    { value: 3, label: '星期三' },
    { value: 4, label: '星期四' },
    { value: 5, label: '星期五' },
    { value: 6, label: '星期六' },
    { value: 7, label: '星期日' },
]


export enum BasicSettingEnum {
    RECORD_TYPE = 1,
    WORK_TYPE,
    STAFF_TYPE,
    DEPARTMENT
}