import React, { useEffect, useState } from 'react';
import {
  Table,
  Drawer,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { dramaList, labelsApi, getDmList } from '../../api/drama.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
  CHANGE_DRAWER_STATUS,
} from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
import AddForm from './form/index';
import DmForm from './dmform/index';
import AddRoleForm from './addRoleForm/index';
import DramaDetail from './DramaDetail/index';

function SearchTable() {
  const locale = useLocale();
  const [dmlist, setdmlist] = useState([]);
  const [modalType, setmodalType] = useState('');
  const [addDmModal, setaddDmModal] = useState(false);
  const [visitModal, setvisitModal] = useState(false);
  const [DramaRoleModal, setDramaRoleModal] = useState(false);
  const [gb_typeMap, setgb_typeMap] = useState({});
  const [gb_title, setgb_title] = useState('');
  const [gb_people, setgb_people] = useState('');
  const [gb_type, setgb_type] = useState('');
  const [gb_area, setgb_area] = useState('');
  const [gb_status, setgb_status] = useState('');
  const columns = [
    {
      title: '剧本ID',
      dataIndex: 'gb_id',
    },
    {
      title: '剧本标题',
      dataIndex: 'gb_title',
    },
    {
      title: '剧本类型',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '剧本区域',
      dataIndex: 'gb_area',
    },
    {
      title: '剧本封面',
      dataIndex: 'gb_cover',
      render: (_, element) => {
        return <img style={{ width: 60, height: 90 }} src={element.gb_cover} />;
      },
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
      dataIndex: 'operations',
      render: (_, data) => (
        <div className={styles.operations}>
          <Space>
            <Button
              type="primary"
              size="mini"
              onClick={() => {
                dispatch({ type: 'toggle-show', payload: { show: true } });
                dispatch({ type: 'save-item', payload: { clickItem: data } });
              }}
            >
              剧本详情
            </Button>
          </Space>
        </div>
      ),
    },
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  const searchTableState = useSelector((state: ReducerState) => {
    return state.searchTable;
  });
  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  const { show, clickItem } = dramaInfoStore;
  const { data, pagination, loading, formParams } = searchTableState;
  useEffect(() => {
    getlabelsApi();
    getDmListApi();
  }, []);
  const getlabelsApi = async () => {
    const { data } = await labelsApi();
    const needdata = {};
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.dict_name === '剧本类型') {
        const myneeddata = element.dict_label;
        for (let index = 0; index < myneeddata.length; index++) {
          const item = myneeddata[index];
          needdata[item.label_value] = item.label_zh;
        }
      }
    }
    setgb_typeMap(needdata);
    dispatch({ type: 'save-label', payload: { labelData: data } });
  };

  const getDmListApi = async () => {
    const data = await getDmList();
    setdmlist(data.data);
  };

  // 获取table数据
  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = dramaList({
      page: current,
      page_size: pageSize,
      gb_title,
      gb_people,
      gb_type,
      gb_area,
      gb_status,
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
      dispatch({ type: CHANGE_DRAWER_STATUS, payload: { dramaDetailDrawer: false } });
      dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
    });
  }

  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    fetchData(current, pageSize, formParams);
  }

  return (
    <div className={styles.container}>
      {/* 剧本详情页
       */}
      <Drawer
        onCancel={() => {
          // 这里需要二次确认
          Modal.confirm({
            title: '当前页面正在编辑,确定退出?',
            okButtonProps: { status: 'danger' },
            onOk: () => {
              dispatch({ type: 'toggle-show', payload: { show: false } });
              fetchData();
            },
          });
        }}
        footer={null}
        visible={show}
        title="剧本详情"
        unmountOnExit
        width="90vw"
      >
        <DramaDetail />
      </Drawer>

      <Modal
        style={{ width: 800 }}
        unmountOnExit
        footer={null}
        title="添加角色"
        visible={DramaRoleModal}
        onCancel={() => {
          setDramaRoleModal(false);
        }}
      >
        <AddRoleForm
          closeModalAndRequest={() => {
            setDramaRoleModal(false);
          }}
          clickItem={clickItem}
        />
      </Modal>
      <Modal
        onCancel={() => {
          setaddDmModal(false);
        }}
        visible={addDmModal}
        unmountOnExit
        footer={null}
        title="添加dm"
      >
        <DmForm
          closeModalAndRequest={() => {
            fetchData();
            setaddDmModal(false);
          }}
          dmlist={dmlist}
          clickItem={clickItem}
        />
      </Modal>
      <Modal
        title="添加剧本"
        footer={null}
        onCancel={() => {
          Modal.confirm({
            title: '当前页面正在编辑,确定退出?',
            okButtonProps: { status: 'danger' },
            onOk: () => {
              // dispatch({ type: 'toggle-show', payload: { show: false } });
              setvisitModal(false);
            },
          });
        }}
        unmountOnExit
        style={{ width: '90vw' }}
        visible={visitModal}
      >
        <AddForm
          closeModalAndRequest={() => {
            dispatch({ type: 'save-item', payload: { clickItem: null } });
            fetchData();
            setvisitModal(false);
          }}
          modalType={modalType}
        />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>运营管理</Breadcrumb.Item>
        <Breadcrumb.Item>剧本管理</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ marginRight: 20 }}
              onClick={() => {
                setmodalType('add');
                setvisitModal(true);
              }}
              type="primary"
            >
              添加剧本
            </Button>
            <div>
              <Space style={{ flex: 1 }} wrap>
                <Input
                  value={gb_title}
                  onChange={(e) => {
                    setgb_title(e);
                  }}
                  placeholder="请输入剧本标题"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setgb_type(e);
                  }}
                  value={gb_type}
                  placeholder="剧本类型"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setgb_area(e);
                  }}
                  value={gb_area}
                  placeholder="剧本区域"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setgb_people(e);
                  }}
                  value={gb_people}
                  placeholder="玩家人数"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setgb_status(e);
                  }}
                  value={gb_status}
                  placeholder="剧本状态"
                  style={{ width: 200 }}
                />
                <Button
                  onClick={() => {
                    setgb_title('');
                    setgb_type('');
                    setgb_area('');
                    setgb_people('');
                    setgb_status('');
                    console.log('重置');
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
          rowKey="gb_id"
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
