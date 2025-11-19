"use server";
import { employeesTable, otFieldValueTable, payrollFieldValueTable, payrollPeriodsTable, payrollRecordsTable, penaltyFieldValueTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { and, eq, inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PayrollRecord } from "@/types/payrollRecord";
import Decimal from "decimal.js";
import { RecordDetails } from "@/types/RecordDetails";

export async function updatePayrollRecord(data: { salaryValues: {id:number, amount:number}[], otValues: {id:number, value:number, amount:number}[], penaltyValues: {id:number, value:number, amount:number}[]},recordId:number,shopId:number) {     
    const ownerCheck = await isOwner(shopId);
    if (!ownerCheck) {
        throw new Error("Forbidden");
    }
    if (isNaN(recordId)) return Error("Invalid payrollRecordId");
    const { salaryValues = [], otValues = [], penaltyValues = [] } = data;   

    
    await Promise.all(
      salaryValues.map(({id,amount}) =>
        globalDrizzle
          .update(payrollFieldValueTable)
          .set({ amount: new Decimal(amount).toFixed(2)})
          .where(eq(payrollFieldValueTable.id,id))
      )
    )
    
    
    await Promise.all(
      otValues.map(({id,value,amount}) =>
        globalDrizzle
          .update(otFieldValueTable)
          .set({ value: new Decimal(value).toFixed(2), amount: new Decimal(amount).toFixed(2) })
          .where(eq(otFieldValueTable.id, id))
      )
    );

    await Promise.all(
      penaltyValues.map(({id,value,amount}) =>
        globalDrizzle
          .update(penaltyFieldValueTable)
          .set({ value:new Decimal(value).toFixed(2) ,amount: new Decimal(amount).toFixed(2) })
          .where(eq(penaltyFieldValueTable.id, id))
      )
    );

  
}