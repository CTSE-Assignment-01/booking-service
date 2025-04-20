const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const mongoose = require('mongoose');
const Booking = require('../models/booking.model');
const Train = require('../models/train.model');
const User = require('../models/user.model');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

describe('Booking Routes', () => {
    let user, train, token;
    beforeAll(async () => {
        await User.deleteMany();
        await Train.deleteMany();
        // Create a user
        user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            phoneNumber: '33222243434',
            nic: 'ABC122336',
            password: 'pas2sdsws33ord123', // Make sure to provide a password
        });

        train = await Train.create({
            name: 'Express Train',
            fromLocation: 'City A',
            toLocation: 'City B',
            date: new Date('2024-04-12'),
            departureTime: '09:00 AM',
            arrivalTime: '12:00 PM',
            class: 'First Class',
            totalSeats: 100,
            availableSeats: 100,
        });

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token)
    }, 50000);
    afterAll(async () => {
        // Disconnect from the MongoDB database after all tests are done
        await mongoose.connection.close();
    });

    afterEach(async () => {
        // Clean up the database after each test
        await Booking.deleteMany();
    });

    
    describe('POST /bookings', () => {
        test('should create a new booking', async () => {
            // const loginResponse = { token: '' };
            // sinon.stub(request(app), 'post').withArgs('/bookings/').returns(loginResponse);

            // Mock data for the new booking
            const newBookingData = {
                passengerFirstName: 'John',
                passengerLastName: 'Doe',
                bookedBy: user._id, // Replace with the actual user ID
                gender: 'Male',
                nicOrPassport: 'ABC123456',
                mobileNumber: '1234567890',
                trainDetails: {
                    trainId: train._id, // Replace with the actual train ID
                    departureDate: '2024-04-12',
                    departureTime: '09:00 AM',
                },
                tickets: {
                    adults: 2,
                    children: 1,
                    infants: 0,
                },
                totalPrice: 1500,
            };

            // Send a POST request to create the new booking
            const response = await request(app)
                .post('/bookings')
                .set('Authorization', `Bearer ${token}`)
                .send(newBookingData);

            // Check if the response status code is 201 (Created)
            expect(response.statusCode).toBe(201);

            // Check if the response body matches the expected booking data
            expect(response.body.passengerFirstName).toBe(newBookingData.passengerFirstName);
            expect(response.body.passengerLastName).toBe(newBookingData.passengerLastName);
            // Add more assertions for other fields as needed

            // Check if the booking is saved in the database
            const savedBooking = await Booking.findOne({ nicOrPassport: newBookingData.nicOrPassport });
            expect(savedBooking).toBeTruthy();
            expect(savedBooking.passengerFirstName).toBe(newBookingData.passengerFirstName);
        });
    });

    describe('GET /bookings', () => {
        test('should retrieve bookings', async () => {
            const response = await request(app)
                .get('/bookings')
                .set('Authorization', `Bearer ${token}`);

            // Check if the response status code is 200 (Created)
            expect(response.statusCode).toBe(200);

        });
    });

    describe('PUT /bookings/:id', () => {
        test('should update an existing booking', async () => {
            // Create a new booking
            const newBooking = await Booking.create({
                passengerFirstName: 'Jane',
                passengerLastName: 'Doe',
                bookedBy: user._id,
                gender: 'Female',
                nicOrPassport: 'DEF654321',
                mobileNumber: '9876543210',
                trainDetails: {
                    trainId: train._id,
                    departureDate: '2024-04-12',
                    departureTime: '09:00 AM',
                },
                tickets: {
                    adults: 1,
                    children: 0,
                    infants: 0,
                },
                totalPrice: 750,
            });
    
            // Updated data for the booking
            const updatedBookingData = {
                passengerFirstName: 'UpdatedFirstName',
                // Add other fields to update as needed
            };
    
            // Send a PUT request to update the booking
            const response = await request(app)
                .put(`/bookings/${newBooking._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedBookingData);
    
            // Check if the response status code is 200 (OK)
            expect(response.statusCode).toBe(200);
    
            // Check if the response body matches the updated booking data
            expect(response.body.passengerFirstName).toBe(updatedBookingData.passengerFirstName);
            // Add more assertions for other fields as needed
    
            // Check if the booking is updated in the database
            const updatedBooking = await Booking.findById(newBooking._id);
            expect(updatedBooking).toBeTruthy();
            expect(updatedBooking.passengerFirstName).toBe(updatedBookingData.passengerFirstName);
            // Add more assertions for other fields as needed
        });
    });
    

    describe('DELETE /bookings/:id', () => {
        test('should delete an existing booking', async () => {
            // Create a new booking
            const newBooking = await Booking.create({
                passengerFirstName: 'Jane',
                passengerLastName: 'Doe',
                bookedBy: user._id,
                gender: 'Female',
                nicOrPassport: 'DEF654321',
                mobileNumber: '9876543210',
                trainDetails: {
                    trainId: train._id,
                    departureDate: '2024-04-12',
                    departureTime: '09:00 AM',
                },
                tickets: {
                    adults: 1,
                    children: 0,
                    infants: 0,
                },
                totalPrice: 750,
            });
    
            // Send a DELETE request to delete the booking
            const response = await request(app)
                .delete(`/bookings/${newBooking._id}`)
                .set('Authorization', `Bearer ${token}`);
    
            // Check if the response status code is 204 (No Content)
            expect(response.statusCode).toBe(204);
    
            // Check if the booking is deleted from the database
            const deletedBooking = await Booking.findById(newBooking._id);
            expect(deletedBooking).toBeNull();
        });
    });
    

    



});


