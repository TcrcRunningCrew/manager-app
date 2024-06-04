import React from 'react';
import {PropsWithChildren} from "react";

const Menu = ({ children, totalMenu } ) => {
    const overlapPercentage = 30;
    return (
        <div className="relative" style={{ bottom: `-${totalMenu * overlapPercentage}%`}}>
          {children}
        </div>
      );
};

export default Menu;