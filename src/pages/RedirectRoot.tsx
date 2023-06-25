import { Redirect, useAccess, } from "umi";

//读取角色，首页动态重定向
export default function RedirectRoot() {
  // const { isSuperAdmin, customer } = useAccess()

  // if (!isSuperAdmin || customer) return <Redirect to="/general" />
  // else if (isSuperAdmin && !customer) {
  //   return <Redirect to="/home" />
  // }
  // // 角色未知，返回登录页
  return <Redirect to="/list" />
}