import React, { useState, useRef, useEffect } from 'react';

interface SortFilterDropdownProps {
  type: 'sort' | 'filter';
  className?: string;
  children: React.ReactNode;
}

const SortFilterDropdown: React.FC<SortFilterDropdownProps> = ({
  type,
  className = '',
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
      >
        {type === 'sort' ? 'Sort' : 'Filter'}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <div className="py-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
                  className: `dropdown-item ${child.props.className || ''}`
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilterDropdown;