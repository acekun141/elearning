import AdminLayout from "@components/layout/AdminLayout";
import { useEffect, useState, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { deleteCourseInfoService, getCourseDetailService, statusCourseInfoService, uploadPreviewService } from "../../utils/api/course";
import { IoTimeOutline, IoColorWandOutline, IoTrashOutline, IoEyeOutline } from "react-icons/io5";
import ModalEditInfo from "../../components/course/ModalEditInfo";
import { currencyValue } from "../../utils/num";
import ModalConfirm from "../../components/course/ModalConfirm";
import { loadingOff, loadingOn } from "../../redux/reducers/common/action";
import { GlobalContext } from "@contexts/ContextProvider";
import Chapter from "../../components/course/Chapter";
import { Modal, Button } from "react-bootstrap";
import ViewPreviewModal from "../../components/course/ViewPreviewModal";

const CourseDetail = () => {
	const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [isShowConfirmStatus, setIsShowConfirmStatus] = useState(false);
	const [file, setFile] = useState();
  const [course, setCourse] = useState(null);
	const [duration, setDuration] = useState();
	const [url, setUrl] = useState();
	const [previewId, setPreviewId] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const { action } = useContext(GlobalContext);

	const inputRef = useRef(null);

  useEffect(() => {
    if (!id) {
      history.push("/")
      return;
    }
    handleGetDetail(id);
  }, [id])

  const handleGetDetail = async () => {
    setIsLoading(true)
    const { res, err } = await getCourseDetailService(id);
    if (err) {
      return history.push("/admin/dashboard")
    }
    setCourse(res.course);
		setIsOwner(res.owner);
    setIsLoading(false);
  };

  const editCallback = async () => {
    const { res, err } = await getCourseDetailService(id);
    if (!err) {
      setCourse(res.course);
    }
  }

  const handleDelete = async () => {
    dispatch(loadingOn());
    const { err } = await deleteCourseInfoService(course.id);
    dispatch(loadingOff());
    if (err) return action.pushAlert("error", err);
    history.push('/admin/courses')
  }

  const handleChangeStatus = async () => {
    dispatch(loadingOn());
    const { err } = await statusCourseInfoService(course.id, !course.active);
    dispatch(loadingOff());
    if (err) return action.pushAlert("error", err);
    setIsShowConfirmStatus(false);
    editCallback()
  }

	const onAddPreview = () => {
		inputRef.current.click();
	}

	const handleUploadFile = (event) => {
		if (event.target.files.length < 0 ) return;
		const file = event.target.files[0];
		if (file) {
			setFile(file);
			setUrl(URL.createObjectURL(file));
			handleGetDuration(URL.createObjectURL(file));
		}
	}

	const handleGetDuration = (result) => {
		var media = new Audio(result);
		media.onloadedmetadata = function() {
			setDuration(media.duration);
		}
	}

	const cancelUpload = () => {
		setFile(null);
		setUrl(null);
		setDuration(null);
	}

	const uploadPreview = async () => {
		dispatch(loadingOn());
		const {res, err} = await uploadPreviewService(course.id, file, duration);
		if (err) return action.pushAlert("error", err);
		cancelUpload();
		dispatch(loadingOff());
	};

  if (isLoading) return (
    <AdminLayout>
      <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center">
        <Loading />
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout isNoPadding={true}>
			<ViewPreviewModal video_id={previewId} onClose={() => setPreviewId(null)} />
			<ModalViewVideo url={url} onClose={cancelUpload} onSubmit={uploadPreview} />
      <ModalEditInfo
        callback={editCallback}
        isShow={isShowEdit}
        onHide={() => setIsShowEdit(false)}
        info={course}
      />
      <ModalConfirm
        content={`Do you want to delete this course?`}
        onConfirm={handleDelete}
        isShow={isShowConfirm}
        onHide={() => setIsShowConfirm(false)}
      />
      <ModalConfirm
        content={`Do you want to ${course.active ? "deactive" : "activate"}?`}
        onConfirm={handleChangeStatus}
        isShow={isShowConfirmStatus}
        onHide={() => setIsShowConfirmStatus(false)}
        confirmLabel={course.active ? "Deactive" : "Activate"}
      />
      <div className="admin-course-detail">
        <div className="admin-course-detail__cover-wrapper">
          <img src={`/api/image/${course.cover}`} alt="cover" />
        </div>
        <div className="admin-course-detail__content">
          <div className="admin-course-detail__name">
            <p>{course.name}</p>
            <button hidden={!isOwner} onClick={() => setIsShowEdit(true)}>
              <IoColorWandOutline />
            </button>
            <button hidden={!isOwner} className="delete" onClick={() => setIsShowConfirm(true)}>
              <IoTrashOutline />
            </button>
            <button
							hidden={!isOwner}
              onClick={() => setIsShowConfirmStatus(true)}
              className={`status-action ${
                course.active ? "deactive" : "activate"
              }`}
            >
              {course.active ? "Deactive" : "Activate"}
            </button>
          </div>
          <p className="admin-course-detail__category">{course.course_type}</p>
          <div className="admin-course-detail__user">
            <img src={`/api/image/${course.user_avatar}`} alt="avatar" />
            <p>{course.create_by}</p>
          </div>
          <p className="admin-course-detail__create_at">
            <IoTimeOutline />
            {course.create_at}
          </p>
          <p className="admin-course-detail__discount">
            <strong>Discount: </strong>
            {currencyValue(course.discount)}
          </p>
          <p className="admin-course-detail__price">
            <strong>Price: </strong>
            {currencyValue(course.price)}
          </p>
          <div className="mt-4">
            <h5 style={{ fontWeight: 700 }}>Description</h5>
            <p>{course.describe || "No description yet"}</p>
          </div>
          <div className="mt-4">
            <h5 style={{ fontWeight: 700 }}>Preview</h5>
						<input
							onChange={handleUploadFile}
							style={{display: "none"}}
							ref={inputRef}
							type="file"
							accept="video/*"
						/>
						{course.preview ? (
							<div className="preview-card">
								<img src={`/api/image/${course.cover}`} alt="course-detail" />
								<button onClick={() => setPreviewId(course.preview)}>
									<IoEyeOutline />
								</button>
								<button onClick={onAddPreview}>
									<IoColorWandOutline />
								</button>
							</div>
						) : (
							<button onClick={onAddPreview} className="add-preview-button">
								Add Preview
							</button>
						)}
          </div>
        </div>
        <Chapter isOwner={isOwner} courseId={course.id} />
      </div>
    </AdminLayout>
  );
}

const ModalViewVideo = ({url, onClose, onSubmit}) => {
	return (
		<Modal size="lg" show={!!url} onHide={onClose}>
			<Modal.Header closeButton={true}>
				<Modal.Title>Preview</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{url && (
					<video className="mb-2" style={{width: "100%", height: "auto"}} controls={true}>
						<source src={url} />
					</video>
				)}
				<div className="d-flex justify-content-end">
					<Button onClick={onClose} variant="dark" className="btn-lg-font-md mr-2-important" size="lg">Cancel</Button>
					<Button onClick={onSubmit} variant="primary" className="btn-lg-font-md" size="lg">Submit</Button>
				</div>
			</Modal.Body>
		</Modal>
	)
}

export default CourseDetail;
