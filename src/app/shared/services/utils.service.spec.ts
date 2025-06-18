import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UtilService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.com',
        'user@subdomain.example.com',
        'user@123.456.789.123'
      ];

      validEmails.forEach(email => {
        expect(service.isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        '@domain.com',
        'user@',
        'user@domain',
        'user@.com',
        'user@domain.',
        'user name@domain.com',
        'user@domain..com',
        'user@-domain.com',
        'user@domain.com-'
      ];

      invalidEmails.forEach(email => {
        expect(service.isValidEmail(email)).toBe(false);
      });
    });

    it('should handle empty string', () => {
      expect(service.isValidEmail('')).toBe(false);
    });

    it('should handle null or undefined', () => {
      expect(service.isValidEmail(null as any)).toBe(false);
      expect(service.isValidEmail(undefined as any)).toBe(false);
    });
  });
}); 