import React, { useEffect, useState } from 'react';
import {
  Table,
  Image,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { dmList, getUserList } from '../../api/user.js';
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

function SearchTable({}) {
  const locale = useLocale();
  const [UserList, setUserList] = useState<any[]>([]);
  const [visitModal, setvisitModal] = useState<boolean>();
  const [user_account, setuser_account] = useState<string>('');
  const [user_mobile, setuser_mobile] = useState<string>('');
  const [user_name, setuser_name] = useState<string>('');
  const [user_status, setuser_status] = useState<string>('');
  const columns = [
    {
      title: '账号',
      dataIndex: 'user_account',
    },
    {
      title: '用户名称',
      dataIndex: 'user_nick',
    },
    {
      title: '账号',
      dataIndex: 'user_photo',
      render: (item) => {
        return <Image src={item} width={100} height={100} alt="" />;
      },
    },

    {
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'join_date',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
    },
    {
      title: '操作',
      render: (_, item) => (
        <Button
          type="primary"
          size="mini"
          onClick={() => {
            console.log(item);
          }}
        >
          修改
        </Button>
      ),
    },
  ];

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);

  const { pagination, loading, data, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    return () => {
      dispatch({ type: UPDATE_LIST, payload: { data: [] } });
    };
  }, []);
  useEffect(() => {
    getUserListApi();
  }, []);

  const getUserListApi = async () => {
    const data = await getUserList();
    setUserList(data.data);
  };

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = dmList({
      page: current,
      page_size: pageSize,
      user_account,
      user_mobile,
      user_name,
      user_status,
    });
    data.then((res) => {
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
        title="添加主持人"
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        style={{ width: 600 }}
        visible={visitModal}
      >
        <AddForm
          fetchData={fetchData}
          closeModalAndReqNewTableData={() => {
            setvisitModal(false);
            fetchData();
          }}
          UserList={UserList}
        />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>运营管理</Breadcrumb.Item>
        <Breadcrumb.Item>人员管理</Breadcrumb.Item>
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
              添加主持人
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
        <Table
          rowKey="user_account"
          loading={loading}
          data={data}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
