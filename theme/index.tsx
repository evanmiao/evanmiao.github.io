import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import Theme from 'rspress/theme';
import { useLocation, Helmet } from 'rspress/runtime';
import './index.scss';
import HomeLayout from '@layouts/Home';
import NotFoundLayout from '@layouts/NotFound';
import Footer from '@components/Footer';
import PostInfo from '@components/PostInfo';
import PostFooter from '@components/PostFooter';

ReactGA.initialize('G-Q67L5KGYKT');

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ReactGA.send({ hitType: 'pageview', page: `${location.pathname}${location.search}` });
  }, [location.pathname, location.search]);

  return (
    <>
      <Helmet>
        <script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2130198674448764"
          crossOrigin="anonymous"
          async
        ></script>
      </Helmet>
      <Theme.Layout
        beforeDocFooter={<PostFooter />}
        beforeOutline={<PostInfo />}
        bottom={<Footer />}
      />
    </>
  );
};

export default {
  ...Theme,
  Layout,
  HomeLayout,
  NotFoundLayout,
};

export * from 'rspress/theme';
