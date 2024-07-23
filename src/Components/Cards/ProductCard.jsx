import React from 'react';
import { FaLocationDot } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { convertString, formatDate } from '../../utils/fornatter';

const ProductCard = ({ data, link }) => {
  return (
    <Link to={`${link}/${data?._id}`}>
      <div className="border-[1px] border-slate-400 rounded-md overflow-hidden bg-white max-h-80">
        <div className="h-[150px] sm:h-[200px]  ">
          <img
            src={`${data?.images[0]}`}
            alt="image"
            className="sm:h-[200px] h-full w-full object-cover"
          />
        </div>
        <div className="w-[100%] p-2 flex flex-col gap-2">
          <div>
            <p className="xl:text-base capitalize font-bold line-clamp-1">
              {data?.title}
            </p>
            {/* <h2 className="text-sm capitalize font-medium">
              {data?.advType == 'Property'
                ? `Category: Properties`
                : 'Category: ' + data?.advType}
            </h2> */}
            <h2 className="text-sm capitalize font-medium">
              {data?.type ? convertString(data?.type) : data?.type}
            </h2>
          </div>
          <div>
            <div className="flex items-center gap-[3px]">
              <div>
                <FaLocationDot />
              </div>
              <p className="font-semibold text-xs xl:text-sm capitalize">{`${data?.city}, ${data?.state}`}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[3px] text-[#179CF0]">
              <MdVerified />
              <p className="text-sm font-bold">Verified</p>
            </div>
            <p className="text-xs font-bold">{formatDate(data?.created_at)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
