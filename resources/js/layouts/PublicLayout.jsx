import React from 'react';
import { useSelector } from 'react-redux';
import PublicLayoutDefault from './themes/default/PublicLayoutDefault';
import PublicLayoutModern from './themes/modern/PublicLayoutModern';

const PublicLayout = () => {
    const { profile } = useSelector(state => state.public);
    
    // Default theme is 'default' if not specified
    const theme = profile?.public_theme || 'default';

    if (theme === 'modern') {
        return <PublicLayoutModern />;
    }

    return <PublicLayoutDefault />;
};

export default PublicLayout;
