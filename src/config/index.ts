import type { CurrentUserConfig } from "@/services/entities";
import { getLocalStorage, setLocalStorage } from "@/utils/tools";
import { RainType } from "./dictions";

/**
 * http服务器请求基地址
 */
export const BASE_API_URL = '/v1';

/**
 * 开发环境服务器地址
 */
// export const devHost = 'pre191.chinaeew.cn:2000'
export const devOrigin = 'http://192.168.1.6:8002'
export const preOrigin = 'https://test191.chinaeew.cn:3112'
export const testOrigin = 'http://192.168.1.5:8002'
/**
 * 生产环境websocket连接地址
 */
const proOrigin = window.location.origin
const origin = (() => {
    switch (REACT_APP_ENV) {
        case 'dev':
            return devOrigin
        case 'pre':
            return preOrigin
        case 'test':
            return testOrigin
        default:
            return proOrigin
    }
})()
const WS_Origin = `ws${origin.slice(4)}` // 兼容http:与https:协议
export const WS_URL = `${WS_Origin}/v1/ws`;

/**
 * 默认区域：四川省510000
 */
export const defaultAreaCode = undefined as unknown as number

export const AdminLayoutCfg = {
    platformTitle: "内江市市中区多灾种预警服务平台", //平台标题
    platformLogo: "/imgs/logo_icl.png", //平台logo, 相对路径
    brandName: "大陆灾害预警中心", //品牌名称
    signatureTitle: "成都高新减灾研究所", //署名标题
    signatureLogo: "/imgs/logo_icl.png", //署名logo, 相对路径
    signatureLogo2: '',
    signatureTitle2: '',
    signatureLogo3: '',
    signatureTitle3: ''
} as CurrentUserConfig['layout']

let logoutHook: Function
export function setLogout(l: Function) {
    logoutHook = l
}
/**
 * 暴露退出登录的hooks
 * @returns logout
 */
export function getLogout() {
    return logoutHook
}

export const ALL_NATION = {
    code: 86,
    name: '全国'
}

export const notifyStrategyKey = "heron_notify_strategy"

export const initialNotifyStrategy = {
    "5-1-3": {
        "level": 4
    },
    "2-4-1": {
        "level": 4,
        "hour": 2
    },
    "2-1-2": {
        "level": 4
    },
    "3-4-1": {
        "level": 4,
        "hour": 2
    },
    "3-1-2": {
        "level": 4
    },
    "3-1-3": {
        "level": 4
    },
    "6-4-1": {
        "level": 4,
        "hour": 2
    },
    "1-2-3": {
        "level": 4
    },
    "7-3-3": {
        "level": 4
    },
    "4-4-1": {
        "level": 4,
        "hour": 2
    },
    "4-1-3": {
        "level": 4,
    },
    "8-1-2": {
        "level": 4
    },
    "9-3-3": {
        "level": 4
    }
}

export const commonSettingKey = 'heron_common_setting_key'

export const initialCommonSetting = {
    hour: 0,
    rainType: RainType.NONE,
    resetHomeFull: false
}

// 图例上是否记住筛选项
export const legendSwitchKey = 'heron_legend_switch'
export const legendSwitchValue = false

// 图例上记住的筛选项
export const legendChecksKey = 'heron_legend_checks'

// 地图图层上是否记住勾选
export const layerSwitchKey = 'heron_layer_switch'
export const layerSwitchValue = false

// 地图图层
export const layerSettingKey = 'heron_layer_setting_key'
export const initialLayerSetting = {
    show: false,
    // grid: false,
    // county: false,
    defects: false,
    // counties: true,
    road: false,
    railway: false,
    countyBounds: false,
    radarPictureXinya: false,
    regionRain: false,
    radarScope: false
}


// 切换用户后，需要重置的缓存
const localStorageValues = {
    [notifyStrategyKey]: initialNotifyStrategy,
    [commonSettingKey]: initialCommonSetting,
    [legendSwitchKey]: legendSwitchValue,
    [layerSwitchKey]: layerSwitchValue,
    [layerSettingKey]: initialLayerSetting
}

export function clearCachedLocalStorageValues(forceClear = false) {
    if (!forceClear) {
        //  判断版本是否兼容
        const key = 'heron_version'
        if (getLocalStorage(key) !== APP_VERSION) {
            setLocalStorage(key, APP_VERSION)
        } else return
    }
    for (let k in localStorageValues) {
        setLocalStorage(k, localStorageValues[k])
    }
}

export const isClickable = (path: string) => !['/detail'].includes(path)