import localeSettings from './zh-CN/settings';
import localeMessageBox from '../components/MessageBox/locale/zh-CN';
import localeSearchTable from '../pages/user-table/locale/zh-CN';
import localeWelcome from '../pages/welcome/locale/zh-CN';
import stepForm from '../pages/step-form/locale/zh-CN';
import searchTable from '../pages/user-table/locale/zh-CN';

export default {
  'menu.list': '列表页',
  'navbar.docs': '文档中心',
  ...localeSettings,
  ...localeMessageBox,
  ...localeSearchTable,
  ...localeWelcome,
  ...stepForm,
  ...searchTable,
};
