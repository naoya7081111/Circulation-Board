/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useCallback } from "react";
import { CommunityMember } from "../../type/CommunityMember";
import { CommunityMembersSource } from "../../type/CommunityMembersSource";
import { useCommunityMembers } from "../context/useCommunityMembers";

export const useMembersGet = () => {

    const { setCommunityMembers } = useCommunityMembers();

    const membersGet = useCallback(() => {

        axios.get('/api/member').then((res) => {
            const membersSource = res.data.members;
            const membersInfo: Array<CommunityMember> = membersSource.map((member: CommunityMembersSource) => (
                {
                    userId: member.id,
                    userName: member.username,
                    userImageName: member.imagename,
                    entryDate: member.entrydate,
                    withDrawalDate: member.withdrawaldate,
                    communityId: member.communityid,
                    isHost: member.host,
                    sentence: member.sentence,
                    area: member.area,
                    site: member.site
                }
            ))
            setCommunityMembers(membersInfo);
            return;
        }).catch((error) => {
            console.log(error);
            return;
        })
    }, []);
    return {membersGet};
}