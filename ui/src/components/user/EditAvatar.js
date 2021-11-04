import { useContext, useRef, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import { uploadAvatarService } from "../../utils/api/user";
import { useDispatch, useSelector } from "react-redux";
import { GlobalContext } from "@contexts/ContextProvider";
import { getUserDetail } from "../../redux/reducers/user/actions";

const EditAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [isShowCropModal, setIsShowCropModal] = useState(false)
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const { action } = useContext(GlobalContext);

  const handleFileUpload = async (event) => {
    const base64 = await getBase64(event);
    setAvatar(base64);
    setIsShowCropModal(true);
  };

  const getBase64 = (event) => {
    return new Promise((resolve, _) => {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file.type.startsWith("image")) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
            resolve(reader.result);
          }
        }
      }
    })
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { err } = await uploadAvatarService(avatar);
    if (err) return action.pushAlert("error", err)
    dispatch(getUserDetail());  
    return action.pushAlert("success", "Successfully");
  };

  const avatarImage = () => {
    if (user.avatar) return <img className="upload-image" src={`https://leeminhung.space/api/image/${user.avatar}`} alt="avatar" />
    return <div className="empty-image" />
  }

  return (
    <form onSubmit={onSubmit} className="edit-avatar-form">
      <ModalCropImage image={avatar} show={isShowCropModal} onHide={() => setIsShowCropModal(false)} onCrop={setAvatar} />
      <p className="title">Avatar</p>
      <div className="mb-4 d-flex flex-column align-items-center">
        {avatar ? <img src={avatar} className="upload-image" /> : avatarImage() }
        <input ref={inputRef} type="file" onChange={handleFileUpload} accept="image/*" style={{ display: "none" }} />
        <Button variant="outline-primary" size="sm" onClick={() => inputRef.current.click()}>Upload Image</Button>
      </div>
      <div className="button-wrapper d-flex justify-content-end pt-4">
        <Button disabled={!avatar} type="submit">Save</Button>
      </div>
    </form>
  );
}

const ModalCropImage = ({ image, show, onHide, onCrop }) => {
  const cropperRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixel, setCropPixel] = useState(null);

  const { action } = useContext(GlobalContext);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCropPixel(croppedAreaPixels);
  };

  const cropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(image,cropPixel,0)
      onCrop(croppedImage);
      onHide();
    } catch (e) {
      action.pushAlert("error", "Cannot crop image");
    }
  }, [cropPixel])

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton={true}>Crop Image</Modal.Header>
      <Modal.Body style={{ height: 300 }}>
        <Cropper
          ref={cropperRef}
          style={{ containerStyle: { height: 300, backgroundColor: "white" } }}
          image={image}
          aspect={1}
          zoom={zoom}
          crop={crop}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={cropImage}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditAvatar;
