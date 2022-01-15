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
import { addDrama, addShop, updateShop, regionsList } from '../../../api/drama.js';

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
      setcascaderOptionsArr(arr);
    });
  }, []);
  // regionsList
  const cascaderOptions = [
    {
      value: 'beijing',
      label: 'Beijing',
      children: [
        {
          value: 'beijingshi',
          label: 'Beijing',
          children: [
            {
              value: 'chaoyang',
              label: 'Chaoyang',
              children: [
                {
                  value: 'datunli',
                  label: 'Datunli',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      value: 'shanghai',
      label: 'Shanghai',
      children: [
        {
          value: 'shanghaishi',
          label: 'Shanghai',
          children: [
            {
              value: 'huangpu',
              label: 'Huangpu',
            },
          ],
        },
      ],
    },
  ];
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
          label="店铺名称"
          field="store_name"
          rules={[{ required: true, message: '请填写店铺名称' }]}
        >
          <Input placeholder="请填写店铺名称..." />
        </FormItem>
        <FormItem field="position_index" label="店铺地区">
          <Cascader
            showSearch
            placeholder="please select"
            allowClear
            options={cascaderOptionsArr}
          />
        </FormItem>

        <FormItem
          label="门店类型"
          field="store_type"
          rules={[{ required: false, message: '请填写门店类型' }]}
        >
          <Input placeholder="请填写门店类型..." />
        </FormItem>
        <FormItem
          label="门店级别"
          field="store_level"
          rules={[{ required: false, message: '请填写门店级别' }]}
        >
          <Input placeholder="请填写门店级别..." />
        </FormItem>
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

        <FormItem
          label="详细地址"
          field="position_address"
          rules={[{ required: true, message: '请填写详细地址' }]}
        >
          <Input placeholder="请填写详细地址..." />
        </FormItem>
        <FormItem
          label="经度坐标"
          field="position_x"
          rules={[{ required: false, message: '请填写经度坐标' }]}
        >
          <Input placeholder="请填写经度坐标..." />
        </FormItem>
        <FormItem
          label="纬度坐标"
          field="position_y"
          rules={[{ required: false, message: '请填写纬度坐标' }]}
        >
          <Input placeholder="请填写纬度坐标..." />
        </FormItem>

        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  if (clickItem === null) {
                    console.log(formRef.current.getFields());
                    var data = await addShop(formRef.current.getFields());
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
            Submit
          </Button>
          <Button
            onClick={() => {
              formRef.current.resetFields();
            }}
          >
            Reset
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Shop;
