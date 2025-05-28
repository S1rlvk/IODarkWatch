'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-[#1a202c] shadow-xl">
                    <div className="px-4 py-6 sm:px-6 border-b border-[#2d3748]">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-semibold text-white">
                          Filter Vessels
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 px-4 py-6 sm:px-6 overflow-y-auto">
                      <div className="space-y-6">
                        {/* Status Filter */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-4">Vessel Status</h3>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Active</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Dark</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Alert</span>
                            </label>
                          </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-4">Vessel Type</h3>
                          <div className="space-y-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Cargo</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Tanker</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="ml-3 text-sm text-gray-300">Fishing</span>
                            </label>
                          </div>
                        </div>

                        {/* Speed Range */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-4">Speed Range (knots)</h3>
                          <div className="space-y-4">
                            <input
                              type="range"
                              min="0"
                              max="30"
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>0</span>
                              <span>30</span>
                            </div>
                          </div>
                        </div>

                        {/* Distance Range */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-300 mb-4">Distance from Coast (nm)</h3>
                          <div className="space-y-4">
                            <input
                              type="range"
                              min="0"
                              max="200"
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>0</span>
                              <span>200</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 justify-end px-4 py-4 border-t border-[#2d3748]">
                      <button
                        type="button"
                        className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="ml-4 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        onClick={onClose}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 