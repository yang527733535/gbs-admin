import React, { useEffect, useState } from 'react';
import { Table, Menu, Button, Breadcrumb, Card, Modal } from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { menuList, dictcategoryApi, reqReadDict } from '../../api/drama.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
import AddForm from './form/index.jsx';

function SearchTable({}) {
  const columns = [
    {
      title: '中文',
      dataIndex: 'label_zh',
    },
    {
      title: '英文',
      dataIndex: 'label_en',
    },
    {
      title: '字典编码',
      dataIndex: 'dict_code',
    },
    {
      title: '取值编码',
      dataIndex: 'label_value',
    },

    {
      title: '操作',
      render: () => {
        return (
          <Button size="small" type="primary">
            修改
          </Button>
        );
      },
    },
  ];
  const MenuItem = Menu.Item;
  const [visitModal, setvisitModal] = useState(false);
  const [menu_code] = useState('');
  const [menu_status] = useState('');
  const [menu_name] = useState('');
  const [menu_path] = useState('');
  const [clickItem] = useState(null);

  const [cateArr, setcateArr] = useState([]);
  const [tabledata, settabledata] = useState([]);
  const searchTableState = useSelector((state: ReducerState) => state.searchTable);
  const { pagination } = searchTableState;
  const [selectdict_code, setselectdict_code] = useState('');
  // const [parentMap, setparentMap] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    return () => {
      dispatch({ type: UPDATE_LIST, payload: { data: [] } });
    };
  }, []);
  useEffect(() => {
    reqCate();
  }, []);

  const reqCate = async () => {
    const data = await dictcategoryApi();
    setcateArr(data.data);
  };

  function fetchData(current = 1, pageSize = 10, params = {}) {
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

  // function onChangeTable(pagination) {
  //   const { current, pageSize } = pagination;
  //   fetchData(current, pageSize, formParams);
  // }

  return (
    <div className={styles.container}>
      <Modal
        title={clickItem === null ? '添加目录' : '修改字典'}
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          selectdict_code={selectdict_code}
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            fetchData();
          }}
        />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
        <Breadcrumb.Item>字典管理</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Menu
            onClickMenuItem={async (key, e, value) => {
              console.log(e);
              console.log(value);
              const param = { dict_code: key };
              setselectdict_code(key);
              const data = await reqReadDict(param);
              settabledata(data.data);
            }}
            style={{ width: 200, borderRadius: 4 }}
            mode="pop"
            // collapse={collapse}
            defaultOpenKeys={['0']}
            defaultSelectedKeys={['0_2']}
          >
            {cateArr.map(({ dict_code, dict_name }) => {
              return <MenuItem key={dict_code}>{dict_name}</MenuItem>;
            })}
          </Menu>
        </div>
        <div style={{ flex: 1 }}>
          <Card style={{ height: '75vh', borderRadius: 4 }}>
            <div>
              {selectdict_code !== '' && (
                <Button
                  onClick={() => {
                    setvisitModal(true);
                  }}
                  style={{ marginBottom: 20 }}
                  type="primary"
                >
                  添加字典
                </Button>
              )}
            </div>
            <Table
              showHeader
              // stripe={true}
              hover
              columns={columns}
              data={tabledata}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SearchTable;
