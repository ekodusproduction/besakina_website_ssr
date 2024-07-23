import React from 'react'


const Button = ({children,category, clickHandler, classItems,type, disabled}) => {
    if(category==='primarybtn'){
        return (
            <button disabled={disabled} type={type} className={`bg-[#F77B0B] border-[1px] border-[#F77B0B] px-2 py-2 rounded-sm text-[white] font-semibold xsm:text-md text-sm shadow-md ${classItems}`} onClick={clickHandler}>{children}</button>
        )
    }
    else if(category==='secondbtn'){
        return (
            <button className='bg-transparent border-[1px] border-[white] px-2 py-2 rounded-sm text-[white] font-semibold xsm:text-md text-sm shadow-md' onClick={clickHandler}>{children}</button>
        )
    }
    else if(category==='thirdbtn'){
        return (
            <button className='bg-[white] border-[1px] border-[white] px-2 py-2 rounded-sm text-[#0F77D6] font-bold xsm:text-md text-sm shadow-md' onClick={clickHandler}>{children}</button>
        )
    }
    
}

export default Button