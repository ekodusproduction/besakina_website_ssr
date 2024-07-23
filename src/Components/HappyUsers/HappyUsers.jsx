import React from 'react'

const HappyUsers = () => {
  return (
    <section className='flex flex-row  justify-center items-center px-4 mb-8 '>
        <div className='sm:px-12 px-4 text-center '>
            <h3 className='sm:text-4xl text-xl font-bold text-slate-600'>3000</h3>
            <p className='text-sm text-slate-700'>Happy Users</p>
        </div>
        <div className='sm:px-12 px-4 text-center  border-x-[1px] border-slate-400'>
            <h3 className='sm:text-4xl text-xl  font-bold text-slate-600'>2000</h3>
            <p className='text-sm text-slate-700'>Verified Posts</p>
        </div>
        <div className='sm:px-12 px-4 text-center'>

            <h3 className='sm:text-4xl text-xl text-slate-600 font-bold'>200+</h3>
            <p className='text-sm text-slate-700'>Categories</p>
        </div>
    </section>
  )
}

export default HappyUsers