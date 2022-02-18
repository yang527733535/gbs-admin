import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Breadcrumb, Card, Space, Modal } from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserList } from '../../api/user.js';
import { noticeList } from '../../api/drama.js';
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
  const [notice_title, setnotice_title] = useState<string>('');
  const [store_code, setstore_code] = useState<string>('');
  const [notice_type, setnotice_type] = useState<string>('');
  const [clickItem, setclickItem] = useState(null);
  const columns = [
    {
      title: '公告名称',
      dataIndex: 'notice_title',
    },
    {
      title: '店铺编码',
      dataIndex: 'store_code',
    },
    {
      title: '公告日期',
      dataIndex: 'notice_date',
    },
    {
      title: '公告类型',
      dataIndex: 'notice_type',
      render: (item) => {
        if (item === 'notice_system') {
          return '系统公告';
        }
        if (item === 'notice_store') {
          return '店铺公告';
        }
      },
    },
    {
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'create_time',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
    },
    {
      title: '操作',
      render: (_, item) => {
        return (
          <Button
            onClick={() => {
              setclickItem(item);
              setvisitModal(true);
            }}
            type="primary"
            size="mini"
          >
            修改
          </Button>
        );
      },
    },
  ];

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);

  const { pagination, loading, data, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    getUserListApi();
  }, []);

  const getUserListApi = async () => {
    const data = await getUserList();
    setUserList(data.data);
  };

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = noticeList({
      page: current,
      page_size: pageSize,
      notice_type,
      notice_title,
      store_code,
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
        title="添加公告"
        footer={null}
        unmountOnExit
        onCancel={() => {
          setvisitModal(false);
        }}
        afterClose={() => {
          setclickItem(null);
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
          clickItem={clickItem}
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
              添加公告
            </Button>
            <div>
              <Space>
                <Input
                  onChange={(e) => {
                    setnotice_title(e);
                  }}
                  value={notice_title}
                  placeholder="请输入公告标题"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setstore_code(e);
                  }}
                  value={store_code}
                  placeholder="请输入店铺编码"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setnotice_type(e);
                  }}
                  placeholder="请输入公告类型"
                  style={{ width: 200 }}
                />
                <Button
                  onClick={() => {
                    setnotice_title('');
                    setstore_code('');
                    setnotice_type('');
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
          rowKey="notice_title"
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
