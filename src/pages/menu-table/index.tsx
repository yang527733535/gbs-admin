import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Breadcrumb, Card, Space, Modal } from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { menuList } from '../../api/drama.js';
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
  const [visitModal, setvisitModal] = useState(false);
  const [menu_code, setmenu_code] = useState('');
  const [menu_status, setmenu_status] = useState('');
  const [menu_name, setmenu_name] = useState('');
  const [menu_path, setmenu_path] = useState('');

  const [clickItem, setclickItem] = useState(null);
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'menu_name',
    },
    {
      title: '菜单编码',
      dataIndex: 'menu_code',
    },
    {
      title: '菜单路径',
      dataIndex: 'menu_path',
    },
    {
      title: '菜单ID',
      dataIndex: 'menu_id',
    },

    {
      title: locale['searchTable.columns.operations'],
      render: (col, data) => (
        <Button
          onClick={() => {
            console.log(col, data);
            setclickItem(data);
            setvisitModal(true);
          }}
          size="small"
        >
          {locale['searchTable.columns.operations.update']}
        </Button>
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
    const data = menuList({
      page: current,
      page_size: pageSize,
      menu_code,
      menu_status,
      menu_name,
      menu_path,
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
        title={clickItem === null ? '添加菜单' : '修改菜单'}
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
                setvisitModal(true);
                setclickItem(null);
              }}
              type="primary"
              // style={{ marginRight: 20 }}
            >
              添加菜单
            </Button>
            <div>
              <Space style={{ marginLeft: 20 }} wrap>
                <Input
                  value={menu_code}
                  onChange={(e) => {
                    setmenu_code(e);
                  }}
                  placeholder="请输入菜单编码"
                  style={{ width: 200 }}
                />
                <Input
                  value={menu_status}
                  onChange={(e) => {
                    setmenu_status(e);
                  }}
                  placeholder="请选择菜单状态"
                  style={{ width: 200 }}
                />
                <Input
                  value={menu_name}
                  onChange={(e) => {
                    setmenu_name(e);
                  }}
                  placeholder="请输入菜单名称"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setmenu_path(e);
                  }}
                  placeholder="菜单路径"
                  value={menu_path}
                  style={{ width: 200 }}
                />

                <Button
                  onClick={() => {
                    setmenu_code('');
                    setmenu_status('');
                    setmenu_name('');
                    setmenu_path('');
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
          rowKey="menu_id"
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
