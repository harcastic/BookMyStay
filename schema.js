import Joi from 'joi';

export const listSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        image : {
            filename : Joi.string().required(),
           url : Joi.string().required(),
        },
        price : Joi.number().required().min(0),
        location : Joi.string().required(),
        country : Joi.string().required()
    }).required()
})

export const revSchema = Joi.object({
    review : Joi.object({
        comment : Joi.string().required(),
        rating : Joi.number().required().min(1).max(5)
    }).required() 
});
