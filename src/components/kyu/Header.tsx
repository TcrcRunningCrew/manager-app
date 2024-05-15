import React from 'react';
interface HeaderProps {
    title: string;
}


const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <nav style={{ 
            display: 'flex', justifyContent: 'space-between',
            position: 'sticky', top: 0  }}>
            <img src="logo.png" alt="logo" />
            <div style={{ display: 'flex' }}>
                <a href="/page1"><img src="icon1.png" alt="icon1" /></a>
                <a href="/page2"><img src="icon2.png" alt="icon2" /></a>
                <a href="/page3"><img src="icon3.png" alt="icon3" /></a>
            </div>
            
        </nav>
    );
};

export default Header;