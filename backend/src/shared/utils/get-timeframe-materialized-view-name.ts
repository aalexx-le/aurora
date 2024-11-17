export const getTimeframeMaterializedViewName = (
    timeframe: string,
    baseTableName: string,
) => {
    const [time, unit] = timeframe.split(" ");
    let formattedTimeFrame = time + unit.charAt(0);

    if (unit === "month") {
        formattedTimeFrame = time + "M";
    }
    return `${baseTableName}_${formattedTimeFrame}`;
};
