
import { supabase } from "../utils/supabaseClient";

export const findmeetingByDate = async (
    startDay: string,
    endDay: string
    ) => {
  
    const { data, error } = await supabase
    .from("meeting")
    .select("name, birthYear, location, founder")
    .gte("meeting_date", startDay)
    .lt("meeting_date", endDay);

    if (error) return Promise.reject(error);
    return Promise.resolve(data);
};
