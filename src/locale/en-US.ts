import localeSettings from './en-US/settings';
import localeMessageBox from '../components/MessageBox/locale/en-US';
import localeSearchTable from '../pages/stocks-staff/locale/en-US';
import localeWelcome from '../pages/welcome/locale/en-US';
import stepForm from '../pages/step-form/locale/en-US';

export default {
  'menu.list': 'List',
  'navbar.docs': 'Docs',
  ...localeSettings,
  ...localeMessageBox,
  ...localeSearchTable,
  ...localeWelcome,
  ...stepForm,
};
