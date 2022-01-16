import React, { useEffect, useState } from 'react';
import { Typography, Button, Table, Badge, Message, Popconfirm } from '@arco-design/web-react';
import { dramaList, reqStoreBindDrama, reqDeleteStoreDrama } from '../../../../api/drama.js';
import { getDictsByName } from '../../../../utils/getdicts.js';
export default function StoreDrama({ store_code, getStoreDetail, storeDetailInfo }) {
  const { store_drama } = storeDetailInfo;
  const [tableData, settableData] = useState([]);
  const [tableloading, settableloading] = useState(false);
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10,
    total: 1111,
  });
  const [nowDramaListTableData, setnowDramaListTableData] = useState(store_drama);
  const [gb_typeMap, setgb_typeMap] = useState({});

  useEffect(() => {
    const data = getDictsByName('app_gb_type');
    let newMap = new Object();
    data.forEach((element) => {
      newMap[element.label_value] = element.label_zh;
    });
    setgb_typeMap(newMap);
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
              param.drama_array = [{ gb_code: item.gb_code, gb_price: item.gb_price }];
              let res = await reqStoreBindDrama(param);
              console.log('res: ', res);
              if (res.code === 200) {
                getStoreDetail();
                Message.success('添加成功');
              }
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
      <div>
        <Typography.Title heading={4}>已添加的剧本</Typography.Title>
        <Table size="small" columns={columns2} data={nowDramaListTableData}></Table>
      </div>
      <div>
        <Typography.Title heading={4}>剧本库</Typography.Title>
        <Table
          loading={tableloading}
          onChange={onChangeTable}
          key="store_id"
          size="mini"
          //   rowSelection={{
          //     type: 'checkbox',
          //     selectedRowKeys,
          //     onChange: (_, selectedRows) => {
          //       console.log('selectedRows: ', selectedRows);
          //       setSelectedRowKeys(selectedRowKeys);
          //     },
          //     onSelect: (selected, record, selectedRows) => {
          //       console.log('onSelect:', selected, record, selectedRows);
          //     },
          //     checkboxProps: (record) => {
          //       return {
          //         disabled: record.id === '4',
          //       };
          //     },
          //   }}
          pagination={pagination}
          data={tableData}
          columns={columns}
        ></Table>
      </div>
    </div>
  );
}
