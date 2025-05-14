"use client";

import { supabase } from "@/utils/supabase/client";

const handleSignIn = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    // No redirectTo needed - it will return to the current page
  });
};

// ToDo: Implement this in the server
// "use server";

// import { createClientForServer } from "@/utils/supabase/server";
// import { redirect } from "next/navigation";

// const mode = "DEV";

// const signInWith = (provider) => async () => {
//   const supabase = await createClientForServer();

//   let auth_callback_url;

//   if (mode === "DEV") {
//     auth_callback_url = `http://localhost:3000/api/v1/auth/callback`;
//   } else {
//     auth_callback_url = `https://fitness-five-mauve.vercel.app/auth/callback`;
//   }

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider,
//     options: {
//       redirectTo: auth_callback_url,
//     },
//   });

//   console.log(data);

//   if (error) {
//     console.log(error);
//   }

//   redirect(data.url);
// };

// const signinWithGoogle = signInWith("google");

// const signOut = async () => {
//   const supabase = await createClientForServer();
//   await supabase.auth.signOut();
// };

// export { signinWithGoogle, signOut };
