import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

interface DataTableProps<T extends { id: string }> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    onRowClick,
    emptyMessage = 'No data available.',
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sorted = [...data].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
    });

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                <p className="text-charcoal/40 font-sans text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-charcoal/5">
                            {columns.map(col => (
                                <th
                                    key={String(col.key)}
                                    className={`text-left px-6 py-4 text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-charcoal/40 ${col.sortable ? 'cursor-pointer hover:text-charcoal transition-colors select-none' : ''
                                        }`}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <span className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(row => (
                            <tr
                                key={row.id}
                                className={`border-b border-charcoal/[0.03] last:border-b-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-sage/10' : ''
                                    }`}
                                onClick={() => onRowClick?.(row)}
                            >
                                {columns.map(col => (
                                    <td
                                        key={String(col.key)}
                                        className="px-6 py-4 font-sans text-sm text-charcoal/80"
                                    >
                                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
