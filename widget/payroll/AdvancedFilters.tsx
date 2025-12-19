import { usePayrollPeriodSummary } from "@/hooks/payroll/period/usePayrollPeriodSummary";
import { usePeriodFields } from "@/hooks/payroll/fields/usePeriodFields";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";
import { PayrollRecord } from "@/types/payrollRecord";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string | boolean;
}

// Operators for number fields
const numberOperators = [
  { value: "eq" },
  { value: "neq" },
  { value: "gt" },
  { value: "gte" },
  { value: "lt" },
  { value: "lte" },
] as const;

const numberOperatorsSymbol: Record<string, string> = {
  eq: "=",
  neq: "≠",
  gt: ">",
  gte: "≥",
  lt: "<",
  lte: "≤",
};

const quickFilters = [
  {
    label: "has_overtime",
    filter: { field: "totalOT", operator: "gt", value: "0" },
  },
  {
    label: "has_penalty",
    filter: { field: "totalPenalty", operator: "gt", value: "0" },
  },
  {
    label: "no_deduction",
    filter: { field: "totalDeduction", operator: "eq", value: "0" },
  },
  {
    label: "high_earners",
    filter: { field: "net", operator: "gt", value: "20000" },
  },
  {
    label: "low_earners",
    filter: { field: "net", operator: "lt", value: "16000" },
  },
  {
    label: "paid",
    filter: { field: "paid", operator: "eq", value: true },
  },
];

/**
 * Generic AdvancedFilters component
 *
 * T: the record type passed in (PayrollRecord | PayrollRecordSummary)
 * T must have `.id: number`
 */
interface AdvancedFiltersProps<T extends { id: number }> {
  periodId: number;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  originalData: T[]; // Original unfiltered data
  setData: Dispatch<SetStateAction<T[]>>;
}

