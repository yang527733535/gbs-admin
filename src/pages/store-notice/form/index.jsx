import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Select, Message } from '@arco-design/web-react';
import { shopList, Addnotice, Editnotice } from '../../../api/drama.js';

const FormItem = Form.Item;
function Index({ UserList, clickItem, closeModalAndReqNewTableData }) {
  const [form] = Form.useForm();
  const [shopListOption, setshopListOption] = useState([]);
  const [shopListLoading, setshopListLoading] = useState(true);
  const getShopList = async () => {
    const { data } = await shopList();
    setshopListLoading(false);
    setshopListOption(data);
  };
  useEffect(() => {
    getShopList();
  }, []);

  const editForm = () => {
    form.setFieldsValue(clickItem);
  };
  useEffect(() => {
    if (clickItem) {
      console.log('clickItem', clickItem);
      editForm();
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem('nowshop')) {
      form.setFieldsValue({ store_code: localStorage.getItem('nowshop') });
    }
  }, []);

  // form.setFieldsValue(clickItem);

  // console.log('clickItem', clickItem);
  return (
    <div>
      <Form
        onSubmit={(v) => {
          Message.success('success');
        }}
        form={form}
      >
        <FormItem
          rules={[{ required: true, message: '请选择公告类型' }]}
          field="notice_type"
          label="公告类型"
        >
          <Select placeholder="请选择公告类型">
            <Select.Option value="notice_system">系统公告</Select.Option>
            <Select.Option value="notice_store">店铺公告</Select.Option>
          </Select>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入公告标题' }]}
          field="notice_title"
          label="公告标题"
        >
          <Input placeholder="请输入公告标题"></Input>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入公告内容' }]}
          field="notice_content"
          label="公告内容"
        >
          <Input.TextArea placeholder="请输入公告内容"></Input.TextArea>
        </FormItem>

        <FormItem
          rules={[{ required: true, message: '请选择是否显示' }]}
          field="is_display"
          label="是否显示"
        >
          <Select>
            <Select.Option value="1">显示</Select.Option>
            <Select.Option value="0">不显示</Select.Option>
          </Select>
        </FormItem>
        <FormItem
          label="选择店铺"
          field="store_code"
          rules={[{ required: false, message: '请填写店铺编码' }]}
        >
          <Select loading={shopListLoading} placeholder="请选择店铺">
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
          label="发布时间"
          field="notice_date"
          rules={[
            {
              required: true,
              message: 'notice_date is required',
            },
          ]}
        >
          <DatePicker showTime />
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button
            onClick={async () => {
              const param = form.getFields();
              if (clickItem) {
                param.notice_id = clickItem.notice_id;
                const data = await Editnotice(param);
                if (data.code === 200) {
                  closeModalAndReqNewTableData();
                }
                return;
              }

              const data = await Addnotice(param);
              if (data.code === 200) {
                closeModalAndReqNewTableData();
              }
            }}
            type="primary"
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Index;
