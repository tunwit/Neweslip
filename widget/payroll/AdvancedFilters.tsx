import { usePayrollPeriodSummary } from "@/hooks/usePayrollPeriodSummary";
import { usePeriodFields } from "@/hooks/usePeriodFields";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";
import { PayrollRecord } from "@/types/payrollRecord";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Operators for number fields
const numberOperators = [
  { value: "eq", label: "= (equals)" },
  { value: "neq", label: "≠ (not equals)" },
  { value: "gt", label: "> (greater than)" },
  { value: "gte", label: "≥ (greater or equal)" },
  { value: "lt", label: "< (less than)" },
  { value: "lte", label: "≤ (less or equal)" },
];

const numberOperatorsSymbol = {
  eq: "=",
  neq: "≠",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
};

const quickFilters = [
  {
    label: "Has Overtime",
    filter: { field: "totalOT", operator: "gt", value: "0" },
  },
  {
    label: "Has Penalty",
    filter: { field: "totalPenalty", operator: "gt", value: "0" },
  },
  {
    label: "No Deductions",
    filter: { field: "totalDeduction", operator: "eq", value: "0" },
  },
  {
    label: "High Earners (>50k)",
    filter: { field: "net", operator: "gt", value: "50000" },
  },
  {
    label: "Low Earners (<20k)",
    filter: { field: "net", operator: "lt", value: "20000" },
  },
];

interface AdvancedFiltersProps {
  periodId: number;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  originalData: PayrollRecord[] | PayrollRecordSummary[]; // Original unfiltered data
  setData: Dispatch<SetStateAction<PayrollRecord[] | PayrollRecordSummary[]>>;
}

