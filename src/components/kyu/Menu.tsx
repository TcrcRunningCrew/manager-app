import React from 'react';

interface MenuItem {
    label: string;
    link: string;
}

interface MenuProps {
    items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
    return (
        <ul >
            {items.map((item, index) => (
                <li key={index}>
                    <a href={item.link}>{item.label}</a>
                </li>
            ))}
        </ul>
    );
};

export default Menu;