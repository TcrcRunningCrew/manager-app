import React from 'react';

const MenuItem = ({index, p_text, btn_text, bg_color, position, totalMenu, onclick}) => {
    const overlapPercentage = 30;
    const topPosition = (index * overlapPercentage) + '%';
    const translateY = `-${position * overlapPercentage}%`;
    return (
    <div 
        className={`card w-full text-primary-content ${index !==0 ? "absolute" : ""} 
        transition-transform ${bg_color}`}
        style={{
            top: topPosition,
            transform: `translateY(${translateY})`,
            zIndex: totalMenu - position,
        }}
    >
        <div className="card-body flex flex-row text-white">
            <p className="flex-auto text-sm">{p_text}</p>
            <button className="btn btn-ghost flex-auto text-sm pb-7" onClick={onclick}>
                {btn_text}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    </div>
    );
}

export default MenuItem;