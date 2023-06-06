import { Observable } from "rxjs";
import { filter, map, combineLatestAll, every } from "rxjs/operators";
let User = {
  data: [
    {
      status: "Active",
      age: 18,
    },
    {
      status: "Active",
      age: 20,
    },
    {
      status: "InActive",
      age: 19,
    },
    {
      status: "Active",
      age: 21,
    },
    {
      status: "InActive",
      age: 19,
    },
    {
      status: "Active",
      age: 40,
    },
  ],
};

const observable = new Observable((subscribe) => {
  subscribe.next(User);
}).pipe(
  map((user) => {
    return user.data;
  }),
  map((user) => {
    return user.filter((data) => data.status === "Active");
  })
);

let observer = {
  next: (value) => {
    console.log("My Observable Values", value);
  },
  error: (err) => {},
};

observable.subscribe(observer);
