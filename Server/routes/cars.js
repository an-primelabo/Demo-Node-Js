const express = require('express');

const Forbidden = require('../common/forbidden');
const Responses = require('../common/responses');
const Utils = require('../common/utils');

const CarController = new (require('../controllers/cars'))();

const router = express.Router();

router.post('/find-all-cars', (req, res) => {
    // Find all cars
    CarController.findAll((error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        let cars = [];

        for (let car of result) {
            cars.push({
                id: car.car_id,
                name: car.car_name
            });
        }
        return res.send(Responses.success(cars));
    });
});

router.post('/find-by-car-id', (req, res) => {
    const id = req.body.id;

    // Check the car id
    const validate = Utils.checkNumber(id, 'Car id');

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Find by car id
    CarController.findById(id, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        return res.send(Responses.success({
            id: result[0].car_id,
            name: result[0].car_name
        }));
    });
});

router.post('/create-new-car', (req, res) => {
    const name = req.body.name;
    const nameCheck = {
        value: name,
        label: 'Car name'
    };

    // Check if the car name has a length of zero
    const validate = Utils.checkEmpty(nameCheck);

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Create new car
    CarController.create(name, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        return res.send(Responses.success({
            id: result[0].car_id,
            name: result[0].car_name
        }));
    });
});

router.post('/change-car-name', async(req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const nameCheck = {
        value: name,
        label: 'Car name'
    };

    // Check the car id
    let validate = Utils.checkNumber(id, 'Car id', Forbidden.cars);

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }

    // Check if the car name has a length of zero
    validate = Utils.checkEmpty(nameCheck);

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    const car = {
        id: id,
        name: name
    };

    // Update car name
    await CarController.update(car);

    return res.send(Responses.success({}));
});

router.post('/delete-car', async(req, res) => {
    const id = req.body.id;
    let validate;

    if (Array.isArray(id)) {
        // Check the array of car id
        validate = Utils.checkListNumber(id, 'Car id', Forbidden.cars);
    } else {
        // Check the car id
        validate = Utils.checkNumber(id, 'Car id', Forbidden.cars);
    }
    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Delete car
    await CarController.delete(id);

    return res.send(Responses.success({}));
});

module.exports = router;