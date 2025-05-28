'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, onlyFlagged: boolean) => void;
  totalRecords: number;
}

export default function ExportModal({ isOpen, onClose, onExport, totalRecords }: ExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const handleExport = () => {
    onExport(format, onlyFlagged);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1a202c] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white mb-4">
                      Export Data
                    </Dialog.Title>

                    <div className="mt-4 space-y-6">
                      {/* Format Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Export Format
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['csv', 'json', 'excel'].map((fmt) => (
                            <button
                              key={fmt}
                              onClick={() => setFormat(fmt)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                format === fmt
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-[#2d3748] text-gray-300 hover:bg-[#374151]'
                              }`}
                            >
                              {fmt.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Filter Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Filter Options
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={onlyFlagged}
                              onChange={(e) => setOnlyFlagged(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-300">
                              Only export flagged vessels
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-[#2d3748] rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Export Summary</h4>
                        <p className="text-sm text-gray-400">
                          Total records to export: {totalRecords}
                          {onlyFlagged && ' (filtered)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 sm:ml-3 sm:w-auto"
                    onClick={handleExport}
                  >
                    Export
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-[#2d3748] px-3 py-2 text-sm font-semibold text-white hover:bg-[#374151] sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 