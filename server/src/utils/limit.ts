export class ConcurrencyLimiter {
    private queue: (() => Promise<any>)[] = [];
    private runningTasks = 0;

    constructor(private limit: number) { }

    async addTask<T>(task: () => Promise<T>): Promise<T> {
        if (this.runningTasks >= this.limit) {
            await new Promise<void>(resolve => this.queue.push(() => {
                resolve();
                return Promise.resolve();
            }));
        }

        this.runningTasks++;

        try {
            return await task();
        } finally {
            this.runningTasks--;
            if (this.queue.length > 0) {
                const nextTask = this.queue.shift();
                nextTask();
            }
        }
    }
}