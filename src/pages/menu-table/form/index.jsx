import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  AutoComplete,
  Input,
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
import { addDrama, addMenu } from '../../../api/drama.js';

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

function Shop({ closeModalAndReqTable }) {
  const formRef = useRef();
  const [size, setSize] = useState('default');
  const [statusLabel, setstatusLabel] = useState([]);
  useEffect(() => {
    // formRef.current.setFieldsValue({ rate: 5 });
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };

  useEffect(() => {
    const dicts = JSON.parse(localStorage.getItem('dicts'));
    dicts.forEach((element) => {
      console.log('element: ', element);
      if (element.dict_code === 'is_enable') {
        setstatusLabel(element.dict_label);
      }
    });
  }, []);
  console.log(statusLabel);
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
          label="菜单名称"
          field="menu_name"
          rules={[{ required: true, message: '请填写菜单名称' }]}
        >
          <Input placeholder="请填写菜单名称..." />
        </FormItem>
        <FormItem
          label="菜单状态"
          field="menu_status"
          rules={[{ required: true, message: '请填写菜单状态' }]}
        >
          <Select placeholder="请选择菜单状态">
            {statusLabel.map(({ label_value, label_zh }) => {
              return <Select.Option value={label_value}>{label_zh}</Select.Option>;
            })}
          </Select>
        </FormItem>
        <FormItem
          label="菜单路径"
          field="menu_key"
          rules={[{ required: false, message: '请填写菜单路径' }]}
        >
          <Input placeholder="请填写菜单路径..." />
        </FormItem>
        <FormItem
          label="组件路径"
          field="menu_path"
          rules={[{ required: false, message: '请填写组件路径' }]}
        >
          <Input placeholder="请填写组件路径..." />
        </FormItem>
        <FormItem
          label="菜单图标"
          field="menu_icon"
          rules={[{ required: false, message: '请填写菜单图标' }]}
        >
          <Input placeholder="请填写菜单图标..." />
        </FormItem>
        <FormItem
          label="父级Id"
          field="parent_id"
          rules={[{ required: false, message: '请填写父级Id' }]}
        >
          <InputNumber placeholder="请填写父级Id..." />
        </FormItem>
        <FormItem
          label="菜单等级"
          field="menu_lev"
          rules={[{ required: false, message: '请填写菜单等级' }]}
        >
          <InputNumber placeholder="请填写菜单等级..." />
        </FormItem>
        <FormItem
          label="菜单排序"
          field="menu_sort"
          rules={[{ required: false, message: '请填写菜单排序' }]}
        >
          <InputNumber placeholder="请填写菜单排序..." />
        </FormItem>

        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  const data = await addMenu(formRef.current.getFields());
                  console.log('data: ', data);
                  if (data.code === 200) {
                    Message.success('添加成功');
                    closeModalAndReqTable();
                  }
                } catch (_) {
                  console.log(formRef.current.getFieldsError());
                  Message.error('校验失败，请检查字段！');
                }
              }
            }}
            type="primary"
            style={{ marginRight: 24 }}
          >
            Submit
          </Button>
          <Button
            onClick={() => {
              formRef.current.resetFields();
            }}
          >
            Reset
          </Button>
          {/* <Button
            type="text"
            onClick={() => {
              Message.info(`fields: ${formRef.current.getTouchedFields().join(',')}`);
            }}
          >
            Get touched fields
          </Button> */}
        </FormItem>
      </Form>
    </div>
  );
}

export default Shop;
