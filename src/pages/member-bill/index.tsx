import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
  Select,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserList } from '../../api/user.js';
import { BillList, shopList } from '../../api/drama.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import AddForm from './form/index.jsx';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';

function SearchTable({}) {
  const [storeListOption, setstoreListOption] = useState<any[]>([]);
  const [UserList, setUserList] = useState<any[]>([]);
  const [visitModal, setvisitModal] = useState<boolean>();
  const [notice_title, setnotice_title] = useState<string>('');
  const [store_code, setstore_code] = useState<string>('');
  const [notice_type, setnotice_type] = useState<string>('');
  const [clickItem, setclickItem] = useState(null);
  const columns = [
    {
      title: '订单号',
      dataIndex: 'reference_code',
      fixed: 'left' as 'left',
      width: 190,
    },
    {
      title: '会员昵称',
      dataIndex: 'member_name',
    },
    {
      title: '会员账号',
      dataIndex: 'member_account',
    },
    {
      title: '手机号',
      dataIndex: 'member_mobile',
    },
    {
      title: '交易类型',
      dataIndex: 'amount_type',
    },
    {
      title: '门店',
      dataIndex: 'store_code',
    },
    {
      title: '剧本',
      dataIndex: 'gb_code',
    },
    {
      title: '交易单号',
      dataIndex: 'out_trade_no',
    },

    {
      title: '交易ID',
      dataIndex: 'transaction_id',
    },
    {
      title: '交易时间',
      dataIndex: 'transaction_date',
    },
    {
      title: '交易金额',
      dataIndex: 'amount_fill',
    },
    {
      title: '赠送金额',
      dataIndex: 'amount_gift',
    },
    {
      title: '交易币种',
      dataIndex: 'amount_currency',
    },
    {
      title: '折扣',
      dataIndex: 'discount_rate',
    },
    {
      title: '是否首充',
      dataIndex: 'is_first',
    },
    {
      title: '操作人',
      dataIndex: 'operate_user',
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
    },
    {
      title: '操作',
      fixed: 'right' as 'right',
      width: 100,
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
    getShopList();
  }, []);
  const getShopList = async () => {
    const { data } = await shopList();
    setstoreListOption(data);
  };
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
    const data = BillList({
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
        <Breadcrumb.Item>会员账单</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20, display: 'none' }}>
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
                <Select
                  style={{ width: 200 }}
                  onChange={(e) => {
                    setstore_code(e);
                  }}
                  placeholder="请选择店铺编码"
                >
                  <Select.Option value="">全选</Select.Option>
                  {storeListOption.map((item) => {
                    return (
                      <Select.Option value={item.store_code} key={item.store_code}>
                        {item.store_name}
                      </Select.Option>
                    );
                  })}
                </Select>

                {/* <Input
                  onChange={(e) => {
                    setstore_code(e);
                  }}
                  value={store_code}
                  placeholder="请输入店铺编码"
                  style={{ width: 200 }}
                /> */}
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
          rowKey="order_id"
          loading={loading}
          data={data}
          scroll={{ x: 3200 }}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
