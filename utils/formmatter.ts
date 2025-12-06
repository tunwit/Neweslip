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

export function formatModifiedTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime(); 

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const isYesterday = days === 1;
    const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    if (isYesterday) return `Yesterday at ${time}`;

    return new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}