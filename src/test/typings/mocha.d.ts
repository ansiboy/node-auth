declare module 'assert' {

}
declare function describe(text: string, callback: () => void);
declare function it(msg: string, callback: (done: (err?: any) => void) => void);