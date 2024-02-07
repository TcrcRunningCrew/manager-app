import { supabase } from "@/utils/supabaseClient";

export const findUserByAccountId = async (accountId: string) => {
  try {
    const res = await supabase
      .from("user")
      .select("*")
      .eq("accountId", accountId);

      // console.log('res: ', res.data);
    // if (res.error) return Promise.reject(res.error
    return Promise.resolve(res.data);
  } catch (e: unknown) {
    return Promise.reject(e);
  }
};

export const findUser = async (email: string, name: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .eq("name", name);

  if (error) return Promise.reject(error);
  return Promise.resolve(data);
};

export const signup = async (user: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) => {
  const { name, birthYear, email, accountId } = user;

  const { error, data } = await supabase
    .from("user")
    .insert([{ name, birthYear, email, accountId, activation: true }])
    .single();

  if (error) return Promise.reject(error);
  return Promise.resolve(data);
};

export const updateuUserInfo = async (user: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) => {
  const { name, birthYear, email, accountId } = user;

  const { error, data } = await supabase
    .from("user")
    .update({ birthYear: birthYear })
    .eq("accountId", accountId)
    .eq("email", email);

  if (error) return Promise.reject(error);
  return Promise.resolve(data);
};

export const insertMeeting = async (
  accountId: string,
  name: string,
  email: string,
  birthYear: string,
  meeting_date: Date,
  activation: string,
  location: string,
  founder: boolean
) => {
  const { data, error } = await supabase
    .from("meeting")
    .insert(
      {
        accountId,
        name,
        email,
        birthYear,
        meeting_date,
        activation,
        location,
        founder,
      },
    )
    .select()
    // console.log('====1231===error: ', error);
    // console.log('====1231===data: ', data);

  if (error) return Promise.reject(error);
  return Promise.resolve(data);
};
