import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Drawer,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { shopList } from '../../api/drama.js';
import StoreDetail from './storeDetail/index';
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

function SearchTable({}) {
  const locale = useLocale();
  const [modalType, setmodalType] = useState('');
  const [visitModal, setvisitModal] = useState(false);
  const [show, setshow] = useState(false);
  const [store_name, setstore_name] = useState('');
  const [store_type, setstore_type] = useState('');
  const [store_status, setstore_status] = useState('');
  const [store_level, setstore_level] = useState('');
  const [position_city, setposition_city] = useState('');
  const [clickItem, setclickItem] = useState(null);
  const [store_code, setstore_code] = useState('');
  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'store_name',
    },

    {
      title: '店铺地址',
      dataIndex: 'position_address',
    },
    {
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'created_time',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
    },
    {
      title: locale['searchTable.columns.operations'],
      render: (_, data) => (
        <Space>
          {/* <Button
            onClick={() => {
              console.log(col, data);
              setclickItem(data);
              setvisitModal(true);
            }}
            size="mini"
            type="primary"
          >
            {locale['searchTable.columns.operations.update']}
          </Button> */}
          <Button
            onClick={() => {
              setshow(true);
              setstore_code(data);
              setmodalType('edit');
            }}
            size="mini"
            type="primary"
          >
            店铺详情
          </Button>
        </Space>
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
    const data = shopList({
      page: current,
      page_size: pageSize,
      store_name,
      store_type,
      store_status,
      store_level,
      position_city,
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
      <Drawer
        onCancel={() => {
          setshow(false);
        }}
        footer={null}
        visible={show}
    
        title="店铺详情"
        unmountOnExit={true}
        width="90vw"
      >
        <StoreDetail
          closeDrawer={() => {
            setshow(false);
            fetchData();
          }}
          modalType={modalType}
          store_code={store_code}
        ></StoreDetail>
      </Drawer>
      <Modal
        title={clickItem === null ? '添加门店' : '修改门店'}
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            fetchData();
          }}
        />
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
                setshow(true);
                setclickItem(null);
                setmodalType('add');
              }}
              type="primary"
            >
              添加门店
            </Button>
            <div>
              <Space style={{ marginLeft: 20 }} wrap>
                <Input
                  value={store_name}
                  onChange={(e) => {
                    setstore_name(e);
                  }}
                  placeholder="请输入店铺名称"
                  style={{ width: 200 }}
                />
                <Input
                  value={store_type}
                  onChange={(e) => {
                    setstore_type(e);
                  }}
                  placeholder="请选择门店类型"
                  style={{ width: 200 }}
                />
                <Input
                  value={store_status}
                  onChange={(e) => {
                    setstore_status(e);
                  }}
                  placeholder="请选择门店状态"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setstore_level(e);
                  }}
                  placeholder="门店等级"
                  value={store_level}
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setposition_city(e);
                  }}
                  value={position_city}
                  placeholder="所在城市"
                  style={{ width: 200 }}
                />
                <Button
                  onClick={() => {
                    setstore_name('');
                    setstore_type('');
                    setstore_status('');
                    setstore_level('');
                    setposition_city('');
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
