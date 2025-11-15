  import PublicFooter from '@/components/shared/PublcFooter';
import PublicNavbar from '@/components/shared/PublicNavbar';
import React from 'react';
  
  const CommonLayout = ({children}: {children:React.ReactNode}) => {
    return (
        <>
          <PublicNavbar/>
            {children}
            <PublicFooter/>
        </>
    );
  };
  
  export default CommonLayout;