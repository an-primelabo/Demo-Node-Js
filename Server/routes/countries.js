const express = require('express');
const validator = require('validator');

const Forbidden = require('../common/forbidden');
const Responses = require('../common/responses');
const Utils = require('../common/utils');

const CountryController = new (require('../controllers/countries'))();

const router = express.Router();

router.post('/find-all-countries', (req, res) => {
    // Find all countries
    CountryController.findAll((error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        let countries = [];

        for (let country of result) {
            countries.push({
                id: country.country_id,
                name: country.country_name,
                code: country.country_code
            });
        }
        return res.send(Responses.success(countries));
    });
});

router.post('/find-by-country-id', (req, res) => {
    const id = req.body.id;

    // Check the country id
    const validate = Utils.checkNumber(id, 'Country id');

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Find by country id
    CountryController.findById(id, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        return res.send(Responses.success({
            id: result[0].country_id,
            name: result[0].country_name,
            code: result[0].country_code
        }));
    });
});

router.post('/create-new-country', (req, res) => {
    const name = req.body.name;
    const code = req.body.code;

    // Check if the name has a length of zero
    if (validator.isEmpty(name)) {
        return res.send(Responses.error('Country name is empty !'));
    }
    // Check if the code has a length of zero
    if (validator.isEmpty(code)) {
        return res.send(Responses.error('Country code is empty !'));
    }
    const country = {
        name: name,
        code: code
    };

    // Create new country
    CountryController.create(country, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        return res.send(Responses.success({
            id: result[0].country_id,
            name: result[0].country_name,
            code: result[0].country_code
        }));
    });
});

router.post('/update-country', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const code = req.body.code;

    // Check the country id
    const validate = Utils.checkNumber(id, 'Country id', Forbidden.countries);

    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Check if the name has a length of zero
    if (validator.isEmpty(name)) {
        return res.send(Responses.error('Country name is empty !'));
    }
    // Check if the code has a length of zero
    if (validator.isEmpty(code)) {
        return res.send(Responses.error('Country code is empty !'));
    }
    const country = {
        id: id,
        name: name,
        code: code
    };

    // Update country
    CountryController.update(country, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        return res.send(Responses.success(country));
    });
});

router.post('/delete-country', (req, res) => {
    const id = req.body.id;
    let validate;

    if (Array.isArray(id)) {
        // Check the array of country id
        validate = Utils.checkListNumber(id, 'Country id', Forbidden.countries);
    } else {
        // Check the country id
        validate = Utils.checkNumber(id, 'Country id', Forbidden.countries);
    }
    if (validate.error) {
        return res.send(Responses.error(validate.message));
    }
    // Delete country
    CountryController.delete(id, (error, result) => {
        if (error) {
            return res.send(Responses.error(error));
        }
        if (result.length === 0) {
            return res.send(Responses.empty());
        }
        return res.send(Responses.success({}));
    });
});

module.exports = router;