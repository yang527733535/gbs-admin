import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  AutoComplete,
  Input,
  Space,
  Select,
  TreeSelect,
  Button,
  Checkbox,
  Switch,
  Radio,
  Cascader,
  Message,
  InputNumber,
  Rate,
  Slider,
  Upload,
  DatePicker,
  Modal,
} from '@arco-design/web-react';
import { addDrama, addGame, updateShop, regionsList } from '../../../api/drama.js';
import { IconArrowRise, IconArrowFall, IconDelete } from '@arco-design/web-react/icon';
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
  const [size, setSize] = useState('default');
  const [cascaderOptionsArr, setcascaderOptionsArr] = useState([]);
  console.log(clickItem);
  useEffect(() => {
    formRef.current.setFieldsValue(clickItem);
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };
  useEffect(() => {
    const regionsData = regionsList();
    regionsData.then((res) => {
      console.log('res: ', res);
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
      console.log(arr);
      setcascaderOptionsArr(arr);
    });
  }, []);
  // regionsList

  return (
    <div style={{ maxWidth: 650 }}>
      <Form
        ref={formRef}
        {...formItemLayout}
        size={size}
        // initialValues={{
        //   slider: 20,
        //   'a.b[0].c': ['b'],
        // }}
        onSubmit={(e) => {
          console.log(e);
        }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <FormItem
          label="店铺编码"
          field="store_code"
          rules={[{ required: true, message: '请填写店铺编码' }]}
        >
          <Input placeholder="请填写店铺编码..." />
        </FormItem>
        <FormItem
          label="剧本编码"
          field="gb_code"
          rules={[{ required: true, message: '请填写剧本编码' }]}
        >
          <Input placeholder="请填写剧本编码..." />
        </FormItem>
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
          <InputNumber min={2} placeholder="请填写玩家人数..." />
        </FormItem>
        <FormItem
          label="主持人"
          field="dm_user"
          rules={[{ required: true, message: '请填写主持人' }]}
        >
          <Input min={2} placeholder="请填写主持人..." />
        </FormItem>

        <Form.List field="game_player">
          {(fields, { add, remove, move }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item label={'玩家' + (1 + index)}>
                        <Space>
                          <Form.Item
                            field={item.field + '.player_user'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="玩家账号" />
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.player_type'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="玩家类型">
                              <Select.Option value="player">player</Select.Option>
                              <Select.Option value="worker">worker</Select.Option>
                            </Select>
                          </Form.Item>

                          <Form.Item
                            field={item.field + '.player_name'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="玩家名称" />
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.player_note'}
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
                          ></Button>
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
                  // Message.info('校验通过，提交成功！');
                  if (clickItem === null) {
                    console.log(formRef.current.getFields());
                    var data = await addGame(formRef.current.getFields());
                  } else {
                    const param = formRef.current.getFields();
                    console.log('param: ', param);
                    param.store_code = clickItem.store_code;
                    var data = await updateShop(param);
                  }
                  console.log('data: ', data);
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
