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

