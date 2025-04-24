'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CircleCheckBig, Download, File, Hospital } from 'lucide-react';
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from '@/state/api';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Loading } from '@/components/loading';
import { ApplicationCard } from '@/components/application-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Applications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery(
    {
      userId: authUser?.cognitoInfo.userId,
      userType: 'manager',
    },
    {
      skip: !authUser?.cognitoInfo.userId,
    }
  );
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (id: number, status: string) => {
    await updateApplicationStatus({ id, status });
  };

  if (isLoading) return <Loading />;

  if (isError || !applications) return <div>Error loading applications</div>;

  const filteredApplications = applications.filter((application) => {
    if (activeTab === 'all') return true;

    return application.status.toLowerCase() === activeTab;
  });

  return (
    <div className='dashboard-container'>
      <Header
        title='Applications'
        subtitle='View and manage applications for your properties'
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full my-5'
      >
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='all'>All</TabsTrigger>
          <TabsTrigger value='pending'>Pending</TabsTrigger>
          <TabsTrigger value='approved'>Approved</TabsTrigger>
          <TabsTrigger value='denied'>Denied</TabsTrigger>
        </TabsList>

        {['all', 'pending', 'approved', 'denied'].map((status) => (
          <TabsContent key={status} value={status} className='mt-5 w-full'>
            {filteredApplications
              .filter(
                (application) =>
                  status === 'all' ||
                  application.status.toLowerCase() === status
              )
              .map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  userType='manager'
                >
                  <div className='flex justify-between gap-5 w-full pb-4 px-4'>
                    {/* Color Section Status */}
                    <div
                      className={cn(
                        'p-4 text-gray-700 grow',
                        application.status === 'Approved'
                          ? 'bg-green-100'
                          : application.status === 'Denied'
                          ? 'bg-red-100'
                          : 'bg-yellow-100'
                      )}
                    >
                      <div className='flex flex-wrap items-center'>
                        <File className='size-5 mr-2 flex-shrink-0' />
                        <span className='mr-2'>
                          Application submitted on{' '}
                          {new Date(
                            application.applicationDate
                          ).toLocaleDateString()}
                        </span>

                        <CircleCheckBig className='size-5 mr-2 flex-shrink-0' />

                        <span
                          className={cn(
                            'font-semibold',
                            application.status === 'Approved'
                              ? 'text-green-800'
                              : application.status === 'Denied'
                              ? 'text-red-800'
                              : 'text-yellow-800'
                          )}
                        >
                          {application.status === 'Approved' &&
                            'This application has been approved'}
                          {application.status === 'Denied' &&
                            'This application has been denied'}
                          {application.status === 'Pending' &&
                            'This application is pending review'}
                        </span>
                      </div>
                    </div>

                    {/* Right Buttons */}
                    <div className='flex gap-2'>
                      <Link
                        href={`/managers/properties/${application.property.id}`}
                        className='bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-50'
                        scroll={false}
                      >
                        <Hospital className='size-5 mr-2' />
                        Property Details
                      </Link>

                      {application.status === 'Approved' && (
                        <button
                          className={`bg-white border border-gray-300 text-gray-700 py-2 px-4
                          rounded-md flex items-center justify-center hover:bg-primary-700 hover:text-primary-50`}
                        >
                          <Download className='w-5 h-5 mr-2' />
                          Download Agreement
                        </button>
                      )}

                      {application.status === 'Pending' && (
                        <>
                          <button
                            className='px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-500'
                            onClick={() =>
                              handleStatusChange(application.id, 'Approved')
                            }
                          >
                            Approve
                          </button>
                          <button
                            className='px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-500'
                            onClick={() =>
                              handleStatusChange(application.id, 'Denied')
                            }
                          >
                            Deny
                          </button>
                        </>
                      )}

                      {application.status === 'Denied' && (
                        <button
                          className={`bg-gray-800 text-white py-2 px-4 rounded-md flex items-center
                          justify-center hover:bg-secondary-500 hover:text-primary-50`}
                        >
                          Contact User
                        </button>
                      )}
                    </div>
                  </div>
                </ApplicationCard>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Applications;
