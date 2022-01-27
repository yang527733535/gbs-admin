import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Message, Grid, Cascader, DatePicker } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { regionsList, updateShop, addShop } from '../../../../api/drama.js';

export default function BaseDetail({ storeDetailInfo, closeDrawer, modalType }) {
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();
  const [cascaderOptionsArr, setcascaderOptionsArr] = useState([]);
  useEffect(() => {
    // 这里做个缓存
    reqRionsData();
  }, []);

  const reqRionsData = async () => {
    // 先判断缓存里有没有
    let data = [];
    if (localStorage.getItem('regions') === null) {
      const res = await regionsList();
      data = res.data;
      localStorage.setItem('regions', JSON.stringify(data));
    } else {
      data = JSON.parse(localStorage.getItem('regions'));
    }
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
  };

  useEffect(() => {
    if (modalType === 'edit') {
      formRef.current.setFieldsValue(storeDetailInfo);
    }
  }, [storeDetailInfo]);
  return (
    <div>
      <Form layout="vertical" ref={formRef} className={styles['form-group']}>
        <Grid.Row gutter={80}>
          <Grid.Col span={6}>
            <FormItem
              label="店铺名称"
              field="store_name"
              rules={[{ required: true, message: '请填写店铺名称' }]}
            >
              <Input placeholder="请填写店铺名称..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              rules={[{ required: true, message: '请填写店铺地区' }]}
              field="position_index"
              label="店铺地区"
            >
              <Cascader
                showSearch
                placeholder="请选择店铺地区"
                allowClear
                options={cascaderOptionsArr}
              />
            </FormItem>
          </Grid.Col>

          <Grid.Col span={6}>
            <FormItem
              label="详细地址"
              field="position_address"
              rules={[{ required: true, message: '请填写详细地址' }]}
            >
              <Input placeholder="请填写详细地址..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              label="手机号码"
              field="store_mobile"
              rules={[{ required: true, message: '请填写店铺手机号码' }]}
            >
              <Input placeholder="请填写店铺手机号码..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              label="电话号码"
              field="store_phone"
              rules={[{ required: false, message: '请填写店铺电话号码' }]}
            >
              <Input placeholder="请填写店铺电话号码..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              label="门店级别"
              field="store_level"
              rules={[{ required: false, message: '请填写门店级别' }]}
            >
              <Input placeholder="请填写门店级别..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
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
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              label="门店类型"
              field="store_type"
              rules={[{ required: false, message: '请填写门店类型' }]}
            >
              <Input placeholder="请填写门店类型..." />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={80}>
          <Grid.Col span={6}>
            <FormItem
              label="经度坐标"
              field="position_x"
              rules={[{ required: true, message: '请填写经度坐标' }]}
            >
              <Input placeholder="请填写经度坐标..." />
            </FormItem>
          </Grid.Col>
          <Grid.Col span={6}>
            <FormItem
              label="纬度坐标"
              field="position_y"
              rules={[{ required: true, message: '请填写纬度坐标' }]}
            >
              <Input placeholder="请填写纬度坐标..." />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row justify="end">
          <FormItem
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={async () => {
                if (formRef.current) {
                  try {
                    await formRef.current.validate();
                    if (modalType === 'add') {
                      console.log(formRef.current.getFields());
                      var data = await addShop(formRef.current.getFields());
                      if (data.code === 200) {
                        Message.success('添加成功');
                        closeDrawer();
                      }
                    } else {
                      const param = formRef.current.getFields();
                      console.log('param: ', param);
                      param.store_code = storeDetailInfo.store_code;
                      var data = await updateShop(param);
                      if (data.code === 200) {
                        Message.success('修改成功');
                        closeDrawer();
                      }
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
        </Grid.Row>
      </Form>
    </div>
  );
}
