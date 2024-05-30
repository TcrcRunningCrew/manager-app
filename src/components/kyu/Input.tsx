import React from 'react';

const Input = ({ label, placeholder="", name, value, onChange }) => {
    const handleChange = (e) => {
        onChange(e.target.name, e.target.value);
    }
    
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input type="text" placeholder={placeholder} className="input input-bordered w-full" name={name} value={value} onChange={handleChange} />
        </label>
    );
};

export default Input;