import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import { FaCamera } from "react-icons/fa";

const PostAdDetails = () => {
  return (
   <>
       
            <section className='bg-white'>
                <div >
                    <p className='text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300'>POST YOUR AD</p>
                </div>
                <div className='flex justify-center p-8 gap-16'>
                    <div className='flex flex-col gap-4 '>
                        <h3 className='mb-2 font-semibold text-xl'>Properties</h3>
                        <a href="">For Sale: Houses and Apartments</a>
                        <a href="">For Rent: Houses and Apartments</a>
                        <a href="">Lands & Plots</a>
                        <a href="">For Rent: Shops & Offices</a>
                        <a href="">For Sale: Shops & Offices</a>
                        <a href="">PG & Guest House</a>
                    </div>
                    <div>
                        <form action="" className='flex flex-col gap-8'>
                            <h3 className='mb-2 font-semibold text-xl'>Add Some Details</h3>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Type*</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Apartments</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Builder Floors</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Farm Houses</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Houses & Villas</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Bedrooms*</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>1</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>2</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>3</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>4</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Bathroom*</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>1</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>2</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>3</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>4</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Furnishing*</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Furnished</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Semi-furnished</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Unfurnished</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Construction Status*</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>New launch</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Under construction</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Ready to move</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Listed By</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Builder</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Dealer</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>Owner</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Super Builtup Area*</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Carpet Area*</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Maintainance*</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Total Floors*</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Floor No.</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Car Parking</p>
                                <div className='flex gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>0</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>1</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>2</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>3</label>
                                    </div>
                                    <div className='border-[1px] border-gray-400 rounded-sm'>
                                        <input type="radio" id="html" name="fav_language" value="HTML" className='hidden'/>
                                        <label for="html" className='px-4 py-2'>3+</label>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold mt-4 mb-2 text-xl '>Set a price</h3>
                                <p className='mb-2 font-semibold text-gray-700'>Price</p>
                                <div className='flex gap-2'>
                                    <input type="text" className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold mt-4  mb-4 text-xl text-gray-700'>Upload upto 20 photos</h3>
                                <div className='grid grid-cols-7 gap-2 text-gray-700'>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                    <div className='border-[1px] border-gray-400 flex justify-center items-center h-[100px] w-[100px]'>
                                        <FaCamera size={30} color='gray'/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
      
   </>
  )
}

export default PostAdDetails