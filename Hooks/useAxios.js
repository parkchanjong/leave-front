import { useState } from "react";
import axios from "axios";

const useAxios = (props = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const request = async args => {
    setLoading(true);

    let axiosArgs = args;

    axiosArgs = {
      ...args,
      url: `http://localhost:8000${args.url}`
    };

    try {
      const { data } = await axios(axiosArgs);
      setResponse(data);
      setLoading(false);

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    loading,
    request,
    response,
    error
  };
};

export default useAxios;
