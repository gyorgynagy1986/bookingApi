import { useMemo, useState, useEffect } from "react";
import moment from "moment";

const useEventStyles = (fullyBookedDays, services) => {
  const stringToColorHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Adjusted for a bit darker and richer colors
    return `hsl(${hash % 360}, 75%, 70%)`; // Increase saturation, decrease lightness for depth
  };

  const [fullyBookedDayManage, setFullyBookedDaysManage] = useState({});

  useEffect(() => {
    if (fullyBookedDays && Array.isArray(fullyBookedDays.fullyBookedDays)) {
      const bookedDays = fullyBookedDays.fullyBookedDays.reduce((acc, item) => {
        if (!acc[item.serviceId]) {
          acc[item.serviceId] = [];
        }
        acc[item.serviceId].push(item.date);
        return acc;
      }, {});
      setFullyBookedDaysManage(bookedDays);
    }
  }, [fullyBookedDays]);

  const serviceColors = useMemo(() => {
    const colors = {};
    services.forEach(service => {
      // Ensure a consistent color for each service
      colors[service._id] = stringToColorHash(service.name);
    });
    return colors;
  }, [services]);

  const eventPropGetter = (event) => {
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    const isFullyBooked = fullyBookedDayManage[event.serviceId]?.includes(eventDate);

    const style = {
      backgroundColor: isFullyBooked ? "red" : serviceColors[event.serviceId],
      color: "black", // Adjust text color as needed
      borderRadius: "0px",
      fontSize: "13px",
      height: "25px",
      display: "flex",
      opacity: isFullyBooked ? 0.6 : 1,
    };

    return { style };
  };

  return eventPropGetter;
};

export default useEventStyles;
