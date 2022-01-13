import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  Input,
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
import { addLabel } from '../../../api/drama.js';

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

function Shop({ closeModalAndReqTable, parentMap, selectdict_code }) {
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
        onSubmit={(e) => {
          console.log(e);
        }}
        initialValues={{
          dict_code: selectdict_code,
        }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <FormItem
          label="目录编码"
          field="dict_code"
          rules={[{ required: true, message: '请填写菜单名称' }]}
        >
          <Input disabled placeholder="请填写菜单名称..." />
        </FormItem>
        <FormItem
          label="字典中文"
          field="label_zh"
          rules={[{ required: true, message: '请填写字典中文' }]}
        >
          <Input placeholder="请填写字典中文..." />
        </FormItem>
        <FormItem
          label="字典英文"
          field="label_en"
          rules={[{ required: true, message: '请填写字典英文' }]}
        >
          <Input placeholder="请填写字典英文..." />
        </FormItem>
        <FormItem
          label="字典值"
          field="label_value"
          rules={[{ required: true, message: '请填写字典值' }]}
        >
          <Input placeholder="请填写字典值..." />
        </FormItem>
        <FormItem
          label="排序"
          field="label_sort"
          rules={[{ required: false, message: '请填写排序' }]}
        >
          <InputNumber placeholder="请填写排序..." />
        </FormItem>
        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  const data = await addLabel(formRef.current.getFields());
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
