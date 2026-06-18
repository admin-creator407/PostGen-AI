import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small:  'w-4 h-4 border-2',
  medium: 'w-6 h-6 border-2',
  large:  'w-8 h-8 border-[3px]',
};

const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => (
  <div className="flex items-center justify-center">
    <div
      className={`rounded-full border-border border-t-brand animate-spin ${sizeMap[size]}`}
    />
  </div>
);

export default Loader;
