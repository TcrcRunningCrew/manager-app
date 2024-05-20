import React from 'react';

interface ButtonProps {
    onClick: () => void;
    text: string;
    icon?: React.JSX.Element;
    bgColor?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, icon, bgColor }) => {
    return (
        <button className={`btn ${bgColor}`} onClick={onClick}>
            {icon}
            {text}
        </button>
    );
};

export default Button;