import { useCallback } from "react";
import { useMessage } from "../useMessage";

type Props = {
    cookies: string;
}

export const useDecodeCommunityJwt = () => {

    const { showMessage } = useMessage();

    const decodeCommunity = useCallback((props: Props) => {
        const { cookies } = props;

        const cookiesArray = cookies.split(';');
        const  community_cookies = cookiesArray.find(value => value.match(/community_token=/g));

        if(community_cookies === undefined){
            showMessage({ title: 'communityのcookieのエラーです', status: 'error' });
            return null;
        } else {
            const base64Url = community_cookies.split('.')[1];                             
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');    
            const decoded = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            
            const communityId: number = decoded.community[0].id;
            const communityName: string = decoded.community[0].communityname;
            const communityCreatedDate: Date = decoded.community[0].createddate;
            const communityImageName: string | null = decoded.community[0].imagename;
            const communitySentence: string | null = decoded.community[0].sentence;
            const communityArea: string | null = decoded.community[0].area;
            const communitySite: string | null = decoded.community[0].site;

            return {
                communityId: communityId,
                communityName: communityName,
                communityCreatedDate: communityCreatedDate,
                communityImageName: communityImageName,
                communitySentence: communitySentence,
                communityArea: communityArea,
                communitySite: communitySite
            }                
        }


    }, [showMessage]);
    return { decodeCommunity };
};
 // 参考：https://qiita.com/johnslith/items/d11f827f8b14913b4a28