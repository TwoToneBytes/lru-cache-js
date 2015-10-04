describe('lru-cache', function () {
    var LruCache = require('../src/lru-cache'),
        _ = require('lodash');

    function givenFullCacheOfSize(cacheSize) {
        var lruCache = new LruCache(cacheSize);

        _.range(1, cacheSize + 1)
            .forEach(function (n) {
                lruCache.put(n.toString(), n);
            });

        return lruCache;
    }

    it('should only keep the last `n` in memory', function () {
        var CACHE_SIZE = 3,
            lruCache = givenFullCacheOfSize(CACHE_SIZE);

        lruCache.put('4', 4);

        expect(lruCache.size).toBe(CACHE_SIZE);
    });


    it('should return removed entries when the cache limit is hit', function () {
        var CACHE_SIZE = 3,
            lruCache = givenFullCacheOfSize(CACHE_SIZE);

        expect(lruCache.put('4', 4)).toEqual(jasmine.objectContaining({value: 1}));
        expect(lruCache.put('5', 5)).toEqual(jasmine.objectContaining({value: 2}));
        expect(lruCache.put('6', 6)).toEqual(jasmine.objectContaining({value: 3}));
    });

    it('should move most recently-used entry to the tail', function () {
        var CACHE_SIZE = 5,
            lruCache = givenFullCacheOfSize(CACHE_SIZE);

        lruCache.get('1');
        lruCache.get('2');
        lruCache.get('3');

        expect(lruCache.tail).toEqual(jasmine.objectContaining({value: 3}));
        expect(lruCache.tail.older).toEqual(jasmine.objectContaining({value: 2}));
        expect(lruCache.tail.older.older).toEqual(jasmine.objectContaining({value: 1}));
    });
});