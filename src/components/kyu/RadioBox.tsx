import React, { useState } from 'react';

const Radio = ({ label, name, options }) => {
    const [selectedOption, setSelectedOption] = useState("");

    const handleRadioClick = (e) => {
        setSelectedOption(e.target.value);
    }
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
           
            <div className="flex">
                {options.map((option, index) => (
                    <div className="flex pr-3" key={index} >
                        <input 
                            type="radio" 
                            className="radio radio-primary" 
                            name={name} 
                            value={option} 
                            onChange={handleRadioClick}
                            checked={option === selectedOption}
                        />
                        <span className='pl-2'>{option}</span>
                    </div>
                ))}
            </div>
        </label>
    );
};

export default Radio;