import React, { useRef, useEffect, useState } from 'react';
import { Form, Select, Button, Message } from '@arco-design/web-react';
import { addGame, updateShop, addRoleUser } from '../../../api/drama.js';

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

function FormDom({ nowrole_code, closeModalAndReqTable, userListData, clickItem }) {
  console.log('nowrole_code');
  const formRef = useRef();
  const size = 'default';
  useEffect(() => {
    formRef.current.setFieldsValue(clickItem);
  }, []);
  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
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
        <FormItem field="user_list" label="添加用户">
          <Select
            filterOption={(inputValue, option) =>
              option.props.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 ||
              option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            mode="multiple"
          >
            {userListData.map((item) => {
              return (
                <Select.Option key={item.user_account} value={item.user_account}>
                  {item.user_name}
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
                  // Message.info('校验通过，提交成功！');

                  let param = formRef.current.getFields();
                  param.role_code = nowrole_code;
                  param.user_list = param.user_list.map((item) => {
                    return {
                      user_id: '',
                      user_account: item,
                    };
                  });
                  var resdata = await addRoleUser(param);
                  if (resdata.code === 200) {
                    Message.success('添加成功');
                    closeModalAndReqTable();
                  }
                  return;
                  if (clickItem === null) {
                    console.log(formRef.current.getFields());
                    return;
                    var data = await addGame(formRef.current.getFields());
                  } else {
                    const param = formRef.current.getFields();
                    console.log('param: ', param);
                    return;
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

export default FormDom;
