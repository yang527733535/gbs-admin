import { Carousel } from '@arco-design/web-react';
import React from 'react';

import styles from './style/index.module.less';

export default function LoginBannber() {
  const data = [
    {
      slogan: '专业的剧本杀管理运营后台',
      image: 'https://oss.mengmohmg.com/logo/mengmo.png',
    },
  ];
  return (
    <Carousel className={styles.carousel} animation="fade">
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles['carousel-item']}>
            <div className={styles['carousel-title']}>{item.slogan}</div>
            <img
              referrer-policy="no-referrer"
              className={styles['carousel-image']}
              src={item.image}
              // src='https://myasd.oss-cn-beijing.aliyuncs.com/upload/avatar/03fd474c-9186-4af9-9623-af1e4d31b7a3.JPG'
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
