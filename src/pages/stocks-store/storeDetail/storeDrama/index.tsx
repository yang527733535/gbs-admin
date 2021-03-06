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
import {
  dramaList,
  reqEditStoreDrama,
  reqStoreBindDrama,
  reqDeleteStoreDrama,
} from '../../../../api/drama.js';
import { getDictsByName } from '../../../../utils/getdicts.js';
// let useEffect
let AllMaP = JSON.parse(localStorage.getItem('AllMaP'));
let Option = Select.Option;
export default function StoreDrama({ store_code, getStoreDetail, storeDetailInfo }) {
  const { store_drama } = storeDetailInfo;
  const [clickItem, setclickItem] = useState(null);
  const [editModal, seteditModal] = useState(false);
  const [inputNum, setinputNum] = useState(null);
  const [inputNum2, setinputNum2] = useState(null);
  const [is_new, setis_new] = useState(0);
  const [is_hot, setis_hot] = useState(0);
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
      title: '????????????',
      dataIndex: 'gb_title',
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'gb_cover',
    //   render: (_, element) => {
    //     return <img style={{ width: 30, height: 60 }} src={element.gb_cover} />;
    //   },
    // },
    {
      title: '????????????',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '???????????????',
      dataIndex: 'gb_price',
    },
    {
      title: '????????????',
      dataIndex: 'gb_price2',
    },
    {
      title: '????????????',
      dataIndex: 'is_enable',
      render: (item) => {
        if (parseInt(item) === 1) {
          return <Badge status="success" text="?????????" />;
        }
        if (parseInt(item) === 0) {
          return <Badge status="error" text="?????????" />;
        }
      },
    },
    {
      title: '????????????',
      dataIndex: 'gb_custom_tag',
    },
    {
      title: '????????????',
      dataIndex: 'is_new',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '???';
        } else {
          return '???';
        }
      },
    },
    {
      title: '????????????',
      dataIndex: 'is_hot',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '???';
        } else {
          return '???';
        }
      },
    },
    {
      title: '????????????',
      dataIndex: 'gb_level',
      render: (item) => {
        return AllMaP['app_gb_level'][item];
      },
    },
    {
      title: '????????????',
      dataIndex: 'gb_hour',
      render: (item) => {
        return item + '??????';
      },
    },
    {
      title: '????????????',
      dataIndex: 'gb_people',
    },
    {
      title: '????????????',
      dataIndex: 'gb_add_time',
    },
    {
      title: '??????',
      render: (_, item) => {
        return (
          <Button
            disabled={dramaIsSelect.includes(item.gb_code)}
            onClick={async () => {
              let param: any = new Object();
              param.store_code = store_code.store_code;
              // ????????????????????????
              param.drama_array = [
                {
                  gb_code: item.gb_code,
                  gb_price: inputNum || item.gb_price,
                  gb_price2: inputNum2 || item.gb_price2,
                  is_hot: item?.is_hot,
                  is_new: item?.is_new,
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
            ??????
          </Button>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: '????????????',
      dataIndex: 'gb_title',
    },
    {
      title: '???????????????',
      dataIndex: 'gb_price',
    },
    {
      title: '????????????',
      dataIndex: 'gb_price2',
    },
    {
      title: '????????????',
      dataIndex: 'is_new',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '???';
        }
        if (parseInt(item) === 0) {
          return '???';
        }
      },
    },
    {
      title: '????????????',
      dataIndex: 'is_hot',
      render: (item) => {
        if (parseInt(item) === 1) {
          return '???';
        }
        if (parseInt(item) === 0) {
          return '???';
        }
      },
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'gb_cover',
    //   render: (_, element) => {
    //     return <img style={{ width: 30, height: 60 }} src={element.gb_cover} />;
    //   },
    // },
    {
      title: '????????????',
      dataIndex: 'gb_type',
      render: (value) => {
        return <span>{gb_typeMap[value]}</span>;
      },
    },
    {
      title: '????????????',
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
      title: '??????',
      render: (_, item) => {
        return (
          <Space>
            <Button
              onClick={() => {
                seteditModal(true);
                setclickItem(item);
                console.log(item);
              }}
              size="mini"
              type="primary"
            >
              ??????
            </Button>
            <Popconfirm
              title="?????????????????????"
              onOk={async () => {
                console.log(item);
                let param = {
                  store_code: store_code.store_code,
                  gb_code: item.gb_code,
                };
                let res = await reqDeleteStoreDrama(param);
                if (res.code === 200) {
                  getStoreDetail();
                  Message.success('????????????');
                }
              }}
            >
              <Button size="mini" status="danger">
                ??????
              </Button>
            </Popconfirm>
          </Space>
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
      {/* ?????????????????? */}
      <Modal
        title={saveClick?.gb_title}
        visible={inputNumvisible}
        onOk={async () => {
          Parma['drama_array'][0]['gb_price'] = inputNum;
          Parma['drama_array'][0]['gb_price2'] = inputNum2;
          Parma['drama_array'][0]['is_new'] = is_new;
          Parma['drama_array'][0]['is_hot'] = is_hot;
          let res = await reqStoreBindDrama(Parma);
          console.log('res: ', res);
          if (res.code === 200) {
            getStoreDetail();
            Message.success('????????????');
            setinputNumvisible(false);
          }
        }}
        unmountOnExit
        onCancel={() => setinputNumvisible(false)}
        autoFocus={false}
        focusLock={true}
      >
        <Form>
          <Form.Item label="???????????????">
            <InputNumber
              value={inputNum}
              placeholder="???????????????"
              onChange={(e) => {
                setinputNum(e);
              }}
            ></InputNumber>
          </Form.Item>
          <Form.Item label="????????????">
            <InputNumber
              style={{ marginTop: 10 }}
              value={inputNum2}
              placeholder="????????????"
              onChange={(e) => {
                setinputNum2(e);
              }}
            ></InputNumber>
          </Form.Item>
          <Form.Item label="????????????">
            <Select
              style={{ marginTop: 10 }}
              value={is_hot}
              placeholder="?????????????????????"
              onChange={(e) => {
                setis_hot(e);
              }}
            >
              <Select.Option value={0}>???</Select.Option>
              <Select.Option value={1}>???</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="????????????">
            <Select
              style={{ marginTop: 10 }}
              value={is_new}
              placeholder="?????????????????????"
              onChange={(e) => {
                console.log(e);
                setis_new(e);
              }}
            >
              <Select.Option value={0}>???</Select.Option>
              <Select.Option value={1}>???</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ?????????????????? */}
      <Modal
        title={saveClick?.gb_title}
        visible={editModal}
        //  seteditModal(true)
        unmountOnExit
        onCancel={() => seteditModal(false)}
        autoFocus={false}
        focusLock={true}
        footer={null}
      >
        <Form
          onSubmit={async (e) => {
            let param = {
              ...e,
              gb_code: clickItem.gb_code,
              store_code: store_code.store_code,
            };
            let resdata = await reqEditStoreDrama(param);
            if (resdata.code === 200) {
              seteditModal(false);
              fetchData();
              getStoreDetail();
            }
            console.log('param', param);
          }}
          initialValues={clickItem}
        >
          <Form.Item field="gb_price" label="???????????????">
            <InputNumber placeholder="???????????????"></InputNumber>
          </Form.Item>
          <Form.Item field="gb_price2" label="????????????">
            <InputNumber style={{ marginTop: 10 }} placeholder="????????????"></InputNumber>
          </Form.Item>
          <Form.Item field="is_hot" label="????????????">
            <Select style={{ marginTop: 10 }} placeholder="?????????????????????">
              <Select.Option value={0}>???</Select.Option>
              <Select.Option value={1}>???</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item field="is_new" label="????????????">
            <Select style={{ marginTop: 10 }} placeholder="?????????????????????">
              <Select.Option value={0}>???</Select.Option>
              <Select.Option value={1}>???</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button style={{ marginLeft: 100 }} type="primary" htmlType="submit">
                ??????
              </Button>
              {/* <Button size="mini">q</Button> */}
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <div>
        <Typography.Title heading={4}>??????????????????</Typography.Title>
        <Table size="small" columns={columns2} data={nowDramaListTableData}></Table>
      </div>
      <div>
        <Typography.Title heading={4}>?????????</Typography.Title>
        <div
          style={{ width: '100%', marginBottom: 10, display: 'flex', justifyContent: 'flex-ends' }}
        >
          <Space style={{ flex: 1 }} wrap>
            <Input
              value={gb_title}
              onChange={(e) => {
                setgb_title(e);
              }}
              placeholder="?????????????????????"
              style={{ width: 200 }}
            />
            <Input
              onChange={(e) => {
                setgb_people(e);
              }}
              value={gb_people}
              placeholder="????????????"
              style={{ width: 200 }}
            />
            <Select
              onChange={(e) => {
                setgb_type(e);
              }}
              value={gb_type}
              placeholder="????????????"
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
              placeholder="????????????"
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
              placeholder="????????????"
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
              placeholder="????????????"
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
              ??????
            </Button>
            <Button
              onClick={() => {
                fetchData();
              }}
              type="primary"
            >
              ??????
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
