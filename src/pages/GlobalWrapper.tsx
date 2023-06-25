import type { BasicLayoutProps, MenuDataItem } from '@ant-design/pro-layout';
import { getMenuData, PageContainer } from "@ant-design/pro-layout";
import type { Route } from "@ant-design/pro-layout/lib/typings";
import React, { useEffect, useMemo, useState } from "react";
import type { InitialState, Location } from "umi";
import { Redirect, useAccess, useIntl, useLocation, useModel } from "umi";
import useWebsocket from "../useWebsocket";
import Footer from '@/components/Footer';

export const GlobalContext = React.createContext({
    menuData: [] as MenuDataItem[],
    route: {} as Route,
})


const GlobalWrapper: React.FC<{ route: Route, location: Location }> = (props) => {
    const { children, route, location } = props
    const { formatMessage } = useIntl();
    const { menuData } = useMemo(() => getMenuData(route.children as any, { locale: true }, formatMessage), [route])
    const hasContainer = usePageContainer(route,)
    useWebsocket()
    const redirect = useModuleRedirect(menuData, location.pathname)

    if (redirect) return <Redirect to={redirect} />

    return <GlobalContext.Provider value={{ menuData, route }}>{
        !hasContainer ? children as React.ReactElement : <PageContainer title={false} className='customer-page-container' >{children}</PageContainer>
    }
    </GlobalContext.Provider >
}
export default GlobalWrapper

function usePageContainer(routes: Route) {

    const { pathname } = useLocation()
    const { setInitialState } = useModel('@@initialState', ({ setInitialState }) => ({ setInitialState }))

    const hasContainter = useMemo(() => hasPageContainer(routes, pathname), [routes, pathname])

    useEffect(() => {
        setInitialState(s => mergeDynamicSetting(s, (hasContainter ?
            {
                disableContentMargin: undefined,
                breadcrumbRender: undefined,
                footerRender: () => <Footer />,
            } :
            {
                breadcrumbRender: false,
                disableContentMargin: true,
                footerRender: false,
                className: undefined
            }
        ) as any))
    }, [hasContainter]);

    return hasContainter
}

function mergeDynamicSetting(s: InitialState, partial: Partial<BasicLayoutProps>) {
    const { dynamicSetting, ...rest } = s
    let newDs = {
        ...dynamicSetting,
        ...partial
    }
    const { breadcrumbRender, ...restDs } = newDs
    if (breadcrumbRender === undefined) {
        // 默认会展示面包屑
        newDs = restDs
    }
    return {
        ...rest,
        dynamicSetting: newDs
    }
}

function hasPageContainer(route: Route | undefined, pathname: string): boolean {
    if (!route) return false
    const { path, children, hidePageContainer } = route;
    if (path == pathname)
        return !hidePageContainer
    if (children) {
        for (let i = 0; i < children.length; i++) {
            if (hasPageContainer(children[i], pathname)) return true
        }
    }
    return false
}


function useCollapsed(routes: Route) {

    const { pathname } = useLocation()
    const { setInitialState } = useModel('@@initialState', ({ setInitialState }) => ({ setInitialState }))

    const defaultCollapsed = useMemo(() => isCollapsed(routes, pathname), [routes, pathname])
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (defaultCollapsed) setCollapsed(true)
    }, [defaultCollapsed]);

    useEffect(() => {
        hideMenuTooltip()
        setInitialState(s => mergeDynamicSetting(s, (defaultCollapsed ?
            {
                collapsed,
                onCollapse: setCollapsed,
                // collapsedButtonRender: false
            } :
            {
                collapsed: undefined,
                onCollapse: () => hideMenuTooltip(),
                collapsedButtonRender: undefined
            }
        ) as any))
    }, [defaultCollapsed, collapsed]);

    return defaultCollapsed
}

function isCollapsed(route: Route | undefined, pathname: string): boolean {
    if (!route) return false
    const { path, children, collapsed } = route;
    if (path == pathname)
        return !!collapsed
    if (children) {
        for (let i = 0; i < children.length; i++) {
            if (isCollapsed(children[i], pathname)) return true
        }
    }
    return false
}

/** 手动遍历，带下级菜单的父路径重定向到具有access的第一个子路由 */
function useModuleRedirect(menuData: MenuDataItem[], path: string) {
    const { dynamicRoute } = useAccess()
    const redirects = useMemo(() => {
        const redts = {} as Record<string, string>
        const getRedts = (menuDatas: typeof menuData) => menuDatas
            // .filter(e => e.access === 'dynamicRoute')
            .forEach(({ path, children }) => {
                let p = children?.find(e => dynamicRoute(e) && !e.redirect)?.path
                if (p) redts[path!] = p
                if (children) getRedts(children)
            })
        getRedts(menuData)
        return redts
    }, [menuData])
    return redirects[path]
}

/** 折叠时，切换菜单快速移动移除鼠标，不能触发mouseleave，导致不能关闭 */
export const hideMenuTooltip = (i = 5) => {
    if (i > 0) {
        setTimeout(() => {
            const tooltip = document.querySelector('.ant-menu-inline-collapsed-tooltip:not(.ant-tooltip-hidden)')
            if (tooltip) {
                tooltip.className += ' ant-tooltip-hidden'
            }
            hideMenuTooltip(i - 1)
        }, 300);
    }
}