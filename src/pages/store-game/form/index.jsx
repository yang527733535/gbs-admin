import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Form,
  Spin,
  Input,
  Space,
  Select,
  Button,
  Message,
  Avatar,
  InputNumber,
} from '@arco-design/web-react';
import { IconDelete } from '@arco-design/web-react/icon';
import debounce from 'lodash/debounce';
import {
  shopList,
  addGame,
  updateShop,
  regionsList,
  dramaList,
  StoreDetailApi,
  getdramaprice,
  reqGameDetail,
} from '../../../api/drama.js';
import { dmList, memberList } from '../../../api/user.js';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};
const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 7,
  },
};

function Shop({ closeModalAndReqTable, clickItem }) {
  const formRef = useRef();
  const size = 'default';
  const [shopListOption, setshopListOption] = useState([]);
  const [shopListLoading, setshopListLoading] = useState(true);

  const [cascaderOptionsArr, setcascaderOptionsArr] = useState([]);
  const [roomListOpions, setroomListOpions] = useState([]);

  const [nowstore_code, setnowstore_code] = useState(localStorage.getItem('nowshop'));
  // 剧本列表
  const [options, setOptions] = useState([]);
  // 剧本的fetching
  const [fetching, setFetching] = useState(false);
  // 主持人列表
  const [dmListOption, setdmListOption] = useState([]);
  // 主持人的fetching
  const [dmfetching, setdmfetching] = useState(false);
  const [price1, setprice1] = useState('');
  const [price2, setprice2] = useState('');
  //  玩家的列表
  const [VipListOption, setVipListOption] = useState([]);
  // 主持人的fetching
  const [vipfetching, setvipfetching] = useState(false);

  const refFetchId = useRef(null);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };
  useEffect(() => {
    const regionsData = regionsList();
    regionsData.then((res) => {
      const { data } = res;
      const mapTree = (org) => {
        const haveChildren = Array.isArray(org.region_children) && org.region_children.length > 0;
        return {
          key: String(org.region_id),
          value: String(org.region_id),
          label: org.region_name,
          children: haveChildren ? org.region_children.map((i) => mapTree(i)) : [],
        };
      };
      let arr = [];
      arr = data.map((org) => mapTree(org));
      setcascaderOptionsArr(arr);
    });
  }, []);

  const getShopList = async () => {
    const { data } = await shopList();
    setshopListLoading(false);
    setshopListOption(data);
  };
  useEffect(() => {
    getShopList();
  }, []);
  useEffect(() => {
    formRef.current.setFieldsValue({
      store_code: localStorage.getItem('nowshop'),
    });
  }, []);

  const debouncedFetchDrama = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      setFetching(true);
      setOptions([]);
      const param = { gb_title: inputValue };
      const res = dramaList(param);
      res.then((data) => {
        const options = data.data.map((drama) => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar shape="square" size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                <img alt="avatar" src={drama.gb_cover} />
              </Avatar>
              {`${drama.gb_title}`}
            </div>
          ),
          value: drama.gb_code,
        }));
        setFetching(false);
        setOptions(options);
      });
    }, 500),
    []
  );
  const debouncedFetchDM = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      setdmfetching(true);
      setOptions([]);
      const param = { user_nick: inputValue };
      const res = dmList(param);
      res.then((data) => {
        const options = data.data.map((dm) => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                <img alt="avatar" src={dm.user_photo} />
              </Avatar>
              {`${dm.user_nick}`}
            </div>
          ),
          value: dm.user_account,
        }));
        setdmfetching(false);
        setdmListOption(options);
      });
    }, 500),
    []
  );
  const debouncedFetchVip = useCallback(
    debounce((inputValue) => {
      refFetchId.current = Date.now();
      setFetching(true);
      setOptions([]);
      const param = { member_name: inputValue };
      const res = memberList(param);
      res.then((data) => {
        console.log('data: ', data);
        const options = data.data.map((vip) => ({
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar size={24} style={{ marginLeft: 6, marginRight: 12 }}>
                <img alt="avatar" src={vip.member_face} />
              </Avatar>
              {`${vip.member_name}`}
            </div>
          ),
          value: vip.member_account,
        }));
        setvipfetching(false);
        console.log('options', options);
        setVipListOption(options);
      });
    }, 500),
    []
  );
  // debouncedFetchVip

  useEffect(() => {
    debouncedFetchDrama();
    debouncedFetchVip();
    debouncedFetchDM();
  }, []);

  const getroomListOpions = async () => {
    const parma = {
      store_code: nowstore_code,
    };
    const data = await StoreDetailApi(parma);
    const { store_room } = data.data;
    setroomListOpions(store_room);
  };
  useEffect(() => {
    getroomListOpions();
  }, [nowstore_code]);

  return (
    <div style={{ maxWidth: 650 }}>
      <Form
        ref={formRef}
        {...formItemLayout}
        size={size}
        onSubmit={(e) => {
          console.log(e);
        }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <FormItem
          label="选择店铺"
          field="store_code"
          rules={[{ required: true, message: '请填写店铺编码' }]}
        >
          <Select
            onChange={async (e) => {
              setnowstore_code(e);
            }}
            loading={shopListLoading}
            placeholder="请选择店铺"
          >
            {shopListOption?.map((item) => {
              return (
                <Select.Option key={item.store_code} value={item.store_code}>
                  {item.store_name}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem
          label="选择房间"
          field="room_code"
          rules={[{ required: true, message: '请填写店铺编码' }]}
        >
          <Select placeholder="请选择房间">
            {roomListOpions.map((item) => {
              return (
                <Select.Option key={item.room_code} value={item.room_code}>
                  {item.room_name}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem label="剧本" field="gb_code" rules={[{ required: true, message: '请选择剧本' }]}>
          <Select
            onChange={async (e) => {
              const param = {
                gb_code: e,
                store_code: nowstore_code,
              };
              const { data } = await getdramaprice(param);
              const { gb_price, gb_price2 } = data;
              setprice1(gb_price);
              setprice2(gb_price2);
              formRef.current.setFieldsValue({
                gb_price: data.is_leisure === 0 ? data.gb_price : data.gb_price2,
              });
              console.log('data: ', data);

              // const data =  getPriceApi(param)
              // console.log('data: ', data);
              // // let data = await getPriceApi(param)
              // console.log('data: ', data);
            }}
            style={{ width: 345 }}
            options={options}
            placeholder="请输入要搜索的剧本"
            filterOption={false}
            renderFormat={(option) => {
              return option.children.props.children[1];
            }}
            notFoundContent={
              fetching ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Spin style={{ margin: 12 }} />
                </div>
              ) : null
            }
            showSearch
            onSearch={debouncedFetchDrama}
          />
        </FormItem>
        {price1 && (
          <FormItem label="参考价格">
            <span>工作日:¥{price1}</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>周末:¥{price2}</span>
          </FormItem>
        )}

        <FormItem
          label="剧本价格"
          field="gb_price"
          rules={[{ required: true, message: '请填写剧本价格' }]}
        >
          <InputNumber min={0} placeholder="请填写剧本价格..." />
        </FormItem>

        <FormItem
          label="玩家人数"
          field="game_people"
          rules={[{ required: true, message: '请填写玩家人数' }]}
        >
          <InputNumber min={1} placeholder="请填写玩家人数..." />
        </FormItem>
        <FormItem
          label="主持人"
          field="dm_user"
          rules={[{ required: true, message: '请填写主持人' }]}
        >
          <Select
            style={{ width: 345 }}
            options={dmListOption}
            placeholder="请选择主持人"
            filterOption={false}
            renderFormat={(option) => {
              return option.children.props.children[1];
            }}
            notFoundContent={
              dmfetching ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Spin style={{ margin: 12 }} />
                </div>
              ) : null
            }
            showSearch
            onSearch={debouncedFetchDM}
          />
        </FormItem>

        <Form.List field="game_player">
          {(fields, { add, remove, move }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item label={`玩家${1 + index}`}>
                        <Space>
                          <Form.Item
                            field={`${item.field}.player_user`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select
                              style={{ width: 145 }}
                              options={VipListOption}
                              placeholder="请选择玩家"
                              filterOption={false}
                              renderFormat={(option) => {
                                return option.children.props.children[1];
                              }}
                              notFoundContent={
                                vipfetching ? (
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <Spin style={{ margin: 12 }} />
                                  </div>
                                ) : null
                              }
                              showSearch
                              onSearch={debouncedFetchVip}
                            />
                          </Form.Item>
                          <Form.Item
                            field={`${item.field}.player_type`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="玩家类型">
                              <Select.Option value="player">player</Select.Option>
                              <Select.Option value="worker">worker</Select.Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            field={`${item.field}.player_name`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="玩家名称" />
                          </Form.Item>
                          <Form.Item
                            field={`${item.field}.player_note`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="玩家备注" />
                          </Form.Item>
                          <Button
                            icon={<IconDelete />}
                            shape="circle"
                            status="danger"
                            onClick={() => remove(index)}
                          />
                        </Space>
                      </Form.Item>
                    </div>
                  );
                })}
                <Form.Item {...noLabelLayout}>
                  <Button
                    onClick={() => {
                      add();
                    }}
                  >
                    添加玩家
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        {/* <FormItem
          label="开业日期"
          field="open_date"
          rules={[
            {
              required: true,
              message: '请填写开业日期',
            },
          ]}
        >
          <DatePicker showTime />
        </FormItem> */}

        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  if (clickItem === null) {
                    const param = formRef.current.getFields();
                    if (param.game_player === null || param.game_player === undefined) {
                      param.game_player = [];
                    }
                    var data = await addGame(param);
                  } else {
                    const param = formRef.current.getFields();
                    console.log('param: ', param);
                    param.store_code = clickItem.store_code;
                    var data = await updateShop(param);
                  }

                  if (data.code === 200) {
                    Message.success('添加成功');
                    closeModalAndReqTable();
                  }
                } catch (_) {
                  console.log(_);
                  console.log(formRef.current.getFieldsError());
                  Message.error('校验失败，请检查字段！');
                }
              }
            }}
            type="primary"
            style={{ marginRight: 24 }}
          >
            提交
          </Button>
          <Button
            onClick={() => {
              formRef.current.resetFields();
            }}
          >
            重置
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Shop;
