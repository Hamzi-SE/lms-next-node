import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
    videoUrl: string;
    title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: "",
    });

    useEffect(() => {
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER_URL + "courses/get-vdo-cipher-otp"}`, {
                videoId: videoUrl,
            })
            .then((res) => {
                setVideoData(res.data.data);
            });
    }, [videoUrl]);

    return (
        <div style={{ paddingTop: "41%" }} className="relative">
            {videoData?.otp && videoData?.playbackInfo !== "" && (
                <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}&player=M25RRGTQmA169a3U`}
                    allowFullScreen={true}
                    allow="encrypted-media"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "90%",
                        height: "100%",
                        maxWidth: "100%",
                        border: 0,
                    }}
                ></iframe>
            )}
        </div>
    );
};

export default CoursePlayer;
