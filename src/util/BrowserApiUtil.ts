import type { ILocalStorage } from "@/model/html/ILocalStorage";

export class BrowserApiUtil {

  static getLocalStorage(): ILocalStorage {
    return localStorage; // built-in object from browser API
  }

  static createTimerJob(task: ()=>Promise<any>, 
  jobName: string, timeoutMs: number): number
  {
    let job = setTimeout(()=>{
      task().catch(err=>{
        console.error(`error in TimerJob[${jobName}]`, err);
      });
    }, timeoutMs);
    return <number><any>job;
  }

  static removeTimerJob(jobId: number) {
    clearTimeout(jobId);
  }

  static createRepeatedTimerJob(task: ()=>Promise<any>, 
  jobName: string, timeoutMs: number): number
  {
    let job = setInterval(()=>{
      task().catch(err=>{
        console.error(`error in TimerJob[${jobName}]`, err);
      });
    }, timeoutMs);
    return <number><any>job;
  }

  static removeRepeatedTimerJob(jobId: number) {
    clearInterval(jobId);
  }

}
