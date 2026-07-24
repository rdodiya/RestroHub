import React from 'react';
import { SiteProvider } from "@context/SiteContext";
import Website from './Website';

const WebsiteWrapper = () => {
return (
    <>
    <SiteProvider>
        <Website />
    </SiteProvider>
    </>
);
};

export default WebsiteWrapper;