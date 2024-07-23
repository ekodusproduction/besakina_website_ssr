import React from 'react';

const AddNewField = ({ onChange, onClick, setOpen, placeholder }) => {
  return (
    <div className="">
      <div className="flex items-center gap-4">
        <input
          type="text"
          onChange={onChange}
          className="w-[15vw] h-9 border-[1px] pl-2 border-gray-400 py-2 rounded-md"
          placeholder={placeholder}
        />
        <div className="flex items-center gap-2">
          <button onClick={onClick} className="border px-2 py-1">
            Add
          </button>
          <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewField;
