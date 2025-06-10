import React from 'react'
import { Link } from 'react-router-dom';


const Header = () => {
  return (
    <div>
     <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Verification Dashboard</h1>

      <div className="flex space-x-8">
        <Link
          to="/rera-kyc"
          className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Rera Verified
        </Link>

        <Link
          to="/adhar-kyc"
          className="px-8 py-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Adhar Verified
        </Link>

        
      </div>

      <div className='mt-10 flex space-x-8'>
      <Link
          to="/suspend-user"
          className="px-8 py-4  bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
        >
          Suspend User
        </Link>
      </div>
    </div>
  



        
    </div>
  )
}

export default Header