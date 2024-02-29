import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router();

// 카테고리 등록
router.post('/categories', async (req, res, next) => {
    try {
        const { name } = req.body;

        // body를 입력받지 못한 경우 400 에러
        if (!name) {
            return res.status(400).json({ error: '데이터 형식이 올바르지 않습니다' });
        }

        // 카테고리 생성
        const category = await prisma.categories.create({
            data: {
                name,
                order: (await prisma.categories.count()) + 1, // 현재 카테고리의 개수 + 1을 order 값으로 사용
            }, //  현재까지 데이터베이스에 저장된 카테고리의 개수를 반환
        });

        return res.status(201).json({ message: '카테고리를 등록하였습니다' });
    } catch (error) {
        console.error('카테고리 생성 중 오류:', error);
        return res.status(500).json({ error: '카테고리를 생성하는 중에 오류가 발생했습니다.' });
    }
});

/** 카테고리 전체 목록 조회 API **/
router.get('/categories', async (req, res, next) => {
    try {
        // Prisma를 사용하여 모든 카테고리 조회
        const categories = await prisma.categories.findMany({
            // order를 기준으로 정렬
            orderBy: { order: 'asc' },
            // id, name, order 필드만 선택
            select: { categoryId: true, name: true, order: true },
        });

        // 조회된 카테고리 응답
        return res.status(200).json({ data: categories });
    } catch (error) {
        console.error('카테고리 조회 중 오류:', error);
        return res.status(500).json({ error: '카테고리를 조회하는 중에 오류가 발생했습니다.' });
    }
});

// 카테고리 삭제 API
router.delete('/categories/:categoryId', async (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    const category = await prisma.categories.findFirst({ where: { categoryId: +categoryId } });
    if (!category) {
        return res.status(404).json({ message: '존재하지 않는 카테고리입니다.' });
    }

    await prisma.categories.delete({ where: { category: +categoryId } });
    return res.status(200).json({ data: '카테고리 정보를 삭제하였습니다.' });
});

export default router;
