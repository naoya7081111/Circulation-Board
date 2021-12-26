import axios from "axios"
import { useCallback } from "react"
import { Community } from "../type/Community";
import { useLoginCommunity } from "./context/useLoginCommunity";
import { useDecodeCommunityJwt } from "./decoded/useDecodeCommunityJwt";
import { useMessage } from "./useMessage";

type Props = {
    name: string;
    sentence: string;
    area: string;
    site: string;
}

export const useUpdateCommunity = () => {

    const { showMessage } = useMessage();
    const { decodeCommunity } = useDecodeCommunityJwt();
    const { setLoginCommunity } = useLoginCommunity();

    const updateCommunity = useCallback((props: Props) => {

        const { name, sentence, area, site } = props;
        const data = new FormData();
        data.append('name', name);
        data.append('sentence', sentence);
        data.append('area', area);
        data.append('site', site);

        axios.post('/api/update/community', data).then((res) => {
            if(!res.data.success){
                showMessage({ title: '失敗です',  status: "error"});
            } else {
                const cookies = document.cookie;
                const decoded = decodeCommunity({ cookies });
                if(decoded){
                    const communityInfo: Community | null = decoded;
                    setLoginCommunity(communityInfo);
                } else {
                    showMessage({ title: res.data.message,  status: "error"});
                }
            }           
        }).catch((error) => {
            console.log(error);
            showMessage({ title: "更新に失敗しました",  status: "error"});
        })
    }, [showMessage, setLoginCommunity, decodeCommunity]) 
    return { updateCommunity };
}