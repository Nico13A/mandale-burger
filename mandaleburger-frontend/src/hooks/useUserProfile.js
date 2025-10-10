import { useState } from "react";
import { updateUserProfile } from "../services/user";

export const useUserProfile = () => {
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const updateProfile = async (data) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await updateUserProfile(data);
      setLoading(false);
      return res;
    } catch (err) {
      setErrors(err);
      setLoading(false);
      throw err;
    }
  };

  return { updateProfile, loading, errors };
};
