'use strict';

describe('Selection Tag Input', () => {
  let SelectionTagInput;
  let selectionTagInput;
  let items;

  beforeEach(module('alephServices'));

  beforeEach(inject(function (_SelectionTagInput_) {
    SelectionTagInput = _SelectionTagInput_;

    items = [
      { id: 1, tags: ['dream', 'weapon'] },
      { id: 2, tags: ['the', 'dream', 'weapon'] }
    ];

    selectionTagInput = new SelectionTagInput({
      items: items,
      itemField: 'tags'
    });
  }));

  describe('#add', () => {
    beforeEach(() => {
      selectionTagInput.add( { text: 'relaunch' } );
    });

    it('adds tag to the items', () => {
      expect(items[0]).toEqual( { id: 1, tags: ['relaunch', 'dream', 'weapon'] } );
      expect(items[1]).toEqual( { id: 2, tags: ['relaunch', 'the', 'dream', 'weapon'] } );
    });
  });

  describe('#remove', () => {
    beforeEach(() => {
      selectionTagInput.remove( { text: 'dream' } );
    });

    it('removes tag from the items', () => {
      expect(items[0]).toEqual( { id: 1, tags: ['weapon'] } );
      expect(items[1]).toEqual( { id: 2, tags: ['the', 'weapon'] } );
    });
  });

  describe('#onSelection', () => {
    beforeEach(() => {
      selectionTagInput.onSelection();
    });

    it('aggregates the tags from the items', () => {
      expect(selectionTagInput.selectedTags.length).toBe(3);
      expect(selectionTagInput.selectedTags).toContain('the');
      expect(selectionTagInput.selectedTags).toContain('dream');
      expect(selectionTagInput.selectedTags).toContain('weapon');
    });
  });
});
