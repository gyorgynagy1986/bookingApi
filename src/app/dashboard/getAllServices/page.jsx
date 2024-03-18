"use client"

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

const fetcher = url => axios.get(url).then(res => res.data);

const deleteService = async (id) => {
    await axios.delete(`/api/services/${id}`);
    mutate('/api/services'); // Revalidate data after deletion
};

const ServiceListing = () => {
    const { data, error } = useSWR('/api/services', fetcher);
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const handleDelete = (id) => {
        setSelectedService(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        await deleteService(selectedService);
        setShowModal(false);
        setSelectedService(null); // Reset selection
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Available From</th>
                        <th>Available To</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Available Slots Per Day</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.services.map((service, index) => (
                        <tr key={service._id}>
                            <td>{service.name}</td>
                            <td>{service.description}</td>
                            <td>{moment(service.availableFrom).format('YYYY-MM-DD')}</td>
                            <td>{moment(service.availableTo).format('YYYY-MM-DD')}</td>
                            <td>{service.startTime}</td>
                            <td>{service.endTime}</td>
                            <td>
                                {/* Basic Dropdown for Available Slots */}
                                <select>
                                    {Object.entries(service.availableSlotsPerDay).map(([date, slots]) => (
                                        <option key={date} value={date}>{date}: {slots} slots</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(service._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this service?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ServiceListing;

