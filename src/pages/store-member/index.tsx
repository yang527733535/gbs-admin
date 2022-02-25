import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
  Tabs,
  Typography,
  Image,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { memberList } from '../../api/user.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import AddForm from './form/index.jsx';
import { ReducerState } from './redux';
import styles from './style/index.module.less';

const TabPane = Tabs.TabPane;

function SearchTable() {
  const [tabkey, settabkey] = useState('user');
  const [visitModal, setvisitModal] = useState(false);
  const [user_account, setuser_account] = useState('');
  const [user_mobile, setuser_mobile] = useState('');
  const [user_name, setuser_name] = useState('');
  const [user_status, setuser_status] = useState('');
  const columns = [
    {
      title: '用户名称',
      dataIndex: 'member_name',
    },
    {
      title: '手机号',
      dataIndex: 'member_mobile',
    },
    {
      title: '会员类型',
      dataIndex: 'member_type',
    },
    {
      title: '会员头像',
      dataIndex: 'member_face',
      render: (item) => {
        return (
          <Image
            width={50}
            height={50}
            style={{ width: 50, borderRadius: 5, height: 50 }}
            src={item}
            alt=""
          />
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'member_email',
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '等级',
      dataIndex: 'member_level',
    },
    {
      title: '状态',
      dataIndex: 'member_statuss',
    },
    {
      title: '会员积分',
      dataIndex: 'member_scroe',
    },
    {
      title: '可用余额',
      dataIndex: 'balance_use',
    },
    {
      title: '实际金额',
      dataIndex: 'balance_actual',
    },
    {
      title: '折扣',
      dataIndex: 'discount_rate',
    },
    // {
    //   title: locale['searchTable.columns.operations'],
    //   dataIndex: 'operations',
    //   render: () => (
    //     <div className={styles.operations}>
    //       <Button type="text" size="small">
    //         {locale['searchTable.columns.operations.view']}
    //       </Button>
    //       <Button type="text" size="small">
    //         {locale['searchTable.columns.operations.update']}
    //       </Button>
    //       <Button type="text" status="danger" size="small">
    //         {locale['searchTable.columns.operations.delete']}
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);

  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    return () => {
      dispatch({ type: UPDATE_LIST, payload: { data: [] } });
    };
  }, []);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = memberList({
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
        <Breadcrumb.Item>会员管理</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                setvisitModal(true);
              }}
              disabled={true}
              type="primary"
            >
              添加会员
            </Button>
            <div>
              <Space>
                <Input
                  onChange={(e) => {
                    setuser_account(e);
                  }}
                  placeholder="请输入账号"
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
        <Tabs
          onClickTab={(key: any) => {
            console.log('key: ', key);
            settabkey(key);
          }}
          activeTab={tabkey}
        >
          <TabPane key="user" title="普通会员">
            <Typography.Paragraph>
              <Table
                rowKey="user_account"
                loading={loading}
                onChange={onChangeTable}
                pagination={pagination}
                columns={columns}
                data={data}
              />
            </Typography.Paragraph>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default SearchTable;
