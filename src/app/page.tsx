import TransactionForm from '@/components/transactionForm'
import Table from '@/components/table'
import connectDB from '@/app/lib/connectDB'
import Summary from '@/app/summary-monthly/page'
import TableSummary from '@/app/table-transactions/page'
import Link from 'next/link'
export default function Home() {
  connectDB()
  return (
    <div className='container mx-auto grid grid-rows-2 gap-5'>
      <TransactionForm />
      <div className='grid md:grid-cols-2 grid-cols-1 gap-5 ' >
        <Link href={'/summary-monthly'}>
          <div>
            <Summary />
          </div>
        </Link>
        <Link href={'/table-transactions'}>
          <div className='max-h-1'>
            <TableSummary />
          </div>
        </Link>
      </div >
    </div >
  )
}
