import useWebsocket from '@/useWebsocket';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from 'umi';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: '-',
    defaultMessage: '民风淳朴米花町',
  });

  const currentYear = new Date().getFullYear();

  useWebsocket()

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
    // links={[
    //   {
    //     key: 'Ant Design Pro',
    //     title: 'Ant Design Pro',
    //     href: 'https://pro.ant.design',
    //     blankTarget: true,
    //   },
    //   {
    //     key: 'github',
    //     title: <GithubOutlined />,
    //     href: 'https://github.com/ant-design/ant-design-pro',
    //     blankTarget: true,
    //   },
    //   {
    //     key: 'Ant Design',
    //     title: 'Ant Design',
    //     href: 'https://ant.design',
    //     blankTarget: true,
    //   },
    // ]}
    />
  );
};

export default Footer;
