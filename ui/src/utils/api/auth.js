import api from "./API";

export const signInService = async (email, password) => {
  try {
    const res = await api.post('/auth/signin', { email, password });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const signUpService = async (email, password, first_name, last_name) => {
  try {
    const res = await api.post('/auth/signup', { email, password, first_name, last_name });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const verifyService = async (code) => {
  try {
    const res = await api.post('/auth/verify', { code });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}
