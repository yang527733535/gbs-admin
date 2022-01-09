import React, { useState, useRef, useEffect } from 'react';
import { Form, Select, Tag, Message } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { IconDelete } from '@arco-design/web-react/icon';
import { ReducerState } from '../../../../redux/index';
import { reqBindDm, getDmList } from '../../../../api/drama.js';
import { FormInstance } from '@arco-design/web-react/es/Form';
const FormItem = Form.Item;

export default function DmForm({ drama_dms }) {
  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  const { clickItem } = dramaInfoStore;
  const formRef = useRef<FormInstance>();
  const [dmlist, setdmlist] = useState([]);
  const [imgMap, setimgMap] = useState({});
  useEffect(() => {
    getDmListfN();
  }, []);
  const getDmListfN = async () => {
    const data = await getDmList();
    setdmlist(data.data);
  };

  useEffect(() => {
    // clickItem
    const obj = {};
    for (let index = 0; index < drama_dms.length; index++) {
      const element = drama_dms[index];
      obj[element.user_account] = element.user_photo;
    }
    setimgMap(obj);
    formRef.current.setFieldsValue({
      dm_array: drama_dms.map((item) => {
        return item.user_account;
      }),
    });
  }, [drama_dms]);

  const onValuesChange = async (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
    const param: any = new Object();
    param.gb_code = clickItem.gb_code;
    param.dm_array = values.dm_array.map((item) => {
      return { user_account: item };
    });
    const data = await reqBindDm(param);
    if (data.code === 200) {
      Message.info('提交成功！');
    }
  };

  function tagRender(props) {
    const { label, value } = props;
    console.log('value: ', value);
    // console.log('src: ', src);

    return (
      <div
        style={{
          margin: '2px 6px 2px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tag color="cyan"> {label}</Tag>
        <img style={{ width: 50, height: 50 }} src={imgMap[value]} alt="" />
      </div>
    );
  }
  return (
    <div>
      <Form onValuesChange={onValuesChange} ref={formRef}>
        <FormItem
          required
          field="dm_array"
          rules={[
            {
              required: true,
              minLength: 1,
              message: 'dm_array is required',
            },
          ]}
        >
          <Select
            renderTag={tagRender}
            removeIcon={<IconDelete />}
            mode="multiple"
            allowCreate
            placeholder="请选择dm"
          >
            {dmlist?.map((item) => {
              return (
                <Select.Option key={item.user_account} value={item.user_account}>
                  {item.user_nick}
                  <img src={item.user_photo} alt="" />
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
      </Form>
    </div>
  );
}
