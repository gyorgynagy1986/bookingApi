import React, {useContext} from 'react';
import moment from 'moment';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ReservationButton from '@/components/dashboard/postAnAppoitement/postAnAppoitement'

function EventModal({ open, onClose, event }) {

  const handleCloseModals = () => {
    onClose(); // Bezárás a szülő komponensben
  };
  // Check if the event is in the past
  const eventDateTime = moment(`${event?.date}T${event?.startTime}`);

  const datese = moment(event?.start).format('YYYY-MM-DD');

  // Jelenlegi időpont
  const now = moment();
  
  // Ellenőrzés, hogy az esemény a múltban van-e
  const isPastEvent = now.isAfter(eventDateTime);  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Esemény részletei</DialogTitle>
      <DialogContent>
        {/* Check if the event is in the p ast or has no available slots */}
        {isPastEvent || event?.availableSlots === 0 ? (
          <p>NEM ELÉRHETŐ</p>
        ) : (
          <div>
            <p>{'Esemény megnevezése: '} <b>{event ? event.title : ''}</b></p>
            <p>{'Esemény dátuma: '} <b>{event ? `${moment(event.date).format('YYYY-MM-DD')} ${event.startTime} - ${event.endTime}` : ''}</b></p>
            <p>{'Esemény részletes leírása: '} <b>{event ? event.desc : ''}</b></p>
            <p>{'Szabad helyek száma: '}<b>{event ? event.availableSlots : ''}</b></p>
            <ReservationButton closeModal={handleCloseModals} id={event?.serviceId} date={moment(event?.start).format('YYYY-MM-DD')}/>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModals}>Bezár</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventModal;
