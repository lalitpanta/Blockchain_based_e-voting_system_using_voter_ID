const Bull = require('bull'); 
const queue = new Bull('voteQueue');


console.log('Test script is running!');


const exampleAsyncJob = async () => {
    console.log('Adding job to queue...');


    await queue.add({ candidateId: 1 });

    console.log('Job added to queue!');
};

queue.process(async (job) => {
    console.log('Processing job for candidateId:', job.data.candidateId);
 
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Job completed!');
});


exampleAsyncJob();

console.log("successfull");