import React, { useState } from 'react';

type RadioProps = {
    label: string;
    name: string;
    options: string[];
    onChange: (name: string, value: string) => void;
};

const Radio = React.memo(({ label, name, options, onChange }: RadioProps) => {
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
                        <label className="flex pr-3" key={value} >
                            <input 
                                type="radio" 
                                className="radio radio-primary" 
                                name={name} 
                                value={value} 
                                onChange={handleRadioClick}
                                checked={value === selectedOption}
                            />
                            <span className='pl-2'>{option}</span>
                        </label>
                    )
                })}
            </div>
        </label>
    );
});

export default Radio;