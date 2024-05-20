import React from 'react';

const SelectBox = ({ label, options }) => {
    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <select className="select select-bordered">
                {options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                ))}
            </select>
        </label>
    );
};

export default SelectBox;