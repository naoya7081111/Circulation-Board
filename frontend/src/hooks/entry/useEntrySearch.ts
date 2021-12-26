/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useCallback, useState } from "react"
import { useMessage } from "../useMessage";
import { Community } from "../../type/Community"

type Props = {
    id: number;
}

export const useEntrySearch = () => {

    const { showMessage } = useMessage();

    const [resultCommunity, setResultCommunity] = useState<Community | null>(null);
    const [ isPassword, setIsPassword ] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const entrySearch = useCallback((props: Props) => {
        const { id } = props;
        const data = {
            id: id,
        }
        setSearchLoading(true);

        axios.post('/api/entry/search', data).then((res) => {
            if(!res.data.success){
                setResultCommunity(null);
                showMessage({ title: res.data.message, status: 'error' });
            } else {
                const communityInfos = res.data.community[0];
                const communityInfo: Community | null = {
                    communityId: communityInfos.id,
                    communityName: communityInfos.communityname,
                    communityCreatedDate: communityInfos.createddate,
                    communityImageName: communityInfos.imagename,
                    communitySentence: communityInfos.sentence,
                    communityArea: communityInfos.area,
                    communitySite: communityInfos.site             
                };
                communityInfos.password === null ? setIsPassword(false) : setIsPassword(true);
                setResultCommunity(communityInfo);
                setSearchLoading(false);               
            }
        }).catch((error) => {
            console.log(error);
            setResultCommunity(null);
            setSearchLoading(false);
            showMessage({ title: 'エラーです(汗)', status: 'error' })
        });
    }, []);

    return { entrySearch, resultCommunity, setResultCommunity, isPassword, setIsPassword, searchLoading, setSearchLoading };
}