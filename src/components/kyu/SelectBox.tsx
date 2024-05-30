import React, { useState } from 'react';

const SelectBox = ({ label, options, name, onChange }) => {
    const [selectedOption, setSelectedOption] = useState("선택");
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option, value) => {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(name, value + "");
    }
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-full" onClick={() => setIsOpen(!isOpen)}>{selectedOption}</div>
                {isOpen && (
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        {options.map((option, index) => (
                            <li key={index} onClick={() => handleOptionClick(option, index + 1)}>
                                <a>{option}</a>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedOption === "기타" 
                    ? <input type="text" className="input input-bordered w-full" />
                    : null
                }
            </div>
        </label>
        // <label className="form-control w-full">
        //     <div className="label">
        //         <span className="label-text">{label}</span>
        //     </div>
        //     <select className="select select-bordered" onChange={handleSelectClick}>
        //         {options.map((option, index) => (
        //               <option key={index} value={option}>{option}</option>
        //         ))}
        //     </select>
        //     {selectedOption === "기타" 
        //         ? <input type="text" className="input input-bordered w-full" />
        //         : null
        //     }
        // </label>
    );
};

export default SelectBox;