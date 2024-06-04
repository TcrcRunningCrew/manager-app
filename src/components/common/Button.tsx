import React from 'react';

interface ButtonProps {
    onClick: () => void;
    text: string;
    icon?: React.JSX.Element;
    bgColor?: string;
    textColor?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, icon, bgColor, textColor }) => {
    return (
        <button className={`btn ${bgColor} ${textColor}`} onClick={onClick}>
            {icon}
            {text}
        </button>
    );
};

export default Button;