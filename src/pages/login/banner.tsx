import { Carousel } from '@arco-design/web-react';
import React from 'react';

import styles from './style/index.module.less';

export default function LoginBannber() {
  const data = [
    {
      slogan: '专业的剧本杀管理运营后台',
      image: 'https://gbs.toptian.com/image/show?file=drama_I00111-1642061758.png',
    },
  ];
  return (
    <Carousel className={styles.carousel} animation="fade">
      {data.map((item, index) => (
        <div key={`${index}`}>
          <div className={styles['carousel-item']}>
            <div className={styles['carousel-title']}>{item.slogan}</div>
            <div className={styles['carousel-sub-title']}>{item.subSlogan}</div>
            <img className={styles['carousel-image']} src={item.image} />
          </div>
        </div>
      ))}
    </Carousel>
  );
}
