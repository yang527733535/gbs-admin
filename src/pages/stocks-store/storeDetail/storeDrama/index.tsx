import React, { useEffect, useState } from 'react';
import {
  Typography,
  Select,
  Button,
  Table,
  Badge,
  Message,
  Tag,
  Modal,
  Popconfirm,
  Input,
  Space,
  InputNumber,
  Form,
} from '@arco-design/web-react';
import { dramaList, reqStoreBindDrama, reqDeleteStoreDrama } from '../../../../api/drama.js';
import { getDictsByName } from '../../../../utils/getdicts.js';
// let useEffect
let AllMaP = JSON.parse(localStorage.getItem('AllMaP'));
let Option = Select.Option;
export default function StoreDrama({ store_code, getStoreDetail, storeDetailInfo }) {
  const { store_drama } = storeDetailInfo;

  const [inputNum, setinputNum] = useState(null);
  const [inputNum2, setinputNum2] = useState(null);
  const [saveClick, setsaveClick] = useState(null);
  const [Parma, setParma] = useState(null);
  const [inputNumvisible, setinputNumvisible] = useState(false);
  // const [SelectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableData, settableData] = useState([]);
  const [tableloading, settableloading] = useState(false);
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10,
    total: 1111,
  });
  const [nowDramaListTableData, setnowDramaListTableData] = useState(store_drama);
  const [gb_typeMap, setgb_typeMap] = useState({});
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
  useEffect(() => {
    const data = getDictsByName('app_gb_type');
    let newMap = new Object();
    data.forEach((element) => {
      newMap[element.label_value] = element.label_zh;
    });
    setgb_typeMap(newMap);
  }, []);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem('dicts'));
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
  }, []);

  useEffect(() => {
    const { store_drama } = storeDetailInfo;
    setnowDramaListTableData(store_drama);
  }, [storeDetailInfo]);
  const [dramaIsSelect, setdramaIsSelect] = useState([]);
  useEffect(() => {
    const { store_drama } = storeDetailInfo;
    let newArr = store_drama.reduce((a, b) => {
      a.push(b.gb_code);
      return a;
    }, []);
    setdramaIsSelect(newArr);
  }, [getStoreDetail]);
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: '剧本标题',
      dataIndex: 'gb_title',
    },
    // {
    //   title: '剧本封面',
    //   dataIndex: 'gb_cover',
    //   render: (_, element) => {
    //     return <img style={{ width: 30, height: 60 }} src={element.gb_cover} />;
    //   },
    // },
    {
      title: '剧本类型',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '工作日价格',
      dataIndex: 'gb_price',
    },
    {
      title: '周末价格',
      dataIndex: 'gb_price2',
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
      render: (item) => {
        return AllMaP['app_gb_level'][item];
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
      title: '操作',
      render: (_, item) => {
        return (
          <Button
            disabled={dramaIsSelect.includes(item.gb_code)}
            onClick={async () => {
              let param: any = new Object();
              param.store_code = store_code.store_code;
              // 这里价格需要设置
              param.drama_array = [
                {
                  gb_code: item.gb_code,
                  gb_price: inputNum || item.gb_price,
                  gb_price2: inputNum2 || item.gb_price2,
                },
              ];
              setinputNum(item.gb_price);
              setinputNum2(item.gb_price2);
              console.log('item', item);
              setsaveClick(item);
              setinputNumvisible(true);
              setParma(param);
            }}
            size="mini"
            type="primary"
          >
            添加
          </Button>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: '剧本标题',
      dataIndex: 'gb_title',
    },
    {
      title: '工作日价格',
      dataIndex: 'gb_price',
    },
    {
      title: '周末价格',
      dataIndex: 'gb_price2',
    },
    // {
    //   title: '剧本封面',
    //   dataIndex: 'gb_cover',
    //   render: (_, element) => {
    //     return <img style={{ width: 30, height: 60 }} src={element.gb_cover} />;
    //   },
    // },
    {
      title: '剧本类型',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '剧本标签',
      dataIndex: 'gb_text_tag',
      render: (item) => {
        let Arr = item.split(',');
        return (
          <Space>
            {Arr.map((element) => {
              return <Tag>{AllMaP['app_gb_text_tag'][element]}</Tag>;
            })}
          </Space>
        );
      },
    },
    {
      title: '操作',
      render: (_, item) => {
        return (
          <Popconfirm
            title="确定删除该剧本"
            onOk={async () => {
              console.log(item);
              let param = {
                store_code: store_code.store_code,
                gb_code: item.gb_code,
              };
              let res = await reqDeleteStoreDrama(param);
              if (res.code === 200) {
                getStoreDetail();
                Message.success('删除成功');
              }
            }}
          >
            <Button size="mini" status="danger">
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  function fetchData(current = 1, pageSize = 10, params = {}) {
    console.log('params: ', params);
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
    settableloading(true);
    data.then((res) => {
      settableloading(false);
      const { data, paginator } = res;
      setpagination({
        current: paginator.page,
        pageSize: paginator.page_size,
        total: paginator.total_count,
      });
      settableData(data);
    });
  }
  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    setpagination(pagination);
    fetchData(current, pageSize);
  }
  return (
    <div>
      <Modal
        title={saveClick?.gb_title}
        visible={inputNumvisible}
        onOk={async () => {
          Parma['drama_array'][0]['gb_price'] = inputNum;
          Parma['drama_array'][0]['gb_price2'] = inputNum2;
          let res = await reqStoreBindDrama(Parma);
          console.log('res: ', res);
          if (res.code === 200) {
            getStoreDetail();
            Message.success('添加成功');
            setinputNumvisible(false);
          }
        }}
        unmountOnExit
        onCancel={() => setinputNumvisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Form>
          <Form.Item label="工作日价格">
            <InputNumber
              value={inputNum}
              placeholder="工作日价格"
              onChange={(e) => {
                setinputNum(e);
              }}
            ></InputNumber>
          </Form.Item>
          <Form.Item label="周末价格">
            <InputNumber
              style={{ marginTop: 10 }}
              value={inputNum2}
              placeholder="周末价格"
              onChange={(e) => {
                setinputNum2(e);
              }}
            ></InputNumber>
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <Typography.Title heading={4}>已添加的剧本</Typography.Title>
        <Table size="small" columns={columns2} data={nowDramaListTableData}></Table>
      </div>
      <div>
        <Typography.Title heading={4}>剧本库</Typography.Title>
        <div
          style={{ width: '100%', marginBottom: 10, display: 'flex', justifyContent: 'flex-ends' }}
        >
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
        <Table
          loading={tableloading}
          onChange={onChangeTable}
          rowKey="store_id"
          size="mini"
          // rowSelection={{
          //   type: 'checkbox',
          //   selectedRowKeys: SelectedRowKeys,
          //   onChange: (selectedRowKeys, selectedRows) => {},
          //   onSelect: (selected, record, selectedRows) => {
          //     console.log('onSelect:', selected, record, selectedRows);
          //   },
          // }}
          pagination={pagination}
          data={tableData}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
}
