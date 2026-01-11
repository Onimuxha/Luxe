'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { IconMinus, IconPlus } from '@tabler/icons-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  stock: number;
  showLabel?: boolean;
  showStock?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  stock,
  showLabel = true,
  showStock = true,
  className = '',
}: QuantitySelectorProps) {
  const [direction, setDirection] = useState(0);

  const handleChange = (val: number) => {
    setDirection(val > quantity ? 1 : -1);
    onQuantityChange(val);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && <h6 className='text-base font-semibold'>Quantity</h6>}

      <div className='flex flex-wrap items-center gap-3 md:gap-4'>
        <div className='border-secondary flex items-center rounded-lg border p-0.5'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 md:h-10 md:w-10'
            onClick={() => quantity > 1 && handleChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <IconMinus stroke={3} className='h-3 w-3 md:h-4 md:w-4' />
          </Button>

          <div className='relative flex h-8 w-12 items-center justify-center overflow-hidden md:h-10 md:w-16'>
            <AnimatePresence mode='popLayout' initial={false}>
              <motion.span
                key={quantity}
                initial={{ y: direction > 0 ? 20 : -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -20 : 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className='absolute text-sm font-bold md:text-lg'
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 md:h-10 md:w-10'
            onClick={() => quantity < stock && handleChange(quantity + 1)}
            disabled={quantity >= stock}
          >
            <IconPlus stroke={3} className='h-3 w-3 md:h-4 md:w-4' />
          </Button>
        </div>

        {showStock && <span className='text-xs text-gray-600 sm:text-sm'>{stock > 0 ? `${stock} available` : 'Out of stock'}</span>}
      </div>
    </div>
  );
}

export function QuantitySelectorCompact({
  quantity,
  onQuantityChange,
  stock,
  className = '',
}: Omit<QuantitySelectorProps, 'showLabel' | 'showStock'>) {
  const [direction, setDirection] = useState(0);

  const handleChange = (val: number) => {
    setDirection(val > quantity ? 1 : -1);
    onQuantityChange(val);
  };

  return (
    <div className={`flex items-center gap-1 rounded-lg border border-gray-300 p-0.5 ${className}`}>
      <Button className='h-8 w-8' onClick={() => quantity > 1 && handleChange(quantity - 1)} disabled={quantity <= 1}>
        <IconMinus className='h-3 w-3' />
      </Button>

      <div className='relative flex h-8 w-12 items-center justify-center overflow-hidden md:w-16'>
        <AnimatePresence mode='popLayout' initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: direction > 0 ? 20 : -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction > 0 ? -20 : 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className='absolute text-sm font-medium md:text-base'
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <Button className='h-8 w-8' onClick={() => quantity < stock && handleChange(quantity + 1)} disabled={quantity >= stock}>
        <IconPlus className='h-3 w-3' />
      </Button>
    </div>
  );
}

// export default function Demo() {
//   const [quantity1, setQuantity1] = useState(1);
//   const [quantity2, setQuantity2] = useState(3);

//   return (
//     <div className='max-w-md space-y-8 p-8'>
//       <div>
//         <h2 className='mb-4 text-xl font-bold'>Full Version</h2>
//         <QuantitySelector quantity={quantity1} onQuantityChange={setQuantity1} stock={50} />
//       </div>

//       <div>
//         <h2 className='mb-4 text-xl font-bold'>Compact Version</h2>
//         <QuantitySelectorCompact quantity={quantity2} onQuantityChange={setQuantity2} stock={25} />
//       </div>
//     </div>
//   );
// }
