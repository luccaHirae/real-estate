import { CreditCard, Edit, Mail } from 'lucide-react';

export function PaymentMethod() {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden p-6 mt-10 md:mt-0 flex-1'>
      <h2 className='text-2xl font-bold mb-4'>Payment method</h2>
      <p className='mb-4'>Change how you pay for your plan.</p>

      <div className='border border-gray-300 rounded-lg p-6'>
        <div>
          {/* Card Info */}
          <div className='flex gap-10'>
            <div className='w-36 h-20 bg-blue-600 flex items-center justify-center rounded-md'>
              <span className='text-white text-2xl font-bold'>VISA</span>
            </div>

            <div className='flex flex-col justify-between'>
              <div>
                <div className='flex items-start gap-5'>
                  <h3 className='text-lg font-semibold'>Visa ending in 2027</h3>
                  <span className='text-sm font-medium border border-primary-300 text-primary-700 px-3 rounded-xl'>
                    Default
                  </span>
                </div>

                <div className='text-sm text-gray-500 flex items-center'>
                  <CreditCard className='size-4 mr-1' />
                  <span>Expiry - 26/06/2027</span>
                </div>
              </div>

              <div className='text-sm text-gray-500 flex items-center'>
                <Mail className='size-4 mr-1' />
                <span>billing@baseclub.com</span>
              </div>
            </div>
          </div>

          <hr className='my-4 opacity-15' />

          <div className='flex justify-end'>
            <button className='bg-white border flex items-center cursor-pointer border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-950 hover:text-white hover:border-transparent transition duration-200 ease-in-out'>
              <Edit className='size-5 mr-2' />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
