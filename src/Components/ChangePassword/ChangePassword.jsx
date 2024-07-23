import React from 'react'
import Button from '../Button/Button'


const ChangePassword = () => {
  return (
    <form className='w-full bg-white rounded shadow p-6'>
    <h2 className='font-bold mb-6 text-xl'>Change Password</h2>
    <div className='grid grid-cols-1 gap-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="current_password" className='text-gray-500 text-sm'>Current Password</label>
            <input id='current_password' type="text" placeholder='Current Password' name='current_password' className='border border-gray-200 rounded' />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="new_password" className='text-gray-500 text-sm'>New Password</label>
            <input id='new_password' type="text" placeholder='New Password' name='new_password' className='border border-gray-200 rounded' />
        </div>
        <div className='flex flex-col gap-2'>
            <label htmlFor="confirm_password" className='text-gray-500 text-sm'>Confirm Password</label>
            <input id='confirm_password' type="text" placeholder='Confirm Password' name='confirm_password' className='border border-gray-200 rounded' />
        </div>
       </div>
    <div className='flex justify-end pt-4'>
        <Button category={'primarybtn'}>Save Changes</Button>
    </div>
</form>
  )
}

export default ChangePassword