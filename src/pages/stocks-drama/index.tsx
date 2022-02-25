import React, { useEffect, useState } from 'react';
import {
  Table,
  Drawer,
  Button,
  Image,
  Badge,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
  Select,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { dramaList, labelsApi, getDmList } from '../../api/drama.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_PAGINATION,
  CHANGE_DRAWER_STATUS,
} from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';
import DmForm from './dmform/index';
import AddRoleForm from './addRoleForm/index';
import DramaDetail from './DramaDetail/index';
const Option = Select.Option;
function SearchTable() {
  const locale = useLocale();
  const [dmlist, setdmlist] = useState([]);
  const [modalType, setmodalType] = useState('');
  const [loading, setloading] = useState(false);
  const [addDmModal, setaddDmModal] = useState(false);
  const [visitModal, setvisitModal] = useState(false);
  const [DramaRoleModal, setDramaRoleModal] = useState(false);
  const [gb_typeMap, setgb_typeMap] = useState({});
  const [gb_levelMap, setgb_levelMap] = useState({});
  const [gb_type_labels, setgb_type_labels] = useState([]);
  const [gb_app_gb_status_labels, setgb_app_gb_status_labels] = useState([]);
  const [gb_app_gb_text_tag_labels, setgb_app_gb_text_tag_labels] = useState([]);
  const [gb_app_level_labels, setgb_app_level_labels] = useState([]);
  const [gb_title, setgb_title] = useState<any>();
  const [gb_people, setgb_people] = useState<any>();
  const [gb_type, setgb_type] = useState<any>();
  const [gb_text_tag, setgb_text_tag] = useState<any>();
  const [gb_level, setgb_level] = useState<any>();
  const [gb_status, setgb_status] = useState<any>();
  const columns = [
    {
      title: '剧本标题',
      dataIndex: 'gb_title',
    },
    {
      title: '剧本封面',
      dataIndex: 'gb_cover',
      render: (_, element) => {
        return <Image width={60} height={90} src={element.gb_cover} />;
      },
    },
    {
      title: '剧本类型',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '价格',
      dataIndex: 'gb_price',
    },
    {
      title: '是否启用',
      dataIndex: 'is_enable',
      render: (item) => {
        if (parseInt(item) === 1) {
          return <Badge status="success" text="启用中" />;
        }
        if (parseInt(item) === 0) {
          return <Badge status="error" text="未启用" />;
        }
      },
    },
    {
      title: '剧本标签',
      dataIndex: 'gb_custom_tag',
    },
    {
      title: '是否新本',
      dataIndex: 'is_new',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '是';
        } else {
          return '否';
        }
      },
    },
    {
      title: '是否热门',
      dataIndex: 'is_hot',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '是';
        } else {
          return '否';
        }
      },
    },
    {
      title: '剧本难度',
      dataIndex: 'gb_level',
      render: (value) => {
        return <span>{gb_levelMap[value]}</span>;
      },
    },
    {
      title: '剧本时长',
      dataIndex: 'gb_hour',
      render: (item) => {
        return item + '小时';
      },
    },
    {
      title: '玩家人数',
      dataIndex: 'gb_people',
    },

    {
      title: '上架时间',
      dataIndex: 'gb_add_time',
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
                setmodalType('edit');
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
    return () => {
      dispatch({ type: UPDATE_LIST, payload: { data: [] } });
    };
  }, []);

  const searchTableState = useSelector((state: ReducerState) => {
    return state.searchTable;
  });
  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  const { show, clickItem } = dramaInfoStore;
  const { data, pagination, formParams } = searchTableState;
  useEffect(() => {
    getlabelsApi();
    getDmListApi();
  }, []);
  const getlabelsApi = async () => {
    const { data } = await labelsApi();
    data.forEach((element) => {
      if (element.dict_code === 'app_gb_type') {
        setgb_type_labels(element.dict_label);
      }
      if (element.dict_code === 'app_gb_text_tag') {
        setgb_app_gb_text_tag_labels(element.dict_label);
      }
      if (element.dict_code === 'app_gb_status') {
        setgb_app_gb_status_labels(element.dict_label);
      }
      if (element.dict_code === 'app_gb_status') {
        setgb_app_gb_status_labels(element.dict_label);
      }
      if (element.dict_code === 'app_gb_level') {
        setgb_app_level_labels(element.dict_label);
      }
    });
    const needdata = {};
    const needdata2 = {};
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.dict_name === '剧本类型') {
        const myneeddata = element.dict_label;
        for (let index = 0; index < myneeddata.length; index++) {
          const item = myneeddata[index];
          needdata[item.label_value] = item.label_zh;
        }
      }
      if (element.dict_name === '剧本难度') {
        const myneeddata = element.dict_label;
        for (let index = 0; index < myneeddata.length; index++) {
          const item = myneeddata[index];
          needdata2[item.label_value] = item.label_zh;
        }
      }
    }
    setgb_typeMap(needdata);
    setgb_levelMap(needdata2);
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
      gb_status,
      gb_text_tag,
      gb_level,
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
      // dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
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
        <DramaDetail closeModalAndReq={() => {}} modalType={modalType} />
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
      <Drawer
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
        unmountOnExit={true}
        style={{ width: '90vw' }}
        visible={visitModal}
      >
        <DramaDetail
          closeModalAndReq={() => {
            setvisitModal(false);
            fetchData();
          }}
          modalType={modalType}
        />
        {/* <AddForm
          closeModalAndRequest={() => {
            dispatch({ type: 'save-item', payload: { clickItem: null } });
            fetchData();
            setvisitModal(false);
          }}
          modalType={modalType}
        /> */}
      </Drawer>
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
                    setgb_people(e);
                  }}
                  value={gb_people}
                  placeholder="玩家人数"
                  style={{ width: 200 }}
                />
                <Select
                  onChange={(e) => {
                    setgb_type(e);
                  }}
                  value={gb_type}
                  placeholder="剧本类型"
                  style={{ width: 200 }}
                >
                  {gb_type_labels.map((item) => {
                    return (
                      <Option key={item.label_value} value={item.label_value}>
                        {item.label_zh}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  onChange={(e) => {
                    setgb_level(e);
                  }}
                  value={gb_level}
                  placeholder="剧本难度"
                  style={{ width: 200 }}
                >
                  {gb_app_level_labels.map((item) => {
                    return (
                      <Option key={item.label_value} value={item.label_value}>
                        {item.label_zh}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  onChange={(e) => {
                    setgb_text_tag(e);
                  }}
                  value={gb_text_tag}
                  placeholder="剧本标签"
                  style={{ width: 200 }}
                >
                  {gb_app_gb_text_tag_labels.map((item) => {
                    return (
                      <Option key={item.label_value} value={item.label_value}>
                        {item.label_zh}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  onChange={(e) => {
                    setgb_status(e);
                  }}
                  value={gb_status}
                  placeholder="剧本状态"
                  style={{ width: 200 }}
                >
                  {gb_app_gb_status_labels.map((item) => {
                    return (
                      <Option key={item.label_value} value={item.label_value}>
                        {item.label_zh}
                      </Option>
                    );
                  })}
                </Select>
                <Button
                  onClick={() => {
                    setgb_title(null);
                    setgb_type(null);
                    setgb_text_tag(null);
                    setgb_people(null);
                    setgb_status(null);
                    setgb_level(null);
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
