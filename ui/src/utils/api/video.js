import { authApi } from "./API";

export const uploadVideo = async (chapterId, videoName, file, duration) => {
  try {
    const bodyForm = new FormData();
    bodyForm.append('chapter_id', chapterId);
    bodyForm.append('video_name', videoName);
    bodyForm.append('file', file);
    bodyForm.append('duration', duration);
    const res = await authApi.post('/chapter/upload-video', bodyForm, {headers: {'Content-Type': 'multipart/form-data'}});
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const getListVideoService = async (chapter_id) => {
  try {
    const res = await authApi.post('/chapter/videos', { chapter_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const viewVideoService = async (filename) => {
  try {
    const res = await authApi.post('/chapter/view-video', { filename });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const moveUpVideoService = async (video_id) => {
  try {
    const res = await authApi.post('/chapter/move-video-up', { video_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}

export const moveDownVideoService = async (video_id) => {
  try {
    const res = await authApi.post('/chapter/move-video-down', { video_id });
    return { res: res.data, err: null };
  } catch (error) {
    if (error?.response?.data?.error) {
      return { res: null, err: error.response.data.error };
    }
    return { res: null, err: "Something went wrong" };
  }
}
