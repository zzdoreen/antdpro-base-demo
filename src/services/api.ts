// 应急预案
import { del, get, post, put } from "."
import type { PaginationParams, PlanEntity, TableList } from "./entities"

/**
 * 获取预案列表
 * @param params 
 * @returns 
 */
export function getPlanListService(params: { id?: number, name?: string } & PaginationParams) {
    return get<TableList<PlanEntity>>('/device/list', params)
}

/**
 * 新增
 * @param params 
 * @returns 
 */
export function addPlanListService(params: PlanEntity) {
    return post('/plan', params)
}

/**
 * 更新
 * @param params 
 * @returns 
 */
export function updatePlanService(params: PlanEntity) {
    return put('/plan', params)
}

/**
 * 删除
 * @param id 
 * @returns 
 */
export function delPlanService(id: number | string) {
    return del(`/plan/${id}`)
}

export function getHoursRainfallService() {
    return Promise.resolve({
        "code": 0,
        "message": "0",
        "data": [
            {
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_090000_0i.png",
                "timestamp": 1723424400,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_090600_0i.png",
                "timestamp": 1723424760,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_091200_0i.png",
                "timestamp": 1723425120,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_091800_0i.png",
                "timestamp": 1723425480,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_092400_0i.png",
                "timestamp": 1723425840,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_093000_0i.png",
                "timestamp": 1723426200,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_093600_0i.png",
                "timestamp": 1723426560,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_094200_0i.png",
                "timestamp": 1723426920,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_094800_0i.png",
                "timestamp": 1723427280,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_095400_0i.png",
                "timestamp": 1723427640,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_100000_0i.png",
                "timestamp": 1723428000,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_100600_0i.png",
                "timestamp": 1723428360,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_101200_0i.png",
                "timestamp": 1723428720,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_101800_0i.png",
                "timestamp": 1723429080,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_102400_0i.png",
                "timestamp": 1723429440,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_103000_0i.png",
                "timestamp": 1723429800,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_103600_0i.png",
                "timestamp": 1723430160,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_104200_0i.png",
                "timestamp": 1723430520,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_104800_0i.png",
                "timestamp": 1723430880,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_0i.png",
                "timestamp": 1723431240,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_1i.png",
                "timestamp": 1723431600,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_2i.png",
                "timestamp": 1723431960,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_3i.png",
                "timestamp": 1723432320,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_4i.png",
                "timestamp": 1723432680,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_5i.png",
                "timestamp": 1723433040,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_6i.png",
                "timestamp": 1723433400,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_7i.png",
                "timestamp": 1723433760,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_8i.png",
                "timestamp": 1723434120,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_9i.png",
                "timestamp": 1723434480,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_10i.png",
                "timestamp": 1723434840,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_11i.png",
                "timestamp": 1723435200,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_12i.png",
                "timestamp": 1723435560,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_13i.png",
                "timestamp": 1723435920,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_14i.png",
                "timestamp": 1723436280,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_15i.png",
                "timestamp": 1723436640,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_16i.png",
                "timestamp": 1723437000,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_17i.png",
                "timestamp": 1723437360,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_18i.png",
                "timestamp": 1723437720,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_19i.png",
                "timestamp": 1723438080,
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
                "url": "https://dadixinya.oss-cn-beijing.aliyuncs.com/forcast_rain/chen-minute-30/20240812/20240812_105400_20i.png",
                "timestamp": 1723438440,
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