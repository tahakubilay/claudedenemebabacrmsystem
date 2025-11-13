'use client';

import React from 'react';
import { Receipt } from '@/types';

interface ReceiptTimelineProps {
  receipts: Receipt[];
}

export const ReceiptTimeline: React.FC<ReceiptTimelineProps> = ({
  receipts,
}) => {
  return (
    <div className="space-y-8">
      {receipts.map((receipt) => (
        <div key={receipt.id} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-white font-bold">
              {receipt.title.charAt(0)}
            </div>
            <div className="w-px h-full bg-gray-300" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{receipt.title}</p>
              <p className="text-sm text-gray-500">{receipt.date}</p>
            </div>
            <p className="text-gray-700">{receipt.description}</p>
            {receipt.amount && (
              <p className="text-sm text-gray-500">
                {receipt.amount} {receipt.currency}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
