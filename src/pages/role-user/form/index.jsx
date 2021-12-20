import React, { useRef, useEffect, useState } from 'react';
import { Form, Select, Button, Message } from '@arco-design/web-react';
import { addGame, updateShop, regionsList } from '../../../api/drama.js';
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

function FormDom({ closeModalAndReqTable, userListData, clickItem }) {
  const formRef = useRef();
  const [size, setSize] = useState('default');
  const [cascaderOptionsArr, setcascaderOptionsArr] = useState([]);
  console.log(clickItem);
  useEffect(() => {
    formRef.current.setFieldsValue(clickItem);
  }, []);
  console.log(userListData);
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
        onSubmit={(e) => {
          console.log(e);
        }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <FormItem field="user_list" label="添加用户">
          <Select mode="multiple">
            {userListData.map((item) => {
              return <Select.Option value={item.user_account}>{item.user_name}</Select.Option>;
            })}
          </Select>
        </FormItem>
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

export default FormDom;
