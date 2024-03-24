import React, { useState } from 'react';
import moment from 'moment-timezone';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  TextField, Grid, Button, Checkbox, FormControlLabel,
  FormGroup, FormControl, Switch
} from '@mui/material';
import 'dayjs/locale/hu';

const daysOfWeek = [
  { value: 1, label: 'Hétfő' },
  { value: 2, label: 'Kedd' },
  { value: 3, label: 'Szerda' },
  { value: 4, label: 'Csütörtök' },
  { value: 5, label: 'Péntek' },
  { value: 6, label: 'Szombat' },
  { value: 0, label: 'Vasárnap' },
];

const PostAServiceForm = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [maxSlots, setMaxSlots] = useState(1);
  const [availableFrom, setAvailableFrom] = useState(moment());
  const [availableTo, setAvailableTo] = useState(moment());
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);

  const handleDayChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedDays(
      selectedDays.includes(value)
        ? selectedDays.filter(day => day !== value)
        : [...selectedDays, value]
    );
  };

  const handleSubmit = async () => {
    if (!availableFrom || !availableTo || (isRecurring && selectedDays.length === 0)) {
      alert("Please complete all fields.");
      return;
    }

    const serviceData = {
      name: serviceName,
      description: serviceDescription,
      availableFrom: availableFrom, 
      availableTo: availableTo,
      maxSlots,
      startTime: startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      recurrence:isRecurring,
      recurrenceDays: isRecurring ? selectedDays : [],
    };

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Failed to add service');
      }

      alert('Service added successfully');
      // Here you can add any code to handle the successful submission,
      // like redirecting the user or clearing the form.
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
        <Grid container spacing={3} direction="column">
          <Grid item>
            <TextField
              fullWidth
              label="Service Name"
              variant="outlined"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Max Slots"
              variant="outlined"
              type="number"
              value={maxSlots}
              onChange={(e) => setMaxSlots(e.target.value)}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="Available From"
              value={availableFrom}
              onChange={setAvailableFrom}
              components={{
                OpenPickerIcon: 'keyboard_arrow_down', // Ezt szükség szerint állítsd be
                TextField: (textFieldProps) => <TextField {...textFieldProps} />
              }}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="Available To"
              value={availableTo}
              onChange={setAvailableTo}
              components={{
                OpenPickerIcon: 'keyboard_arrow_down', // Ezt szükség szerint állítsd be
                TextField: (textFieldProps) => <TextField {...textFieldProps} />
              }}
            />
          </Grid>
          <Grid item>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              components={{
                OpenPickerIcon: 'keyboard_arrow_down', // Ezt szükség szerint állítsd be
                TextField: (textFieldProps) => <TextField {...textFieldProps} />
              }}
            />
          </Grid>
          <Grid item>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              components={{
                OpenPickerIcon: 'keyboard_arrow_down', // Ezt szükség szerint állítsd be
                TextField: (textFieldProps) => <TextField {...textFieldProps} />
              }}
            />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={<Switch checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />}
                  label="Recurring Service"
                />
              </Grid>
              {isRecurring && (
                <Grid item>
                  <FormGroup>
                    {daysOfWeek.map(day => (
                      <FormControlLabel
                        key={day.value}
                        control={
                          <Checkbox
                            checked={selectedDays.includes(day.value)}
                            onChange={handleDayChange}
                            value={day.value}
                          />
                        }
                        label={day.label}
                      />
                    ))}
                  </FormGroup>
                </Grid>
              )}
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Post Service
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </>
      );
    };
    
    export default PostAServiceForm;
    