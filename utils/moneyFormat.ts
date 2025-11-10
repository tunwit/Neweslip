export function moneyFormat (amount:number){
    return new Intl.NumberFormat("th-TH").format(amount);
} 