import { Service } from '../service/request';

export function loginApi(data) {
  return Service({
    url: '/system/user/login',
    data: data,
  });
}

export function userList(data) {
  return Service({
    url: '/system/user/list',
    data: data,
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
    data: data,
  });
}
