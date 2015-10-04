'use strict';

/**
 * Creates a new with a certain size.
 * @param maxSize
 * @constructor
 */
function LruCache(maxSize) {
    if (maxSize < 3) {
        throw new Error('Cache size must be at least 3!');
    }

    /**
     * The current size of the cache.
     * @type {number}
     */
    this.size = 0;

    /**
     * The maximum size of the cache.
     */
    this.maxSize = maxSize;

    this.head = this.tail = null;

    /**
     * Hashmap for O(1) retrieval.
     * @type {null}
     * @private
     */
    this._map = Object.create(null);
}


LruCache.prototype.put = function (key, value) {
    var entry = new CacheEntry(key, value);

    this._map[key] = entry;

    if (this.tail) {
        this.tail.newer = entry;
        entry.older = this.tail;
    }
    else {
        this.head = entry;
    }

    this.tail = entry;

    if (this.size >= this.maxSize) {
        return this.removeLeastRecentUsedEntry();
    }
    else {
        this.size++;
    }
};

LruCache.prototype.removeLeastRecentUsedEntry = function () {
    var currentHead = this.head;
    if (currentHead) {
        if (currentHead.newer) {
            currentHead.newer.older = null;
            this.head = currentHead.newer;
        }

        currentHead.newer = currentHead.older = null;

        // TODO: Make this WeakMap where implemented:
        delete this._map[currentHead.key];

        return currentHead;
    }

    return null;
};

LruCache.prototype.get = function (key) {
    var entry = this._map[key];
    if (!entry) {
        return null;
    }

    if (entry === this.tail) {
        return entry;
    }

    if (entry.newer) {
        if (entry === this.head) {
            this.head = entry.newer;
        }
        entry.newer.older = entry.older;
    }

    if (entry.older) {
        entry.older.newer = entry.newer;
    }

    entry.newer = null;
    entry.older = this.tail;

    if (this.tail) {
        this.tail.newer = entry;
    }

    this.tail = entry;

    return entry.value;
};

function CacheEntry(key, value) {
    this.key = key;
    this.value = value;
    this.newer = this.older = null;
}

module.exports = LruCache;