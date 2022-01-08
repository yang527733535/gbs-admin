import React, { useState, useRef } from 'react';
import { reqBindDm } from '../../../api/drama.js';
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
export default function DmForm({ clickItem, closeModalAndRequest, dmlist }) {
  const formRef = useRef();
  return (
    <div>
      <Form ref={formRef} {...formItemLayout}>
        <FormItem
          label="选择DM"
          required
          field="dm_array"
          rules={[
            {
              required: true,
              minLength: 1,
              message: 'choice is required',
            },
          ]}
        >
          <Select mode="multiple" allowCreate placeholder="请选择dm">
            {dmlist?.map((item) => {
              return (
                <Select.Option key={item.user_account} value={item.user_account}>
                  {item.user_nick}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  let param = await formRef.current.validate();
                  param.gb_code = clickItem.gb_code;
                  param.dm_array = param.dm_array.map((item) => {
                    return { user_account: item };
                  });
                  const data = await reqBindDm(param);
                  if (data.code === 200) {
                  }
                  Message.info('提交成功！');
                  closeModalAndRequest();
                } catch (_) {
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
