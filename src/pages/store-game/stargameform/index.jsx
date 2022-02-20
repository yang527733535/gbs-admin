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
import {
  shopList,
  addGame,
  updateShop,
  regionsList,
  dramaList,
  StoreDetailApi,
} from '../../../api/drama.js';
import { dmList, memberList } from '../../../api/user.js';
import debounce from 'lodash/debounce';

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

  // 剧本列表
  const [options, setOptions] = useState([]);
  // 剧本的fetching
  const [fetching, setFetching] = useState(false);
  // 主持人列表
  const [dmListOption, setdmListOption] = useState([]);
  // 主持人的fetching
  const [dmfetching, setdmfetching] = useState(false);

  //  玩家的列表
  const [VipListOption, setVipListOption] = useState([]);
  // 主持人的fetching
  const [vipfetching, setvipfetching] = useState(false);

  const refFetchId = useRef(null);
  useEffect(() => {
    console.log('clickItem2222', clickItem);
    reqStoreSelectOptions(clickItem.store_code);
    formRef.current.setFieldsValue({
      store_code: clickItem.store_code,
      room_code: clickItem.room_code,
      // gb_code: clickItem.gb_code,
    });
  }, []);

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
  // shopList
  // regionsList

  // debouncedFetchVip

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

  const reqStoreSelectOptions = async (e) => {
    const parma = {
      store_code: e,
    };
    const data = await StoreDetailApi(parma);
    const { store_room } = data.data;
    setroomListOpions(store_room);
  };

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
          label="当前店铺"
          field="store_code"
          rules={[{ required: false, message: '请填写店铺编码' }]}
        >
          <Select
            disabled
            onChange={async (e) => {
              reqStoreSelectOptions(e);
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
          rules={[{ required: false, message: '请填写店铺编码' }]}
        >
          <Select disabled placeholder="请选择房间">
            {roomListOpions.map((item) => {
              return (
                <Select.Option key={item.room_code} value={item.room_code}>
                  {item.room_name}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem label="剧本" field="gb_code" rules={[{ required: false, message: '请选择剧本' }]}>
          <span>{clickItem.gb_code}</span>
        </FormItem>
        <FormItem
          label="游戏编码"
          field="game_code"
          rules={[{ required: false, message: '请选择剧本' }]}
        >
          <span>{clickItem.game_code}</span>
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

        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  const param = await formRef.current.validate();
                  console.log('param: ', param);

                  return;
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
            开始游戏
          </Button>
          {/* <Button
            onClick={() => {
              formRef.current.resetFields();
            }}
          >
            重置
          </Button> */}
        </FormItem>
      </Form>
    </div>
  );
}

export default Shop;
