/// <reference path="typings/event-manager.d.ts" />
/// <reference path="modal-manager.ts" />

module Game {

    export class EventManager {
        private _messages: any;
     
        constructor () {
            this._messages = {};
        }
     
        subscribe(message: string, callback: (payload?: any) => void ) {
            var msg: IMessage;            
            msg = this._messages[message] ||
                <IMessage>(this._messages[message] = new Message(message));
                           
            return msg.subscribe(callback);                        
        }
            
        unSubscribe(message: string, token: number) {            
            if (this._messages[message]) {
                (<IMessage>(this._messages[message])).unSubscribe(token);
            }
        }
     
        publish(message: string, payload?: any) {
            if (this._messages[message]) {
                (<IMessage>(this._messages[message])).notify(payload);
            }
        }
    }

    class Message implements IMessage {
     
        private _subscriptions: Subscription[];
        private _nextId: number;
     
        constructor (public message: string) {
            this._subscriptions = [];
            this._nextId = 0;
        }
     
        public subscribe(callback: (payload?: any) => void) {
            var subscription = new Subscription(this._nextId++, callback);
            this._subscriptions[subscription.id] = subscription;
            return subscription.id;
        }
     
        public unSubscribe(id: number) {
            this._subscriptions[id] = undefined;                        
        }
     
        public notify(payload?: any) {
            var index;
            for (index = 0; index < this._subscriptions.length; index++) {
                if (this._subscriptions[index]) {
                    this._subscriptions[index].callback(payload);
                }
            }
        }
    }
    
    class Subscription {
        constructor (            
            public id: number, 
            public callback: (payload?: any) => void) {
        }        
    }

}

var eventManager: Game.EventManager = new Game.EventManager();