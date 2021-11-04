import { authApi } from "./API";

export const payService = async (email, course_id) => {
  try {
    const res = await authApi.post('/pay/', { email, course_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const confirmPayService = async (course_id) => {
  try {
    const res = await authApi.post('/pay/confirm', { course_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const payHistoryService = async () => {
  try {
    const res = await authApi.post('/pay/history');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getChartTransactionDataService = async (year) => {
  try {
    const res = await authApi.post('/pay/transaction', { year });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getTeacherIncomeService = async (year) => {
  try {
    const res = await authApi.post('/pay/teacher-income', { year });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getTeacherCourseIncomeService = async () => {
  try {
    const res = await authApi.post('/pay/teacher-course-income', {});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getIncomeDataService = async () => {
  try {
    const res = await authApi.post('/pay/income');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getAllTransactionService = async (page) => {
  try {
    const res = await authApi.post('/pay/transactions', { page });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}