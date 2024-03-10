// EventModal.js
import React from 'react';
import moment from 'moment';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

function EventModal({ open, onClose, event }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Esemény részletei</DialogTitle>
      <DialogContent>
        <div>
           <p>{'Esemény megnevezése: '} <b> {event ? event.title : ''}</b></p> 
            {'Esemény dátuma: '}<b>{event ? `${moment(event.start).format('YYYY-MM-DD')} ${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}` : ''}</b>
           <p>{'Esemény részletes leírása: '} <b>{event ? event.desc : ''}</b></p>
           <p> {'Szabad helyek száma: '}<b>{event ? event.availableSlots : ''}</b></p>
        </div>
          {/* Itt jelenítheted meg az esemény további részleteit */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Bezár</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventModal;
