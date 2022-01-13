import { Carousel } from '@arco-design/web-react';
import React from 'react';
import bannerImage from '../../assets/login-banner.png';

import styles from './style/index.module.less';

export default function LoginBannber() {
  const data = [
    {
      slogan: '专业的剧本杀管理运营后台',
      subSlogan: '丰富的的页面模板，覆盖大多数典型业务场景',
      image: bannerImage,
    },
    {
      slogan: '专业的剧本杀管理运营后台',
      subSlogan: '国际化，路由配置，状态管理应有尽有',
      image: bannerImage,
    },
    {
      slogan: '专业的剧本杀管理运营后台',
      subSlogan: '实现灵活的区块式开发',
      image: bannerImage,
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
