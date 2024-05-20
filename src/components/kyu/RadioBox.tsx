import React, { useState } from 'react';

const Radio = ({ label, name, options, onClick }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleRadioClick = (e) => {
        console.log(e.target.value);
        setSelectedOption(e.target.value);
        // onClick();
    }
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <div className="flex">
                {options.map((option, index) => (
                    <div className="flex pr-3" key={index}>
                        <input 
                            type="radio" 
                            className="radio" 
                            name={name} 
                            value={option} 
                            onChange={handleRadioClick}
                            checked={option === selectedOption}
                        />
                        <span>{option}</span>
                    </div>
                ))}
            </div>
        </label>
    );
};

export default Radio;