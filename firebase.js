const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const { from, mergeMap } = require("rxjs");
const app = express();

app.use(express());
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

const serviceAccount = require("./secret_key.json");
const { log } = require("firebase-functions/lib/logger");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let PORT = 5000;

// const getSpecificServiceProvider = async function () {
//   try {
//     const collection_Name = "services";
//     const title = "Landscape Designers";
//     new Promise((resolve, reject) => {
//       const query = admin
//         .firestore()
//         .collectionGroup(collection_Name)
//         .where("name", "==", title)
//         .limit(1)
//         .get()
//         .then((querySnapshot) => {
//           const detailsArray = [];
//           querySnapshot.forEach(async (doc) => {
//             // Access the document data
//             const professionalsId = doc.ref.parent.parent.id;

//             const userRef = admin
//               .firestore()
//               .collection("professional_details")
//               .doc(professionalsId);
//             const serviceData = doc.data();

//             const userPromise = await userRef.get().then((userDoc) => {
//               if (userDoc.exists) {
//                 const userData = userDoc.data();

//                 // Combine service data with user data
//                 const combinedData = {
//                   service: serviceData,
//                   user: userData,
//                 };
//                 //console.log(combinedData
//                 detailsArray.push(combinedData);
//               }
//             });
//           });
//           resolve(detailsArray);
//         })
//         .catch((error) => {
//           console.log("Error getting documents: ", error);
//         });
//     });
//   } catch (err) {}
// };

app.get("/find-recommended-services", async function (req, res) {
  const collection_Name = "services";
  const title = "Landscape Designers";
  let PROFESSIONA_DETAILS = "professional_details";
  //   new Promise((resolve, reject) => {
  const providers = await admin
    .firestore()
    .collectionGroup(collection_Name)
    .where("name", "==", title)
    .limit(1)
    .get();

  if (providers.empty) {
    return res.json({ details: [] });
  } else {
    let resultArray = providers.docs.map(async (doc) => {
      //here we got professional details Id
      const professional_details_id = doc.ref.parent.parent.id;
      const docRef = admin
        .firestore()
        .collection(PROFESSIONA_DETAILS)
        .doc(professional_details_id);
      // we need to fetch all details all sub collection Details also
      let professional_details = await docRef.get();
      //console.log("det", professional_details);
      if (professional_details.exists) {
        let doc_data = professional_details.data();
        const userRefernce = admin
          .firestore()
          .collection("users")
          .doc(doc_data.users_reference.id);

        //we need to fetch all sub collection data for showing images
        let sub_collections = await professional_details.ref.listCollections();

        const PromiseOfSubCollections = sub_collections.map(
          (sub_collection) => {
            //subcollectionData[sub_Name] = [];
            return sub_collection.get();
          }
        );

        Promise.all(PromiseOfSubCollections).then((promise) => {
          const subcollectionData = {};
          promise.forEach((snapShot) => {
            snapShot.docs.forEach((snap) => {
              const sub_Name = snap.ref.parent.id;
              if (subcollectionData[sub_Name]) {
                subcollectionData[sub_Name].push(snap.data());
              } else {
                subcollectionData[sub_Name] = [];
                subcollectionData[sub_Name].push(snap.data());
              }
              //   console.log(snap.ref.parent.id);
              //console.log("datas", snap.data());
            });
          });
          let userdetails = {
            ...subcollectionData,
            ...doc_data,
          };
          return userdetails;
          //   resultArray.push(userdetails);
        });
      }
    });
  }

  // .then(async (querySnapshot) => {
  //   const detailsArray = [];
  //   let data = await querySnapshot.docs.map(async (doc) => {
  //     // Access the document data
  //     const professionalsId = doc.ref.parent.parent.id;
  //     console.log(doc);
  //     const userRef = admin
  //       .firestore()
  //       .collection("professional_details")
  //       .doc(professionalsId);
  //     const serviceData = doc.data();
  //     const userPromise = await userRef.get();

  //     //   ((userDoc) => {
  //     if (userPromise.exists) {
  //       const userData = userPromise.data();

  //       // Combine service data with user data
  //       const combinedData = {
  //         service: serviceData,
  //         user: userData,
  //       };

  //       detailsArray.push(combinedData);
  //       return combinedData;
  //     }
  //     //   });
  //   });

  //   let dd = Promise.all(data);
  //   dd.then((data) => {});
  //   return res.json({ resp: { name: "adarshk" } });
  //   // resolve(detailsArray);
  //   //   })
  // });

  //let response = await getSpecificServiceProvider();
});

app.get("/fetch-details", (req, res) => {
  const userRefernceId = [
    "1ijghKCjRkfRM7pi3ELUTXQTGWI3",
    "1ijghKCjRkfRM7pi3ELUTXQTGWI3",
  ];
  const userRefernceId$ = from(userRefernceId)
    .pipe(
      //we can only pass observer through pipe
      mergeMap((userId) => {
        const userRef = admin.firestore().collection("users").doc(userId);
        return from(userRef.get()).pipe(
          mergeMap((userDoc) => {
            const professionalRef = userDoc.data().professional_details_ref;
              
            return from(professionalRef.get());
          })
        );
      })
    )
    .subscribe((pro_details) => {
      console.log(pro_details);
    });
});

app.listen(PORT, () => {
  console.log("SERVER COONECTED", PORT);
});
