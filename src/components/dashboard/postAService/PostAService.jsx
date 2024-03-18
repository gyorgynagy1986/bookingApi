"use client"
import React, { useState } from 'react';
import moment from 'moment-timezone';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/hu';


const PostAServiceForm = () => {
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [maxSlots, setMaxSlots] = useState(1);
    const [availableFrom, setAvailableFrom] = useState(null);
    const [availableTo, setAvailableTo] = useState(null);
    const [startTime, setStartTime] = useState(moment());
    const [endTime, setEndTime] = useState(moment());
  
    const handleSubmit = async () => {
      if (!availableFrom || !availableTo) {
        alert("Please select both start and end dates.");
        return;
      }
  
      const serviceData = {
        name: serviceName,
        description: serviceDescription,
        availableFrom: availableFrom.format(),
        availableTo: availableTo.format(),
        maxSlots,
        startTime: startTime.format('HH:mm'),
        endTime: endTime.format('HH:mm')
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
      // Reset form or handle success further
    } catch (error) {
      alert(error.message);
    }
     };


  
    return (
        <>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu" >
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
              onChange={(newValue) => {
                setAvailableFrom(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="Available To"
              value={availableTo}
              onChange={(newValue) => {
                setAvailableTo(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(newValue) => {
                setStartTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(newValue) => {
                setEndTime(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
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

//import React, { useState } from 'react';
//import moment from 'moment-timezone';
//import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { TextField, Grid, Button, Checkbox, FormControlLabel, FormGroup, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
//import 'dayjs/locale/hu';
//
//const repeatOptions = [
//  { value: 'none', label: 'None' },
//  { value: 'daily', label: 'Daily' },
//  { value: 'weekly', label: 'Weekly' },
//];
//
//const daysOfWeek = [
//  { value: 'monday', label: 'Monday' },
//  { value: 'tuesday', label: 'Tuesday' },
//  { value: 'wednesday', label: 'Wednesday' },
//  { value: 'thursday', label: 'Thursday' },
//  { value: 'friday', label: 'Friday' },
//  { value: 'saturday', label: 'Saturday' },
//  { value: 'sunday', label: 'Sunday' },
//];
//
//const PostAServiceForm = () => {
//  const [serviceName, setServiceName] = useState('');
//  const [serviceDescription, setServiceDescription] = useState('');
//  const [maxSlots, setMaxSlots] = useState(1);
//  const [availableFrom, setAvailableFrom] = useState(null);
//  const [availableTo, setAvailableTo] = useState(null);
//  const [startTime, setStartTime] = useState(moment());
//  const [endTime, setEndTime] = useState(moment());
//  const [repeatType, setRepeatType] = useState('none');
//  const [repeatUntil, setRepeatUntil] = useState(null);
//  const [selectedDays, setSelectedDays] = useState([]);
//
//  const handleDayChange = (event) => {
//    const value = event.target.value;
//    setSelectedDays(
//      selectedDays.includes(value)
//        ? selectedDays.filter(day => day !== value)
//        : [...selectedDays, value]
//    );
//  };
//
//  const handleSubmit = async () => {
//   if (!availableFrom || !availableTo || (repeatType === 'weekly' && selectedDays.length === 0)) {
//     alert("Please complete all fields.");
//     return;
//   }
//
//    const serviceData = {
//      name: serviceName,
//      description: serviceDescription,
//      availableFrom: availableFrom.format(),
//      availableTo: availableTo.format(),
//      maxSlots,
//      startTime: startTime.format('HH:mm'),
//      endTime: endTime.format('HH:mm'),
//      repeatType,
//      repeatUntil: repeatUntil ? repeatUntil.format() : null,
//      repeatDays: selectedDays,
//    };
//
//    try {
//      const response = await fetch('/api/services', {
//        method: 'POST',
//        headers: {
//          'Content-Type': 'application/json',
//        },
//        body: JSON.stringify(serviceData),
//      });
//
//      if (!response.ok) {
//        throw new Error('Failed to add service');
//      }
//
//      alert('Service added successfully');
//      // Reset form or handle success further
//    } catch (error) {
//      alert(error.message);
//    }
//  };
//
//  return (
//    <>
//      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="hu">
//        <Grid container spacing={3} direction="column">
//          <Grid item>
//            <TextField
//              fullWidth
//              label="Service Name"
//              variant="outlined"
//              value={serviceName}
//              onChange={(e) => setServiceName(e.target.value)}
//            />
//          </Grid>
//          <Grid item>
//            <TextField
//              fullWidth
//              label="Description"
//              variant="outlined"
//              multiline
//              rows={4}
//              value={serviceDescription}
//              onChange={(e) => setServiceDescription(e.target.value)}
//            />
//          </Grid>
//          <Grid item>
//            <TextField
//              fullWidth
//              label="Max Slots"
//              variant="outlined"
//              type="number"
//              value={maxSlots}
//              onChange={(e) => setMaxSlots(e.target.value)}
//            />
//          </Grid>
//          <Grid item>
//            <DatePicker
//              label="Available From"
//              value={availableFrom}
//              onChange={(newValue) => setAvailableFrom(newValue)}
//              renderInput={(params) => <TextField {...params} />}
//            />
//          </Grid>
//          <Grid item>
//            <DatePicker
//              label="Available To"
//              value={availableTo}
//              onChange={(newValue) => setAvailableTo(newValue)}
//              renderInput={(params) => <TextField {...params} />}
//            />
//          </Grid>
//          <Grid item>
//            <TimePicker
//              label="Start Time"
//              value={startTime}
//              onChange={(newValue) => setStartTime(newValue)}
//              renderInput={(params) => <TextField {...params} />}
//            />
//          </Grid>
//          <Grid item>
//            <TimePicker
//              label="End Time"
//              value={endTime}
//              onChange={(newValue) => setEndTime(newValue)}
//              renderInput={(params) => <TextField {...params} />}
//            />
//          </Grid>
//          <Grid item>
//            <FormControl fullWidth>
//              <InputLabel>Repeat</InputLabel>
//              <Select
//                value={repeatType}
//                label="Repeat"
//                onChange={(e) => setRepeatType(e.target.value)}
//              >
//                {repeatOptions.map(option => (
//                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
//                ))}
//              </Select>
//            </FormControl>
//          </Grid>
//          {repeatType === 'weekly' && (
//            <Grid item>
//              <FormGroup>
//                {daysOfWeek.map(day => (
//                  <FormControlLabel
//                    key={day.value}
//                    control={<Checkbox checked={selectedDays.includes(day.value)} onChange={handleDayChange} value={day.value} />}
//                    label={day.label}
//                  />
//                ))}
//              </FormGroup>
//            </Grid>
//          )}
//          <Grid item>
//            <DatePicker
//              label="Repeat Until"
//              value={repeatUntil}
//              onChange={(newValue) => setRepeatUntil(newValue)}
//              renderInput={(params) => <TextField {...params} />}
//            />
//          </Grid>
//          <Grid item>
//            <Button variant="contained" color="primary" onClick={handleSubmit}>
//              Post Service
//            </Button>
//          </Grid>
//        </Grid>
//      </LocalizationProvider>
//    </>
//  );
//};
//
//export default PostAServiceForm;
//