export default function AdvancedFilters<T extends { id: number }>({
  periodId,
  show,
  setShow,
  originalData,
  setData,
}: AdvancedFiltersProps<T>) {
  const { data } = usePayrollPeriodSummary(periodId);
  const { data: periodFields } = usePeriodFields(Number(periodId));

  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterRule[]>([]);
  const t = useTranslations("period");
  const updateFilter = (id: string, key: string, value: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [key]: value } : f)),
    );
  };

  const removeFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const applyFilterLogic = (
    summary: PayrollPeriodSummary,
    records: T[],
    filterRules: FilterRule[],
  ): T[] => {
    if (filterRules.length === 0) return records;

    // Build summary map: id -> PayrollRecordSummary
    const summaryMap = new Map<number, PayrollRecordSummary>();
    summary.records.forEach((rec) => summaryMap.set(rec.id, rec));

    return records.filter((origRecord) => {
      const summaryRecord = summaryMap.get(origRecord.id);

      // If no matching summary record, exclude (or you could choose to include)
      if (!summaryRecord) return false;

      // Every filter must pass
      return filterRules.every((filter) => {
        let recordValue: number | string | undefined = undefined;

        if (filter.field === "paid") {
          const isPaid = summaryRecord.paid; // boolean
          const fPaid = filter.value === "true";

          if (filter.operator === "eq") {
            return isPaid === fPaid;
          }

          if (filter.operator === "neq") {
            return isPaid !== fPaid;
          }

          return true;
        }

        // 1) totals (net, totalEarning, totalDeduction, totalPenalty, totalOT, etc)
        if (
          Object.prototype.hasOwnProperty.call(
            summaryRecord.totals,
            filter.field,
          )
        ) {
          recordValue = (summaryRecord.totals as any)[filter.field];
        }

        // 2) custom salary fields
        if (recordValue === undefined) {
          const customField = summaryRecord.fields.find(
            (f) =>
              f.name === filter.field || (f).nameEng === filter.field,
          );
          if (customField) recordValue = (customField).amount;
        }

        // 3) OT fields
        if (recordValue === undefined) {
          const otField = summaryRecord.ot.find(
            (f) =>
              f.name === filter.field || (f).nameEng === filter.field,
          );
          if (otField) recordValue = (otField).amount;
        }

        // 4) Penalty fields
        if (recordValue === undefined) {
          const penField = summaryRecord.penalties.find(
            (f) =>
              f.name === filter.field || (f).nameEng === filter.field,
          );
          if (penField) recordValue = (penField).amount;
        }

        // If we still don't have a value for this field, treat as "pass" (do not filter out)
        if (recordValue === undefined) return true;

        // Compare numeric values
        if(typeof filter.value !== "string") return
        const filterValue = parseFloat(filter.value);
        const numericValue = parseFloat(String(recordValue));

        if (isNaN(filterValue) || isNaN(numericValue)) return false;

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

  const applyFilter = () => {
    if (!data?.data) return;
    // We pass originalData (T[]) so the return is T[]
    const filtered = applyFilterLogic(data.data, originalData, filters);
    setData(filtered);
    setActiveFilters([...filters]);
    setShow(false);
  };

  const clearFilter = () => {
    setFilters([]);
    setActiveFilters([]);
  };

  useEffect(() => {
    // Run initial filter on mount (keeps behavior consistent with original)
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addQuickFilter = (field: string, operator: string, value: string) => {
    if (!periodFields?.data) return;
    if (periodFields.data.length === 0) return;
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field,
      operator,
      value,
    };

    setFilters((prev) => [...prev, newFilter]);
  };

  const addFilter = () => {
    if (!periodFields?.data) return;
    if (periodFields.data.length === 0) return;

    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: periodFields.data[0] ?? "",
      operator: numberOperators[0].value,
      value: "0",
    };
    setFilters((prev) => [...prev, newFilter]);
  };

  return (
    <>
      <div hidden={activeFilters.length === 0} className="flex gap-3  mt-4">
        {activeFilters.map((a) => (
          <span
            key={a.id}
            className="flex flex-row gap-2 text-blue-700 bg-blue-100 px-3 py-2 rounded-md text-sm"
          >
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
        <h1 className="text-gray-700">{t("filters.title")} (Beta)</h1>
        <p className="text-xs text-gray-700 mt-2">
          {t("filters.quick_filters.label")}
        </p>
        <section className="flex gap-3">
          {quickFilters.map((q, i) => (
            <button
              key={i}
              onClick={() =>
                addQuickFilter(
                  q.filter.field,
                  q.filter.operator,
                  String(q.filter.value),
                )
              }
              className="flex items-center justify-center text-xs text-gray-700 bg-gray-200 w-fit h-fit px-3 py-1 pt-2 rounded-sm"
            >
              {t(`filters.quick_filters.filters.${q.label}`)}
            </button>
          ))}
        </section>

        <div className="flex flex-col max-w-[700px] justify-center mt-3">
          <div className="space-y-3 mb-4">
            {filters.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                {t("filters.no_filter")}
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
                    {periodFields?.data?.map((field, idx) => (
                      <option key={idx} value={field ?? ""}>
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
                        {numberOperatorsSymbol[op.value]} (
                        {t(`filters.operator.${op.value}`)})
                      </option>
                    ))}
                  </select>

                  {/* Value Input */}
                  {filter.field === "paid" ? (
                    <select
                      className="text-sm w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={String(filter.value)}
                      onChange={(e) =>
                        updateFilter(filter.id, "value", e.target.value)
                      }
                    >
                      <option value={"true"}>true</option>
                      <option value={"false"}>false</option>
                    </select>
                  ) : (
                    <input
                      type={"number"}
                      value={filter.value as unknown as number}
                      onChange={(e) =>
                        updateFilter(filter.id, "value", e.target.value)
                      }
                      placeholder="Enter value"
                      className="text-sm flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}

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
            <p>{t("filters.actions.add_filter")}</p>
          </button>
        </div>

        <div className="flex flex-row-reverse border-t py-2 mt-2">
          <div className="space-x-3">
            <button
              disabled={filters.length === 0}
              onClick={clearFilter}
              className="text-sm text-gray-700 disabled:text-gray-300"
            >
              <p>{t("filters.actions.clear_all")}</p>
            </button>
            <button
              onClick={applyFilter}
              className="text-sm py-2 px-5 rounded-md bg-blue-600 text-white "
            >
              <p>{t("filters.actions.apply")}</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
