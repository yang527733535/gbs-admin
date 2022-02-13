import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
  Typography,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeSList } from '../../api/user.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import AddForm from './form/index.jsx';
import { ReducerState } from './redux';
import styles from './style/index.module.less';


function SearchTable() {
  const [visitModal, setvisitModal] = useState(false);
  const [user_account, setuser_account] = useState('');
  const [user_mobile, setuser_mobile] = useState('');
  const [user_name, setuser_name] = useState('');
  const [user_status, setuser_status] = useState('');
  const columns = [
    {
      title: '预定ID',
      dataIndex: 'subscribe_id',
    },
    {
      title: '剧本',
      dataIndex: 'gb_code',
    },
    {
      title: '人数',
      dataIndex: 'subscribe_people',
    },
    {
      title: 'peddle_is',
      dataIndex: 'peddle_is',
    },
    {
      title: 'peddle_text',
      dataIndex: 'peddle_text',
    },
    {
      title: 'room_code',
      dataIndex: 'room_code',
    },
    {
      title: 'subscribe_dm',
      dataIndex: 'subscribe_dm',
    },
    {
      title: '开始时间',
      dataIndex: 'subscribe_start',
    },
    {
      title: '结束时间',
      dataIndex: 'subscribe_end',
    },

    {
      title: '预定member',
      dataIndex: 'subscribe_member',
    },
    {
      title: 'subscribe_note',
      dataIndex: 'subscribe_note',
    },

    {
      title: 'subscribe_remarks',
      dataIndex: 'subscribe_remarks',
    },
    {
      title: '状态',
      dataIndex: 'subscribe_status',
    },
  ];

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);

  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = subscribeSList({
      page: current,
      page_size: pageSize,
      user_account,
      user_mobile,
      user_name,
      user_status,
    });
    dispatch({ type: UPDATE_LOADING, payload: { loading: true } });
    data.then((res) => {
      console.log(res);
      const { data, paginator } = res;
      dispatch({ type: UPDATE_LIST, payload: { data } });
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
  }

  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    fetchData(current, pageSize, formParams);
  }

  return (
    <div className={styles.container}>
      <Modal
        title="添加会员"
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        style={{ width: 600 }}
        visible={visitModal}
      >
        <AddForm name="XIXI" />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>运营管理</Breadcrumb.Item>
        <Breadcrumb.Item>预约组局</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <Button
              onClick={() => {
                // setvisitModal(true);
              }}
              disabled={true}
              type="primary"
            >
              添加会员
            </Button> */}
            <div>
              <Space>
                <Input
                  onChange={(e) => {
                    setuser_account(e);
                  }}
                  placeholder="请输入店铺"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setuser_mobile(e);
                  }}
                  placeholder="请输入手机号码"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setuser_name(e);
                  }}
                  placeholder="请输入用户名"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setuser_status(e);
                  }}
                  placeholder="用户状态"
                  style={{ width: 200 }}
                />
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
        <Typography.Paragraph>
          <Table
            rowKey="subscribe_id"
            loading={loading}
            onChange={onChangeTable}
            pagination={pagination}
            columns={columns}
            data={data}
          />
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

export default SearchTable;
