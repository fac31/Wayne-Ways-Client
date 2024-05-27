export function addMinutesToTime(time, minutesToAdd) {
    const [hoursStr, minutesStr] = time.split(':');
    const hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);

    // Calculate the new time
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    // Format the new time
    const newHoursStr = String(newHours).padStart(2, '0');
    const newMinutesStr = String(newMinutes).padStart(2, '0');

    return `${newHoursStr}:${newMinutesStr}`;
}

export default addMinutesToTime;
