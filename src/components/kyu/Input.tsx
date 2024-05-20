import React from 'react';

const Input = ({ label, placeholder="" }) => {
    return (
        <label className="form-control w-full">
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input type="text" placeholder={placeholder} className="input input-bordered w-full" />
        </label>
    );
};

export default Input;