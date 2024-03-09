import React from 'react';

const useCustomEventComponents = () => {
  // Az EventWithDescription komponens definíciója
  const EventWithDescription = ({ event }) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <strong>{event.title}</strong>
      <div>{event.desc}</div> {/* Esemény leírása */}
    </div>
  );

  // A customComponents objektum, ami a fenti komponenst használja
  const customComponents = React.useMemo(() => ({
    week: {
      event: EventWithDescription, // A hét nézetben használt esemény komponens
    },
    day: {
      event: EventWithDescription, // A nap nézetben használt esemény komponens
    },
  }), []);

  // Visszaadja a customComponents objektumot
  return customComponents;
};

export default useCustomEventComponents;