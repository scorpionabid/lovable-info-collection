
import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  backButton?: ReactNode;
}

export const PageHeader = ({ 
  title, 
  description, 
  actions,
  backButton 
}: PageHeaderProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-4">
          {backButton && (
            <div className="mr-2">
              {backButton}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h1>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
};
