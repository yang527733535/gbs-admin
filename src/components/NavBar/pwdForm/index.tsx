import React, { FC, ReactElement, useState } from 'react';
import { Form, Input, Button, Message } from '@arco-design/web-react';
import { reqEditPwd } from '../../../api/user.js';
const FormItem = Form.Item;
interface Iprops {
  closeModal: () => void;
}
const PwdForm: FC<Iprops> = ({ closeModal }): ReactElement => {
  const [btnLoading, setbtnLoading] = useState<boolean>();
  return (
    <div>
      <Form
        onSubmit={async (v) => {
          setbtnLoading(true);
          const data = await reqEditPwd(v);
          setbtnLoading(false);
          if (data.code === 200) {
            Message.success('修改成功');
            closeModal();
          } else {
            Message.error(`修改失败,原因: ${data.message}`);
          }
        }}
      >
        <FormItem
          rules={[{ required: true, message: '请填写当前密码' }]}
          field="user_password"
          label="当前密码"
        >
          <Input.Password placeholder="please enter your user_password..." />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请填写新密码' }]}
          field="new_password"
          label="新密码"
        >
          <Input.Password placeholder="please enter your post..." />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请填写确认密码' }]}
          field="new_password2"
          label="确认密码"
        >
          <Input.Password placeholder="please enter your post..." />
        </FormItem>

        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button loading={btnLoading} htmlType="submit" type="primary">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};
export default PwdForm;