export default function AdvancedFilters({
  periodId,
  show,
  setShow,
  originalData,
  setData,
}: AdvancedFiltersProps) {
  const { data } = usePayrollPeriodSummary(periodId);
  const { data: periodFields } = usePeriodFields(Number(periodId));
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);

  const updateFilter = (id: string, key: string, value: string) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const applyFilter = () => {
    if (!data?.data) return;
    const filtered = applyFilterLogic(data?.data, filters);

    setData(filtered);
    setActiveFilters([...filters]);
    setShow(false);
  };

  const applyFilterLogic = (
    summary: PayrollPeriodSummary,
    filterRules: FilterRule[],
  ): PayrollRecord[] => {
    if (filterRules.length === 0) return originalData;

    // Create a lookup map from summary.records → totals / fields
    const summaryMap = new Map<number, PayrollRecordSummary>();
    summary.records.forEach((rec) => summaryMap.set(rec.id, rec));

    return originalData.filter((origRecord) => {
      const summaryRecord = summaryMap.get(origRecord.id);

      if (!summaryRecord) return false;

      return filterRules.every((filter) => {
        let recordValue: number | string | undefined = undefined;

        // 1. Match totals (net, totalOT, totalDeduction, etc)
        if (summaryRecord.totals.hasOwnProperty(filter.field)) {
          recordValue =
            summaryRecord.totals[
              filter.field as keyof typeof summaryRecord.totals
            ];
        }

        // 2. Match custom fields (in summaryRecord.fields[])
        if (recordValue === undefined) {
          const customField = summaryRecord.fields.find(
            (f) => f.name === filter.field || f.nameEng === filter.field,
          );
          if (customField) recordValue = customField.amount;
        }

        if (recordValue === undefined) {
          const customField = summaryRecord.ot.find(
            (f) => f.name === filter.field || f.nameEng === filter.field,
          );
          if (customField) recordValue = customField.amount;
        }

        if (recordValue === undefined) {
          const customField = summaryRecord.penalties.find(
            (f) => f.name === filter.field || f.nameEng === filter.field,
          );
          if (customField) recordValue = customField.amount;
        }

        if (recordValue === undefined) return true;

        const filterValue = parseFloat(filter.value);
        const numericValue = parseFloat(String(recordValue));

        if (isNaN(filterValue) || isNaN(numericValue)) return true;

        switch (filter.operator) {
          case "eq":
            return numericValue === filterValue;
          case "neq":
            return numericValue !== filterValue;
          case "gt":
            return numericValue > filterValue;
          case "gte":
            return numericValue >= filterValue;
          case "lt":
            return numericValue < filterValue;
          case "lte":
            return numericValue <= filterValue;
          default:
            return true;
        }
      });
    });
  };

  const clearFilter = () => {
    setFilters([]);
    setActiveFilters([]);
  };

  useEffect(() => {
    applyFilter();
  }, []);

  const addQuickFilter = (field: string, operator: string, value: string) => {
    if (!periodFields?.data) return;
    if (periodFields?.data?.length === 0) return;
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: field,
      operator: operator,
      value: value,
    };

    setFilters([...filters, newFilter]);
  };

  const addFilter = () => {
    if (!periodFields?.data) return;
    if (periodFields?.data?.length === 0) return;

    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: periodFields?.data[0],
      operator: numberOperators[0].value,
      value: "0",
    };
    setFilters([...filters, newFilter]);
  };
  return (
    <>
      <div hidden={activeFilters.length === 0} className="flex gap-3  mt-4">
        {activeFilters.map((a) => (
          <span className="flex flex-row gap-2 text-blue-700 bg-blue-100 px-3 py-2 rounded-md text-sm">
            <p>
              {a.field} {numberOperatorsSymbol[a.operator] || "unknown"}{" "}
              {a.value}
            </p>
            <button
              onClick={() => {
                removeFilter(a.id);
                applyFilter();
              }}
            >
              <Icon icon="basil:cross-solid" fontSize={20} />
            </button>
          </span>
        ))}
      </div>

      <div hidden={!show} className="bg-white mt-4 flex flex-col gap-2">
        <h1 className="text-gray-700">Advanced Filters (Beta)</h1>
        <p className="text-xs text-gray-700 mt-2">Quick filters</p>
        <section className="flex gap-3">
          {quickFilters.map((q) => (
            <button
              onClick={() =>
                addQuickFilter(
                  q.filter.field,
                  q.filter.operator,
                  q.filter.value,
                )
              }
              className="flex items-center justify-center text-xs text-gray-700 bg-gray-200 w-fit h-fit px-3 py-1 pt-2 rounded-sm"
            >
              {q.label}
            </button>
          ))}
        </section>
        <div className="flex flex-col max-w-[700px] justify-center mt-3">
          <div className="space-y-3 mb-4">
            {filters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No filters added. Click "Add Filter" to create one.
              </p>
            ) : (
              filters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {/* Field Selection */}
                  <select
                    value={filter.field}
                    className="text-sm flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateFilter(filter.id, "field", e.target.value)
                    }
                  >
                    {periodFields?.data?.map((field, _) => (
                      <option key={_} value={field!}>
                        {field}
                      </option>
                    ))}
                  </select>

                  {/* Operator Selection */}
                  <select
                    value={filter.operator}
                    className="text-sm w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) =>
                      updateFilter(filter.id, "operator", e.target.value)
                    }
                  >
                    {numberOperators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  {/* Value Input */}
                  <input
                    type={"number"}
                    value={filter.value}
                    onChange={(e) =>
                      updateFilter(filter.id, "value", e.target.value)
                    }
                    placeholder="Enter value"
                    className="text-sm flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove filter"
                  >
                    <Icon icon="mynaui:trash" fontSize={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          <button
            onClick={addFilter}
            className="flex items-center justify-center max-w-96 py-2 rounded-md mt-2 w-full border border-dashed border-gray-600 text-gray-600"
          >
            <Icon icon="material-symbols:add-rounded" />
            <p>Add filter</p>
          </button>
        </div>
        <div className="flex flex-row-reverse border-t py-2 mt-2">
          <div className="space-x-3">
            <button
              disabled={filters.length === 0}
              onClick={clearFilter}
              className="text-sm text-gray-700 disabled:text-gray-300"
            >
              <p>Clear All</p>
            </button>
            <button
              onClick={applyFilter}
              className="text-sm py-2 px-5 rounded-md bg-blue-600 text-white "
            >
              <p>Apply Filters</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
