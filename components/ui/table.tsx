import React from 'react';

export const Table = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead className={`[&_tr]:border-b ${className || ''}`} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props}>
      {children}
    </tbody>
  );
};

export const TableFooter = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <tfoot className={`bg-primary/10 font-medium text-primary-foreground ${className || ''}`} {...props}>
      {children}
    </tfoot>
  );
};

export const TableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className || ''}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, className, colSpan, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td colSpan={colSpan} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`} {...props}>
      {children}
    </td>
  );
};

export const TableCaption = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => {
  return (
    <caption className={`mt-4 text-sm text-muted-foreground ${className || ''}`} {...props}>
      {children}
    </caption>
  );
};
