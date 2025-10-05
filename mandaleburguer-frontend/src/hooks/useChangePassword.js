import { useState } from "react";
import { changeUserPassword } from "../services/user";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const changePassword = async (data) => {
    setLoading(true);
    setErrors({});
    try {
      const res = await changeUserPassword(data);
      setLoading(false);
      return res;
    } catch (err) {
      setErrors(err);
      setLoading(false);
      throw err;
    }
  };

  return { changePassword, loading, errors };
};
