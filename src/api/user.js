import { Service } from '../service/request';

export function loginApi(data) {
  return Service({
    url: '/system/user/login',
    data,
  });
}
export function reqUserInfo() {
  return Service({
    url: '/system/user/login',
    method: 'GET',
  });
}

export function userList(data) {
  return Service({
    url: '/system/user/list',
    data,
  });
}

export function resLogout() {
  return Service({
    url: '/system/user/logout',
    // data: data,
  });
}

export function registerApi(data) {
  return Service({
    url: '/system/user/register',
    data,
  });
}

// RoleTreeApi 角色树
export function RoleTreeApi() {
  return Service({
    url: '/system/role/tree',
    method: 'GET',
  });
}
