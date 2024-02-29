import joi from 'joi';

export const createMenuSchema = joi.object({
    name: joi.string().min(1).max(10).required().messages({
        'string.empty': '제목을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 10글자를 초과할 수 없습니다.',
    }),
    description: joi.string().min(1).max(50).required().messages({
        'string.empty': '내용을 입력해주세요.',
        'string.min': '제목은 최소 1글자 이상이어야 합니다.',
        'string.max': '제목은 최대 50글자를 초과할 수 없습니다.',
    }),
    image: joi.string().min(1).max(200).required().messages({}),
    price: joi.number().min(0).required().messages({
        'number.base': '메뉴 가격은 0보다 작을 수 없습니다.',
    }),
});
