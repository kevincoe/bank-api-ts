import request from 'supertest';
import { Express, Request, Response, NextFunction } from 'express';
import App from '../../app';
import * as commonMiddleware from '../common.middleware';
import { AppError } from '../../utils/error.utils';

describe('Common Middleware', () => {
  let app: App;
  
  beforeAll(() => {
    app = new App();
  });
  
  describe('validateJSON middleware', () => {
    it('should pass valid JSON', async () => {
      // Mock objects
      const mockRequest = {
        body: { validKey: 'validValue' },
        is: jest.fn().mockReturnValue(true)
      } as unknown as Request;
      
      const mockResponse = {} as Response;
      const mockNext = jest.fn() as unknown as NextFunction;
      
      // Call the middleware directly
      commonMiddleware.validateJSON(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith();
    });
    
    it('should handle JSON syntax errors', async () => {
      // Use supertest to test the integrated middleware
      const response = await request(app.app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{invalid json}')
        .expect(400);
        
      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('JSON inválido');
    });
  });
  
  describe('rateLimiter middleware', () => {
    it('should allow requests within rate limit', async () => {
      // Make multiple requests but stay under limit
      for (let i = 0; i < 5; i++) {
        await request(app.app)
          .get('/api/accounts')
          .expect(response => {
            expect(response.status).not.toBe(429);
          });
      }
    });
    
    it('should block requests exceeding rate limit', async () => {
      // Fix: Pass two separate arguments instead of one object
      // 2 = max requests, 1000 = time window in milliseconds
      const testLimiter = commonMiddleware.rateLimit(2, 1000);
      
      // Mock objects
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
      const mockNext = jest.fn() as unknown as NextFunction;
      const mockReq = { ip: '127.0.0.1' } as Request;
      
      // First two calls should pass
      testLimiter(mockReq, mockRes, mockNext);
      testLimiter(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(2);
      
      // Third call should be rate limited
      testLimiter(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });
  });
  
  describe('notFound middleware', () => {
    it('should pass AppError for unmatched routes', () => {
      const mockReq = { 
        originalUrl: '/non-existent-route' 
      } as Request;
      
      const mockRes = {} as Response;
      const mockNext = jest.fn() as unknown as NextFunction;
      
      commonMiddleware.notFound(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      // Use a safer way to check the error without using .mock property
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404
        })
      );
    });
  });
});