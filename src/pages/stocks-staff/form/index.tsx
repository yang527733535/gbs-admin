import React from 'react';
import { Form, Input, Button, Message } from '@arco-design/web-react';
import PropTypes from 'prop-types';
import { registerApi } from '../../../api/user';

const FormItem = Form.Item;
function Index({ closeModalAndFetch }) {
  const [form] = Form.useForm();
  return (
    <div>
      <Form
        onSubmit={async (v) => {
          // Message.success('success');
          const data = await registerApi(v);
          if (data.code === 200) {
            // MessageChannel
            Message.success('添加成功');
            closeModalAndFetch();
          }
          console.log('data: ', data);
        }}
        form={form}
      >
        <FormItem
          rules={[{ required: true, message: '请填写账号' }]}
          field="user_account"
          label="账号"
        >
          <Input placeholder="请输入你的用户名称..." />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请填写手机号码' }]}
          field="user_mobile"
          label="手机"
        >
          <Input placeholder="请输入你的手机号码..." />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请填写邮箱' }]}
          field="user_email"
          label="邮箱"
        >
          <Input placeholder="请输入你的邮箱..." />
        </FormItem>
        <FormItem field="user_password" label="初始密码">
          <Input.Password placeholder="请输入你的初始密码..." />
        </FormItem>
        <FormItem field="user_name" label="中文名">
          <Input placeholder="请输入你的中文名..." />
        </FormItem>
        <FormItem field="user_name_en" label="英文名">
          <Input placeholder="请输入你的英文名..." />
        </FormItem>
        <FormItem field="user_nick" label="昵称">
          <Input placeholder="请输入你的昵称..." />
        </FormItem>

        {/* user_email */}
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

Index.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Index;
