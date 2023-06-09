// import { Observable } from "rxjs";
// import { filter, map, combineLatestAll, every } from "rxjs/operators";
// let User = {
//   data: [
//     {
//       status: "Active",
//       age: 1,
//     },
//     {
//       status: "Active",
//       age: 2,
//     },
//     {
//       status: "InActive",
//       age: 19,
//     },
//     {
//       status: "Active",
//       age: 1,
//     },
//     {
//       status: "InActive",
//       age: 19,
//     },
//     {
//       status: "Active",
//       age: 10,
//     },
//   ],
// };

// const observable = new Observable((subscribe) => {
//   subscribe.next(User);
// }).pipe(
//   map((user) => {
//     return user.data;
//   }),
//   map((user) => {
//     return user.filter((data) => data.status === "Active");
//   }),
//   map((activeUser)=>{
//    let total=activeUser.reduce((acc,item)=>{
//       let sum=acc + item.age
//       return sum
//     },0)
//     return total /activeUser.length
//   }),
//   map((average)=>{
//     if(average < 18){
//       throw new Error("Its Not Taken")
//     }
//   })
// );

// let observer = {
//   next: (average) => {
//     console.log("My Observable Values", average);
//   },
//   error: (err) => {
//     console.log("Error",err);
//   },
// };

// observable.subscribe(observer);
