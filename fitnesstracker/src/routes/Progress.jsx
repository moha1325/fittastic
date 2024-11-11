import "./static/Progress.modules.css"
import { useState, useRef, useEffect } from "react"
import { useLoaderData } from 'react-router-dom';


// useful links used here
// https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
// https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia 
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API 

export default function ProgressComp(){
    const imgs = useLoaderData()
    console.log(imgs)
    let image_arr = []

    for(let i = 0; i < imgs.length; i++){
        image_arr.push(imgs[i].img_data)
    }
    console.log(image_arr)
    // all images stored here
    const [images, setImages] = useState(image_arr)


    const[is_images, setIsImages] = useState(image_arr.length > 0)
    console.log(image_arr.length > 0)
    console.log(is_images)

    // for some conditional rendering
    const [takePicture, setTakePicture] = useState(false)

    // for accessing the video and canvas 
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // will represent the current captured image, important for conditional rendering for retake scenario
    const [capturedImage, setCapturedImage] = useState(null)

    // will use to stop the video completely upon submission or taking a picture
    const[videostream, setVideoStream] = useState(null)


    // conditional upon takePicture becoming true and captured image becoming null (so either initial picture or retake)
    useEffect(()=>{
        if(takePicture && !capturedImage){
            // get the video by setting constraints 
            navigator.mediaDevices.getUserMedia({video: true}).then((stream) =>{
                // once you get the media stream object stream 
                // first get the video object and set it to the stream
                let the_video = videoRef.current
                the_video.srcObject = stream
                the_video.play()
                setVideoStream(stream)
            }).catch(error=>{
                console.log("Failed to get webcam")
            })
        }
    }, [takePicture, capturedImage])

    // handle take picture button getting pressed
    function handleTakePicture(){
        // get current video and canvas
        let canvas = canvasRef.current
        let video = videoRef.current

        // set canvas to same size as video
        canvas.width = video.videoWidth 
        canvas.height = video.videoHeight 

        // get the canvas to show a snapshot of the image
        canvas.getContext("2d").drawImage(video, 0, 0)

        // get the image data and convert to base64
        let theCapturedImage = canvas.toDataURL("image/png")
        setCapturedImage(theCapturedImage);

        // stop the camera
        stopVideoStream();
    }

    // stop the video stream
    function stopVideoStream(){
        let stream = videostream
        if(stream){
            // basically stop the media tracks associated with the stream
            // for stopping the camera
            stream.getTracks().forEach(track => track.stop())
            setVideoStream(null)
        }
    }

    async function handleStopPicture(event){
        let submitted = false
        if(event.target.id === "submitter"){
            submitted = true
        }
        // stop video stream and set states
        stopVideoStream()
        setTakePicture(false)
        setCapturedImage(null)
        
        if(submitted){
            // send image to backend

            if(!capturedImage){
                return
            }

            let to_send = {
                img_data: capturedImage
            }

            let result = await fetch('/api/addImage', {
                method: 'POST', 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(to_send)
            })



            if(result.ok){
                console.log("Hit the ok after sending image")
                // render page again with new image included
                let temp = [...images]
                temp.unshift(capturedImage)
                setImages(temp)
                setTakePicture(false)
                setCapturedImage(null)
                setIsImages(true)

                return "Success"
            }

            else{
                console.log(result)
                return "Failure"
            }

        }

        setTakePicture(false)
        setCapturedImage(null)

    }

    async function deleteImage(event){

        let to_delete = {
            img_data: event.target.id
        }

        let result = await fetch('/api/deleteImage', {
            method: 'DELETE', 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(to_delete)
        })

        if(result.ok){
            let temp = [...images]
            let index_to_delete = temp.indexOf(event.target.id)
            temp.splice(index_to_delete, 1)
            setImages(temp)
            setIsImages(images.length - 1 > 0)

            return "Success"
        }

        else{
            return "Failure"
        }

    }


    
    return (
            <>
            {
                !takePicture 
                ?
                (<div className="topcontainer">
                {
                    images.map((img, idx)=>(
                        <div className="photo_container">
                            <img src={img} alt="fitness" />
                            <button id={img} onClick={deleteImage}> Delete Image </button>
                        </div>
                    ))
                }
                
                <div className="plusbutton_container">
                    
                    {
                        is_images
                        ?
                        <button id="plus_button" onClick={() => setTakePicture(true)}> Add Photo <br></br> + </button>
                        :
                        <button id="noimageyet" className="noimageyet" onClick={() => setTakePicture(true)}> Add Photo <br></br> + </button>
                    }
                    
                </div>
                </div>)

                :
                
                !capturedImage 
                ? 
                (<div className="videocontainer">
                    <video ref={videoRef} autoPlay></video>
                    <canvas ref={canvasRef} style={{display: "none"}}></canvas>
                    <button onClick={handleTakePicture}> Take Image </button>
                    <button onClick={handleStopPicture}> Stop Image </button>
                </div>)
                :
                (
                    <div className="videocontainer">
                        <img src={capturedImage} alt="ImageCaptured"/>
                        <button onClick={()=>setCapturedImage(null)}> Retake Image </button>
                        <button id="submitter" onClick={handleStopPicture}> Submit Image </button>
                    </div>
                )
            }
            </>
    )
}