import { authApi } from "./API";

export const createCourseService = async (name, course_type, base64) => {
  try {
    const res = await authApi.post('/course/create', { name, course_type, base64 });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getAllCourseService = async (search, category) => {
  try {
    const res = await authApi.post('/course/all', { category, search });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getCourseDetailService = async (id) => {
  try {
    const res = await authApi.post('/course/detail', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const editCourseInfoService = async (id, name, course_type, discount, price, base64, describe) => {
  try {
    const res = await authApi.post('/course/edit', { id, name, course_type, discount, price, base64: base64 || "", describe });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const deleteCourseInfoService = async (id) => {
  try {
    const res = await authApi.post('/course/delete', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const statusCourseInfoService = async (id, status) => {
  try {
    const res = await authApi.post('/course/status', { id, status });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getAllChapterService = async (course_id) => {
  try {
    const res = await authApi.post('/chapter/all', { course_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const addChapterService = async (name, course_id) => {
  try {
    const res = await authApi.post('/chapter/create', { course_id, name });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const removeChapterService = async (id) => {
  try {
    const res = await authApi.post('/chapter/remove', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const moveUpChapterService = async (id) => {
  try {
    const res = await authApi.post('/chapter/move-up', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const moveDownChapterService = async (id) => {
  try {
    const res = await authApi.post('/chapter/move-down', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const deleteChapterService = async (id) => {
  try {
    const res = await authApi.post('/chapter/remove', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const editChapterService = async (id, name) => {
  try {
    const res = await authApi.post('/chapter/edit', { id, name });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const deleteVideoService = async (video_id) => {
  try {
    const res = await authApi.post('/chapter/delete-video', { video_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getLandingInfoService = async () => {
  try {
    const res = await authApi.post('/course/landing');
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const publicGetListCourseService = async (body={}) => {
  try {
    const res = await authApi.post('/course/list', { ...body });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const publicGetCourseDetailService = async (id) => {
  try {
    const res = await authApi.post('/course/public-detail', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getLearnCourseDetailService = async (id) => {
  try {
    const res = await authApi.post('/course/learn', { id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const uploadPreviewService = async (course_id, file, duration) => {
  try {
    const bodyForm = new FormData();
    bodyForm.append('course_id', course_id);
    bodyForm.append('file', file);
    bodyForm.append('duration', duration);
    const res = await authApi.post('/course/upload-preview', bodyForm, {headers: {'Content-Type': 'multipart/form-data'}});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}
