import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 메뉴 등록 API
router.post('/categories/:categoryId/menus', async (req, res, next) => {
    const { categoryId } = req.params;
    const { name, description, image, price } = req.body;

    if (!categoryId || !name || !description || !image || !price) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const category = await prisma.categories.findFirst({ where: { categoryId: +categoryId } });
    if (!category) {
        return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
    }

    const menu = await prisma.menus.create({
        data: {
            name: name,
            description: description,
            image: image,
            price: price,
            order: (await prisma.categories.count()) + 1,
            categoryId: +categoryId,
        },
    });

    if (price <= 0) {
        return res.status(400).json({ message: '메뉴 가격은 0보다 작을 수 없습니다.' });
    }
    return res.status(201).json({ message: '메뉴를 등록하였습니다.' });
});

// 카테고리별 메뉴 조회 API
router.get('/categories/:categoryId/menus', async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await prisma.categories.findFirst({ where: { categoryId: +categoryId } });
    if (!categoryId) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    if (!category) {
        return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
    }
    const menus = await prisma.menus.findMany({
        where: { categoryId: +categoryId },
        select: {
            menuId: true,
            name: true,
            image: true,
            price: true,
            order: true,
            status: true,
        },
        orderBy: {
            order: 'desc',
        },
    });
    return res.status(200).json({ data: menus });
});

export default router;
