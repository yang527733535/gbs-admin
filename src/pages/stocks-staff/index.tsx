import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { userList } from '../../api/user.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import AddForm from './form/index.jsx';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
function SearchTable() {
  const locale = useLocale();
  const [visitModal, setvisitModal] = useState(false);
  const [user_account, setuser_account] = useState('');
  const [user_mobile, setuser_mobile] = useState('');
  const [user_name, setuser_name] = useState('');
  const [user_status, setuser_status] = useState('');
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'user_name',
    },
    {
      title: '账号',
      dataIndex: 'user_account',
    },
    {
      title: '邮箱',
      dataIndex: 'user_email',
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '手机号码',
      dataIndex: 'user_mobile',
    },
    {
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'created_time',
    },
    {
      // title: locale['searchTable.columns.deadline'],
      title: '更新时间',
      dataIndex: 'updated_time',
    },
    {
      title: locale['searchTable.columns.operations'],
      dataIndex: 'operations',
      render: () => (
        <div className={styles.operations}>
          <Button type="text" size="small">
            {locale['searchTable.columns.operations.view']}
          </Button>
          <Button type="text" size="small">
            {locale['searchTable.columns.operations.update']}
          </Button>
          <Button type="text" status="danger" size="small">
            {locale['searchTable.columns.operations.delete']}
          </Button>
        </div>
      ),
    },
  ];

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);

  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, []);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    // const data = dispatch({ type: UPDATE_LOADING, payload: { loading: true } });
    const data = userList({
      page: current,
      page_size: pageSize,
      user_account,
      user_mobile,
      user_name,
      user_status,
    });
    data.then((res) => {
      console.log(res);
      const { data, paginator } = res;
      dispatch({ type: UPDATE_LIST, payload: { data: data } });
      dispatch({
        type: UPDATE_PAGINATION,
        payload: {
          pagination: {
            ...pagination,
            current: paginator.page,
            pageSize: paginator.page_size,
            total: paginator.total_count,
          },
        },
      });
      dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
      dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
    });
    // data.then((res) => {
    //   console.log('res: ', res);
    // });

    // dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
    // dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
    // axios
    //   .get(`/api/policy`, {
    //     params: {
    //       page: current,
    //       pageSize,
    //       ...params,
    //     },
    //   })
    //   .then((res) => {
    //   });
  }

  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    fetchData(current, pageSize, formParams);
  }

  // function onSearch(keyword) {
  //   fetchData(1, pagination.pageSize, { keyword });
  // }

  // function onDateChange(date) {
  //   const [start, end] = date;
  //   fetchData(1, pagination.pageSize, {
  //     createdTimeStart: start,
  //     createdTimeEnd: end,
  //   });
  // }

  return (
    <div className={styles.container}>
      <Modal
        title="添加用户"
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        style={{ width: 600 }}
        visible={visitModal}
      >
        <AddForm name="XIXI"></AddForm>
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{locale['menu.list']}</Breadcrumb.Item>
        <Breadcrumb.Item>{locale['menu.list.searchTable']}</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                setvisitModal(true);
              }}
              type="primary"
            >
              添加用户
            </Button>
            <div>
              <Space>
                <Input
                  onChange={(e) => {
                    setuser_account(e);
                  }}
                  placeholder="请输入账号"
                  style={{ width: 200 }}
                ></Input>
                <Input
                  onChange={(e) => {
                    setuser_mobile(e);
                  }}
                  placeholder="请输入手机号码"
                  style={{ width: 200 }}
                ></Input>
                <Input
                  onChange={(e) => {
                    setuser_name(e);
                  }}
                  placeholder="请输入用户名"
                  style={{ width: 200 }}
                ></Input>
                <Input
                  onChange={(e) => {
                    setuser_status(e);
                  }}
                  placeholder="用户状态"
                  style={{ width: 200 }}
                ></Input>
                <Button
                  onClick={() => {
                    setuser_account('');
                    setuser_mobile('');
                    setuser_name('');
                    setuser_status('');
                  }}
                >
                  重置
                </Button>
                <Button
                  onClick={() => {
                    fetchData();
                  }}
                  type="primary"
                >
                  搜索
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
      <Card bordered={false}>
        <Table
          rowKey="user_account"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
