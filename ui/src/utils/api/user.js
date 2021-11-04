import { authApi } from "./API";

export const userInfoService = async () => {
  try {
    const res = await authApi.post('/user/info');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const changePasswordService = async (current_password, new_password) => {
  try {
    const res = await authApi.post('/user/change-password', { current_password, new_password });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const uploadAvatarService = async (avatar) => {
  try {
    const res = await authApi.post('/user/upload-avatar', { avatar });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const updateInfoService = async (first_name, last_name, phone_number, describe) => {
  try {
    const res = await authApi.post('/user/update-info', { first_name, last_name, phone_number, describe: describe || "" });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getTeacherInfoService = async (id) => {
  try {
    const res = await authApi.post('/user/teacher-info', {id});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getUserCoursesService = async () => {
  try {
    const res = await authApi.post('/user/courses');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getAdminDashboardService = async () => {
  try {
    const res = await authApi.post('/user/dashboard');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getListUserService = async (page=1) => {
  try {
    const res = await authApi.post('/user/list-user', { page });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const topTeacherService = async () => {
  try {
    const res = await authApi.post('/user/top-teacher', {});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const topUserService = async () => {
  try {
    const res = await authApi.post('/user/top-user', {});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const editUserService = async (user_id, deactivate, role) => {
  try {
    const res = await authApi.post('/user/edit-user', { user_id, deactivate, role });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}