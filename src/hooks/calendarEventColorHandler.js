"use client";

import { useMemo, useState, useEffect } from "react";
import moment from "moment";

// Egyedi hook a naptár események stílusainak kezelésére.
const useEventStyles = (fullyBookedDays) => {

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
      }, [fullyBookedDays])

  // A szolgáltatás neve alapján generált színek cache-elése. A useMemo hook biztosítja, hogy a színtérkép csak egyszer jön létre és nem frissül minden renderelésnél.
  const serviceColors = useMemo(() => ({}), []);

  // Funkció a szolgáltatás nevéből származó egyedi szín generálására. Ez egy hash függvényt használ a string karakterkódjainak összegzésére, majd ennek alapján hoz létre egy HSL színt.
  const stringToColorHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 40%, 80%)`;
  };

  // Az esemény stílusát visszaadó függvény. Ez a függvény fut le minden egyes eseménynél, amikor a naptár komponens rendereli azokat.
  const eventPropGetter = (event) => {
    // Ha a cache-ben még nincs szín a jelenlegi esemény címéhez (szolgáltatás nevéhez) rendelve, generál egyet és tárolja.
    if (!serviceColors[event.title]) {
      serviceColors[event.title] = stringToColorHash(event.title);
    }

    // Alapértelmezett stílus objektum, amely tartalmazza a hátteret és a szöveg színét.
    const style = {
      backgroundColor: serviceColors[event.title], // Dinamikusan generált szín
      color: "black", // Cím színe
      borderRadius: '0px',
      fontSize: '13px',
      height: '25px',
      display: 'flex',
      alignItems:'center'
    };

    // Ellenőrzi, hogy az adott esemény napja szerepel-e a teljesen lefoglalt napok között.
    const eventDate = moment(event.start).format("YYYY-MM-DD");
    if (fullyBookedDayManage[event.serviceId]?.includes(eventDate)) {
      style.backgroundColor = "red"; // Ha igen, beállítja a hátteret pirosra.
      style.color = "black"; // A szöveg színét fehérre állítja.
      style.opacity = '.6'
    }
    // Visszaadja a stílus objektumot, amit a naptár komponens az adott eseményhez rendel.
    return { style };
  };

  // Visszaadja az esemény stílusát generáló függvényt, amit a naptár komponens használhat.
  return eventPropGetter;
};

export default useEventStyles;

