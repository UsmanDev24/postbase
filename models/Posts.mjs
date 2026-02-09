import EventEmitter from "events";
     

export class AbstractPostsStore extends EventEmitter {
    async update(key, title, body, autherId) { }
    async create(key, title, body, autherId) { }
    async read(key) { }
    async destroy(key) { }
    async keylist() { }
    async count() { }
    emitCreated(post) { this.emit('postcreated', post); }
    emitUpdated(post) { this.emit('postupdated', post); }
    emitDestroyed(key) { this.emit('postdestroyed', key);} 
}