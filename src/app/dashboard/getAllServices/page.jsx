"use client"

import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const fetcher = url => axios.get(url).then(res => res.data);

const deleteService = async (id) => {
    await axios.delete(`/api/services/${id}`);
    mutate('/api/services'); // Revalidate data after deletion
};

const ServiceListing = () => {
    const { data, error } = useSWR('/api/services', fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    console.log(data)

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this service?');
        if (isConfirmed) {
            deleteService(id);
        }
    };

    // Új függvény a szolgáltatás szerkesztéséhez
    const handleEdit = (id) => {
        // Ez egy egyszerű átirányítás a szerkesztő oldalra az ID használatával
        // Megjegyzés: Ellenőrizd, hogy ez az útvonal megfelel-e az alkalmazásodnak
        window.location.href = `/dashboard/getAllServices/${id}`;
    };

    const getDayNames = (recurrenceDays) => {
        const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
    
        // Először rendezzük a napokat az indexük alapján, ha fordított sorrendet szeretnénk, akkor itt megfordítjuk a tömböt
        const sortedAndReversedDays = recurrenceDays.sort((a, b) => a - b)
    
        return sortedAndReversedDays
            .map(dayIndex => dayNames[dayIndex])
            .join(', ');
    };

    
    return (
        <div className='min-h'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Available From</th>
                        <th>Available To</th>
                        <th>Ismétlődés</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Publikus</th>
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
                            <td>{getDayNames(service.recurrenceDays)}</td>
                            <td>{service.startTime}</td>
                            <td>{service.endTime}</td>
                            <th>{service.visible ?  'Publikus' : 'Nem publikus'}</th>
                            <td>
                                {/* Basic Dropdown for Available Slots */}
                                <select>
                                    {Object.entries(service.availableSlotsPerDay).map(([date, slots]) => (
                                        <option key={date} value={date}>{date}: {slots} slots</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <Button variant="secondary" onClick={() => handleEdit(service._id)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(service._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ServiceListing;
