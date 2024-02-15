// import { supabase } from "../utils/supabaseClient";

// const sendMessageToSlack = async (messageData) => {
//   const response = await fetch('/api/slack', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(messageData),
//   });

//   if (response.ok) {
//     console.log("===data save success ===");
//   } else {
//     console.log("===data save error ===");
//   }
// };



// //모임 등록시 slack alram 
// export const alarmMeetingDatabaseChange = () => {
//   supabase
//     .channel("schema-db-changes")
//     .on(
//       "postgres_changes",
//       { event: "INSERT", schema: "public", table: "meeting" },
//       async (payload) => {
//         // console.log("payload: ", payload);
//         const meeting_date = payload?.new.meeting_date;
//         const name = payload?.new.name;
//         const birthYear = payload?.new.birthYear;
//         const email = payload?.new.email;
//         const activation = payload?.new.activation;
//         const location = payload?.new.location;
//         const founder = payload?.new.founder;
//         await sendMessageToSlack(
//           `출석/${meeting_date}/${name}/${birthYear}/${email}/activation: ${activation}/location:${location}/founder: ${founder}`
//         );
//       }
//     )
//     .subscribe();
// };


// //모임 등록시 slack alram 
// export const alarmUserDatabaseChange = async() => {
//    supabase.channel('custom-insert-channel')
//   .on(
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'user' },
//     async (payload) => {
//       // console.log("=====payload: ", payload);
//       const name = payload?.new.name;
//       const birthYear = payload?.new.birthYear;
//       const email = payload?.new.email;
//       await  sendMessageToSlack(
//         `회원등록/${name}/${birthYear}/${email}`
//       );
//     }
//   )
//   .subscribe()
// };




