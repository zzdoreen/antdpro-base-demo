// 应急预案
import type { ChannelType } from "@/config/dictions"
import { del, get, post, put } from "."
import type { PaginationParams, PlanConfig, PlanEntity, PlanRecordReceive, PlanRecordStatistics, PlanStartListEntity, TableList } from "./entities"

/**
 * 获取预案列表
 * @param params 
 * @returns 
 */
export function getPlanListService(params: { id?: number, name?: string } & PaginationParams) {
    console.log(params)
    return Promise.resolve({
        code: 0,
        data: {
            list: [
                {
                    name: 'text',
                    age: 25.5,
                    sex: 'female',
                    imgs: 'https://ruler-recognition.oss-cn-beijing.aliyuncs.com/original/2023-06-01/CMD1000014/CMD1000014_2023-06-01--18:00:16.jpg',
                    time: 1703389324,
                    select: '',
                    startAt: 1703389324,
                    endAt: 1703389824
                },
            ],
            total: 10
        }
    })
    return get<TableList<PlanEntity>>('/device/list', params)
}

/**
 * 新增预案
 * @param params 
 * @returns 
 */
export function addPlanListService(params: PlanEntity) {
    return post('/plan', params)
}

/**
 * 更新预案
 * @param params 
 * @returns 
 */
export function updatePlanService(params: PlanEntity) {
    return put('/plan', params)
}

/**
 * 删除预案
 * @param id 
 * @returns 
 */
export function delPlanService(id: number | string) {
    return del(`/plan/${id}`)
}

/**
 * 获取策略配置
 * @returns 
 */
export function getPlanDefaultConfigService() {
    return get<PlanConfig>('/plan/strategy')
}

/**
 * 创建策略配置
 * @param param 
 * @returns 
 */
export function addPlanDefaultConfigService(param: PlanConfig) {
    return post('/plan/strategy', param)
}

/**
 * 更新策略配置
 * @param param 
 * @returns 
 */
export function editPlanDefaultConfigService(param: PlanConfig) {
    return put('/plan/strategy', param)
}

/**
 * 预案启动记录列表
 * @param param 
 * @returns 
 */
export function getPlanStartListService(param: { eventType: number, level: number } & PaginationParams) {
    return get<TableList<PlanStartListEntity>>('/plan/record/list', param)
}

/**
 * 预案启动记录 - 通知发送情况
 * @param param 
 * @returns 
 */
export function getPlanRecordReceiveService(param: { emergencyPlanRecordId: number, channel: ChannelType } & PaginationParams) {
    return get<TableList<PlanRecordReceive>>('/plan/record/receive', param)
}

/**
 * 发送记录统计
 * @param emergencyPlanRecordId 
 * @returns 
 */
export function getRecordReceiveStatistic(emergencyPlanRecordId: number) {
    return get<PlanRecordStatistics>('/plan/record/statistics', { emergencyPlanRecordId })
}

/**
 * 编辑预案启动记录
 * @param param 
 * @returns 
 */
export function editPlanStartListService(param: PlanStartListEntity) {
    return put('/plan/record', param)
}


export function getHoursRainfallService() {
    return Promise.resolve({
        "code": 0,
        "message": "0",
        "data": [
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_114800_0i.png",
                "timestamp": 1701229680,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_115400_0i.png",
                "timestamp": 1701230040,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_120000_0i.png",
                "timestamp": 1701230400,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_120600_0i.png",
                "timestamp": 1701230760,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_121200_0i.png",
                "timestamp": 1701231120,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_121800_0i.png",
                "timestamp": 1701231480,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_122400_0i.png",
                "timestamp": 1701231840,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_123000_0i.png",
                "timestamp": 1701232200,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_123600_0i.png",
                "timestamp": 1701232560,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124200_0i.png",
                "timestamp": 1701232920,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_0i.png",
                "timestamp": 1701233280,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_1i.png",
                "timestamp": 1701233640,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_2i.png",
                "timestamp": 1701234000,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_3i.png",
                "timestamp": 1701234360,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_4i.png",
                "timestamp": 1701234720,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_5i.png",
                "timestamp": 1701235080,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_6i.png",
                "timestamp": 1701235440,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_7i.png",
                "timestamp": 1701235800,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_8i.png",
                "timestamp": 1701236160,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_9i.png",
                "timestamp": 1701236520,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_10i.png",
                "timestamp": 1701236880,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_11i.png",
                "timestamp": 1701237240,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_12i.png",
                "timestamp": 1701237600,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_13i.png",
                "timestamp": 1701237960,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_14i.png",
                "timestamp": 1701238320,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_15i.png",
                "timestamp": 1701238680,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_16i.png",
                "timestamp": 1701239040,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_17i.png",
                "timestamp": 1701239400,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_18i.png",
                "timestamp": 1701239760,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_19i.png",
                "timestamp": 1701240120,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            },
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20231129/20231129_124800_20i.png",
                "timestamp": 1701240480,
                "lngs": [
                    97,
                    109
                ],
                "lats": [
                    25,
                    35
                ]
            }
        ]
    })
}