"use client"

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import styles from './Page.module.css'; // Ensure this path matches your file structure

const fetcher = (...args) => fetch(...args).then(res => res.json());

const ServiceEditPage = ({ params }) => {
  const { id } = params;
  
  const { data: fetchedService, error } = useSWR(`/api/services/${id}`, fetcher);
  const [service, setService] = useState({
    name: '',
    description: '',
    availableFrom: '',
    availableTo: '',
    maxSlots: 0,
    startTime: '',
    endTime: '',
    recurrence: false,
    recurrenceDays: [],
    visible: false,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false); // New state to control error message visibility
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (fetchedService && fetchedService.success) {
      setService(fetchedService.data);
    }
  }, [fetchedService]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Hide both messages when countdown reaches zero
      setShowSuccessMessage(false);
      setShowErrorMessage(false);
    }
  }, [countdown]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrorMessage(false); // Reset error visibility on new submission
    setShowSuccessMessage(false); // Reset success visibility on new submission
    try {
      await axios.put(`/api/services/${id}`, service);
      setShowSuccessMessage(true);
      setCountdown(3); // Start the countdown
      setErrorMessage(''); // Clear any existing error message
    } catch (error) {
      console.error('Failed to update service', error);
      setErrorMessage('Failed to update service. Please try again.');
      setShowErrorMessage(true); // Show error message
      setShowSuccessMessage(false); // Ensure success message is not shown
      setCountdown(3); // Start the countdown for the error message too
    }
  };

  if (error) return <div>Failed to load the service.</div>;
  if (!service) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h2>Edit Service</h2>
      {showSuccessMessage && (
        <div className={styles.successMessage}>Sikeres módosítás. Újra lehet frissíteni {countdown} másodperc múlva.</div>
      )}
      {showErrorMessage && (
        <div className={styles.errorMessage}>{errorMessage} {countdown}</div>
      )}

      <label htmlFor="name" className={styles.label}>Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={service.name}
        onChange={handleChange}
        className={styles.input}
      />

      <label htmlFor="description" className={styles.label}>Description</label>
      <input
        type="text"
        id="description"
        name="description"
        value={service.description}
        onChange={handleChange}
        className={styles.input}
      />

    <div className={styles.checkboxContainer}>
      <label htmlFor="visible" className={styles.label}>Visible</label>
      <input
        type="checkbox"
        id="visible"
        name="visible"
        checked={service.visible}
        onChange={handleChange}
        className={styles.checkbox}
      />
    </div>
    <div className={styles.checkboxContainer}>
      <label htmlFor="maxSlots" className={styles.label}>Max Slots</label>
      <input
        type="number"
        id="maxSlots"
        name="maxSlots"
        value={service.maxSlots}
        onChange={handleChange}
        min="0"
        className={styles.input}
      />
        </div>
      {countdown <= 0 && (
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      )}
    </form>
  );
};

export default ServiceEditPage;
