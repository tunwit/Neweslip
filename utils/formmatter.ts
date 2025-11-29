export function moneyFormat (amount:number){
    return new Intl.NumberFormat("th-TH").format(amount);
} 

export function dateFormat (date:Date){
    return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: "short",
    day: "2-digit"
}).format(date);
} 