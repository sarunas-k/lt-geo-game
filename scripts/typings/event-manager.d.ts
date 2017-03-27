interface IMessage {
    subscribe(callback: (payload?: any) => void): number;
    unSubscribe(id: number): void;
    notify(payload?: any): void;
}
