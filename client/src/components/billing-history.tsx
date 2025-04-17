import { ArrowDownToLine, Check, Download, FileText } from 'lucide-react';
import { Payment } from '@/types/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export function BillingHistory({ payments }: { payments: Payment[] }) {
  return (
    <div className='mt-8 bg-white rounded-xl shadow-md overflow-hidden p-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold mb-1'>Billing History</h2>
          <p className='text-sm text-gray-500'>
            Download your previous plan receipts and usage details.
          </p>
        </div>

        <div>
          <button className='bg-white border cursor-pointer border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-950 hover:text-white transition duration-200'>
            <Download className='size-5 mr-2' />
            <span>Download All</span>
          </button>
        </div>
      </div>

      <hr className='mt-4 mb-1 opacity-20' />

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='border-gray-300'>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Billing Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className='h-16'>
                <TableCell className='font-medium'>
                  <div className='flex items-center'>
                    <FileText className='size-4 mr-2' />
                    Invoice #{payment.id} -{' '}
                    {new Date(payment.paymentDate).toLocaleDateString(
                      'default',
                      {
                        month: 'short',
                        year: 'numeric',
                      }
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-semibold border',
                      payment.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    )}
                  >
                    {payment.paymentStatus === 'Paid' ? (
                      <Check className='size-4 inline-block mr-1' />
                    ) : null}
                    {payment.paymentStatus}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </TableCell>

                <TableCell>${payment.amountPaid.toFixed(2)}</TableCell>

                <TableCell>
                  <button className='bg-white border cursor-pointer border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center gap-2 hover:bg-gray-950 hover:text-white transition duration-200'>
                    <ArrowDownToLine className='size-4 mr-1' />
                    <span>Download</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
