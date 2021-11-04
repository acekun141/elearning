import { authApi } from "./API";

export const ratingService = async (course_id, value) => {
  try {
    const res = await authApi.post('/rate/', { course_id, value });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getRateService = async (course_id) => {
  try {
    const res = await authApi.post('/rate/get-user-rate', { course_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const commentService = async (course_id, content) => {
  try {
    const res = await authApi.post('/rate/comment', { course_id, content });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getCourseCommentService = async (course_id, page) => {
  try {
    const res = await authApi.post('/rate/course-comment', { course_id, page });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const deleteCommentService = async (comment_id) => {
  try {
    const res = await authApi.post('/rate/delete-comment', { comment_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}