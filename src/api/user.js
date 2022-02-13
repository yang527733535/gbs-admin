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

// 会员列表
export function memberList(data) {
  return Service({
    url: '/v1/member/list ',
    data,
  });
}

// 预约组局列表
export function subscribeSList(data) {
  return Service({
    url: '/v1/subscribe/list',
    data,
  });
}

export function dmList(data) {
  return Service({
    url: '/system/worker/dm-list',
    data,
    method: 'POST',
  });
}
export function getUserList(data) {
  return Service({
    url: '/v1/option/user',
    data,
    method: 'POST',
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
    url: '/system/user/worker-add',
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

// 修改密码
export function reqEditPwd(data) {
  return Service({
    url: '/system/worker/set-password',
    data,
    method: 'POST',
  });
}
