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
    return get<TableList<PlanEntity>>('/plan/list', params)
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
