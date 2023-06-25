import {
    EventType, getDynamicOptions, getSubTypeArrayMap, getUpdateTypeOptions,
    UpdateTypeOptionsWithComplexedLabel, WarnType, WarnTypeOptions
} from "./dictions"

/**预警记录、待研判记录页面，动态获取最新报状态Options */
export const getDynamicUpdateTypeOpts = (eventTypes: EventType[]) => {
    if (eventTypes.includes(EventType.INTENSITY)) {
        if (eventTypes.length > 1) return UpdateTypeOptionsWithComplexedLabel
        return getUpdateTypeOptions(EventType.INTENSITY)
    }
    return getUpdateTypeOptions(undefined, true)
}

const singleEventWarnTypeMap = {
    [EventType.INTENSITY]: [WarnType.MONITOR_REAL],
    [EventType.FLASHFLOOD]: [WarnType.PREDICT],
    [EventType.WATERACCUM]: [WarnType.MONITOR_REAL],
    [EventType.FIRE]: [WarnType.MONITOR_REAL],
    [EventType.RIVERFLOOD]: [WarnType.MONITOR_REAL],
    [EventType.LANDSLIDE]: [WarnType.PREDICT],
    [EventType.MUDSLIDE]: [WarnType.PREDICT],
    [EventType.COLLAPSE]: [WarnType.PREDICT]
}

/**预警记录、待研判记录页面，动态获取预警类型Options */
export const getDynamicWarnTypeOpts = (eventTypes: EventType[]) => {
    const subTypes = getSubTypeArrayMap()// EventType.LANDSLIDE, EventType.MUDSLIDE, EventType.SUBSIDENCE
    const warnTypes = eventTypes.reduce((pre, evt) => {
        if (subTypes[evt]) {
            pre.push(...subTypes[evt].map(e => e[1]))
        } else {
            const wTypes = singleEventWarnTypeMap[evt]
            if (wTypes) pre.push(...wTypes)
        }
        return pre
    }, [] as WarnType[])
    return getDynamicOptions(WarnTypeOptions, [...new Set(warnTypes)] as number[])
}