'use strict';

describe('TagsAndRolesComparator', () => {
  let TagsAndRolesComparator;

  beforeEach(module('alephServices'));

  beforeEach(inject(_TagsAndRolesComparator_ => {
    TagsAndRolesComparator = _TagsAndRolesComparator_;
  }));

  describe('#compare when both left and right are undefined', () => {
    it('returns true', () => {
      expect(TagsAndRolesComparator.compare(undefined, undefined)).toBe(true);
    });
  });

  describe('#compare when only left is undefined', () => {
    it('returns false', () => {
      expect(TagsAndRolesComparator.compare(undefined, [])).toBe(false);
    });
  });

  describe('#compare when only right is undefined', () => {
    it('returns false', () => {
      expect(TagsAndRolesComparator.compare([], undefined)).toBe(false);
    });
  });

  describe('#compare when left and right are of different length', () => {
    it('returns false', () => {
      expect(TagsAndRolesComparator.compare([1, 2], [1, 2, 3])).toBe(false);
    });
  });

  describe('#compare when left and right have different contents', () => {
    it('returns false', () => {
      expect(TagsAndRolesComparator.compare(['meh', 'general'], [{ text: 'admin' }, { text: 'general' }])).toBe(false);
    });
  });

  describe('#compare when left and right have same contents and order does not matter', () => {
    it('returns true', () => {
      expect(TagsAndRolesComparator.compare(['admin', 'general'], [{ text: 'admin' }, { text: 'general' }])).toBe(true);
    });

    it('returns true', () => {
      expect(TagsAndRolesComparator.compare(['general', 'admin'], [{ text: 'admin' }, { text: 'general' }])).toBe(true);
    });
  });
});
