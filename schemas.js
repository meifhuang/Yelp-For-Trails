
const Joi = require('joi');

module.exports.trailSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    difficulty: Joi.string().required(),
    location: Joi.string().required(),
    distance: Joi.number().required().min(0)
}).required()
