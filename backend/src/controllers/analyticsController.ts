import { Request, Response } from 'express';

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // Mock data for now
        const data = {
            sales: [100, 200, 300, 400],
            revenue: [500, 700, 800, 1200],
            topProducts: ['Shoes', 'Shirts', 'Bags']
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
