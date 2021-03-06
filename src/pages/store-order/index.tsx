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
import { OrderList, shopList } from '../../api/drama.js';
import { UPDATE_FORM_PARAMS, UPDATE_LIST, UPDATE_PAGINATION } from './redux/actionTypes';
import AddForm from './form/index.jsx';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';

function SearchTable({}) {
  const [storeListOption, setstoreListOption] = useState<any[]>([]);
  const [loading, setloading] = useState(false);
  const [UserList, setUserList] = useState<any[]>([]);
  const [visitModal, setvisitModal] = useState<boolean>();
  const [notice_title, setnotice_title] = useState<string>('');
  const [store_code, setstore_code] = useState<string>('');
  const [notice_type, setnotice_type] = useState<string>('');
  const [clickItem, setclickItem] = useState(null);
  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_code',
      fixed: 'left' as 'left',
      width: 200,
    },
    {
      title: '订单类型',
      dataIndex: 'order_type',
      render:(item)=>{
        return JSON.parse(localStorage.getItem('AllMaP'))['sys_order_type'][item]
      }
    },
    {
      title: '店铺',
      dataIndex: 'store_code',
      render: (item) => {
        return JSON.parse(localStorage.getItem('SMap'))[item];
      },
    },
    {
      title: '剧本',
      dataIndex: 'gb_code',
    },
    {
      title: '订单金额',
      dataIndex: 'order_amount',
    },
    {
      title: '币种',
      dataIndex: 'order_currency',
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
    },
    {
      title: '玩家账号',
      dataIndex: 'member_account',
    },
    {
      title: '玩家昵称',
      dataIndex: 'member_name',
    },
    {
      title: '交易号',
      dataIndex: 'out_trade_no',
    },
    {
      title: '折扣',
      dataIndex: 'discount_rate',
    },
    {
      title: '支付金额',
      dataIndex: 'pay_amount',
    },
    {
      title: '支付账号',
      dataIndex: 'pay_account',
    },
    {
      title: '支付时间',
      dataIndex: 'pay_time',
    },
    {
      title: '支付状态',
      dataIndex: 'pay_status',
      render: (item) => {
        return JSON.parse(localStorage.getItem('AllMaP'))['sys_pay_status'][item] || item;
      },
    },
    {
      title: '支付类型',
      dataIndex: 'pay_type',
      render: (item) => {
        return JSON.parse(localStorage.getItem('AllMaP'))['sys_amount_type'][item] || item;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
    },

    {
      fixed: 'right' as 'right',
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

  const { pagination, data, formParams } = searchTableState;
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
    const data = OrderList({
      page: current,
      page_size: pageSize,
      notice_type,
      notice_title,
      store_code,
    });
    setloading(true);
    data.then((res) => {
      setloading(false);
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
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
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
          scroll={{ x: 3800 }}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
