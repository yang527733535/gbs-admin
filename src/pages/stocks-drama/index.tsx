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
import { dramaList } from '../../api/drama.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
import AddForm from './form/index.jsx';

function SearchTable() {
  const locale = useLocale();
  const [visitModal, setvisitModal] = useState(false);

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

  function fetchData(current = 1, pageSize = 10, params = {}) {
    // const data = dispatch({ type: UPDATE_LOADING, payload: { loading: true } });
    const data = dramaList({
      page: current,
      page_size: pageSize,
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
        title="添加剧本"
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit={true}
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm></AddForm>
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
              添加剧本
            </Button>
            <div>
              <Space>
                <Input onChange={() => {}} placeholder="请输入账号" style={{ width: 200 }}></Input>
                <Input
                  onChange={() => {}}
                  placeholder="请输入手机号码"
                  style={{ width: 200 }}
                ></Input>
                <Input
                  onChange={() => {}}
                  placeholder="请输入用户名"
                  style={{ width: 200 }}
                ></Input>
                <Input onChange={() => {}} placeholder="用户状态" style={{ width: 200 }}></Input>
                <Button onClick={() => {}}>重置</Button>
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
