import React from 'react';
import { useOutletContext } from 'react-router-dom';
import HomeDefault from './themes/default/HomeDefault';
import HomeModern from './themes/modern/HomeModern';

const Home = () => {
    const { profile } = useOutletContext();
    const theme = profile?.public_theme || 'default';

    if (theme === 'modern') {
        return <HomeModern />;
    }

    return <HomeDefault />;
};

export default Home;
