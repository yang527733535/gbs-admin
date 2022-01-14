import React, { useState, useEffect } from 'react';
import { Grid, Spin, Button, Result, Message } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { ReducerState } from '../../../../redux/index';
import { IconFaceSmileFill } from '@arco-design/web-react/icon';
import { reqBindDm, reqBindDeleteDm, getDmList } from '../../../../api/drama.js';

const Row = Grid.Row;

export default function DmForm({ drama_dms, getInitFormData }) {
  console.log('drama_dms: ', drama_dms);
  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  const { clickItem } = dramaInfoStore;
  const [dmlist, setdmlist] = useState([]);
  const [dmLoading, setdmLoading] = useState(false);
  const [nowDmArr, setnowDmArr] = useState([]);
  useEffect(() => {
    getDmListfN();
  }, []);

  useEffect(() => {
    let a = [];
    drama_dms.forEach((element) => {
      a.push(element.user_account);
    });
    setnowDmArr(a);
  }, [getInitFormData]);

  const getDmListfN = async () => {
    setdmLoading(true);
    const data = await getDmList();
    setdmLoading(false);
    console.log('data: ', data);
    // 在这里过滤一次 数据
    setdmlist(data.data);
  };

  // useEffect(() => {
  //   const obj = {};
  //   for (let index = 0; index < drama_dms.length; index++) {
  //     const element = drama_dms[index];
  //     obj[element.user_account] = element.user_photo;
  //   }
  //   setimgMap(obj);
  //   formRef.current.setFieldsValue({
  //     dm_array: drama_dms.map((item) => {
  //       return item.user_account;
  //     }),
  //   });
  // }, []);

  return (
    <div>
      <Row gutter={40} style={{ display: 'flex', padding: 20 }}>
        {drama_dms.length === 0 ? (
          <Result
            status={null}
            icon={<IconFaceSmileFill style={{ color: 'rgb(var(--arcoblue-6))' }} />}
            title="该剧本还没有主持人"
            // extra={<Button type="primary">Back</Button>}
          ></Result>
        ) : (
          <div style={{ display: 'flex' }}>
            {drama_dms.map(({ user_account, user_photo }) => {
              return (
                <div
                  style={{
                    width: 200,
                    // display: drama_dms.includes({ user_account: user_account }) ? 'none' : 'flex',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: 200,
                  }}
                >
                  <div>
                    <img style={{ width: 100, height: 100 }} src={user_photo} alt="" />
                  </div>
                  <div>{user_account}</div>
                  <div>
                    <Button
                      onClick={async () => {
                        console.log(user_account);
                        let parma = {
                          gb_code: clickItem.gb_code,
                          dm_array: [{ user_account: user_account }],
                        };
                        const data = await reqBindDeleteDm(parma);
                        if (data.code === 200) {
                          Message.success('操作成功');
                          getInitFormData();
                        }
                        // let parma = {
                        //   gb_code: clickItem.gb_code,
                        //   drama_dms: [...drama_dms, { user_account: user_account }],
                        // };
                        // const data = await reqBindDm(parma);
                        // console.log('data: ', data);
                      }}
                      size="mini"
                      status="danger"
                    >
                      取消DM
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Row>
      <h4>主持人列表</h4>
      <Spin loading={dmLoading}>
        <div style={{ display: 'flex' }}>
          {dmlist.map(({ user_account, user_photo }) => {
            return (
              <div
                style={{
                  width: 200,
                  display: 'flex',
                  // display: drama_dms.includes(user_account) ? 'none' : 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 200,
                }}
              >
                <div>
                  <img style={{ width: 100, height: 100 }} src={user_photo} alt="" />
                </div>
                <div>{user_account}</div>
                <div>
                  <Button
                    disabled={nowDmArr.includes(user_account)}
                    onClick={async () => {
                      let parma = {
                        gb_code: clickItem.gb_code,
                        dm_array: [...drama_dms, { user_account: user_account }],
                      };
                      const data = await reqBindDm(parma);
                      console.log('data: ', data);
                      if (data.code === 200) {
                        Message.success('操作成功');
                        getInitFormData();
                      }
                    }}
                    size="mini"
                    type="primary"
                  >
                    设为DM
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Spin>
    </div>
  );
}
