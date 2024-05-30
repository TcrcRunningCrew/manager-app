import React, { useState } from 'react';

const Radio = ({ label, name, options, onChange }) => {
    const [selectedOption, setSelectedOption] = useState('1');

    const handleRadioClick = (e) => {
        console.log(typeof e.target.value)
        setSelectedOption(e.target.value);
        onChange(e.target.name, e.target.value);
    }
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
           
            <div className="flex">
                {options.map((option, index) => {
                    const value = "" + (index + 1);

                    return (
                        <div className="flex pr-3" key={index} >
                            <input 
                                type="radio" 
                                className="radio radio-primary" 
                                name={name} 
                                value={value} 
                                onChange={handleRadioClick}
                                checked={value === selectedOption}
                            />
                            <span className='pl-2'>{option}</span>
                        </div>
                    )
                })}
            </div>
        </label>
    );
};

export default Radio;