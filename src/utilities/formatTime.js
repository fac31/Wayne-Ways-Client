export function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0'); // Ensure two digits
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensure two digits
    return `${hours}:${minutes}`;
}

export default formatTime;
