import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
    localStorage.clear(); // Clear local storage before each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get item from local storage', () => {
    const key = 'testKey';
    const value = { name: 'John', age: 30 };

    service.setItem(key, value);

    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should return null for non-existing item', () => {
    const key = 'nonExistingKey';

    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toBeNull();
  });

  it('should remove item from local storage', () => {
    const key = 'testKey';
    const value = { name: 'John', age: 30 };

    service.setItem(key, value);
    service.removeItem(key);

    const retrievedValue = service.getItem(key);

    expect(retrievedValue).toBeNull();
  });

  it('should clear all items from local storage', () => {
    const key1 = 'key1';
    const value1 = { name: 'John', age: 30 };
    const key2 = 'key2';
    const value2 = { name: 'Jane', age: 25 };

    service.setItem(key1, value1);
    service.setItem(key2, value2);
    service.clear();

    const retrievedValue1 = service.getItem(key1);
    const retrievedValue2 = service.getItem(key2);

    expect(retrievedValue1).toBeNull();
    expect(retrievedValue2).toBeNull();
  });
});
