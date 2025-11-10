export interface EmployeeStats{
    totalEmployees: number,
    activeEmployees: number,
    inActiveEmployee:number,
    partTimeEmployees: number,
    salary:{
        totalSalary: number,
        activeSalary: number,
        inactiveSalary: number,
        partTimeSalary: number,
    },
    statusDistribution:{
        ACTIVE: number,
        INACTIVE: number,
        PARTTIME: number,
    },
    genderDistribution:{
        MALE: number,
        FEMALE: number,
        OTHER: number,
    }
}