export class JobSchedulerImpl {

  debug = false;

  jobIdList: number[] = [];

  registerJob(job: Job){
    let taskId = setInterval(()=>{
      if (this.debug) {
        console.log(`${new Date().toISOString()} JobSchedulerImpl job trigger: ${job.name}.`);
      }
      job.task();
    }, job.timeoutMs);
    this.jobIdList.push(taskId);
  }

  cancelAllJobs(){
    this.jobIdList.forEach(id=>clearInterval(id));
    this.jobIdList.splice(0);
  }

}

class Singleton {
  static value: JobSchedulerImpl;
}

export function JobScheduler(debug = false) {
  if (!Singleton.value) {
    Singleton.value = new JobSchedulerImpl();
  }
  Singleton.value.debug = debug;
  return Singleton.value;
}

export interface Job {
  name: string;
  task: ()=>any;
  timeoutMs: number;
}