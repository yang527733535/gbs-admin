import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import rootReducer from './redux';
import history from './history';
import PageLayout from './layout/page-layout';
import Setting from './components/Settings';
import { GlobalContext } from './context';
import './style/index.less';
import './mock';
import Login from './pages/login';
import checkLogin from './utils/checkLogin';
import { labelsApi } from './api/drama.js';
const store = createStore(rootReducer);

function Index() {
  const localeName = localStorage.getItem('arco-lang') || 'zh-CN';
  if (!localStorage.getItem('arco-lang')) {
    localStorage.setItem('arco-lang', localeName);
  }

  const [locale, setLocale] = useState();

  async function fetchLocale(ln?: string) {
    const locale = (await import(`./locale/${ln || localeName}`)).default;
    setLocale(locale);
  }

  function getArcoLocale() {
    switch (localeName) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return zhCN;
    }
  }

  useEffect(() => {
    fetchLocale();
  }, []);
  useEffect(() => {
    fetchDicts();
  }, []);
  const fetchDicts = async () => {
    const { data } = await labelsApi();

    const AllMaP = {};
    data.forEach((element) => {
      let param = {};
      element.dict_label.forEach((item) => {
        param[item.label_value] = item.label_zh;
      });
      AllMaP[element.dict_code] = param;
    });
    localStorage.setItem('AllMaP', JSON.stringify(AllMaP));
  };

  useEffect(() => {
    if (checkLogin()) {
    } else {
      history.push('/user/login');
    }
  }, []);

  const contextValue = {
    locale,
  };

  return locale ? (
    <Router history={history}>
      <ConfigProvider locale={getArcoLocale()}>
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/user/login" component={Login} />
              <Route path="/" component={PageLayout} />
            </Switch>
            <Setting />
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </Router>
  ) : null;
}

ReactDOM.render(<Index />, document.getElementById('root'));
