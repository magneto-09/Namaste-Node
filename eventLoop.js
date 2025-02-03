// console.log("Start");

// setTimeout(() => {
//     console.log("Macrotask: setTimeout");
// }, 0);

// Promise.resolve()
//     .then(() => {
//         console.log("Microtask: Promise");
//     });

// (async () => {
//     console.log("Async function starts");
//     await new Promise((resolve) => setTimeout(resolve, 1000)); // Pauses here
//     console.log("Async function resumes");
// })();

// console.log("End");

setTimeout(() => {
    console.log("Timer callback");
  
    Promise.resolve().then(() => {
      console.log("Promise callback");
    });
  
    console.log("After promise in timer");
  }, 0);
  
  console.log("Synchronous code");
  
